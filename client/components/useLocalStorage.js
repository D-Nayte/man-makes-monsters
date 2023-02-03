import React, { useState, useEffect } from "react";

function getSavedValue(key, initialValue) {
  if (typeof window !== "undefined") {
    const savedValue = localStorage?.getItem(key);
    const storeData =
      savedValue !== "undefined" ? JSON.parse(savedValue) : null;
    if (storeData) {
      return storeData;
    } else {
      return initialValue;
    }
  }
}

export default function useLocalStorage(key, initialValue) {
  let [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
