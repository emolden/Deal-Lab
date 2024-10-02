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
  console.log('Payload data:', action.payload);
  const address = action.payload.address;
  const userId = action.payload.userId
  try {
    yield axios.post(`api/properties`, {address})
    yield put({
        type: 'GET_PROPERTIES',
        payload: userId
    })
  } catch (error) {
    console.log('Error in getting property details:', error);
  }
}

function* deleteProperty(action) {
  // console.log('deleteProperty saga received a dispatch: ', action.payload)
  const propertyId = action.payload.propertyId;
  const userId = action.payload.userId;
  try {
    const response = yield axios.delete(`/api/properties/${propertyId}`)
    // console.log('response from server is delete property route: ', response.data)
    yield put({
      type: 'GET_PROPERTIES',
      payload: userId
    })
  } catch (error) {
    console.log('Error in getting properties:', error);
    
  }
}

function* updateProperty(action) {
}

function* backToDefault(action) {
}

//getPropertyOfInterest sends an axios request to the properties.router.js and
//sends the response data to the PropertyOfInterest reducer.
function* getPropertyOfInterest(action) {
  // console.log('in getPropertyOfInterest saga and the playload is: ', action.payload);

  try {
    //to properties.router.js with the property id as a paramater
    const response = yield axios.get(`/api/properties/propertyOfInterest/${action.payload}`);
    // console.log('response from /api/properties/propertyOfInterest/id route: ', response.data);
    yield put({ type: 'SET_PROPERTY_OF_INTEREST', payload: response.data });
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