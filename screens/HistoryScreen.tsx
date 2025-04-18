import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { fetchSessions } from '../utils/database';

const { width } = Dimensions.get('window');

const HistoryScreen = () => {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(console.log);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>🏃 Activity</Text>
        <Text style={styles.value}>{item.activity}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>⏱ Duration</Text>
        <Text style={styles.value}>{item.duration}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>📏 Distance</Text>
        <Text style={styles.value}>{item.distance}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>💡 Light</Text>
        <Text style={styles.value}>{item.light} lx</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>🌡 Pressure</Text>
        <Text style={styles.value}>{item.pressure} hPa</Text>
      </View>
      {item.timestamp && (
        <Text style={styles.timestamp}>
          📅 {new Date(item.timestamp).toLocaleString()}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Activity History</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activity history found</Text>
          </View>
        }
        contentContainerStyle={sessions.length === 0 ? { flex: 1 } : undefined}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F4F8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: width - 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
