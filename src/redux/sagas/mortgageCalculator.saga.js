import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getCalculations(action) {
    try {
        
    } catch (error) {
        console.log('Error getting calculations:', error);
    }
}

function* addCalculations(action) {
    const propertyId = action.payload;
    try {
        // const response = yield axios.post(`/api/mortgageCalculator/${propertyId}`)
        console.log('Mortgage Calculations data:', response.data);
        yield put({
            type: 'SET_CALCULATIONS',
            payload: response.data
        })
    } catch (error) {
        console.log('Error posting calculations for property:', error);
    }
}

function* updateCalculations(action) {
    const propertyId = action.payload.propertyId;
    console.log('Updating calculations payload:', action.payload);
    try {
        yield axios.put(`/api/mortgageCalculator/${propertyId}`, action.payload)
        yield put({
            type: 'GET_PROPERTY_OF_INTEREST',
            payload: propertyId
        })
    } catch (error) {
        console.log('Error updating calculations for property:', error);
    }
}

function* mortgageCalculatorSaga() {
    // yield takeLatest('GET_CALCULATIONS', getCalculations);
    yield takeLatest('GET_PROPERTY_OF_INTEREST', addCalculations);
    yield takeLatest('UPDATE_CALCULATIONS', updateCalculations);
}

export default mortgageCalculatorSaga;

// reducer: 'SET_CALCULATIONS'
// url: '/api/mortgageCalculator'
// GET_PROPERTY_OF_INTEREST