import React, { useEffect, useState } from 'react';
import { Table, Select, DatePicker, Button, Space, Spin, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { BASE_URLAPI } from '../../../config';

const { Option } = Select;

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [transactionType, setTransactionType] = useState('');
  const [entity, setEntity] = useState('');
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  // Récupérer les transactions depuis l'API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true); // Commencer le chargement
      try {
        const response = await axios.get(`${BASE_URLAPI}/transactions`); // Remplacez par votre endpoint
        setTransactions(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions :", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchTransactions();
  }, []);

  const filterTransactions = () => {
    let data = [...transactions];

    // Log pour voir les dates dans la plage
    console.log("Plage de dates:", dateRange);

    // Vérifie si la plage de dates est définie
    if (dateRange && dateRange.length === 2) {
      // Convertit les dates en objets Moment
      const startDate = moment(dateRange[0].$d).startOf('day');
      const endDate = moment(dateRange[1].$d).endOf('day');
      data = data.filter((transaction) => {
        const transactionDate = moment(transaction.date).startOf('day'); // Ignorer l'heure

        if (transactionDate.isBetween(startDate, endDate, null, '[]')) {
          console.log(`Succès : La date de la transaction (${transaction.date}) est entre ${startDate.format('YYYY-MM-DD')} et ${endDate.format('YYYY-MM-DD')}`);
          return true;
        } else {
          console.error(`Erreur : La date de la transaction (${transaction.date}) n'est pas entre ${startDate.format('YYYY-MM-DD')} et ${endDate.format('YYYY-MM-DD')}`);
          return false;
        }
      });
    }

    // Filtrer par type de transaction
    if (transactionType) {
      data = data.filter((transaction) => transaction.type === transactionType);
    }

    // Filtrer par type d'entité
    if (entity) {
      if (entity === 'orpailleur') {
        // Afficher uniquement les transactions d'extraction et de vente
        data = data.filter((transaction) => transaction.type === 'extraction' || transaction.type === 'vente');
      } else if (entity === 'collecteur') {
        // Afficher les transactions de vente 
        data = data.filter((transaction) =>
          transaction.type === 'vente' 
        );
      } else if (entity === 'comptoir') {
        // Afficher uniquement les transactions de vente
        data = data.filter((transaction) => transaction.type === 'vente');
      }
    }

    // Log des données filtrées pour vérification
    console.log("Données filtrées:", data);

    setFilteredData(data);
  };

  // Mettre à jour les filtres chaque fois que les états changent
  useEffect(() => {
    filterTransactions();
  }, [dateRange, transactionType, entity]);

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setTransactionType('');
    setEntity('');
    setDateRange([]);
    setFilteredData(transactions); // Réinitialiser le tableau aux données d'origine
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Type de Transaction',
      dataIndex: 'type',
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
    },
    {
      title: 'Parties Impliquées',
      render: (text, record) => (
        <span>
          {record.orpailleurId ? (
            <>
              <strong>Orpailleur:</strong> {record.orpailleurNom} {record.orpailleurPrenom}<br />
            </>
          ) : ''}
          {record.collecteurId ? (
            <>
              <strong>Collecteur:</strong> {record.collecteurNom} {record.collecteurPrenom}<br />
            </>
          ) : ''}
          {record.comptoirId ? (
            <>
              <strong>Comptoir:</strong> {record.comptoirNomSociete}
            </>
          ) : ''}
        </span>
      ),
    },
    {
      title: 'Actions',
      render: (text, record) => <Button>Voir Détails</Button>,
    },
  ];

  return (
    <div>
      <h2>Tableau des Transactions</h2>
      <Space>
        <DatePicker.RangePicker onChange={(dates) => setDateRange(dates)} />
        <Select placeholder="Type de Transaction" onChange={setTransactionType} style={{ width: 200 }} value={transactionType}>
          <Option value="extraction">Extraction</Option>
          <Option value="vente">Vente</Option>
        </Select>
        <Select placeholder="Entité" onChange={setEntity} style={{ width: 200 }} value={entity}>
          <Option value="orpailleur">Orpailleur</Option>
          <Option value="collecteur">Collecteur</Option>
          <Option value="comptoir">Comptoir</Option>
        </Select>
        <Button onClick={resetFilters} style={{ marginLeft: 10 }}>Réinitialiser</Button>
      </Space>

      <Table loading={loading} dataSource={filteredData} columns={columns} rowKey="id" />
    </div>
  );
};

export default Transaction;
