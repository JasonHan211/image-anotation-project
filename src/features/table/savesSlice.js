import { createSlice } from '@reduxjs/toolkit';

export const savesSlice = createSlice({
    name: 'saves',
    initialState: {
      array: [],
      id: 0,
    },
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      addSave: (state, action) => {
        const file = action.payload;
        state.array.push(file);
        state.id += 1;
      },editSave: (state, action) => {
        const job = action.payload;
        const index = state.array.findIndex(obj => obj.id === job.id);
        state.array[index] = job;
      },
      removeSave: (state, action) => {
        const id = action.payload;
        const index = state.array.findIndex(obj => obj.id === id);
        const newState = [
            ...state.array.slice(0, index),
            ...state.array.slice(index + 1)
        ]
        state.array = newState;
      }
    }
  });

export const selectSaves = (state) => state.saves.array;
export const selectSaveID = (state) => state.saves.id;
export const {addSave, editSave, removeSave} = savesSlice.actions;
export default savesSlice.reducer;