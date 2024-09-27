import React, { useEffect, useState } from 'react';
import { Carousel, Card, Row, Col, Statistic, Typography } from 'antd';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

import axios from 'axios';
import moment from 'moment';
import { BASE_URLAPI } from '../../../config';

const { Title } = Typography;

// Données pour les graphiques
const data = [
  { name: 'Page A', value: 400 },
  { name: 'Page B', value: 300 },
  { name: 'Page C', value: 300 },
  { name: 'Page D', value: 200 },
];

const barData = [
  { name: 'January', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'February', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'March', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'April', uv: 2780, pv: 3908, amt: 2000 },
];

const lineData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
];

const Home = () => {
  
  const [statistique, setstatistique] = useState([]);
  
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  // Récupérer les transactions depuis l'API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URLAPI}/statistics`); // Remplacez par votre endpoint
      setstatistique(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };
  useEffect(() => {

    fetchTransactions();
  }, []);
  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Tableau de Bord</Title>
     
      <Carousel 
        dots={{ className: 'custom-carousel-dots' }}
        arrows
        dotPosition="down">
        {/* Slide 1: Statistiques */}
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="Total Orpailleurs" value={statistique.nombreOrpailleurs ? statistique.nombreOrpailleurs : 0 } />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Total Collecteurs" value={statistique.nombreCollecteurs ? statistique.nombreCollecteurs  : 0} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Total Comptoirs" value={statistique.nombreComptoirs ? statistique.nombreComptoirs : 0} />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Slide 2: Pie Chart */}
        <div>
          <Card title="Répartition des Pages (Pie Chart)">
            <PieChart width={400} height={400}>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label />
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>
        </div>

        {/* Slide 3: Bar Chart */}
        <div>
          <Card title="Performance Mensuelle (Bar Chart)">
            <BarChart width={500} height={300} data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uv" fill="#8884d8" />
              <Bar dataKey="pv" fill="#82ca9d" />
            </BarChart>
          </Card>
        </div>

        {/* Slide 4: Line Chart */}
        <div>
          <Card title="Trafic du site web (Line Chart)">
            <LineChart width={500} height={300} data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            </LineChart>
          </Card>
        </div>
      </Carousel>
    </div>
  );
};

export default Home;
