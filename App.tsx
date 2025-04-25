import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { initDB } from './utils/database';
// import notifee, { AndroidImportance } from '@notifee/react-native';

export default function App() {
  useEffect(() => {
    // Initialize SQLite database
    initDB()
      .then(() => {
        console.log('Database initialized');
      })
      .catch((err) => {
        console.error('Database initialization failed:', err);
      });

    // Setup Notifee notification permissions and channel
    // async function setupNotifications() {
    //   await notifee.requestPermission();
    //   await notifee.createChannel({
    //     id: 'medicines',
    //     name: 'Medicine Reminders',
    //     importance: AndroidImportance.HIGH,
    //   });
    // }

    // setupNotifications();
  }, []);

  return <AppNavigator />;
}
