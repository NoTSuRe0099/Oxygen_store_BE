import dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });
export const { FRONTEND_URL } = process.env;
