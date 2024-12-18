import { importData } from '@/services/api';
import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, Table, UploadProps } from 'antd';
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

    const handleImport = async () => {
        const res = await importData(file);
        console.log("res: ", res);
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
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                            banned files.
                        </p>
                    </Dragger>
                    {excelData.length > 0 && (
                        <div>
                            {/* {excelData.map((item: any, index: number) => (
                            <div key={index}>
                                <p>{JSON.stringify(item)}</p>
                            </div>
                                

                        ))} */}

                            <Table dataSource={excelData} columns={columns} />
                        </div>

                    )}
                </Modal>
            </div>
        )
    }

    export default ModalImportData