package com.practicaljay.sensors

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class SensorModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), SensorEventListener {

    private val sensorManager: SensorManager =
        reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager

    private val accelerometer: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    private val gyroscope: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
    private val lightSensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT)
    private val pressureSensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_PRESSURE)

    override fun getName(): String = "SensorModule"

    @ReactMethod
    fun start() {
        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
        gyroscope?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
        lightSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
        pressureSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    @ReactMethod
    fun stop() {
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            val sensorType = event.sensor.type
            val sensorData = Arguments.createMap()

            when (sensorType) {
                Sensor.TYPE_ACCELEROMETER -> {
                    sensorData.putString("type", "accelerometer")
                    sensorData.putDouble("x", event.values[0].toDouble())
                    sensorData.putDouble("y", event.values[1].toDouble())
                    sensorData.putDouble("z", event.values[2].toDouble())
                }
                Sensor.TYPE_GYROSCOPE -> {
                    sensorData.putString("type", "gyroscope")
                    sensorData.putDouble("x", event.values[0].toDouble())
                    sensorData.putDouble("y", event.values[1].toDouble())
                    sensorData.putDouble("z", event.values[2].toDouble())
                }
                Sensor.TYPE_LIGHT -> {
                    sensorData.putString("type", "light")
                    sensorData.putDouble("value", event.values[0].toDouble())
                }
                Sensor.TYPE_PRESSURE -> {
                    sensorData.putString("type", "pressure")
                    sensorData.putDouble("value", event.values[0].toDouble())
                }
                else -> return
            }

            reactContext
                .getJSModule(RCTDeviceEventEmitter::class.java)
                .emit("SensorData", sensorData)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // No-op
    }
}
