import React, { useEffect, useState } from 'react';
import { BASE_URL,BASE_URLAPI } from '../../config';
import axios from 'axios';
import { 
    Space, 
    Select, 
    Row, 
    Form, 
    Drawer, 
    Col, 
    Button, 
    Dropdown, 
    Table, 
    Input, 
    message, 
    Image, 
    Upload, 
    Switch,
    Popconfirm 
} from 'antd';
import { PlusOutlined, DownOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'; // N'oubliez pas d'importer l'icône

const { Search } = Input;
const { Option } = Select;

const ListeCompte = () => {
    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const [changePassword, setChangePassword] = useState(false);

    const [searchText, setSearchText] = useState(''); // État pour la recherche

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields(); // Reset form fields when closing
        setChangePassword(false); // Reset switch state
    };

    // Loading tableau
    const [loading, setLoading] = useState(false);
    const colonnes = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Utilisateur',
            dataIndex: 'utilisateur',
            key: 'utilisateur',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
            render: (text, record) => (
                <Image 
                    src={`${BASE_URL}${record.photo}`}
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #f0f0f0',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                />
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'operation2',
            render: (text, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: '1',
                                label: (
                                    <span><EditOutlined />  Modifier</span>
                                ),
                                onClick: () => {
                                    form.setFieldsValue({
                                        id:record.id,
                                        utilisateur: record.utilisateur,
                                        email: record.email,
                                        role: record.role,
                                    });
                                    setFileList(record.photo ? [{ uid: record.id, url: `${BASE_URL}${record.photo}` }] : []);
                                    showDrawer();
                                },
                            },
                            {
                                key: '2',
                                label:  (
                                    <Popconfirm
                                        placement="topRight"
                                        title={`Voulez-vous vraiment supprimer cet utilisateur ?`}                                 
                                        description={
                                            <p>
                                                Vous êtes sur le point de supprimer l'utilisateur <strong>{record.utilisateur}</strong>. <br />
                                                <span>Cette action est irréversible.</span>
                                            </p>
                                        }
                                        onConfirm={() => handleDelete(record.id)}
                                        okText="Oui"
                                        cancelText="Non"
                                    >
                                        <span><DeleteOutlined />  Supprimer</span>
                                    </Popconfirm>
                                ),
                                // onClick: () => handleDelete(record.id),
                            },
                        ],
                    }}
                >
                    <a>
                        Plus <MoreOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];

    const [dataC, setDataC] = useState([]);
    const actualisetableaucompte = () => {
        setLoading(true); 
        axios
            .get(`${BASE_URL}/listecompte`)
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    key: index,
                    id: item.id,
                    utilisateur: item.utilisateur,
                    email: item.email,
                    role: item.role,
                    photo: item.photo,
                }));
                setDataC(formattedData);
                setLoading(false);
            })
            .catch((err) => {
                console.log('Erreur:', err);
                setLoading(false);
            });
    }

    useEffect(() => {
        actualisetableaucompte();
    }, []);

    const handleDelete = (id) => {
        setLoading(true); 
        const key = 'supression';
        
        message.loading({ content: 'Suppression en cours...', key });
        axios.post(`${BASE_URL}/supressioncompte/${id}`, {})
            .then((response) => {
                if (response.status === 202) {
                    message.success({ content: 'Compte supprimé avec succès', key });
                    actualisetableaucompte();
                } else {
                    message.error({ content: 'Compte introuvable !', key });
                }
            })
            .catch((error) => {
                message.error({ content: 'Erreur lors de la suppression !', key });
            });
    };

    const onFinish = (values) => {
        const keyM = 'modification';
    
        // Afficher le message de chargement
        message.loading({ content: 'Modification en cours...', key: keyM, duration: 0 });
    
        // Créer un FormData pour les données du formulaire
        const formData = new FormData();
        formData.append('utilisateur', values.utilisateur);
        formData.append('email', values.email);
        if (values.motDePasse) formData.append('motDePasse', values.motDePasse);
        formData.append('role', values.role);
    
        // Ajouter l'image si elle est présente
        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj);
        }
    
        const url = `${BASE_URLAPI}/modifiecompte/${values.id}`;
    
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            // Afficher un message de succès et fermer le drawer
            message.success({ content: response.data.message, key: keyM });
            onClose();
            actualisetableaucompte();
        })
        .catch((error) => {
            // Afficher un message d'erreur
            console.error('Erreur lors de la mise à jour:', error);
            message.error({ content: 'Erreur lors de la mise à jour !', key: keyM });
        });
    };
    

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Fonction de filtrage des données
    const filteredData = dataC.filter((item) =>
        item.utilisateur.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Listes Des Comptes</h1>
            <Search
                placeholder="Rechercher un utilisateur"
                allowClear
                onSearch={handleSearch}
                style={{ width: 200, marginBottom: 20 }}
            />
            <Table pagination={{ pageSize: 6 }} columns={colonnes} dataSource={filteredData} size='small' loading={loading} />
            <Drawer
                title="Modifier un compte"
                width={720}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Annuler</Button>
                        <Button onClick={() => form.submit()} type="primary">
                            Enregistrer
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        {/* Colonne de gauche pour l'upload */}
                        <Form.Item
                                label="id"
                                name="id"
                                style={{display: 'none'}}
                            >
                                <Input placeholder="Adresse Email" />
                            </Form.Item>
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
                        </Col>

                        {/* Colonne de droite pour les inputs */}
                        <Col span={16}>
                            <Form.Item
                                label="Changer le mot de passe"
                                name="changePassword"
                                valuePropName="checked"
                            >
                                <Switch
                                    onChange={(checked) => setChangePassword(checked)}
                                />
                            </Form.Item>

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

                            {changePassword && (
                                <Form.Item
                                    label="Mot de passe"
                                    name="motDePasse"
                                    rules={[{ required: true, message: 'Veuillez entrer un mot de passe' }]}
                                >
                                    <Input.Password placeholder="Mot de passe" />
                                </Form.Item>
                            )}

                            <Form.Item
                                label="Role"
                                name="role"
                                rules={[{ required: true, message: 'Veuillez entrer un rôle' }]}
                            >
                                <Input placeholder="Rôle de l'utilisateur" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default ListeCompte;
