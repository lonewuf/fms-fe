import { Button, Card,  Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosRequest, { Method } from '../../api/request';
import { useTypedSelector } from '../../store';


type ModalContent = {
	title: string
	message: string
}


const modalDefaultValues = {
	title: 'Success',
	message: 'You successfully created user.'
}

const Register: React.FC = () => {
	const dispatch = useDispatch()	
	const navigate = useNavigate()
	const authState = useTypedSelector(state => state.auth)
	const [modalContent, setModalContent] = useState<ModalContent>(modalDefaultValues)
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if(authState.isAuthenticated) {
			navigate('/dashboard')
		}
	})


	const onFinish = async (values: any) => {
		try {
			const response = await axiosRequest(Method.post, '/user/register', { ...values })

			if (response.response?.data?.error) {
				throw new Error(response.response?.data?.message)
			}
		} catch (error: any) {
			setModalContent({
				title: 'Error',
				message: error.message
			})
		}
		setIsModalOpen(true)
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};


	const handleOk = (title: string) => {
		setIsModalOpen(false)
		if (title === 'Success') {
			navigate('/login')
		}
		setModalContent(modalDefaultValues)
	}

	return (
		<>
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

						<Form.Item
							name="confirm"
							label="Confirm Password"
							dependencies={['password']}
							hasFeedback
							rules={[
							{
								required: true,
								message: 'Please confirm your password!',
							},
							({ getFieldValue }) => ({
								validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('The two passwords that you entered do not match!'));
								},
							}),
							]}
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
			<Modal title={modalContent.title} visible={isModalOpen} onOk={() => handleOk(modalContent.title)}>
				<p>{modalContent.message}</p>
			</Modal>
		</>
	);
};

export default Register;
