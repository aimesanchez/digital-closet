import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as FileSystem from "expo-file-system/legacy";

import { sampleClothing } from "../data/sampleClothing";

const ClosetContext = createContext();

const CLOSET_DATA_FILE =
  `${FileSystem.documentDirectory}closet-data.json`;

export function ClosetProvider({
  children,
}) {
  const [clothingItems, setClothingItems] =
    useState([]);

  const [isClosetLoaded, setIsClosetLoaded] =
    useState(false);

  /* -------------------------------- */
  /* LOAD CLOSET WHEN APP STARTS      */
  /* -------------------------------- */

  useEffect(() => {
    const loadCloset = async () => {
      try {
        const fileInfo =
          await FileSystem.getInfoAsync(
            CLOSET_DATA_FILE
          );

        /*
         * If we have saved closet data,
         * restore it.
         */
        if (fileInfo.exists) {
          const savedData =
            await FileSystem.readAsStringAsync(
              CLOSET_DATA_FILE
            );

          const parsedItems =
            JSON.parse(savedData);

          setClothingItems(parsedItems);

          console.log(
            `Loaded ${parsedItems.length} closet items`
          );
        } else {
          /*
           * First time opening the app:
           * start with sample clothing.
           */
          setClothingItems(
            sampleClothing
          );

          console.log(
            "No saved closet found. Using sample clothing."
          );
        }
      } catch (error) {
        console.error(
          "Error loading closet:",
          error
        );

        /*
         * Fall back to sample data
         * instead of crashing.
         */
        setClothingItems(
          sampleClothing
        );
      } finally {
        setIsClosetLoaded(true);
      }
    };

    loadCloset();
  }, []);

  /* -------------------------------- */
  /* SAVE WHEN CLOSET CHANGES         */
  /* -------------------------------- */

  useEffect(() => {
    /*
     * Do not save until the original
     * closet has finished loading.
     *
     * Otherwise [] could overwrite our
     * saved closet on startup.
     */
    if (!isClosetLoaded) {
      return;
    }

    const saveCloset = async () => {
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
  /* ADD CLOTHING ITEM                */
  /* -------------------------------- */

  const addClothingItem = (item) => {
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
  /* CONTEXT                          */
  /* -------------------------------- */

  return (
    <ClosetContext.Provider
      value={{
        clothingItems,
        addClothingItem,
        isClosetLoaded,
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