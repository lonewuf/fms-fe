import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../../store';
import { AuthActionTypes } from '../../store/auth/types';
import setAuthToken from '../../utils/setAuthToken';
import CommonTable, { DataType } from '../table/Table'
import { UserType } from '../transaction/TransactionView';

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const UserListView: React.FC = () => {
  const navigate = useNavigate()
  const authState = useTypedSelector(state => state.auth)
  const [ users, setUsers ] = useState<DataType[] | null>(null)
	const dispatch = useDispatch()

  useEffect(() => {
    async function getTransactions () {
      try {
        const jwtToken = localStorage.getItem('jwtToken')?.split(' ')[1] as string
        const response = await axios({ method: 'get', url: '/user', headers: { 'Authorization': `Bearer ${jwtToken}` }})

        if (response.data?.error) {
          console.log(response.data.error)
        }
        else {
          let data = response.data.data
          data = data.map(item => ({ ...item, key: item._id }))
          setUsers(data)
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
    navigate(`/user/create/document`)
  }

  const handleNavigate = (id) => {
    navigate(`/user/view/${id}`)
  }

  const sorter = (a: DataType, b: DataType, field: string) => (a[field] as string).length - (b[field] as string).length

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => sorter(a, b, 'studentName')
    },
    {
      title: 'Student Number',
      dataIndex: 'studentNumber',
      sorter: (a, b) => sorter(a, b, 'studentNumber')
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      sorter: (a, b) => sorter(a, b, 'subjectCode')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => sorter(a, b, 'subjectCode')
    },
    {
      title: 'Status',
      dataIndex: 'status',
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
      { authState && authState.auth?.userType === UserType.ADMIN 
        ?
          <Button type='primary' onClick={handleCreate} style={{marginBottom: '50px'}}>
            Create User
          </Button> 
        :
          null
      }
      { users !== null ?
        (
          <CommonTable columns={columns} data={users}/> 
        )
        : null
      }
    </>
  )

}

export default UserListView