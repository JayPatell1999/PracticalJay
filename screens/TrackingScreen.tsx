import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';

const { width, height } = Dimensions.get('window');

type LatLng = {
  latitude: number;
  longitude: number;
};

export default function TrackingScreen() {
  const [path, setPath] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Required",
          message: "This app needs to access your location to track your activity.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Start tracking
  const startTracking = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission required", "Location permission is needed to track your path.");
      return;
    }

    const id = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setPath(prevPath => {
          const newPath = [...prevPath, { latitude, longitude }];
          if (prevPath.length > 0) {
            const dist = haversine(prevPath[prevPath.length - 1], { latitude, longitude }, { unit: 'km' });
            setDistance(prev => parseFloat((prev + dist).toFixed(3)));
          }
          return newPath;
        });
      },
      error => console.warn(error.message),
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 2000,
        fastestInterval: 1000,
      }
    );
    setWatchId(id);
  }, []);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  const initialRegion = path.length > 0
    ? {
        latitude: path[0].latitude,
        longitude: path[0].longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 GPS Tracking</Text>
      <Text style={styles.info}>Distance: {distance.toFixed(2)} km</Text>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        region={path.length > 0 ? {
          latitude: path[path.length - 1].latitude,
          longitude: path[path.length - 1].longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        } : initialRegion}
        showsUserLocation
        followsUserLocation
      >
        {path.length > 0 && (
          <>
            <Polyline coordinates={path} strokeWidth={4} strokeColor="blue" />
            <Marker coordinate={path[0]} title="Start" />
            <Marker coordinate={path[path.length - 1]} title="Current" />
          </>
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStop} onPress={stopTracking}>
          <Text style={styles.buttonText}>⏹ Stop Tracking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', margin: 16, textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
  map: { width, height: height * 0.75 },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  buttonStop: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
