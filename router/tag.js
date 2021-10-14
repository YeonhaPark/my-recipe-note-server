import express from 'express';
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import * as recipeController from '../controller/recipes.js';

const router = express.Router();

router.get('/', isAuth, recipeController.getTags);

export default router;
