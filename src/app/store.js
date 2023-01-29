import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import filesReducer from '../features/pdf/filesSlice';
import savesReducer from '../features/pdf/savesSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    files: filesReducer,
    saves: savesReducer,
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
