import AppHeader from '@/components/AppHeader';
import FloatButtonLayout from '../components/FloatButtonLayout';
import './global.css';
import AsideMenu from '@/components/AsideMenu';

export const metadata = {
  title: 'Fordring Blog',
  description: 'Generated by Leslie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-deep-background overflow-x-hidden">
        <FloatButtonLayout aside={<AsideMenu />}>
          <AppHeader />
          {children}
        </FloatButtonLayout>
      </body>
    </html>
  );
}
