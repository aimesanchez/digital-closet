import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as FileSystem from "expo-file-system/legacy";

const ClosetContext = createContext();

const CLOSET_DATA_FILE =
  `${FileSystem.documentDirectory}closet-data.json`;

const OUTFIT_DATA_FILE =
  `${FileSystem.documentDirectory}outfit-data.json`;

export function ClosetProvider({
  children,
}) {
  const [
    clothingItems,
    setClothingItems,
  ] = useState([]);

  const [
    isClosetLoaded,
    setIsClosetLoaded,
  ] = useState(false);

  const [
    savedOutfits,
    setSavedOutfits,
  ] = useState([]);

  const [
    currentOutfit,
    setCurrentOutfit,
  ] = useState(null);

  const [
    isOutfitDataLoaded,
    setIsOutfitDataLoaded,
  ] = useState(false);

  /* -------------------------------- */
  /* LOAD CLOSET                      */
  /* -------------------------------- */

  useEffect(() => {
    const loadCloset = async () => {
      try {
        const fileInfo =
          await FileSystem.getInfoAsync(
            CLOSET_DATA_FILE
          );

        if (fileInfo.exists) {
          const savedData =
            await FileSystem.readAsStringAsync(
              CLOSET_DATA_FILE
            );

          const parsedItems =
  JSON.parse(savedData);

/*
 * Remove the original placeholder/sample
 * clothes that do not have real images.
 */
const realClothingItems =
  parsedItems.filter(
    (item) =>
      item.processedImageUri ||
      item.imageUri
  );

setClothingItems(
  realClothingItems
);

console.log(
  `Loaded ${realClothingItems.length} real closet items`
);

          console.log(
            `Loaded ${parsedItems.length} closet items`
          );

        } else {
  setClothingItems([]);

  console.log(
    "No saved closet found. Starting with an empty closet."
  );
}
      } catch (error) {
        console.error(
          "Error loading closet:",
          error
        );

        setClothingItems([]);
      } finally {
        setIsClosetLoaded(true);
      }
    };

    loadCloset();
  }, []);

  /* -------------------------------- */
  /* LOAD OUTFITS                     */
  /* -------------------------------- */

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const fileInfo =
          await FileSystem.getInfoAsync(
            OUTFIT_DATA_FILE
          );

        if (!fileInfo.exists) {
          console.log(
            "No saved outfits found."
          );

          return;
        }

        const savedData =
          await FileSystem.readAsStringAsync(
            OUTFIT_DATA_FILE
          );

        const parsedData =
          JSON.parse(savedData);

        setSavedOutfits(
          parsedData.savedOutfits || []
        );

        setCurrentOutfit(
          parsedData.currentOutfit ||
            null
        );

        console.log(
          `Loaded ${
            parsedData.savedOutfits
              ?.length || 0
          } saved outfits`
        );
      } catch (error) {
        console.error(
          "Error loading outfits:",
          error
        );
      } finally {
        setIsOutfitDataLoaded(
          true
        );
      }
    };

    loadOutfits();
  }, []);

  /* -------------------------------- */
  /* SAVE CLOSET                      */
  /* -------------------------------- */

  useEffect(() => {
    if (!isClosetLoaded) {
      return;
    }

    const saveCloset =
      async () => {
        try {
          const jsonData =
            JSON.stringify(
              clothingItems
            );

          await FileSystem.writeAsStringAsync(
            CLOSET_DATA_FILE,
            jsonData
          );

          console.log(
            `Saved ${clothingItems.length} closet items`
          );
        } catch (error) {
          console.error(
            "Error saving closet:",
            error
          );
        }
      };

    saveCloset();
  }, [
    clothingItems,
    isClosetLoaded,
  ]);

  /* -------------------------------- */
  /* SAVE OUTFITS                     */
  /* -------------------------------- */

  useEffect(() => {
    if (!isOutfitDataLoaded) {
      return;
    }

    const saveOutfitData =
      async () => {
        try {
          const jsonData =
            JSON.stringify({
              savedOutfits,
              currentOutfit,
            });

          await FileSystem.writeAsStringAsync(
            OUTFIT_DATA_FILE,
            jsonData
          );

          console.log(
            `Saved ${savedOutfits.length} outfits`
          );
        } catch (error) {
          console.error(
            "Error saving outfits:",
            error
          );
        }
      };

    saveOutfitData();
  }, [
    savedOutfits,
    currentOutfit,
    isOutfitDataLoaded,
  ]);

  /* -------------------------------- */
  /* ADD CLOTHING ITEM                */
  /* -------------------------------- */

  const addClothingItem = (
    item
  ) => {
    setClothingItems(
      (currentItems) => [
        ...currentItems,

        {
          ...item,

          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
        },
      ]
    );
  };

/* -------------------------------- */
/* UPDATE CLOTHING ITEM             */
/* -------------------------------- */

const updateClothingItem = (
  itemId,
  updates
) => {
  setClothingItems(
    (currentItems) =>
      currentItems.map(
        (item) =>
          item.id === itemId
            ? {
                ...item,
                ...updates,
              }
            : item
      )
  );
};

  /* -------------------------------- */
  /* SAVE / UPDATE OUTFIT             */
  /* -------------------------------- */

  const saveOutfit = (
    outfit
  ) => {
    const now = Date.now();

    const outfitId =
      outfit.id ||
      `outfit-${now}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const savedOutfit = {
      ...outfit,

      id: outfitId,

      createdAt:
        outfit.createdAt || now,

      updatedAt: now,
    };

    setSavedOutfits(
      (currentOutfits) => {
        const alreadyExists =
          currentOutfits.some(
            (existingOutfit) =>
              existingOutfit.id ===
              outfitId
          );

        if (alreadyExists) {
          return currentOutfits.map(
            (existingOutfit) =>
              existingOutfit.id ===
              outfitId
                ? savedOutfit
                : existingOutfit
          );
        }

        return [
          ...currentOutfits,
          savedOutfit,
        ];
      }
    );

    /*
     * The most recently saved outfit
     * becomes the outfit shown on Home.
     */
    setCurrentOutfit(
      savedOutfit
    );

    return savedOutfit;
  };

  /* -------------------------------- */
  /* CONTEXT                          */
  /* -------------------------------- */

  return (
    <ClosetContext.Provider
      value={{
        clothingItems,
        addClothingItem,
        updateClothingItem,
        isClosetLoaded,

        savedOutfits,
        currentOutfit,
        saveOutfit,
        isOutfitDataLoaded,
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
}

export function useCloset() {
  return useContext(
    ClosetContext
  );
}