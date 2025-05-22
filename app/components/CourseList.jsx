import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CourseCard from './CourseCard';

const CourseList = ({ courses, onPress }) => {
  return (
    <View style={styles.container}>
      {courses.length === 0 ? (
        <Text style={styles.emptyMessage}>Geen cursussen gevonden.</Text>
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseCard course={item} onPress={onPress} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 20,
  },
});

export default CourseList;
