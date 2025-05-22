import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CourseList from './CourseList';
import PopularCourses from './PopularCourses';
import Statistics from './Statistics';

const Dashboard = ({ courseData }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const allCategories = [
    'web', 'fullstack', 'javascript', 'node', 'git', 'tools', 'collaboration',
    'java', 'backend', 'enterprise', 'html', 'css', 'frontend', 'python',
    'data-science', 'analytics', 'api', 'react'
  ];

  const filteredCourses = () => {
    let filtered = courseData;

    if (!Array.isArray(filtered)) return [];

    if (activeTab !== 'all') {
      if (activeTab === 'populair') {
        filtered = [...filtered].sort((a, b) => b.views - a.views);
      } else {
        filtered = filtered.filter((course) =>
          course.level === (activeTab === 'beginner' ? 'Beginner' : 'Gevorderd')
        );
      }
    }

    if (categoryFilters.length > 0) {
      filtered = filtered.filter((course) =>
        course.categories?.some((cat) => categoryFilters.includes(cat))
      );
    }

    return filtered;
  };

  const handleCoursePress = (course) => setSelectedCourse(course);
  const closeModal = () => setSelectedCourse(null);

  const openVideo = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error('Kan video niet openen:', err);
      });
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    setIsAtBottom(isBottom);
  };

  return (
    <View style={styles.dashboard}>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {['all', 'beginner', 'gevorderd', 'populair'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {{
                  all: 'Alle Cursussen',
                  beginner: 'Voor Beginners',
                  gevorderd: 'Gevorderd',
                  populair: 'Meest Bekeken',
                }[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.headerWithFilter}>
          <Text style={styles.sectionTitle}>
            {{
              all: 'Alle Cursussen',
              beginner: 'Cursussen voor Beginners',
              gevorderd: 'Gevorderde Cursussen',
              populair: 'Meest Bekeken Cursussen',
            }[activeTab]}
          </Text>

          <TouchableOpacity onPress={() => setIsFilterVisible((prev) => !prev)} style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#3498db" />
          </TouchableOpacity>
        </View>

        {categoryFilters.length > 0 && (
          <TouchableOpacity onPress={() => setCategoryFilters([])} style={{ marginBottom: 10 }}>
            <Text style={{ color: 'red' }}>Wis filters ({categoryFilters.length})</Text>
          </TouchableOpacity>
        )}

        <CourseList courses={filteredCourses()} onPress={handleCoursePress} />

        <View style={styles.sidebarContainer}>
          <PopularCourses courses={courseData} />
          <Statistics courses={courseData} />
        </View>
      </View>

      {/* Cursusdetails Modal */}
      <Modal visible={!!selectedCourse} animationType="slide" transparent={true}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>

            <ScrollView>
              {selectedCourse?.imageUrl && (
                <Image source={{ uri: selectedCourse.imageUrl }} style={styles.courseImage} resizeMode="cover" />
              )}

              <Text style={styles.modalTitle}>{selectedCourse?.title}</Text>
              <Text style={styles.modalDescription}>{selectedCourse?.description}</Text>

              {[{ label: 'Instructor', value: selectedCourse?.instructor },
                { label: 'Niveau', value: selectedCourse?.level },
                { label: 'Duur', value: selectedCourse?.duration },
                { label: 'Leden', value: selectedCourse?.members },
                { label: 'Beoordeling', value: `${selectedCourse?.rating} ⭐` },
                { label: 'Categorieën', value: selectedCourse?.categories?.join(', ') }
              ].map((item, index) => (
                <View style={styles.infoRow} key={index}>
                  <Text style={styles.infoLabel}>{item.label}:</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}

              {selectedCourse?.learningObjectives && (
                <>
                  <Text style={styles.modalSectionTitle}>Leerdoelen:</Text>
                  {selectedCourse.learningObjectives.map((obj, index) => (
                    <Text key={index} style={styles.modalListItem}>• {obj}</Text>
                  ))}
                </>
              )}

              <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => openVideo(selectedCourse?.videoUrl)}>
                <Text style={styles.buttonText}>Bekijk Video</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Filter Dropdown */}
      {isFilterVisible && (
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Filter op categorie</Text>
            <ScrollView
              style={{ maxHeight: 200 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              <View style={styles.dropdownGrid}>
                {allCategories.map((category) => {
                  const selected = categoryFilters.includes(category);
                  return (
                    <TouchableOpacity
                      key={category}
                      style={styles.dropdownItemColumn}
                      onPress={() => {
                        setCategoryFilters((prev) =>
                          prev.includes(category)
                            ? prev.filter((c) => c !== category)
                            : [...prev, category]
                        );
                      }}
                    >
                      <Ionicons
                        name={selected ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={selected ? '#3498db' : '#aaa'}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.categoryText}>{category}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Ionicons
                name={isAtBottom ? 'arrow-up' : 'arrow-down'}
                size={24}
                color="#3498db"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setIsFilterVisible(false)}
            >
              <Text style={styles.buttonText}>Toepassen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: { flex: 1, backgroundColor: '#fff' },
  tabContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tabScroll: { paddingHorizontal: 15 },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f1f3f5',
  },
  activeTab: { backgroundColor: '#3498db' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#333' },
  activeTabText: { color: '#fff' },
  content: { flex: 1, padding: 15 },
  headerWithFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButton: { marginLeft: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333' },
  sidebarContainer: { marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#ccc',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  courseImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  modalDescription: { fontSize: 16, marginBottom: 15, color: '#444' },
  infoRow: { flexDirection: 'row', marginBottom: 6 },
  infoLabel: { fontWeight: '600', width: 100, color: '#333' },
  infoValue: { flex: 1, color: '#555' },
  modalSectionTitle: { fontWeight: '600', fontSize: 18, marginBottom: 8, marginTop: 15 },
  modalListItem: { fontSize: 15, marginBottom: 6, paddingLeft: 8, color: '#444' },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  dropdownOverlay: {
    position: 'absolute',
    top: 120,
    right: 20,
    left: 20,
    zIndex: 999,
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  dropdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dropdownItemColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 6,
  },
  categoryText: { fontSize: 14, color: '#444' },
});

export default Dashboard;
