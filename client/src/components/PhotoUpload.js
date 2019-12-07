import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Form, Button, Progress, Image, Header } from 'semantic-ui-react';
import Cropper from 'react-cropper';

import { API_PHOTO_UPLOAD } from '../constants/apiPaths';
import { getUserId } from '../selectors';

const PhotoUpload = ({ uid }) => {
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [imagePath, setImagePath] = useState(undefined);

  const resetState = () => {
    setPercentCompleted(0);
    setImagePath(undefined);
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    resetState();

    const { photoFile, uid } = evt.target;
    const { files } = photoFile;

    if (files.length === 0) {
      // TODO: Pretty this up
      return alert('no file')
    }

    const formData = new FormData();
    const fileObject = photoFile.files[0];
    formData.append('uid', uid.value);
    formData.append('photoFile', fileObject);

    const fileUploadResult = await axios({
      method: 'post',
      url: API_PHOTO_UPLOAD,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setPercentCompleted(percentCompleted);
      },
    })

    const { status, data } = fileUploadResult;
    if (status === 200) {
      // TODO: settimeout and dismiss progress bar
      setImagePath(data.filePath);
    }
  }
  const cropperRef = useRef(null);

  if (!uid) {
    return <div>You must be logged in.</div>
  }

  const _crop = () => {
    // image in dataUrl
    console.log(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
  }
  // TODO: disable form while upload in progress
  return (
    <React.Fragment>
      <Header>Upload Profile Photo</Header>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type='file'
          name='photoFile'
          accept="image/*"
          onSelect={(evt) => evt}
          onChange={resetState} // TODO: check if a new image was selected, otherwise don't resetState
        />
        <input type='hidden' name='uid' value={uid} />
        <Button type='submit'>Upload</Button>
      </Form>
      {percentCompleted > 0 &&
        <Progress
          label='Upload progress'
          progress='percent'
          percent={percentCompleted}
          autoSuccess
        />
      }
      {percentCompleted === 100 && imagePath &&
        <Image src={imagePath} centered size='big' />
      }
      <Cropper
        src={imagePath}
        ref={cropperRef}
        style={{
          height: 400,
          width: '100%',
          display: (percentCompleted === 100 && imagePath) ? 'block' : 'none',
        }}
        crop={_crop}
        guides

      />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    uid: getUserId(state),
  }
}

export default connect(mapStateToProps, null)(PhotoUpload);
