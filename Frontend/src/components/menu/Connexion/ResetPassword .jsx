
// import { Col, Row, Form, Input, Button, message, Avatar } from 'antd';
// import React, { useState } from 'react';
// import axios from 'axios';
// import { BASE_URLAPI } from '../../../config';
// import '../../Assets/css/Connexion.css';
// import Imgrc from '../../Assets/img/forgotP.svg';
// import Imgmine from '../../Assets/img/logoMMRS.png';
// import { useNavigate } from 'react-router-dom';

// const ResetPassword = () => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [isCodeSent, setIsCodeSent] = useState(false); // État pour suivre si le code a été envoyé
//     const navigate = useNavigate();

//     const onFinish = async (values) => {
//         setLoading(true);
//         try {
//             if (!isCodeSent) {
//                 const response = await axios.post(`${BASE_URLAPI}/mdpOublier`, {
//                     email: values.email,
//                 });
//                 message.success(response.data.message);
//                 // form.resetFields(); // Réinitialiser le formulaire après succès
//                 setIsCodeSent(true); // Indique que le code a été envoyé
//             } else {
//                 // Logique pour vérifier le code ici (si besoin)
//                 message.success('Code vérifié avec succès !');
//                 navigate('/'); // Redirige après la vérification
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
//             console.log(error);
//             message.error(errorMessage);
//             if (errorMessage === 'Email introuvable') {
//                 form.setFields([{ name: 'email', errors: [errorMessage] }]);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className='fullscreen-result'>
//             <Row className='rowconex' gutter={16}>
//                 <Col className='colconex' span={12}>
//                     <img className='imageUpdown' src={Imgrc} alt="Illustration de réinitialisation de mot de passe" />
//                 </Col>
//                 <Col className='colconex' span={12}>
//                     <div className='colconex2'>
//                         <Avatar
//                             className='mineimgRP'
//                             preview={false}
//                             src={Imgmine}
//                             style={{
//                                 width: 100,
//                                 height: 100,
//                                 borderRadius: '50%',
//                                 objectFit: 'cover',
//                                 border: '2px solid #f0f0f0',
//                                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                             }}
//                         />
//                         <h2>Mot de Passe Oublié</h2>
//                         <Form
//                             form={form}
//                             name="reset-password"
//                             onFinish={onFinish}
//                             layout="vertical"
//                         >
//                             <Form.Item
//                                 name="email"
//                                 rules={[{ required: true, type: 'email', message: 'Veuillez entrer une adresse email valide' }]}
//                             >
//                                 <Input placeholder="Email" />
//                             </Form.Item>
//                             {isCodeSent && ( // Affiche le champ de code uniquement si le code a été envoyé
//                                 <Form.Item
//                                     name="role"
//                                     rules={[{ required: true, message: 'Veuillez entrer le code de validation' }]}
//                                 >
//                                     <Input.Password placeholder="Votre code" />
//                                 </Form.Item>
//                             )}
//                             <Form.Item>
//                                 <Button type="primary" htmlType="submit" block loading={loading}>
//                                     {loading ? 'Envoi...' : isCodeSent ? 'Vérifier' : 'Envoyer'}
//                                 </Button>
//                             </Form.Item>
//                         </Form>
//                     </div>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default ResetPassword;
import { Col, Row, Form, Input, Button, message, Avatar } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URLAPI } from '../../../config';
import '../../Assets/css/Connexion.css';
import Imgrc from '../../Assets/img/forgotP.svg';
import Imgmine from '../../Assets/img/logoMMRS.png';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false); // État pour suivre si le code a été vérifié
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (!isCodeSent) {
                const response = await axios.post(`${BASE_URLAPI}/mdpOublier`, {
                    email: values.email,
                });
                message.success(response.data.message);
                setIsCodeSent(true); // Indique que le code a été envoyé
            } else if (!isCodeVerified) {
                // Logique pour vérifier le code
                // Remplacez ce commentaire par l'appel API réel pour vérifier le code
                // Voici un exemple fictif:
                const verifyResponse = await axios.post(`${BASE_URLAPI}/verifierCode`, {
                    email: values.email,
                    code: values.role, // Supposons que le code soit stocké dans 'role'
                });
                message.success(verifyResponse.data.message);
                setIsCodeVerified(true); // Indique que le code a été vérifié
            } else {
                // Logique pour mettre à jour le mot de passe
                const updateResponse = await axios.post(`${BASE_URLAPI}/mettreAJourMotDePasse`, {
                    email: values.email,
                    nouveauMotDePasse: values.nouveauMotDePasse, // Nouveau mot de passe
                });
                message.success(updateResponse.data.message);
                navigate('/'); // Redirige après la mise à jour
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
            console.log(error);
            message.error(errorMessage);
            if (errorMessage === 'Email introuvable') {
                form.setFields([{ name: 'email', errors: [errorMessage] }]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fullscreen-result'>
            <Row className='rowconex' gutter={16}>
                <Col className='colconex' span={12}>
                    <img className='imageUpdown' src={Imgrc} alt="Illustration de réinitialisation de mot de passe" />
                </Col>
                <Col className='colconex' span={12}>
                    <div className='colconex2'>
                        <Avatar
                            className='mineimgRP'
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
                        <h2>Mot de Passe Oublié</h2>
                        <Form
                            form={form}
                            name="reset-password"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Veuillez entrer une adresse email valide' }]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                            {isCodeSent && ( // Affiche le champ de code uniquement si le code a été envoyé
                                <Form.Item
                                    name="role"
                                    rules={[{ required: true, message: 'Veuillez entrer le code de validation' }]}
                                >
                                    <Input placeholder="Votre code" />
                                </Form.Item>
                            )}
                            {isCodeVerified && ( // Affiche le champ pour le nouveau mot de passe si le code a été vérifié
                                <Form.Item
                                    name="nouveauMotDePasse"
                                    rules={[{ required: true, message: 'Veuillez entrer votre nouveau mot de passe' }]}
                                >
                                    <Input.Password placeholder="Nouveau mot de passe" />
                                </Form.Item>
                            )}
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    {loading ? 'Envoi...' : isCodeVerified ? 'Mettre à jour' : isCodeSent ? 'Vérifier' : 'Envoyer'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ResetPassword;
