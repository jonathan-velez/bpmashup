import React, { useState, useRef, useEffect } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Form, Button, Progress, Image, Header, Container } from 'semantic-ui-react';
import Cropper from 'react-cropper';

import { getUserId } from '../selectors';

const PhotoUpload = ({ uid }) => {
  const [percentCompleted, setPercentCompleted] = useState(0);
  const [imagePath, setImagePath] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState({ fileExtension: '', fileType: '', imageData: '' });

  useEffect(() => {
    console.log('useEffect')
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
      // setImagePath(reader.result);
      setOriginalImage({
        fileExtension,
        fileType,
        imageData: reader.result,
      });
    };
    reader.readAsDataURL(files[0]);
  }

  const cropperRef = useRef(null);

  if (!uid) {
    return <div>You must be logged in.</div>
  }

  const cropImage = () => {
    if (typeof cropperRef.current.getCroppedCanvas() === 'undefined') {
      return;
    }

    cropperRef.current.getCroppedCanvas().toBlob((blob) => {
      uploadToFirebase(blob);
    }, 'image/jpeg', 0.60);
  }

  const uploadToFirebase = (imageData) => {
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const imageFileRef = storageRef.child(`images/user-profile-photos/${uid}/profile-photo.${originalImage.fileExtension}`);

    if (imageData instanceof Blob) {
      const uploadTask = imageFileRef.put(imageData);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log('Upload is ' + progress + '% done');
        setPercentCompleted(progress);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break
        }
      }, (error) => {
        console.log('error with upload', error);
      }, () => {
        // done
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          // set cropped image url, display new image
          console.log('File available at', downloadURL); 
        });
      });

      // imageFileRef.put(imageData).then(() => {
      //   console.log('blob uploaded!');
      // })
    } else {
      imageFileRef.putString(imageData, 'data_url', { contentType: originalImage.fileType }).then(() => {
        console.log('Image uploaded!');
      });
    }
  }

  const zoomPhoto = (evt) => {
    console.log('zoom', evt.target.value);
    cropperRef.current.zoomTo(evt.target.value);
  }

  // TODO: disable form while upload in progress
  return (
    <React.Fragment>
      <Header>Upload Profile Photo</Header>
      <Form encType="multipart/form-data">
        <input
          type='file'
          name='photoFile'
          accept="image/*"
          onSelect={(evt) => evt}
          onChange={handleImageChange} // TODO: check if a new image was selected, otherwise don't resetState
        />
        <input type='hidden' name='uid' value={uid} />
        {/* <Button type='submit'>Upload</Button> */}
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
      <Container style={{ width: '400px' }}>
        <Cropper
          src={originalImage.imageData}
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
        <Button onClick={cropImage} size='massive'>Crop Image</Button>
        <br />
        {croppedImage &&
          <>
            <Image
              src={croppedImage}
              centered
              size='big'
            />
            <Button onClick={uploadToFirebase} size='massive'>Upload to FB</Button>
          </>
        }
      </Container>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => {
  return {
    uid: getUserId(state),
  }
}

export default connect(mapStateToProps, null)(PhotoUpload);
