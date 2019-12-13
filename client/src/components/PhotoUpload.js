import React, { useState, useRef, useEffect } from 'react';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import * as fb from 'firebase';
import { connect } from 'react-redux';
import { Form, Button, Progress, Header, Container, Image } from 'semantic-ui-react';
import Cropper from 'react-cropper';
import '../../node_modules/cropperjs/dist/cropper.css';

import { getUserId } from '../selectors';

const PhotoUpload = ({ uid, auth, profile, firebase }) => {
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [fileInputImage, setFileInputImage] = useState({ fileExtension: '', fileType: '', imageData: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    console.log('fb auth', fb.auth());
    console.log('auth', auth);
  })

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
  const inputFileRef = useRef(null);

  // if (!uid) {
  if (!auth.uid) {
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

  const setUserImageUrlToProfile = async (photoURL) => {
    // const a = fb.auth().currentUser.updateProfile({ photoURL });
    await firebase.updateProfile({ photoURL });
    handleClearCropperImage();
    setEditMode(false);
  }

  const uploadImageToStorage = (imageData) => {
    const fbStorage = firebase.storage();
    const storageRef = fbStorage.ref();
    const imageFileRef = storageRef.child(`images/user-profile-photos/${auth.uid}/profile-photo.${fileInputImage.fileExtension.toLowerCase()}`);

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
          setTimeout(() => setPercentCompleted(0), 1500);
        });
      });
    }
  }

  const zoomPhoto = (evt) => {
    console.log('zoom', evt.target.value);
    cropperRef.current.zoomTo(evt.target.value);
  }

  const handleClearCropperImage = () => {
    setFileInputImage({});
    clearInputFile();
  }

  const clearInputFile = () => {
    inputFileRef.current.value = '';
  }


  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  }

  const existingProfilePhoto = profile.photoURL //|| auth.photoURL;
  // console.log('existingProfilePhoto', existingProfilePhoto)
  console.log('profile.photoURL', profile.photoURL)
  console.log('auth.photoURL', auth.photoURL)

  // TODO: disable form while upload in progress
  return (
    <React.Fragment>
      <Header>Upload Profile Photo</Header>
      <Container style={{ width: '400px' }}>
        {editMode ?
          <React.Fragment>
            <Cropper
              src={fileInputImage.imageData || existingProfilePhoto}
              ref={cropperRef}
              aspectRatio={1 / 1}
              style={{
                height: 400,
                paddingBottom: 10,
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
              value={0}
            />
            <Form encType="multipart/form-data">
              <input
                type='file'
                name='photoFile'
                accept="image/*"
                onChange={handleImageChange} // TODO: check if a new image was selected, otherwise don't resetState
                ref={inputFileRef}
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
            <Button onClick={cropImage} size='massive'>Save</Button>
            {fileInputImage.imageData && <Button onClick={handleClearCropperImage}>Revert</Button>}
          </React.Fragment>
          :
          (existingProfilePhoto && <Image src={existingProfilePhoto} circular />)
        }
        <Button onClick={handleToggleEditMode}>{!editMode ? 'Choose new photo' : 'Cancel'}</Button>
      </Container>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => {
  return {
    uid: getUserId(state), // TODO: Determine if we really need to connect to redux here, or should we use firebase.auth() ??
  }
}

// export default connect(mapStateToProps, null)(PhotoUpload);
export default compose(
  firebaseConnect(),
  connect(
    ({ firebaseState: { auth, profile } }) => ({ auth, profile, ...mapStateToProps })
  )
)(PhotoUpload);
