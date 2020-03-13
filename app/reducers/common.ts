const initState = { spinning: false };
export default (state = initState, action: CommonActions): CommonState => {
  switch (action.type) {
    case 'SET_SPIN':
      return { ...state, spinning: action.data };
    default:
      return state;
  }
};
