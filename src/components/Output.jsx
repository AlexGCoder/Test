import React from 'react';

function Output({ urlUpload, error }) {

    return (
        <div>

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

        </div>
    );
}

export default Output;