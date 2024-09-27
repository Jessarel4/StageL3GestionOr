import { Menu } from 'antd'
import { Link } from 'react-router-dom';
import {TransactionOutlined ,ShopOutlined ,UsergroupAddOutlined ,GoldOutlined ,HomeOutlined , UserOutlined ,AreaChartOutlined,SettingOutlined,PlusOutlined,BarsOutlined,UnorderedListOutlined} from '@ant-design/icons'
const MenuList = ({darkTheme}) => {
  return (
    <Menu theme={darkTheme ? 'dark' : 'light'} mode='inline' className='menu-bar'>
        <Menu.Item key="home" icon={<HomeOutlined/>}> Home<Link to="/" /> </Menu.Item>
        <Menu.SubMenu key="activity" icon={<UserOutlined />} title='Utilisateur'>
          <Menu.Item icon={<UnorderedListOutlined  />}>Listes <Link to="/CompteListe" /></Menu.Item>
          <Menu.Item icon={<PlusOutlined />}>Ajout <Link to="/ajoutCompte" /> </Menu.Item>
        </Menu.SubMenu>  
        {/* <Menu.SubMenu key='tasks' icon={<BarsOutlined />} title='tasks'>
            <Menu.Item key="task-1">Test 1 <Link to="/liste" /></Menu.Item>    
            <Menu.Item key="task-2">Test 2 <Link to="/ajoutliste" /></Menu.Item>  
            <Menu.SubMenu key='subtasks' title='subtasks'>
                <Menu.Item key='subtask-1'>soustest 1</Menu.Item>    
                <Menu.Item key='subtask-2'>soustest 2</Menu.Item>    
            </Menu.SubMenu>  
        </Menu.SubMenu>  */}
        <Menu.SubMenu key="Orpailleurs" icon={<GoldOutlined  />} title='Orpailleurs'>
          <Menu.Item icon={<UnorderedListOutlined  />}>Listes <Link to="/OrpailleursListe" /></Menu.Item>
          <Menu.Item icon={<PlusOutlined />}>Ajout <Link to="/AjoutOrpailleurs" /> </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="Collecteurs" icon={<UsergroupAddOutlined />} title='Collecteurs'>
          <Menu.Item icon={<UnorderedListOutlined  />}>Listes <Link to="/CollecteursListe" /></Menu.Item>
          <Menu.Item icon={<PlusOutlined />}>Ajout <Link to="/AjoutCollecteurs" /> </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="Comptoirs" icon={<ShopOutlined />} title='Comptoirs'>
          <Menu.Item icon={<UnorderedListOutlined  />}>Listes <Link to="/CollecteursListe" /></Menu.Item>
          <Menu.Item icon={<PlusOutlined />}>Ajout <Link to="/AjoutComptoir" /> </Menu.Item>
        </Menu.SubMenu>
        {/* <Menu.Item key="Comptoirs" icon={<ShopOutlined />}>Comptoirs </Menu.Item> */}
        <Menu.Item key="paymTransactionsent" icon={<TransactionOutlined />}>Transactions <Link to="/Transaction"/></Menu.Item>
    </Menu>
  )
}

export default MenuList