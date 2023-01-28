import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import filesReducer from '../features/pdf/filesSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    files: filesReducer,
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
