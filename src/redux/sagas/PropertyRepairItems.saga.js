import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* addPropertyRepairItem(action) {
  console.log('addPropertyRepairItem received a dispatch!', action.payload)
  try {
    yield axios.post(`api/properties/repairItem`, action.payload)
    yield put({
        type: 'GET_PROPERTY_OF_INTEREST',
        payload: action.payload.propertyId
    })
  } catch (error) {
    console.log('Error in getting property details:', error);
  }
}

function* deletePropertyRepairItem(action) {
}

function* propertyRepairItemsSaga() {
    yield takeLatest('ADD_PROPERTY_REPAIR_ITEM', addPropertyRepairItem);
    yield takeLatest('DELETE_PROPERTY_REPAIR_ITEM', deletePropertyRepairItem);
  }
  
  export default propertyRepairItemsSaga;