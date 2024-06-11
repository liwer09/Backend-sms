import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SnackbarProvider } from 'notistack'

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './auth/authConfig';


const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </MsalProvider>
  </React.StrictMode>
);
