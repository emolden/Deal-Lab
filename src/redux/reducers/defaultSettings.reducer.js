const defaultSettingsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_DEFAULTS':
            return action.payload;
        case 'UNSET_DEFAULTS':
            return {};
        default:
            return state;
    }
};

export default defaultSettingsReducer;