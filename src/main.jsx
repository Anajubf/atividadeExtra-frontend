import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // Deixamos sem o .jsx para o Vite resolver direto

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
