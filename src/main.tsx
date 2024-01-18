import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider,} from 'react-router-dom';

import './styles.css';
import App from '@/App';
import List from '@/routes/List.tsx';
import View from '@/routes/View.tsx';
import Edit from '@/routes/Edit.tsx';
import Create from '@/routes/Create.tsx';
import {Toaster} from '@/components/ui/toaster.tsx';
import {NotesServiceContext, NotesServiceInstance} from "@/libs/services/notes.tsx";
import {NotesStoreProvider} from "@/libs/stores/notes.tsx";
import Settings from "@/routes/Settings.tsx";
import CreateStandalone from "@/routes/CreateStandalone.tsx";

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
    {
        path: '/creation',
        element: <CreateStandalone/>
    },
    {
        path: '/settings',
        element: <Settings/>
    }
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
