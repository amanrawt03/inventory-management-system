import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '',
    socket: {
        host: '',
        port: 
    }
});

client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
export default client

