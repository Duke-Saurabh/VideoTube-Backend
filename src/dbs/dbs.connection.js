import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

const connectdb = async () => {
    try {
        const uri = `${process.env.MONGODB_CONNECT}/${process.env.DB_NAME}`;
        const response = await mongoose.connect(uri);
        if (!response) {
            throw new Error('Unable to connect to the database');
        }
        console.log('Host:', response.connections[0].host);
        return response;
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw new Error('Failed to connect to the database');
    }
};
export {connectdb};