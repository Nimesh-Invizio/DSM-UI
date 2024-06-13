import { createContext, useReducer } from "react";
import { shopReducer } from "./Reducers";


// Define the initial state
const initialState = {
  shopIds: [],

};

// Create the context
export const ShopContext = createContext(initialState);

// Create the context provider
export const ShopProvider = ({ children }) => {
  const [shopState, shopDispatch] = useReducer(shopReducer, initialState);

  // Define the action creators
  const setShopId = (shopId) => {
    shopDispatch({ type: "GET_SHOP_IDS", payload: shopId });
  };

  return (
    <ShopContext.Provider value={{shopState,shopDispatch}}>{children}</ShopContext.Provider>
  );
};