# SensorTracker App

## 📱 Objective
A mobile app that tracks user activity and environmental data using the phone’s built-in sensors, GPS, and notifies users for medicine intake.

## 🚀 Features

1. **Activity Tracking**
   - Uses accelerometer and gyroscope to detect activities (walking, running, stationary).
   - Displays real-time activity and duration.

2. **Medicine Reminder**
   - Allows user to log medicines with time.
   - Sends offline notifications even if the app is killed (15 mins before scheduled time).

3. **Location-Based Tracking**
   - Tracks user path on a map using GPS.
   - Calculates total distance traveled.

4. **Dashboard**
   - Shows current activity type and duration.
   - Displays total distance, ambient light level, and pressure data.

5. **Data Logging**
   - Logs sensor and location data locally using SQLite.
   - Includes history screen to view past sessions.

6. **Native Android Integration**
   - Login screen implemented using native Android.
   - Background service for continuous tracking and medicine reminders.

## ⚠️ Known Issue
- Location-based path tracking crashes due to dependency conflicts on some devices. This is under investigation.

## 🛠 Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/JayPatell1999/PracticalJay.git
   cd SensorTrackerApp

## 🔍Brief Explanation of My Approach

This application is built using React Native with native Android integration for login and background services. The project is divided into the following features:

1. **Native Android Login**: Implemented using a custom `LoginActivity.kt`, which bridges to React Native after successful login.
2. **Activity Tracking**: Utilizes accelerometer and gyroscope sensors to detect walking, running, or idle states in real-time.
3. **Medicine Reminder**: Allows users to set medicine reminders, and schedules local notifications that work even when the app is killed.
4. **GPS Distance Tracking**: Tracks user movement via GPS, plots the path on a map, and calculates distance in real-time.
5. **Dashboard**: Displays activity type, duration, total distance, light level, and atmospheric pressure.
6. **Data Logging**: Uses SQLite to log all sensor and GPS data, which can be reviewed in the History screen.
7. **Background Services**: Android background service ensures continuous tracking even when the app is minimized or closed.

The app is structured in modular screens and hooks to promote clean architecture and separation of concerns.

## 📹 Demo Video
[Click here to watch the demo](https://drive.google.com/file/d/1OZkLJWA78nfHdd6r_JJ4zsuOj-WSEUkx/view?usp=sharing)

