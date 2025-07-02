import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Sprout, 
  Building, 
  Thermometer, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  Info,
  Calculator,
  Calendar,
  FlaskConical
} from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, onLogout, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'plantas', label: 'Plantas', icon: Sprout },
    { id: 'tendas', label: 'Tendas', icon: Building },
    { id: 'ambiente', label: 'Ambiente', icon: Thermometer },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  const toolsMenuItems = [
    { id: 'nutricao', label: 'Nutrição Mineral', icon: FlaskConical },
    { id: 'info', label: 'Informações', icon: Info },
    { id: 'receita', label: 'Receita Concentrada', icon: FlaskConical },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'calculadora', label: 'Calculadora', icon: Calculator },
  ];

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    setToolsOpen(false);
  };

  const MenuItem = ({ item, isActive, onClick, isMobile = false }) => {
    const Icon = item.icon;
    return (
      <button
        className={`btn w-full justify-start gap-3 ${isActive ? 'btn-secondary' : 'btn-ghost'}`}
        onClick={() => onClick(item.id)}
        style={{ 
          justifyContent: 'flex-start',
          minHeight: isMobile ? 'var(--space-6)' : 'var(--space-5)',
          padding: isMobile ? 'var(--space-2) var(--space-3)' : 'var(--space-2) var(--space-3)',
          fontSize: isMobile ? 'var(--text-base)' : 'var(--text-sm)'
        }}
      >
        <Icon size={isMobile ? 20 : 16} />
        {item.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Header */}
      {isMobile && (
        <div className="border-b bg-background sticky top-0 z-40">
          <div className="flex items-center justify-between p-4" style={{ minHeight: 'var(--space-8)' }}>
            <button
              className="btn btn-ghost p-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ minWidth: 'var(--space-6)', minHeight: 'var(--space-6)' }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex-1 text-center">
              <button 
                className="font-bold text-lg text-primary bg-transparent border-none cursor-pointer"
                onClick={() => handleMenuClick('dashboard')}
              >
                VERT GROW
              </button>
            </div>
            <button 
              className="btn btn-ghost p-2" 
              onClick={onLogout} 
              style={{ minWidth: 'var(--space-6)', minHeight: 'var(--space-6)' }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div 
          className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
          style={{
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? 'var(--space-8)' : 0,
            left: 0,
            width: isMobile ? '280px' : '256px',
            height: isMobile ? 'calc(100vh - var(--space-8))' : '100vh',
            backgroundColor: 'var(--background)',
            borderRight: '1px solid var(--border)',
            transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 50,
            overflowY: 'auto'
          }}
        >
          <div className="flex flex-col h-full">
            {/* Desktop Header */}
            {!isMobile && (
              <div className="flex items-center border-b p-6" style={{ minHeight: 'var(--space-8)' }}>
                <button 
                  className="font-bold text-lg text-primary bg-transparent border-none cursor-pointer"
                  onClick={() => handleMenuClick('dashboard')}
                >
                  VERT GROW
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex-1 p-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {/* Main Menu */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {mainMenuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    isActive={activeTab === item.id}
                    onClick={handleMenuClick}
                    isMobile={isMobile}
                  />
                ))}
              </div>

              {/* Tools Submenu */}
              <div style={{ paddingTop: 'var(--space-3)' }}>
                <button
                  className="btn btn-ghost w-full justify-between mb-2"
                  onClick={() => setToolsOpen(!toolsOpen)}
                  style={{ 
                    justifyContent: 'space-between',
                    minHeight: isMobile ? 'var(--space-6)' : 'var(--space-5)',
                    fontSize: isMobile ? 'var(--text-base)' : 'var(--text-sm)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={isMobile ? 20 : 16} />
                    Ferramentas
                  </div>
                  <ChevronDown 
                    size={isMobile ? 20 : 16} 
                    style={{ 
                      transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }} 
                  />
                </button>
                
                {toolsOpen && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'var(--space-1)', 
                    paddingLeft: 'var(--space-3)' 
                  }}>
                    {toolsMenuItems.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        isActive={activeTab === item.id}
                        onClick={handleMenuClick}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="p-4 border-t">
              <div className="card p-3 mb-4">
                <div className="text-sm font-medium" style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  fontSize: isMobile ? 'var(--text-base)' : 'var(--text-sm)'
                }}>
                  {user?.email || 'Usuário'}
                </div>
                <div className="text-muted-foreground" style={{ 
                  fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-xs)'
                }}>
                  Sistema de Cultivo
                </div>
              </div>
              
              {!isMobile && (
                <button
                  className="btn btn-outline w-full justify-start gap-2"
                  onClick={onLogout}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && isMobile && (
          <div 
            style={{
              position: 'fixed',
              top: 'var(--space-8)',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <main style={{ 
            padding: isMobile ? 'var(--space-2)' : 'var(--space-6)',
            paddingBottom: 'var(--space-10)' // Sempre espaço para o footer fixo
          }}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Always Visible */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-background border-t"
        style={{ 
          zIndex: 50,
          height: 'var(--space-8)',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex items-center justify-around h-full px-2">
          {mainMenuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-primary bg-secondary transform scale-105' 
                    : 'text-muted hover:text-foreground hover:bg-secondary/50'
                }`}
                onClick={() => handleMenuClick(item.id)}
                style={{ 
                  minWidth: 'var(--space-8)',
                  minHeight: 'var(--space-6)',
                  fontSize: 'var(--text-xs)'
                }}
              >
                <Icon size={isActive ? 22 : 20} />
                <span style={{ 
                  fontSize: isActive ? '11px' : '10px',
                  fontWeight: isActive ? '600' : '400'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
          <button
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 ${
              activeTab === 'relatorios' 
                ? 'text-primary bg-secondary transform scale-105' 
                : 'text-muted hover:text-foreground hover:bg-secondary/50'
            }`}
            onClick={() => handleMenuClick('relatorios')}
            style={{ 
              minWidth: 'var(--space-8)',
              minHeight: 'var(--space-6)',
              fontSize: 'var(--text-xs)'
            }}
          >
            <BarChart3 size={activeTab === 'relatorios' ? 22 : 20} />
            <span style={{ 
              fontSize: activeTab === 'relatorios' ? '11px' : '10px',
              fontWeight: activeTab === 'relatorios' ? '600' : '400'
            }}>
              Mais
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;

