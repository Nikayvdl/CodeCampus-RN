import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CourseCard = ({ course, onPress, onToggleFavorite, isFavorite }) => {
  const openCourseVideo = (url) => () => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error('Kan video niet openen:', err);
      });
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(course)}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: course.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => onToggleFavorite(course.id)}
          style={styles.favoriteIcon}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#e74c3c' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Niveau: </Text>
            <Text style={styles.detailValue}>{course.level}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duur: </Text>
            <Text style={styles.detailValue}>{course.duration}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statItem}>{course.members} leden</Text>
          <Text style={styles.statItem}>{course.views} weergaven</Text>
          <Text style={styles.rating}>⭐ {course.rating}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={openCourseVideo(course.videoUrl)}
        >
          <Text style={styles.buttonText}>Bekijk Video</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  imageContainer: {
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  statItem: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  rating: {
    fontSize: 13,
    color: '#f39c12',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
});

export default CourseCard;
