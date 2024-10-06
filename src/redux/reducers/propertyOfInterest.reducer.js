const propertyOfInterestReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_PROPERTY_OF_INTEREST':
          return action.payload;
        case 'UPDATE_PROPERTY_PURCHASE_PRICE':
        let newPrice = '';  
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
        let property = [{
          address: state.property[0].address,
          after_repair_value: state.property[0].after_repair_value,
          holding_period: state.property[0].holding_period,
          id: state.property[0].id,
          inserted_at: state.property[0].inserted_at,
          is_selected: state.property[0].is_selected,
          property_api_id: state.property[0].property_api_id,
          purchase_price: newPrice,
          taxes_yearly: state.property[0].taxes_yearly,
          updated_at: state.property[0].updated_at,
          user_id: state.property[0].user_id,
        }];
        return {
          holdingItems: state.holdingItems,
          repairItems: state.repairItems,
          property: property
        };
        default:
          return state;
      }
};

export default propertyOfInterestReducer;