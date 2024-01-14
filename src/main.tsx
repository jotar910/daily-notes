import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import { appWindow } from '@tauri-apps/api/window';

import './styles.css';
import App from './App';

// make the application open always on top of the other windows.
await appWindow.setAlwaysOnTop(true);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);
