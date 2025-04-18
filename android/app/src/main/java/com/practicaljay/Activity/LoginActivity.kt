package com.practicaljay.Activity

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.practicaljay.MainActivity
import com.practicaljay.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var sharedPref: android.content.SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // ✅ Initialize SharedPreferences
        sharedPref = getSharedPreferences("MyPrefs", Context.MODE_PRIVATE)

        val isUserLogin = sharedPref.getString("isUserLogin", "0")
        if (isUserLogin == "1") {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }

        binding.btnLogin.setOnClickListener {
            if (validate()) {
                // ✅ Save login state
                val editor = sharedPref.edit()
                editor.putString("isUserLogin", "1")
                editor.apply()

                // ✅ Navigate to MainActivity
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
            }
        }
    }

    private fun validate(): Boolean {
        val email = binding.etEmail.text.toString().trim()
        val password = binding.passwordEditText.text.toString().trim()

        return if (email == "admin@gmail.com" && password == "Admin#123") {
            true
        } else {
            Toast.makeText(this, "Invalid credentials", Toast.LENGTH_SHORT).show()
            false
        }
    }
}
