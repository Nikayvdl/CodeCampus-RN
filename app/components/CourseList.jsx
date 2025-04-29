import { View, Text, StyleSheet, FlatList } from 'react-native';
import CourseCard from './CourseCard';

const CourseList = ({ courses }) => {
  return (
    <View style={styles.container}>
      {courses.length === 0 ? (
        <Text style={styles.emptyMessage}>Geen cursussen gevonden.</Text>
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseCard course={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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