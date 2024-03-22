import {configureStore} from '@reduxjs/toolkit';
import starredSlice from './starredSlice';
import watchLaterSlice from './watchLaterSlice';

const store = configureStore({
  reducer: {
    starred: starredSlice.reducer,
    watchLater: watchLaterSlice.reducer,
  },
});

export default store;
