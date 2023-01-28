import {createSlice } from '@reduxjs/toolkit';

export const filesSlice = createSlice({
    name: 'files',
    initialState: [],
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      addFile: (state, action) => {
        const file = action.payload;
        state.push(file);
      },
      removeFile: (state, action) => {
        const fileName = action.payload;
        const index = state.findIndex(obj => obj.name === fileName);
        const newState = [
            ...state.slice(0, index),
            ...state.slice(index + 1)
        ]
        state = newState;
      }
    }
  });

export const selectFiles = (state) => state.files;
export const {addFile, removeFile} = filesSlice.actions;
export default filesSlice.reducer;