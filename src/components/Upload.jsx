import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import accessToken from '../base';
import FileCard from './UI/FileCard';

function Upload({ setUrlUpload, setError }) {
    const filePicker = useRef(null);
    const [url, setUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [overwrite, setOverwrite] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [overWriteError, setOverWriteEror] = useState(null);


    useEffect(() => {
        setOverWriteEror(null);
        if (selectedFileName !== null) {
            axios(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=%myfiles11%${selectedFileName}&overwrite=${overwrite}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `OAuth ${accessToken}`,
                },
            })
                .then((res) => setUrl(res.data.href))
                .catch((e) => {
                    if (e.response.status === 409) {
                        setOverWriteEror('Ошибка, файл с таким именем уже есть!');
                    }
                    if (e.response.status === 404) {
                        setError('Ошибка, файл не найден!');
                    }
                })
        }
    }, [selectedFileName, overwrite]);

    const clickHandler = () => {
        filePicker.current.click();
    }
    const changeHandler = (e) => {
        setUrlUpload(false);
        setSelectedFile(e.target.files[0]);
        setSelectedFileName(e.target.files[0].name);
        setOverwrite(false);
    };

    const uploadHandler = () => {
        setOverWriteEror(null);
        if (selectedFile.size > 1e+9) {
            setError('файл слишком большой, выберите другой');
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);

        axios.put(url, formData)
            .then(() => (axios(`https://cloud-api.yandex.net/v1/disk/resources/download?path=%myfiles11%${selectedFileName}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `OAuth ${accessToken}`,
                },
            })
                .then((res) => setUrlUpload(res.data.href))
                .catch((e) => {
                    if (e.response.status === 500 || e.response.status === 503) {
                        setError('ошибка сервера, попробуйте повторить загрузку.!')
                    }
                })
                .finally(
                    setLoading(false),
                    setSelectedFile(null))))
    };

    const overwriteHandler = () => {
        setOverwrite(true)
    }



    return (
        <>
            <div>
                <button onClick={clickHandler}>Выбрать файл</button>
                <h5>Размер файла не должен превышать 1 гб</h5>
                <input className='hidden' type='file' onChange={changeHandler} ref={filePicker} />

            </div>
            {selectedFile && (
                <>
                    <FileCard selectedFile={selectedFile} />
                    <button onClick={uploadHandler}>Загрузить файл</button>
                </>
            )}
            {loading && (
                <div>
                    <h3> Loading ...</h3>
                </div>)}
            {overWriteError && (
                <div className='error'>
                    <h4>{overWriteError}</h4>
                    <input type='checkbox' onChange={overwriteHandler} />
                    <label>Если хотите перезаписать файл, то поставьте галочку и нажмите загрузить файл</label>
                </div>
            )
            }
        </>
    );
}

export default Upload;