import { createContext, useContext, useRef } from "react";

const TrailerCacheContext = createContext(null);

export const TrailerCacheProvider = ({ children }) => {
  const cacheRef = useRef(new Map());

  const getTrailer = (id) => cacheRef.current.get(id);
  const setTrailer = (id, key) => cacheRef.current.set(id, key);

  return (
    <TrailerCacheContext.Provider value={{ getTrailer, setTrailer }}>
      {children}
    </TrailerCacheContext.Provider>
  );
};

export const useTrailerCache = () => useContext(TrailerCacheContext);
