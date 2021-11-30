import React from 'react';
import { Link } from 'react-router-dom';

const fileChooser = () => {
  return (
    <>
      
    </>
  );
};

const FileForm = () => {
  const [uploadFile, setUploadFile] = React.useState();
  const [fileName, setFileName] = React.useState('');

  const submitForm = (event) => {
    event.preventDefault();

    const dataArray = new FormData();
    dataArray.append('file', uploadFile, fileName);

    fetch('/write_file', {
      body: dataArray,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
      method: 'POST',
    });
  };

  return (
    <div>
      <form onSubmit={submitForm}>
        <input
          type="text"
          onChange={(e) => setFileName(e.target.value)}
          placeholder="file name"
        />
        <br />
        <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} />
        <br />
        <input type="submit" />
      </form>
    </div>
  );
};

const Settings = () => (
  <>
    <Link to="/schedule" className="btn btn-secondary me-1">
      Schedule
    </Link>
    <FileForm />
  </>
);

export default Settings;
