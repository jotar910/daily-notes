import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider,} from 'react-router-dom';

import {appWindow} from '@tauri-apps/api/window';

import './styles.css';
import App from '@/App';
import List from '@/routes/List.tsx';
import View from '@/routes/View.tsx';
import Edit from '@/routes/Edit.tsx';
import Create from '@/routes/Create.tsx';
import {Toaster} from '@/components/ui/toaster.tsx';
import {NotesServiceContext, NotesServiceInstance} from "@/libs/services/notes.tsx";
import {NotesStoreProvider} from "@/libs/stores/notes.tsx";

// make the application open always on top of the other windows.
await appWindow.setAlwaysOnTop(true);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                path: '/',
                element: <List/>
            },
            {
                path: '/create',
                element: <Create/>
            },
            {
                path: '/:id/edit',
                element: <Edit/>
            },
            {
                path: '/:id',
                element: <View/>
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NotesServiceContext.Provider value={NotesServiceInstance}>
            <NotesStoreProvider>
                <RouterProvider router={router}/>
                <Toaster/>
            </NotesStoreProvider>
        </NotesServiceContext.Provider>
    </React.StrictMode>
);
