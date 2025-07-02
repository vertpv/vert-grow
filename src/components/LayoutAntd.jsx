import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Drawer, 
  Typography, 
  Space,
  Dropdown,
  Avatar
} from 'antd';
import {
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  HomeOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  ToolOutlined,
  CalculatorOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const LayoutAntd = ({ children, user, activeTab, onTabChange, onLogout }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mainMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'plantas',
      icon: <ExperimentOutlined />,
      label: 'Plantas',
    },
    {
      key: 'tendas',
      icon: <HomeOutlined />,
      label: 'Tendas',
    },
    {
      key: 'ambiente',
      icon: <BarChartOutlined />,
      label: 'Ambiente',
    },
    {
      key: 'relatorios',
      icon: <FileTextOutlined />,
      label: 'Relatórios',
    },
  ];

  const toolsMenuItems = [
    {
      key: 'nutricao',
      icon: <BulbOutlined />,
      label: 'Nutrição',
    },
    {
      key: 'calculadora',
      icon: <CalculatorOutlined />,
      label: 'Calculadora',
    },
  ];

  const handleMenuClick = (e) => {
    const key = typeof e === 'string' ? e : e.key;
    if (onTabChange) {
      onTabChange(key);
    }
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleLogoClick = () => {
    if (onTabChange) {
      onTabChange('dashboard');
    }
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
    },
  ];

  const handleUserMenuClick = (e) => {
    if (e.key === 'logout') {
      handleLogout();
    }
  };

  const renderMenu = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Menu
        mode="inline"
        selectedKeys={[activeTab]}
        onClick={handleMenuClick}
        items={mainMenuItems}
        style={{ border: 'none' }}
      />
      
      <div>
        <Text type="secondary" style={{ padding: '0 16px', fontSize: '12px' }}>
          FERRAMENTAS
        </Text>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={handleMenuClick}
          items={toolsMenuItems}
          style={{ border: 'none', marginTop: 8 }}
        />
      </div>
    </Space>
  );

  // Criar items para o dropdown mobile de forma mais segura
  const createMobileDropdownItems = () => {
    const items = [];
    
    // Adicionar itens do menu principal (a partir do 5º item)
    mainMenuItems.slice(4).forEach(item => {
      items.push({
        key: item.key,
        icon: item.icon,
        label: item.label,
      });
    });
    
    // Adicionar divisor
    if (toolsMenuItems.length > 0) {
      items.push({ type: 'divider' });
    }
    
    // Adicionar ferramentas
    toolsMenuItems.forEach(item => {
      items.push({
        key: item.key,
        icon: item.icon,
        label: item.label,
      });
    });
    
    return items;
  };

  const handleMobileDropdownClick = (e) => {
    handleMenuClick(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header 
        style={{ 
          background: '#fff', 
          padding: '0 16px',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ 
                minWidth: 40, 
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          )}
          
          <Button
            type="text"
            onClick={handleLogoClick}
            style={{ 
              padding: 0,
              height: 'auto',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#22c55e'
            }}
          >
            VERT GROW
          </Button>
        </div>

        <Dropdown
          menu={{ 
            items: userMenuItems,
            onClick: handleUserMenuClick
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 40,
              padding: '0 8px'
            }}
          >
            <Avatar size="small" style={{ backgroundColor: '#22c55e' }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            {!isMobile && (
              <Text ellipsis style={{ maxWidth: 120 }}>
                {user?.email || 'Usuário'}
              </Text>
            )}
          </Button>
        </Dropdown>
      </Header>

      <Layout>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Layout.Sider
            width={256}
            style={{
              background: '#fff',
              borderRight: '1px solid #f0f0f0',
              height: 'calc(100vh - 64px)',
              position: 'sticky',
              top: 64,
              overflow: 'auto'
            }}
          >
            <div style={{ padding: '24px 0' }}>
              {renderMenu()}
            </div>
          </Layout.Sider>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            title={
              <Button
                type="text"
                onClick={handleLogoClick}
                style={{ 
                  padding: 0,
                  height: 'auto',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#22c55e'
                }}
              >
                VERT GROW
              </Button>
            }
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={280}
            closeIcon={<CloseOutlined />}
            styles={{
              body: { padding: '24px 0' }
            }}
          >
            {renderMenu()}
          </Drawer>
        )}

        {/* Main Content */}
        <Layout>
          <Content
            style={{
              padding: isMobile ? 16 : 24,
              minHeight: 'calc(100vh - 64px - 70px)', // Header + Footer
              background: '#f9fafb'
            }}
          >
            {children}
          </Content>

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <Footer
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: '#fff',
                borderTop: '1px solid #f0f0f0',
                padding: '8px 16px',
                height: 70
              }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}
              >
                {mainMenuItems.slice(0, 4).map(item => (
                  <Button
                    key={item.key}
                    type={activeTab === item.key ? 'primary' : 'text'}
                    icon={item.icon}
                    onClick={() => handleMenuClick(item.key)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: 48,
                      minWidth: 48,
                      padding: '4px 8px',
                      fontSize: '10px',
                      gap: 2
                    }}
                  >
                    <span style={{ fontSize: '10px', lineHeight: 1 }}>
                      {item.label}
                    </span>
                  </Button>
                ))}
                
                <Dropdown
                  menu={{ 
                    items: createMobileDropdownItems(),
                    onClick: handleMobileDropdownClick
                  }}
                  placement="topRight"
                  trigger={['click']}
                >
                  <Button
                    type="text"
                    icon={<SettingOutlined />}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: 48,
                      minWidth: 48,
                      padding: '4px 8px',
                      fontSize: '10px',
                      gap: 2
                    }}
                  >
                    <span style={{ fontSize: '10px', lineHeight: 1 }}>
                      Mais
                    </span>
                  </Button>
                </Dropdown>
              </div>
            </Footer>
          )}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutAntd;

