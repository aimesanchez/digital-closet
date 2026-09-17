import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import { useProfile } from "../context/ProfileContext";
import { useCloset } from "../context/ClosetContext";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

export default function ProfileScreen({
  navigation,
}) {
  const { profile, saveProfile, } = useProfile();

  const {
    clothingItems,
    savedOutfits,
  } = useCloset();

  const profileInitial =
    profile.name?.trim()
      ? profile.name
          .trim()
          .charAt(0)
          .toUpperCase()
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

    const selectedImageUri =
      result.assets[0].uri;

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
      profileImageUri:
        permanentImageUri,
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

  return (
    <SafeScreen>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE HEADER */}

        <View style={styles.header}>
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
            onPress={handleEditPhoto}
            >

            <Text style={styles.editPhotoText}>
              Edit Photo
            </Text>
          </Pressable>

          <Text style={styles.name}>
            {profile.name || "Your Name"}
          </Text>

          <Text style={styles.contact}>
            {profile.email ||
              profile.phone ||
              "Add your contact information"}
          </Text>
        </View>

        {/* MY CLOSET */}

        <Text style={styles.sectionLabel}>
          MY CLOSET
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {clothingItems.length}
            </Text>

            <Text style={styles.statLabel}>
              Items
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {savedOutfits.length}
            </Text>

            <Text style={styles.statLabel}>
              Outfits
            </Text>
          </View>
        </View>

        {/* ACCOUNT */}

        <Text style={styles.sectionLabel}>
          ACCOUNT
        </Text>

        <Pressable
          style={styles.menuCard}
          onPress={() => {
            navigation
            .getParent()
            ?.navigate(
              "PersonalInformation"
            )
          }}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>
              Personal Information
            </Text>

            <Text style={styles.menuSubtitle}>
              Name, email & phone
            </Text>
          </View>

          <Text style={styles.chevron}>
            ›
          </Text>
        </Pressable>

        {/* WARDROBE */}

        <Text style={styles.sectionLabel}>
          WARDROBE
        </Text>

        <Pressable
          style={styles.menuCard}
          onPress={() => 
            navigation
            .getParent()
            ?.navigate(
              "ClothingCare"
            )
          }
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>
              Clothing Care
            </Text>

            <Text style={styles.menuSubtitle}>
              Materials & care instructions
            </Text>
          </View>

          <Text style={styles.chevron}>
            ›
          </Text>
        </Pressable>

        {/* ABOUT */}

        <Text style={styles.sectionLabel}>
          ABOUT
        </Text>

        <Pressable
          style={styles.menuCard}
          onPress={() => {
            navigation
            .getParent()
            ?.navigate("About")
          }}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>
              About Digital Closet
            </Text>

            <Text style={styles.menuSubtitle}>
              App information
            </Text>
          </View>

          <Text style={styles.chevron}>
            ›
          </Text>
        </Pressable>
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
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 34,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
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
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  editPhotoText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: colors.accent,
  },

  name: {
    marginTop: 14,
    fontSize: 25,
    fontWeight: "700",
    color: colors.text,
  },

  contact: {
    marginTop: 4,
    fontSize: 14,
    color: colors.secondaryText,
  },

  sectionLabel: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: colors.secondaryText,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    minHeight: 100,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  statNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },

  statLabel: {
    marginTop: 4,
    fontSize: 13,
    color: colors.secondaryText,
  },

  menuCard: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginBottom: 24,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  menuSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.secondaryText,
  },

  chevron: {
    marginLeft: 12,
    fontSize: 28,
    color: colors.secondaryText,
  },
});