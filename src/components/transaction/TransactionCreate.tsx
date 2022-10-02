import { Button, Card, Col, Form, Row, Select, Upload } from 'antd';
import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
	const navigate = useNavigate()

	const getFile = (e: any) => {
		if (Array.isArray(e)) {
		  return e;
		}
		return e && e.fileList;
	  };

	const onFinish = async (values: any) => {
		const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string
		const data = new FormData()
		data.append('file', values.file[0].originFileObj)
		// const response = await axiosRequest(Method.post, '/transaction', { transactionType: values.transactionType })
		const response = await axios({ method: 'post', url: '/transaction', headers: { 'Authorization': `Bearer ${jwtToken}` }, data: {  transactionType: values.transactionType }})
		if (response.data?.error) {
			console.log('error')
		} else {
			const { _id } = response.data.data
			const responseUpload = await axios({ method: 'post', url: `/file/upload/submittedFile/${_id}`, headers: { 'Authorization': `Bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' }, data})
			if (responseUpload.data.error) {
				console.log(responseUpload.data.error)
			} else {
				navigate('/dashboard')
			}
			// dispatch({
			// 	type: AuthActionTypes.GOT_AUTH_DATA,
			// 	auth: decoded,
			// 	isAuthenticated: true
			// })
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const options = [
		{
			type: 'Accreditation',
			value: 'ACCREDITATION'
		},
		{
			type: 'Completion',
			value: 'COMPLETION'
		},
		{
			type: 'Tutorial',
			value: 'TUTORIAL'
		},
	]


	return (
		<Row>
			<Col span={8} offset={8}>
				<Card title="Create Transaction">
				<Form
					name="basic"
					// labelCol={{ span: 8 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item label="Transaction Type" name='transactionType' rules={[{ required: true, message: 'Please choose transaction type' }]}>
						<Select>
							{ options.map(item => <Select.Option key={item.value} value={item.value}>{item.type}</Select.Option>)}
						</Select>
					</Form.Item>

					<Form.Item
						name="file"
						label="Upload"
						getValueFromEvent={getFile}
						// extra="upload"
					>
						<Upload name="logo" listType="text" customRequest={() => console.log('Dummy Request')}>
							<Button >Click to upload</Button>
						</Upload>
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