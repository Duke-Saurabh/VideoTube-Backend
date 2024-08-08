import dotenv from 'dotenv'
dotenv.config({path:'./.env'});

import { connectdb } from './src/dbs/dbs.connection.js';
import { app } from './src/app.js';

const port = process.env.PORT || 3000;
connectdb()
    .then(()=>{
        app.on('error', (error) => {
            console.error('Express is not able to talk to the database. Error:', error);
        });

        app.listen(port, () => {
            console.log(`Server is listening at PORT ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });


    