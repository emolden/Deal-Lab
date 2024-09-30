import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getDefaults(action) {
}

function* updateDefaultHoldingPeriod(action) {
}

function* addDefaultRepairItem(action) {
}

function* deleteDefaultRepairItem(action) {
}

function* addDefaultHoldingItem(action) {
}

function* deleteDefaultHoldingItem(action) {
}

function* defaultSettingsSaga() {
    yield takeLatest('GET_DEFAULTS', getDefaults);
    yield takeLatest('DELETE_PROPERTY_HOLDING_ITEM', updateDefaultHoldingPeriod);
    yield takeLatest('ADD_DEFAULT_REPAIR_ITEM', addDefaultRepairItem);
    yield takeLatest('DELETE_DEFAULT_REPAIR_ITEM', deleteDefaultRepairItem);
    yield takeLatest('ADD_DEFAULT_HOLDING_ITEM', addDefaultHoldingItem);
    yield takeLatest('DELETE_DEFAULT_HOLDING_ITEM', deleteDefaultHoldingItem);
  }
  
  export default defaultSettingsSaga;