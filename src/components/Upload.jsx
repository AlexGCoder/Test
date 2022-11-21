import React from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';

function Upload({ url, accessToken }) {
    const filePicker = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [urlUpload, setUrlUpload] = useState();

    const clickHandler = () => {
        filePicker.current.click();
    }
    const changeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadHandler = () => {
        if (!selectedFile) {
            alert('Пожалуйста выберите файл');
            return;
        } if (+selectedFile.size > 1e+9) {
            alert('файл слишком большой, выберите другой');
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        axios.put(url, formData)
            .then(() => setUploaded(!uploaded))
            .catch(console.log);
    };

    const linkDownload = () => {
        (axios('https://cloud-api.yandex.net/v1/disk/resources/download?path=%myfiles01&overwrite=true', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `OAuth ${accessToken}`,
            },
        })
            .then((res) => setUrlUpload(res.data.href))
            .catch(console.log));
    }

    return (
        <>
            <div>
                <button onClick={clickHandler}>Выбрать файл</button>
                <input className='hidden' type='file' onChange={changeHandler} ref={filePicker} />
                <button onClick={uploadHandler}>Загрузить файл</button>
            </div>
            {selectedFile && (
                <ul>
                    <li>{`Название файла:${selectedFile.name}`}</li>
                    <li>{`Тип файла:${selectedFile.type}`}</li>
                    <li>{`Размер файла:${+selectedFile.size}`}</li>
                </ul>
            )}
            {uploaded && (
                <button onClick={linkDownload}>Получить ссылку для скачивания</button>
            )}
            <div className="UrlUpload">
                {urlUpload}
            </div>
        </>
    );
}

export default Upload;