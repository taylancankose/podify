import AppContainer from '@components/AppContainer';
import React from 'react';
import {Provider} from 'react-redux';
import Navigator from 'src/navigation';
import store from 'src/store';

function App() {
  return (
    <Provider store={store}>
      <AppContainer>
        <Navigator />
      </AppContainer>
    </Provider>
  );
}

export default App;
