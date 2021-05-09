import express from 'express';
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
dotenv.config();

import authentication from './src/routers/authenticate.js';
import errorlogger from './src/utilities/errorlogger.js';

const app = express();


app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials:true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(morgan('tiny'));

// app.use(errorlogger)


app.use(cookieParser());

app.use(express.static(path.join(path.resolve('./'), 'public')))

// routers starts here
app.use(authentication);
// ends here


//url not found error handler: status 404
app.use((req, res, next) => res.status(404).json({ data: null,message:null,error_message: "Method not Allowed", status: 404}))

app.use(errorlogger)

const port = process.env.PORT || 3001;
app.listen(port,()=> console.log(`server is running in: http://localhost:${port}/\n`))