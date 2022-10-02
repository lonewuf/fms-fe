import { Layout, Menu, MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../../store';
import { AuthActionTypes } from '../../store/auth/types';
import setAuthToken from '../../utils/setAuthToken';
import { FileOutlined, LogoutOutlined, ProfileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { UserType } from '../transaction/TransactionView';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	onClick?: () => void,
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		onClick
	} as MenuItem;
}



const SharedLayout = () => {
	const authState = useTypedSelector(state => state.auth)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [collapsed, setCollapsed] = useState(false);


	const handleLogout = () => {
		localStorage.removeItem('jwtToken')
		dispatch({
			type: AuthActionTypes.CLEAR_AUTH_DATA
		})
		setAuthToken('')
		navigate('/login')
	}

	const adminItems: MenuItem[] = [
		getItem('My Profile', '3', <ProfileOutlined />, undefined, () => navigate(`/user/view/${authState.auth?.id}`)),
		getItem('Users', '2', <UserOutlined />, undefined, () => navigate('/user')),
		getItem('Transactions', '1', <FileOutlined />, undefined, () => navigate('/dashboard')),
		getItem('Logout', '4', <LogoutOutlined />, undefined, handleLogout),
	];

	const items: MenuItem[] = [
		getItem('My Profile', '3', <ProfileOutlined />, undefined, () => navigate(`/user/view/${authState.auth?.id}`)),
		getItem('Transactions', '1', <FileOutlined />, undefined, () => navigate('/dashboard')),
		getItem('Logout', '4', <LogoutOutlined />, undefined, handleLogout),
	]

	useEffect(() => {
		if (!authState.isAuthenticated) {
			navigate({ pathname: '/login' })
		} else {
			navigate({ pathname: '/dashboard'})
		}
	}, [authState])

	
	const authLinks = [
		<Menu.Item key={'logout'} onClick={handleLogout}>
			Logout
		</Menu.Item>
	]

	const guestLinks = [
		<Menu.Item key={'login'}>
			<Link to={'/login'}> Login</Link>
		</Menu.Item>,
		<Menu.Item key={'register'}>
			<Link to={'/register'}>Register</Link>
		</Menu.Item>
	]

	const links = authState.isAuthenticated ? authLinks : guestLinks

	const guestHeader = (
		<Header style={{ marginBottom: '50px'}}>
			<Menu
				theme="dark"
				mode="horizontal"
				style={{ marginLeft: 'auto' }}
			>
				{links.map((item) => item)}	
			</Menu>
		</Header>
	)

	const authHeader = (
        // <Header className="site-layout-background" style={{ padding: 0, marginBottom: '20px' }} />
        <Header className="site-layout-background" style={{ padding: 0 }} />
	)

	const authSider = (
		<Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}
			// style={{
			// 	overflow: 'auto',
			// 	height: '100vh',
			// 	position: 'fixed',
			// 	left: 0,
			// 	top: 0,
			// 	bottom: 0
			// }}
		>
			<div className="logo" />
		</Sider>
	)

	const header = authState.isAuthenticated ? null : guestHeader
	const sider = authState.isAuthenticated ? authSider : null

	const headerInLayout = authState.isAuthenticated  ? authHeader : null

	return   <Layout hasSider={ sider !== null}>
		{	
			authState.isAuthenticated ? 
				<Sider 
					style={{
						overflow: 'auto',
						height: '100vh',
						position: 'fixed',
						left: 0,
						top: 0,
						bottom: 0,
					}}
				>
					<div className="logo" />
					{
						authState.auth?.userType === UserType.ADMIN ?
							<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={adminItems} />
						:
							<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
					}
				</Sider>
			:
				guestHeader
		}
		<Layout className="site-layout" style={{ marginLeft: sider !== null ? 200 : 0, minHeight: '100vh' }}>
			<Header className={ sider !== null ? "site-layout-background" : 'login-bg' } style={{ padding: 0 }} />
			<Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
				<div className={ sider !== null ? "site-layout-background" : 'login-bg' } style={{ padding: 24 }}>
					<Outlet />
				</div>
			</Content>
		<Footer style={{ textAlign: 'center' }}>Form Management System ©{ new Date().getFullYear()}</Footer>
		</Layout>
  </Layout>
};

export default SharedLayout

