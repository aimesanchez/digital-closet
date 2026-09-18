import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import SafeScreen from "../components/SafeScreen";
import { useProfile } from "../context/ProfileContext";
import { useCloset } from "../context/ClosetContext";

export default function ProfileScreen({ navigation }) {
  const { profile, saveProfile } = useProfile();

  const { clothingItems, savedOutfits } = useCloset();

  const profileInitial = profile.name?.trim()
    ? profile.name.trim().charAt(0).toUpperCase()
    : "?";

  const handleEditPhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert(
          "Photo library permission is required to choose a profile picture."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const selectedImageUri = result.assets[0].uri;

      const profileDirectory =
        `${FileSystem.documentDirectory}profile/`;

      const directoryInfo =
        await FileSystem.getInfoAsync(
          profileDirectory
        );

      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          profileDirectory,
          {
            intermediates: true,
          }
        );
      }

      const permanentImageUri =
        `${profileDirectory}profile-${Date.now()}.jpg`;

      await FileSystem.copyAsync({
        from: selectedImageUri,
        to: permanentImageUri,
      });

      await saveProfile({
        ...profile,
        profileImageUri: permanentImageUri,
      });
    } catch (error) {
      console.error(
        "Error selecting profile photo:",
        error
      );

      alert(
        "Something went wrong while selecting your photo."
      );
    }
  };

  const MenuRow = ({
    icon,
    title,
    subtitle,
    onPress,
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        pressed && styles.menuRowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.accent}
        />
      </View>

      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        <Text style={styles.menuSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={colors.secondaryText}
      />
    </Pressable>
  );

  return (
    <SafeScreen>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* PAGE TITLE */}

        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>
            YOUR ACCOUNT
          </Text>

          <Text style={styles.pageTitle}>
            Profile
          </Text>
        </View>

        {/* PROFILE */}

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              {profile.profileImageUri ? (
                <Image
                  source={{
                    uri: profile.profileImageUri,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {profileInitial}
                </Text>
              )}
            </View>

            <Pressable
              style={styles.photoButton}
              onPress={handleEditPhoto}
            >
              <Ionicons
                name="camera"
                size={15}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          <Text style={styles.name}>
            {profile.name || "Your Name"}
          </Text>

          <Text style={styles.contact}>
            {profile.email ||
              profile.phone ||
              "Add your contact information"}
          </Text>

          <Pressable
            style={styles.editProfileButton}
            onPress={() =>
              navigation
                .getParent()
                ?.navigate(
                  "PersonalInformation"
                )
            }
          >
            <Ionicons
              name="pencil-outline"
              size={15}
              color={colors.accent}
            />

            <Text style={styles.editProfileText}>
              Edit profile
            </Text>
          </Pressable>
        </View>

        {/* WARDROBE STATS */}

        <View style={styles.statsRow}>
          <Pressable
            style={styles.statCard}
            onPress={() =>
              navigation.navigate("Closet")
            }
          >
            <View style={styles.statIcon}>
              <Ionicons
                name="shirt-outline"
                size={19}
                color={colors.accent}
              />
            </View>

            <Text style={styles.statNumber}>
              {clothingItems.length}
            </Text>

            <Text style={styles.statLabel}>
              PIECES
            </Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() =>
              navigation.navigate(
                "Create Outfit"
              )
            }
          >
            <View style={styles.statIcon}>
              <Ionicons
                name="color-wand-outline"
                size={19}
                color={colors.accent}
              />
            </View>

            <Text style={styles.statNumber}>
              {savedOutfits.length}
            </Text>

            <Text style={styles.statLabel}>
              OUTFITS
            </Text>
          </Pressable>
        </View>

        {/* ACCOUNT */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            ACCOUNT
          </Text>

          <View style={styles.menuGroup}>
            <MenuRow
              icon="person-outline"
              title="Personal Information"
              subtitle="Name, email & phone"
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate(
                    "PersonalInformation"
                  )
              }
            />
          </View>
        </View>

        {/* WARDROBE */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            WARDROBE
          </Text>

          <View style={styles.menuGroup}>
            <MenuRow
              icon="heart-outline"
              title="Clothing Care"
              subtitle="Materials & care guidance"
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate(
                    "ClothingCare"
                  )
              }
            />
          </View>
        </View>

        {/* ABOUT */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            ABOUT
          </Text>

          <View style={styles.menuGroup}>
            <MenuRow
              icon="information-circle-outline"
              title="About Digital Closet"
              subtitle="App information"
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate("About")
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 44,
  },

  /* PAGE HEADER */

  pageHeader: {
    marginBottom: 24,
  },

  eyebrow: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.accent,
    marginBottom: 3,
  },

  pageTitle: {
    fontFamily: typography.extraBold,
    fontSize: 34,
    letterSpacing: -1.2,
    color: colors.text,
  },

  /* PROFILE */

  profileHeader: {
    alignItems: "center",
    marginBottom: 28,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarText: {
    fontFamily: typography.extraBold,
    fontSize: 38,
    color: "#FFFFFF",
  },

  photoButton: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background,
  },

  name: {
    marginTop: 17,
    fontFamily: typography.bold,
    fontSize: 24,
    letterSpacing: -0.5,
    color: colors.text,
  },

  contact: {
    marginTop: 4,
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.secondaryText,
  },

  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 13,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
  },

  editProfileText: {
    fontFamily: typography.semibold,
    fontSize: 12,
    color: colors.accent,
  },

  /* STATS */

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },

  statCard: {
    flex: 1,
    minHeight: 130,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 17,
    justifyContent: "center",
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  statNumber: {
    fontFamily: typography.extraBold,
    fontSize: 28,
    letterSpacing: -0.8,
    color: colors.text,
  },

  statLabel: {
    marginTop: 2,
    fontFamily: typography.bold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.secondaryText,
  },

  /* SECTIONS */

  section: {
    marginBottom: 25,
  },

  sectionLabel: {
    marginBottom: 9,
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1.3,
    color: colors.secondaryText,
  },

  /* MENU */

  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: "hidden",
  },

  menuRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13,
  },

  menuRowPressed: {
    opacity: 0.65,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontFamily: typography.semibold,
    fontSize: 14,
    color: colors.text,
  },

  menuSubtitle: {
    marginTop: 3,
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.secondaryText,
  },
});