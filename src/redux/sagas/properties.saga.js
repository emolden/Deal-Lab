import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getProperties(action) {
  const userId = action.payload;
  try {
    const response = yield axios.get(`/api/properties/${userId}`)
    yield put({
      type: 'SET_PROPERTIES',
      payload: response.data
    })
  } catch (error) {
    console.log('Error in getting properties:', error);
    
  }
  
}

function* addProperty(action) {
  // console.log('Payload data:', action.payload);
  const address = action.payload.address;
  try {
    yield axios.post(`api/properties`, {address})
    yield put({
        type: 'GET_PROPERTIES'
    })
  } catch (error) {
    console.log('Error in getting property details:', error);
  }
}

function* deleteProperty(action) {
}

function* updateProperty(action) {
}

function* backToDefault(action) {
}

function* getPropertyOfInterest(action) {
}

function* propertiesSaga() {
    yield takeLatest('GET_PROPERTIES', getProperties);
    yield takeLatest('ADD_PROPERTY', addProperty);
    yield takeLatest('DELETE_PROPERTY', deleteProperty);
    yield takeLatest('UPDATE_PROPERTY', updateProperty);
    yield takeLatest('BACK_TO_DEFAULT', backToDefault);
    yield takeLatest('GET_PROPERTY_OF_INTEREST', getPropertyOfInterest);
  }
  
  export default propertiesSaga;