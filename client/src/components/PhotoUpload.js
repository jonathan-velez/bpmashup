import React, { useState, useRef } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Button, Progress, Container, Image, Icon, Grid, Dimmer, Placeholder } from 'semantic-ui-react';
import Cropper from 'react-cropper';
import '../../node_modules/cropperjs/dist/cropper.css';

import { getUserId, getUserPhotoURL } from '../selectors';
import NameBadge from './NameBadge';

const PhotoUpload = ({ photoURL, uid }) => {
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [fileInputImage, setFileInputImage] = useState({ fileExtension: '', fileType: '', imageData: '' });
  const [editMode, setEditMode] = useState(false);
  const [zoomRatio, setZoomRatio] = useState(0);
  const [dimmerActive, setDimmerActive] = useState(false);

  const cropperRef = useRef(null);
  const inputFileRef = useRef(null);

  if (!uid) {
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

  const isCropperInitiated = () => {
    return typeof cropperRef && cropperRef.current && cropperRef.current.getCroppedCanvas() !== 'undefined';
  }

  const cropImage = () => {
    if (!isCropperInitiated) {
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

  const handleZoomPhoto = (evt) => {
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
    // TODO: Combine resets into single fn - call when canceling or reverting
    console.log('cropperRef.current', cropperRef.current)
    setZoomRatio(0);
    cropperRef.current.zoomTo(0);

    setEditMode(!editMode);
    setDimmerActive(false);
  }

  const handleInputFileClick = (evt) => {
    evt.preventDefault();
    inputFileRef.current.click();
  }

  const existingProfilePhoto = photoURL;

  // TODO: disable form while upload in progress
  return (
    <React.Fragment>
      <Container style={{ width: '200px' }} textAlign='center'>
        <Cropper
          src={fileInputImage.imageData || existingProfilePhoto}
          ref={cropperRef}
          aspectRatio={1 / 1}
          style={{
            height: 200,
            paddingBottom: 10,
            display: (editMode ? 'block' : 'none'),
            // className: (!editMode && 'screen-reader screen-reader-focusable')
          }}
          viewMode={2}
          dragMode='move'
          background
          zoomOnWheel={false}
          minCropBoxWidth={100}
          minCropBoxHeight={100}
          minContainerHeight={200}
          minContainerWidth={200}
        />
        {editMode &&
          <>
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
                  onChange={handleZoomPhoto}
                  value={zoomRatio}
                />
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name='zoom-in' />
              </Grid.Column>
            </Grid>
            <Button size='mini' onClick={handleInputFileClick}>Choose File</Button>
            <input
              type='file'
              name='photoFile'
              className='hiddenFileInput'
              accept="image/*"
              onChange={handleImageChange} // TODO: check if a new image was selected, otherwise don't resetState
              ref={inputFileRef}
            />
            <input type='hidden' name='uid' value={uid} />
            {percentCompleted > 0 &&
              <Progress
                label='Upload progress'
                progress='percent'
                percent={percentCompleted}
                autoSuccess
              />
            }
            <Button size='tiny' onClick={cropImage} positive>Save</Button>
          </>
        }
        {!editMode &&
          <Dimmer.Dimmable
            dimmed={dimmerActive}
            blurring
            onMouseEnter={() => setDimmerActive(true)}
            onMouseLeave={() => setDimmerActive(false)}
          >
            <Dimmer active={dimmerActive}>
              {isCropperInitiated() &&
                <Button size='tiny' onClick={handleToggleEditMode}>Edit</Button>
              }
            </Dimmer>
            {!existingProfilePhoto ?
              <Placeholder className='profilePhotoPlaceholder'>
                <Placeholder.Image />
              </Placeholder>
              :
              <Image src={existingProfilePhoto} circular centered width={200} height={200} />
            }
          </Dimmer.Dimmable>
        }
        {editMode &&
          <div>
            <a href='#' onClick={handleToggleEditMode}>Cancel</a>
          </div>
        }
        <NameBadge />
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    uid: getUserId(state),
    photoURL: getUserPhotoURL(state),
  }
}

export default connect(mapStateToProps, null)(PhotoUpload);
