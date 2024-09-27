import React from 'react'
import { Form, Input, Upload, Button, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Exempleupload = () => {
    
  const [fileList, setFileList] = useState([]);
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.slice(-1); // Garde uniquement le dernier fichier
  };
  return (
    <div>
         <Form.Item
              label="Upload Photo"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Veuillez uploader une photo' }]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                    Ajouter le compte
                </Button>
            </Form.Item>
    </div>
  )
}

export default Exempleupload