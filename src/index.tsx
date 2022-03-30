import React from 'react';
import './index.css';
import App from './components/app/App';
import {createRoot} from "react-dom/client";

createRoot(document.querySelector('#root')!).render(<App />);