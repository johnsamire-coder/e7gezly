import { useMemo, useState } from 'react';
import { Avatar, Button, Drawer, Dropdown, Grid, Layout, Menu, Space, Tag, Typography } from 'antd';
import {
  AppstoreOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  MenuOutlined,
  ScheduleOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../lib/auth';
import { c, fontDisplay, tokens } from '../lib/tokens';
import { BackendNotice } from './BackendNotice';

const { Header, Sider, Content } = Layout;

type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  role: Role;
  planned?: boolean;
};

const NAV: NavItem[] = [
  { key: '/', label: 'نظرة عامة', icon: <AppstoreOutlined />, role: 'admin' },
  { key: '/admin/categories', label: 'أقسام الخدمات', icon: <DatabaseOutlined />, role: 'admin' },
  { key: '/admin/governorates', label: 'المحافظات والمناطق', icon: <EnvironmentOutlined />, role: 'admin' },
  { key: '/admin/reviews', label: 'مراجعة مقدمي الخدمة', icon: <TeamOutlined />, role: 'admin', planned: true },
  { key: '/admin/bookings', label: 'طلبات الحجز', icon: <ScheduleOutlined />, role: 'admin', planned: true },
  { key: '/provider/listings', label: 'قوائمي', icon: <ShopOutlined />, role: 'provider', planned: true },
  { key: '/provider/requests', label: 'طلبات الحجز الواردة', icon: <InboxOutlined />, role: 'provider', planned: true },
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, hasRole, signOut, enabled, preview } = useAuth();

  const visible = useMemo(() => NAV.filter((item) => hasRole(item.role)), [hasRole]);

  const items = visible.map((item) => ({
    key: item.key,
    icon: item.icon,
    disabled: item.planned,
    label: item.planned ? (
      <Space size={6}>
        <span>{item.label}</span>
        <Tag color="default" style={{ marginInlineStart: 0 }}>
          لاحقًا
        </Tag>
      </Space>
    ) : (
      item.label
    ),
  }));

  const onSelect = ({ key }: { key: string }) => {
    setOpen(false);
    navigate(key);
  };

  const compact = !screens.md;

  const navigation = (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[pathname]}
      onSelect={onSelect}
      style={{ borderInlineEnd: 'none' }}
    />
  );

  const brand = (
    <div style={{ padding: `${tokens.space.lg}px ${tokens.space.md}px` }}>
      <Typography.Title level={4} style={{ margin: 0, fontFamily: fontDisplay, color: c.brand[700] }}>
        احجزلي
      </Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        لوحة التحكم
      </Typography.Text>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!compact && (
        <Sider width={248} breakpoint="lg" theme="light" style={{ borderInlineStart: `1px solid ${c.surface.line}` }}>
          {brand}
          {navigation}
        </Sider>
      )}

      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: tokens.space.md,
            paddingInline: compact ? tokens.space.md : tokens.space.lg,
            borderBlockEnd: `1px solid ${c.surface.line}`,
          }}
        >
          <Space>
            {compact && <Button type="text" icon={<MenuOutlined />} onClick={() => setOpen(true)} aria-label="القائمة" />}
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              نسخة تطوير — البيانات الحقيقية تعتمد على ربط Supabase
            </Typography.Text>
          </Space>

          {preview ? (
            <Tag color="processing">معاينة الهيكل — لا يوجد حساب فعلي</Tag>
          ) : (
            <Dropdown
              menu={{
                items: [{ key: 'signout', label: 'تسجيل الخروج', onClick: () => void signOut() }],
              }}
              disabled={!user}
            >
              <Space>
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: c.brand[500] }} />
                <Typography.Text>{user?.fullName || user?.id.slice(0, 8) || 'غير مسجّل'}</Typography.Text>
              </Space>
            </Dropdown>
          )}
        </Header>

        <Content style={{ padding: tokens.space.lg, background: c.surface.canvas }}>
          {!enabled && <BackendNotice />}
          <div style={{ maxWidth: tokens.layout.maxContentWidth, marginInline: 'auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      <Drawer
        placement="right"
        open={compact && open}
        onClose={() => setOpen(false)}
        width={260}
        styles={{ body: { paddingBlockStart: 0 }, header: { display: 'none' } }}
      >
        {brand}
        {navigation}
      </Drawer>
    </Layout>
  );
}
