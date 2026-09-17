import {
  useEffect,
  useRef,
  useState,
} from "react";

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
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";

import { WebView } from "react-native-webview";

import { useCloset } from "../context/ClosetContext";

import {
  CLOTHING_CATEGORIES,
  ACCESSORY_TYPES,
  LEGWEAR_TYPES,
  OUTERWEAR_TYPES,
  SWEATER_TYPES,
} from "../constants/clothingTypes";

import { colors } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";

export default function AddItemScreen({
  navigation,
  route,
}) {
  const {
    addClothingItem,
    updateClothingItem,
    clothingItems,
  } = useCloset();

  const itemToEdit =
    route.params?.itemToEdit || null;

  const isEditing =
    Boolean(itemToEdit);

  const DEFAULT_OCCASIONS = [
  "Casual",
  "School / Work",
  "Formal",
  "Active / Gym",
  "Date Night",
];

const availableOccasions = [
  ...new Set([
    ...DEFAULT_OCCASIONS,

    ...clothingItems.flatMap(
      (item) =>
        item.occasions || []
    ),
  ]),
];

  const webViewRef = useRef(null);

  /* -------------------------------- */
  /* IMAGE STATE                      */
  /* -------------------------------- */

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [
    processedImageUri,
    setProcessedImageUri,
  ] = useState(null);

  const [
    imageForProcessing,
    setImageForProcessing,
  ] = useState(null);

  const [
    isRemovingBackground,
    setIsRemovingBackground,
  ] = useState(false);

  const [
    backgroundStatus,
    setBackgroundStatus,
  ] = useState("idle");

  const [webViewReady, setWebViewReady] =
    useState(false);

  /* -------------------------------- */
  /* FORM STATE                       */
  /* -------------------------------- */

  const [name, setName] = useState("");

  const [category, setCategory] =
    useState("");

  const [subCategory, setSubCategory] =
    useState("");

  const [color, setColor] = useState("");

  const [customColor, setCustomColor] =
    useState("");

  const [weather, setWeather] =
    useState([]);

  const [occasions, setOccasions] =
    useState([]);

  const [
    customOccasion,
    setCustomOccasion,
  ] = useState("");

  /* -------------------------------- */
/* LOAD ITEM FOR EDITING            */
/* -------------------------------- */

useEffect(() => {
  if (!itemToEdit) {
    return;
  }

  setSelectedImage(
    itemToEdit.imageUri ||
      itemToEdit.processedImageUri ||
      null
  );

  setProcessedImageUri(
    itemToEdit.processedImageUri ||
      itemToEdit.imageUri ||
      null
  );

  setName(
    itemToEdit.name || ""
  );

  setCategory(
    itemToEdit.category || ""
  );

  setSubCategory(
    itemToEdit.subCategory || ""
  );

  const defaultColors = [
    "Black",
    "White",
    "Blue",
    "Brown",
    "Red",
    "Green",
  ];

  if (
    defaultColors.includes(
      itemToEdit.color
    )
  ) {
    setColor(
      itemToEdit.color
    );

    setCustomColor("");
  } else if (
    itemToEdit.color
  ) {
    setColor("Other");

    setCustomColor(
      itemToEdit.color
    );
  }

  setWeather(
    itemToEdit.weather || []
  );

  setOccasions(
    itemToEdit.occasions || []
  );

  setBackgroundStatus(
    "ready"
  );
}, [itemToEdit]);

  /* -------------------------------- */
  /* SUBCATEGORY OPTIONS              */
  /* -------------------------------- */

  const getSubcategoryOptions = () => {
    if (category === "Accessories") {
      return ACCESSORY_TYPES;
    }

    if (category === "Legwear") {
      return LEGWEAR_TYPES;
    }

    if (category === "Outerwear") {
      return OUTERWEAR_TYPES;
    }

    if (category === "Sweaters") {
      return SWEATER_TYPES;
    }

    return [];
  };

  const subcategoryOptions =
    getSubcategoryOptions();

  /* -------------------------------- */
  /* START BACKGROUND REMOVAL         */
  /* -------------------------------- */

  const prepareImageForBackgroundRemoval =
    async (uri) => {
      try {
        setSelectedImage(uri);
        setProcessedImageUri(null);

        setIsRemovingBackground(true);
        setBackgroundStatus("processing");

        /*
         * PERFORMANCE FIX:
         *
         * Do NOT send the original giant photo
         * to the background-removal model.
         *
         * Resize it first.
         */

        const imageInfo =
  await ImageManipulator.manipulateAsync(
    uri,
    [],
    {
      compress: 1,
      format:
        ImageManipulator.SaveFormat.JPEG,
    }
  );

const originalWidth = imageInfo.width;
const originalHeight = imageInfo.height;

const MAX_DIMENSION = 1024;

let resizeConfig = null;

if (
  originalWidth > MAX_DIMENSION ||
  originalHeight > MAX_DIMENSION
) {
  if (originalWidth >= originalHeight) {
    resizeConfig = {
      width: MAX_DIMENSION,
    };
  } else {
    resizeConfig = {
      height: MAX_DIMENSION,
    };
  }
}

const resizedImage =
  await ImageManipulator.manipulateAsync(
    uri,
    resizeConfig
      ? [
          {
            resize: resizeConfig,
          },
        ]
      : [],
    {
      compress: 0.75,
      format:
        ImageManipulator.SaveFormat.JPEG,
    }
  );

console.log(
  "Original image:",
  originalWidth,
  "x",
  originalHeight
);

console.log(
  "Resized image:",
  resizedImage.width,
  "x",
  resizedImage.height
);
        const base64 =
          await FileSystem.readAsStringAsync(
            resizedImage.uri,
            {
              encoding:
                FileSystem.EncodingType
                  .Base64,
            }
          );

        setImageForProcessing(
          `data:image/jpeg;base64,${base64}`
        );
      } catch (error) {
        console.error(
          "Image preparation error:",
          error
        );

        setIsRemovingBackground(false);
        setBackgroundStatus("error");

        Alert.alert(
          "Image processing failed",
          "We couldn't prepare this image for background removal."
        );
      }
    };

  /* -------------------------------- */
  /* CAMERA                           */
  /* -------------------------------- */

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

    const result =
      await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,

        /*
         * We do not need the full raw
         * camera image for the closet.
         */
        quality: 0.8,
      });

    if (!result.canceled) {
      await prepareImageForBackgroundRemoval(
        result.assets[0].uri
      );
    }
  };

  /* -------------------------------- */
  /* PHOTO LIBRARY                    */
  /* -------------------------------- */

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

    const result =
      await ImagePicker.launchImageLibraryAsync(
        {
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.8,
        }
      );

    if (!result.canceled) {
      await prepareImageForBackgroundRemoval(
        result.assets[0].uri
      );
    }
  };

  /* -------------------------------- */
  /* SEND IMAGE TO PERSISTENT WEBVIEW */
  /* -------------------------------- */

  useEffect(() => {
    if (
      !webViewReady ||
      !imageForProcessing ||
      !webViewRef.current
    ) {
      return;
    }

    /*
     * The WebView stays alive instead of
     * being recreated for every image.
     */

    const script = `
      window.processImage(
        ${JSON.stringify(
          imageForProcessing
        )}
      );

      true;
    `;

    webViewRef.current.injectJavaScript(
      script
    );

    setImageForProcessing(null);
  }, [
    webViewReady,
    imageForProcessing,
  ]);

  /* -------------------------------- */
  /* SAVE PROCESSED FILE              */
  /* -------------------------------- */

  const saveProcessedImage = async (
    dataUrl
  ) => {
    try {
      const base64Data =
        dataUrl.replace(
          /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
          ""
        );

      const closetDirectory =
        `${FileSystem.documentDirectory}closet-images/`;

      const directoryInfo =
        await FileSystem.getInfoAsync(
          closetDirectory
        );

      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          closetDirectory,
          {
            intermediates: true,
          }
        );
      }

      const processedFileUri =
        `${closetDirectory}${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(
        processedFileUri,
        base64Data,
        {
          encoding:
            FileSystem.EncodingType.Base64,
        }
      );

      /*
       * IMPORTANT:
       *
       * We store the FILE PATH in React,
       * not the giant base64 image.
       */

      setProcessedImageUri(
        processedFileUri
      );

      setIsRemovingBackground(false);
      setBackgroundStatus("ready");
    } catch (error) {
      console.error(
        "Processed image save error:",
        error
      );

      setIsRemovingBackground(false);
      setBackgroundStatus("error");

      Alert.alert(
        "Background removal failed",
        "The background was removed, but the result could not be saved."
      );
    }
  };

  /* -------------------------------- */
  /* WEBVIEW MESSAGE                  */
  /* -------------------------------- */

  const handleWebViewMessage = async (
    event
  ) => {
    try {
      const data = JSON.parse(
        event.nativeEvent.data
      );

      if (data.type === "ready") {
        setWebViewReady(true);
        return;
      }

      if (data.type === "success") {
        await saveProcessedImage(
          data.image
        );

        return;
      }

      if (data.type === "error") {
        console.error(
          "WebView background removal error:",
          data.message
        );

        setIsRemovingBackground(false);
        setBackgroundStatus("error");

        Alert.alert(
          "Background removal failed",
          data.message ||
            "Something went wrong."
        );
      }
    } catch (error) {
      console.error(
        "WebView message error:",
        error
      );
    }
  };

  /* -------------------------------- */
  /* RETRY                            */
  /* -------------------------------- */

  const retryBackgroundRemoval =
    async () => {
      if (!selectedImage) {
        return;
      }

      await prepareImageForBackgroundRemoval(
        selectedImage
      );
    };

  /* -------------------------------- */
  /* CLEAR PHOTO                      */
  /* -------------------------------- */

  const clearPhoto = () => {
    setSelectedImage(null);
    setProcessedImageUri(null);
    setImageForProcessing(null);

    setIsRemovingBackground(false);
    setBackgroundStatus("idle");
  };

  /* -------------------------------- */
  /* SAVE CLOTHING ITEM               */
  /* -------------------------------- */

  const saveClothingItem = () => {
    if (!selectedImage) {
      Alert.alert(
        "Photo needed",
        "Please add a clothing photo first."
      );

      return;
    }

    if (isRemovingBackground) {
      Alert.alert(
        "Still removing background",
        "Your photo is still processing. You can keep filling out the form while it finishes."
      );

      return;
    }

    if (!processedImageUri) {
      Alert.alert(
        "Background not ready",
        "Please retry background removal before saving this item."
      );

      return;
    }

    if (
      !category ||
      !color ||
      (color === "Other" &&
        !customColor.trim()) ||
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

    if (
      subcategoryOptions.length > 0 &&
      !subCategory
    ) {
      Alert.alert(
        "Choose a type",
        `Please choose what type of ${category.toLowerCase()} this is.`
      );

      return;
    }

    const newItem = {
      name:
        name.trim() ||
        "Untitled Item",

      /*
       * Keep the original and processed
       * image as separate values.
       */

      imageUri: selectedImage,

      processedImageUri:
        processedImageUri,

      category,

      subCategory:
        subCategory || null,

      color:
        color === "Other"
          ? customColor.trim()
          : color,

      weather,

      occasions: occasions.map(
        (occasion) =>
          occasion === "Other"
            ? customOccasion.trim()
            : occasion
      ),

      laundryStatus: "Clean",

      timesWorn: 0,
    };

    if (isEditing) {
  updateClothingItem(
    itemToEdit.id,
    newItem
  );
} else {
  addClothingItem(
    newItem
  );
}

    /*
     * Reset form.
     */

    setSelectedImage(null);
    setProcessedImageUri(null);
    setImageForProcessing(null);

    setName("");

    setCategory("");
    setSubCategory("");

    setColor("");
    setCustomColor("");

    setWeather([]);

    setOccasions([]);
    setCustomOccasion("");

    setIsRemovingBackground(false);
    setBackgroundStatus("idle");

  Alert.alert(
    isEditing
    ? "Changes Saved!"
    : "Saved!",

  isEditing
    ? "Your clothing item was updated."
    : "Your clothing item was added to your closet.",

  [
    {
      text: "OK",

      onPress: () =>
        navigation.goBack(),
    },
  ]
);
  };

  /* -------------------------------- */
  /* DISPLAY IMAGE                    */
  /* -------------------------------- */

  const displayImage =
    processedImageUri ||
    selectedImage;

  /* -------------------------------- */
  /* UI                               */
  /* -------------------------------- */

  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              ‹
            </Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              {isEditing
              ? "Edit Clothing"
              : "Add Clothing"}
            </Text>

            <Text
              style={styles.subtitle}
            >
            {isEditing
            ?"Update your clothing details or replace the photo."
            : "Take a photo or choose one from your library."}
            </Text>
          </View>
        </View>

        {/* PHOTO */}

        {selectedImage ? (
          <>
            <View
              style={
                styles.previewContainer
              }
            >
              <Image
                source={{
                  uri: displayImage,
                }}
                style={
                  styles.previewImage
                }
                resizeMode="contain"
              />
            </View>

            {/* PROCESSING STATUS */}

            {backgroundStatus ===
              "processing" && (
              <View
                style={
                  styles.statusContainer
                }
              >
                <Text
                  style={
                    styles.processingText
                  }
                >
                  Removing background...
                </Text>

                <Text
                  style={
                    styles.statusSubtext
                  }
                >
                  You can keep filling out
                  your clothing details.
                </Text>
              </View>
            )}

            {backgroundStatus ===
              "ready" && (
              <View
                style={
                  styles.statusContainer
                }
              >
                <Text
                  style={
                    styles.readyText
                  }
                >
                  ✓ Background removed
                </Text>
              </View>
            )}

            {backgroundStatus ===
              "error" && (
              <Pressable
                style={
                  styles.retryButton
                }
                onPress={
                  retryBackgroundRemoval
                }
              >
                <Text
                  style={
                    styles.retryButtonText
                  }
                >
                  Retry Background Removal
                </Text>
              </Pressable>
            )}

            <Pressable
              style={
                styles.secondaryButton
              }
              onPress={clearPhoto}
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                {isEditing
                ?"Change Photo"
                : "Choose Photo"}
              </Text>
            </Pressable>

            {/* FORM */}

            <View
              style={styles.formSection}
            >
              {/* NAME */}

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Name
              </Text>

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Optional, e.g. Black Tank Top"
                placeholderTextColor={
                  colors.secondaryText
                }
              />

              {/* CATEGORY */}

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Category
              </Text>

              <View
                style={styles.optionRow}
              >
                {CLOTHING_CATEGORIES.map(
                  (item) => {
                    const isSelected =
                      category === item;

                    return (
                      <Pressable
                        key={item}
                        style={[
                          styles.optionButton,

                          isSelected &&
                            styles.optionButtonSelected,
                        ]}
                        onPress={() => {
                          setCategory(item);

                          /*
                           * Reset subtype when
                           * category changes.
                           */

                          setSubCategory(
                            ""
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
                  }
                )}
              </View>

              {/* SUBCATEGORY */}

              {subcategoryOptions.length >
                0 && (
                <>
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    Type
                  </Text>

                  <View
                    style={
                      styles.optionRow
                    }
                  >
                    {subcategoryOptions.map(
                      (item) => {
                        const isSelected =
                          subCategory ===
                          item;

                        return (
                          <Pressable
                            key={item}
                            style={[
                              styles.optionButton,

                              isSelected &&
                                styles.optionButtonSelected,
                            ]}
                            onPress={() =>
                              setSubCategory(
                                item
                              )
                            }
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
                      }
                    )}
                  </View>
                </>
              )}

              {/* COLOR */}

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Color
              </Text>

              <View
                style={styles.optionRow}
              >
                {[
                  "Black",
                  "White",
                  "Blue",
                  "Brown",
                  "Red",
                  "Green",
                  "Other",
                ].map((item) => {
                  const isSelected =
                    color === item;

                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.optionButton,

                        isSelected &&
                          styles.optionButtonSelected,
                      ]}
                      onPress={() => {
                        setColor(item);

                        if (
                          item !== "Other"
                        ) {
                          setCustomColor(
                            ""
                          );
                        }
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

              {color === "Other" && (
                <TextInput
                  style={[
                    styles.input,
                    styles.customInput,
                  ]}
                  value={customColor}
                  onChangeText={
                    setCustomColor
                  }
                  placeholder="Enter a color, e.g. Burgundy"
                  placeholderTextColor={
                    colors.secondaryText
                  }
                />
              )}

              {/* WEATHER */}

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Weather
              </Text>

              <View
                style={styles.optionRow}
              >
                {[
                  "Hot",
                  "Warm",
                  "Cool",
                  "Cold",
                ].map((item) => {
                  const isSelected =
                    weather.includes(
                      item
                    );

                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.optionButton,

                        isSelected &&
                          styles.optionButtonSelected,
                      ]}
                      onPress={() => {
                        setWeather(
                          (
                            currentWeather
                          ) =>
                            currentWeather.includes(
                              item
                            )
                              ? currentWeather.filter(
                                  (
                                    value
                                  ) =>
                                    value !==
                                    item
                                )
                              : [
                                  ...currentWeather,
                                  item,
                                ]
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

              {/* OCCASION */}

              <Text
                style={
                  styles.fieldLabel
                }
              >
                Occasion
              </Text>

              <View
                style={styles.optionRow}
              >
                {[
                  ...availableOccasions,
                  "Other",
                ].map((item) => {
                  const isSelected =
                    occasions.includes(
                      item
                    );

                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.optionButton,

                        isSelected &&
                          styles.optionButtonSelected,
                      ]}
                      onPress={() => {
                        setOccasions(
                          (
                            currentOccasions
                          ) =>
                            currentOccasions.includes(
                              item
                            )
                              ? currentOccasions.filter(
                                  (
                                    occasion
                                  ) =>
                                    occasion !==
                                    item
                                )
                              : [
                                  ...currentOccasions,
                                  item,
                                ]
                        );

                        if (
                          isSelected &&
                          item === "Other"
                        ) {
                          setCustomOccasion(
                            ""
                          );
                        }
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

              {occasions.includes(
                "Other"
              ) && (
                <TextInput
                  style={[
                    styles.input,
                    styles.customInput,
                  ]}
                  placeholder="Enter occasion"
                  placeholderTextColor={
                    colors.secondaryText
                  }
                  value={
                    customOccasion
                  }
                  onChangeText={
                    setCustomOccasion
                  }
                />
              )}

              {/* SAVE */}

              <Pressable
                style={[
                  styles.saveButton,

                  isRemovingBackground &&
                    styles.saveButtonDisabled,
                ]}
                onPress={
                  saveClothingItem
                }
              >
                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  {isRemovingBackground
                    ? "Processing Photo..."
                    : isEditing
                    ? "Save Changes"
                    : "Save Item"}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            {/* EMPTY PHOTO STATE */}

            <View
              style={styles.emptyPreview}
            >
              <Text
                style={
                  styles.emptyPreviewText
                }
              >
                Your clothing photo will
                appear here
              </Text>
            </View>

            <Pressable
              style={
                styles.primaryButton
              }
              onPress={takePhoto}
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Take Photo
              </Text>
            </Pressable>

            <Pressable
              style={
                styles.secondaryButton
              }
              onPress={choosePhoto}
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Choose From Library
              </Text>
            </Pressable>
          </>
        )}

        {/* -------------------------------- */}
        {/* PERSISTENT BACKGROUND WORKER     */}
        {/* -------------------------------- */}

        <WebView
          ref={webViewRef}
          style={
            styles.backgroundWorker
          }
          originWhitelist={["*"]}
          javaScriptEnabled
          source={{
            html: `
              <!DOCTYPE html>

              <html>
                <head>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />
                </head>

                <body>
                  <script type="module">

                    import {
                      removeBackground
                    } from "https://esm.sh/@imgly/background-removal";


                    /*
                     * This function stays alive
                     * with the WebView.
                     *
                     * We do not create a brand-new
                     * WebView for every clothing item.
                     */

                    window.processImage =
                      async function(image) {

                        try {

                          const response =
                            await fetch(image);

                          const blob =
                            await response.blob();


                          const resultBlob =
                            await removeBackground(
                              blob
                            );


                          const reader =
                            new FileReader();


                          reader.onloadend =
                            function() {

                              window
                                .ReactNativeWebView
                                .postMessage(
                                  JSON.stringify({
                                    type:
                                      "success",

                                    image:
                                      reader.result
                                  })
                                );
                            };


                          reader.readAsDataURL(
                            resultBlob
                          );

                        } catch (error) {

                          window
                            .ReactNativeWebView
                            .postMessage(
                              JSON.stringify({
                                type:
                                  "error",

                                message:
                                  error.message
                              })
                            );
                        }
                      };


                    /*
                     * Tell React Native that
                     * the JS module is loaded.
                     */

                    window.ReactNativeWebView
                      .postMessage(
                        JSON.stringify({
                          type: "ready"
                        })
                      );

                  </script>
                </body>
              </html>
            `,
          }}
          onMessage={
            handleWebViewMessage
          }
        />
      </ScrollView>
    </SafeScreen>
  );
}

/* -------------------------------- */
/* STYLES                           */
/* -------------------------------- */

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

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  headerText: {
    flex: 1,
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

    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 30,
    marginBottom: 24,
  },

  emptyPreviewText: {
    color: colors.secondaryText,
    textAlign: "center",
    fontSize: 14,
  },

  previewContainer: {
    height: 360,

    borderRadius: 24,

    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    overflow: "hidden",

    marginBottom: 12,
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  statusContainer: {
    alignItems: "center",

    paddingVertical: 10,

    marginBottom: 10,
  },

  processingText: {
    color: colors.accent,

    fontSize: 14,
    fontWeight: "700",
  },

  statusSubtext: {
    marginTop: 4,

    color: colors.secondaryText,

    fontSize: 12,
  },

  readyText: {
    color: colors.text,

    fontSize: 14,
    fontWeight: "700",
  },

  primaryButton: {
    backgroundColor:
      colors.accent,

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
    backgroundColor:
      colors.surface,

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

  retryButton: {
    borderWidth: 1,
    borderColor: "#D94A4A",

    paddingVertical: 14,

    borderRadius: 18,

    alignItems: "center",

    marginBottom: 12,
  },

  retryButtonText: {
    color: "#D94A4A",

    fontWeight: "700",
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
    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingVertical: 14,

    fontSize: 15,

    color: colors.text,
  },

  customInput: {
    marginTop: 12,
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 10,
  },

  optionButton: {
    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,
  },

  optionButtonSelected: {
    backgroundColor:
      colors.accent,

    borderColor:
      colors.accent,
  },

  optionText: {
    color: colors.text,

    fontWeight: "500",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  saveButton: {
    backgroundColor:
      colors.accent,

    paddingVertical: 17,

    borderRadius: 20,

    alignItems: "center",

    marginTop: 30,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",
  },

  /*
   * The WebView still exists,
   * but it is essentially invisible.
   */

  backgroundWorker: {
    width: 1,
    height: 1,
    opacity: 0.01,
  },
});