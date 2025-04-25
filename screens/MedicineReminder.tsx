import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeModules } from 'react-native';
const { ReminderModule } = NativeModules;

const MedicineReminder = () => {
  const [medicineName, setMedicineName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSetReminder = async () => {
    if (!medicineName.trim()) {
      Alert.alert('❗ Please enter a medicine name');
      return;
    }

    const selectedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      0
    );

    const now = new Date();
    const minValidTime = new Date(now.getTime() + 1 * 60 * 1000);
    if (selectedDateTime < minValidTime) {
      Alert.alert('⏰ Please choose a time at least 15 minutes from now.');
      return;
    }

    // Request notification permission (Android 13+)
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('⚠️ Notification permission denied');
        return;
      }
    }

    // 🔥 Call native module here
    try {
      ReminderModule.scheduleNativeReminder(
        medicineName,
        selectedDateTime.getTime()
      );
      Alert.alert('✅ Reminder set successfully!');
      setMedicineName('');
      setDate(new Date());
      setTime(new Date());
    } catch (error) {
      Alert.alert('❌ Failed to schedule reminder:', String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 Set Medicine Reminder</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter medicine name"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      {/* Reminder Date */}
      <View style={styles.pickerSection}>
        <Text style={styles.label}>📅 Reminder Date</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Reminder Time */}
      <View style={styles.pickerSection}>
        <Text style={styles.label}>⏰ Reminder Time</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </TouchableOpacity>
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <TouchableOpacity
        style={styles.reminderButton}
        onPress={handleSetReminder}
      >
        <Text style={styles.buttonText}>📌 Set Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicineReminder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    backgroundColor: '#FFF',
  },
  pickerSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerButton: {
    padding: 14,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#0D47A1',
    fontWeight: '600',
  },
  reminderButton: {
    width: '100%',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
