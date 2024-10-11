const allPropertiesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return action.payload;
    case 'UNSET_PROPERTIES':
      return {};
    case 'SET_PROPERTIES_FILTERED':
      return {...state, properties: action.payload}
    default:
      return state;
  }
  };
  
  export default allPropertiesReducer;