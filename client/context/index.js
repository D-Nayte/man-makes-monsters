import { createContext, useContext, useState } from "react";

const store = createContext();

export const ContextWrapper = ({ children }) => {
  const [storeData, setStoreData] = useState({});

  return (
    <store.Provider value={{ storeData, setStoreData }}>
      {children}
    </store.Provider>
  );
};

export const useAppContext = () => {
  return useContext(store);
};
