import { createSlice } from '@reduxjs/toolkit';

export const savesSlice = createSlice({
    name: 'saves',
    initialState: [],
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      addSave: (state, action) => {
        const file = action.payload;
        state.push(file);
      },
      removeSave: (state, action) => {
        const fileName = action.payload;
        const index = state.findIndex(obj => obj.fileName === fileName);
        const newState = [
            ...state.slice(0, index),
            ...state.slice(index + 1)
        ]
        state = newState;
      }
    }
  });

export const selectSaves = (state) => state.saves;
export const {addSave, removeSave} = savesSlice.actions;
export default savesSlice.reducer;