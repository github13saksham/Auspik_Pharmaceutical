import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';

export default function Layout({ settings }) {
  return (
    <div className="app-layout">
      <Header settings={settings} />
      <main style={{ minHeight: 'calc(100vh - 350px)', paddingTop: '92px' }}>
        <Outlet />
      </main>
      <WhatsAppWidget phone={settings?.phone} />
      <Footer settings={settings} />
    </div>
  );
}
