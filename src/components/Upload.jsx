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

    useEffect(() => {
        setError(null);
        if (selectedFileName !== null) {
            axios(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=%myfiles11%${selectedFileName}&overwrite=false`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `OAuth ${accessToken}`,
                },
            })
                .then((res) => setUrl(res.data.href))
                .catch((e) => {
                    if (e.response.status === 409) {
                        setError('Ошибка, файл с таким именем уже есть!');
                    }
                }

                )
        }
    }, [selectedFileName]);

    const clickHandler = () => {
        filePicker.current.click();
    }
    const changeHandler = (e) => {
        setUrlUpload(false);
        setSelectedFile(e.target.files[0]);
        setSelectedFileName(e.target.files[0].name);
    };

    const uploadHandler = () => {
        setError(null);
        if (!selectedFile) {
            setError('Пожалуйста выберите файл');
            return;
        } if (+selectedFile.size > 1e+9) {
            setError('файл слишком большой, выберите другой');
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true)

        axios.put(url, formData)
            .then(() => (axios(`https://cloud-api.yandex.net/v1/disk/resources/download?path=%myfiles11%${selectedFileName}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `OAuth ${accessToken}`,
                },
            })
                .then((res) => setUrlUpload(res.data.href))
                .catch((e) => {
                    if (e.error === 'Request failed with status code 409') { setError('Файл с таким именем уже существует') }
                })
                .finally(setLoading(false))))
    };

    return (
        <>
            <div>
                <button onClick={clickHandler}>Выбрать файл</button>
                <input className='hidden' type='file' onChange={changeHandler} ref={filePicker} />

            </div>
            {selectedFile && (
                <>
                    <ul>
                        <li>{`Название файла:${selectedFile.name}`}</li>
                        <li>{`Тип файла:${selectedFile.type}`}</li>
                        <li>{`Размер файла:${+selectedFile.size}`}</li>
                    </ul>
                    <button onClick={uploadHandler}>Загрузить файл</button>
                </>
            )}
            {loading && (
                <div>
                    <h3> Loading ...</h3>
                </div>)}
            {error && (
                <div className='error'>
                    <h3>{error}</h3>
                </div>
            )}
            {urlUpload && (
                <div className="UrlUpload">
                    <h3> Файл можно скачать по ссылке</h3>
                    {urlUpload}
                </div>
            )}

        </>
    );
}

export default Upload;