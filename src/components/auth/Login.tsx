import { Button, Card, Checkbox, Col, Form, Input, Row, Space } from 'antd';
import jwtDecode from 'jwt-decode';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosRequest, { Method } from '../../api/request';
import { AuthActionTypes } from '../../store/auth/types';
import setAuthToken from '../../utils/setAuthToken';

const Login: React.FC = () => {
	const dispatch = useDispatch()	
	const navigate = useNavigate()

	const onFinish = async (values: any) => {
		const response = await axiosRequest(Method.post, '/user/login', { ...values })
		if (response.response?.data?.error) {
			console.log(response.response.data.error)
			console.log(response.response.data.message)
			console.log('error')
		} else {
			const { token } = response.data
			localStorage.setItem('jwtToken', token)
			setAuthToken(token)
			const decoded = jwtDecode(token)
			dispatch({
				type: AuthActionTypes.GOT_AUTH_DATA,
				auth: decoded,
				isAuthenticated: true
			})
			navigate('/dashboard')
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Row>
			<Col span={6} offset={9}>
				<Card title="Login">
				<Form
					name="basic"
					// labelCol={{ span: 8 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
				<Form.Item
					label="Username"
					name="email"
					rules={[{ required: true, message: 'Please input your username!' }]}
					
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
					Submit
					</Button>
				</Form.Item>
				</Form>
				</Card>
			</Col>
		</Row>
	);
};

export default Login;