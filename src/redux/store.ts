import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Reducer } from 'redux';
import { loggerMiddleware } from './middleware/loggerMiddleware';

import counter from './slices/counter';

const reducers = {
  counter
  // Add the generated reducer as a specific top-level slice
  // [authApi.reducerPath]: authApi.reducer,
};

const combinedReducer = combineReducers<typeof reducers>(reducers);

export type RootState = ReturnType<typeof combinedReducer>;

export const rootReducer: Reducer<RootState> = (state, action) => {
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      loggerMiddleware
    ]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
