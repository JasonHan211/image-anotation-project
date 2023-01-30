import { createSlice } from '@reduxjs/toolkit';

export const filesSlice = createSlice({
    name: 'files',
    initialState: {
      files: [],
      count: 0
    },
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      addFile: (state, action) => {
        const file = action.payload;
        state.files.push(file);
        state.count += 1;
      },
      removeFile: (state) => {
        state.files = [];
        state.count -= 1;
      }
    }
  });

export const {addFile, removeFile} = filesSlice.actions;
export const selectFiles = (state) => state.files.files;
export default filesSlice.reducer;