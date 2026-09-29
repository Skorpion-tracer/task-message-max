import {type FC, useEffect, useState} from "react";
import axios from "axios";
import Spinner from "../Spinner/Spinner.js";
import {Navigate, Outlet} from "react-router";

const ProtectedRoute: FC = () => {
    const [ state, setState ] = useState<'loading' | 'ok' | 'no'>('loading');

    useEffect(() => {
        axios.get('/api/me', { withCredentials: true })
            .then(r => setState(r.data.authorized ? 'ok' : 'no'))
            .catch(() => setState('no'));
    }, []);

    if (state === 'loading') return <Spinner/>;
    if (state === 'no') return <Navigate to="/" replace/>;
    return <Outlet/>;
};

export default ProtectedRoute;