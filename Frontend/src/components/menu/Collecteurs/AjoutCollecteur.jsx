import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Steps, message, DatePicker, Upload, Select, Row, Col, Cascader } from 'antd';
import { PlusOutlined,InboxOutlined,UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BASE_URLAPI } from '../../../config';

const { Step } = Steps;
const { Option } = Select;
// const { Dragger } = Upload;
// const props = {
//     name: 'file',
//     multiple: false,
//     onChange(info) {
//       const { status } = info.file;
//       if (status !== 'uploading') {
//         console.log(info.file, info.fileList);
//       }
//       if (status === 'done') {
//         message.success(`${info.file.name} file uploaded successfully.`);
//       } else if (status === 'error') {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//     onDrop(e) {
//       console.log('Dropped files', e.dataTransfer.files);
//     },
//   };

const AjoutCollecteur = () => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const [formData] = useState(new FormData());
  
    const normFile = (e) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList.slice(-1); // Garde uniquement le dernier fichier
    };
    const normFile2 = (e) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList2.slice(-1); // Garde uniquement le dernier fichier
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URLAPI}/locations`);
          setOptions(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const steps = [
      {
        title: 'Informations Personnelles',
        content: (
          <>
            <Form.Item
              label="Numéro d'identification"
              name="numeroIdentification"
              rules={[{ required: true, message: 'Veuillez entrer le numéro d\'identification' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: 'Veuillez entrer le prénom' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Adresse"
              name="adresse"
              rules={[{ required: true, message: 'Veuillez entrer l\'adresse' }]}
            >
              <Input />
            </Form.Item>
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
          </>
        ),
      },
      {
        title: 'Informations sur le CIN',
        content: (
          <>
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
              <Input type='number' />
            </Form.Item>
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
            <Form.Item
              label="Lieu de délivrance du CIN"
              name="lieuCin"
              rules={[{ required: true, message: 'Veuillez entrer le lieu de délivrance du CIN' }]}
            >
              <Input />
            </Form.Item>
          </>
        ),
      },
      {
        title: 'Informations d\'Octroi',
        content: (
          <>
            <Form.Item
              label="Lieu d'Octroi"
              name="lieuOctroit"
              rules={[{ required: true, message: 'Veuillez entrer le lieu d\'octroi' }]}
            >
              <Input />
            </Form.Item>
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
            <Form.Item
              label="Validité Année"
              name="validateAnnee"
              rules={[{ required: true, message: 'Veuillez entrer l\'année de validité' }]}
            >
              <Input type='number' />
            </Form.Item>
          </>
        ),
      },
      {
        title: 'Autres Informations',
        content: (
          <>
            <Form.Item
              label="Photo"
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
            <Form.Item
                label="Attestation"
                valuePropName='fileList2'
                getValueFromEvent={normFile2}
                >
              <Upload
                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture"
                maxCount={1}
                beforeUpload={()=>false}
                fileList={fileList2}
                onChange={({ fileList}) => setFileList2(fileList)}
              >
                <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Stock Collecteur"
              name="stockCollecteur"
              rules={[{ required: true, message: 'Veuillez entrer le stock d\'orpailleur' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Commune"
              name="communeId"
              rules={[{ required: true, message: 'Veuillez sélectionner une commune' }]}
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
          </>
        ),
      },
    ];
  
    const next = async () => {
      try {
          const values = await form.validateFields();
  
          // Ajouter les valeurs dans FormData en fonction de l'étape actuelle
          if (current === 0) {
              formData.set('numeroIdentification', values.numeroIdentification);
              formData.set('nom', values.nom);
              formData.set('prenom', values.prenom);
              formData.set('adresse', values.adresse);
              formData.set('sexe', values.sexe);
          } else if (current === 1) {
              const dateCinFormatted = values.dateCin ? values.dateCin.format('YYYY-MM-DD') : null;
              formData.set('cin', values.cin);
              formData.set('dateCin', dateCinFormatted);
              formData.set('lieuCin', values.lieuCin);
          } else if (current === 2) {
              const dateOctroitFormatted = values.dateOctroit ? values.dateOctroit.format('YYYY-MM-DD') : null;
              formData.set('lieuOctroit', values.lieuOctroit);
              formData.set('dateOctroit', dateOctroitFormatted);
              formData.set('validateAnnee', values.validateAnnee);
          }
  
          setCurrent(current + 1);
      } catch (errorInfo) {
          message.error('Veuillez remplir tous les champs obligatoires.');
      }
  };
  
  const prev = () => {
      setCurrent(current - 1);
  };
  
  const onFinish = async () => {
      try {
        // Validation manuelle de la photo
        if (fileList.length === 0 ) {
          message.error('Veuillez uploader une photo.');
          return;
        }else if (fileList2.length === 0) {
          message.error('Veuillez uploader l\'attestation.');
          return;
        }
        setLoading(true);
        message.loading({ content: 'Ajout en cours...', key: 'ajoutOrp', duration: 0 });
          const values = await form.validateFields();
          
          console.log(fileList2[0]);
          // Ajouter le fichier et les autres champs à la soumission finale
          formData.set('file', fileList[0]?.originFileObj);
          formData.set('file2', fileList2[0]?.originFileObj);
          formData.set('stockCollecteur', values.stockCollecteur);
          formData.set('communeId', values.communeId[values.communeId.length - 1]);
          
          
          await axios.post(`${BASE_URLAPI}/ajoutCollecteur`,formData)
          // Réinitialiser le formulaire
          form.resetFields();
  
          // Vider la liste des fichiers
          setFileList([]);
  
          // Revenir au premier step
          setCurrent(0);
        message.success({ content: 'Formulaire soumis avec succès !', key: 'ajoutOrp'});
        
          
  
          // Envoi des données à votre API (à décommenter une fois prêt)
          // await axios.post(`${BASE_URLAPI}/orpailleurs`, formData);
      } catch (error) {
          message.error({content :'Erreur lors de la soumission du formulaire.',key: 'ajoutOrp'});
      }finally{
        setLoading(false);
      }
  };
  
  return (
    <Form form={form} layout="vertical">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajout d'un nouveau Collecteur</h1>
      <Steps current={current} className="steps">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content" style={{ marginTop: '24px' }}>{steps[current].content}</div>
      <div className="steps-action" style={{ marginTop: '24px', textAlign: 'right' }}>
        <Row>
          <Col span={24}>
            {current > 0 && (
              <Button style={{ marginRight: 8 }} onClick={prev} disabled={loading}>
                Précédent
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next} disabled={loading}>
                Suivant
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={onFinish} loading={loading}>
                Terminer
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Form>
  )
}

export default AjoutCollecteur