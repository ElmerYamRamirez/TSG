import sql, { ConnectionPool } from 'mssql';

const config = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || '',
    database: process.env.DB_DATABASE || '',
    options: {
        trustServerCertificate: true,
    },
};

let pool: ConnectionPool | null = null;

export const connectToDatabase = async () => {
    if (pool) {
        return pool;
    }
    try {
        pool = await new sql.ConnectionPool(config).connect();
        console.log('✅ Connected to SQL Server');
        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};

export const executeQuery = async (query: string, params: {name: string, value: string | number | boolean | Date | Buffer | null}[] = []) => {
    const pool = await connectToDatabase();
    try {
        const request = pool.request();
        
        // Cambia esta parte para usar nombres de parámetros explícitos
        params.forEach(param => {
            request.input(param.name, param.value);
        });

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('❌ Error executing query:', error);
        throw error;
    }
};