const propertyOfInterestReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_PROPERTY_OF_INTEREST':
          return action.payload;
        default:
          return state;
      }
};

export default propertyOfInterestReducer;