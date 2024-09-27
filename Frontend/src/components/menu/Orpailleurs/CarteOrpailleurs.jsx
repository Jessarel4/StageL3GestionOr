// src/components/CarteOrpailleurs.js
import React from 'react';
import { Card, Image, QRCode } from 'antd';
import { BASE_URL } from '../../../config'; // Assure-toi que ce chemin est correct

const CarteOrpailleurs = ({ record }) => {
  if (!record) return null;

  // Assure-toi que BASE_URL se termine par un '/'
  // Construit l'URL complète de la photo
  const photoUrl = record.photo ? `${BASE_URL}/${record.photo}` : '';

  return (
    <Card
      style={{ width: 300, display: 'flex', alignItems: 'center', position: 'relative' }}
      cover={
        <div style={{ position: 'relative', textAlign: 'center' }}>
          {photoUrl ? (
            <img
              src={photoUrl}
              // alt="Orpailleur"
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Photo
            </div>
          )}
          {/* <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <QRCode value={`ID: ${record.id}`} size={80} />
          </div> */}
        </div>
      }
    >
      <Card.Meta
        title={`${record.nom} ${record.prenom}`}
        description={
          <div>
            <p><strong>Numéro:</strong> {record.numeroIdentification}</p>
            <p><strong>Date de Naissance:</strong> {record.dateNaissance}</p>
          </div>
        }
      />
    </Card>
  );
};

export default CarteOrpailleurs;
