import {ACTIONS} from '../constants/actions'

export const shopReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.GET_SHOP_IDS:
        return { ...state, shopIds: [...state.shopIds, { ...action.payload}] };
      default:
        return state;
    }
};

export const serverReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SERVER_ID:
      return { ...state, serverId: action.payload };
   
    default:
      return state;
  }
};
  