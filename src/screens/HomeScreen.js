import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";

import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import { useWeather } from "../context/WeatherContext";
import { useCloset } from "../context/ClosetContext";

export default function HomeScreen({
  navigation,
}) {
  const {
    currentWeather,
    weatherLoading,
    weatherError,
  } = useWeather();

  const {
    clothingItems,
    currentOutfit,
  } = useCloset();

  const currentOutfitItemIds =
  new Set(
    (currentOutfit?.pieces || []).map(
      (piece) => piece.itemId
    )
  );

const accessoryRecommendations =
  currentOutfit
    ? clothingItems
        .filter(
          (item) =>
            item.category ===
              "Accessories" &&
            !currentOutfitItemIds.has(
              item.id
            )
        )
        .map((item) => {
          let score = 0;

          const matchesWeather =
            !currentOutfit.weather ||
            (item.weather || []).includes(
              currentOutfit.weather
            );

          const matchesOccasion =
            !currentOutfit.occasions
              ?.length ||
            currentOutfit.occasions.some(
              (occasion) =>
                (
                  item.occasions || []
                ).includes(
                  occasion
                )
            );

          if (matchesWeather) {
            score += 3;
          }

          if (matchesOccasion) {
            score += 3;
          }

          const typeBonus = {
            Glasses: 3,
            Jewelry: 3,
            Belt: 2,
            Bag: 2,
            Hat: 2,
            Scarf: 1,
            "Hair Accessory": 1,
            Other: 0,
          };

          score +=
            typeBonus[
              item.subCategory
            ] || 0;

          return {
            ...item,
            recommendationScore:
              score,
          };
        })
        .filter(
          (item) =>
            item.recommendationScore >
            0
        )
        .sort(
          (a, b) =>
            b.recommendationScore -
            a.recommendationScore
        )
        .slice(0, 4)
    : [];

  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Good morning
            </Text>

            <Text style={styles.name}>
              Aime
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
          >
            <Text
              style={
                styles.profileInitial
              }
            >
              A
            </Text>
          </Pressable>
        </View>

        {/* WEATHER */}

        <View style={styles.weatherCard}>
          {weatherLoading ? (
            <Text
              style={
                styles.weatherStatusText
              }
            >
              Loading weather...
            </Text>
          ) : weatherError ? (
            <Text
              style={
                styles.weatherStatusText
              }
            >
              {weatherError}
            </Text>
          ) : currentWeather ? (
            <>
              <View
                style={
                  styles.weatherTopRow
                }
              >
                <View>
                  <Text
                    style={
                      styles.sectionLabel
                    }
                  >
                    TODAY'S WEATHER
                  </Text>

                  <Text
                    style={
                      styles.temperature
                    }
                  >
                    {
                      currentWeather.temperature
                    }
                    °F
                  </Text>
                </View>

                <View
                  style={
                    styles.weatherCategoryBadge
                  }
                >
                  <Text
                    style={
                      styles.weatherCategoryText
                    }
                  >
                    {
                      currentWeather.weatherCategory
                    }
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.weatherDescription
                }
              >
                {currentWeather.condition}
                {" • Feels like "}
                {currentWeather.feelsLike}
                °F
              </Text>

              {currentWeather.rainExpected && (
                <View
                  style={
                    styles.weatherNotice
                  }
                >
                  <Text
                    style={
                      styles.weatherNoticeTitle
                    }
                  >
                    Rain expected later
                  </Text>

                  <Text
                    style={
                      styles.weatherNoticeText
                    }
                  >
                    {
                      currentWeather.rainChance
                    }
                    % chance of rain today.
                    Consider bringing an
                    umbrella or rain layer.
                  </Text>
                </View>
              )}
            </>
          ) : null}
        </View>

{/* TODAY'S OUTFIT */}

<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>
    Today's Outfit
  </Text>

  {currentOutfit && (
    <Pressable
      onPress={() =>
        navigation
          .getParent()
          ?.navigate(
            "OutfitBuilder",
            {
              outfitToEdit:
                currentOutfit,
            }
          )
      }
    >
      <Text style={styles.editText}>
        Edit
      </Text>
    </Pressable>
  )}
</View>

{currentOutfit ? (
  <View style={styles.outfitPreview}>
    <Image
      key={
        currentOutfit.updatedAt
      }
      source={{
        uri:
          currentOutfit.imageUri,
      }}
      style={
        styles.outfitPreviewImage
      }
      resizeMode="contain"
    />
  </View>
) : (
  <Pressable
    style={styles.emptyOutfitCard}
    onPress={() =>
      navigation.navigate(
        "Create Outfit"
      )
    }
  >
    <Text
      style={
        styles.emptyOutfitTitle
      }
    >
      Create today's outfit
    </Text>

    <Text
      style={
        styles.emptyOutfitSubtitle
      }
    >
      Build a look from your closet
    </Text>
  </Pressable>
)}

       {/* SUGGESTED ACCESSORIES */}

{accessoryRecommendations.length >
  0 && (
  <>
    <Text style={styles.sectionTitle}>
      Suggested Accessories
    </Text>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={
        false
      }
      style={
        styles.accessoriesContainer
      }
    >
      {accessoryRecommendations.map(
        (item) => {
          const imageSource =
            item.processedImageUri ||
            item.imageUri;

          return (
            <Pressable
              key={item.id}
              style={
                styles.accessoryCard
              }
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate(
                    "OutfitBuilder",
                    {
                      outfitToEdit:
                        currentOutfit,

                      accessoryToAdd:
                        item,
                    }
                  )
              }
            >
              {imageSource && (
                <Image
                  source={{
                    uri: imageSource,
                  }}
                  style={
                    styles.accessoryImage
                  }
                  resizeMode="contain"
                />
              )}

              <Text
                style={
                  styles.accessoryName
                }
                numberOfLines={1}
              >
                {item.name ||
                  item.subCategory ||
                  "Accessory"}
              </Text>

              <Text
                style={
                  styles.accessoryAddText
                }
              >
                + Add
              </Text>
            </Pressable>
          );
        }
      )}
    </ScrollView>
  </>
)}

        {/* CLOSET */}

        <Pressable
          style={styles.closetButton}
        >
          <View>
            <Text
              style={
                styles.closetButtonText
              }
            >
              My Closet
            </Text>

            <Text
              style={
                styles.closetButtonSubtext
              }
            >
              Browse your wardrobe
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    fontSize: 15,
    color:
      colors.secondaryText,
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },

  profileButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor:
      colors.accentLight,

    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent,
  },

  /* WEATHER */

  weatherCard: {
    backgroundColor:
      colors.accentLight,

    borderRadius: 22,

    padding: 20,

    marginBottom: 28,
  },

  weatherTopRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "flex-start",
  },

  sectionLabel: {
    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 1,

    color:
      colors.secondaryText,

    marginBottom: 5,
  },

  temperature: {
    fontSize: 36,

    fontWeight: "700",

    color: colors.text,
  },

  weatherDescription: {
    marginTop: 6,

    fontSize: 15,

    color:
      colors.secondaryText,
  },

  weatherCategoryBadge: {
    backgroundColor:
      colors.surface,

    borderRadius: 18,

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderWidth: 1,

    borderColor:
      colors.border,
  },

  weatherCategoryText: {
    fontSize: 13,

    fontWeight: "700",

    color: colors.text,
  },

  weatherStatusText: {
    fontSize: 15,

    color:
      colors.secondaryText,
  },

  weatherNotice: {
    marginTop: 16,

    padding: 14,

    borderRadius: 16,

    backgroundColor:
      colors.surface,
  },

  weatherNoticeTitle: {
    fontSize: 14,

    fontWeight: "700",

    color: colors.text,
  },

  weatherNoticeText: {
    fontSize: 13,

    lineHeight: 18,

    color:
      colors.secondaryText,

    marginTop: 4,
  },

  /* SECTION HEADERS */

  sectionHeader: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,

    fontWeight: "700",

    color: colors.text,

    marginBottom: 14,
  },

  editText: {
    color: colors.accent,

    fontWeight: "600",

    marginBottom: 14,
  },

  /* OUTFIT */
outfitPreview: {
  width: "100%",

  height: 390,

  marginBottom: 30,

  justifyContent: "center",
  alignItems: "center",
},

outfitPreviewImage: {
  width: "100%",
  height: "100%",
},

emptyOutfitCard: {
  minHeight: 180,

  backgroundColor:
    colors.surface,

  borderRadius: 24,

  marginBottom: 30,

  justifyContent: "center",
  alignItems: "center",

  paddingHorizontal: 24,

  borderWidth: 1,
  borderColor:
    colors.border,
},

emptyOutfitTitle: {
  fontSize: 17,

  fontWeight: "700",

  color: colors.text,
},

emptyOutfitSubtitle: {
  marginTop: 6,

  fontSize: 13,

  color:
    colors.secondaryText,
},
  /* ACCESSORIES */

  accessoriesContainer: {
    marginBottom: 28,
  },

  accessoryCard: {
  width: 120,

  backgroundColor:
    colors.surface,

  borderRadius: 20,

  marginRight: 12,

  paddingTop: 10,
  paddingHorizontal: 10,
  paddingBottom: 12,

  alignItems: "center",

  borderWidth: 1,

  borderColor:
    colors.border,
},

  accessoryName: {
    fontSize: 12,

    fontWeight: "600",

    color: colors.text,

    textAlign: "center"
  },
  savedOutfitCard: {
  width: "100%",

  aspectRatio: 1,

  backgroundColor:
    colors.surface,

  borderRadius: 22,

  marginBottom: 28,

  borderWidth: 1,

  borderColor:
    colors.border,

  overflow: "hidden",
},

savedOutfitImage: {
  width: "100%",
  height: "100%",
},

emptyOutfitText: {
  color:
    colors.secondaryText,

  textAlign: "center",

  paddingVertical: 30,
},

accessoryImage: {
  width: 88,
  height: 88,

  marginBottom: 4,
},

accessoryAddText: {
  color: colors.accent,

  fontSize: 12,

  fontWeight: "700",

  marginTop: 5,
},

  /* CLOSET */

  closetButton: {
    backgroundColor:
      colors.accent,

    paddingVertical: 18,
    paddingHorizontal: 20,

    borderRadius: 20,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  closetButtonText: {
    color: "#FFFFFF",

    fontSize: 18,

    fontWeight: "700",
  },

  closetButtonSubtext: {
    color: "#F5EDE9",

    fontSize: 13,

    marginTop: 3,
  },

  arrow: {
    color: "#FFFFFF",

    fontSize: 32,
  },
});