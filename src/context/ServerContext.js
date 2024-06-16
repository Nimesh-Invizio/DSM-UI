import { createContext, useReducer } from "react";
import {serverReducer} from "./Reducers";
import {ACTIONS} from '../constants/actions'




// Define the initial state
const initialState = {
  serverId: null,
};

// Create the context
export const ServerContext = createContext(initialState);

// Create the context provider
export const ServerProvider = ({ children }) => {
  const [serverState, serverDispatch] = useReducer(serverReducer, initialState);

  // Define the action creators
  const setServerId = (serverId) => {
    serverDispatch({ type: ACTIONS.SET_SERVER_ID, payload: serverId });
  };

 

  return (
    <ServerContext.Provider
      value={{ serverState, setServerId }}
    >
      {children}
    </ServerContext.Provider>
  );
};