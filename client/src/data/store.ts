import { configureStore } from '@reduxjs/toolkit'
import { dataSlices } from './slices'

export const store = configureStore({
  reducer: dataSlices,
})

export default store;
