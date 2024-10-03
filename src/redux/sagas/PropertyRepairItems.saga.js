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
    console.log('Error adding property repair item:', error);
  }
}

function* deletePropertyRepairItem(action) {
  try {
    yield axios.delete(`api/properties/repairItem/${action.payload.itemId}`)
    yield put({
        type: 'GET_PROPERTY_OF_INTEREST',
        payload: action.payload.propertyId
    })
  } catch (error) {
    console.log('Error deleting property repair item:', error);
  }
}

function* propertyRepairItemsSaga() {
    yield takeLatest('ADD_PROPERTY_REPAIR_ITEM', addPropertyRepairItem);
    yield takeLatest('DELETE_PROPERTY_REPAIR_ITEM', deletePropertyRepairItem);
  }
  
  export default propertyRepairItemsSaga;