import { ArrowLeftOutlined, CheckOutlined, EditOutlined, InboxOutlined, StopOutlined } from '@ant-design/icons';
import {
	Button,
	Form,
	Input,
	Modal,
	Select,
	Tag,
	Typography,
	Upload,
  } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypedSelector } from '../../store';
import { UserType } from '../../store/auth/types';

const { Option } = Select;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 16 },
		sm: { span: 8 },
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
		span: 24,
		offset: 0,
		},
		sm: {
		span: 16,
		offset: 8,
		},
	},
};

export const tagColors = {
	"active": 'green',
	"inactive": 'red'
}

const modalDefaultValues = {
	title: 'Success',
	message: 'You successfully created user.'
}

type ModalContent = {
	title: string
	message: string
}

const CreateTransaction: React.FC = () => {
	const params = useParams()
	const navigate = useNavigate()
	const authState = useTypedSelector(state => state.auth)
	const [form] = Form.useForm();
	const [formView] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<ModalContent>(modalDefaultValues)
	const [operation, setOperation] = useState('');
	const [formValues, setFormValues] = useState<null | any>(null)
	const [file, setFile] = useState<any>({})

	const renderTag = (status: string) => {
		const color = tagColors[status]

		return	<Tag color={ color } >{ status }</Tag>
	}

	const checkParams = () => {
		const { _operation } = params
		const operateParams = [ 'create', 'update', 'view', '' ]
		if (!operateParams.includes(_operation as string)) {
			navigate({ pathname: '/user' })
		}
		return
	}

	useEffect(() => {
		const operation = params._operation
		setOperation(operation as string)
		checkParams()
		if (operation === 'view' || operation === 'update') {
			fetchUserData()
		}

	}, [])

	const getToken = () => localStorage.getItem('jwtToken')?.split(' ')[1] as string

	const fetchUserData = async () => {
		const { _id } = params
		const jwtToken = getToken()
		const response = await axios({ method: 'get', url: `/user/${_id}`, headers: { 'Authorization': `Bearer ${jwtToken}` }})
		if (response.data.error) {
			navigate({ pathname: '/dashboard' })
		}
		setFormValues({...response.data.data})

		form.setFieldsValue({
			...response.data.data,
		})
	}

	const onFinish = async (values: any) => {
		checkParams()
		const operation = params._operation
		const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string

		try {
			switch(operation) {
				case 'create':
					const response = await axios({ method: 'post', url: '/user/registerFromAdmin', headers: { 'Authorization': `Bearer ${jwtToken}` }, data: {  ...values, dragger: null }})
					
					if (response.data.error) {
						throw new Error(response.data.error.description)
					}
					break;
				case 'update':
					const { _id: docId } = params
					const updateResponse = await axios({ method: 'patch', url: `/user/${docId}`, headers: { 'Authorization': `Bearer ${jwtToken}` }, data: {  ...values, dragger: null }})
					
					if (updateResponse.data.error) {
						throw new Error(updateResponse.data.error.description)
					}

					break;
				default:
					navigate('/dashboard')
					break;
			}
		} catch (error: any) {
			setModalContent({
				title: 'Error',
				message: error.message
			})
		}
		setModalContent({
			...modalContent,
			message: params._operation === 'create' ? modalContent.message : 'You successfully updated user.'
		})
		setIsModalOpen(true)
	};

	const handleOk = (title: string) => {
		setIsModalOpen(false)
		if (title === 'Success') {
			navigate('/dashboard')
		}
		setModalContent(modalDefaultValues)
	}

	const handleApprove = async (_id: string) => {
		try {
			const jwtToken = getToken()

			const response = await axios({ method: 'patch', url: `/transaction/approve/${_id}`, headers: { 'Authorization': `Bearer ${jwtToken}` }})
			
			if (response.data.error) {
				throw new Error(response.data.error.description)
			}

			setModalContent({
				title: 'Success',
				message: 'Form successfully approved.'
			})
			setIsModalOpen(true)
		} catch (error: any) {
			setModalContent({
				title: 'Error',
				message: error.message
			})
			setIsModalOpen(true)
		}
	}
	
	const renderApproveButton = (_id: string) => {
		const userType = authState.auth?.userType

		const condition = userType && userType === UserType.ADMIN && formValues.status.status !== 'Done'

		return condition ? 
			<Button style={{marginLeft: '10px'}} onClick={() => handleApprove(_id)} icon={<CheckOutlined />}>
				Approve
			</Button>
			:
			null
	}

	return (
		<>
			<Button style={{marginRight: '10px'}} onClick={() => navigate({ pathname: '/user'})} icon={<ArrowLeftOutlined />}>
				Back
			</Button>
			{
				formValues && params._operation === 'view' && (authState.auth?.id === formValues._id || authState.auth?.userType === UserType.ADMIN) ?
					<Button style={{marginBottom: '20px'}} onClick={() => navigate({ pathname: `/user/update/${params._id}` })} icon={<EditOutlined />}>
						Update
					</Button>
				:
					null
			}
			{
				params._operation === 'update' ?
					<Button style={{marginBottom: '20px'}} onClick={() => navigate({ pathname: `/user/view/${params._id}` })} icon={<StopOutlined />}>
						Cancel
					</Button>
				:
					null
			}
			{
				formValues && <Typography.Title style={{ marginTop: '20px' }} level={5}>Status: {renderTag(formValues.status)} </Typography.Title>
			}
			<Form
				{...formItemLayout}
				form={form}
				name="register"
				onFinish={onFinish}
				scrollToFirstError
				initialValues={{}}
				disabled={params._operation === 'view'}
				style={{ marginTop: '40px' }}
			>

				<Form.Item
					name="userType"
					label="User Type"
					rules={[{ required: true, message: 'Please choose User Type' }]}
				>
					{/* <Select placeholder="Select User Type" disabled={params._operation !== 'view' && authState.auth?.userType !== UserType.STUDENT }> */}
					<Select placeholder="Select User Type" disabled={params._operation !== 'view' && authState.auth?.userType !== UserType.ADMIN }>
						<Option value="ADMIN">ADMIN</Option>
						<Option value="CHAIRPERSON">CHAIRPERSON</Option>
						<Option value="DEAN">DEAN</Option>
						<Option value="VPAA">VPAA</Option>
						<Option value="STUDENT">STUDENT</Option>
					</Select>
				</Form.Item>

				<Form.Item
					noStyle
					shouldUpdate={(prevValues, currentValues) => prevValues.transactionType === currentValues.transactionType}
				>
					{({ getFieldValue }) =>
						getFieldValue('userType') === 'STUDENT' ?
							(
								<Form.Item
									name="studentNumber"
									label="Student Number"
									rules={[
										{
											required: true,
											message: 'Please input student number',
										},
									]}
								>
									<Input />
								</Form.Item>
							)
						:
							null
					}
				</Form.Item>

				<Form.Item
					name="firstName"
					label="First Name"
					rules={[
						{
						required: true,
						message: 'Please input first name',
						},
					]}
				>
				<Input />
				</Form.Item>

				<Form.Item
					name="lastName"
					label="Last Name"
					rules={[
						{
							required: true,
							message: 'Please input last name',
						},
					]}
				>
				<Input />
				</Form.Item>

				<Form.Item
				name="email"
				label="Email"
				rules={[
					{
					required: true,
					message: 'Please input email',
					},
				]}
				>
				<Input />
				</Form.Item>

				{
					params._operation === 'create' ?
						<>
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
						</>
					:
						null
				}

				{
					params._operation !== 'view' ?
						<Form.Item {...tailFormItemLayout}>
							<Button type="primary" htmlType="submit">
								{params._operation === 'create' ? 'Create' : 'Update'}
							</Button>
						</Form.Item>
					:
						null
				}
			</Form>
			<Modal title={modalContent.title} visible={isModalOpen} onOk={() => handleOk(modalContent.title)} cancelButtonProps={{ style: { display: 'none' }}}>
				<p>{modalContent.message}</p>
			</Modal>
		</>
	);
};
  
export default CreateTransaction;