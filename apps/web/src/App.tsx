import { App as AntdApp, ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { antdTheme } from './lib/theme';
import { router } from './routes';

export default function App() {
  return (
    <ConfigProvider direction="rtl" locale={arEG} theme={antdTheme}>
      <AntdApp>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
