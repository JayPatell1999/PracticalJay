import { NativeModules } from 'react-native';

const { SessionModule } = NativeModules;

export const insertSession = (activity, duration, distance, lightLevel, pressure) => {
  if (SessionModule) {
    try {
      SessionModule.insertSession(activity, duration, distance, lightLevel, pressure);
    } catch (error) {
      console.error('Error calling insertSession:', error);
    }
  } else {
    console.error('SessionModule is not available');
  }
};

export const getAllSessions =async (callback) => {
  if (SessionModule) {
    try {
    //   SessionModule.fetchSessions((sessions) => {
    //     callback(sessions);
    //   });
    const sessions = await SessionModule.getAllSessions(); 
      callback(sessions);
    } catch (error) {
      console.error('Error calling fetchSessions:', error);
    }
  } else {
    console.error('SessionModule is not available');
  }
};
