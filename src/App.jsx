import { useState } from 'react';
import './App.css';
import Output from './components/Output';
import Upload from './components/Upload';


function App() {
  const [urlUpload, setUrlUpload] = useState();
  const [error, setError] = useState(null);

  return (
    <div className='container'>
      <Upload setUrlUpload={setUrlUpload} setError={setError} />
      <Output urlUpload={urlUpload} error={error} />
    </div>
  );
}

export default App;
