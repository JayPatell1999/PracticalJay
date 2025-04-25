    import { useEffect, useState } from 'react';
    import { NativeEventEmitter, NativeModules } from 'react-native';

    const { SensorModule } = NativeModules;

    type SensorState = {
    accel: { x: number; y: number; z: number };
    gyro: { x: number; y: number; z: number };
    pressure: number;
    light: number;
    };

    export const useNativeSensors = (): SensorState => {
    const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
    const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
    const [pressure, setPressure] = useState(0);
    const [light, setLight] = useState(0);

    useEffect(() => {
        const sensorEmitter = new NativeEventEmitter(SensorModule);
        SensorModule.start();

        const subscription = sensorEmitter.addListener('SensorData', (data) => {
        switch (data.type) {
            case 'accelerometer':
            setAccel({ x: data.x, y: data.y, z: data.z });
            break;
            case 'gyroscope':
            setGyro({ x: data.x, y: data.y, z: data.z });
            break;
            case 'pressure':
            setPressure(data.value);
            break;
            case 'light':
            setLight(data.value);
            break;
        }
        });

        return () => {
        SensorModule.stop();
        subscription.remove();
        };
    }, []);

    return { accel, gyro, pressure, light };
    };
