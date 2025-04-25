package com.practicaljay.database

import android.content.ContentValues
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.content.Context
import android.database.Cursor 

class SQLiteHelper(context: Context) {
    private val DATABASE_NAME = "session_db"
    private val TABLE_NAME = "sessions"
    private val DATABASE_VERSION = 1

    private val COLUMN_ID = "id"
    private val COLUMN_ACTIVITY = "activity"
    private val COLUMN_DURATION = "duration"
    private val COLUMN_DISTANCE = "distance"
    private val COLUMN_LIGHT = "light"
    private val COLUMN_PRESSURE = "pressure"

    private val dbHelper: SQLiteOpenHelper = object : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {
        override fun onCreate(db: SQLiteDatabase) {
            val createTableQuery = """
                CREATE TABLE $TABLE_NAME (
                    $COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    $COLUMN_ACTIVITY TEXT,
                    $COLUMN_DURATION TEXT,
                    $COLUMN_DISTANCE TEXT,
                    $COLUMN_LIGHT TEXT,
                    $COLUMN_PRESSURE TEXT
                )
            """
            db.execSQL(createTableQuery)
        }

        override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
            db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
            onCreate(db)
        }
    }

    val readableDatabase: SQLiteDatabase
        get() = dbHelper.readableDatabase

    val writableDatabase: SQLiteDatabase
        get() = dbHelper.writableDatabase

    fun insertSession(activity: String, duration: String, distance: String, light: String, pressure: String) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COLUMN_ACTIVITY, activity)
            put(COLUMN_DURATION, duration)
            put(COLUMN_DISTANCE, distance)
            put(COLUMN_LIGHT, light)
            put(COLUMN_PRESSURE, pressure)
        }
        db.insert(TABLE_NAME, null, values)
        db.close()
    }

    fun fetchSessions(): Cursor {
        return readableDatabase.query(TABLE_NAME, null, null, null, null, null, null)
    }
}
