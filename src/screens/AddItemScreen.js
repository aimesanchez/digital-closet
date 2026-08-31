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
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy";

import { colors } from "../constants/colors";

export default function AddItemScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [imageForProcessing, setImageForProcessing] = useState(null);

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

 const removeBackground = async () => {
  if (!selectedImage) return;

  try {
    setIsRemovingBackground(true);

    const base64 = await FileSystem.readAsStringAsync(selectedImage, {
      encoding: FileSystem.EncodingType.Base64,
    });

    setImageForProcessing(`data:image/jpeg;base64,${base64}`);
  } catch (error) {
    console.error("Background removal error:", error);

    Alert.alert(
      "Something went wrong",
      "We couldn't prepare the image for background removal."
    );

    setIsRemovingBackground(false);
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

          <Pressable
            style={styles.primaryButton}
            onPress={removeBackground}
            disabled={isRemovingBackground}
          >
            <Text style={styles.primaryButtonText}>
              {isRemovingBackground
                ? "Removing Background..."
                : "Remove Background"}
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
      {imageForProcessing && (
  <WebView
    style={{ width: 1, height: 1, opacity: 0 }}
    originWhitelist={["*"]}
    javaScriptEnabled
    source={{
      html: `
        <!DOCTYPE html>
        <html>
          <body>
            <script type="module">
              import { removeBackground } from "https://esm.sh/@imgly/background-removal";

              const image = "${imageForProcessing}";

              async function processImage() {
                try {
                  const response = await fetch(image);
                  const blob = await response.blob();

                  const resultBlob = await removeBackground(blob);

                  const reader = new FileReader();

                  reader.onloadend = function () {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        type: "success",
                        image: reader.result
                      })
                    );
                  };

                  reader.readAsDataURL(resultBlob);
                } catch (error) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                      type: "error",
                      message: error.message
                    })
                  );
                }
              }

              processImage();
            </script>
          </body>
        </html>
      `,
    }}
    onMessage={(event) => {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "success") {
        setSelectedImage(data.image);
        setImageForProcessing(null);
        setIsRemovingBackground(false);

        Alert.alert(
          "Background removed!",
          "Your clothing image now has a transparent background."
        );
      } else {
        console.error("WebView background removal error:", data.message);

        setImageForProcessing(null);
        setIsRemovingBackground(false);

        Alert.alert(
          "Background removal failed",
          data.message || "Something went wrong."
        );
      }
    }}
  />
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