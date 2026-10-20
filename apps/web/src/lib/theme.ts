import type { ThemeConfig } from 'antd';
import { c, fontText, tokens } from './tokens';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: c.brand[500],
    colorSuccess: c.brand[600],
    colorWarning: c.state.warningFg,
    colorError: c.state.dangerFg,
    colorInfo: c.brand[400],
    colorText: c.ink[900],
    colorTextSecondary: c.ink[500],
    colorTextDescription: c.ink[400],
    colorBorder: c.surface.line,
    colorBorderSecondary: c.surface.line,
    colorBgLayout: c.surface.canvas,
    fontFamily: fontText,
    fontSize: tokens.typography.baseSize,
    lineHeight: tokens.typography.lineHeight,
    borderRadius: tokens.radius.control,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: c.surface.canvas,
      headerBg: c.surface.card,
      siderBg: c.surface.card,
    },
    Menu: {
      itemSelectedBg: c.brand[50],
      itemSelectedColor: c.brand[700],
      itemBg: 'transparent',
    },
    Card: {
      borderRadiusLG: tokens.radius.card,
    },
    Table: {
      headerBg: c.surface.sand,
    },
  },
};
