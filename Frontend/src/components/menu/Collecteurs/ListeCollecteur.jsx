import React, { useEffect, useState } from 'react';
//date pickers
import moment from 'moment';
import { BASE_URL,BASE_URLAPI } from '../../../config';
import axios from 'axios';
import {
    Typography, 
    Space, 
    Select, 
    Row, 
    Form, 
    Drawer, 
    Col, 
    Button,
    Popover, 
    Dropdown, 
    Table, 
    Input, 
    message, 
    Image, 
    Upload, 
    Switch,
    Popconfirm, 
    DatePicker,
    Cascader,
    Divider,
    notification
} from 'antd';
import {
    IdcardOutlined ,
    EnvironmentOutlined ,
    CalendarOutlined,
    MailOutlined,
    UserOutlined, 
    InfoCircleOutlined,
    UploadOutlined,
    PlusOutlined, 
    DownOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    MoreOutlined } from '@ant-design/icons'; // N'oubliez pas d'importer l'icône
const { Title, Text } = Typography;

const ListeCollecteur = () => {
    const { Search } = Input;
    const [showIdColumn, setShowIdColumn] = useState(false);
     // Loading tableau
     const [loading, setLoading] = useState(false);
     // État pour la recherche
     const [searchText, setSearchText] = useState('');

    const colonnes = [
        {
            title: 'numeroIdentification',
            dataIndex: 'numeroIdentification',
            key: 'numeroIdentification',
        },
        {
            title: 'nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'prenom',
            dataIndex: 'prenom',
            key: 'prenom',
        },        
        {
            title: 'stockCollecteur',
            dataIndex: 'stockCollecteur',
            key: 'stockCollecteur',
        },
        {
            title: 'Action',
            key: 'operation2',
            render: (text, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: '3',
                                label: (
                                    <span><InfoCircleOutlined />  Details</span>
                                ),
                                onClick:() => {
                                    showDrawerDetails(record);
                                    
                                }
                            },
                            {
                                key: '1',
                                label: (
                                    <span><EditOutlined />  Modifier</span>
                                ),
                                onClick:() => {
                                    showDrawer();
                                    setLoadingdrawer(true);
                                    // const selectedPath = findSelectedPath(record.communeId, options);
                                    const selectedPath = findSelectedPath(record.communeId, options);

                                    form.setFieldsValue({
                                        
                                        id: record.id,
                                        numeroIdentification: record.numeroIdentification,
                                        nom: record.nom,
                                        prenom: record.prenom,
                                        adresse: record.adresse,
                                        sexe: record.sexe,
                                        cin: record.cin,
                                        dateCin: moment(record.dateCin), // Utilisez moment pour DatePicker
                                        // dateCin: new Date(record.dateCin).toLocaleDateString(), // Format date
                                        lieuCin: record.lieuCin,
                                        lieuOctroit: record.lieuOctroit,
                                        dateOctroit: moment(record.dateOctroit),
                                        // dateOctroit: new Date(record.dateOctroit).toLocaleDateString(), // Format date
                                        validateAnnee: record.validateAnnee,
                                        stockCollecteur: record.stockCollecteur,
                                        communeId: selectedPath,
                                    });
                                    setFileList(record.photo ? [{ uid: record.id, url: `${BASE_URL}${record.photo}` }] : []);
                                    setFileList2(record.attestation ? [{ uid: record.id, url: `${BASE_URL}${record.attestation}` }] : []);
                                    setLoadingdrawer(false);
                                }
                            },
                            {
                                key: '2',
                                label:  (
                                    <Popconfirm
                                        placement="topRight"
                                        title={`Voulez-vous vraiment supprimer cet orpailleur ?`}                                 
                                        description={
                                            <p>
                                                Vous êtes sur le point de supprimer le collecteur : <strong>{record.nom} {record.prenom}</strong>. <br />
                                                <span>Cette action est irréversible.</span>
                                            </p>
                                        }
                                        onConfirm={() => supressionCollecteur(record.id)}
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
    const [dataO, setDataO] = useState([]);
    const actualisetableauCollecteur = () => {
        setLoading(true); 
        axios
            .get(`${BASE_URLAPI}/listeCollecteur`)
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    key: index,
                    id: item.id,
                    numeroIdentification: item.numeroIdentification,
                    nom: item.nom,
                    prenom: item.prenom,
                    adresse: item.adresse,
                    sexe: item.sexe,
                    cin: item.cin,
                    dateCin: formatDateToMoment(item.dateCin), // Format date
                    lieuCin: item.lieuCin,
                    lieuOctroit: item.lieuOctroit,
                    dateOctroit: formatDateToMoment(item.dateOctroit), // Format date
                    validateAnnee: item.validateAnnee,
                    photo: item.photo, // Chemin de l'image
                    attestation: item.attestation, // Chemin de l'image
                    stockCollecteur: item.stockCollecteur,
                    communeId: item.communeId,
                }));
                setDataO(formattedData);
                setLoading(false); 
            })
            .catch((err) => {
                console.log('Erreur:', err);
                setLoading(false); 
            })
    }
    const handleSearch = (value) => {
        setSearchText(value);
    };
     // Loading tableauE
     const [loadingE, setLoadingE] = useState(false);
    const [dataregistreOrp, setDataregistreOrp] = useState([]);
    const actualisetableauOrpaillerExport = (collecteurId) => {
        setLoadingE(true);
        axios
            .get(`${BASE_URLAPI}/listeRegistreorpailleur/${collecteurId}`)
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    key: index,
                    id: item.id,
                    quantite: item.quantite,
                    prix: item.prix,
                    date: formatDateToMoment2(item.date),
                    orpailleurId: item.orpailleurId,
                    collecteurId: item.collecteurId,
                    agenceId: item.agenceId,
                    orpailleurNom: item.orpailleur.nom +' '+ item.orpailleur.prenom,
                    
                }));
                setDataregistreOrp(formattedData);
                setLoadingE(false);
            })
            .catch((err) => {
                console.log('Erreur:', err);
                setLoadingE(false);
            });
    }

    // Fonction de filtrage des données
    const filteredData = dataO.filter((item) =>
        item.nom.toLowerCase().includes(searchText.toLowerCase()) ||
        item.prenom.toLowerCase().includes(searchText.toLowerCase())
    );
    useEffect(() => {
        actualisetableauCollecteur();
        fetchData();
        fetchDataOrp();
        fetchDataAgence();
    }, []);

    // suptression collecteur 
    const supressionCollecteur = (id) =>{
        setLoading(true);
        const key = 'supression';
        message.loading({ content: 'Suppression en cours...', key });
        axios
            .post(`${BASE_URLAPI}/supressionCollecteur/${id}`, {})
            .then((response) => {
                if (response.status === 202) {
                    message.success({ content: 'collecteur supprimé avec succès', key });
                    actualisetableauCollecteur();
                } else {
                    message.error({ content: 'collecteur introuvable !', key });
                }
            })
            .catch((error) => {
                message.error({ content: 'Veuillez vérifier dans les détails ou dans les transactions s’il a déjà effectué des opérations !', key ,duration: 9});
                actualisetableauCollecteur();
            });

    };
    // Fonction pour extraire les 10 premiers caractères (yyyy-MM-dd) et convertir en moment
    const formatDateToMoment = (dateString) => {
        const datePart = dateString.substring(0, 10); // Prendre les 10 premiers caractères
        return moment(datePart, 'YYYY-MM-DD'); // Convertir la chaîne de date en objet moment
    };
    // Fonction pour extraire les 10 premiers caractères (yyyy-MM-dd) et convertir en moment
    const formatDateToMoment2 = (dateString) => {
        const datePart = dateString.substring(0, 10); // Prendre les 10 premiers caractères
        return datePart; // Convertir la chaîne de date en objet moment
    };
    //Details
    const [formProd] = Form.useForm();
    const [formregistreopra] = Form.useForm();
    const [formProdModifier] = Form.useForm();

    const colonnesDetails = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'quantite',
            dataIndex: 'quantite',
            key: 'quantite',
        },
        {
            title: 'prix',
            dataIndex: 'prix',
            key: 'prix',
        },
        {
            title: 'orpailleurNom',
            dataIndex: 'orpailleurNom',
            key: 'orpailleurNom',
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
                                onClick:() => {
                                    setLoadingdrawer(true);
                                    // const selectedPath = findSelectedPath(record.communeId, options);
                                    
                                    showDrawerDetailsModifier();
                                    formProdModifier.setFieldsValue({
                                        
                                        id: record.id,
                                        quantite: record.quantite,
                                        prix: record.prix,
                                        orpailleurId: record.orpailleurId,
                                        collecteurId: record.collecteurId,
                                        agenceId: record.agenceId,
                                        date: formatDateToMoment(record.date),
                                    });
                                    setLoadingdrawer(false);
                                }
                            },
                            {
                                key: '2',
                                label:  (
                                    <Popconfirm
                                        placement="topRight"
                                        title={`Voulez-vous vraiment supprimer cette Transaction ?`}
                                        description={
                                            <p>
                                            Vous êtes sur le point de supprimer une transaction du <strong>{record.date}</strong>. <br />
                                            <span>Cette action est irréversible.</span>
                                            </p>
                                        }
                                        onConfirm={() => supressionProducton(record.id)}
                                        okText="Oui"
                                        cancelText="Non"
                                        >
                                        <span><DeleteOutlined /> Supprimer</span>
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
    const [openDetails, setOpenDetails] = useState(false);
    const [openDetails1, setOpenDetails1] = useState(false);
    const [openDetailsModifier, setOpenDetailsModifier] = useState(false);
    const [selectedOrpailleur, setSelectedOrpailleur] = useState(null);
    const [selectedCollecteur, setSelectedCollecteur] = useState(null);
    
    const onCloseDetails = () => {
        setOpenDetails(false);
        form.resetFields(); // Reset form fields when closing
    };
    const onCloseDetails1 = () => {
        setOpenDetails1(false);
        form.resetFields(); // Reset form fields when closing
    };
    const onCloseDetailsModifier = () => {
        setOpenDetailsModifier(false);
        formProdModifier.resetFields(); // Reset form fields when closing
    };
    //details drawers
    const showDrawerDetails = (record) => {
        actualisetableauOrpaillerExport(record.id)
        setLoadingdrawer(true);
        setOpenDetails(true);
        setSelectedOrpailleur(record);
        setSelectedCollecteur(record);
        setLoadingdrawer(false);
    };
    //ajout produit drawers
    const showDrawerDetails1 = () => {
        // formProd.setFieldsValue({
        //     orpailleurId: selectedOrpailleur.id,
        // })
        formregistreopra.setFieldsValue({
            collecteurId: selectedCollecteur.id,
        })
        setOpenDetails1(true);
    };
    //modifier drawer produit
    const showDrawerDetailsModifier = () => {
        formProdModifier.setFieldsValue({
            orpailleurId: selectedOrpailleur.id,
        })
        setOpenDetailsModifier(true);
    };
    const formatCin = (cin) => {
        if (!cin) return '';
        // Utiliser une expression régulière pour ajouter des espaces tous les 3 chiffres
        return cin.replace(/(.{3})(?=.)/g, '$1 ');
    };
    // suptression produits 
    const supressionProducton = (id) =>{
        setLoadingE(true);
        const key = 'supression';
        message.loading({ content: 'Suppression en cours...', key });
        axios
            .post(`${BASE_URLAPI}/supressionRegistreorpailleur/${id}`, {})
            .then((response) => {
                if (response.status === 202) {
                    message.success({ content: 'Transaction supprimé avec succès', key });
                    actualisetableauOrpaillerExport(selectedCollecteur.id);
                } else {
                    message.error({ content: 'Transaction introuvable !', key });
                }
            })
            .catch((error) => {
                message.error({ content: 'Erreur L\'or de la supresion', key ,duration: 9});
                actualisetableauOrpaillerExport(selectedOrpailleur.id);
            });

    };
    //modification
    const [loadingdrawer, setLoadingdrawer] = useState(true);

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false); 
    const onClose = () => {
        setOpen(false);
        form.resetFields(); // Reset form fields when closing
    };
    const showDrawer = () => {
        setOpen(true);
    }; 
        
    const onFinish = (values) => {
        if (fileList.length === 0) {
            message.error('Veuillez uploader une photo.');
            return;
        }
        if (fileList2.length === 0) {
            message.error('Veuillez uploader une Attestation.');
            return;
        }
        const keyM = 'modification';
    
        // Afficher le message de chargement
        message.loading({ content: 'Modification en cours...', key: keyM, duration: 0 });
    
        // Créer un FormData pour les données du formulaire
        const formData = new FormData();
            formData.set('numeroIdentification', values.numeroIdentification);
            formData.set('nom', values.nom);
            formData.set('prenom', values.prenom);
            formData.set('adresse', values.adresse);
            formData.set('sexe', values.sexe);
            const dateCinFormatted = values.dateCin ? values.dateCin.format('YYYY-MM-DD') : null;
            formData.set('cin', values.cin);
            formData.set('dateCin', dateCinFormatted);
            formData.set('lieuCin', values.lieuCin);
            const dateOctroitFormatted = values.dateOctroit ? values.dateOctroit.format('YYYY-MM-DD') : null;
            formData.set('lieuOctroit', values.lieuOctroit);
            formData.set('dateOctroit', dateOctroitFormatted);
            formData.set('validateAnnee', values.validateAnnee);
            // Ajouter l'image si elle est présente

            if (fileList.length > 0) {
                formData.set('file', fileList[0].originFileObj);
            }
            if (fileList2.length > 0) {
                formData.set('file2', fileList2[0].originFileObj);
            }
            formData.set('stockCollecteur', values.stockCollecteur);
            formData.set('communeId', values.communeId[values.communeId.length - 1]);
              
    
        const url = `${BASE_URLAPI}/modifieCollecteur/${values.id}`;
    
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            // Vérifie si la réponse contient le message de succès
            if (response.data.success) {
                // Afficher un message de succès et fermer le drawer
                message.success({
                    content: response.data.message, 
                    key: keyM 
                });
                onClose();
                actualisetableauCollecteur();
            } else {
                // Afficher un message d'erreur si la réponse indique un échec
                message.error({
                    content: response.data.message || 'Erreur lors de la mise à jour !', 
                    key: keyM
                });
            }
        })
        .catch((error) => {
            // Afficher un message d'erreur
            console.error('Erreur lors de la mise à jour:', error);
            message.error({ content: 'Erreur lors de la mise à jour !', key: keyM });
        });
    };
    //cascade
    const [options, setOptions] = useState([]);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URLAPI}/locations`);
            setOptions(response.data);
            setLoading(false);
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
          setLoading(false);
        }
    };
    //cascade
    const [optionsOrp, setOptionsOrp] = useState([]);

    const fetchDataOrp = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URLAPI}/listeOrpailleurIdnom`);
            setOptionsOrp(response.data);
            setLoading(false);
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
          setLoading(false);
        }
    };
    //cascade
    const [optionsAgence, setOptionsAgence] = useState([]);

    const fetchDataAgence = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URLAPI}/listeAgence`);
            setOptionsAgence(response.data);
            setLoading(false);
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
          setLoading(false);
        }
    };
    const findSelectedPath = (communeId, options) => {
        for (const option of options) {
            if (option.value === communeId) {
                return [option.value]; // Retourne uniquement l'ID de la commune
            } else if (option.children) {
                const path = findSelectedPath(communeId, option.children);
                if (path.length > 0) {
                    return [option.value, ...path]; // Ajoute les IDs des niveaux supérieurs
                }
            }
        }
        return [];
    };
    
    

    //Upload image 
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const normFile2 = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList2;
    };

    //modification
    const handlemodifprodFinish = async (values) => {
        const keyM = 'modificationProduction';
        
        // Afficher le message de chargement
        
        const formDataRoM = new FormData();
        formDataRoM.set('quantite', values.quantite);
        formDataRoM.set('prix', values.prix);
        const dateProductionFormatted = values.date ? values.date.format('YYYY-MM-DD') : null;
        formDataRoM.set('date', dateProductionFormatted); 
        formDataRoM.set('orpailleurId', values.orpailleurId);
        formDataRoM.set('collecteurId', values.collecteurId);
        formDataRoM.set('agenceId', values.agenceId);
        console.log(values.id)
        message.loading({ content: 'Modification de la Transaction en cours ...', key: keyM, duration: 0 });
        try {
            axios.post(`${BASE_URLAPI}/modifieRegistreorpailleur/${values.id}`,formDataRoM );
            message.success({ content: 'Modiofication de la Transaction Reussi', key: keyM});
            
            actualisetableauOrpaillerExport(values.collecteurId);
            formProdModifier.resetFields();
            onCloseDetailsModifier(); // Fermer le Drawer après l'ajout
        } catch (error) {
            message.error({ content: 'Modification de la Transaque n\a pas ete abouti', key: keyM});
            
            notification.error({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de l\'ajout de la production.',
            });
        }
    }
    //ajout production
    const handleajoutregistreorpailleurFinish = async (values) => {
        const keyM = 'ajoutprodui';
    
        // Afficher le message de chargement
        
        const formDataRo = new FormData();
        formDataRo.set('quantite', values.quantite);
        formDataRo.set('prix', values.prix);
        const dateProductionFormatted = values.date ? values.date.format('YYYY-MM-DD') : null;
        formDataRo.set('date', dateProductionFormatted); 
        formDataRo.set('orpailleurId', values.orpailleurId[0]);
        formDataRo.set('collecteurId', values.collecteurId);
        formDataRo.set('agenceId', values.agenceId);
        message.loading({ content: 'Transacrion du collecteur vers orpailleur en cours ...', key: keyM, duration: 0 });
        try {
            axios.post(`${BASE_URLAPI}/ajoutRegistreorpailleur`,formDataRo )
            .then((response) => {
                if (response.data.success) {
                    
                    message.success({ content: response.data.message, key: keyM });
                    actualisetableauOrpaillerExport(values.collecteurId);
                    actualisetableauCollecteur();
                    formregistreopra.resetFields();
                    onCloseDetails1(); // Fermer le Drawer après l'ajout
                } else {
                    message.error({ content: response.data.message, key: keyM });
                    
                }
            })
            .catch((error) => {
                console.error('Erreur lors de la mise à jour:', error);
                const errorMessage = error.response?.data?.message || 'Échec de la transaction';
                message.error({ content: errorMessage, key: keyM });
                
            })

        } catch (error) {
            message.error({ content: 'Echeque De la transaction', key: keyM});
    
            notification.error({
                message: 'Erreur',
                description: 'Une erreur est survenue lors du Transaction.',
            });
        }
    }
    
  return (
    <div>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Listes Des Collecteurs</h1>
        <Search
                placeholder="Rechercher Orpailleurs"
                allowClear
                onSearch={handleSearch}
                style={{ width: 200, marginBottom: 20 }}
        />
        <Table pagination={{ pageSize: 6 }} columns={colonnes} dataSource={filteredData}   size='small' loading={loading}/>  {/*loading={loading}*/}
        <Drawer
                title="Modifier un Collecteur"
                width={720}
                onClose={onClose}
                open={open}
                loading={loadingdrawer}
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
                            <Form.Item
                                label="id"
                                name="id"
                                style={{display: 'none'}}
                            >
                                <Input placeholder="Adresse Email" />
                            </Form.Item>
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
                            rules={[
                                { 
                                  required: true, 
                                  message: 'Veuillez entrer le CIN' 
                                },
                                {
                                  pattern: /^\d{12}$/, // Regex pour 12 chiffres
                                  message: 'Le CIN doit contenir exactement 12 chiffres',
                                }
                              ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Date de délivrance du CIN"
                            name="dateCin"
                            rules={[
                                { 
                                  required: true, 
                                  message: 'Veuillez sélectionner la date de délivrance' 
                                },
                                {
                                  validator: (_, value) => {
                                    if (value && value.isAfter()) {
                                      return Promise.reject(new Error('La date de délivrance du CIN ne peut pas être dans le futur'));
                                    }
                                    return Promise.resolve();
                                  },
                                }
                              ]}
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
                            rules={[
                                { 
                                  required: true, 
                                  message: 'Veuillez sélectionner la date d\'octroi' 
                                },
                                {
                                  validator: (_, value) => {
                                    if (value && value.isAfter()) {
                                      return Promise.reject(new Error('La date d\'octroi ne peut pas être dans le futur'));
                                    }
                                    return Promise.resolve();
                                  },
                                }
                              ]}
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
                <Col span={5}>
                    <Form.Item
                        label="Photo"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'Veuillez télécharger une photo' }]}
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
                <Col span={5}>
                    <Form.Item
                        label="Attestation"
                        valuePropName="fileList2"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'Veuillez télécharger une photo' }]}
                    >
                        <Upload
                            listType='picture-card'
                            maxCount={1}
                            beforeUpload={() => false}
                            fileList={fileList2}
                            onChange={({ fileList }) => setFileList2(fileList)}
                            >
                            {fileList2.length < 1 && (
                                <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                
                </Col>
                <Col span={14}>
                    <Form.Item
                        label="Stock Collecteur"
                        name="stockCollecteur"
                        rules={[{ required: true, message: 'Veuillez entrer le stock du Collecteur' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                
                    <Form.Item
                        label="Commune ID"
                        name="communeId"
                        rules={[{ required: true, message: 'Veuillez entrer l\'ID de la commune' }]}
                    >
                        <Cascader
                            options={options}
                            placeholder="Veuillez sélectionner une commune"
                            showSearch={{
                                filter: (inputValue, path) =>
                                path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())),
                            }}
                        />
                    </Form.Item>
                </Col>
                </Row>
            </Form>
        </Drawer>
        <Drawer
            width={720}
            onClose={onCloseDetails}
            open={openDetails}
            title="Détails du Collecteur"
            extra={
                <Popover placement="left" content="Ajout transaction avec Orpailleur">
                    <Button type="primary" onClick={showDrawerDetails1} icon={<PlusOutlined />}></Button>
                </Popover>
            }
            loading={loadingdrawer}
        >
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={9} style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ marginRight: 8 }} />
                    <Text strong> Numéro :</Text>
                    <Text style={{ marginLeft: 8 }}>
                        {selectedCollecteur && selectedCollecteur.numeroIdentification ? selectedCollecteur.numeroIdentification : ''}
                    </Text>
                </Col>
                <Col span={15} style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    <Text strong> Nom Complet :</Text>
                    <Text style={{ marginLeft: 8 }}>
                        {selectedCollecteur && selectedCollecteur.nom && selectedCollecteur.prenom
                            ? `${selectedCollecteur.nom} ${selectedCollecteur.prenom}`
                            : 'Nom complet non disponible'}
                    </Text>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={9} style={{ display: 'flex', alignItems: 'center' }}>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    <Text strong> Adresse :</Text>
                    <Text style={{ marginLeft: 8 }}>
                        {selectedCollecteur && selectedCollecteur.adresse ? selectedCollecteur.adresse : ''}
                    </Text>
                </Col>
                <Col span={15} style={{ display: 'flex', alignItems: 'center' }}>
                    <IdcardOutlined style={{ marginRight: 8 }} />
                    <Text strong> CIN :</Text>
                    <Text style={{ marginLeft: 8 }}>
                        {selectedCollecteur && selectedCollecteur.cin ? formatCin(selectedCollecteur.cin) : ''}
                    </Text>
                </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={16}>
                <Col span={24}>
                    <h3 style={{ marginBottom: 8 }}>Tableaux De Production</h3>
                    <Table loading={loadingE} pagination={{ pageSize: 4 }} columns={colonnesDetails} dataSource={dataregistreOrp}/>
                </Col>
            </Row>
            {/* Ajout Drawers */}
            <Drawer
                title="Ajout Transaction Avec Orpailleur"
                width={500}
                onClose={onCloseDetails1}
                open={openDetails1}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={onCloseDetails1} style={{ marginRight: 8 }}>
                            Annuler
                        </Button>
                        <Button type="primary" onClick={() => formregistreopra.submit()}>
                            Ajouter
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form
                        form={formregistreopra}
                        layout="vertical"
                        onFinish={handleajoutregistreorpailleurFinish}
                        style={{ width: '100%', maxWidth: 400 }} // Ajuste la largeur du formulaire
                    >
                        <Form.Item
                            name="quantite"
                            label="Quantité"
                            rules={[{ required: true, message: 'Veuillez entrer la quantité!' }]}
                        >
                            <Input type="number" placeholder="Quantité" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="prix"
                            label="Prix"
                            rules={[{ required: true, message: 'Veuillez entrer le Prix!' }]}
                        >
                            <Input type="number" placeholder="Prix" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="date"
                            label="Date du Transaction"
                            rules={[{ required: true, message: 'Veuillez entrer la date du Transaction !' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Orpailleur"
                            name="orpailleurId"
                            rules={[{ required: true, message: 'Veuillez entrer l\'Orpailleur' }]}
                        >
                            <Cascader
                                options={optionsOrp}
                                placeholder="Veuillez sélectionner une orpailleur"
                                showSearch={{
                                    filter: (inputValue, path) =>
                                    path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())),
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Agence"
                            name="agenceId"
                            rules={[{ required: true, message: 'Veuillez entrer l\'Agence' }]}
                        >
                            <Cascader
                                options={optionsAgence}
                                placeholder="Veuillez sélectionner une agence"
                                showSearch={{
                                    filter: (inputValue, path) =>
                                    path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())),
                                }}
                            />
                        </Form.Item>
                        {/* ID Collecteur caché */}
                        <Form.Item name="collecteurId" noStyle >
                            <Input type='hidden'/>
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
            {/* modification drawers */}
            <Drawer
                title="Modification Transaction"
                width={500}
                onClose={onCloseDetailsModifier}
                open={openDetailsModifier}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={onCloseDetailsModifier} style={{ marginRight: 8 }}>
                            Annuler
                        </Button>
                        <Button type="primary" onClick={() => formProdModifier.submit()}>
                            Modifier
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form
                        form={formProdModifier}
                        layout="vertical"
                        onFinish={handlemodifprodFinish}
                        style={{ width: '100%', maxWidth: 400 }} // Ajuste la largeur du formulaire
                    >
                        <Form.Item
                            name="quantite"
                            label="Quantité"
                            rules={[{ required: true, message: 'Veuillez entrer la quantité!' }]}
                        >
                            <Input type="number" placeholder="Quantité" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="prix"
                            label="Prix"
                            rules={[{ required: true, message: 'Veuillez entrer le Prix!' }]}
                        >
                            <Input type="number" placeholder="Prix" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="date"
                            label="Date du Transaction"
                            rules={[{ required: true, message: 'Veuillez entrer la date du Transaction !' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Orpailleur"
                            name="orpailleurId"
                            rules={[{ required: true, message: 'Veuillez entrer l\'Orpailleur' }]}
                        >
                            <Cascader
                                options={optionsOrp}
                                placeholder="Veuillez sélectionner une orpailleur"
                                showSearch={{
                                    filter: (inputValue, path) =>
                                    path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())),
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Agence"
                            name="agenceId"
                            rules={[{ required: true, message: 'Veuillez entrer l\'Agence' }]}
                        >
                            <Cascader
                                options={optionsAgence}
                                placeholder="Veuillez sélectionner une agence"
                                showSearch={{
                                    filter: (inputValue, path) =>
                                    path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())),
                                }}
                            />
                        </Form.Item>
                        {/* ID Collecteur caché */}
                        <Form.Item name="collecteurId" noStyle >
                            <Input type='hidden'/>
                        </Form.Item>
                        <Form.Item name="id" noStyle >
                            <Input type='hidden' />
                        </Form.Item>
                    </Form>
                </div>
            </Drawer>
        </Drawer>

    </div>
  )
}

export default ListeCollecteur