import SQLite, {
    SQLiteDatabase,
    Transaction,
    ResultSet,
    SQLError,
  } from 'react-native-sqlite-storage';
  
  // Fix for missing type declarations if @types/react-native-sqlite-storage isn't available
  declare module 'react-native-sqlite-storage';
  
  SQLite.enablePromise(true);
  
  const openDatabase = async (): Promise<SQLiteDatabase> => {
    return SQLite.openDatabase({ name: 'activity.db' });
  };
  
  export const initDB = async (): Promise<void> => {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      database.transaction(
        (tx: Transaction) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS sessions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              activity TEXT,
              duration TEXT,
              distance TEXT,
              light TEXT,
              pressure TEXT,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );`
          );
        },
        (error: SQLError) => reject(error),
        () => resolve()
      );
    });
  };
  
  export const insertSession = async (
    activity: string,
    duration: string,
    distance: string,
    light: string,
    pressure: string
  ): Promise<void> => {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      database.transaction(
        (tx: Transaction) => {
          tx.executeSql(
            `INSERT INTO sessions (activity, duration, distance, light, pressure) VALUES (?, ?, ?, ?, ?)`,
            [activity, duration, distance, light, pressure],
            () => resolve(),
            (_, error: SQLError) => {
              reject(error);
              return false;
            }
          );
        },
        (error: SQLError) => reject(error)
      );
    });
  };
  
  export const fetchSessions = async (): Promise<any[]> => {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      database.transaction(
        (tx: Transaction) => {
          tx.executeSql(
            `SELECT * FROM sessions ORDER BY timestamp DESC`,
            [],
            (_: Transaction, result: ResultSet) => {
              resolve(result.rows.raw());
            },
            (_: Transaction, error: SQLError) => {
              reject(error);
              return false;
            }
          );
        },
        (error: SQLError) => reject(error)
      );
    });
  };
  