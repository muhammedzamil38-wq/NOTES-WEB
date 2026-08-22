import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from './configures/mongodb.js'
import userRouter from './routes/userRoutes.js'
import notesRouter from './routes/notesRoutes.js'

const app =express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 3000;

app.use('/api/user', userRouter);
app.use('/api/notes', notesRouter);

app.listen(port, ()=>{
    console.log("Server is running on port " + port)
})