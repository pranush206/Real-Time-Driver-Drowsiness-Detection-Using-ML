document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");

    const statusEl = document.getElementById("status");
    const statusIcon = document.getElementById("statusIcon");

    const confidence = document.getElementById("confidence");
    const confidenceBar = document.getElementById("confidenceBar");

    const alertBox = document.getElementById("alertBox");

    const cameraStatus = document.getElementById("cameraStatus");
    const cameraOverlay = document.getElementById("cameraOverlay");
    
    const systemDot = document.getElementById("systemDot");
    const systemStatusText = document.getElementById("systemStatusText");

    let stream = null;
    let monitoring = false;
    let interval = null;
    let isProcessing = false;

    // Use relative path if served via HTTP (Flask server), else fallback to localhost URL
    const getApiUrl = () => {
        return window.location.origin.startsWith("http")
            ? "/predict"
            : "http://127.0.0.1:5000/predict";
    };

    startBtn.addEventListener("click", startCamera);
    stopBtn.addEventListener("click", stopCamera);

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user"
                },
                audio: false
            });

            video.srcObject = stream;
            await video.play().catch(() => {});

            monitoring = true;
            isProcessing = false;

            startBtn.disabled = true;
            stopBtn.disabled = false;

            cameraStatus.textContent = "Live Stream Active";
            cameraStatus.classList.add("active");
            cameraOverlay.style.display = "none";

            if (systemDot) systemDot.style.background = "#31d158";
            if (systemStatusText) systemStatusText.textContent = "Monitoring Active";

            alertBox.className = "alert-box active";
            alertBox.textContent = "Analyzing driver video stream...";

            // Capture frame every 800ms for responsive detection
            interval = setInterval(captureFrame, 800);

        } catch (error) {
            console.error("Camera access error:", error);
            alert("Camera access failed: Please allow camera permissions or check device setup.");
            alertBox.textContent = "Camera access denied or unavailable.";
        }
    }

    function stopCamera() {
        monitoring = false;
        isProcessing = false;

        if (interval) {
            clearInterval(interval);
            interval = null;
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }

        video.srcObject = null;

        startBtn.disabled = false;
        stopBtn.disabled = true;

        cameraStatus.textContent = "Camera Off";
        cameraStatus.classList.remove("active");
        cameraOverlay.style.display = "flex";

        statusEl.textContent = "WAITING";
        statusEl.className = "";
        statusIcon.textContent = "👁️";

        confidence.textContent = "0%";
        confidenceBar.style.width = "0%";
        confidenceBar.style.background = "#6c8cff";

        if (systemDot) systemDot.style.background = "#aab3c5";
        if (systemStatusText) systemStatusText.textContent = "System Ready";

        alertBox.className = "alert-box";
        alertBox.textContent = "Monitoring stopped. Click Start to resume.";
    }

    async function captureFrame() {
        if (!monitoring || video.videoWidth === 0 || isProcessing) {
            return;
        }

        isProcessing = true;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) {
                isProcessing = false;
                return;
            }

            const formData = new FormData();
            formData.append("image", blob, "frame.jpg");

            try {
                const response = await fetch(getApiUrl(), {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                updateUI(data);

            } catch (error) {
                console.error("Backend connection error:", error);
                alertBox.className = "alert-box error";
                alertBox.textContent = "Backend server unreachable. Make sure app.py is running on port 5000.";
            } finally {
                isProcessing = false;
            }
        }, "image/jpeg", 0.85);
    }

    function updateUI(data) {
        if (!monitoring) return;

        if (data.error) {
            alertBox.className = "alert-box error";
            alertBox.textContent = `Error: ${data.error}`;
            return;
        }

        const prediction = data.status;
        const confidenceValue = data.confidence || 0;

        confidence.textContent = confidenceValue + "%";
        confidenceBar.style.width = confidenceValue + "%";

        if (prediction === "SLEEPY") {
            statusEl.textContent = "SLEEPY";
            statusEl.className = "status-sleepy";
            statusIcon.textContent = "😴";

            confidenceBar.style.background = "#ff4d4d";

            alertBox.className = "alert-box danger";
            alertBox.textContent = "⚠️ DROWSINESS DETECTED! PLEASE TAKE A BREAK";

            if (systemDot) systemDot.style.background = "#ff4d4d";

            speakAlert();

        } else {
            statusEl.textContent = "AWAKE";
            statusEl.className = "status-awake";
            statusIcon.textContent = "👁️";

            confidenceBar.style.background = "#31d158";

            alertBox.className = "alert-box success";
            alertBox.textContent = "Driver is alert and focused.";

            if (systemDot) systemDot.style.background = "#31d158";
        }
    }

    function speakAlert() {
        if ('speechSynthesis' in window && !window.speechSynthesis.speaking) {
            const message = new SpeechSynthesisUtterance("Warning! Drowsiness detected. Please take a break.");
            message.rate = 1.0;
            message.pitch = 1.1;
            window.speechSynthesis.speak(message);
        }
    }
});