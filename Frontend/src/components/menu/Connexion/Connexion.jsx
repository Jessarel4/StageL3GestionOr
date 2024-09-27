import { Col, Row, Form, Input, Button, message,Avatar } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URLAPI } from '../../../config';
import '../../Assets/css/Connexion.css';
import Imgrc from '../../Assets/img/log2.svg';
import Imgmine from '../../Assets/img/logoMMRS.png';


import { Link, useNavigate } from 'react-router-dom';

const Connexion = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // État de chargement
  const navigate = useNavigate();
  const generateRandomToken = (username) => {
    return `${username}-${Math.random().toString(36).substr(2)}`;
  };  
  const onFinish = async (values) => {
    setLoading(true); // Met à jour l'état de chargement
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('motDePasse', values.password); // Assure-toi d'utiliser 'motDePasse' pour correspondre au backend

    try {
      const response = await axios.post(`${BASE_URLAPI}/connexion`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success(response.data.message);
      const token = response.data.token || generateRandomToken(values.email);
      const userName = response.data.compte.utilisateur;
      const compte = response.data.compte;  // Assuming the response contains a token
      onLogin(token,userName,compte);
      navigate('/');
      // onLogin(response.data.compte); // Appelle la fonction onLogin avec les données du compte
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
      console.log(error)
      
      // Afficher l'erreur dans le message global
      message.error(errorMessage);
      
      // Déterminer quel champ mettre à jour avec l'erreur
      if (error.response?.data?.message === 'Email introuvable') {
        form.setFields([
          {
            name: 'email',
            errors: [error.response.data.message],
          },
        ]);
      } else if (error.response?.data?.message === 'Mot de passe incorrect') {
        form.setFields([
          {
            name: 'password',
            errors: [error.response.data.message],
          },
        ]);
      }
    }finally {
      setLoading(false); // Réinitialise l'état de chargement après la requête
    }
  };

  return (
    <div className='fullscreen-result'>
      <Row className='rowconex' gutter={16}>
        <Col className='colconex' span={12}>
          <img className='imageUpdown' src={Imgrc} alt="" />
        </Col>
        <Col className='colconex' span={12}>
          <div className='colconex2'>
          <Avatar className='mineimg'
              preview={false}
                src={Imgmine}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #f0f0f0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            /> 
            <h2>Connexion</h2>
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: 'Veuillez entrer une adresse email valide' }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
              >
                <Input.Password placeholder="Mot de passe" />
              </Form.Item>
              <Form.Item>
                <Link to="/MdpOublier" style={{ textAlign: 'center', display: 'block', marginTop: '10px' }}>
                  Mot de passe oublié ?
                </Link>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Connexion;
