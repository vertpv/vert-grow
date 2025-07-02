// Tema customizado do Ant Design para VERT GROW
// Paleta P&B com destaque verde nos botões

export const antdTheme = {
  token: {
    // Cores primárias
    colorPrimary: '#22c55e', // Verde para botões
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#6b7280',
    
    // Cores neutras (P&B)
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    colorTextTertiary: '#9ca3af',
    colorTextQuaternary: '#d1d5db',
    
    // Backgrounds
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f9fafb',
    colorBgSpotlight: '#f3f4f6',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    
    // Borders
    colorBorder: '#e5e7eb',
    colorBorderSecondary: '#f3f4f6',
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // Spacing (múltiplos de 8)
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    
    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusXS: 4,
    borderRadiusSM: 6,
    
    // Control heights (mínimo 32px para mobile)
    controlHeight: 40,
    controlHeightSM: 32,
    controlHeightLG: 48,
    controlHeightXS: 24,
    
    // Line heights
    lineHeight: 1.5714285714285714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.66,
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    
    // Z-index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
  },
  components: {
    // Button customizations
    Button: {
      primaryColor: '#ffffff',
      defaultColor: '#1f2937',
      defaultBg: '#ffffff',
      defaultBorderColor: '#e5e7eb',
      defaultHoverColor: '#1f2937',
      defaultHoverBg: '#f9fafb',
      defaultHoverBorderColor: '#d1d5db',
      defaultActiveBg: '#f3f4f6',
      defaultActiveBorderColor: '#9ca3af',
      dangerColor: '#ffffff',
      ghostColor: '#1f2937',
      ghostBg: 'transparent',
      ghostBorderColor: 'transparent',
      ghostHoverColor: '#1f2937',
      ghostHoverBg: '#f9fafb',
      ghostHoverBorderColor: '#e5e7eb',
      linkHoverColor: '#16a34a',
      textHoverColor: '#16a34a',
      paddingInline: 16,
      paddingBlock: 8,
      borderRadius: 8,
      fontWeight: 500,
    },
    
    // Input customizations
    Input: {
      colorBorder: '#e5e7eb',
      colorBorderHover: '#d1d5db',
      colorPrimaryBorder: '#22c55e',
      colorPrimaryBorderHover: '#16a34a',
      borderRadius: 8,
      paddingBlock: 8,
      paddingInline: 12,
      fontSize: 14,
    },
    
    // Card customizations
    Card: {
      colorBorderSecondary: '#f3f4f6',
      borderRadiusLG: 12,
      paddingLG: 24,
      boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    
    // Menu customizations
    Menu: {
      itemBg: 'transparent',
      itemColor: '#1f2937',
      itemHoverColor: '#1f2937',
      itemHoverBg: '#f9fafb',
      itemSelectedColor: '#22c55e',
      itemSelectedBg: '#f0fdf4',
      itemActiveBg: '#f0fdf4',
      borderRadius: 8,
      itemMarginBlock: 4,
      itemPaddingInline: 12,
    },
    
    // Modal customizations
    Modal: {
      borderRadiusLG: 12,
      paddingLG: 24,
      titleFontSize: 20,
      titleLineHeight: 1.4,
      titleColor: '#1f2937',
    },
    
    // Table customizations
    Table: {
      headerBg: '#f9fafb',
      headerColor: '#374151',
      borderColor: '#f3f4f6',
      rowHoverBg: '#f9fafb',
      borderRadius: 8,
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
    },
    
    // Form customizations
    Form: {
      labelColor: '#374151',
      labelFontSize: 14,
      labelHeight: 32,
      verticalLabelPadding: '0 0 8px',
      itemMarginBottom: 24,
    },
    
    // Typography customizations
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
      fontWeightStrong: 600,
      colorText: '#1f2937',
      colorTextSecondary: '#6b7280',
      colorTextDescription: '#9ca3af',
    },
    
    // Layout customizations
    Layout: {
      bodyBg: '#f9fafb',
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#ffffff',
      triggerBg: '#f9fafb',
      triggerColor: '#6b7280',
    },
    
    // Notification customizations
    Notification: {
      borderRadiusLG: 12,
      paddingMD: 16,
      marginEdge: 24,
    },
    
    // Message customizations
    Message: {
      borderRadiusLG: 12,
      paddingMD: 12,
      marginTop: 8,
    },
    
    // Drawer customizations
    Drawer: {
      borderRadiusLG: 12,
      paddingLG: 24,
    },
    
    // Tabs customizations
    Tabs: {
      itemColor: '#6b7280',
      itemSelectedColor: '#22c55e',
      itemHoverColor: '#1f2937',
      inkBarColor: '#22c55e',
      borderRadius: 8,
      horizontalMargin: '0 32px 0 0',
      horizontalItemPadding: '12px 0',
    },
  },
  
  // CSS Variables para uso global
  cssVar: true,
  hashed: false,
};

