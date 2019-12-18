import React, { useState, useRef, useEffect } from 'react';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { Form, Button, Progress, Header, Container, Image, Icon, Grid } from 'semantic-ui-react';
import Cropper from 'react-cropper';
import '../../node_modules/cropperjs/dist/cropper.css';

import { getUserId } from '../selectors';

const PhotoUpload = ({ uid, auth, profile, firebase }) => {
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [fileInputImage, setFileInputImage] = useState({ fileExtension: '', fileType: '', imageData: '' });
  const [editMode, setEditMode] = useState(false);
  const [zoomRatio, setZoomRatio] = useState(0);

  const cropperRef = useRef(null);
  const inputFileRef = useRef(null);

  useEffect(() => {
    const cropperRefCurrrent = cropperRef.current;
    if (cropperRefCurrrent){
    cropperRefCurrrent.addEventListener('ready', () => console.log('ready'), null);
    return (() => {
      cropperRefCurrrent.removeEventListener('ready', () => console.log('ready'), null);
    });
  }
  }, [cropperRef]);

  if (!auth.uid) {
    return <div>You must be logged in.</div> //TODO: pretty this up. Can we check if fb auth hasn't been initiated yet to prevent false positives?
  }

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

  const cropImage = () => {
    if (typeof cropperRef.current.getCroppedCanvas() === 'undefined') {
      return;
    }

    cropperRef.current.getCroppedCanvas().toBlob((blob) => {
      uploadImageToStorage(blob);
    }, 'image/jpeg', 0.60);
  }

  const setUserImageUrlToProfile = async (photoURL) => {
    await firebase.updateProfile({ photoURL });
    handleClearCropperImage();
    setEditMode(false);
  }

  const uploadImageToStorage = (imageData) => {
    const fbStorage = firebase.storage();
    const storageRef = fbStorage.ref();
    const imageFileRef = storageRef.child(`images/user-profile-photos/${uid}/profile-photo.${fileInputImage.fileExtension}`);

    if (imageData instanceof Blob) {
      setPercentCompleted(1);
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
    setZoomRatio(evt.target.value);
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
    setZoomRatio(0); // TODO: Combine resets into single fn - call when canceling or reverting
  }

  const handleInputFileClick = (evt) => {
    evt.preventDefault();
    inputFileRef.current.click();
  }

  const existingProfilePhoto = profile.photoURL;

  // TODO: disable form while upload in progress
  return (
    <React.Fragment>
      <Header>Upload Profile Photo</Header>
      <Container style={{ width: '400px' }} textAlign='center'>
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
              viewMode={1}
              dragMode='move'
              background={false}
              zoomOnWheel={false}
              minCropBoxWidth={100}
              minCropBoxHeight={100}
            />
            <Grid columns={3}>
              <Grid.Column width={2}>
                <Icon name='zoom-out' />
              </Grid.Column>
              <Grid.Column width={12}>
                <input
                  type='range'
                  min={0}
                  max={1}
                  step='any'
                  onChange={zoomPhoto}
                  value={zoomRatio}
                />
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name='zoom-in' />
              </Grid.Column>
            </Grid>
            <Form encType="multipart/form-data">
              <Button onClick={handleInputFileClick}>Choose File</Button>
              <input
                type='file'
                name='photoFile'
                className='hiddenFileInput'
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
            <Button onClick={cropImage} positive>Save</Button>
            {fileInputImage.imageData && <Button onClick={handleClearCropperImage} negative basic>Revert</Button>}
          </React.Fragment>
          :
          (existingProfilePhoto && <Image src={existingProfilePhoto} circular centered />)
        }
        <br />
        {!editMode ?
          <Button onClick={handleToggleEditMode}>Update photo</Button>
          :
          <><br /><a href='#' onClick={handleToggleEditMode}>Cancel</a></>
        }
      </Container>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => {
  return {
    uid: getUserId(state), // TODO: Determine if we really need to connect to redux here, or should we use firebase.auth() ??
  }
}

export default compose(
  firebaseConnect(),
  connect(
    ({ firebaseState: { auth, profile } }) => ({ auth, profile, ...mapStateToProps })
  )
)(PhotoUpload);
