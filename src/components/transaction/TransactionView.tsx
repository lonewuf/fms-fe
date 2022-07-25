import { Button, Card, Col, Form, Row, Select, Space, Table, Tag, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useTypedSelector } from '../../store';
import { Document, Page } from 'react-pdf'

const { Column, ColumnGroup } = Table;

export enum UserType {
	STUDENT = 'STUDENT',
	ADMIN = 'ADMIN'
}

export interface User {
  _id: string
	email: string
	firstName: string
	lastName: string
	studentNumber: string
	userType: UserType
}

export interface FileType {
	asset_id: string
	public_id: string
	version: number,
	version_id: string
	signature: string
	width: number,
	height: number,
	format: string
	resource_type: string
	created_at: Date,
	tags: string[],
	pages: number,
	bytes: number,
	type: string
	etag: string
	placeholder: boolean,
	url: string
	secure_url: string
	access_mode: string
	original_filename: string
	api_key: string
}

export enum Status {
	SUBMITTED = 'SUBMITTED',
	PENDING = 'PENDING',
	DONE = 'DONE'
}

export enum TransactionType {
	ACCREDITATION = 'ACCREDITATION',
	COMPLETION = 'COMPLETION',
	TUTORIAL = 'TUTORIAL'
}

interface DataType {
  _id: string
	student: User
	approvedBy?: User
	transactionType: TransactionType
	status: Status
	remarks: String
	submittedFile?: FileType
	approvedFile?: FileType
	dateSubmitted: Date
	dateApproved?: Date | null
  key: string
}

// const data: DataType[] = [
//   {
//     key: '1',
//     firstName: 'John',
//     lastName: 'Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '2',
//     firstName: 'Jim',
//     lastName: 'Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     tags: ['loser'],
//   },
//   {
//     key: '3',
//     firstName: 'Joe',
//     lastName: 'Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
// ];



const TransactionView: React.FC = () => {
  const navigate = useNavigate()
  const authState = useTypedSelector(state => state.auth)
  const [ transaction, setTransaction ] = useState<DataType | null>(null)
  const [ mode, setMode ] = useState<'view' | 'approve' | 'update'>('view')
  const [ numPages, setNumPages ] = useState<number | null>(null)
  const [ pageNumber, setPageNumber ] = useState(1)
  const { _id } = useParams()

  useEffect(() => {
    async function getTransaction () {
      try {
        const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string
        const response = await axios({ method: 'get', url: `/transaction/${_id}`, headers: { 'Authorization': `Bearer ${jwtToken}` }})
        if (response.data?.error) {
          console.log(response.data.error)
          console.log(response.data.message)
          console.log('error')
        } else {
          console.log(response, 'response')
          let data = response.data.data as DataType
          setTransaction(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getTransaction()
  }, [authState])

  const handleBack = (id) => {
    navigate(`/dashboard`)
  }

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

	const dummyRequest = (arg1, arg2) => {
		console.log('Dummy Request')	
	}

	const getFile = (e: any) => {
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
		  return e;
		}
		return e && e.fileList;
	  };

	const onFinish = async (values: any) => {
		console.log(values, 'values')
		const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string
		const data = new FormData()
		data.append('file', values.file[0].originFileObj)
		// const response = await axiosRequest(Method.post, '/transaction', { transactionType: values.transactionType })
		const response = await axios({ method: 'post', url: '/transaction', headers: { 'Authorization': `Bearer ${jwtToken}` }, data: {  transactionType: values.transactionType }})
		if (response.data?.error) {
			console.log(response.data.error)
			console.log(response.data.message)
			console.log('error')
		} else {
			console.log(response, 'response')
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
	}

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const onSubmittedDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages)
	}

	return (
		<>
		<Button type='primary' onClick={handleBack} style={{marginBottom: '50px'}}>
			Back 
		</Button> 
		{ transaction !== null ?
			(
			<>
				<Row>
				<Col span={8} offset={8}>
					<Card title="View Transaction">
					<Form
					name="basic"
					// labelCol={{ span: 8 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
					>
					<Form.Item label="Transaction Type" name='transactionType' rules={[{ required: true, message: 'Please choose transaction type' }]}>
						<Select placeholder={transaction.transactionType} >
						{ options.map(item =>  <Select.Option  key={item.value} value={item.value}>{item.type}</Select.Option> )}
						</Select>
					</Form.Item>
					{
						transaction.submittedFile?.url ? 
						// <Document file={{ url: transaction.submittedFile.url }} onLoadSuccess={onSubmittedDocumentLoadSuccess}>
						// 	<Page pageNumber={pageNumber} />
						// </Document> 
						<div>
							<a href={transaction.submittedFile.url} target="_blank" className="">Submitted File</a>
						</div>
						: <p>No submitted file</p>
					}

					{/* <Form.Item
						name="file"
						label="Upload"
						getValueFromEvent={getFile}
						// extra="upload"
					>
						<Upload name="logo" listType="text"  customRequest={() => console.log('Dummy Request')}>
						<Button >Click to upload</Button>
						</Upload>
					</Form.Item> */}



					{/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
						Submit
						</Button>
					</Form.Item> */}
					</Form>
					</Card>
				</Col>
				</Row>

			</>
			)
			: <><h1>No transaction found.</h1></>
		}
		</>
	)
};

export default TransactionView;