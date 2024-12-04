import React, { createContext, useContext, useState } from "react";

interface IAppContext {
  isAuthenticated: boolean;
  user: IUser | null;
  setUser: (v: IUser | null) => void;
  setIsAuthenticated: (v: boolean) => void;
  appLoading: boolean;
  setAppLoading: (v: boolean) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode
}
export const AppProvider = (props: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [appLoading, setAppLoading] = useState(true);

  return (
    <CurrentAppContext.Provider value={{
      isAuthenticated, user, setIsAuthenticated, setUser, appLoading, setAppLoading
    }}>
      {props.children}
    </CurrentAppContext.Provider>
  );
};

export const useCurrentApp = () => {
  const currentAppContext = useContext(CurrentAppContext);

  if (!currentAppContext) {
    throw new Error(
      "useCurrentApp has to be used within <CurrentAppContext.Provider>"
    );
  }

  return currentAppContext;
};