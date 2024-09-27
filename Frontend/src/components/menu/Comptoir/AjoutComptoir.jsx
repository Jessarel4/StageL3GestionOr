import React, { useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, Select, Typography, Row, Col, Upload, message, Space } from 'antd';
import { ShopOutlined, HomeOutlined, FileTextOutlined, UserOutlined, CheckCircleOutlined, NumberOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BASE_URLAPI } from '../../../config';

const { Title } = Typography;
const { Option } = Select;

const AjoutComptoir = () => {
  const [loading, setLoading] = useState(false);
  

  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();


  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.slice(-1); // Garde uniquement le dernier fichier
  };

  const onFinish = async () => {
    try {
      // Validation manuelle de la photo
      if (fileList.length === 0 ) {
        message.error('Veuillez uploader une photo.');
        return;
      }
      setLoading(true);
      message.loading({ content: 'Ajout en cours...', key: 'ajoutOrp', duration: 0 });
        const values = await form.validateFields();
        // Ajouter le fichier et les autres champs à la soumission finale
        const formData = new FormData();
        formData.append('nomSociete', values.nomSociete);
        formData.append('adresse', values.adresse);
        formData.append('nifStat', values.nifStat);
        formData.append('dateOuverture', values.dateOuverture.format('YYYY-MM-DD')); // Format de date
        formData.append('directeur', values.directeur);
        formData.append('validation', values.validation);
        formData.append('stockComptoir', values.stockComptoir);
        formData.set('file', fileList[0]?.originFileObj);
        
        
        await axios.post(`${BASE_URLAPI}/ajoutComptoire`,formData)
        // Réinitialiser le formulaire
        form.resetFields();

        // Vider la liste des fichiers
        setFileList([]);
      message.success({ content: 'Formulaire soumis avec succès !', key: 'ajoutOrp'});
    } catch (error) {
        message.error({content :'Erreur lors de la soumission du formulaire.',key: 'ajoutOrp'});
    }finally{
      setLoading(false);
    }
  };

  // Configuration pour le téléchargement de fichiers
  const uploadProps = {
    beforeUpload: (file) => {
      const isPdfOrImage = file.type === 'application/pdf' || file.type.startsWith('image/');
      if (!isPdfOrImage) {
        message.error('Vous ne pouvez télécharger que des fichiers PDF ou images!');
        return isPdfOrImage || Upload.LIST_IGNORE; // Empêche le téléchargement si le fichier n'est pas valide
      }else{
        return false;
      }
    },
    onChange: (info) => {
      let updatedFileList = [...info.fileList];

      // Garde seulement le dernier fichier dans la liste
      updatedFileList = updatedFileList.slice(-1);

      // Met à jour le statut du fichier téléchargé
      updatedFileList = updatedFileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });

      setFileList(updatedFileList);
      
      // Messages de succès ou d'erreur
      if (info.file.status === 'done') {
        message.success(`${info.file.name} téléchargé avec succès.`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} échec du téléchargement.`);
      }
    },
    fileList, // Lié à l'état
  };

  return (
    <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '8px' }}>
      {/* Titre centré */}
      <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>Ajouter un Comptoir</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: '1000px', margin: '0 auto' }}
      >
        <Row gutter={[16, 16]}>
          {/* Première colonne */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="nomSociete"
              label="Nom de la Société"
              rules={[{ required: true, message: 'Veuillez entrer le nom de la société' }]}
            >
              <Input placeholder="Nom de la société" prefix={<ShopOutlined />} />
            </Form.Item>
          </Col>

          {/* Deuxième colonne */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="adresse"
              label="Adresse"
              rules={[{ required: true, message: 'Veuillez entrer l’adresse' }]}
            >
              <Input placeholder="Adresse" prefix={<HomeOutlined />} />
            </Form.Item>
          </Col>

          {/* Troisième colonne */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="nifStat"
              label="NIF/STAT"
              rules={[{ required: true, message: 'Veuillez entrer le NIF/STAT' }]}
            >
              <Input placeholder="NIF/STAT" prefix={<FileTextOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="dateOuverture"
              label="Date d'Ouverture"
              rules={[{ required: true, message: 'Veuillez sélectionner une date d’ouverture' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="directeur"
              label="Directeur"
              rules={[{ required: true, message: 'Veuillez entrer le nom du directeur' }]}
            >
              <Input placeholder="Directeur" prefix={<UserOutlined />} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="validation"
              label="Validation"
              rules={[{ required: true, message: 'Veuillez sélectionner le statut de validation' }]}
            >
              <Select placeholder="Statut de validation">
                <Option value="validé">Validé</Option>
                <Option value="non validé">Non validé</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="stockComptoir"
              label="Stock Comptoir"
              rules={[{ required: true, message: 'Veuillez entrer le stock du comptoir' }]}
            >
              <InputNumber type='number' placeholder="Stock Comptoir" style={{ width: '100%' }} prefix={<NumberOutlined />} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Form.Item
              name="arrete"
              label="Arrêté Ministériel (téléchargement)"
              rules={[{ required: true, message: 'Veuillez télécharger un arrêté ministériel' }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Télécharger PDF/Photo</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button loading={loading} type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
              Ajouter
            </Button>
            <Button disabled={loading} type="default" htmlType="reset">
              Réinitialiser
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AjoutComptoir;
