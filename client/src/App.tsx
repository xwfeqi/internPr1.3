import React, { FC, useContext, useEffect } from 'react';
import LoginForm from "./components/LoginForm";
import ProfilePage from "./components/ProfilePage";
import ActivationPage from "./components/ActivationPage";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const App: FC = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, [store]);

    useEffect(() => {
        if (store.isAuth) {
            if (store.user.isActivated) {
                navigate('/profile');
            } else {
                navigate('/activation');
            }
        } else {
            navigate('/login');
        }
    }, [store.isAuth, store.user.isActivated, navigate]);

    if (store.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {store.isAuth && store.user.isActivated ? (
                <ProfilePage user={store.user} onLogout={store.logout} />
            ) : store.isAuth && !store.user.isActivated ? (
                <ActivationPage />
            ) : (
                <LoginForm />
            )}
        </div>
    );
};

export default observer(App);
