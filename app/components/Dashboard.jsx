import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal,
  Image, Linking, LayoutAnimation, Platform, UIManager, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CourseList from './CourseList';
import PopularCourses from './PopularCourses';
import Statistics from './Statistics';
import { Appearance, useColorScheme } from 'react-native';


const FAVORITE_KEY = 'FAVORITE_COURSES';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Dashboard = ({ courseData }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [sortOption, setSortOption] = useState('populariteit');
  const [favorites, setFavorites] = useState([]);

  const allCategories = [/* same as before */ 'web', 'fullstack', 'javascript', 'node', 'git', 'tools', 'collaboration',
    'java', 'backend', 'enterprise', 'html', 'css', 'frontend', 'python',
    'data-science', 'analytics', 'api', 'react'
  ];

  useEffect(() => {
    loadFavorites();
    applyFilters();
  }, [activeTab, categoryFilters, searchQuery, sortOption]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch (err) {
      console.error('Fout bij laden favorieten', err);
    }
  };

  const toggleFavorite = async (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(updated));
  };

  const applyFilters = () => {
    if (!reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const filteredCourses = () => {
    let filtered = courseData;
    if (!Array.isArray(filtered)) return [];

    if (activeTab === 'populair') {
      filtered = [...filtered].sort((a, b) => b.views - a.views);
    } else if (activeTab === 'beginner' || activeTab === 'gevorderd') {
      filtered = filtered.filter((course) =>
        course.level === (activeTab === 'beginner' ? 'Beginner' : 'Gevorderd')
      );
    } else if (activeTab === 'favorieten') {
      filtered = filtered.filter((c) => favorites.includes(c.id));
    }

    if (categoryFilters.length > 0) {
      filtered = filtered.filter((course) =>
        course.categories?.some((cat) => categoryFilters.includes(cat))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q)
      );
    }

    if (sortOption === 'populariteit') {
      filtered = [...filtered].sort((a, b) => b.views - a.views);
    } else if (sortOption === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'duur') {
      filtered = [...filtered].sort((a, b) =>
        parseInt(a.duration) - parseInt(b.duration)
      );
    }

    return filtered;
  };

  const tabs = ['all', 'beginner', 'gevorderd', 'populair', 'favorieten'];
  const tabLabels = {
    all: 'Alle Cursussen',
    beginner: 'Voor Beginners',
    gevorderd: 'Gevorderd',
    populair: 'Meest Bekeken',
    favorieten: `Favorieten (${favorites.length})`,
  };

  const handleCoursePress = (course) => setSelectedCourse(course);
  const closeModal = () => setSelectedCourse(null);

  return (
    <View style={styles.dashboard}>
      {/* search bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek cursus op titel of trefwoord..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* tab bar */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.7}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tabLabels[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* content */}
      <View style={styles.content}>
        <View style={styles.headerWithFilter}>
          <Text style={styles.sectionTitle}>{tabLabels[activeTab]}</Text>
          <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)} style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#3498db" />
          </TouchableOpacity>
        </View>

        {/* categories */}
        {isFilterVisible && (
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownGrid}>
              {allCategories.map((category) => {
                const selected = categoryFilters.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    onPress={() => {
                      setCategoryFilters((prev) =>
                        selected ? prev.filter((c) => c !== category) : [...prev, category]
                      );
                    }}
                    style={styles.dropdownItem}
                  >
                    <Ionicons
                      name={selected ? 'checkbox-outline' : 'square-outline'}
                      size={20}
                      color={selected ? '#3498db' : '#aaa'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.dropdownLabel}>{category}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* sorting */}
        <ScrollView>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {['populariteit', 'rating', 'duur'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.sortOption, sortOption === option && styles.activeSortOption]}
                onPress={() => setSortOption(option)}
              >
                <Text style={{ color: sortOption === option ? '#fff' : '#333' }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {categoryFilters.length > 0 && (
            <TouchableOpacity onPress={() => setCategoryFilters([])} style={{ marginBottom: 10 }}>
              <Text style={{ color: 'red' }}>Wis filters ({categoryFilters.length})</Text>
            </TouchableOpacity>
          )}

          {isLoading ? (
            <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />
          ) : filteredCourses().length === 0 ? (
            <Text style={{ marginTop: 20, color: '#888', fontStyle: 'italic' }}>
              Geen cursussen gevonden...
            </Text>
          ) : (
            <CourseList
              courses={filteredCourses()}
              onPress={handleCoursePress}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </ScrollView>

        <View style={styles.sidebarContainer}>
          <PopularCourses courses={courseData} />
          <Statistics courses={courseData} />
        </View>


      </View>

      {/* modal */}
      {selectedCourse && (
        <Modal visible={true} transparent={true} animationType="slide" onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={closeModal} style={styles.modalCloseIcon}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
              <Image source={{ uri: selectedCourse.imageUrl }} style={styles.modalImage} />
              <Text style={styles.modalDescription}>{selectedCourse.description}</Text>
              <View style={{ marginTop: 15, alignSelf: 'stretch' }}>
                <Text style={styles.modalInfo}><Text style={styles.modalLabel}>Duur:</Text> {selectedCourse.duration}</Text>
                <Text style={styles.modalInfo}><Text style={styles.modalLabel}>Niveau:</Text> {selectedCourse.level}</Text>
                <Text style={styles.modalInfo}><Text style={styles.modalLabel}>Instructeur:</Text> {selectedCourse.instructor}</Text>
                <Text style={styles.modalInfo}><Text style={styles.modalLabel}>Leden:</Text> {selectedCourse.members}</Text>
                <Text style={styles.modalInfo}><Text style={styles.modalLabel}>Rating:</Text> {selectedCourse.rating} ⭐</Text>
              </View>
              <TouchableOpacity onPress={() => Linking.openURL(selectedCourse.videoUrl)}>
                <Text style={{ color: '#3498db', marginTop: 15 }}>Bekijk video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: { flex: 1, backgroundColor: '#fff' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    margin: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
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
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 16,
    marginRight: 10,
  },
  activeSortOption: {
    backgroundColor: '#3498db',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalDescription: { fontSize: 16, color: '#555', marginTop: 10, textAlign: 'center' },
  modalImage: { width: '100%', height: 150, resizeMode: 'cover', borderRadius: 8 },
  modalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  dropdownContainer: {
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  padding: 10,
  marginVertical: 10,
  borderWidth: 1,
  borderColor: '#ddd',
},

dropdownGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},

dropdownItem: {
  width: '48%',
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 6,
  paddingHorizontal: 4,
  marginBottom: 8,
  backgroundColor: '#fff',
  borderRadius: 6,
},

dropdownLabel: {
  color: '#333',
  fontSize: 14,
  flexShrink: 1,
},

  modalInfo: {
    fontSize: 15,
    color: '#333',
    marginTop: 5,
  },
  modalLabel: {
    fontWeight: '600',
    color: '#000',
  },
});

export default Dashboard;


