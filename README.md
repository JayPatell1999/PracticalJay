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
