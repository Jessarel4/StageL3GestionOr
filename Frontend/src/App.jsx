import React , { useEffect, useState } from 'react'

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { Avatar, Breadcrumb, Button, Divider, Image, Layout, Popover, theme ,Typography } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined,LogoutOutlined,UserOutlined,InfoCircleOutlined  } from '@ant-design/icons'
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import ToggleThemeButton from './components/ToggleThemeButton';
import Exempletable from './components/exempletable';
import Formeex from './components/Formeex';
import ListeCompte from './components/menu/ListeCompte';
import { Content } from 'antd/es/layout/layout';
import AjoutCompte from './components/menu/AjoutCompte';
import ListeOrpailleurs from './components/menu/Orpailleurs/ListeOrpailleurs';
import AjoutOrpailleurs from './components/menu/Orpailleurs/AjoutOrpailleurs';
import Not404 from './components/menu/details/Not404';
import ListeCollecteur from './components/menu/Collecteurs/ListeCollecteur';
import Home from './components/menu/Home/Home';
import AjoutCollecteur from './components/menu/Collecteurs/AjoutCollecteur';
import Connexion from './components/menu/Connexion/Connexion';
import ResetPassword from './components/menu/Connexion/ResetPassword ';
import { BASE_URL } from './config';
import AjoutComptoir from './components/menu/Comptoir/AjoutComptoir';
import Transaction from './components/menu/Transaction/Transaction';

const {Header,Sider} = Layout;
const { Text } = Typography;

function App() {

  const [darkTheme, setDarkTheme] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [utilisateur, setUtilisateur] = useState('');
  const [compte, setCompte] = useState();
  const [hover, setHover] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setPopoverVisible(visible);
  };

  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      const userName = localStorage.getItem('userName');
      const comte = JSON.parse(localStorage.getItem('compte'));
      setUtilisateur(userName);
      setCompte(comte);
    }else{
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (token, userName,compte) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('compte', JSON.stringify(compte));
    setIsAuthenticated(true);
    setUtilisateur(userName); 
    setCompte(compte);
  };
  const handleLogout = () => {
    setPopoverVisible(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('compte');
    setIsAuthenticated(false);
    setUtilisateur(''); 
    // Réinitialiser l'état utilisateur
  };
  const content = (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      width: '300px',
      backgroundColor: '#f5f6f7', // Couleur de fond douce et neutre
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    }}>
      <Avatar
        src={compte?.photo ? `${BASE_URL}${compte.photo}` : null}
        icon={!compte?.photo && <UserOutlined />}
        size={90}
        style={{
          marginBottom: '15px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          border: '3px solid #1877f2', // Bordure bleu classique Facebook
        }}
      />
      <Text strong style={{ 
        display: 'block', 
        fontSize: '18px', 
        marginBottom: '8px', 
        color: '#1c1e21'  // Couleur du texte subtilement foncée
      }}>
        {compte?.utilisateur || 'Utilisateur'}
      </Text>
      <Text type="secondary" style={{
        fontSize: '14px',
        color: '#606770',  // Couleur discrète pour les informations secondaires
      }}>
        {compte?.email || 'Email inconnu'}
      </Text>
      <Divider style={{ margin: '20px 0', borderColor: '#dfe3e8' }} />
      <Button 
        type="primary" 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
        style={{
          backgroundColor: '#fff', 
          color: 'black', 
          width: '100%', 
          height: '40px',
          fontSize: '15px',
          fontWeight: 'bold',
          borderRadius: '6px',
        }}
      >
        Changer Le Mot de pass
      </Button>
      <Divider style={{ margin: '20px 0', borderColor: '#dfe3e8' }} />
      <Button 
        type="primary" 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
        style={{ 
          color: 'white', 
          width: '100%', 
          height: '40px',
          fontSize: '15px',
          fontWeight: 'bold',
          borderRadius: '6px',
        }}
      >
        Déconnexion
      </Button>
    </div>
  );
  
  
  

  const toogleTheme = ()=>{
    setDarkTheme(!darkTheme)
  }
  const {
    token :{colorBgContainer,borderRadiusLG},
  } = theme.useToken();
  return (
    <BrowserRouter >
      <Layout theme={darkTheme ? 'dark' : 'light'}>
        <Sider collapsed={collapsed} collapsible trigger={null} theme={darkTheme ? 'dark' : 'light'} className='sidebar'>
          <Logo />
          <MenuList darkTheme={darkTheme}  />
          <ToggleThemeButton darkTheme={darkTheme} toogleTheme={toogleTheme}/>
        </Sider>
        <Layout theme='dark'>
          <Header className='head' >
            <Button type='text' className='toggle' onClick={() => setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}/>
            <div className='photologiur'>
            {compte && compte.photo ? (
            <Avatar 
              preview={false}
                src={`${BASE_URL}${compte.photo}`}
                style={{
                    width: 25,
                    height: 25,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #f0f0f0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            />  
            ) : (
              <Button 
                type='text' 
                onClick={handleLogout} 
                style={{ marginRight: '16px' }} 
                icon={<UserOutlined />} 
              />
            )}
            <Popover
              content={content}
              trigger="click"
              placement="bottomRight"
              visible={popoverVisible}
              onVisibleChange={handleVisibleChange}
            >
              {compte && compte.photo ? 
                (
                <Button 
                    type='text'  
                    icon={hover ? <InfoCircleOutlined /> : <UserOutlined />}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  />
                ) : 
                (
                <Button 
                  type='text' 
                  icon={ <UserOutlined />}
                />
                )
              }

            </Popover>
              <Button 
                type='text' 
                onClick={handleLogout} 
                style={{ marginRight: '16px' }} 
                icon={<LogoutOutlined  />} 
              />
            </div>
            
          </Header>
          <Content 
            style={{
                margin: '0 16px',
            }}>
                <Breadcrumb
                    style={{
                    margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Utilisateur</Breadcrumb.Item>
                    <Breadcrumb.Item>{utilisateur || ''}</Breadcrumb.Item>
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    }}>
                    <Routes>
                        {/* <Route path='/Sigin' element={isAuthenticated ?<Sigin />:<Navigate to="/"/>} />mety */}
                        {/* <Route path='/' element={<Login onLogin={handleLogin}/>} /> */}
                        {/* <Route path='/Dashboard/Exportation' element={isAuthenticated ?<Exportation/>:<Navigate to="/"/>} /> */}
                        {/* <Route path='/create' element={isAuthenticated ?<Create />:<Navigate to="/"/>} />mety */}
                        {/* <Route path='/Home' element={isAuthenticated ?<Home/>:<Navigate to="/"/>} />mety */}
                        {/* <Route path='/Dashboard/Codification' element={isAuthenticated ?<Codification/>:<Navigate to="/"/>} />mety */}
                        {/* <Route path='/Dashboard/Commande' element={isAuthenticated ?<Commande/>:<Navigate to="/"/>} />mety */}
                        {/* <Route path='/Dashboard' element={isAuthenticated ? <Dashboard />:<Navigate to="/" />} />mety */}
                        {/* <Route path='*' element={<Notfond/>} /> */}
                        <Route path='/' element={isAuthenticated ? <Home/> : <Navigate to="/Connexion"/>}/>
                        <Route path='/liste' element={isAuthenticated ? <Exempletable />: <Navigate to="/Connexion"/>}/>
                        <Route path='/ajoutliste' element={isAuthenticated ? <Formeex />:<Navigate to="/Connexion"/>}/>
                        <Route path='/CompteListe' element={isAuthenticated ? <ListeCompte />:<Navigate to="/Connexion"/>}/>
                        <Route path='/ajoutCompte' element={isAuthenticated ? <AjoutCompte />:<Navigate to="/Connexion"/>}/>
                        <Route path='/Transaction' element={isAuthenticated ? <Transaction />:<Navigate to="/Connexion"/>}/>
                        <Route path='/OrpailleursListe' element={isAuthenticated ? <ListeOrpailleurs />:<Navigate to="/Connexion"/>}/>
                        <Route path='/AjoutOrpailleurs' element={isAuthenticated ? <AjoutOrpailleurs />:<Navigate to="/Connexion"/>}/>
                        <Route path='/CollecteursListe' element={isAuthenticated ? <ListeCollecteur />:<Navigate to="/Connexion"/>}/>
                        <Route path='/AjoutCollecteurs' element={isAuthenticated ? <AjoutCollecteur />:<Navigate to="/Connexion"/>}/>
                        <Route path='/AjoutComptoir' element={isAuthenticated ? <AjoutComptoir />:<Navigate to="/Connexion"/>}/>
                        <Route path='/Connexion' element={<Connexion onLogin={handleLogin} />}/>
                        <Route path='/MdpOublier' element={<ResetPassword/>}/>
                        <Route path='/reset-password' element={<ResetPassword />}/>
                        <Route path='/*' element={<Not404 />}/>
                    </Routes>
                    
                </div>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}

export default App
