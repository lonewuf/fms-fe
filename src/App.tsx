import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/commons/PrivateRoute';
import setAuthToken from './utils/setAuthToken';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { Auth, AuthActionTypes } from './store/auth/types';
import TransactionListView from './components/transaction/ListView';
import { useTypedSelector, store } from './store';
import CreateTransaction from './components/transaction/CreateTransaction'
import CreateUser from './components/user/CreateUser'
import TransactionView from './components/transaction/TransactionView';
import './App.css'
import UserListView from './components/user/ListView';

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken)  
  const decoded: Auth = jwtDecode(localStorage.jwtToken)
  store.dispatch({
    type: AuthActionTypes.GOT_AUTH_DATA,
    auth: decoded,
    isAuthenticated: true
  })
}

function App() {
  const authState = useTypedSelector(state => state.auth)

  return (
    <Router>
      <Routes>
            <Route path='/' element={<Layout />}>
              {/* <Route index element={<Link to="/login">Click here to login</Link>} /> */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path='dashboard' element= {
                <PrivateRoute auth={authState}>
                  <TransactionListView />
                </PrivateRoute>
              } />
              <Route path='transaction/:_operation/:_id' element= {
                  <PrivateRoute auth={authState}>
                    <CreateTransaction />
                  </PrivateRoute>
              } />
              <Route path='transaction/:_id' element= {
                  <PrivateRoute auth={authState}>
                    <TransactionView />
                  </PrivateRoute>
              } />
             <Route path='user' element= {
                  <PrivateRoute auth={authState}>
                    <UserListView />
                  </PrivateRoute>
              } />
            <Route path='user/:_operation/:_id' element= {
                <PrivateRoute auth={authState}>
                  <CreateUser />
                </PrivateRoute>
            } />



            </Route>
     </Routes>
    </Router>
  );
}

export default App;
