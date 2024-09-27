import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
//date pickers
import moment from 'moment';
import { BASE_URL,BASE_URLAPI, BASE_URLImg } from '../../../config';
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
    notification,
    Modal,
    Card,
    QRCode
} from 'antd';
import {
    PrinterOutlined,
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
import CarteOrpailleurs from './CarteOrpailleurs';
const { Title, Text } = Typography;

const ListeOrpailleurs = () => {
    //impresion
    const printModalContent = () => {
        const qrcode = document.getElementById("Qrcode");
        html2canvas(qrcode, { logging: true, letterRendering: 1 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const printWindow = window.open();
        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>Impression Orpailleur</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1 {
                        text-align: center;
                    }
                    .content {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .row {
                        display: flex;
                        gap: 16px;
                    }
                    .col {
                        flex: 4;
                        padding: 10px;
                        align-content: center;
                    }
                    .colimg {
                        flex: 1;
                        padding: 10px;
                    }
                    .image {
                        width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border: 2px solid #f0f0f0;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .placeholder {
                        width: 100%;
                        height: 150px;
                        background-color: #eee;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <h1>Carte Orpailleur</h1>
                    <div class="row">
                        <div class="colimg">
                            <img 
                                src="${BASE_URL}${selectedOrpailleur.photo}" 
                                class="image" 
                                onerror="this.style.display='none';" 
                            />
                        </div>
                        <div class="col">
                            <strong>Numéro :</strong>
                            <span>${selectedOrpailleur.numeroIdentification || ''}</span>
                            <br />
                            <br />
                            <strong>Nom Complet :</strong>
                            <span>${selectedOrpailleur.nom} ${selectedOrpailleur.prenom || 'Nom complet non disponible'}</span>
                            <br />
                            <br />
                            <strong>CIN :</strong>
                            <span>${formatCin(selectedOrpailleur.cin) || ''}</span>
                        </div>
                        <div class="colimg">
                            <img 
                                src="${imgData}" 
                                class="image" 
                                onerror="this.style.display='none';" 
                            />
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
            
        });
        
        
        setOpenModale(false);
    };
    
    const generatePdf = () => {
        const modalContent = document.getElementById("modal-content");
    
        // Fonction pour charger toutes les images dans le modal
        const loadImages = () => {
            const images = modalContent.getElementsByTagName('img');
            const promises = [];
    
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const promise = new Promise((resolve, reject) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = () => resolve();
                        img.onerror = () => reject(new Error("L'image n'a pas pu être chargée."));
                    }
                });
                promises.push(promise);
            }
    
            return Promise.all(promises);
        };
    
        // Charger toutes les images et capturer le contenu une fois les images chargées
        loadImages()
            .then(() => {
                html2canvas(modalContent, { logging: true, letterRendering: 1 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    
                    // Créer un nouveau PDF
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'px',
                        format: 'a4'
                    });
    
                    // Ajouter l'image capturée dans le PDF
                    pdf.addImage(imgData, 'PNG', 10, 10, 100, 50); // Ajuster les dimensions selon ton besoin
    
                    // Sauvegarder le PDF
                    pdf.save('orpailleur.pdf');
    
                    setOpenModale(false);
                });
            })
            .catch((error) => {
                console.error(error.message);
            });
    };
    
    
    
    
    //fin impression
    const { Search } = Input;
    const [showIdColumn, setShowIdColumn] = useState(false);
    const [onloadmodal, setOnloadmodal] = useState(false);
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
            title: 'stockOrpailleur',
            dataIndex: 'stockOrpailleur',
            key: 'stockOrpailleur',
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
                                key: '4',
                                label: (
                                    <span><PrinterOutlined />  Imprimer</span>
                                ),
                                onClick:() => {
                                    setOnloadmodal(true)
                                    showModalecarte(record);

                                    
                                    // setFileList(record.photo ? [{ uid: record.id, url: `${BASE_URL}${record.photo}` }] : []);
                                    // setOnloadmodal(false)
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
                                        stockOrpailleur: record.stockOrpailleur,
                                        communeId: selectedPath,
                                    });
                                    setFileList(record.photo ? [{ uid: record.id, url: `${BASE_URL}${record.photo}` }] : []);
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
                                                Vous êtes sur le point de supprimer l'orpailleur <strong>{record.nom} {record.prenom}</strong>. <br />
                                                <span>Cette action est irréversible.</span>
                                            </p>
                                        }
                                        onConfirm={() => supressionOrpailleur(record.id)}
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
    const actualisetableauOrpailler = () => {
        setLoading(true); 
        
        axios
            .get(`${BASE_URLAPI}/listeOrpailleur`)
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
                    stockOrpailleur: item.stockOrpailleur,
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
    const [dataOExpor, setDataOExpor] = useState([]);
    const actualisetableauOrpaillerExport = (orpailleurId) => {
        setLoadingE(true);
        axios
            .get(`${BASE_URLAPI}/listeProduction/${orpailleurId}`)
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    key: index,
                    id: item.id,
                    quantite: item.quantite,
                    dateProduction: formatDateToMoment2(item.dateProduction),
                    orpailleurId: item.orpailleurId,
                }));
                setDataOExpor(formattedData);
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
        
        actualisetableauOrpailler();
        fetchData();
    }, []);

    // suptression orpailleur 
    const supressionOrpailleur = (id) =>{
        setLoading(true);
        const key = 'supression';
        message.loading({ content: 'Suppression en cours...', key });
        axios
            .post(`${BASE_URLAPI}/supressionOrpailleur/${id}`, {})
            .then((response) => {
                if (response.status === 202) {
                    message.success({ content: 'Orpailleur supprimé avec succès', key });
                    actualisetableauOrpailler();
                } else {
                    message.error({ content: 'Orpailleur introuvable !', key });
                }
            })
            .catch((error) => {
                message.error({ content: 'Toutes les productions de cet orpailleur doivent être supprimées. Veuillez vérifier dans les détails ou dans les transactions s’il a déjà effectué des opérations !', key ,duration: 9});
                actualisetableauOrpailler();
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
    const [formProdModifier] = Form.useForm();

    const colonnesDetails = [
        {
            title: 'Date',
            dataIndex: 'dateProduction',
            key: 'dateProduction',
        },
        {
            title: 'quantite',
            dataIndex: 'quantite',
            key: 'quantite',
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
                                        dateProduction: formatDateToMoment(record.dateProduction),
                                    });
                                    setLoadingdrawer(false);
                                }
                            },
                            {
                                key: '2',
                                label:  (
                                    <Popconfirm
                                        placement="topRight"
                                        title={`Voulez-vous vraiment supprimer cette production ?`}
                                        description={
                                            <p>
                                            Vous êtes sur le point de supprimer une production de <strong>{record.dateProduction} {record.id}</strong>. <br />
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
        setLoadingdrawer(false);
    };
    //details drawers
    const showModalecarte = (record) => {
        // actualisetableauOrpaillerExport(record.id)
        // setLoadingdrawer(true);
        setOpenModale(true);

        setTimeout(() => {
            setSelectedOrpailleur(record);
        }, 1000);
        const image = new window.Image(); // Utilise `window.Image` pour éviter le conflit

        image.src = record.photo ? `${BASE_URL}${record.photo}` : '';

        // Créer une promesse qui se résout lorsque l'image est chargée
        const imageLoadPromise = new Promise((resolve) => {
            image.onload = () => resolve(true);
            image.onerror = () => resolve(false);
        });

        // Attendre que l'image soit chargée avant de mettre à jour l'état
        imageLoadPromise
            .then(() => {
                setFileList(record.photo ? [{ uid: record.id, url: image.src }] : []);
            })
            .catch(() => {
                setFileList([]); // Ou gérer une erreur comme tu le souhaites
            })
            .finally(() => {
                setOnloadmodal(false);
            });
        // setLoadingdrawer(false);
    };
    //ajout produit drawers
    const showDrawerDetails1 = () => {
        formProd.setFieldsValue({
            orpailleurId: selectedOrpailleur.id,
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
            .post(`${BASE_URLAPI}/supressionProduction/${id}`, {})
            .then((response) => {
                if (response.status === 202) {
                    message.success({ content: 'Production supprimé avec succès', key });
                    actualisetableauOrpaillerExport(selectedOrpailleur.id);
                    actualisetableauOrpailler();
                } else {
                    message.error({ content: 'Production introuvable !', key });
                }
            })
            .catch((error) => {
                message.error({ content: 'Erreur L\'or de la supresion', key ,duration: 9});
                actualisetableauOrpaillerExport(selectedOrpailleur.id);
            });

    };
    //modalle
    const [openModale, setOpenModale] = useState(false); 
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
            formData.set('stockOrpailleur', values.stockOrpailleur);
            formData.set('communeId', values.communeId[values.communeId.length - 1]);
              
    
        const url = `${BASE_URLAPI}/modifieOrpailleur/${values.id}`;
    
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
                actualisetableauOrpailler();
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
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    //modification
    const handlemodifprodFinish = async (values) => {
        const keyM = 'modificationProduction';
        
        // Afficher le message de chargement
        
        const formDataPM = new FormData();
        formDataPM.set('quantite', values.quantite);
        const dateProductionFormatted = values.dateProduction ? values.dateProduction.format('YYYY-MM-DD') : null;
        formDataPM.set('dateProduction', dateProductionFormatted); 
        formDataPM.set('orpailleurId', values.orpailleurId);
        message.loading({ content: 'Modification de la Production en cours ...', key: keyM, duration: 0 });
        try {
            const response = await axios.post(`${BASE_URLAPI}/modifieProduction/${values.id}`,formDataPM );
            message.success({ content: 'Modiofication de la Production Reussi', key: keyM});
            
            actualisetableauOrpaillerExport(values.orpailleurId);
            actualisetableauOrpailler();
            formProdModifier.resetFields();
            onCloseDetailsModifier(); // Fermer le Drawer après l'ajout
        } catch (error) {
            message.erreur({ content: 'Modification de la Production echeque', key: keyM});
            
            notification.error({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de l\'ajout de la production.',
            });
        }
    }
    //ajout production
    const handleajoutprodFinish = async (values) => {
        const keyM = 'ajoutprodui';
    
        // Afficher le message de chargement
        
        const formDataP = new FormData();
        formDataP.set('quantite', values.quantite);
        const dateProductionFormatted = values.dateProduction ? values.dateProduction.format('YYYY-MM-DD') : null;
        formDataP.set('dateProduction', dateProductionFormatted); 
        formDataP.set('orpailleurId', values.orpailleurId);
        message.loading({ content: 'Ajout de la Production en cours ...', key: keyM, duration: 0 });
        try {
            const response = await axios.post(`${BASE_URLAPI}/ajoutProduction`,formDataP );
            message.success({ content: 'ajout de la Production Reussi', key: keyM});

            actualisetableauOrpaillerExport(values.orpailleurId);
            actualisetableauOrpailler();
            formProd.resetFields();
            onCloseDetails1(); // Fermer le Drawer après l'ajout
        } catch (error) {
            message.erreur({ content: 'ajout de la Production echeque', key: keyM});
    
            notification.error({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de l\'ajout de la production.',
            });
        }
    }
    
  return (
    <div>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Listes Des Orpailleurs</h1>
        <Search
                placeholder="Rechercher Orpailleurs"
                allowClear
                onSearch={handleSearch}
                style={{ width: 200, marginBottom: 20 }}
        />
        <Table pagination={{ pageSize: 6 }} columns={colonnes} dataSource={filteredData}   size='small' loading={loading}/>  {/*loading={loading}*/}
        <Drawer
                title="Modifier un Orpailleur"
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
                <Col span={19}>
                    <Form.Item
                        label="Stock Orpailleur"
                        name="stockOrpailleur"
                        rules={[{ required: true, message: 'Veuillez entrer le stock d\'orpailleur' }]}
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
            title="Détails de l'Orpailleur"
            extra={
                <Popover placement="left" content="Ajout Production">
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
                        {selectedOrpailleur && selectedOrpailleur.numeroIdentification ? selectedOrpailleur.numeroIdentification : ''}
                    </Text>
                </Col>
                <Col span={15} style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    <Text strong> Nom Complet :</Text>
                    <Text style={{ marginLeft: 8 }}>
                        {selectedOrpailleur && selectedOrpailleur.nom && selectedOrpailleur.prenom
                            ? `${selectedOrpailleur.nom} ${selectedOrpailleur.prenom}`
                            : 'Nom complet non disponible'}
                    </Text>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={14} style={{ display: 'flex', alignItems: 'center' }}>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    <Text strong> Adresse :</Text>
                    <Text style={{ marginLeft: 8 }}>
                        {selectedOrpailleur && selectedOrpailleur.adresse ? selectedOrpailleur.adresse : ''}
                    </Text>
                </Col>
                <Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
                    <IdcardOutlined style={{ marginRight: 8 }} />
                    <Text strong> CIN :</Text>
                    <Text style={{ marginLeft: 8 }}>
                        {selectedOrpailleur && selectedOrpailleur.cin ? formatCin(selectedOrpailleur.cin) : ''}
                    </Text>
                </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={16}>
                <Col span={24}>
                    <h3 style={{ marginBottom: 8 }}>Tableaux De Production</h3>
                    <Table loading={loadingE} pagination={{ pageSize: 4 }} columns={colonnesDetails} dataSource={dataOExpor}/>
                </Col>
            </Row>
            {/* Ajout Drawers */}
            <Drawer
                title="Ajout Production"
                width={500}
                onClose={onCloseDetails1}
                open={openDetails1}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={onCloseDetails1} style={{ marginRight: 8 }}>
                            Annuler
                        </Button>
                        <Button type="primary" onClick={() => formProd.submit()}>
                            Ajouter
                        </Button>
                    </div>
                }
            >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Form
                    form={formProd}
                    layout="vertical"
                    onFinish={handleajoutprodFinish}
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
                        name="dateProduction"
                        label="Date de Production"
                        rules={[{ required: true, message: 'Veuillez entrer la date de production!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    {/* ID orpailleur caché */}
                    <Form.Item name="orpailleurId" noStyle >
                        <Input type='hidden'/>
                    </Form.Item>
                </Form>
            </div>
            </Drawer>
            {/* modification drawers */}
            <Drawer
                title="Modification Production"
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
                        name="dateProduction"
                        label="Date de Production"
                        rules={[{ required: true, message: 'Veuillez entrer la date de production!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    {/* ID orpailleur caché */}
                    <Form.Item name="orpailleurId" noStyle >
                        <Input type='hidden'/>
                    </Form.Item>
                    <Form.Item name="id" noStyle >
                        <Input type='hidden'/>
                    </Form.Item>
                </Form>
            </div>
            </Drawer>
        </Drawer>
        <Modal
            title="Carte Orpailleur"
            centered
            open={openModale}
            onOk={() => {
                printModalContent()}
            }
            onCancel={() => {
                setOpenModale(false)}
            }
            width={700}
            style={{
                padding: 10,
            }}
            loading={onloadmodal}

        >
            <div id="modal-content">
                
                <Row gutter={16}>
                    <Col span={5}>
                        {selectedOrpailleur && selectedOrpailleur.photo  ? (
                                    <Image 
                                        src={`${BASE_URL}${selectedOrpailleur.photo}`}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: 'cover',
                                            border: '2px solid #f0f0f0',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        }} 
                                    />
                            ) : (
                                <div style={{ width: '100%', height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Photo
                            </div>
                        )}
                    </Col>
                    <Col span={15}>
                        <EditOutlined style={{ marginRight: 8 }} />
                        <Text strong> Numéro :</Text>
                        <Text style={{ marginLeft: 8 }}>
                            {selectedOrpailleur && selectedOrpailleur.numeroIdentification ? selectedOrpailleur.numeroIdentification : ''}
                            
                        </Text>
                        <br></br>
                        <UserOutlined style={{ marginRight: 8 }} />
                        <Text strong> Nom Complet :</Text>
                        <Text style={{ marginLeft: 8 }}>
                            {selectedOrpailleur && selectedOrpailleur.nom && selectedOrpailleur.prenom
                                ? `${selectedOrpailleur.nom} ${selectedOrpailleur.prenom}`
                                : 'Nom complet non disponible'}
                        </Text>
                        <br></br>
                        <IdcardOutlined style={{ marginRight: 8 }} />
                        <Text strong> CIN :</Text>
                        <Text style={{ marginLeft: 8 }}>
                            {selectedOrpailleur && selectedOrpailleur.cin ? formatCin(selectedOrpailleur.cin) : ''}
                        </Text>
                    </Col>
                    <Col span={4} id="Qrcode">
                        {selectedOrpailleur && selectedOrpailleur.photo  ? (
                                <QRCode value={`${BASE_URLImg}${selectedOrpailleur.photo}`} size={100} />
                            ) : (
                                <div style={{ width: '100%', height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Photo
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </Modal>

    </div>
  )
}

export default ListeOrpailleurs

