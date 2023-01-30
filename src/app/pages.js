import { createSlice } from '@reduxjs/toolkit';

export const pagesSlice = createSlice({
    name: 'pages',
    initialState: {
      page: 'drop',
      status: 0
    },
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      setPage: (state, action) => {
        const page = action.payload;
        state.page = page;
        state.status += 1;
      }
    }
  });

export const {setPage} = pagesSlice.actions;
export const selectPages = (state) => state.pages.page;
export default pagesSlice.reducer;