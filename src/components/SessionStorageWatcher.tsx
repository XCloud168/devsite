import { useState, useEffect, useCallback } from "react";

export function useSessionStorageState<T>(key: string, defaultValue: T) {
  const getValue = () => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [value, setValue] = useState<T>(getValue);

  const updateValue = useCallback(
    (newValue: T) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch (e) {
        console.error("Failed to set sessionStorage:", e);
      }
    },
    [key],
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setValue(getValue());
    };

    // 监听本页面触发的 setItem，模拟响应（可选，模拟多组件同步）
    window.addEventListener("session-storage-update", handleStorageChange);

    return () => {
      window.removeEventListener("session-storage-update", handleStorageChange);
    };
  }, [key]);

  return [value, updateValue] as const;
}
