import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ActivationPage from './components/ActivationPage';
import ProfilePage from './components/ProfilePage';
import Store from './store/store';

const theme = createTheme();

interface State {
  store: Store;
}

export const store = new Store();

export const Context = createContext<State>({
  store,
});

ReactDOM.render(
  <React.StrictMode>
    <Context.Provider value={{ store }}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/activation" element={<ActivationPage />} />
            <Route path="/profile" element={<ProfilePage user={store.user} onLogout={store.logout} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

