import {ApolloClient, InMemoryCache} from '@apollo/client';

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:4000/',
    headers:{
        authorization : localStorage.getItem('token') || '',
        'client-name': 'ac3-todos-backend',
        'client-version': '1.0.0',
    },
    connectToDevTools: true,
})


export default client;