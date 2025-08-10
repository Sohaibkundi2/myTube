import express from 'express'
import dotenv from 'dotenv'
import mongoDB from './db/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
dotenv.config()

app.use(cors({
  origin: [
    'https://my-tube-red.vercel.app/', 
    'http://localhost:5173'             
  ],
  credentials: true
}));

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


// routes
import userRoute from './routes/user.route.js'
import tweetRoute from './routes/tweet.route.js'
import videoRoute from './routes/video.route.js'
import commentRoute from './routes/comment.route.js'
import likeRoute from './routes/like.route.js'
import dashboardRoute from './routes/dashboard.route.js'
import subscriptionRoute from './routes/subscription.route.js'
import playlistRoute from "./routes/playlist.route.js"
import errorHandler from './middlewares/errorHandler.js'

app.use('/api/v1/users', userRoute)
app.use('/api/v1/tweets', tweetRoute)
app.use('/api/v1/videos', videoRoute)
app.use('/api/v1/comments', commentRoute)
app.use('/api/v1/likes', likeRoute)
app.use('/api/v1/dashboard', dashboardRoute)
app.use('/api/v1/subscriptions', subscriptionRoute)
app.use("/api/v1/playlists", playlistRoute)


app.use(errorHandler);
export {app}