const initState = { tags: [] };
export default (state = initState, action: TagActions): TagStates => {
  switch (action.type) {
    case 'SET_TAG':
      return { ...state, tags: [...action.data] };
    default:
      return state;
  }
};
