import {
  useRef,
  useState,
} from "react";

import {
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
import {
  CLOTHING_CATEGORIES,
  CANVAS_DEFAULTS,
  ACCESSORY_CANVAS_DEFAULTS,
} from "../constants/clothingTypes";
import SafeScreen from "../components/SafeScreen";

const CANVAS_ITEM_WIDTH = 120;
const CANVAS_ITEM_HEIGHT = 145;

/* -------------------------------- */
/* DRAGGABLE ITEM                    */
/* -------------------------------- */

function DraggableCanvasItem({
  canvasItem,
  onRemove,
}) {
  const pan = useRef(
    new Animated.ValueXY({
      x: canvasItem.x,
      y: canvasItem.y,
    })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });

        pan.setValue({
          x: 0,
          y: 0,
        });
      },

      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        {
          useNativeDriver: false,
        }
      ),

      onPanResponderRelease: () => {
        pan.flattenOffset();
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
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      <Pressable
        style={styles.removeButton}
        onPress={() => onRemove(canvasItem.canvasId)}
      >
        <Text style={styles.removeButtonText}>
          ×
        </Text>
      </Pressable>

      {imageSource ? (
        <Image
          source={{
            uri: imageSource,
          }}
          style={styles.canvasImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>
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
}) {
  const { clothingItems } = useCloset();

  const {
    selectedOccasions = [],
    startingPieces,
  } = route.params;

  const [canvasItems, setCanvasItems] =
    useState([]);

  const [showPicker, setShowPicker] =
    useState(false);

  const [activeCategory, setActiveCategory] =
    useState("Tops");

  const [selectedItemIds, setSelectedItemIds] =
    useState([]);

  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  });

  /* -------------------------------- */
  /* CATEGORY FILTER                  */
  /* -------------------------------- */

  const categoryItems = clothingItems.filter(
    (item) => item.category === activeCategory
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

        return {
          ...item,

          canvasId:
            `${item.id}-${Date.now()}-${index}`,

          x: position.x,
          y: position.y,
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
          {selectedOccasions.map(
            (occasion) => (
              <View
                key={occasion}
                style={styles.occasionChip}
              >
                <Text
                  style={
                    styles.occasionChipText
                  }
                >
                  {occasion}
                </Text>
              </View>
            )
          )}
        </View>

        {/* CANVAS */}

        <View
          style={styles.canvas}
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
            />
          ))}
        </View>

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
              {CLOTHING_CATEGORIES.map(
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

        <Text style={styles.pieceHint}>
          Starting with {startingPieces} pieces
        </Text>
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
    position: "absolute",
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D94A4A",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
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
});