import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import "./styles/Index.css";
import "./styles/theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
document.getElementById("root").className = "bg-1";
root.render(
  <App />
);

