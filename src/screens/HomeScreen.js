import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
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
            <View style={styles.header}>
              <View>
              <Text style={styles.greeting}>
                GOOD MORNING
                </Text>

                <Text style={styles.name}>
                  Aime
                  </Text>
                </View>
            </View>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() =>
              navigation.navigate("Profile")
            }
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
                  <View style={styles.weatherLabelRow}>
                    <Ionicons
                      name="partly-sunny-outline"
                      size={14}
                      color="rgba(255,255,255,0.72)"
                    />

                    <Text style={styles.sectionLabel}>
                      TODAY
                    </Text>
                  </View>

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

              <View style={styles.weatherDetails}>
  <View style={styles.weatherDetail}>
    <Ionicons
      name="water-outline"
      size={17}
      color="rgba(255,255,255,0.78)"
    />

    <Text style={styles.weatherDetailText}>
      {currentWeather.rainChance}% rain
    </Text>
  </View>

  <View style={styles.weatherDetailDivider} />

  <View style={styles.weatherDetail}>
    <Ionicons
      name="sunny-outline"
      size={17}
      color="rgba(255,255,255,0.78)"
    />

    <Text style={styles.weatherDetailText}>
      UV {currentWeather.uvIndex}
    </Text>
  </View>
</View>
            </>
          ) : null}
        </View>

{/* TODAY'S OUTFIT */}

<View style={styles.sectionHeader}>
  <View>
    <Text style={styles.sectionEyebrow}>
      YOUR LOOK
    </Text>

    <Text style={styles.sectionTitle}>
      Today's Outfit
    </Text>
  </View>

  {currentOutfit && (
    <Pressable
      style={styles.editButton}
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
      <Ionicons
        name="pencil-outline"
        size={15}
        color={colors.accent}
      />

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
  <View style={styles.emptyOutfitIcon}>
    <Ionicons
      name="color-wand-outline"
      size={24}
      color={colors.accent}
    />
  </View>

  <Text style={styles.emptyOutfitTitle}>
    Create today's outfit
  </Text>

  <Text style={styles.emptyOutfitSubtitle}>
    Build a look from your closet
  </Text>

  <View style={styles.emptyOutfitAction}>
    <Text style={styles.emptyOutfitActionText}>
      Start styling
    </Text>

    <Ionicons
      name="arrow-forward"
      size={16}
      color={colors.accent}
    />
  </View>
</Pressable>
)}

       {/* SUGGESTED ACCESSORIES */}

{accessoryRecommendations.length >
  0 && (
  <>
 <View style={styles.accessoryHeading}>
  <Text style={styles.sectionEyebrow}>
    COMPLETE THE LOOK
  </Text>

  <Text style={styles.sectionTitle}>
    Suggested for you
  </Text>
</View>

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

              <View style={styles.accessoryAddButton}>
                <Ionicons
                  name="add"
                  size={17}
                  color="#FFFFFF"
                />
              </View>
            </Pressable>
          );
        }
      )}
    </ScrollView>
  </>
)}

        {/* CLOSET */}
      <Pressable
  style={({ pressed }) => [
    styles.closetButton,
    pressed && styles.buttonPressed,
  ]}
  onPress={() =>
    navigation.navigate("Closet")
  }
>
  <View>
    <Text style={styles.closetLabel}>
      MY WARDROBE
    </Text>

    <Text style={styles.closetButtonText}>
      My Closet
    </Text>

    <Text style={styles.closetButtonSubtext}>
      {clothingItems.length}{" "}
      {clothingItems.length === 1
        ? "piece"
        : "pieces"}
    </Text>
  </View>

  <View style={styles.closetArrow}>
    <Ionicons
      name="arrow-forward"
      size={20}
      color="#FFFFFF"
    />
          </View>
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
    paddingTop: 26,
    paddingBottom: 44,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.secondaryText,
    marginBottom: 3,
  },

  name: {
    fontFamily: typography.extraBold,
    fontSize: 34,
    letterSpacing: -1.2,
    color: colors.text,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    fontFamily: typography.bold,
    fontSize: 17,
    color: colors.accent,
  },

  /* WEATHER */

  weatherCard: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    padding: 22,
    marginBottom: 34,
  },

  weatherTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  weatherLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  sectionLabel: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1.3,
    color: "rgba(255,255,255,0.72)",
  },

  temperature: {
    fontFamily: typography.extraBold,
    fontSize: 50,
    letterSpacing: -2,
    color: "#FFFFFF",
    marginTop: 8,
  },

  weatherDescription: {
    fontFamily: typography.medium,
    marginTop: 2,
    fontSize: 14,
    color: "rgba(255,255,255,0.76)",
  },

  weatherCategoryBadge: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  weatherCategoryText: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: "#FFFFFF",
  },

  weatherStatusText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: "#FFFFFF",
  },

  weatherDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },

  weatherDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  weatherDetailText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
  },

  weatherDetailDivider: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginHorizontal: 16,
  },

  /* SECTION HEADERS */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },

  sectionEyebrow: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1.3,
    color: colors.accent,
    marginBottom: 4,
  },

  sectionTitle: {
    fontFamily: typography.bold,
    fontSize: 21,
    letterSpacing: -0.5,
    color: colors.text,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  editText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.accent,
  },

  /* OUTFIT */

  outfitPreview: {
    width: "100%",
    height: 380,
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginBottom: 34,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  outfitPreviewImage: {
    width: "100%",
    height: "100%",
  },

  emptyOutfitCard: {
    minHeight: 220,
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginBottom: 34,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyOutfitIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  emptyOutfitTitle: {
    fontFamily: typography.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    color: colors.text,
  },

  emptyOutfitSubtitle: {
    fontFamily: typography.regular,
    marginTop: 5,
    fontSize: 13,
    color: colors.secondaryText,
  },

  emptyOutfitAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 18,
  },

  emptyOutfitActionText: {
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.accent,
  },

  /* ACCESSORIES */

  accessoryHeading: {
    marginBottom: 14,
  },

  accessoriesContainer: {
    marginBottom: 34,
  },

  accessoryCard: {
    width: 124,
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginRight: 12,
    padding: 10,
  },

  accessoryImage: {
    width: "100%",
    height: 100,
    marginBottom: 8,
  },

  accessoryName: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
  },

  accessoryAddButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 9,
  },

  /* CLOSET */

  closetButton: {
    backgroundColor: colors.accent,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  closetLabel: {
    fontFamily: typography.bold,
    fontSize: 9,
    letterSpacing: 1.3,
    color: "rgba(255,255,255,0.62)",
    marginBottom: 4,
  },

  closetButtonText: {
    fontFamily: typography.bold,
    color: "#FFFFFF",
    fontSize: 19,
    letterSpacing: -0.3,
  },

  closetButtonSubtext: {
    fontFamily: typography.regular,
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 3,
  },

  closetArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.82,
  },
});