import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import { useCloset } from "../context/ClosetContext";
import ClothingCard from "../components/ClothingCard";
import SafeScreen from "../components/SafeScreen";

export default function ClosetScreen({ navigation }) {
  const { clothingItems } = useCloset();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedWeather, setSelectedWeather] = useState("All");
  const [showWeatherOptions, setShowWeatherOptions] = useState(false);

  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [showOccasionOptions, setShowOccasionOptions] = useState(false);
  const [customOccasionFilter, setCustomOccasionFilter] = useState("");


  const [selectedColor, setSelectedColor] = useState("All");
  const [showColorOptions, setShowColorOptions] = useState(false);

  const availableColors = [
    "All",
    ...new Set(
      clothingItems
      .map((item) => item.color)
      .filter(Boolean)
    ),
  ];

  const defaultOccasions = [
    "Casual",
    "School / Work",
    "Formal",
    "Active / Gym", 
    "Date Night",
  ];

  const availableOccasions = [
    "All",
    ...new Set([
      ...defaultOccasions,
      ...clothingItems.flatMap((item) => item.occasions || []),
    ])
  ];

  const filteredItems = clothingItems.filter((item) => {
  const matchesCategory =
    selectedCategory === "All" ||
    item.category === selectedCategory;

  const matchesWeather =
    selectedWeather === "All" ||
    (item.weather || []).includes(selectedWeather);

  const matchesOccasion = 
  selectedOccasion === "All" ||
  (
    selectedOccasion === "Other"
    ? (item.occasions || []).some(
      (occasion) =>
        occasion
      .toLowerCase()
      .includes(
        customOccasionFilter
        .trim()
        .toLowerCase()
      )
    )
  :(item.occasions || []).includes(
    selectedOccasion
  )
);

  const matchesColor =
    selectedColor === "All"||
    item.color === selectedColor;


  return (
    matchesCategory &&
    matchesWeather &&
    matchesOccasion &&
    matchesColor
  );
});

  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
  <View>
    <Text style={styles.eyebrow}>
      MY WARDROBE
    </Text>

    <Text style={styles.title}>
      My Closet
    </Text>

    <Text style={styles.subtitle}>
      {clothingItems.length}{" "}
      {clothingItems.length === 1
        ? "piece"
        : "pieces"}
    </Text>
  </View>

  <Pressable
    style={({ pressed }) => [
      styles.addButton,
      pressed && styles.buttonPressed,
    ]}
    onPress={() =>
      navigation.navigate("AddItem")
    }
  >
    <Ionicons
      name="add"
      size={25}
      color="#FFFFFF"
    />
  </Pressable>
</View>

       {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
        >
          {[
            "All",
            "Tops",
            "Bottoms",
            "Dresses",
            "Footwear",
            "Accessories",
          ].map((category) => {
            const isActive = selectedCategory === category;

            return (
              <Pressable
                key={category}
                style={
                  isActive
                    ? styles.activeCategory
                    : styles.categoryButton
                }
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={
                    isActive
                      ? styles.activeCategoryText
                      : styles.categoryText
                  }
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Filters */}
        <View style={styles.filterHeader}>
          <View>
            <Text style={styles.filterTitle}>
              Refine
          </Text>

          <Text style={styles.filterSubtitle}>
            Narrow down your wardrobe
          </Text>
        </View>

        <Ionicons
          name="options-outline"
          size={20}
          color={colors.accent}
        />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
        <Pressable
  style={[
    styles.filterButton,
    selectedWeather !== "All" &&
      styles.filterButtonActive,
  ]}
  onPress={() =>
    setShowWeatherOptions(
      !showWeatherOptions
    )
  }
>
  <Ionicons
    name="partly-sunny-outline"
    size={16}
    color={
      selectedWeather !== "All"
        ? colors.accent
        : colors.secondaryText
    }
  />

  <Text style={styles.filterText}>
    {selectedWeather === "All"
      ? "Weather"
      : selectedWeather}
  </Text>

  <Ionicons
    name={
      showWeatherOptions
        ? "chevron-up"
        : "chevron-down"
    }
    size={14}
    color={colors.secondaryText}
  />
</Pressable>

<Pressable
  style={[
    styles.filterButton,
    selectedOccasion !== "All" &&
      styles.filterButtonActive,
  ]}
  onPress={() =>
    setShowOccasionOptions(
      !showOccasionOptions
    )
  }
>
  <Ionicons
    name="sparkles-outline"
    size={16}
    color={
      selectedOccasion !== "All"
        ? colors.accent
        : colors.secondaryText
    }
  />

  <Text style={styles.filterText}>
    {selectedOccasion === "All"
      ? "Occasion"
      : selectedOccasion}
  </Text>

  <Ionicons
    name={
      showOccasionOptions
        ? "chevron-up"
        : "chevron-down"
    }
    size={14}
    color={colors.secondaryText}
  />
</Pressable>

<Pressable
  style={[
    styles.filterButton,
    selectedColor !== "All" &&
      styles.filterButtonActive,
  ]}
  onPress={() =>
    setShowColorOptions(
      !showColorOptions
    )
  }
>
  <Ionicons
    name="color-palette-outline"
    size={16}
    color={
      selectedColor !== "All"
        ? colors.accent
        : colors.secondaryText
    }
  />

  <Text style={styles.filterText}>
    {selectedColor === "All"
      ? "Color"
      : selectedColor}
  </Text>

  <Ionicons
    name={
      showColorOptions
        ? "chevron-up"
        : "chevron-down"
    }
    size={14}
    color={colors.secondaryText}
  />
</Pressable>

        </ScrollView>

        {showWeatherOptions && (
          <View style={styles.weatherOptions}>
            {["All", "Hot", "Warm", "Cool", "Cold"].map((option) => (
          <Pressable
            key={option}
            style={[
            styles.weatherOptionButton,
            selectedWeather === option &&
              styles.weatherOptionButtonSelected,
        ]}
        onPress={() => {
          setSelectedWeather(option);
          setShowWeatherOptions(false);
        }}
      >
        <Text
          style={[
            styles.weatherOptionText,
            selectedWeather === option &&
              styles.weatherOptionTextSelected,
          ]}
        >
          {option}
        </Text>
      </Pressable>
    ))}
  </View>
)}
{showOccasionOptions && (
  <View style={styles.weatherOptions}>
    {availableOccasions.map((option)=> (
      <Pressable
      key={option}
      style={[
        styles.weatherOptionButton,
        selectedOccasion === option &&
        styles.weatherOptionButtonSelected,
      ]}
      onPress={() => {
        setSelectedOccasion(option);

        if (option !== "Other") {
          setCustomOccasionFilter("");
          setShowOccasionOptions(false);
        }
        
      }}
      >
        <Text
        style={[
          styles.weatherOptionText,
          selectedOccasion === option &&
          styles.weatherOptionTextSelected,
        ]}
        >
          {option}
        </Text>
      </Pressable>
    ))}
  </View>
)}
{selectedOccasion === "Other" && (
  <View style={styles.customOccasionContainer}>
    <TextInput
      style={styles.customOccasionInput}
      placeholder="Type an occasion..."
      placeholderTextColor={
        colors.secondaryText
      }
      value={customOccasionFilter}
      onChangeText={
        setCustomOccasionFilter
      }
      autoCapitalize="words"
    />

    <Pressable
      style={
        styles.customOccasionDoneButton
      }
      onPress={() =>
        setShowOccasionOptions(false)
      }
    >
      <Text
        style={
          styles.customOccasionDoneText
        }
      >
        Done
      </Text>
    </Pressable>
  </View>
)}

{showColorOptions && (
  <View style={styles.weatherOptions}>
    {availableColors.map((option) => (
      <Pressable
        key={option}
        style={[
          styles.weatherOptionButton,
          selectedColor === option &&
            styles.weatherOptionButtonSelected,
        ]}
        onPress={() => {
          setSelectedColor(option);
          setShowColorOptions(false);
        }}
      >
        <Text
          style={[
            styles.weatherOptionText,
            selectedColor === option &&
              styles.weatherOptionTextSelected,
          ]}
        >
          {option}
        </Text>
      </Pressable>
    ))}
  </View>
)}

<View style={styles.resultsHeader}>
  <Text style={styles.resultsText}>
    {filteredItems.length}{" "}
    {filteredItems.length === 1
      ? "piece"
      : "pieces"}
  </Text>

  {(selectedCategory !== "All" ||
    selectedWeather !== "All" ||
    selectedOccasion !== "All" ||
    selectedColor !== "All") && (
    <Pressable
      onPress={() => {
        setSelectedCategory("All");
        setSelectedWeather("All");
        setSelectedOccasion("All");
        setSelectedColor("All");
        setCustomOccasionFilter("");
      }}
    >
      <Text style={styles.clearFiltersText}>
        Clear filters
      </Text>
    </Pressable>
  )}
</View>

      {/* Clothing Grid */}
{filteredItems.length > 0 ? (
  <View style={styles.grid}>
    {filteredItems.map((item) => (
      <ClothingCard
        key={item.id}
        item={item}
        onPress={() =>
          navigation.navigate(
            "AddItem",
            {
              itemToEdit: item,
            }
          )
        }
      />
    ))}
  </View>
) : (
  <View style={styles.emptyState}>
    <View style={styles.emptyStateIcon}>
      <Ionicons
        name="shirt-outline"
        size={25}
        color={colors.accent}
      />
    </View>

    <Text style={styles.emptyStateTitle}>
      No pieces found
    </Text>

    <Text style={styles.emptyStateText}>
      Try changing or clearing your filters.
    </Text>
  </View>
)}

      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 44,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  eyebrow: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.accent,
    marginBottom: 3,
  },

  title: {
    fontFamily: typography.extraBold,
    fontSize: 34,
    letterSpacing: -1.2,
    color: colors.text,
  },

  subtitle: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 3,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.82,
  },

  /* CATEGORIES */

  categoryRow: {
    marginBottom: 30,
  },

  activeCategory: {
    backgroundColor: colors.accent,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 9,
  },

  activeCategoryText: {
    fontFamily: typography.semibold,
    color: "#FFFFFF",
    fontSize: 13,
  },

  categoryButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 9,
    backgroundColor: colors.surface,
  },

  categoryText: {
    fontFamily: typography.medium,
    color: colors.text,
    fontSize: 13,
  },

  /* FILTERS */

  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  filterTitle: {
    fontFamily: typography.bold,
    fontSize: 17,
    letterSpacing: -0.3,
    color: colors.text,
  },

  filterSubtitle: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },

  filterRow: {
    marginBottom: 16,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 13,
    marginRight: 9,
    borderWidth: 1,
    borderColor: "transparent",
  },

  filterButtonActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentLight,
  },

  filterText: {
    fontFamily: typography.medium,
    color: colors.text,
    fontSize: 12,
  },

  /* EXPANDED FILTER OPTIONS */

  weatherOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  weatherOptionButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
  },

  weatherOptionButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  weatherOptionText: {
    fontFamily: typography.medium,
    color: colors.text,
    fontSize: 12,
  },

  weatherOptionTextSelected: {
    color: "#FFFFFF",
  },

  customOccasionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 18,
  },

  customOccasionInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.text,
    fontFamily: typography.regular,
    fontSize: 13,
  },

  customOccasionDoneButton: {
    backgroundColor: colors.accent,
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },

  customOccasionDoneText: {
    fontFamily: typography.semibold,
    color: "#FFFFFF",
    fontSize: 13,
  },

  /* RESULTS */

  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 14,
  },

  resultsText: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: colors.text,
  },

  clearFiltersText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.accent,
  },

  /* CLOTHING GRID */

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* EMPTY STATE */

  emptyState: {
    minHeight: 250,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyStateIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  emptyStateTitle: {
    fontFamily: typography.bold,
    fontSize: 17,
    color: colors.text,
  },

  emptyStateText: {
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 4,
  },
});