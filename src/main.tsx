import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import { appWindow } from '@tauri-apps/api/window';

import './styles.css';
import App from '@/App';
import List from '@/routes/List.tsx';

// make the application open always on top of the other windows.
await appWindow.setAlwaysOnTop(true);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                path: '/',
                element: <List />
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);
