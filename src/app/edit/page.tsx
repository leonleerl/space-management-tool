'use client'
import React, { useState } from 'react';
import {
  FileExcelOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
// import content_map from '@/components/ContentMap'

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState('11');

  return (
    <Layout className='w-full h-full'>
        <Sider trigger={null} collapsible collapsed={collapsed} theme='light'>
          <div className="demo-logo-vertical" />
            <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            onClick={({ key }) => setSelectedKey(key)}
            items={[
                {
                  key: '1',
                  icon: <FolderOutlined/>,
                  label: 'Accommodation Map',
                  children: [
                      {
                        key: '11',
                        icon: <FileExcelOutlined />,
                        label: 'Ground Floor - CSI',
                      },
                      {
                        key: '12',
                        icon: <FileExcelOutlined />,
                        label: 'Ground Floor - DA',
                      },
                      {
                        key: '13',
                        icon: <FileExcelOutlined />,
                        label: 'Mgmt & Orgs',
                      },
                      {
                        key: '14',
                        icon: <FileExcelOutlined />,
                        label: 'Economics',
                      },
                      {
                        key: '15',
                        icon: <FileExcelOutlined />,
                        label: 'Marketing',
                      },
                      {
                        key: '16',
                        icon: <FileExcelOutlined />,
                        label: 'AccFin',
                      },
                      {
                        key: '17',
                        icon: <FileExcelOutlined />,
                        label: 'Deanery-LVL 2',
                      },
                    ]
                },
                {
                  key: '2',
                  icon: <FolderOutlined/>,
                  label: 'Contact List',
                  children: [
                      {
                        key: '21',
                        icon: <FileTextOutlined/>,
                        label: 'AccFin',
                      },
                      {
                        key: '22',
                        icon: <FileTextOutlined/>,
                        label: 'Economics',
                      },
                      {
                        key: '23',
                        icon: <FileTextOutlined/>,
                        label: 'Marketing',
                      },
                      {
                        key: '24',
                        icon: <FileTextOutlined/>,
                        label: 'MO',
                      },
                      {
                        key: '25',
                        icon: <FileTextOutlined/>,
                        label: 'Dean\'s Office',
                      },
                    ]
                },
                {
                  key: '3',
                  icon: <FolderOutlined/>,
                  label: 'Student List',
                  children: [
                    {
                      key: '31',
                      icon: <FileTextOutlined/>,
                      label: 'Mgmt & Orgs',
                    },
                    {
                      key: '32',
                      icon: <FileTextOutlined/>,
                      label: 'Economics',
                    },
                    {
                      key: '33',
                      icon: <FileTextOutlined/>,
                      label: 'Marketing',
                    },
                    {
                      key: '34',
                      icon: <FileTextOutlined/>,
                      label: 'AccFin',
                    },
                    {
                      key: '35',
                      icon: <FileTextOutlined/>,
                      label: 'Ground Floor - DA',
                    },
                  ]
                }
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer, height: 48 }}>
          <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
              fontSize: '16px',
              width: 48,
              height: 48,
              }}
          />
          </Header>
          {/* <Content
            style={{
                margin: '24px 16px',
                padding: 20,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
          >
            {content_map[selectedKey] || <div>No content found</div>}
          </Content> */}
        </Layout>
    </Layout>
  );
};

export default App;