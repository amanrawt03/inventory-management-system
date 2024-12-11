import pg from "pg";
const {Pool} = pg
const pool = new Pool({
    user: 'amanksi230', 
    host: 'localhost',
    database: 'my_pgdb', 
    password: 'Aman2003', 
    port: '5432'
});
export default pool