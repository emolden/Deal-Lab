import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getProperties(action) {
}

function* addProperty(action) {
}

function* deleteProperty(action) {
}

function* updateProperty(action) {
}

function* backToDefault(action) {
}

function* getPropertyOfInterest(action) {
  console.log('in getPropertyOfInterest saga and the playload is: ', action.payload);

  try {
    // const response = yield axios.get(`/api/properties/${action.payload}`);

    // yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('getPropertyOfInterest get request failed', error);
  }
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