const ACTIONS = {
    GET_SHOP_IDS:"GET_SHOP_IDS"
}

export const shopReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.GET_SHOP_IDS:
        return { ...state, shopIds: [...state.shopIds, { ...action.payload}] };
      default:
        return state;
    }
};
  