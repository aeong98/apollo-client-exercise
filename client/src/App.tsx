import React from 'react';
import {ApolloProvider} from '@apollo/client';
import 'todomvc-app-css/index.css'


import MainContainer from './components/containers/MainContainer';
import client from './apollo/client';

const App = () => (
  (
      <>
      <ApolloProvider client={client}>
        <MainContainer/>
      </ApolloProvider>
      </>
  )
);
export default App;