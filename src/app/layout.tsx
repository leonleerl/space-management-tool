import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import { Header } from "@/components";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Fix from '@/lib/fix';
import { SessionProvider } from '@/components/SessionProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Fix />
          <SessionProvider>
            <Header />
            {children}
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
