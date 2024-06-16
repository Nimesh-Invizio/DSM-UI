import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import { ServerProvider } from './context/ServerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <ServerProvider>
    <ShopProvider>
      <App />
    </ShopProvider>
  </ServerProvider>
  </BrowserRouter>
);
