import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const { auth } = config;
function createJwtToken(id) {
  return jwt.sign({ id }, auth.jwtSecret, { expiresIn: auth.jwtExpiresSec });
}

export async function signup(req, res) {
  const { username, password } = req.body;
  if (await userRepository.findByUsername(username)) {
    // 에러 뱉기. 이미 가입한 회원임.
    return res.status(409).json({ message: `${username} already exists` });
  } else {
    const hashed = await bcrypt.hash(password, auth.bcryptSaltRounds);

    const userId = await userRepository.createUser({
      username,
      password: hashed,
    });

    const token = createJwtToken(userId);
    res.status(200).json({ token, username });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);
    if (!user) {
      // 에러뱉기. 가입하지 않은 회원임.
      return res.status(401).json({ message: 'Invalid user or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid user or password' });
    }
    const token = createJwtToken(user.id);
    res.status(201).json({ token, username });
  } catch (err) {
    console.error(err);
  }
}

export async function isMe(req, res) {
  try {
    const user = await userRepository.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res
      .status(200)
      .json({ token: req.token, username: user.username, userId: user.userId });
  } catch (error) {
    console.error(error);
  }
}
