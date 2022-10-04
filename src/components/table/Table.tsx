import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Space, Table } from 'antd';
import type { ColumnType, TableProps } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words'

export interface DataType {
  key: React.Key
  name?: string
  age?: number
  _id?: string
  address?: string
	studentName?: string
  studentNumber?: string
	transactionType?: string
	status?: string
	dateSubmitted?: Date
	// approvedBy?: User
}

type DataIndex = keyof DataType;



const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  // console.log(pagination, 'pagination')
  // console.log(filters, 'filters')
  // console.log(sorter, 'sorter')
  // console.log(extra, 'extra')
  // console.log('params', pagination, filters, sorter, extra);
};

type CommonTableProps = {
  columns: ColumnType<DataType>[]
  data: any[]
}

const CommonTable: React.FC<CommonTableProps> = ({ columns, data }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex as string]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    // onFilterDropdownOpenChange: visible => {
    //   if (visible) {
    //     setTimeout(() => searchInput.current?.select(), 100);
    //   }
    // },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // const columns: ColumnsType<DataType> = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     // specify the condition of filtering result
  //     // here is that finding the name started with `value`
  //     sorter: (a, b) => a.name.length - b.name.length,
  //     ...getColumnSearchProps('name')
  //   },
  //   {
  //     title: 'Age',
  //     dataIndex: 'age',
  //     // defaultSortOrder: 'descend',
  //     sorter: (a, b) => a.age - b.age,
  //     ...getColumnSearchProps('age')
  //   },
  //   {
  //     title: 'Address',
  //     dataIndex: 'address',
  //     // onFilter: (value: string | number | boolean, record) => record.name.indexOf(value as string) === 0,
  //     ...getColumnSearchProps
  //   },
  // ];

  const excludeSearch = [ 'action' ]

  return <Table 
    columns={columns.map((obj) => (
        excludeSearch.includes(obj.dataIndex as string) ?
        {
          ...obj
        }
        :
        { 
          ...obj,
          ...getColumnSearchProps(obj.dataIndex as keyof DataType) 
        }
      ))
    }
    pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: [ '5', '10', '20', '50', '100' ]}} 
    dataSource={data} onChange={onChange} 
  />;

}

export default CommonTable;