import React, { createContext, useContext, useState } from "react";

interface IAppContext {
  isAuthenticated: boolean;
  user: IUser | null;
  setUser: (v: IUser | null) => void;
  setIsAuthenticated: (v: boolean) => void;
  appLoading: boolean;
  setAppLoading: (v: boolean) => void;
  coutCart: number;
  setCoutCart :(v:number)=>void,
  carts: ICart[],
  setCarts :(v:ICart[])=>void
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode
}
export const AppProvider = (props: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [coutCart, setCoutCart] = useState(()=>{
    const saveCart = localStorage.getItem('cart');
    let count = 0;
    if(saveCart){
      const cartItem = JSON.parse(saveCart);
      for(let i = 0; i < cartItem.length; i++){
        count += cartItem[i].value
      }
      console.log("count",count);
    }
    return count;
  })
  const [carts, setCarts] = useState<ICart[]>(()=>{
    const saveCart = localStorage.getItem('cart');
    return saveCart ? JSON.parse(saveCart) : [];
  })
  return (
    <CurrentAppContext.Provider value={{
      isAuthenticated, user, setIsAuthenticated, setUser, appLoading, setAppLoading,coutCart,setCoutCart,carts,setCarts
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