const mortgageCalculatorReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_CALCULATIONS':
            return action.payload;
        case 'UNSET_CALCULATIONS':
            return {};
        default:
            return state;
    }
};

export default mortgageCalculatorReducer;