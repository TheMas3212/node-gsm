import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { loadData, saveData } from '../adapters/indexedDB';

const createSlice = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })

const slice = createSlice({
  name: 'onboarding',
  initialState: { onboardComplete: undefined },
  reducers: (create) => ({
    getOnboardComplete: create.asyncThunk(async () => {
      return await loadData("onboardComplete");
    },
    {
      fulfilled: (state, action) => {
        state.onboardComplete = action.payload;
      }
    }),
    setOnboardComplete: create.asyncThunk(async () => {
      return await saveData("onboardComplete",true);
    },
    {
      fulfilled: (state, action) => {
        state.onboardComplete = action.payload;
      }
    }),
  }),
})

export const {
  getOnboardComplete,
  setOnboardComplete
} = slice.actions;

export default slice;
