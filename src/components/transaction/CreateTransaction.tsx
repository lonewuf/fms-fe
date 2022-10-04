import { ArrowLeftOutlined, CheckOutlined, DeleteOutlined, EditOutlined, InboxOutlined, StopOutlined } from '@ant-design/icons';
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
import { TransactionType } from './TransactionView';

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
	"For Chairperson's Approval": 'cyan',
	"For Dean's Approval": 'gold',
	"For VPAA's Approval": 'blue',
	"Done": 'green',
	"Rejected": 'volcano'
}

const modalDefaultValues = {
	title: 'Success',
	message: 'You successfully submitted form.'
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
			navigate({ pathname: '/dashboard' })
		}
		return
	}

	useEffect(() => {
		const operation = params._operation
		setOperation(operation as string)
		checkParams()
		if (operation === 'view' || operation === 'update') {
			fetchTrasactionData()
		}

		const unloadCallback = (event) => {
			event.preventDefault();
			event.returnValue = "";
			return "";
		  };
		
		window.addEventListener("beforeunload", unloadCallback);
		return () => window.removeEventListener("beforeunload", unloadCallback);


	}, [])

	const getToken = () => localStorage.getItem('jwtToken')?.split(' ')[1] as string

	const fetchTrasactionData = async () => {
		const { _id } = params
		const jwtToken = getToken()
		const response = await axios({ method: 'get', url: `/transaction/${_id}`, headers: { 'Authorization': `Bearer ${jwtToken}` }})
		if (response.data.error) {
			navigate({ pathname: '/dashboard' })
		}
		setFormValues({...response.data.data})
		const { url, public_id, format } = response.data.data.submittedFile
		form.setFieldsValue({
			...response.data.data,
			dragger: [
				{
					url,
					name: `${public_id}.${format}`,
					status: 'done',
					uid: public_id 
				}
			]
		})
	}

	const onFinish = async (values: any) => {
		checkParams()
		const operation = params._operation
		// setModalContent({
		// 	title: 'Error',
		// 	message: "There's a problem when submitting form"
		// })
		const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string
		const data = new FormData()
		data.append('file', values.dragger[0].originFileObj)
		try {
			switch(operation) {
				case 'create':
					const response = await axios({ method: 'post', url: '/transaction', headers: { 'Authorization': `Bearer ${jwtToken}` }, data: {  ...values, dragger: null }})
					
					if (response.data.error) {
						throw new Error(response.data.error.description)
					}

					const { _id } = response.data.data
					const responseUpload = await axios({ method: 'post', url: `/file/upload/submittedFile/${_id}`, headers: { 'Authorization': `Bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' }, data})

					if (responseUpload.data.error) {
						throw new Error(response.data.error.description)
					} 
					break;
				case 'update':
					const { _id: docId } = params
					const updateResponse = await axios({ method: 'patch', url: `/transaction/${docId}`, headers: { 'Authorization': `Bearer ${jwtToken}` }, data: {  ...values, dragger: null }})
					
					if (updateResponse.data.error) {
						throw new Error(updateResponse.data.error.description)
					}

					if (!values.dragger[0].status) {
						const { _id: uploadDocId } = updateResponse.data.data
						const updateResponseUpload = await axios({ method: 'post', url: `/file/upload/submittedFile/${uploadDocId}`, headers: { 'Authorization': `Bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' }, data})

						if (updateResponseUpload.data.error) {
							throw new Error(updateResponseUpload.data.error.description)
						} 

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
		setIsModalOpen(true)
	};

	const normFile = (e: any) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList.length === 2 ? [ e?.fileList[1] ] : e?.fileList.length ? [ e?.fileList[0] ] : [];
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

	const handleReject = async (_id: string) => {
		try {
			const jwtToken = getToken()

			const response = await axios({ method: 'patch', url: `/transaction/reject/${_id}`, headers: { 'Authorization': `Bearer ${jwtToken}` }})
			
			if (response.data.error) {
				throw new Error(response.data.error.description)
			}

			setModalContent({
				title: 'Success',
				message: 'Form successfully rejected.'
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
		const checkUserType = formValues.status.status.toLowerCase().includes(userType?.toLocaleLowerCase())

		const condition = userType && (userType === UserType.ADMIN || checkUserType) && formValues.status.status !== 'Done' && formValues.status.status !== 'Rejected'

		return condition ? 
			<Button style={{marginLeft: '10px'}} onClick={() => handleApprove(_id)} icon={<CheckOutlined />}>
				Approve
			</Button>
			:
			null
	}

	const renderRejectButton = (_id: string) => {
		const userType = authState.auth?.userType
		const checkUserType = formValues.status.status.toLowerCase().includes(userType?.toLocaleLowerCase())

		const condition = userType && (userType === UserType.ADMIN || checkUserType) && formValues.status.status !== 'Done' && formValues.status.status === "For VPAA's Approval"

		return condition ? 
			<Button style={{marginLeft: '10px'}} onClick={() => handleReject(_id)} icon={<DeleteOutlined />}>
				Reject
			</Button>
			:
			null
	}

	return (
		<>
			<Button  onClick={() => navigate({ pathname: '/dashboard'})} icon={<ArrowLeftOutlined />}>
				Back
			</Button>
			{/* {
				formValues && params._operation === 'view' && authState.auth?.id === formValues.student._id ?
					<Button style={{marginBottom: '20px'}} onClick={() => navigate({ pathname: `/transaction/update/${params._id}` })} icon={<EditOutlined />}>
						Update
					</Button>
				:
					null
			} */}
			{
				params._operation === 'update' ?
					<Button style={{marginBottom: '20px'}} onClick={() => navigate({ pathname: `/transaction/view/${params._id}` })} icon={<StopOutlined />}>
						Cancel
					</Button>
				:
					null
			}
			{
				formValues && renderApproveButton(formValues._id)
			}
			{
				formValues && renderRejectButton(formValues._id)
			}
			{
				formValues && <Typography.Title style={{ marginTop: '20px' }} level={5}>Status: {renderTag(formValues.status.status)} </Typography.Title>
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
				{
					params._operation === 'view' && authState.isAuthenticated && authState.auth?.userType === 'STUDENT' ?
					<>
						<Form.Item
							name={['student', 'firstName']}
							label="Student First Name"
							rules={[
								{
								required: true,
								message: 'Please input your Subject Title',
								},
							]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							name={['student', 'lastName']}
							label="Student Last Name"
							rules={[
								{
								required: true,
								message: 'Please input your Subject Title',
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name={['student', 'studentNumber']}
							label="Student Number"
							rules={[
								{
								required: true,
								message: 'Please input your Subject Title',
								},
							]}
						>
							<Input />
						</Form.Item>
					</>
					:
							null
				}

				<Form.Item
					name="transactionType"
					label="Transaction Type"
					rules={[{ required: true, message: 'Please Transaction Type' }]}
				>
					<Select placeholder="Select Transaction Type">
						<Option value="ACCREDITATION">ACCREDITATION</Option>
						<Option value="COMPLETION">COMPLETION</Option>
						<Option value="TUTORIAL">TUTORIAL</Option>
						<Option value="OTHERS">OTHERS</Option>
					</Select>
				</Form.Item>

				<Form.Item
					noStyle
					shouldUpdate={(prevValues, currentValues) => prevValues.transactionType === currentValues.transactionType}
				>
					{({ getFieldValue }) =>
						getFieldValue('transactionType') === 'OTHERS' ?
							(
								<Form.Item
									name="others"
									label="Specify Others"
									rules={[
										{
										required: true,
										message: 'Please specify "Others"',
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
				name="subjectDescription"
				label="Subject Title"
				rules={[
					{
					required: true,
					message: 'Please input your Subject Title',
					},
				]}
				>
				<Input />
				</Form.Item>

				<Form.Item
				name="subjectCode"
				label="Subject Code"
				rules={[
					{
					required: true,
					message: 'Please input your Subject Code',
					},
				]}
				>
				<Input />
				</Form.Item>

				<Form.Item
					name="semester"
					label="Semester"
					rules={[{ required: true, message: 'Please Transaction Type' }]}
				>
					<Select placeholder="Select semester">
						<Option value="First">First</Option>
						<Option value="Second">Second</Option>
						<Option value="Summer">Summer</Option>
					</Select>
				</Form.Item>


				<Form.Item
				name="yearAndSection"
				label="Year and Section"
				rules={[
					{
					required: true,
					message: 'Please input your Year and Section',
					},
				]}
				>
				<Input />
				</Form.Item>

				<Form.Item label="File" >
					<Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle rules={[ { required: true, message: 'Please upload your pdf file.'}]}>
					<Upload.Dragger 
						name="files" 
						beforeUpload={(file) => {
							return false
						}}
						accept=".pdf"
					>
						<p className="ant-upload-drag-icon">
						<InboxOutlined />
						</p>
						<p className="ant-upload-text">Click or drag file to this area to upload</p>
						<p className="ant-upload-hint">Support for a single file with file type .pdf.</p>
					</Upload.Dragger>
					</Form.Item>
				</Form.Item>

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
			<Modal title={modalContent.title} visible={isModalOpen} onOk={() => handleOk(modalContent.title)} cancelButtonProps={{ style: { display: 'none '}}}>
				<p>{modalContent.message}</p>
			</Modal>
		</>
	);
};
  
export default CreateTransaction;