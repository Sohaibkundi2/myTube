import express from 'express'
import dotenv from 'dotenv'
import mongoDB from './db/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
dotenv.config()

app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("Public"))
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

mongoDB()
.then(()=>{
    app.listen(PORT, ()=>{
    console.log(`server is listning on port ${PORT}`)
})
})
.catch((err)=>{
    console.log('err while connecting to DB', err)
})

export {app}