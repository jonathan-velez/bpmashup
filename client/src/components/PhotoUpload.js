import React, { useState, useRef, useEffect } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Form, Button, Progress, Header, Container, Image } from 'semantic-ui-react';
import Cropper from 'react-cropper';
import '../../node_modules/cropperjs/dist/cropper.css';

import { getUserId, getUserProfilePhotoUrl } from '../selectors';

const PhotoUpload = ({ uid, existingPhotoURL }) => {
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [fileInputImage, setFileInputImage] = useState({ fileExtension: '', fileType: '', imageData: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    console.log('existingPhotoURL changed', existingPhotoURL)
  }, [existingPhotoURL])

  const handleImageChange = (evt) => {
    evt.preventDefault();
    let files;
    if (evt.dataTransfer) {
      files = evt.dataTransfer.files;
    } else if (evt.target) {
      files = evt.target.files;
    }

    const file = files[0];
    const { name, type: fileType } = file;
    const fileExtension = name.substring(name.indexOf('.') + 1);

    const reader = new FileReader();
    reader.onload = () => {
      setFileInputImage({
        fileExtension,
        fileType,
        imageData: reader.result,
      });
    };
    reader.readAsDataURL(files[0]);
  }

  const cropperRef = useRef(null);

  if (!uid) {
    return <div>You must be logged in.</div> //TODO: pretty this up. Can we check if fb auth hasn't been initiated yet to prevent false positives?
  }

  const cropImage = () => {
    if (typeof cropperRef.current.getCroppedCanvas() === 'undefined') {
      return;
    }

    cropperRef.current.getCroppedCanvas().toBlob((blob) => {
      uploadImageToStorage(blob);
    }, 'image/jpeg', 0.60);
  }

  const setUserImageUrlToProfile = (photoURL) => {
    firebase.auth().currentUser.updateProfile({ photoURL });
  }

  const uploadImageToStorage = (imageData) => {
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const imageFileRef = storageRef.child(`images/user-profile-photos/${uid}/profile-photo.${fileInputImage.fileExtension}`);

    if (imageData instanceof Blob) {
      setPercentCompleted(0);
      const uploadTask = imageFileRef.put(imageData);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setPercentCompleted(progress);
      }, (error) => {
        console.log('error with upload', error);
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          setUserImageUrlToProfile(downloadURL);
        });
      });
    }
  }

  const zoomPhoto = (evt) => {
    console.log('zoom', evt.target.value);
    cropperRef.current.zoomTo(evt.target.value);
  }

  const clearCropperImage = () => {
    setFileInputImage({});
  }

  // TODO: disable form while upload in progress
  return (
    <React.Fragment>
      <Header>Upload Profile Photo</Header>
      <Container style={{ width: '400px' }}>
        {editMode ?
          <>
            <Cropper
              src={fileInputImage.imageData || existingPhotoURL}
              ref={cropperRef}
              aspectRatio={4 / 4}
              style={{
                height: 400,
              }}
              guides
              viewMode={1}
              dragMode='move'
              background={false}
              zoomOnWheel={false}
              minCropBoxWidth={100}
              minCropBoxHeight={100}
            />
            <input
              type='range'
              min={-1}
              max={1}
              step='any'
              onChange={zoomPhoto}
            // value={0}
            />
            <Form encType="multipart/form-data">
              <input
                type='file'
                name='photoFile'
                accept="image/*"
                onChange={handleImageChange} // TODO: check if a new image was selected, otherwise don't resetState
              />
              <input type='hidden' name='uid' value={uid} />
            </Form>
            {percentCompleted > 0 &&
              <Progress
                label='Upload progress'
                progress='percent'
                percent={percentCompleted}
                autoSuccess
              />
            }
            <Button onClick={cropImage} size='massive'>Crop Image</Button>
            <Button onClick={clearCropperImage}>Revert to original</Button>
          </>
          :
          <Image src={existingPhotoURL} />
        }
        <Button onClick={() => setEditMode(!editMode)}>Toggle Edit Mode</Button>
      </Container>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => {
  return {
    uid: getUserId(state), // TODO: Determine if we really need to connect to redux here, or should we use firebase.auth() ??
    existingPhotoURL: getUserProfilePhotoUrl(state),
  }
}

export default connect(mapStateToProps, null)(PhotoUpload);
