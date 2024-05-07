// actions.js
import { API_URL } from "../utils/config";

export const FETCH_FILE_DATA_REQUEST = "FETCH_FILE_DATA_REQUEST";
export const FETCH_FILE_DATA_SUCCESS = "FETCH_FILE_DATA_SUCCESS";
export const FETCH_FILE_DATA_FAILURE = "FETCH_FILE_DATA_FAILURE";

export const fetchFileData = (fileName) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_FILE_DATA_REQUEST });

    try {
      const url = fileName
        ? `${API_URL}/files/data?fileName=${fileName}`
        : `${API_URL}/files/data`;
      const response = await fetch(url);

      if (response.status === 404) {
        dispatch({
          type: FETCH_FILE_DATA_FAILURE,
          payload: "File not found",
        });
      } else {
        const fileData = await response.json();
        dispatch({
          type: FETCH_FILE_DATA_SUCCESS,
          payload: fileData,
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: FETCH_FILE_DATA_FAILURE,
        payload: "An error occurred",
      });
    }
  };
};
