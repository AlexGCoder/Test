import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Upload from './components/Upload';

function App() {
  const [url, setUrl] = useState(null);
  const accessToken = 'y0_AgAAAAA7jAWnAADLWwAAAADUilVasvtTB2MZTuuNE34JVpW-Q3tKlDw';

  useEffect(() => {
    axios('https://cloud-api.yandex.net/v1/disk/resources/upload?path=%myfiles01&overwrite=true', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `OAuth ${accessToken}`,
      },
    })
      .then((res) => setUrl(res.data.href))
      .catch(console.log);
  }, []);

  return (
    <div className='container'>
      <Upload url={url} accessToken={accessToken} />
    </div>
  );
}

export default App;
