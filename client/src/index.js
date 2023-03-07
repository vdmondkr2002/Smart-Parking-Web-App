import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './state/index'
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import * as ServiceWorkerRegistration from './serviceWorkerRegistration'
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {asyncSubsribeUser} from './Utils/subscription'
import './index.css'

import App from './App';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

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

ServiceWorkerRegistration.register()

asyncSubsribeUser()