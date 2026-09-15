import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Animated,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCloset } from "../context/ClosetContext";
import { colors } from "../constants/colors";
import { captureRef } from "react-native-view-shot";

import * as FileSystem from "expo-file-system/legacy";

import {
  CLOTHING_CATEGORIES,
  CANVAS_DEFAULTS,
  ACCESSORY_CANVAS_DEFAULTS,
} from "../constants/clothingTypes";
import SafeScreen from "../components/SafeScreen";

const CANVAS_ITEM_WIDTH = 120;
const CANVAS_ITEM_HEIGHT = 145;

const MIN_ITEM_SCALE = 0.4;
const MAX_ITEM_SCALE = 2.5;

/* -------------------------------- */
/* DRAGGABLE ITEM                    */
/* -------------------------------- */

function getTouchDistance(touches) {
  if (touches.length < 2) {
    return 0;
  }

  const firstTouch = touches[0];
  const secondTouch = touches[1];

  const deltaX =
    secondTouch.pageX -
    firstTouch.pageX;

  const deltaY =
    secondTouch.pageY -
    firstTouch.pageY;

  return Math.sqrt(
    deltaX * deltaX +
    deltaY * deltaY
  );
}

function DraggableCanvasItem({
  canvasItem,
  onRemove,
  onUpdate,
  hideControls,
}) {
  const pan = useRef(
    new Animated.ValueXY({
      x: canvasItem.x,
      y: canvasItem.y,
    })
  ).current;

  const scale = useRef(
    new Animated.Value(
      canvasItem.scale ?? 1
    )
  ).current;

  const inverseScale =
  Animated.divide(1, scale);

  const currentPosition =
    useRef({
      x: canvasItem.x,
      y: canvasItem.y,
    });

  const currentScale =
    useRef(
      canvasItem.scale ?? 1
    );

  const dragStartPosition =
    useRef({
      x: canvasItem.x,
      y: canvasItem.y,
    });

  const pinchStartDistance =
    useRef(null);

  const pinchStartScale =
    useRef(
      canvasItem.scale ?? 1
    );

  const isPinching =
    useRef(false);

  const clampScale = (value) => {
    return Math.min(
      MAX_ITEM_SCALE,
      Math.max(
        MIN_ITEM_SCALE,
        value
      )
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder:
        () => true,

      onMoveShouldSetPanResponder:
        () => true,

      onPanResponderGrant: (
        event
      ) => {
        dragStartPosition.current = {
          ...currentPosition.current,
        };

        const touches =
          event.nativeEvent.touches;

        if (touches.length >= 2) {
          isPinching.current = true;

          pinchStartDistance.current =
            getTouchDistance(
              touches
            );

          pinchStartScale.current =
            currentScale.current;
        } else {
          isPinching.current = false;

          pinchStartDistance.current =
            null;
        }
      },

      onPanResponderMove: (
        event,
        gestureState
      ) => {
        const touches =
          event.nativeEvent.touches;

        /*
         * TWO FINGERS:
         * resize the clothing item.
         */
        if (touches.length >= 2) {
          const distance =
            getTouchDistance(
              touches
            );

          if (
            !isPinching.current ||
            !pinchStartDistance.current
          ) {
            isPinching.current = true;

            pinchStartDistance.current =
              distance;

            pinchStartScale.current =
              currentScale.current;

            return;
          }

          const scaleChange =
            distance /
            pinchStartDistance.current;

          const nextScale =
            clampScale(
              pinchStartScale.current *
                scaleChange
            );

          currentScale.current =
            nextScale;

          scale.setValue(
            nextScale
          );

          return;
        }

        /*
         * ONE FINGER:
         * move the clothing item.
         */
        if (!isPinching.current) {
          const nextX =
            dragStartPosition.current.x +
            gestureState.dx;

          const nextY =
            dragStartPosition.current.y +
            gestureState.dy;

          currentPosition.current = {
            x: nextX,
            y: nextY,
          };

          pan.setValue({
            x: nextX,
            y: nextY,
          });
        }
      },

      onPanResponderRelease: () => {
        isPinching.current = false;

        pinchStartDistance.current =
          null;

        onUpdate(
          canvasItem.canvasId,
          {
            x: currentPosition.current.x,
            y: currentPosition.current.y,
            scale:
              currentScale.current,
          }
        );
      },

      onPanResponderTerminate:
        () => {
          isPinching.current = false;

          pinchStartDistance.current =
            null;

          onUpdate(
            canvasItem.canvasId,
            {
              x: currentPosition.current.x,
              y: currentPosition.current.y,
              scale:
                currentScale.current,
            }
          );
        },
    })
  ).current;

  const imageSource =
    canvasItem.processedImageUri ||
    canvasItem.imageUri;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.canvasPiece,
        {
          transform: [
            {
              translateX: pan.x,
            },
            {
              translateY: pan.y,
            },
            {
              scale,
            },
          ],
        },
      ]}
    >
        {!hideControls && (
        <Animated.View
        style={[
            styles.removeButtonWrapper,
            {
                transform: [
                    {
                        scale: inverseScale,
                    },
                ],
            },
        ]}
        >
      <Pressable
        style={
          styles.removeButton
        }
        onPress={() =>
          onRemove(
            canvasItem.canvasId
          )
        }
      >
        <Text
          style={
            styles.removeButtonText
          }
        >
          ×
        </Text>
      </Pressable>
      </Animated.View>
        )}

      {imageSource ? (
        <Image
          source={{
            uri: imageSource,
          }}
          style={
            styles.canvasImage
          }
          resizeMode="contain"
        />
      ) : (
        <View
          style={styles.noImage}
        >
          <Text
            style={
              styles.noImageText
            }
          >
            No photo
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

/* -------------------------------- */
/* BUILDER SCREEN                    */
/* -------------------------------- */

export default function OutfitBuilderScreen({
  route,
  navigation,
}) {
  const { clothingItems,saveOutfit, } = useCloset();

  const params =
  route.params || {};

const outfitToEdit =
  params.outfitToEdit || null;
  
const accessoryToAdd =
  params.accessoryToAdd || null;

const selectedOccasions =
  params.selectedOccasions ??
  outfitToEdit?.occasions ??
  [];

const selectedWeather =
  params.selectedWeather ??
  outfitToEdit?.weather ??
  null;

  const [canvasItems, setCanvasItems] =
    useState([]);

  const [showPicker, setShowPicker] =
    useState(false);

  const [activeCategory, setActiveCategory] =
    useState("Tops");

  const [selectedItemIds, setSelectedItemIds] =
    useState([]);

  const [canvasSize, setCanvasSize] =
  useState({
    width: 0,
    height: 0,
  });

const canvasRef =
  useRef(null);

const hasLoadedEdit =
  useRef(false);

const [
  isSaving,
  setIsSaving,
] = useState(false);

const [
  isCapturing,
  setIsCapturing,
] = useState(false);

/* -------------------------------- */
/* LOAD EXISTING OUTFIT FOR EDITING */
/* -------------------------------- */

useEffect(() => {
  if (
    !outfitToEdit ||
    hasLoadedEdit.current ||
    canvasSize.width === 0 ||
    canvasSize.height === 0
  ) {
    return;
  }

const restoredItems =
  (outfitToEdit.pieces || [])
    .map((piece) => {
      const closetItem =
        clothingItems.find(
          (item) =>
            item.id ===
            piece.itemId
        );

      if (!closetItem) {
        return null;
      }

      const x =
        piece.normalizedX != null
          ? piece.normalizedX *
            canvasSize.width
          : piece.x;

      const y =
        piece.normalizedY != null
          ? piece.normalizedY *
            canvasSize.height
          : piece.y;

      return {
        ...closetItem,

        canvasId:
          piece.canvasId ||
          `${piece.itemId}-${Date.now()}`,

        x,
        y,

        scale:
          piece.scale ?? 1,
      };
    })
    .filter(Boolean);

/*
 * Start with the existing outfit pieces.
 */
let itemsToLoad = [
  ...restoredItems,
];

/*
 * If Home sent us a recommended accessory,
 * automatically add it to the outfit.
 */
if (accessoryToAdd) {
  const alreadyAdded =
    itemsToLoad.some(
      (item) =>
        item.id ===
        accessoryToAdd.id
    );

  if (!alreadyAdded) {
    let defaults =
      CANVAS_DEFAULTS.Accessories;

    if (
      accessoryToAdd.subCategory &&
      ACCESSORY_CANVAS_DEFAULTS[
        accessoryToAdd.subCategory
      ]
    ) {
      defaults = {
        ...defaults,

        ...ACCESSORY_CANVAS_DEFAULTS[
          accessoryToAdd.subCategory
        ],
      };
    }

    const accessoryX =
      defaults.x *
        canvasSize.width -
      CANVAS_ITEM_WIDTH / 2;

    const accessoryY =
      defaults.y *
        canvasSize.height -
      CANVAS_ITEM_HEIGHT / 2;

    itemsToLoad.push({
      ...accessoryToAdd,

      canvasId:
        `${accessoryToAdd.id}-${Date.now()}`,

      x: accessoryX,
      y: accessoryY,

      scale:
        defaults.scale ?? 1,
    });
  }
}

setCanvasItems(
  itemsToLoad
);

hasLoadedEdit.current =
  true;
}, [
  outfitToEdit,
  accessoryToAdd,
  clothingItems,
  canvasSize.width,
  canvasSize.height,
]);

  /* -------------------------------- */
  /* CATEGORY FILTER                  */
  /* -------------------------------- */

  const availableCategories =
  CLOTHING_CATEGORIES.filter(
    (category) =>
      clothingItems.some(
        (item) => {
          const matchesCategory =
            item.category === category;

          const matchesWeather =
            !selectedWeather ||
            (
              item.weather || []
            ).includes(
              selectedWeather
            );

          const matchesOccasion =
            selectedOccasions.length ===
              0 ||
            selectedOccasions.some(
              (occasion) =>
                (
                  item.occasions || []
                ).includes(
                  occasion
                )
            );

          return (
            matchesCategory &&
            matchesWeather &&
            matchesOccasion
          );
        }
      )
  );

  const categoryItems = clothingItems.filter(
  (item) => {
    const matchesCategory =
      item.category === activeCategory;

    const matchesWeather =
      !selectedWeather ||
      (item.weather || []).includes(
        selectedWeather
      );

    const matchesOccasion =
      selectedOccasions.length === 0 ||
      selectedOccasions.some(
        (occasion) =>
          (item.occasions || []).includes(
            occasion
          )
      );

    return (
      matchesCategory &&
      matchesWeather &&
      matchesOccasion
    );
  }
);
  /* -------------------------------- */
  /* SELECT / UNSELECT CLOTHING       */
  /* -------------------------------- */

  const toggleItemSelection = (itemId) => {
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter(
            (id) => id !== itemId
          )
        : [...currentIds, itemId]
    );
  };

  /* -------------------------------- */
  /* DEFAULT CANVAS POSITION          */
  /* -------------------------------- */

  const getDefaultPosition = (
    item,
    extraOffset = 0
  ) => {
    let defaults =
      CANVAS_DEFAULTS[item.category] ||
      CANVAS_DEFAULTS.Tops;

    if (
      item.category === "Accessories" &&
      item.subCategory &&
      ACCESSORY_CANVAS_DEFAULTS[
        item.subCategory
      ]
    ) {
      defaults = {
        ...defaults,
        ...ACCESSORY_CANVAS_DEFAULTS[
          item.subCategory
        ],
      };
    }

    const x =
      defaults.x * canvasSize.width -
      CANVAS_ITEM_WIDTH / 2 +
      extraOffset;

    const y =
      defaults.y * canvasSize.height -
      CANVAS_ITEM_HEIGHT / 2 +
      extraOffset;

    return {
      x,
      y,
    };
  };

  /* -------------------------------- */
  /* ADD SELECTED ITEMS TO CANVAS     */
  /* -------------------------------- */

  const addSelectedItems = () => {
    const selectedClothing =
      clothingItems.filter((item) =>
        selectedItemIds.includes(item.id)
      );

    const existingItemIds = canvasItems.map(
      (item) => item.id
    );

    const newItems = selectedClothing
      .filter(
        (item) =>
          !existingItemIds.includes(item.id)
      )
      .map((item, index) => {
        const position = getDefaultPosition(
          item,
          index * 12
        );

const defaults =
  CANVAS_DEFAULTS[
    item.category
  ] || CANVAS_DEFAULTS.Tops;

return {
  ...item,

  canvasId:
    `${item.id}-${Date.now()}-${index}`,

  x: position.x,
  y: position.y,

  scale:
    defaults.scale ?? 1,
};
      });

    setCanvasItems((currentItems) => [
      ...currentItems,
      ...newItems,
    ]);

    setSelectedItemIds([]);
    setShowPicker(false);
  };

  /* -------------------------------- */
  /* REMOVE FROM CANVAS               */
  /* -------------------------------- */

  const removeCanvasItem = (canvasId) => {
    setCanvasItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.canvasId !== canvasId
      )
    );
  };

  const updateCanvasItem = (
    canvasId,
    updates
  ) => {
    setCanvasItems (
        (currentItems) =>
            currentItems.map(
                (item) =>
                    item.canvasId ===
                canvasId? {
                    ...item,
                    ...updates,
                }
                : item
            )
    );
  };
  const handleSaveOutfit =
  async () => {
    if (
      canvasItems.length === 0
    ) {
      Alert.alert(
        "Empty Outfit",
        "Add at least one piece before saving."
      );

      return;
    }

    try {
      setIsSaving(true);

      /*
       * Temporarily hide controls
       * before taking the screenshot.
       */
      setIsCapturing(true);

      /*
       * Give React a moment to render
       * without the delete buttons.
       */
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            80
          )
      );

      const temporaryImageUri =
        await captureRef(
          canvasRef,
          {
            format: "png",
            quality: 1,
            result: "tmpfile",
          }
        );

      const outfitId =
        outfitToEdit?.id ||
        `outfit-${Date.now()}`;

      const outfitDirectory =
        `${FileSystem.documentDirectory}outfits/`;

      await FileSystem.makeDirectoryAsync(
        outfitDirectory,
        {
          intermediates: true,
        }
      );
      const imageVersion =
         Date.now();

    const permanentImageUri =
        `${outfitDirectory}${outfitId}-${imageVersion}.png`;

    await FileSystem.copyAsync({
        from: temporaryImageUri,
        to: permanentImageUri,
    });

      const pieces =
        canvasItems.map(
          (item) => ({
            canvasId:
              item.canvasId,

            itemId: item.id,

            x: item.x,
            y: item.y,

            normalizedX:
              canvasSize.width > 0
                ? item.x /
                  canvasSize.width
                : 0,

            normalizedY:
              canvasSize.height > 0
                ? item.y /
                  canvasSize.height
                : 0,

            scale:
              item.scale ?? 1,
          })
        );

      saveOutfit({
        id: outfitId,

        imageUri:
          permanentImageUri,

        occasions:
          selectedOccasions,

        weather:
          selectedWeather,

        pieces,

        canvasWidth:
          canvasSize.width,

        canvasHeight:
          canvasSize.height,

        createdAt:
          outfitToEdit?.createdAt,
      });

      setIsCapturing(false);

      navigation.navigate(
        "MainTabs",
        {
          screen: "Home",
        }
      );
    } catch (error) {
      console.error(
        "Error saving outfit:",
        error
      );

      setIsCapturing(false);

      Alert.alert(
        "Couldn't Save Outfit",
        "Something went wrong while saving your outfit."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <Text style={styles.title}>
          Your Outfit
        </Text>

        <Text style={styles.subtitle}>
          Build your look
        </Text>

        

        {/* OCCASIONS */}
<View style={styles.occasionRow}>
  {selectedWeather && (
    <View style={styles.weatherChip}>
      <Text style={styles.weatherChipText}>
        {selectedWeather}
      </Text>
    </View>
  )}

  {selectedOccasions.map((occasion) => (
    <View
      key={occasion}
      style={styles.occasionChip}
    >
      <Text style={styles.occasionChipText}>
        {occasion}
      </Text>
    </View>
  ))}
</View>

        {/* CANVAS */}

       <View
        ref={canvasRef}
        collapsable={false}
        style={[
            styles.canvas,
            isCapturing &&
                styles.canvasCapture,
        ]}
          onLayout={(event) => {
            const {
              width,
              height,
            } = event.nativeEvent.layout;

            setCanvasSize({
              width,
              height,
            });
          }}
        >
          {canvasItems.length === 0 && (
            <View
              style={styles.emptyCanvas}
              pointerEvents="none"
            >
              <Text
                style={
                  styles.emptyCanvasTitle
                }
              >
                Start building your outfit
              </Text>

              <Text
                style={
                  styles.emptyCanvasText
                }
              >
                Add pieces from your closet
                and arrange them here.
              </Text>
            </View>
          )}

          {canvasItems.map((item) => (
            <DraggableCanvasItem
              key={item.canvasId}
              canvasItem={item}
              onRemove={removeCanvasItem}
              onUpdate={updateCanvasItem}
              hideControls={isCapturing}
            />
          ))}

        </View>
        <Text style={styles.pieceHint}>
            Drag to move • Pinch to resize
        </Text>

        {/* ADD PIECE BUTTON */}

        <Pressable
          style={styles.addPieceButton}
          onPress={() =>
            setShowPicker((current) => !current)
          }
        >
          <Text
            style={styles.addPieceButtonText}
          >
            {showPicker
              ? "Close Closet"
              : "+ Add Piece"}
          </Text>
        </Pressable>
        <Pressable
  style={[
    styles.saveOutfitButton,

    (canvasItems.length === 0 ||
      isSaving) &&
      styles.saveOutfitButtonDisabled,
  ]}
  disabled={
    canvasItems.length === 0 ||
    isSaving
  }
  onPress={
    handleSaveOutfit
  }
>
  <Text
    style={
      styles.saveOutfitButtonText
    }
  >
    {isSaving
      ? "Saving..."
      : outfitToEdit
        ? "Update Outfit"
        : "Save Outfit"}
  </Text>
</Pressable>

        {/* CLOSET PICKER */}

        {showPicker && (
          <View style={styles.picker}>
            <Text style={styles.pickerTitle}>
              Choose from your closet
            </Text>

            <Text
              style={styles.pickerSubtitle}
            >
              Select as many pieces as you want.
            </Text>

            {/* CATEGORY TABS */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              style={styles.categoryScroll}
              contentContainerStyle={
                styles.categoryTabs
              }
            >
              {availableCategories.map(
                (category) => {
                  const active =
                    activeCategory ===
                    category;

                  return (
                    <Pressable
                      key={category}
                      style={[
                        styles.categoryTab,
                        active &&
                          styles.categoryTabActive,
                      ]}
                      onPress={() =>
                        setActiveCategory(
                          category
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.categoryTabText,
                          active &&
                            styles.categoryTabTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </ScrollView>

            {/* CLOTHING GRID */}

            {categoryItems.length === 0 ? (
              <View
                style={
                  styles.emptyCategory
                }
              >
                <Text
                  style={
                    styles.emptyCategoryText
                  }
                >
                  No {activeCategory.toLowerCase()}{" "}
                  in your closet yet.
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.itemGridScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={
                  false
                }
              >
                <View style={styles.itemGrid}>
                  {categoryItems.map(
                    (item) => {
                      const selected =
                        selectedItemIds.includes(
                          item.id
                        );

                      const imageSource =
                        item.processedImageUri ||
                        item.imageUri;

                      return (
                        <Pressable
                          key={item.id}
                          style={[
                            styles.pickerItem,
                            selected &&
                              styles.pickerItemSelected,
                          ]}
                          onPress={() =>
                            toggleItemSelection(
                              item.id
                            )
                          }
                        >
                          <View
                            style={
                              styles.pickerImageContainer
                            }
                          >
                            {imageSource ? (
                              <Image
                                source={{
                                  uri: imageSource,
                                }}
                                style={
                                  styles.pickerImage
                                }
                                resizeMode="contain"
                              />
                            ) : (
                              <Text
                                style={
                                  styles.noImageText
                                }
                              >
                                No photo
                              </Text>
                            )}

                            {selected && (
                              <View
                                style={
                                  styles.selectedBadge
                                }
                              >
                                <Text
                                  style={
                                    styles.selectedBadgeText
                                  }
                                >
                                  ✓
                                </Text>
                              </View>
                            )}
                          </View>

                          <Text
                            style={
                              styles.pickerItemName
                            }
                            numberOfLines={1}
                          >
                            {item.name ||
                              item.category}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </ScrollView>
            )}

            {/* ADD SELECTED */}

            <Pressable
              style={[
                styles.confirmButton,
                selectedItemIds.length === 0 &&
                  styles.confirmButtonDisabled,
              ]}
              disabled={
                selectedItemIds.length === 0
              }
              onPress={addSelectedItems}
            >
              <Text
                style={
                  styles.confirmButtonText
                }
              >
                {selectedItemIds.length === 0
                  ? "Select Items"
                  : `Add ${
                      selectedItemIds.length
                    } ${
                      selectedItemIds.length ===
                      1
                        ? "Item"
                        : "Items"
                    }`}
              </Text>
            </Pressable>
          </View>
        )}

        
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
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginTop: 4,
  },

  occasionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
    marginBottom: 20,
  },

  occasionChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  occasionChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
  },

  canvas: {
    height: 520,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
  },
  canvasCapture: {
    borderWidth: 0,
    borderRadius: 0,
},

  emptyCanvas: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyCanvasTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },

  emptyCanvasText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 20,
  },

  canvasPiece: {
    position: "absolute",
    width: CANVAS_ITEM_WIDTH,
    height: CANVAS_ITEM_HEIGHT,
    zIndex: 10,
  },

  canvasImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: colors.secondaryText,
    fontSize: 11,
  },

  removeButton: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: "#D94A4A",
  justifyContent: "center",
  alignItems: "center",
},

  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 20,
  },

  addPieceButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
  },

  addPieceButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "700",
  },

  picker: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 16,
  },

  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  pickerSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
    marginBottom: 14,
  },

  categoryScroll: {
    marginHorizontal: -16,
  },

  categoryTabs: {
    paddingHorizontal: 16,
    gap: 8,
  },

  categoryTab: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  categoryTabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  categoryTabText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
  },

  categoryTabTextActive: {
    color: "#FFFFFF",
  },

  itemGridScroll: {
    maxHeight: 390,
    marginTop: 16,
  },

  itemGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  pickerItem: {
    width: "31%",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 16,
    padding: 4,
  },

  pickerItemSelected: {
    borderColor: colors.accent,
  },

  pickerImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },

  pickerImage: {
    width: "100%",
    height: "100%",
  },

  pickerItemName: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
  },

  selectedBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  emptyCategory: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyCategoryText: {
    color: colors.secondaryText,
    fontSize: 13,
  },

  confirmButton: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },

  confirmButtonDisabled: {
    opacity: 0.4,
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  pieceHint: {
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
    color: colors.secondaryText,
  },
  weatherChip: {
  backgroundColor: colors.accent,
  borderRadius: 18,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

weatherChipText: {
  color: "#FFFFFF",
  fontSize: 13,
  fontWeight: "700",
},
removeButtonWrapper: {
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 50,
},
saveOutfitButton: {
  marginTop: 18,

  backgroundColor:
    colors.accent,

  borderRadius: 20,

  paddingVertical: 17,

  alignItems: "center",

  justifyContent:
    "center",
},

saveOutfitButtonDisabled: {
  opacity: 0.4,
},

saveOutfitButtonText: {
  color: "#FFFFFF",

  fontSize: 16,

  fontWeight: "700",
},
});