import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './styles/index.css';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { QueryProvider } from './context/QueryProvider';

import ToastProviderComponent from './components/ToastProvider.jsx';
import ConnectionStatus from './components/ConnectionStatus.jsx';
import SessionTimeoutWarning from './components/SessionTimeoutWarning.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <App />
              <SessionTimeoutWarning />
            </ErrorBoundary>

            <ToastProviderComponent />
            <ConnectionStatus />
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);