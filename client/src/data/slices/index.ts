import { combineSlices } from '@reduxjs/toolkit';
import onboardingSlice from './onboarding';
import tourSlice from './tour';

export const dataSlices = combineSlices(
  onboardingSlice,
  tourSlice
);
