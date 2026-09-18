import {
  useState,
} from "react";

import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "../components/SafeScreen";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import { useCloset } from "../context/ClosetContext";

const MATERIAL_OPTIONS = [
  "Cotton",
  "Polyester",
  "Wool",
  "Linen",
  "Nylon",
  "Spandex / Elastane",
  "Rayon / Viscose",
  "Acrylic",
  "Silk",
  "Other",
];

const MATERIAL_CARE_RULES = {
  Cotton: {
    washLevel: 1,
    dryLevel: 1,
    ironLevel: 3,
    bleachLevel: 1,
  },

  Polyester: {
    washLevel: 1,
    dryLevel: 2,
    ironLevel: 2,
    bleachLevel: 2,
  },

  Wool: {
    washLevel: 3,
    dryLevel: 3,
    ironLevel: 2,
    bleachLevel: 3,
  },

  Linen: {
    washLevel: 1,
    dryLevel: 2,
    ironLevel: 3,
    bleachLevel: 2,
  },

  Nylon: {
    washLevel: 2,
    dryLevel: 2,
    ironLevel: 1,
    bleachLevel: 2,
  },

  "Spandex / Elastane": {
    washLevel: 2,
    dryLevel: 3,
    ironLevel: 1,
    bleachLevel: 3,
  },

  "Rayon / Viscose": {
    washLevel: 3,
    dryLevel: 3,
    ironLevel: 2,
    bleachLevel: 3,
  },

  Acrylic: {
    washLevel: 2,
    dryLevel: 2,
    ironLevel: 1,
    bleachLevel: 2,
  },

  Silk: {
    washLevel: 3,
    dryLevel: 3,
    ironLevel: 1,
    bleachLevel: 3,
  },

  Other: {
    washLevel: 3,
    dryLevel: 3,
    ironLevel: 1,
    bleachLevel: 3,
  },
};

function getWeightedCareLevel(
  materials,
  property
) {
  if (materials.length === 0) {
    return 0;
  }

  const weightedScore =
    materials.reduce(
      (total, item) => {
        const rules =
          MATERIAL_CARE_RULES[
            item.material
          ];

        if (!rules) {
          return total;
        }

        return (
          total +
          rules[property] *
            item.percentage
        );
      },
      0
    ) / 100;

  /*
   * A material making up a meaningful
   * portion of the garment can impose
   * a stricter care requirement.
   */
  const significantMaterials =
    materials.filter(
      (item) =>
        item.percentage >= 20
    );

  const strictestSignificantLevel =
    significantMaterials.reduce(
      (highest, item) => {
        const level =
          MATERIAL_CARE_RULES[
            item.material
          ]?.[property] || 0;

        return Math.max(
          highest,
          level
        );
      },
      0
    );

  let weightedLevel;

  if (weightedScore < 1.5) {
    weightedLevel = 1;
  } else if (
    weightedScore < 2.25
  ) {
    weightedLevel = 2;
  } else {
    weightedLevel = 3;
  }

  return Math.max(
    weightedLevel,
    strictestSignificantLevel
  );
}

function getCareGuide(
  selectedMaterials
) {
  const materials =
    Object.entries(
      selectedMaterials
    )
      .filter(
        ([, percentage]) =>
          Number(percentage) > 0
      )
      .map(
        ([
          material,
          percentage,
        ]) => ({
          material,
          percentage:
            Number(percentage),
        })
      );

  if (materials.length === 0) {
    return null;
  }

  const washLevel =
    getWeightedCareLevel(
      materials,
      "washLevel"
    );

  const dryLevel =
    getWeightedCareLevel(
      materials,
      "dryLevel"
    );

  const ironLevel =
    getWeightedCareLevel(
      materials,
      "ironLevel"
    );

  const bleachLevel =
    getWeightedCareLevel(
      materials,
      "bleachLevel"
    );

  const washing =
    washLevel === 3
      ? "Hand wash cold or use a very gentle cycle."
      : washLevel === 2
      ? "Machine wash cold on a gentle cycle."
      : "Machine wash cold or warm on a normal cycle.";

  const drying =
    dryLevel === 3
      ? "Air dry or lay flat to reduce heat and mechanical stress."
      : dryLevel === 2
      ? "Air dry when possible, or tumble dry on low heat."
      : "Tumble dry on low to medium heat.";

  const ironing =
    ironLevel === 1
      ? "Use low heat if ironing is needed."
      : ironLevel === 2
      ? "Use low to medium heat if ironing is needed."
      : "Medium to high heat may be suitable for the fibers, if the garment label permits it.";

  const bleaching =
    bleachLevel === 3
      ? "Avoid bleach unless the garment label specifically permits it."
      : bleachLevel === 2
      ? "Use only non-chlorine bleach when needed and when permitted by the garment label."
      : "Check the garment label before using bleach.";

  return {
    washing,
    drying,
    ironing,
    bleaching,
    materials,
  };
}


export default function ClothingCareScreen() {
  const {
    clothingItems,
    updateClothingItem,
  } = useCloset();

  const [
    selectedItemId,
    setSelectedItemId,
  ] = useState(null);

  const [
    selectedMaterials,
    setSelectedMaterials,
  ] = useState({});

  const selectedItem =
    clothingItems.find(
      (item) =>
        item.id === selectedItemId
    );

  const toggleMaterial = (
    material
  ) => {
    setSelectedMaterials(
      (current) => {
        if (
          Object.prototype.hasOwnProperty.call(
            current,
            material
          )
        ) {
          const updated = {
            ...current,
          };

          delete updated[
            material
          ];

          return updated;
        }

        return {
          ...current,
          [material]: "",
        };
      }
    );
  };

  const updatePercentage = (
    material,
    value
  ) => {
    const numbersOnly =
      value.replace(
        /[^0-9]/g,
        ""
      );

    const numericValue =
      Number(numbersOnly);

    if (
      numbersOnly !== "" &&
      numericValue > 100
    ) {
      return;
    }

    setSelectedMaterials(
      (current) => ({
        ...current,
        [material]:
          numbersOnly,
      })
    );
  };

  const totalPercentage =
    Object.values(
      selectedMaterials
    ).reduce(
      (total, value) =>
        total +
        (Number(value) || 0),
      0
    );
    const careGuide =
        getCareGuide(
            selectedMaterials
    );

  const handleSelectItem = (
    item
  ) => {
    setSelectedItemId(
      item.id
    );

    const savedMaterials =
      item.materials || [];

    const materialObject = {};

    savedMaterials.forEach(
      ({
        material,
        percentage,
      }) => {
        materialObject[
          material
        ] =
          String(percentage);
      }
    );

    setSelectedMaterials(
      materialObject
    );
  };

  const handleSave = () => {
    if (!selectedItem) {
      Alert.alert(
        "Select an Item",
        "Choose a clothing item first."
      );

      return;
    }

    const materials =
      Object.entries(
        selectedMaterials
      )
        .filter(
          ([, percentage]) =>
            Number(
              percentage
            ) > 0
        )
        .map(
          ([
            material,
            percentage,
          ]) => ({
            material,
            percentage:
              Number(
                percentage
              ),
          })
        );

    if (
      materials.length === 0
    ) {
      Alert.alert(
        "Add Materials",
        "Select at least one material and enter its percentage."
      );

      return;
    }

    if (
      totalPercentage !== 100
    ) {
      Alert.alert(
        "Check Percentages",
        `Your material percentages currently total ${totalPercentage}%. They need to equal 100%.`
      );

      return;
    }

    updateClothingItem(
      selectedItem.id,
      {
        materials,
      }
    );

    Alert.alert(
      "Materials Saved",
      `Material information was saved for ${
        selectedItem.name ||
        "this item"
      }.`
    );
  };

  return (
    <SafeScreen>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageHeader}>
            <Text style={styles.eyebrow}>
                WARDROBE CARE
            </Text>

        <Text style={styles.title}>
            Clothing Care
        </Text>

        <Text style={styles.subtitle}>
        Add material composition to get
        general care guidance for your pieces.
        </Text>
    </View>

        {/* CLOTHING ITEM */}

        <View style={styles.sectionHeading}>
  <View style={styles.sectionIcon}>
    <Ionicons
      name="shirt-outline"
      size={18}
      color={colors.accent}
    />
  </View>

  <View>
    <Text style={styles.sectionTitle}>
      Choose a piece
    </Text>

    <Text style={styles.sectionSubtitle}>
      Select an item from your closet
    </Text>
  </View>
</View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.itemRow
          }
        >
            {selectedItem && (
  <View style={styles.selectedItemSummary}>
    <Image
      source={{
        uri:
          selectedItem.processedImageUri ||
          selectedItem.imageUri,
      }}
      style={styles.selectedItemImage}
      resizeMode="contain"
    />

    <View style={styles.selectedItemInfo}>
      <Text style={styles.selectedItemLabel}>
        SELECTED PIECE
      </Text>

      <Text
        style={styles.selectedItemName}
        numberOfLines={1}
      >
        {selectedItem.name ||
          selectedItem.category}
      </Text>

      <Text style={styles.selectedItemCategory}>
        {selectedItem.category}
        {selectedItem.subCategory
          ? ` · ${selectedItem.subCategory}`
          : ""}
      </Text>
    </View>

    <Ionicons
      name="checkmark-circle"
      size={23}
      color={colors.accent}
    />
  </View>
)}
          {clothingItems.map(
            (item) => {
              const isSelected =
                item.id ===
                selectedItemId;

              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.itemCard,

                    isSelected &&
                      styles.itemCardSelected,
                  ]}
                  onPress={() =>
                    handleSelectItem(
                      item
                    )
                  }
                >
                  <Image
                    source={{
                      uri:
                        item.processedImageUri ||
                        item.imageUri,
                    }}
                    style={
                      styles.itemImage
                    }
                    resizeMode="contain"
                  />
                {isSelected && (
                    <View style={styles.selectedBadge}>
                    <Ionicons
                    name="checkmark"
                    size={13}
                    color="#FFFFFF"
                />
            </View>
        )}


                  <Text
                    style={
                      styles.itemName
                    }
                    numberOfLines={
                      1
                    }
                  >
                    {item.name ||
                      item.category}
                  </Text>
                </Pressable>
              );
            }
          )}
        </ScrollView>

        {selectedItem && (
          <>
            {/* MATERIALS */}

            <View style={styles.sectionHeading}>
                <View style={styles.sectionIcon}>
                    <Ionicons
                    name="layers-outline"
                    size={18}
                    color={colors.accent}
                />
        </View>

            <View style={styles.sectionHeadingText}>
                <Text style={styles.sectionTitle}>
                    Material Composition
                </Text>

            <Text style={styles.sectionSubtitle}>
                Select fibers and enter percentages
            </Text>
        </View>
    </View>

            <View
              style={
                styles.materialCard
              }
            >
              {MATERIAL_OPTIONS.map(
                (material) => {
                  const isSelected =
                    Object.prototype.hasOwnProperty.call(
                      selectedMaterials,
                      material
                    );

                  return (
                    <View
                      key={
                        material
                      }
                      style={
                        styles.materialRow
                      }
                    >
                      <Pressable
                        style={[
                          styles.checkbox,

                          isSelected &&
                            styles.checkboxSelected,
                        ]}
                        onPress={() =>
                          toggleMaterial(
                            material
                          )
                        }
                      >
                       {isSelected && (
                         <Ionicons
                            name="checkmark"
                            size={15}
                            color="#FFFFFF"
                        />
                    )}
                      </Pressable>

                      <Pressable
                        style={
                          styles.materialNameContainer
                        }
                        onPress={() =>
                          toggleMaterial(
                            material
                          )
                        }
                      >
                        <Text
                          style={
                            styles.materialName
                          }
                        >
                          {material}
                        </Text>
                      </Pressable>

                      <TextInput
                        style={[
                          styles.percentageInput,

                          !isSelected &&
                            styles.percentageInputDisabled,
                        ]}
                        value={
                          isSelected
                            ? selectedMaterials[
                                material
                              ]
                            : ""
                        }
                        onChangeText={(
                          value
                        ) =>
                          updatePercentage(
                            material,
                            value
                          )
                        }
                        editable={
                          isSelected
                        }
                        keyboardType="number-pad"
                        maxLength={3}
                        placeholder="0"
                        placeholderTextColor={
                          colors.secondaryText
                        }
                      />

                      <Text
                        style={
                          styles.percentSymbol
                        }
                      >
                        %
                      </Text>
                    </View>
                  );
                }
              )}

             <View>
  <Text style={styles.totalLabel}>
    TOTAL COMPOSITION
  </Text>

  <Text style={styles.totalHint}>
    Percentages must equal 100%
  </Text>
</View>

<View
  style={[
    styles.totalBadge,
    totalPercentage === 100 &&
      styles.totalBadgeComplete,
  ]}
>
  {totalPercentage === 100 && (
    <Ionicons
      name="checkmark"
      size={14}
      color="#FFFFFF"
    />
  )}

  <Text
    style={[
      styles.totalValue,
      totalPercentage === 100 &&
        styles.totalValueComplete,
    ]}
  >
    {totalPercentage}%
  </Text>
</View>
            </View>
{/* CARE GUIDE */}

<View style={styles.sectionHeading}>
  <View style={styles.sectionIcon}>
    <Ionicons
      name="sparkles-outline"
      size={18}
      color={colors.accent}
    />
  </View>

  <View style={styles.sectionHeadingText}>
    <Text style={styles.sectionTitle}>
      Care Guide
    </Text>

    <Text style={styles.sectionSubtitle}>
      Based on material composition
    </Text>
  </View>
</View>

<View style={styles.careCard}>
  {careGuide ? (
    <>
      <View style={styles.careGuideHeader}>
        <View>
          <Text style={styles.careEyebrow}>
            MATERIAL-BASED
          </Text>

          <Text style={styles.careGuideTitle}>
            Care guidance
          </Text>
        </View>

        <View style={styles.careGuideIcon}>
          <Ionicons
            name="leaf-outline"
            size={21}
            color="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.careList}>
        <View style={styles.careRow}>
          <View style={styles.careIcon}>
            <Ionicons
              name="water-outline"
              size={19}
              color={colors.accent}
            />
          </View>

          <View style={styles.careContent}>
            <Text style={styles.careHeading}>
              Washing
            </Text>

            <Text style={styles.careText}>
              {careGuide.washing}
            </Text>
          </View>
        </View>

        <View style={styles.careDivider} />

        <View style={styles.careRow}>
          <View style={styles.careIcon}>
            <Ionicons
              name="refresh-outline"
              size={19}
              color={colors.accent}
            />
          </View>

          <View style={styles.careContent}>
            <Text style={styles.careHeading}>
              Drying
            </Text>

            <Text style={styles.careText}>
              {careGuide.drying}
            </Text>
          </View>
        </View>

        <View style={styles.careDivider} />

        <View style={styles.careRow}>
          <View style={styles.careIcon}>
            <Ionicons
              name="thermometer-outline"
              size={19}
              color={colors.accent}
            />
          </View>

          <View style={styles.careContent}>
            <Text style={styles.careHeading}>
              Ironing
            </Text>

            <Text style={styles.careText}>
              {careGuide.ironing}
            </Text>
          </View>
        </View>

        <View style={styles.careDivider} />

        <View style={styles.careRow}>
          <View style={styles.careIcon}>
            <Ionicons
              name="flask-outline"
              size={19}
              color={colors.accent}
            />
          </View>

          <View style={styles.careContent}>
            <Text style={styles.careHeading}>
              Bleaching
            </Text>

            <Text style={styles.careText}>
              {careGuide.bleaching}
            </Text>
          </View>
        </View>
      </View>
    </>
  ) : (
    <View style={styles.emptyCareGuide}>
      <View style={styles.emptyCareIcon}>
        <Ionicons
          name="leaf-outline"
          size={22}
          color={colors.accent}
        />
      </View>

      <Text style={styles.emptyCareTitle}>
        Add the material composition
      </Text>

      <Text style={styles.emptyCareText}>
        Your care guidance will appear here
        as you enter the garment's materials.
      </Text>
    </View>
  )}

  <View style={styles.notice}>
    <Ionicons
      name="information-circle-outline"
      size={20}
      color={colors.accent}
    />

    <View style={styles.noticeContent}>
      <Text style={styles.noticeTitle}>
        Check the garment label first
      </Text>

      <Text style={styles.noticeText}>
        Material composition alone cannot
        determine exact care requirements.
        Always follow the manufacturer's
        care label when it differs from this
        guidance.
      </Text>
    </View>
  </View>
</View>

            <Pressable
              style={[
                styles.saveButton,
                totalPercentage !== 100 &&
                    styles.saveButtonIncomplete,
                ]}
              onPress={
                handleSave
              }
            >
             <View style={styles.saveButtonContent}>
                <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#FFFFFF"
                />

            <Text style={styles.saveButtonText}>
                Save Materials
            </Text>
        </View>
            </Pressable>
          </>
        )}
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
    paddingBottom: 50,
  },

  /* PAGE HEADER */

  pageHeader: {
    marginBottom: 30,
  },

  eyebrow: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.accent,
    marginBottom: 3,
  },

  title: {
    fontFamily: typography.extraBold,
    fontSize: 34,
    letterSpacing: -1.2,
    color: colors.text,
  },

  subtitle: {
    marginTop: 5,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.secondaryText,
    maxWidth: 330,
  },

  /* SECTION HEADINGS */

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 8,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  sectionHeadingText: {
    flex: 1,
  },

  sectionTitle: {
    fontFamily: typography.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    color: colors.text,
  },

  sectionSubtitle: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },

  /* ITEM PICKER */

  itemRow: {
    paddingBottom: 22,
  },

  itemCard: {
    width: 112,
    marginRight: 11,
    padding: 9,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 18,
    position: "relative",
  },

  itemCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },

  itemImage: {
    width: "100%",
    height: 94,
  },

  itemName: {
    marginTop: 7,
    fontFamily: typography.semibold,
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
  },

  selectedBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 23,
    height: 23,
    borderRadius: 8,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  /* SELECTED ITEM */

  selectedItemSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 13,
    marginBottom: 30,
  },

  selectedItemImage: {
    width: 64,
    height: 64,
    marginRight: 13,
  },

  selectedItemInfo: {
    flex: 1,
  },

  selectedItemLabel: {
    fontFamily: typography.bold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: colors.accent,
    marginBottom: 3,
  },

  selectedItemName: {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.text,
  },

  selectedItemCategory: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },

  /* MATERIALS */

  materialCard: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 30,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },

  materialRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  materialNameContainer: {
    flex: 1,
    paddingLeft: 12,
  },

  materialName: {
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.text,
  },

  percentageInput: {
    width: 52,
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    textAlign: "center",
    fontFamily: typography.semibold,
    fontSize: 13,
    color: colors.text,
  },

  percentageInputDisabled: {
    opacity: 0.35,
  },

  percentSymbol: {
    width: 22,
    marginLeft: 5,
    fontFamily: typography.medium,
    fontSize: 13,
    color: colors.secondaryText,
  },

  /* TOTAL */

  totalRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontFamily: typography.bold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.text,
  },

  totalHint: {
    fontFamily: typography.regular,
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },

  totalBadge: {
    minWidth: 62,
    height: 34,
    borderRadius: 11,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  totalBadgeComplete: {
    backgroundColor: colors.accent,
  },

  totalValue: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: colors.secondaryText,
  },

  totalValueComplete: {
    color: "#FFFFFF",
  },

  /* CARE GUIDE */

  careCard: {
    marginBottom: 22,
    backgroundColor: colors.surface,
    borderRadius: 22,
    overflow: "hidden",
  },

  careGuideHeader: {
    backgroundColor: colors.accent,
    paddingHorizontal: 19,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  careEyebrow: {
    fontFamily: typography.bold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 3,
  },

  careGuideTitle: {
    fontFamily: typography.bold,
    fontSize: 19,
    letterSpacing: -0.4,
    color: "#FFFFFF",
  },

  careGuideIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },

  careList: {
    paddingHorizontal: 18,
    paddingTop: 4,
  },

  careRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 17,
  },

  careIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  careContent: {
    flex: 1,
  },

  careHeading: {
    fontFamily: typography.bold,
    fontSize: 14,
    color: colors.text,
  },

  careText: {
    marginTop: 4,
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondaryText,
  },

  careDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 50,
  },

  /* EMPTY CARE GUIDE */

  emptyCareGuide: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 28,
    paddingBottom: 24,
  },

  emptyCareIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  emptyCareTitle: {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.text,
  },

  emptyCareText: {
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 5,
  },

  /* NOTICE */

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    margin: 14,
    marginTop: 6,
    padding: 14,
    backgroundColor: colors.accentLight,
    borderRadius: 14,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTitle: {
    marginBottom: 4,
    fontFamily: typography.bold,
    fontSize: 12,
    color: colors.text,
  },

  noticeText: {
    fontFamily: typography.regular,
    fontSize: 11,
    lineHeight: 17,
    color: colors.secondaryText,
  },

  /* SAVE */

  saveButton: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 16,
  },

  saveButtonIncomplete: {
    opacity: 0.45,
  },

  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  saveButtonText: {
    fontFamily: typography.bold,
    color: "#FFFFFF",
    fontSize: 15,
  },
});