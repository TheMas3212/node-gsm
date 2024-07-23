import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Themes from './assets/Themes';
import App from './App.tsx';
import Onboarding from './pages/Onboarding';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
    loader: async () => {
      if (!parseInt(localStorage.getItem("onboardComplete"))) return redirect("/onboarding");
      return true;
    },
    children: []
  },
  {
    path: "onboarding",
    element: (
      <Onboarding />
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={Themes.Dark}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
