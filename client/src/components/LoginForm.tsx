import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {store} = useContext(Context);

    return (
        <div>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder='email'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='password'
            />
            <button onClick={() => store.login(email, password)}>
                login
            </button>
            <button onClick={() => store.registration(email, password)}>
                registration
            </button>
        </div>
    );
};

export default observer(LoginForm);
