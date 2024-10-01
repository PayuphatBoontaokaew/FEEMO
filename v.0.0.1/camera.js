document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const captureButton = document.getElementById('capture');
    const retakeButton = document.getElementById('retake');
    const uploadButton = document.getElementById('upload');
    const zoomRange = document.getElementById('zoomRange');
    const brightnessRange = document.getElementById('brightnessRange');
    const contrastRange = document.getElementById('contrastRange');
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const confirmSave = document.getElementById('confirmSave');

    let stream = null;
    let zoomLevel = 1;
    let brightness = 1;
    let contrast = 1;

    // ฟังก์ชันเปิดกล้อง
    const startCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error("ไม่สามารถเข้าถึงกล้องได้: ", err);
            alert("ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบสิทธิ์การใช้งานกล้องของเบราว์เซอร์");
        }
    };

    startCamera();

    // ฟังก์ชันถ่ายภาพ
    const takePicture = () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        photo.src = dataURL;
        photo.classList.remove('d-none');
        video.classList.add('d-none');
        captureButton.classList.add('d-none');
        uploadButton.classList.remove('d-none');
        retakeButton.classList.remove('d-none');
        confirmModal.show();
    };

    captureButton.addEventListener('click', takePicture);

    // ฟังก์ชันยืนยันการเก็บภาพ
    confirmSave.addEventListener('click', () => {
        confirmModal.hide();
        // เก็บภาพใน localStorage
        const dataURL = canvas.toDataURL('image/png');
        localStorage.setItem('capturedImage', dataURL);
        // นำผู้ใช้ไปยังหน้า result.html
        window.location.href = 'v.0.0.1/result.html';
    });

    // ฟังก์ชันถ่ายใหม่
    retakeButton.addEventListener('click', () => {
        photo.classList.add('d-none');
        video.classList.remove('d-none');
        captureButton.classList.remove('d-none');
        uploadButton.classList.add('d-none');
        retakeButton.classList.add('d-none');
    });

    // ฟังก์ชันปรับซูม
    zoomRange.addEventListener('input', (e) => {
        zoomLevel = e.target.value;
        video.style.transform = `scale(${zoomLevel})`;
    });

    // ฟังก์ชันปรับความสว่าง
    brightnessRange.addEventListener('input', (e) => {
        brightness = e.target.value;
        video.style.filter = `brightness(${brightness}) contrast(${contrast})`;
    });

    // ฟังก์ชันปรับความคมชัด
    contrastRange.addEventListener('input', (e) => {
        contrast = e.target.value;
        video.style.filter = `brightness(${brightness}) contrast(${contrast})`;
    });
});
