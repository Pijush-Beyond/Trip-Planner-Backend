import express from 'express';
import bodyParser from "body-parser";
import morgan from "morgan";
import handlebars from 'express-handlebars';
import errorlogger, { log } from 'express-errorlog';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import path from 'path';
import { readdirSync } from 'fs'

const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(morgan('tiny'));

app.use(errorlogger)


app.use(cookieParser());


app.use(authentication);
app.use(main);



app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    log.error(JSON.stringify(err, null, 2));
    console.log(err.stack);
  }
  res.status(err.status || 500).json(err)
})

const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`server is running in: http://localhost:${port}/\n`))