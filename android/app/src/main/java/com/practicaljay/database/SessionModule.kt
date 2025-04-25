package com.practicaljay.database

import android.database.Cursor
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = SessionModule.NAME)
class SessionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "SessionModule"
    }

    private val dbHelper = SQLiteHelper(reactContext)

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun getAllSessions(promise: Promise) {
        try {
            val db = dbHelper.readableDatabase
            val cursor: Cursor = db.rawQuery("SELECT * FROM sessions", null)
            val sessionList = Arguments.createArray()

            while (cursor.moveToNext()) {
                val sessionMap = Arguments.createMap()
                sessionMap.putString("activity", cursor.getString(cursor.getColumnIndexOrThrow("activity")))
                sessionMap.putString("duration", cursor.getString(cursor.getColumnIndexOrThrow("duration")))
                sessionMap.putString("distance", cursor.getString(cursor.getColumnIndexOrThrow("distance")))
                sessionMap.putString("light", cursor.getString(cursor.getColumnIndexOrThrow("light")))
                sessionMap.putString("pressure", cursor.getString(cursor.getColumnIndexOrThrow("pressure")))
                sessionList.pushMap(sessionMap)
            }

            cursor.close()
            db.close()

            promise.resolve(sessionList)
        } catch (e: Exception) {
            promise.reject("DB_ERROR", "Failed to fetch sessions: ${e.message}")
        }
    }

    @ReactMethod
    fun insertSession(activity: String, duration: String, distance: String, light: String, pressure: String) {
        try {
            dbHelper.insertSession(activity, duration, distance, light, pressure)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
