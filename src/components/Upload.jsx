import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import accessToken from '../base';

function Upload() {
    const filePicker = useRef(null);
    const [url, setUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [urlUpload, setUrlUpload] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [overWriteError, setOverWriteEror] = useState(null);
    const [overwrite, setOverwrite] = useState(false);

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
        setOverwrite(!overwrite)
    }

    const conversion = function (a) {
        return (a * 0.001).toFixed(1)
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
                    <ul>
                        <li>{`Название файла:${selectedFile.name}`}</li>
                        <li>{`Тип файла:${selectedFile.type}`}</li>
                        <li>{`Размер файла:${conversion(selectedFile.size)} кБ`}</li>
                    </ul>
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
            {error && (
                <div className='error'>
                    <h4>{error}</h4>
                </div>
            )}
            {
                urlUpload && (
                    <div className="UrlUpload">
                        <h3> Файл можно скачать по ссылке</h3>
                        {urlUpload}
                    </div>
                )
            }

        </>
    );
}

export default Upload;