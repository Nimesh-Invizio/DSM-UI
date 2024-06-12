import { createContext, useReducer } from "react";

// Define the initial state
const initialState = {
  shopId: [],
};

// Define the reducer function
const shopReducer = (state, action) => {
  switch (action.type) {
    case "SET_SHOP_ID":
      return { ...state, shopId: action.payload };
    default:
      return state;
  }
};

// Create the context
export const ShopContext = createContext(initialState);

// Create the context provider
export const ShopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Define the action creators
  const setShopId = (shopId) => {
    dispatch({ type: "SET_SHOP_ID", payload: shopId });
  };

  // Provide the state and action creators to the context
  const value = {
    shopId: state.shopId,
    setShopId,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};