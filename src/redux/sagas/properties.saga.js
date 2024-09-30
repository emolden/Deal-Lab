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


function* propertiesSaga() {
    yield takeLatest('GET_PROPERTY', getProperties);
    yield takeLatest('ADD_PROPERTY', addProperty);
    yield takeLatest('DELETE_PROPERTY', deleteProperty);
    yield takeLatest('UPDATE_PROPERTY', updateProperty);
  }
  
  export default propertiesSaga;