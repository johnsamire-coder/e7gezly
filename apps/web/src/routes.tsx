import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/react-router';
import { Result } from 'antd';
import { Outlet, createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { PortalGate } from './components/PortalGate';
import { RequireRole } from './components/RequireRole';
import { dataProvider } from './lib/dataProvider';
import { useAuth } from './lib/auth';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { GovernoratesPage } from './pages/admin/GovernoratesPage';
import { OverviewPage } from './pages/admin/OverviewPage';
import { LoginPage } from './pages/LoginPage';
import { ProviderHomePage } from './pages/provider/ProviderHomePage';

function HomeRoute() {
  const { hasRole, user } = useAuth();
  if (hasRole('admin')) return <OverviewPage />;
  if (hasRole('provider')) return <ProviderHomePage />;
  return (
    <Result
      status="warning"
      title="لا صلاحيات لهذا الحساب"
      subTitle={
        <>
          الحساب <code>{user?.id}</code> موجود، لكن لا يوجد له أي سجل في جدول account_roles،
          لذلك لا توجد شاشة مسموح بها. أضف الدور من قاعدة البيانات مباشرة أو من شاشة إدارة
          الحسابات حين تُبنى.
        </>
      }
    />
  );
}

function RefineShell() {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      resources={[
        { name: 'service_categories', list: '/admin/categories' },
        { name: 'governorates', list: '/admin/governorates' },
        { name: 'areas' },
        { name: 'profiles' },
      ]}
    >
      <Outlet />
    </Refine>
  );
}

export const router = createBrowserRouter([
  {
    element: <RefineShell />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        element: <PortalGate />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <HomeRoute /> },
              {
                path: 'admin/categories',
                element: (
                  <RequireRole role="admin">
                    <CategoriesPage />
                  </RequireRole>
                ),
              },
              {
                path: 'admin/governorates',
                element: (
                  <RequireRole role="admin">
                    <GovernoratesPage />
                  </RequireRole>
                ),
              },
              {
                path: 'provider',
                element: (
                  <RequireRole role="provider">
                    <ProviderHomePage />
                  </RequireRole>
                ),
              },
              { path: '*', element: <Navigate to="/" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);
