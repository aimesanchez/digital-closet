import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { colors } from "../constants/colors";
import { sampleClothing } from "../data/sampleClothing";
import ClothingCard from "../components/ClothingCard";

export default function ClosetScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Closet</Text>
          <Text style={styles.subtitle}>
            {sampleClothing.length} items
          </Text>
        </View>

        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <Text style={styles.sectionLabel}>FILTERS</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        <Pressable style={styles.filterButton}>
          <Text style={styles.filterText}>Weather</Text>
        </Pressable>

        <Pressable style={styles.filterButton}>
          <Text style={styles.filterText}>Formality</Text>
        </Pressable>

        <Pressable style={styles.filterButton}>
          <Text style={styles.filterText}>Color</Text>
        </Pressable>

        <Pressable style={styles.filterButton}>
          <Text style={styles.filterText}>Type</Text>
        </Pressable>
      </ScrollView>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
      >
        <Pressable style={styles.activeCategory}>
          <Text style={styles.activeCategoryText}>All</Text>
        </Pressable>

        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryText}>Tops</Text>
        </Pressable>

        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryText}>Bottoms</Text>
        </Pressable>

        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryText}>Footwear</Text>
        </Pressable>

        <Pressable style={styles.categoryButton}>
          <Text style={styles.categoryText}>Accessories</Text>
        </Pressable>
      </ScrollView>

      {/* Clothing Grid */}
      <View style={styles.grid}>
        {sampleClothing.map((item) => (
          <ClothingCard key={item.id} item={item} />
        ))}
      </View>

      {/* Add Clothing */}
      <Pressable style={styles.addItemButton}>
        <Text style={styles.addItemText}>+ Add clothing item</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 3,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 30,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.secondaryText,
    marginBottom: 10,
  },

  filterRow: {
    marginBottom: 22,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  filterText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },

  categoryRow: {
    marginBottom: 22,
  },

  activeCategory: {
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 10,
  },

  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.accentLight,
  },

  categoryText: {
    color: colors.text,
    fontWeight: "500",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  addItemButton: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },

  addItemText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});