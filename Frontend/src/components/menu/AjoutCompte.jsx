import React, { useState } from 'react';
import { Form, Input, Upload, Button, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BASE_URLAPI } from '../../config';

const AjoutCompte = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // Fonction avant l'upload pour filtrer les types de fichiers
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Vous ne pouvez télécharger que des fichiers image !');
      return Upload.LIST_IGNORE;
    }
    return false;
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.slice(-1); // Garde uniquement le dernier fichier
  };

  const onFinish = async (values) => {
    
    // Créer un objet formData pour envoyer l'image
    if (fileList.length === 0) {
      message.error('Aucune photo à uploader !');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', fileList[0]?.originFileObj);
    formData.append('utilisateur', values.utilisateur);
    formData.append('email', values.email);
    formData.append('motDePasse', values.motDePasse); // Ajoute le mot de passe
    formData.append('role', values.role);

    try {
      // Envoyer les données au serveur
      await axios.post(`${BASE_URLAPI}/ajoutcompte`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Compte ajouté avec succès !');
      form.resetFields(); // Réinitialiser les champs du formulaire
      setFileList([]);
    } catch (error) {
      message.error('Erreur lors de l\'ajout du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajout d'un nouveau compte</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Colonne de gauche pour l'upload */}
          <Col span={8}>
            <Form.Item
              label="Upload Photo"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Veuillez uploader une photo' }]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                accept="image/*"
                
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          {/* Colonne de droite pour les inputs */}
          <Col span={16}>
            <Form.Item
              label="Utilisateur"
              name="utilisateur"
              rules={[{ required: true, message: 'Veuillez entrer le nom d\'utilisateur' }]}
            >
              <Input placeholder="Nom d'utilisateur" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Veuillez entrer une adresse email valide' }]}
            >
              <Input placeholder="Adresse Email" />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="motDePasse"
              rules={[{ required: true, message: 'Veuillez entrer un mot de passe' }]}
            >
              <Input.Password placeholder="Mot de passe" />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Veuillez entrer un rôle' }]}
            >
              <Input placeholder="Rôle de l'utilisateur" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Ajouter le compte
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AjoutCompte;
