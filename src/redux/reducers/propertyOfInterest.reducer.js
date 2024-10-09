const propertyOfInterestReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_PROPERTY_OF_INTEREST':
          return action.payload;
        case 'UPDATE_PROPERTY_PURCHASE_PRICE':
          let newPrice = ''; 
          console.log('update propertypurchase price: ', action.payload) 
          for(let char of action.payload) {
            if(char === "$") {
            }
            else if (char === ','){
            }
            else{
              console.log('char should be a number: ', char, newPrice)
              newPrice += char;
            }
          }
          let property = [{...state.property[0], purchase_price: newPrice}];
          console.log('updated property object: ', property)
          return {
            holdingItems: state.holdingItems,
            repairItems: state.repairItems,
            property: property
          };
        case 'UPDATE_PROPERTY_HOLDING_PERIOD':
          console.log('update property holding period: ', action.payload)
          let prop = [{...state.property[0], holding_period: action.payload}];
          console.log('new property object: ', prop)
          return {
            holdingItems: state.holdingItems,
            repairItems: state.repairItems,
            property: prop
          };
          
        case 'UPDATE_PROPERTY_AFTER_REPAIR_VALUE':
          console.log('update property after repair value: ', action.payload)
          let newValue = '';  
          for(let char of action.payload) {
            if(char === "$") {
            }
            else if (char === ','){
            }
            else{
              console.log('char should be a number: ', char, newValue)
              newValue += char;
            }
          }
          let newProperty = [{...state.property[0], after_repair_value: newValue}];
          console.log('new property obejct: ', newProperty)
          return {
            holdingItems: state.holdingItems,
            repairItems: state.repairItems,
            property: newProperty
          };
        default:
          return state;
      }
};

export default propertyOfInterestReducer;