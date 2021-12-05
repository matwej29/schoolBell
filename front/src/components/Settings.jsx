import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FileChooser = () => {
  const [bells, setBells] = useState([]);
  const [soundForStart, setSoundForStart] = useState('');
  const [soundForEnd, setSoundForEnd] = useState('');
  const [selectedSounds, setSelectedSounds] = useState([]);

  useEffect(() => {
    (async () => {
      const settings = await (await fetch('/get_settings')).json();
      setSelectedSounds([settings.lessonStartSound, settings.lessonEndSound]);

      const filesList = await (await fetch('/fetch_file_list')).json();
      setBells(filesList);
    })();
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    fetch('/write_settings', {
      body: `{"lessonStartSound": "${soundForStart}", "lessonEndSound": "${soundForEnd}"}`, // возможно, это можно сделать лучше
      method: 'POST',
    }).catch((err) => alert(err));
  };

  return (
    <div className="card">
      <form onSubmit={submitForm} className="card-body input-group">
        <select
          className="form-select col"
          onChange={(e) => setSoundForStart(e.target.value)}
          defaultValue={selectedSounds[0]}
        >
          {bells.map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </select>
        <select
          className="form-select col"
          onChange={(e) => setSoundForEnd(e.target.value)}
          defaultValue={selectedSounds[1]}
        >
          {bells.map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </select>

        <input
          type="submit"
          className="btn btn-primary col-md-2 form-control"
        />
      </form>
    </div>
  );
};

const FileForm = () => {
  const [uploadFile, setUploadFile] = useState();
  const [fileName, setFileName] = useState('');

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
    <div className="card">
      <form onSubmit={submitForm} className="card-body input-group">
        <input
          type="text"
          onChange={(e) => setFileName(e.target.value)}
          placeholder="file name"
          className="form-control"
        />
        <input
          type="file"
          onChange={(e) => setUploadFile(e.target.files[0])}
          className="form-control"
        />
        <br />
        <input type="submit" className="btn btn-primary col-md-2" />
      </form>
    </div>
  );
};

const Settings = () => (
  <div className="container mt-2 w-100">
    <Link to="/schedule" className="btn btn-outline-info mb-3">
      Schedule
    </Link>
    <FileForm />
    <FileChooser />
  </div>
);

export default Settings;
