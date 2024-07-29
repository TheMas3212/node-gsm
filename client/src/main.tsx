import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import { Provider as DataProvider, useDispatch } from 'react-redux';
import store from './data/store';
import { ThemeProvider } from '@mui/material/styles';
import Themes from './assets/Themes';
import App from './App.tsx';
import { getOnboardComplete } from './data/slices/onboarding';
import { getTourComplete } from './data/slices/tour';
import Onboarding from './pages/Onboarding';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
    loader: async () => {
      await store.dispatch(getOnboardComplete());
      const { onboarding } = store.getState();
      if (!onboarding.onboardComplete) return redirect("/onboarding");
      return true;
    },
    children: [
      {
        path: "tour",
        element: (
          <div> Tour </div>
        ),
        loader: async () => {
          await store.dispatch(getTourComplete());
          const { tour } = store.getState();
          if (tour.tourComplete) return redirect('/');
          return true;
        }
      }
    ]
  },
  {
    path: "onboarding",
    loader: async () => {
      await store.dispatch(getOnboardComplete());
      const { onboarding } = store.getState();
      console.log(onboarding);
      if (onboarding.onboardComplete) return redirect('/');
      return !!onboarding.onboardComplete;
    },
    element: (
      <Onboarding />
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider store={store}>
      <ThemeProvider theme={Themes.Dark}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </DataProvider>
  </React.StrictMode>
);
