import React, {useState, useEffect, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios"
import {useDropzone} from 'react-dropzone'
import userEvent from "@testing-library/user-event";

const UserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const fetchUserProfiles = () => {
    axios.get("http://localhost:8080/api/v1/user-profile").then(res => {
      console.log(res);
      setUserProfiles(res.data)
    });
  }
  useEffect(() => {
    fetchUserProfiles();
  }, []);
  return userProfiles.map((userProfile, index) => {
    return (
        <div key={index}>
          {userProfile.userProfileId ? <img src={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`}/> : null}
          <br/>
          <br/>
          <h1>{userProfile.username}</h1>
          <p>{userProfile.userProfileId}</p>
          <Dropzone {...userProfile}/>
          {/*Above setting is the same as below*/}
          {/*<Dropzone userProfileId= userProfile.userProfileId />*/}
          <br/>
        </div>
    )
  })
};

function Dropzone({userProfileId}) {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    axios.post(
        `http://localhost:8080/api/v1/user-profile/${userProfileId}/image/upload`,
        formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(() => {
      console.log("file uploaded successfully");
    }).catch(err => {
      console.log(err);
    })
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
              <p>Drop the profile image here ...</p> :
              <p>Drag 'n' drop profile image here, or click to select profile
                image</p>
        }
      </div>
  )
}

function App() {
  return (
      <div className="App">
        <UserProfiles/>
      </div>
  );
}

export default App;
