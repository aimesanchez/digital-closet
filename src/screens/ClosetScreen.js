import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";

import { colors } from "../constants/colors";
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
            <Text style={styles.title}>My Closet</Text>

            <Text style={styles.subtitle}>
              {clothingItems.length} items
            </Text>
          </View>

          <Pressable 
          style={styles.addButton}
          onPress={() => navigation.navigate("AddItem")}
          >
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
          <Pressable
            style={styles.filterButton}
            onPress={() => setShowWeatherOptions(!showWeatherOptions)}
        >
          <Text style={styles.filterText}>
            {selectedWeather === "All"
              ? "Weather"
              : `Weather: ${selectedWeather}`}
          </Text>
        </Pressable>

          <Pressable
            style={styles.filterButton}
            onPress={() => setShowOccasionOptions(!showOccasionOptions)}
          >
            <Text style={styles.filterText}>
              {selectedOccasion === "All"
              ? "Occasion"
              : `Occasion: ${selectedOccasion}`}
            </Text>
          </Pressable>

          <Pressable
            style={styles.filterButton}
            onPress={() => setShowColorOptions(!showColorOptions)}
            >

              <Text style={styles.filterText}>
                {selectedColor === "All"
                  ? "Color"
                  : `Color: ${selectedColor}`}
                  </Text>
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
{selectedOccasion === "Other"&& (
  <View style={styles.customOccasionContainer}>
    <TextInput
    style={styles.customOccasionInput}
    placeholder="Type an occasion..."
    placeholderTextColor={colors.secondaryText}
    accessibilityValue={customOccasionFilter}
    autoCapitalize="words"
    />
    <Pressable
    style={style.customOccasionDoneButton}
    onPress={() =>
      setShowOccasionOptions(false)
    }
  >
    <Text style={style.customOccasionDoneText}>
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

      {/* Clothing Grid */}
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

        {/* Add Clothing */}
        <Pressable 
        style={styles.addItemButton}
        onPress={() => navigation.navigate("AddItem")}
        >
          <Text style={styles.addItemText}>
            + Add clothing item
          </Text>
        </Pressable>
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

  weatherOptions: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 22,
},

weatherOptionButton: {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderRadius: 18,
},

weatherOptionButtonSelected: {
  backgroundColor: colors.accent,
  borderColor: colors.accent,
},

weatherOptionText: {
  color: colors.text,
  fontWeight: "500",
},

weatherOptionTextSelected: {
  color: "#FFFFFF",
},
customOccasionContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  marginBottom: 22,
},

customOccasionInput: {
  flex: 1,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 18,
  paddingHorizontal: 14,
  paddingVertical: 10,
  color: colors.text,
  fontSize: 14,
},

customOccasionDoneButton: {
  backgroundColor: colors.accent,
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 10,
},

customOccasionDoneText: {
  color: "#FFFFFF",
  fontWeight: "600",
},
});