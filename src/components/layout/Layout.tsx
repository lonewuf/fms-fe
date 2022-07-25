import { Layout, Menu } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../../store';
import { AuthActionTypes } from '../../store/auth/types';
import setAuthToken from '../../utils/setAuthToken';

const { Header, Content, Footer } = Layout;

const SharedLayout = () => {
	const authState = useTypedSelector(state => state.auth)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.removeItem('jwtToken')
		dispatch({
			type: AuthActionTypes.CLEAR_AUTH_DATA
		})
		setAuthToken('')
		navigate('/login')
	}
	
	const authLinks = [
		<Menu.Item key={'logout'} onClick={handleLogout}>
			Logout
		</Menu.Item>
	]

	const guestLinks = [
		<Menu.Item key={'login'}>
			<Link to={'/login'}>Login</Link>
		</Menu.Item>,
		<Menu.Item key={'register'}>
			<Link to={'/register'}>Register</Link>
		</Menu.Item>
	]

	const links = authState.isAuthenticated ? authLinks : guestLinks

	return <Layout className="layout" style={{ height: "100vh"}}>
			<Header style={{ marginBottom: '50px'}}>
				<div className="logo" />
				<Menu
					theme="dark"
					mode="horizontal"
					style={{ marginLeft: 'auto' }}
				>
					{links.map((item) => item)}	
				</Menu>
			</Header>
			{/* <Content style={{ padding: '0 50px', float: 'right', justifyContent: 'center' }}> */}
			<Content style={{ padding: '0 50px'}}>
				<Outlet/>
			</Content>
			<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
	</Layout>
};

export default SharedLayout