import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Store } from '../../reducers/types';
import Routes from '../../Routes';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ConfigProvider locale={zhCN}>
        <Routes />
      </ConfigProvider>
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
