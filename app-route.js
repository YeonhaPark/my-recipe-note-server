import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import morgan from 'morgan'; // 사용자에게 받은 요청에 대해 매번 console해줄 필요 없이 자동으로 로그 생성 https://github.com/expressjs/morgan
import helmet from 'helmet'; // 공통적으로 보안에 필요한 헤더들을 추가해줌
import 'express-async-errors';
import postRouter from './router/post.js';
import tagRouter from './router/tag.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import db from './models/index.js';
import './services/passport.js';

const app = express();
const whitelist = [
  'http://localhost:3000',
  'https://my-recipe-note-app.netlify.app',
];

const corsOptions = {
  origin: whitelist,
  credentials: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  allowedHeaders:
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // how long this cookie could exist in browser
    keys: [config.auth.cookieKey],
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false })); // HTML form으로 제출했을때 그떄 받은 폼을 body 안에 자동으로 파싱해줌.
app.use(helmet());

app.use('/', authRouter);
app.use('/recipes', postRouter);
app.use('/tags', tagRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});
db.sequelize.sync().then(() => {
  console.log(`Server started...${new Date()}`);
  app.listen(config.port);
});
