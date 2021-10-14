import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; // 사용자에게 받은 요청에 대해 매번 console해줄 필요 없이 자동으로 로그 생성 https://github.com/expressjs/morgan
import helmet from 'helmet'; // 공통적으로 보안에 필요한 헤더들을 추가해줌
import 'express-async-errors';
import postRouter from './router/post.js';
import tagRouter from './router/tag.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import db from './models/index.js';

const app = express();
const corsOptions = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};
// 미들웨어 등록
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false })); // HTML form으로 제출했을때 그떄 받은 폼을 body 안에 자동으로 파싱해줌.
app.use(cors());
app.use(helmet());

const options = {
  dotfiles: 'ignore',
  etag: false,
  index: false,
  maxAge: 'id',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  },
};
app.use(express.static('public', options)); // 사용자가 public 폴더 안에 있는 리소스에 접근이 가능함

app.use('/recipes', postRouter);
app.use('/tags', tagRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

db.sequelize.sync({ force: false }).then(() => {
  console.log(`Server started...${new Date()}`);
  app.listen(config.port);
});
