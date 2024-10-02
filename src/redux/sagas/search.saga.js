import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* searchAddress(action) {
}


function* searchAddressSaga() {
    yield takeLatest('SEARCH_ADDRESS', searchAddress);
  }
  
  export default searchAddressSaga;