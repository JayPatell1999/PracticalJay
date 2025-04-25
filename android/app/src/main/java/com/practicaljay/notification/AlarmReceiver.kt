package com.practicaljay.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.practicaljay.R
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val medicineName = intent.getStringExtra("medicine_name") ?: "your medicine"

        val notification = NotificationCompat.Builder(context, "medicines")
            .setSmallIcon(R.drawable.ic_notification) 
            .setContentTitle("💊 Medicine Reminder")
            .setContentText("Time to take your medicine: $medicineName")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(context).notify(medicineName.hashCode(), notification)
    }
}
