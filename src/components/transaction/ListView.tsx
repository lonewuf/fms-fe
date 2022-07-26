import { EyeOutlined } from '@ant-design/icons';
import { Button, Table, Tag, } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useTypedSelector } from '../../store';
import { AuthActionTypes, UserType } from '../../store/auth/types';
import setAuthToken from '../../utils/setAuthToken';
import CommonTable, { DataType } from '../table/Table';
import { tagColors } from './CreateTransaction';

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

const TransactionListView: React.FC = () => {
  const navigate = useNavigate()
  const authState = useTypedSelector(state => state.auth)
  const [ transactions, setTransactions ] = useState<DataType[] | null>(null)
	const dispatch = useDispatch()

  useEffect(() => {
    async function getTransactions () {
      try {
        const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string
        const response = await axios({ method: 'get', url: '/transaction', headers: { 'Authorization': `Bearer ${jwtToken}` }})

        if (response.data?.error) {
          console.log(response.data.error)
        }
        else {
          let data = response.data.data
          data = data.map(item => ({ ...item, key: item._id }))
          setTransactions(data)
        }
      } catch (err: any) {
        if (err.response.status === 401) {
          localStorage.removeItem('jwtToken')
          dispatch({
            type: AuthActionTypes.CLEAR_AUTH_DATA
          })
          setAuthToken('')
          navigate({ pathname: '/login' })
        }
        console.log(err)
      }
    }
    getTransactions()
  }, [authState])

  const handleCreate = () => {
    navigate(`/transaction/create/document`)
  }

  const handleNavigate = (id) => {
    console.log(id, 'navigate')
    navigate(`/transaction/view/${id}`)
  }

  const sorter = (a: DataType, b: DataType, field: string) => (a[field] as string).length - (b[field] as string).length

  const columns: ColumnsType<DataType> = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      // sorter: (a, b) => (a.studentName as string).length - (b.studentName as string).length,
      sorter: (a, b) => sorter(a, b, 'studentName')
    },
    {
      title: 'Student Number',
      dataIndex: 'studentNumber',
      sorter: (a, b) => sorter(a, b, 'studentNumber')
    },
    {
      title: 'Subject Code',
      dataIndex: 'subjectCode',
      sorter: (a, b) => sorter(a, b, 'subjectCode')
    },
    {
      title: 'Type',
      dataIndex: 'transactionType',
      sorter: (a, b) => sorter(a, b, 'transactionType')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => sorter(a, b, 'transactionType'),
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      sorter: (a, b) => sorter(a, b, 'transactionType'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <Button onClick={() => handleNavigate(record._id)}>
          <EyeOutlined />
        </Button>
      )
    },
  ]

  return (
    <>
      { authState && authState.auth?.userType === UserType.STUDENT 
        ?
          <Button type='primary' onClick={handleCreate} style={{marginBottom: '50px'}}>
            Create Transaction
          </Button> 
        :
          null
      }
      { transactions !== null ?
        (
          <CommonTable columns={columns} data={transactions}/> 
        )
        : null
      }
    </>
  )
};

export default TransactionListView;