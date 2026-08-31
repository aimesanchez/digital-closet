import { createContext, useContext, useState } from "react";
import { sampleClothing } from "../data/sampleClothing";

const ClosetContext = createContext();

export function ClosetProvider({ children }) {
  const [clothingItems, setClothingItems] = useState(sampleClothing);

  const addClothingItem = (item) => {
    setClothingItems((currentItems) => [
      ...currentItems,
      {
        ...item,
        id: Date.now().toString(),
      },
    ]);
  };

  return (
    <ClosetContext.Provider
      value={{
        clothingItems,
        addClothingItem,
      }}
    >
      {children}
    </ClosetContext.Provider>
  );
}

export function useCloset() {
  return useContext(ClosetContext);
}