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

import SafeScreen from "../components/SafeScreen";
import { colors } from "../constants/colors";
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
        <Text style={styles.title}>
          Clothing Care
        </Text>

        <Text
          style={styles.subtitle}
        >
          Select an item and add its
          material composition.
        </Text>

        {/* CLOTHING ITEM */}

        <Text
          style={styles.sectionTitle}
        >
          SELECT AN ITEM
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.itemRow
          }
        >
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

            <Text
              style={
                styles.sectionTitle
              }
            >
              MATERIAL COMPOSITION
            </Text>

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
                          <Text
                            style={
                              styles.checkmark
                            }
                          >
                            ✓
                          </Text>
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

              <View
                style={
                  styles.totalRow
                }
              >
                <Text
                  style={
                    styles.totalLabel
                  }
                >
                  Total
                </Text>

                <Text
                  style={[
                    styles.totalValue,

                    totalPercentage ===
                      100 &&
                      styles.totalComplete,
                  ]}
                >
                  {totalPercentage}%
                  {totalPercentage ===
                  100
                    ? " ✓"
                    : ""}
                </Text>
              </View>
            </View>

            {/* CARE GUIDE */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              CARE GUIDE
            </Text>

        <View style={styles.careCard}>
                {careGuide ? (
                    <>
      <Text style={styles.careBasedOn}>
        Material-Base Care Guide
      </Text>

      <View style={styles.careSection}>
        <Text style={styles.careHeading}>
          Washing
        </Text>

        <Text style={styles.careText}>
          {careGuide.washing}
        </Text>
      </View>

      <View style={styles.careSection}>
        <Text style={styles.careHeading}>
          Drying
        </Text>

        <Text style={styles.careText}>
          {careGuide.drying}
        </Text>
      </View>

      <View style={styles.careSection}>
        <Text style={styles.careHeading}>
          Ironing
        </Text>

        <Text style={styles.careText}>
          {careGuide.ironing}
        </Text>
      </View>

      <View style={styles.careSection}>
        <Text style={styles.careHeading}>
          Bleaching
        </Text>

        <Text style={styles.careText}>
          {careGuide.bleaching}
        </Text>
      </View>
    </>
  ) : (
    <Text style={styles.careText}>
      Select materials and enter their
      percentages to view general care
      guidance.
    </Text>
  )}

  <View style={styles.notice}>
    <Text style={styles.noticeTitle}>
      Check the garment label first
    </Text>

    <Text style={styles.noticeText}>
      Material composition alone cannot
      determine a garment's exact care
      requirements. Always follow the
      manufacturer's care label when it
      differs from this guidance.
    </Text>
  </View>
</View>

            <Pressable
              style={
                styles.saveButton
              }
              onPress={
                handleSave
              }
            >
              <Text
                style={
                  styles.saveButtonText
                }
              >
                Save Materials
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    container: {
      paddingHorizontal: 20,
      paddingTop: 28,
      paddingBottom: 50,
    },

    title: {
      fontSize: 27,
      fontWeight: "700",
      color: colors.text,
    },

    subtitle: {
      marginTop: 6,
      marginBottom: 30,
      fontSize: 14,
      lineHeight: 20,
      color:
        colors.secondaryText,
    },

    sectionTitle: {
      marginTop: 8,
      marginBottom: 12,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.8,
      color:
        colors.secondaryText,
    },

    itemRow: {
      paddingBottom: 24,
    },

    itemCard: {
      width: 105,
      marginRight: 12,
      padding: 8,

      backgroundColor:
        colors.surface,

      borderWidth: 2,
      borderColor:
        "transparent",

      borderRadius: 18,
    },

    itemCardSelected: {
      borderColor:
        colors.accent,
    },

    itemImage: {
      width: "100%",
      height: 90,
    },

    itemName: {
      marginTop: 7,
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
      color: colors.text,
    },

    materialCard: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      marginBottom: 26,

      backgroundColor:
        colors.surface,

      borderWidth: 1,
      borderColor:
        colors.border,

      borderRadius: 20,
    },

    materialRow: {
      minHeight: 58,
      flexDirection: "row",
      alignItems: "center",

      borderBottomWidth: 1,
      borderBottomColor:
        colors.border,
    },

    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 7,

      borderWidth: 1.5,
      borderColor:
        colors.border,

      justifyContent:
        "center",
      alignItems: "center",
    },

    checkboxSelected: {
      backgroundColor:
        colors.accent,

      borderColor:
        colors.accent,
    },

    checkmark: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
    },

    materialNameContainer: {
      flex: 1,
      paddingLeft: 12,
    },

    materialName: {
      fontSize: 14,
      color: colors.text,
    },

    percentageInput: {
      width: 54,
      height: 38,

      borderWidth: 1,
      borderColor:
        colors.border,

      borderRadius: 10,

      backgroundColor:
        colors.background,

      textAlign: "center",

      fontSize: 14,
      color: colors.text,
    },

    percentageInputDisabled: {
      opacity: 0.4,
    },

    percentSymbol: {
      width: 24,
      marginLeft: 5,
      fontSize: 14,
      color:
        colors.secondaryText,
    },

    totalRow: {
      minHeight: 58,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    totalLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    totalValue: {
      fontSize: 15,
      fontWeight: "700",
      color:
        colors.secondaryText,
    },

    totalComplete: {
      color: colors.accent,
    },

    careCard: {
      padding: 18,
      marginBottom: 22,

      backgroundColor:
        colors.surface,

      borderWidth: 1,
      borderColor:
        colors.border,

      borderRadius: 20,
    },

    careHeading: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    careText: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      color:
        colors.secondaryText,
    },

    notice: {
      marginTop: 16,
      padding: 13,

      backgroundColor:
        colors.background,

      borderRadius: 12,
    },

    noticeText: {
      fontSize: 12,
      lineHeight: 18,
      color:
        colors.secondaryText,
    },

    saveButton: {
      minHeight: 54,

      justifyContent:
        "center",
      alignItems: "center",

      backgroundColor:
        colors.accent,

      borderRadius: 18,
    },

    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
    careBasedOn: {
  marginBottom: 18,
  fontSize: 12,
  fontWeight: "600",
  color: colors.secondaryText,
},

careSection: {
  marginBottom: 18,
},

noticeTitle: {
  marginBottom: 5,
  fontSize: 12,
  fontWeight: "700",
  color: colors.text,
},
  });