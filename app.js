import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzJwQQ-c4E-VNnQpO2IFEL3Md_FWaozeU",
  authDomain: "feemo-1ee42.firebaseapp.com",
  projectId: "feemo-1ee42",
  storageBucket: "feemo-1ee42.appspot.com",
  messagingSenderId: "522961568014",
  appId: "1:522961568014:web:9518243494c129ddf2575f",
  measurementId: "G-7R8KCL411P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const captureButton = document.getElementById('capture');
    const retakeButton = document.getElementById('retake');
    const uploadButton = document.getElementById('upload');
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const confirmSave = document.getElementById('confirmSave');

    let stream = null;

    // Function to start the camera
    const startCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error("Unable to access camera: ", err);
            alert("Cannot access camera. Please check your browser permissions.");
        }
    };

    // Start the camera as soon as the DOM is loaded
    startCamera(); // Start the camera immediately when the page loads

    // Function to take a picture
    const takePicture = () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png'); // Capture image as base64
        photo.src = dataURL;
        photo.classList.remove('d-none');
        video.classList.add('d-none');
        captureButton.classList.add('d-none');
        uploadButton.classList.remove('d-none');
        retakeButton.classList.remove('d-none');
        confirmModal.show();
    };

    captureButton.addEventListener('click', takePicture);

    // Function to confirm save and upload image to Firebase
    confirmSave.addEventListener('click', () => {
        confirmModal.hide();
        const dataURL = canvas.toDataURL('image/png'); // Ensure base64 encoding
        const storageRef = ref(storage, `images/capturedImage_${Date.now()}.png`); // Unique file name

        uploadString(storageRef, dataURL, 'data_url')
            .then(() => {
                console.log('Uploaded a base64 image to Firebase Storage!');
                window.location.href = 'result.html'; // Navigate after successful upload
            })
            .catch((error) => {
                console.error("Error uploading image: ", error);
                alert("Failed to upload image. Please try again.");
            });
    });

    // Function to retake the picture
    retakeButton.addEventListener('click', () => {
        photo.classList.add('d-none');
        video.classList.remove('d-none');
        captureButton.classList.remove('d-none');
        uploadButton.classList.add('d-none');
        retakeButton.classList.add('d-none');
    });
});
