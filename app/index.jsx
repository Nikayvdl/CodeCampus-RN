import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dashboard from './components/Dashboard';

import courses from './data/_coursesData.js';

export default function App() {
  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setCourseData(courses);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Er is een fout opgetreden bij het laden van de cursussen.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style='auto' />
      <Stack.Screen
        options={{
          title: 'CodeCampus',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size='large' color='#3498db' />
            <Text style={styles.loadingText}>Cursussen worden geladen...</Text>
          </View>
        ) : error ? (
          <View>
            <Text>{error}</Text>
          </View>
        ) : (
          <Dashboard courseData={courseData} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
