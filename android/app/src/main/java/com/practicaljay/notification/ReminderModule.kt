package com.practicaljay.notification

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ReminderModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ReminderModule"

    @ReactMethod
    fun scheduleNativeReminder(name: String, timestamp: Double) {
        val context = reactContext.applicationContext
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra("medicine_name", name)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            name.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            timestamp.toLong() - 15 * 60 * 1000,  // 15 minutes before
            pendingIntent
        )
    }
}
