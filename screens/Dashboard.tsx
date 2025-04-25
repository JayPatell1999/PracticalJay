import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import { useNativeSensors as useSensors } from '../hooks/useNativeSensors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { insertSession } from '../hooks/SessionModule'; 

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const getActivityType = (accel: { x: number; y: number; z: number }) => {
  const magnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
  const gravity = 9.8;
  const deviation = Math.abs(magnitude - gravity);

  if (deviation < 0.3) return 'Stationary';
  if (deviation < 2.0) return '🚶 Walking';
  return '🏃 Running';
};

const Dashboard = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const { accel, light, pressure } = useSensors();
  const accelRef = useRef(accel);

  const [isTracking, setIsTracking] = useState(false);
  const [activity, setActivity] = useState('Stationary');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState('00:00:00');
  const [distance, setDistance] = useState('0.0 km');

  // Keep latest accel value
  useEffect(() => {
    accelRef.current = accel;
  }, [accel]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        startSession();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startSession = () => {
    setStartTime(Date.now());
    setIsTracking(true);
  };

  const stopSession = async () => {
    setIsTracking(false);
    setActivity('Stationary');

    if (duration !== '00:00:00') {
      try {
        // Save the session using the `insertSession` function from your hooks
        console.log('Saving session:', { activity, duration, distance, light, pressure });
        await insertSession(activity, duration, distance, light.toString(), pressure.toString());
        console.log('Session saved!');
      } catch (err) {
        console.log('Error saving session:', err);
      }
    }

    // Reset session details after stopping
    setStartTime(null);
    setDuration('00:00:00');
    setDistance('0.0 km');
  };

  useEffect(() => {
    if (!isTracking || !startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setDuration(`${h}:${m}:${s}`);

      const activityNow = getActivityType(accelRef.current);
      setActivity(activityNow);

      if (diff % 5 === 0 && activityNow !== 'Stationary') {
        setDistance((prev) => {
          const newVal = (parseFloat(prev) + 0.01).toFixed(2);
          return `${newVal} km`;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>👤 Activity Dashboard</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Activity:</Text>
            <Text style={styles.value}>{activity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{duration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>{distance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Light Level:</Text>
            <Text style={styles.value}>{light} lx</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pressure:</Text>
            <Text style={styles.value}>{pressure} hPa</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={requestLocationPermission}
            disabled={isTracking}
          >
            <Text style={styles.buttonText}>▶ Start Session</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopSession}
            disabled={!isTracking}
          >
            <Text style={styles.buttonText}>✋ Stop</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.reminderButton}
          onPress={() => navigation.navigate('MedicineReminder')}
        >
          <Text style={styles.buttonText}>💊 Set Medicine Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gpsButton}
          onPress={() => navigation.navigate('Tracking')}
        >
          <Text style={styles.buttonText}>📍 Use GPS to Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>📜 View History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F8' },
  container: { padding: 20, alignItems: 'center' },
  header: { fontSize: 28, fontWeight: '700', marginBottom: 30, color: '#333' },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  label: { fontSize: 18, color: '#666' },
  value: { fontSize: 18, fontWeight: '600', color: '#000' },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  historyButton: {
    width: '100%',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  gpsButton: {
    width: '100%',
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  reminderButton: {
    width: '100%',
    backgroundColor: '#9C27B0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
});
