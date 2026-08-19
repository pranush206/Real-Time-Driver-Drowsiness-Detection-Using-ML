# Real-Time Driver Drowsiness Detection Using ML

## 📌 Overview

**Real-Time Driver Drowsiness Detection Using ML** is a machine learning and computer vision-based system designed to detect driver drowsiness in real time. The system uses a trained Convolutional Neural Network (CNN) model to classify eye conditions and determine whether the driver is **Awake** or **Sleepy**.

The application captures frames from a webcam, sends them to a Flask backend, processes them using the trained ML model, and displays the prediction and confidence level through an interactive web interface. When drowsiness is detected, the system provides a warning alert to help improve driver safety.

## ✨ Features

* 🎥 Real-time webcam monitoring
* 👁️ Eye-state based drowsiness detection
* 🧠 CNN-based machine learning model
* ⚡ Real-time prediction through Flask API
* 📊 Prediction confidence display
* 🚨 Drowsiness warning alert
* 🔊 Voice-based warning notification
* 🌐 Interactive web-based frontend
* 📱 Responsive and user-friendly interface

## 🛠️ Technologies Used

### Machine Learning

* Python
* TensorFlow / Keras
* CNN
* NumPy
* Scikit-learn
* Matplotlib

### Computer Vision

* OpenCV
* Pillow

### Backend

* Flask
* Flask-CORS
* REST API

### Frontend

* HTML
* CSS
* JavaScript
* Web Camera API

## 📂 Project Structure

```text
Real-Time-Driver-Drowsiness/
│
├── backend/
│   ├── app.py
│   ├── drowsiness_model.keras
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── drowsiness_model.ipynb
├── dataset/
└── README.md
```

## 🧠 Machine Learning Model

The model is trained using an eye-state dataset containing images representing different eye conditions.

The CNN performs the following process:

```text
Input Eye Image
       ↓
Image Preprocessing
       ↓
Data Augmentation
       ↓
Convolutional Layers
       ↓
Pooling Layers
       ↓
Feature Extraction
       ↓
Dense Layers
       ↓
Binary Classification
       ↓
Awake / Sleepy
```

The trained model is saved as:

```text
drowsiness_model.keras
```

## 🔄 System Workflow

```text
Webcam
   ↓
Capture Video Frame
   ↓
Send Frame to Flask API
   ↓
Image Preprocessing
   ↓
CNN Model Prediction
   ↓
Awake / Sleepy
   ↓
Display Result
   ↓
Warning Alert if Drowsy
```

## 🚀 Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Real-Time-Driver-Drowsiness
```

### 2. Install dependencies

```bash
pip install -r backend/requirements.txt
```

If required, install the main packages manually:

```bash
pip install flask flask-cors tensorflow numpy pillow scikit-learn matplotlib
```

## ▶️ Running the Backend

Open a terminal and run:

```bash
cd backend
python app.py
```

The Flask server will run at:

```text
http://127.0.0.1:5000
```

## 🌐 Running the Frontend

Open the `frontend` folder in VS Code and launch:

```text
index.html
```

You can use the **Live Server** extension in VS Code.

Then allow camera access when prompted.

## 📊 Prediction

The system provides:

* **AWAKE** → Driver appears alert
* **SLEEPY** → Drowsiness detected

The frontend also displays the model's prediction confidence.

When the driver is detected as sleepy, the application displays a warning and provides a voice alert:

> "Warning! Drowsiness detected. Please take a break."

## 🔮 Future Improvements

* Add face and eye landmark detection using MediaPipe
* Add Eye Aspect Ratio (EAR) calculation
* Detect continuous eye closure instead of individual frames
* Add yawning detection
* Add head-pose estimation
* Add buzzer/hardware alert integration
* Improve model accuracy with additional datasets
* Add driver monitoring statistics and history
* Deploy the application online

## ⚠️ Disclaimer

This project is developed for **educational and research purposes**. It should not be considered a certified automotive safety system. Real-world deployment would require extensive testing, validation, and safety certification.

## 👨‍💻 Project

**Real-Time Driver Drowsiness Detection Using ML**

Built using **Python, TensorFlow, Flask, OpenCV, HTML, CSS, and JavaScript**.
