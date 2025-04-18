// hooks/useSensors.ts
import { useEffect, useState } from 'react';
import {
  SensorTypes,
  setUpdateIntervalForType,
  accelerometer,
  gyroscope,
} from 'react-native-sensors';
import { map } from 'rxjs/operators';

type SensorData = {
  accel: { x: number; y: number; z: number };
  gyro: { x: number; y: number; z: number };
  light: number;
  pressure: number;
};

export const useSensors = (): SensorData => {
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });

  // Placeholder values for unsupported sensors
  const [light] = useState(300);      // mocked lux value
  const [pressure] = useState(1013);  // mocked hPa value

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
    setUpdateIntervalForType(SensorTypes.gyroscope, 1000);

    const accelSub = accelerometer
      .pipe(map(({ x, y, z }) => ({ x, y, z })))
      .subscribe(setAccel);

    const gyroSub = gyroscope
      .pipe(map(({ x, y, z }) => ({ x, y, z })))
      .subscribe(setGyro);

    return () => {
      accelSub.unsubscribe();
      gyroSub.unsubscribe();
    };
  }, []);

  return { accel, gyro, light, pressure };
};
