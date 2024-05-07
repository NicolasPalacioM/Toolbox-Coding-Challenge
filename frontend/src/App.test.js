// App.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import App from "./App";
import {
  fetchFileData,
  FETCH_FILE_DATA_REQUEST,
  FETCH_FILE_DATA_SUCCESS,
  FETCH_FILE_DATA_FAILURE,
} from "./actions/actions";
import rootReducer from "./reducers/reducers";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("App component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      fileData: [],
      error: null,
    });
  });

  test("renders without crashing", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  test("renders the form and table", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByPlaceholderText("Enter file name")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(screen.getByText("File Name")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Number")).toBeInTheDocument();
    expect(screen.getByText("Hex")).toBeInTheDocument();
  });

  test("updates fileName state when input changes", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const input = screen.getByPlaceholderText("Enter file name");
    fireEvent.change(input, { target: { value: "test.txt" } });
    expect(input.value).toBe("test.txt");
  });

  test("dispatches fetchFileData action on form submit", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const input = screen.getByPlaceholderText("Enter file name");
    const submitButton = screen.getByText("Filter");

    fireEvent.change(input, { target: { value: "test2.csv" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([
        { type: FETCH_FILE_DATA_REQUEST },
        { type: FETCH_FILE_DATA_REQUEST },
        {
          type: FETCH_FILE_DATA_SUCCESS,
          payload: {
            file: "test2.csv",
            lines: expect.any(Array),
          },
        },
      ]);
    });
  });

  test("renders error message when there is an error", () => {
    store = mockStore({
      fileData: [],
      error: "File not found",
    });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText("File not found")).toBeInTheDocument();
  });

  test("renders table rows when fileData is available", () => {
    const fileData = [
      {
        file: "test.txt",
        lines: [
          { text: "Line 1", number: 1, hex: "AF01" },
          { text: "Line 2", number: 2, hex: "BF02" },
        ],
      },
    ];
    store = mockStore({
      fileData,
      error: null,
    });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getAllByRole("row")).toHaveLength(3); // 2 data rows + 1 header row
  });
});

describe("fetchFileData action", () => {
  test("dispatches FETCH_FILE_DATA_SUCCESS on successful API call", async () => {
    const mockFileData = [
      {
        file: "test.txt",
        lines: [{ text: "Line 1", number: 1, hex: "AF01" }],
      },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockFileData),
    });
    const store = mockStore({});
    await store.dispatch(fetchFileData());
    expect(store.getActions()).toContainEqual({
      type: FETCH_FILE_DATA_SUCCESS,
      payload: mockFileData,
    });
  });

  test("dispatches FETCH_FILE_DATA_FAILURE on 404 response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 404,
    });
    const store = mockStore({});
    await store.dispatch(fetchFileData());
    expect(store.getActions()).toContainEqual({
      type: FETCH_FILE_DATA_FAILURE,
      payload: "File not found",
    });
  });

  test("dispatches FETCH_FILE_DATA_FAILURE on error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
    const store = mockStore({});
    await store.dispatch(fetchFileData());
    expect(store.getActions()).toContainEqual({
      type: FETCH_FILE_DATA_FAILURE,
      payload: "An error occurred",
    });
  });
});

describe("rootReducer", () => {
  test("returns initial state", () => {
    expect(rootReducer(undefined, {})).toEqual({
      fileData: [],
      error: null,
      loading: false,
    });
  });

  test("handles FETCH_FILE_DATA_SUCCESS", () => {
    const fileData = [
      {
        file: "test.txt",
        lines: [{ text: "Line 1", number: 1, hex: "AF01" }],
      },
    ];
    expect(
      rootReducer(undefined, {
        type: FETCH_FILE_DATA_SUCCESS,
        payload: fileData,
      })
    ).toEqual({
      fileData,
      error: null,
      loading: false,
    });
  });

  test("handles FETCH_FILE_DATA_FAILURE", () => {
    expect(
      rootReducer(undefined, {
        type: FETCH_FILE_DATA_FAILURE,
        payload: "File not found",
      })
    ).toEqual({
      fileData: [],
      error: "File not found",
      loading: false,
    });
  });
});
