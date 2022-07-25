import { Button, Card, Checkbox, Col, Form, Input, Row } from 'antd';
import jwtDecode from 'jwt-decode';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosRequest, { Method } from '../../api/request';
import { useTypedSelector } from '../../store';
import { AuthActionTypes } from '../../store/auth/types';
import setAuthToken from '../../utils/setAuthToken';

const Register: React.FC = () => {
	const dispatch = useDispatch()	
	const navigate = useNavigate()
	const authState = useTypedSelector(state => state.auth)

	useEffect(() => {
		if(authState.isAuthenticated) {
			navigate('/dashboard')
		}
	})


	const onFinish = async (values: any) => {
		const response = await axiosRequest(Method.post, '/user/register', { ...values })
		if (response.response?.data?.error) {
			console.log(response.response.data.error)
			console.log(response.response.data.message)
			console.log('error')
		} else {
			navigate('/login')
		}

	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};


	return (
			<Row>
				<Col span={8} offset={8}>
					<Card title="Register" >
						<Form
							name="register"
							labelCol={{ span: 8 }}
							initialValues={{ remember: true }}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
						>
						<Form.Item
							label="Email"
							name="email"
							rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="First name"
							name="firstName"
							rules={[{ required: true, message: 'First name is required' }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="Last name"
							name="lastName"
							rules={[{ required: true, message: 'Last name is required' }]}
						>
							<Input />
						</Form.Item>
						
						<Form.Item
							label="Student Number"
							name="studentNumber"
							rules={[{ required: true, message: 'Student number is required' }]}
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

export default Register;