import React, { useState } from 'react'

import { FC } from 'react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

import { FileExcelOutlined, FileTextOutlined, FolderOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, type MenuProps } from 'antd';
import { ContentMap } from './ContentMap';

const { Content, Sider } = Layout;

const items: MenuProps['items'] = [
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
    label: 'Staff List',
    children: [
      {
        key: '21',
        icon: <FileTextOutlined/>,
        label: 'Mgmt & Orgs',
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
          label: 'AccFin',
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
        label: 'Ground Floor - CSI',
      },
      {
        key: '32',
        icon: <FileTextOutlined/>,
        label: 'Ground Floor - DA',
      },
      {
        key: '33',
        icon: <FileTextOutlined/>,
        label: 'Mgmt & Orgs',
      },
      {
        key: '34',
        icon: <FileTextOutlined/>,
        label: 'Economics',
      },
      {
        key: '35',
        icon: <FileTextOutlined/>,
        label: 'Marketing',
      },
      {
        key: '36',
        icon: <FileTextOutlined/>,
        label: 'AccFin',
      },
      {
        key: '37',
        icon: <FileTextOutlined/>,
        label: 'Dean',
      },
    ]
  },
  {
    key: '4',
    icon: <FolderOutlined/>,
    label: 'Rooms',
    children: [
      {
        key: '41',
        icon: <FileExcelOutlined />,
        label: 'Ground Floor - CSI',
      },
      {
        key: '42',
        icon: <FileExcelOutlined />,
        label: 'Ground Floor - DA',
      },
      {
        key: '43',
        icon: <FileExcelOutlined />,
        label: 'Mgmt & Orgs',
      },
      {
        key: '44',
        icon: <FileExcelOutlined />,
        label: 'Economics',
      },
      {
        key: '45',
        icon: <FileExcelOutlined />,
        label: 'Marketing',
      },
      {
        key: '46',
        icon: <FileExcelOutlined />,
        label: 'AccFin',
      },
      {
        key: '47',
        icon: <FileExcelOutlined />,
        label: 'Deanery-LVL 2',
      },
    ]
  },
  {
    type: 'divider' as const,
  },
  {
    key: '51',
    icon: <FileExcelOutlined />,
    label: 'Student Type',
  },
  {
    key: '61',
    icon: <FileExcelOutlined />,
    label: 'Staff Position',
  },
  {
    key: '71',
    icon: <FileExcelOutlined />,
    label: 'Staff Source',
  }
]

registerAllModules();

const MainContent : FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState<string>('11');


  return (
    <div>
    <Layout>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderInlineEnd: 0 }}
            onClick={({key}) => setSelectedKey(key)}
            items={items}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: 10,
            }}
          >
            {ContentMap[selectedKey] || <div>Under development...</div>}
          </Content>
        </Layout>
      </Layout>
    </Layout>


  </div>
  )
}

export { MainContent }
