import { Button, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import axiosRequest, { Method } from '../../api/request';
import { useTypedSelector } from '../../store';

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

interface DataType {
  _id: string
	student: User
	approvedBy?: User
	transactionType: User
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
  const [ transactions, setTransactions ] = useState<DataType[] | null>(null)

  useEffect(() => {
    async function getTransactions () {
      try {
        // const response = await axiosRequest(Method.get, '/transaction')
        const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string
        const response = await axios({ method: 'get', url: '/transaction', headers: { 'Authorization': `Bearer ${jwtToken}` }})
        // if (response.data?.error) {
        //   console.log(response.response.data.error)
        //   console.log(response.response.data.message)
        if (response.data?.error) {
          console.log(response.data.error)
          console.log(response.data.message)
          console.log('error')
        } else {
          console.log(response, 'response')
          let data = response.data.data as DataType[]
          data = data.map(item => ({ ...item, key: item._id }))
          console.log(data, 'data')
          setTransactions(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getTransactions()
  }, [authState])

  const handleCreate = () => {
    console.log('asd')
  }

  const handleApprove = async (id) => {
    console.log(id, 'approve')
  }

  const handleNavigate = (id) => {
    console.log(id, 'navigate')
    navigate(`/transaction/${id}`)
  }

  return (
    <>
      <Button type='primary' onClick={handleCreate} style={{marginBottom: '50px'}}>
        Create Transaction
      </Button> 
      { transactions !== null ?
        (
          <>
            <Table dataSource={transactions} pagination={false}>
              <ColumnGroup title="Name">
                <Column title="First Name" dataIndex={['student', 'firstName']} key="firstName" />
                <Column title="Last Name" dataIndex={['student', 'lastName']} key="lastName" />
              </ColumnGroup>
              <Column title="Student Number" dataIndex={'studentNumber'} key="lastName" />
              <Column title="Type" dataIndex={'transactionType'} key="lastName" />
              <Column title="Status" dataIndex={'status'} key="lastName" />
              <ColumnGroup title="Actions">
                <Column title="Approve" key="approve" dataIndex={'_id'} render={(id) => <Button onClick={() => handleApprove(id)} type='primary'>Approve</Button>}/>
                <Column title="View" key="view" dataIndex={'_id'} render={(id) => <Button onClick={() => handleNavigate(id)}>View</Button>}/>
              </ColumnGroup>
              {/* <Column title="Address" dataIndex="address" key="address" /> */}
            </Table>
          </>
        )
        : <></>
      }
    </>
  )
};

export default TransactionView;