import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './state/index'

import App from './App';

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

const root = createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>

);