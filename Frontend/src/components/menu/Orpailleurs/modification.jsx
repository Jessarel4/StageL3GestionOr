import React from 'react';
import { Form, Input, Button, DatePicker, Upload, Select, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AjoutOrpars = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Valeurs du formulaire:', values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajout d'un nouveau Orpailleur</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Numéro d'identification"
            name="numeroIdentification"
            rules={[{ required: true, message: 'Veuillez entrer le numéro d\'identification' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Nom"
            name="nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Prénom"
            name="prenom"
            rules={[{ required: true, message: 'Veuillez entrer le prénom' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Adresse"
            name="adresse"
            rules={[{ required: true, message: 'Veuillez entrer l\'adresse' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Sexe"
            name="sexe"
            rules={[{ required: true, message: 'Veuillez sélectionner le sexe' }]}
          >
            <Select>
              <Option value="Homme">Homme</Option>
              <Option value="Femme">Femme</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="CIN"
            name="cin"
            rules={[{ required: true, message: 'Veuillez entrer le CIN' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Date de délivrance du CIN"
            name="dateCin"
            rules={[{ required: true, message: 'Veuillez sélectionner la date de délivrance' }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Lieu de délivrance du CIN"
            name="lieuCin"
            rules={[{ required: true, message: 'Veuillez entrer le lieu de délivrance du CIN' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Lieu d'Octroi"
            name="lieuOctroit"
            rules={[{ required: true, message: 'Veuillez entrer le lieu d\'octroi' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Date d'Octroi"
            name="dateOctroit"
            rules={[{ required: true, message: 'Veuillez sélectionner la date d\'octroi' }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Validité Année"
            name="validateAnnee"
            rules={[{ required: true, message: 'Veuillez entrer l\'année de validité' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Photo"
            name="photo"
            rules={[{ required: true, message: 'Veuillez télécharger une photo' }]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Cliquez pour télécharger</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Stock Orpailleur"
            name="stockOrpailleur"
            rules={[{ required: true, message: 'Veuillez entrer le stock d\'orpailleur' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Commune ID"
            name="communeId"
            rules={[{ required: true, message: 'Veuillez entrer l\'ID de la commune' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col>
          <Button type="primary" htmlType="submit">
            Soumettre
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AjoutOrpars;
