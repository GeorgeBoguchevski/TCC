import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './main/App'; // Use o caminho relativo correto
import registerServiceWorker from './registerServiceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

registerServiceWorker();