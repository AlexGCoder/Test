import React from 'react';

function FileCard({ selectedFile }) {

    const conversion = function (a) {
        return (a * 0.001).toFixed(1)
    }

    return (
        <div>
            <ul>
                <li>{`Название файла:${selectedFile.name}`}</li>
                <li>{`Тип файла:${selectedFile.type}`}</li>
                <li>{`Размер файла:${conversion(selectedFile.size)} кБ`}</li>
            </ul>
        </div>
    );
}

export default FileCard;