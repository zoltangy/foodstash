import React, { createContext, useContext, useState } from "react";
import Portal from "@material-ui/core/Portal";
import Loader from "./Loader";

const LoaderContext = createContext(false);

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loaderState, setLoaderState] = useState(null);

  return (
    <>
      <LoaderContext.Provider value={setLoaderState} children={children} />
      {loaderState && (
        <Portal container={loaderState.container.current}>
          <Loader open={loaderState.open} />
        </Portal>
      )}
    </>
  );
};
