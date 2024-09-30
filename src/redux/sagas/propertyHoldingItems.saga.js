import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* addPropertyHoldingItem(action) {
}

function* deletePropertyHoldingItem(action) {
}

function* propertyHoldingItemsSaga() {
    yield takeLatest('ADD_PROPERTY_HOLDING_ITEM', addPropertyHoldingItem);
    yield takeLatest('DELETE_PROPERTY_HOLDING_ITEM', deletePropertyHoldingItem);
  }
  
  export default propertyHoldingItemsSaga;