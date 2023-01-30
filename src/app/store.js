import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import filesReducer from '../features/pdf/filesSlice';
import savesReducer from '../features/table/savesSlice';
import pagesReducer from './pages';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    files: filesReducer,
    saves: savesReducer,
    pages: pagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['files/addFile'],
        // Ignore states check
        ignoreState: true,
      },
    }),
});
