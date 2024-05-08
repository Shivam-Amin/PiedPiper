import { app } from './app.js' 
import db from './models/index.js';
import { v4 as uuidv4 } from 'uuid';
import {config} from 'dotenv';
import { cloudinaryConnect } from './db/connectCloudinary.js';

config({ 
  path: './.env' 
});


const port = process.env.PORT || 5000;


const start = async () => {
  try {  
    // Just to make db stay sync with the development.
    await db.sequelize.sync();
    await cloudinaryConnect();
    console.log('Sync db');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`)
    })
  } catch (error) {
    console.log(error);
  }
}

start();


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//     // console.log(path.resolve());
//     // console.log(path.resolve(__dirname, 'client', 'build', 'index.html'))
// }) 