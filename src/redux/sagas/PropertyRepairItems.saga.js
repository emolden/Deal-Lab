import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* addPropertyRepairItem(action) {
}

function* deletePropertyRepairItem(action) {
}

function* propertyRepairItemsSaga() {
    yield takeLatest('ADD_PROPERTY_REPAIR_ITEM', addPropertyRepairItem);
    yield takeLatest('DELETE_PROPERTY_REPAIR_ITEM', deletePropertyRepairItem);
  }
  
  export default propertyRepairItemsSaga;