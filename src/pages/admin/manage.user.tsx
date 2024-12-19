import { deleteUser, getListUser, getListUserByKey } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Popconfirm, PopconfirmProps, Space, Tag } from 'antd';
import { PaginationProps } from 'antd/lib';
import { useRef, useState } from 'react';
import { FcDeleteColumn, FcDeleteRow } from 'react-icons/fc';
import { MdOutlineEdit } from 'react-icons/md';
import ModalAddUser from './manage_users_modal/ModalAddUser';
import ModalUpdateUser from './manage_users_modal/ModalUpdateUser';
import ModalImportData from './manage_users_modal/ModalImportData';
import { CSVLink } from 'react-csv';
// import request from 'umi-request';
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const generateColor = () => {
  let randomColorString = "#";
  const arrayOfColorFunctions = "0123456789abcdef";
  for (let x = 0; x < 6; x++) {
    let index = Math.floor(Math.random() * 16);
    let value = arrayOfColorFunctions[index];

    randomColorString += value;
  }
  return randomColorString;
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type IUser = {
  id: number,
  username: string,
  fullname: string,
  email: string,
  avatar: string,
  role: string,
  createAt: Date
};

const ManageUser = () => {
  const actionRef = useRef<ActionType>();
  const [key, setKey] = useState('');
  const [pageSizeData, setPageSizeData] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenImport, setModalOpenImport] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [userUpdate, setUserUpdate] = useState<IUser>();
  const [dataCsv, setDataCsv] = useState<IUser[] | undefined>([]);
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    if (current !== pageNumber) {
      setPageNumber(current);
    }
    if (pageSizeData !== pageSize) {
      setPageSizeData(pageSize);
    }
  };

  const handleUpdate = (record: IUser) => {
    setModalUpdateOpen(true);
    setUserUpdate(record);
  }

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
  };

  const handleDelete = async (record: IUser) => {
    const res = await deleteUser(record.id);
    if (res.data?.status === 200) {
      message.success(res.data.message);
    } else {
      message.error(res.data?.message);
    }
  }

  const columns: ProColumns<IUser>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'User',
      dataIndex: 'key',
      // copyable: true,
      // ellipsis: true,
      // valueType: 'key',
      hideInTable: true,
      tooltip: 'find by username | email',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      disable: true,
      title: 'username',
      dataIndex: 'username',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>

          <Tag color={generateColor()} key={record.username}>
            {record.username}
          </Tag>

        </Space>
      ),
    },
    {
      title: 'fullname',
      key: 'fullname',
      dataIndex: 'fullname',
      hideInSearch: true,
    },
    {
      title: 'email',
      key: 'email',
      dataIndex: 'email',
      // valueType: 'date',
      copyable: true,
      // sorter: true,
      hideInSearch: true,
    },
    {
      title: 'avatar',
      key: 'avatar',
      dataIndex: 'avatar',
      hideInSearch: true,
      // valueType: 'date',
      // sorter: true,
      // hideInSearch: true,
      render: (_, record) => (
        <img
          width={50}
          height={50}
          src={record.avatar}
          alt={record.username}
        />
      )
    },
    {
      title: 'role',
      key: 'role',
      dataIndex: 'role',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Tag color={record.role === 'Admin' ? 'red' : 'green'} >
            {record.role}
          </Tag>

        </Space>
      )
    },
    {
      title: 'createAt',
      key: 'createAt',
      dataIndex: 'createAt',
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <div>
          {record.createAt && new Date(record.createAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </div>
      )
    },
    {
      title: 'Create Time',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: 'Action',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => handleUpdate(record)}
        >
          <MdOutlineEdit size={20} />
        </a>,


        <Popconfirm
          title="Delete User"
          description={
            <div>
              Are you sure to delete use {record.username} <FcDeleteColumn /><FcDeleteColumn /><FcDeleteColumn />
            </div>
          }
          onConfirm={() => handleDelete(record)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <FcDeleteRow size={25} />
        </Popconfirm>
      ],
    },
  ];
  return (
    <div><ProTable<IUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        const sortBy = sort.createAt ?? null;
        const key = params.key ?? '';
        const startTime = params.startTime ?? '';
        const endTime = params.endTime ?? '';
        const res = await getListUserByKey(key, startTime, endTime, sortBy, pageSizeData, pageNumber);
        if (res) {
          setPageSizeData(res.data?.size as number);
          setTotalPage(res.data?.totalElements as number);
          setPageNumber(res.data?.number as number + 1);
          setDataCsv(res.data?.content);
        }
        return {
          data: res.data?.content as unknown as IUser[],
          success: true,
          total: totalPage,
          page: pageNumber,

        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        // onChange(value) {
        //   console.log('value: ', value);
        // },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        current: pageNumber,
        pageSize: pageSizeData,
        showSizeChanger: true,
        total: totalPage,
        onShowSizeChange: onShowSizeChange,
        showTotal: (totalPage, range) => (
          <span style={{ right: 0 }}>
            Showing {range[0]}-{range[1]} of {totalPage}
          </span>
        )

      }
      }
      dateFormatter="string"
      headerTitle="List User"
      toolBarRender={() => [
        <CSVLink data={dataCsv} filename={"user.csv"} style={{ color: 'blue' }} className="ant-btn ant-btn-default ant-btn-dashed" target="_blank" >Export</CSVLink>,
        <Button type="dashed" key="primary" style={{ backgroundColor: 'pink', color: 'white' }}
          onClick={() => { setModalOpenImport(true); }}
        >
          Import
        </Button>,
        <Button type="dashed" key="primary" style={{ backgroundColor: 'green', color: 'white' }}
          onClick={() => { setModalOpen(true); }}
        >
          Create
        </Button>

      ]}


    />
      <ModalAddUser modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ModalUpdateUser modalUpdateOpen={modalUpdateOpen} setModalUpdateOpen={setModalUpdateOpen} userUpdate={userUpdate} setUserUpdate={setUserUpdate} />
      <ModalImportData modalOpenImport={modalOpenImport} setModalOpenImport={setModalOpenImport} />
    </div>
  )
}

export default ManageUser