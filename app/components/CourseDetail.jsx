import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";

const CourseDetail = ({ course, onBack }) => {
  if (!course) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Geen cursus geselecteerd.</Text>
      </View>
    );
  }

  const openCourseVideo = () => {
    if (course.videoUrl) {
      Linking.openURL(course.videoUrl).catch((err) => {
        console.error("Kan video niet openen:", err);
      });
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (halfStar) {
      stars.push("☆"); // optioneel: hier zou een halve ster kunnen
    }
    while (stars.length < 5) {
      stars.push("☆");
    }
    return stars.join(" ");
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: course.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.instructor}>Instructeur: {course.instructor}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Niveau:</Text>
          <Text style={styles.value}>{course.level}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Duur:</Text>
          <Text style={styles.value}>{course.duration}</Text>
        </View>

        {/* Extra informatie */}
        <View style={styles.extraInfoContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Leden:</Text>
            <Text style={styles.value}>{course.members.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Weergaven:</Text>
            <Text style={styles.value}>{course.views.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Beoordeling:</Text>
            <Text style={[styles.value, styles.rating]}>
              {renderStars(course.rating)} ({course.rating.toFixed(1)})
            </Text>
          </View>

          <View style={styles.categoriesContainer}>
            {course.categories.map((cat, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.description}>{course.description}</Text>

        <Text style={styles.subheading}>Wat je gaat leren:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Overzicht van de cursusinhoud</Text>
          <Text style={styles.bulletItem}>• Praktische oefeningen</Text>
          <Text style={styles.bulletItem}>• Fundamentele concepten begrijpen</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.videoButton} onPress={openCourseVideo}>
            <Text style={styles.buttonText}>Bekijk Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.buttonText}>Terug</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  image: {
    width: "100%",
    height: 220,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
  },
  instructor: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontWeight: "500",
    color: "#666",
    marginRight: 6,
    width: 100,
  },
  value: {
    color: "#333",
    fontSize: 15,
  },
  rating: {
    color: "#f1c40f",
  },
  extraInfoContainer: {
    marginVertical: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  categoryBadge: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 15,
    color: "#444",
    marginVertical: 12,
    lineHeight: 21,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 10,
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 12,
    marginBottom: 20,
  },
  bulletItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  videoButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
    marginRight: 8,
  },
  backButton: {
    backgroundColor: "#95a5a6",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 15,
  },
});

export default CourseDetail;
