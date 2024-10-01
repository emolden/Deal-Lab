const allPropertiesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return action.payload;
    case 'UNSET_PROPERTIES':
      return {};
    default:
      return state;
  }
  };
  
  export default allPropertiesReducer;