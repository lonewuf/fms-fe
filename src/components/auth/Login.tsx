import { Button, Card, Col, Form, Input, Row } from 'antd';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosRequest, { Method } from '../../api/request';
import { useTypedSelector } from '../../store';
import { AuthActionTypes } from '../../store/auth/types';
import setAuthToken from '../../utils/setAuthToken';
import CommonModal from '../commons/Modals';

export type ModalType = {
	isOpen: boolean
	message: string
	title: string
}

const Login: React.FC = () => {
	const [modalDetails, setModalDetails] = useState<ModalType>({ isOpen: false, message: '', title: ''})
	const dispatch = useDispatch()	
	const navigate = useNavigate()
	const authState = useTypedSelector(state => state.auth)

	useEffect(() => {
		if(authState.isAuthenticated) {
			navigate('/dashboard')
		}
	}, [authState.isAuthenticated])

	const modalCleanUp = (data: ModalType) => {
		setModalDetails({ ...modalDetails, ...data })
	}

	const onFinish = async (values: any) => {
		const response = await axiosRequest(Method.post, '/user/login', { ...values })
		if (response.response?.data?.error) {
			setModalDetails({ isOpen: true, title: 'Error', message: response.response.data.message})
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
			setModalDetails({ isOpen: false, title: '', message: '' })
			navigate('/dashboard')
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<>
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
						rules={[{ required: true, message: 'Username is required.' }]}
						
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[{ required: true, message: 'Password is required.' }]}
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
			<CommonModal isOpen={modalDetails.isOpen} message={modalDetails.message} title={modalDetails.title} modalCleanUp={modalCleanUp} />
		</>
	);
};

export default Login;