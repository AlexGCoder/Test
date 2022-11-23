import { useEffect, useState } from 'react';
import './App.css';
import Upload from './components/Upload';


function App() {
  // const [url, setUrl] = useState(null);


  // useEffect(() => {
  //   axios('https://cloud-api.yandex.net/v1/disk/resources/upload?path=%myfiles01&overwrite=true', {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `OAuth ${accessToken}`,
  //     },
  //   })
  //     .then((res) => setUrl(res.data.href))
  //     .catch(console.log);
  // }, []); 

  return (
    <div className='container'>
      <Upload />
    </div>
  );
}

export default App;
