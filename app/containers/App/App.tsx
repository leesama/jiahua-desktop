import React, { ReactNode, useCallback, useState, useMemo } from 'react';
import { Layout, Menu, Breadcrumb, Button, Spin } from 'antd';
import {
  PieChartOutlined,
  SettingOutlined,
  HomeOutlined,
  MinusOutlined,
  CloseOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BorderOutlined
} from '@ant-design/icons';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './App.less';

const currentWindow = remote.getCurrentWindow();
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const minimizeWindow = () => {
  currentWindow.minimize();
};
const maximizeWindow = () => {
  currentWindow.isMaximized()
    ? currentWindow.unmaximize()
    : currentWindow.maximize();
};
const hideWindow = () => {
  currentWindow.hide();
};

const App: React.FC<{ children: ReactNode }> = (props: Props) => {
  const { children } = props;
  const history = useHistory();
  const spin = useSelector<StoreState, boolean>(state => state.common.spinning);
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState<string[]>([]);
  // 跳转并设置标题
  const redirectTo = useCallback(
    ({ item, key }: ClickParam) => {
      const titleArr = [];

      // 如果有父节点
      if (typeof item.props.children === 'string') {
        const parentTitle = item.node.parentNode?.previousSibling?.textContent;
        if (parentTitle) {
          titleArr.push(parentTitle);
        }
        titleArr.push(item.props.children);
      } else {
        item.node.textContent && titleArr.push(item.node.textContent);
      }
      history.push(key);
      setTitle(titleArr);
    },
    [history]
  );
  return (
    <Layout style={{ height: '100%' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logo}>
          <HomeOutlined />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          onClick={redirectTo}
        >
          <Menu.Item key="/equipmentadd">
            <PieChartOutlined />
            <span>录入设备</span>
          </Menu.Item>
          <Menu.Item key="/equipmentStatistics">
            <PieChartOutlined />
            <span>设备统计</span>
          </Menu.Item>
          <SubMenu
            key="设备"
            title={
              <span>
                <SettingOutlined />
                <span>设备设置</span>
              </span>
            }
          >
            <Menu.Item key="/equipmentmannage">管理设备</Menu.Item>
            <Menu.Item key="/tagmannage">管理设备表单项</Menu.Item>
            <Menu.Item key="/tagadd">新增设备表单项</Menu.Item>
          </SubMenu>
          <SubMenu
            key="维修记录"
            title={
              <span>
                <SettingOutlined />
                <span>维修记录设置</span>
              </span>
            }
          >
            <Menu.Item key="/repairmannage">管理维修记录表单项</Menu.Item>
            <Menu.Item key="/repairadd">新增维修记录表单项</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className={styles['site-layout-background']}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.trigger,
              onClick: () => {
                setCollapsed(!collapsed);
              }
            }
          )}
          <div>
            <Button
              icon={<MinusOutlined />}
              size="large"
              className={styles['btn-color']}
              onClick={minimizeWindow}
              type="link"
            />
            <Button
              icon={<BorderOutlined />}
              size="large"
              className={styles['btn-color']}
              onClick={maximizeWindow}
              type="link"
            />
            <Button
              icon={<CloseOutlined />}
              size="large"
              className={styles['btn-color']}
              onClick={hideWindow}
              type="link"
            />
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }} className={styles.changeAntdSpin}>
          <Breadcrumb style={{ margin: '16px' }}>
            {title.map(i => (
              <Breadcrumb.Item key={i}>{i}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Spin spinning={spin} size="large">
            <div className={styles.content}>{children}</div>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
type Props = {
  children: ReactNode;
};
interface ClickParam {
  key: string;
  keyPath: Array<string>;
  item: {
    props: { children: string };
    node: HTMLElement;
  };
  domEvent: Event;
}
