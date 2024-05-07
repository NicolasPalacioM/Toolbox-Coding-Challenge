import {
  FETCH_FILE_DATA_REQUEST,
  FETCH_FILE_DATA_SUCCESS,
  FETCH_FILE_DATA_FAILURE,
} from "../actions/actions";

const initialState = {
  fileData: [],
  error: null,
  loading: false,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FILE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FILE_DATA_SUCCESS:
      return {
        ...state,
        fileData: Array.isArray(action.payload)
          ? action.payload
          : [action.payload],
        error: null,
        loading: false,
      };
    case FETCH_FILE_DATA_FAILURE:
      return {
        ...state,
        fileData: [],
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

export default rootReducer;
