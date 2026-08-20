import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { colors } from "../constants/colors";

export default function AddItemScreen() {
  const [selectedImage, setSelectedImage] = useState(null);

  const takePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Camera permission needed",
        "Please allow camera access so you can photograph clothing."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const choosePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Photo permission needed",
        "Please allow photo access so you can choose clothing images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const clearPhoto = () => {
    setSelectedImage(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Add Clothing</Text>

      <Text style={styles.subtitle}>
        Take a photo or choose one from your library.
      </Text>

      {selectedImage ? (
        <>
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.previewLabel}>Photo selected</Text>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              Remove Background
            </Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={clearPhoto}>
            <Text style={styles.secondaryButtonText}>
              Choose Another Photo
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyPreviewIcon}></Text>
            <Text style={styles.emptyPreviewText}>
              Your clothing photo will appear here
            </Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={takePhoto}>
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={choosePhoto}>
            <Text style={styles.secondaryButtonText}>
              Choose From Library
            </Text>
          </Pressable>
        </>
      )}
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

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 24,
  },

  emptyPreview: {
    height: 320,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 24,
  },

  emptyPreviewIcon: {
    fontSize: 56,
    marginBottom: 12,
  },

  emptyPreviewText: {
    color: colors.secondaryText,
    textAlign: "center",
    fontSize: 14,
  },

  previewContainer: {
    height: 360,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 12,
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  previewLabel: {
    textAlign: "center",
    color: colors.secondaryText,
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});