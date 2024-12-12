import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { useState } from 'react';
import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';
import { json } from 'react-router-dom';
const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
const ModalImportData = (props: any) => {
    const { modalOpenImport, setModalOpenImport } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [excelData, setExcelData] = useState([]);

    const handleChange = async (e: any) => {
        console.log(e.file.originFileObj);
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
                    for (let i = 0; i < keys.length; i++) {
                        obj[keys[i]] = values[i];

                    }
                    setExcelData((prevData) => [...prevData, obj]);
                });
            })

           
        } catch (error) {
            console.error('Error reading Excel file:', error);
        }

    }


    return (
        <div>
            {contextHolder}
            <Modal width={600}
                title="Import Data User"
                centered
                onCancel={() => setModalOpenImport(false)}
                onOk={() => setModalOpenImport(false)}
                open={modalOpenImport}
                // footer={null}
                closeIcon={false}
            >

                <Dragger {...props} onChange={(e) => handleChange(e)}>
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
                        {excelData.map((item: any, index: number) => (
                            <div key={index}>
                                <p>{JSON.stringify(item.username)}</p>
                            </div>
                                

                        ))}
                    </div>

                )}
            </Modal>
        </div>
    )
}

export default ModalImportData