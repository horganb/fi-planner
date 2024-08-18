import { useState } from "react";

export const usePersistedState = <T>(key: string, defaultVal: T) => {
  const [renderState, setRenderState] = useState(false);
  const set = (val: T) => {
    localStorage.setItem(key, JSON.stringify(val));
    setRenderState(!renderState);
  };
  const get = () => {
    const rawVal = localStorage.getItem(key);
    return rawVal == null ? defaultVal : JSON.parse(rawVal);
  };
  return [get(), set];
};
