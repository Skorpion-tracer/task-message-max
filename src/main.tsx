import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from "react-router";
import Authorization from "./pages/Authorization/Authorization.tsx";
import Layout from "./Layout/Layout.js";
import Spinner from "./components/Spinner/Spinner.js";
import Chat from "./pages/Chat/Chat.js";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.js";
import Error from "./pages/Error/Error.js";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        HydrateFallback: () => <Spinner/>,
        children: [
            {
                path: '/',
                element: <Authorization/>
            },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: '/chat', element: <Chat /> }
                ]
            },
            {
                path: '*',
                element: <Error/>
            }
        ],
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
);
