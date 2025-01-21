import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'gkV442y7UbB5WBHzqxznQjy9WQmnUF6K',
    socket: {
        host: 'redis-11272.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11272
    }
});

client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
export default client

