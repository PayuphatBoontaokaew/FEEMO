import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzJwQQ-c4E-VNnQpO2IFEL3Md_FWaozeU",
  authDomain: "feemo-1ee42.firebaseapp.com",
  projectId: "feemo-1ee42",
  storageBucket: "feemo-1ee42.appspot.com",
  messagingSenderId: "522961568014",
  appId: "1:522961568014:web:9518243494c129ddf2575f",
  measurementId: "G-7R8KCL411P"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const captureButton = document.getElementById('capture');
const retakeButton = document.getElementById('retake');
const uploadButton = document.getElementById('upload');
const confirmSaveButton = document.getElementById('confirmSave');


navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing camera:", err);
    alert("Could not access the camera.");
    
});


captureButton.addEventListener('click', () => {

  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL('image/png');
  photo.src = dataURL;
  photo.classList.remove('d-none');
  video.classList.add('d-none');
  retakeButton.classList.remove('d-none');
  uploadButton.classList.remove('d-none');
  captureButton.classList.add('d-none');

});


retakeButton.addEventListener('click', () => {

  video.classList.remove('d-none');
  photo.classList.add('d-none');
  retakeButton.classList.add('d-none');
  uploadButton.classList.add('d-none');
  captureButton.classList.remove('d-none');

});


confirmSaveButton.addEventListener('click', () => {

  const dataURL = canvas.toDataURL('image/png');
  const storageRef = ref(storage, 'images/photo.png');

  uploadString(storageRef, dataURL, 'data_url').then((snapshot) => {
    console.log('Uploaded a base64 string!');
    alert('Image uploaded successfully!');
  }).catch(error => {
    console.error('Error uploading image:', error);
    alert('Failed to upload image.');
  });
});
