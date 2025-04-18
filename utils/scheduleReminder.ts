import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

export async function scheduleReminder(name: string, time: Date) {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: time.getTime() - 15 * 60 * 1000, // 15 mins before
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  await notifee.createTriggerNotification(
    {
      title: '💊 Medicine Reminder',
      body: `Time to take your medicine: ${name}`,
      android: {
        channelId: 'medicines',
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger
  );
}
