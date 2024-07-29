import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { loadData, saveData } from '../adapters/indexedDB';

const createSlice = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })

const slice = createSlice({
  name: 'tour',
  initialState: { tourComplete: undefined },
  reducers: (create) => ({
    getTourComplete: create.asyncThunk(async () => {
      return await loadData("tourComplete");
    },
    {
      fulfilled: (state, action) => {
        state.tourComplete = action.payload;
      }
    }),
    setTourComplete: create.asyncThunk(async () => {
      return await saveData("tourComplete",true);
    },
    {
      fulfilled: (state, action) => {
        state.tourComplete = action.payload;
      }
    }),
  }),
})

export const {
  getTourComplete,
  setTourComplete
} = slice.actions;

export default slice;
