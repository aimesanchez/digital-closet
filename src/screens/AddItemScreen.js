import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy";

import { useCloset } from "../context/ClosetContext";
import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";

export default function AddItemScreen({ navigation }) {
  const { addClothingItem } = useCloset();

  const [selectedImage, setSelectedImage] = useState(null);
  const [isRemovingBackground, setIsRemovingBackground] =
    useState(false);
  const [imageForProcessing, setImageForProcessing] =
    useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [weather, setWeather] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [customOccasion, setCustomOccasion] = useState("");

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

      const base64 = await FileSystem.readAsStringAsync(
        selectedImage,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      setImageForProcessing(
        `data:image/jpeg;base64,${base64}`
      );
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

  const saveClothingItem = () => {
    if (!selectedImage) {
      Alert.alert(
        "Photo needed",
        "Please add a clothing photo first."
      );
      return;
    }

    if (
  !category ||
  !color ||
  (color === "Other" && !customColor.trim()) ||
  weather.length === 0 ||
  occasions.length === 0 ||
  (occasions.includes("Other") &&
    !customOccasion.trim())
) {

  Alert.alert(
    "Missing information",
    "Please choose a category, color, weather, and occasion."
  );
  return;
}

    const newItem = {
      name: name.trim() || "Untitled Item",
      imageUri: selectedImage,
      processedImageUri: selectedImage,
      category,
      color: color === "Other" ? customColor.trim() : color,
      weather,
      laundryStatus: "Clean",
      timesWorn: 0,
      occasions: occasions.map((occasion) =>
      occasion === "Other"
      ? customOccasion.trim()
      : occasion
    ),
    };

    addClothingItem(newItem);
    
    setSelectedImage(null);
    setImageForProcessing(null);
    setName("");
    setCategory("");
    setColor("");
    setCustomColor("");
    setWeather([]);
    setOccasions([]);
    setCustomOccasion("");

    Alert.alert(
  "Saved!",
  "Your clothing item was added to your closet.",
  [
    {
      text: "OK",
      onPress: () => navigation.goBack(),
    },
  ]
);
  };

  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
  <Pressable
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.backButtonText}>‹</Text>
  </Pressable>

  <View>
    <Text style={styles.title}>Add Clothing</Text>

    <Text style={styles.subtitle}>
      Take a photo or choose one from your library.
    </Text>
  </View>
</View>

        {selectedImage ? (
          <>
  <View style={styles.previewContainer}>
     <Image
      source={{ uri: selectedImage }}
      style={styles.previewImage}
      resizeMode="contain"
      />
  </View>

  <Text style={styles.previewLabel}>
    Photo selected
  </Text>

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

  <Pressable
    style={styles.secondaryButton}
    onPress={clearPhoto}
  >
  <Text style={styles.secondaryButtonText}>
      Choose Another Photo
  </Text>
  </Pressable>

  <View style={styles.formSection}>

  <Text style={styles.fieldLabel}>Name</Text>

  <TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
    placeholder="Optional, e.g. Black Tank Top"
    placeholderTextColor={colors.secondaryText}
  />

  <Text style={styles.fieldLabel}>
    Category
  </Text>

  <View style={styles.optionRow}>
    {[
    "Tops",
    "Bottoms",
    "Footwear",
    "Accessories",
  ].map((item) => (
  <Pressable
    key={item}
    style={[
      styles.optionButton,
      category === item &&
      styles.optionButtonSelected,
    ]}
    onPress={() => setCategory(item)}
    >
  <Text
    style={[
      styles.optionText,
      category === item &&
      styles.optionTextSelected,
    ]}
    >
      {item}
  </Text>
  </Pressable>
))}
  </View>

<Text style={styles.fieldLabel}>Color</Text>

<View style={styles.optionRow}>
  {[
    "Black",
    "White",
    "Blue",
    "Brown",
    "Red",
    "Green",
    "Other",
  ].map((item) => (
  <Pressable
    key={item}
    style={[
      styles.optionButton,
      color === item && styles.optionButtonSelected,
    ]}
    onPress={() => {
      setColor(item);

        if (item !== "Other") {
          setCustomColor("");
        }
      }}
    >
      <Text
        style={[
          styles.optionText,
          color === item && styles.optionTextSelected,
        ]}
      >
        {item}
      </Text>
    </Pressable>
  ))}
</View>

{color === "Other" && (
  <TextInput
    style={styles.customColorInput}
    value={customColor}
    onChangeText={setCustomColor}
    placeholder="Enter a color, e.g. Burgundy"
    placeholderTextColor={colors.secondaryText}
  />
)}

<Text style={styles.fieldLabel}>Weather</Text>

<View style={styles.optionRow}>
  {["Warm", "Mild", "Cool", "Cold"].map((item) => {
    const isSelected =
    weather.includes(item);
    return (

<Pressable
  key={item}
  style={[
  styles.optionButton,
  isSelected &&
  styles.optionButtonSelected,
]}
  onPress={() => {
  setWeather((current) =>
  current.includes(item)
  ? current.filter(
  (value) => value !== item
 )
  : [...current, item]
);
}}

  >
<Text
  style={[
  styles.optionText,
  isSelected &&
  styles.optionTextSelected,
]}
  >
  {item}
</Text>
  </Pressable>
  );
  })}
  
  </View>
<Text style={styles.fieldLabel}>
  Occasion
</Text>

<View style={styles.optionRow}>
  {[
    "Casual",
    "School / Work",
    "Formal",
    "Active / Gym",
    "Date Night",
    "Other",
  ].map((item) => {
    const isSelected = occasions.includes(item);

    return (
      <Pressable
        key={item}
        style={[
          styles.optionButton,
          isSelected && styles.optionButtonSelected,
        ]}
        onPress={() => {
          if (isSelected) {
            setOccasions(
              occasions.filter(
                (occasion) => occasion !== item
              )
            );

            if (item === "Other") {
              setCustomOccasion("");
            }
          } else {
            setOccasions([...occasions, item]);
          }
        }}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && styles.optionTextSelected,
          ]}
        >
          {item}
        </Text>
      </Pressable>
    );
  })}
</View>

{occasions.includes("Other") && (
  <TextInput
    style={[styles.input, { marginTop: 12 }]}
    placeholder="Enter occasion"
    placeholderTextColor={colors.secondaryText}
    value={customOccasion}
    onChangeText={setCustomOccasion}
  />
)}

              <Pressable
                style={styles.saveButton}
                onPress={saveClothingItem}
              >
                <Text style={styles.saveButtonText}>
                  Save Item
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={styles.emptyPreview}>
              <Text style={styles.emptyPreviewIcon}></Text>

              <Text style={styles.emptyPreviewText}>
                Your clothing photo will appear here
              </Text>
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={takePhoto}
            >
              <Text style={styles.primaryButtonText}>
                Take Photo
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={choosePhoto}
            >
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

                          const resultBlob =
                            await removeBackground(blob);

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
              const data = JSON.parse(
                event.nativeEvent.data
              );

              if (data.type === "success") {
                setSelectedImage(data.image);
                setImageForProcessing(null);
                setIsRemovingBackground(false);

                Alert.alert(
                  "Background removed!",
                  "Your clothing image now has a transparent background."
                );
              } else {
                console.error(
                  "WebView background removal error:",
                  data.message
                );

                setImageForProcessing(null);
                setIsRemovingBackground(false);

                Alert.alert(
                  "Background removal failed",
                  data.message ||
                    "Something went wrong."
                );
              }
            }}
          />
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

  formSection: {
    marginTop: 28,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
    marginTop: 18,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  optionButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  optionText: {
    color: colors.text,
    fontWeight: "500",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },
  

  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  header: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 24,
},

backButton: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},

backButtonText: {
  fontSize: 32,
  color: colors.text,
  lineHeight: 34,
},
  
});