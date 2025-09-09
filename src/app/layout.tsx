import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import { Header } from "@/components";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Fix from '@/lib/fix';
import { SessionProvider } from '@/components/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Fix />
          <SessionProvider session={session}>
            <Header />
            {children}
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
