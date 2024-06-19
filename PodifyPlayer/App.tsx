import AppContainer from '@components/AppContainer';
import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import Navigator from 'src/navigation';
import store from 'src/store';

const client = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <AppContainer>
          <Navigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
