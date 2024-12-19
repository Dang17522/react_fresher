import { exportData, importData } from '@/services/api';
import { InboxOutlined } from '@ant-design/icons';
import { Divider, message, Modal, Table, TableProps, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';
import { useState } from 'react';
const props: UploadProps = {

};
const ModalImportData = (props: any) => {
    const { modalOpenImport, setModalOpenImport } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [excelData, setExcelData] = useState([]);
    const [upload, setUpload] = useState<boolean>(true);
    const [file, setFile] = useState<any>();
    
    const [tableParams, setTableParams] = useState<any>({
        pagination: {
          current: 1,
          pageSize: 5,
        },
      });

    const handleChange = async (e: any) => {
        if (upload === true) {
            setUpload(false);
            setFile(e.file.originFileObj);

            const arrayBuffer = await e.file.originFileObj.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const workbook = new ExcelJS.Workbook();
            try {
                // Use .load() method for ArrayBuffer
                await workbook.xlsx.load(arrayBuffer);

                // Iterate through sheets
                // workbook.eachSheet((worksheet, sheetId) => {
                //     console.log(`Sheet ${sheetId}:`, worksheet.name);

                //     // Read rows
                //     worksheet.eachRow((row, rowNumber) => {
                //         console.log(`Row ${rowNumber}:`, row.values);
                //         jsonData.push(row.values);


                //     });
                // });
                workbook.worksheets.forEach((worksheet) => {
                    let firstRow = worksheet.getRow(1);
                    if (!firstRow.cellCount) {
                        return;
                    }
                    let keys = firstRow.values;
                    console.log("keys: ", keys);
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) {
                            return;
                        }
                        let values = row.values;
                        let obj = {};

                        for (let i: number = 0; i < keys.length; i++) {
                            obj[keys[i]] = values[i];

                        }
                        setExcelData((prevData) => [...prevData, obj]);
                    });
                })


            } catch (error) {
                console.error('Error reading Excel file:', error);
            }
        }
    }

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Fullname',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: ['email', 'text'],
            key: 'email',

        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];
    const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
          pagination
        });
    
       
      };

    

    const handleImport = async () => {
        const res = await importData(file);
        if (res.data?.status === 200) {
            messageApi.open({
                type: 'success',
                content: res.data.message,
            });
            setModalOpenImport(false);
        }else{
            messageApi.open({
                type: 'error',
                content: res?.data?.message,
            });
            setModalOpenImport(false);
        }
        setExcelData([]);
    }

    const handleExport = async () => {
        const response = await exportData();
        console.log("response: ", response);
        const blob = response?.data;
        const url = window.URL.createObjectURL(blob );
        
        // Get filename from content-disposition header or use default
        const fileName = `export_${new Date().toISOString()}.xlsx`;
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        
    }
        return (
            <div>
                {contextHolder}
                <Modal width={600}
                    title="Import Data User"
                    centered
                    onCancel={() => setModalOpenImport(false)}
                    onOk={() => handleImport()}
                    open={modalOpenImport}
                    // footer={null}
                    closeIcon={false}
                >

                    <Dragger showUploadList={false} onChange={(e) => handleChange(e)} maxCount={1}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single file excel 
                        </p>
                        
                    </Dragger>
                    <Divider style={{ borderColor: '#1890ff', width: '200px' }}><a onClick={() => handleExport()}>Export data to excel</a></Divider>
                    
                    {excelData.length > 0 && (
                        <div>
                            {/* {excelData.map((item: any, index: number) => (
                            <div key={index}>
                                <p>{JSON.stringify(item)}</p>
                            </div>
                                

                        ))} */}

                            <Table dataSource={excelData} columns={columns} pagination={tableParams.pagination} onChange={handleTableChange}  />
                        </div>

                    )}
                </Modal>
            </div>
        )
    }

    export default ModalImportData