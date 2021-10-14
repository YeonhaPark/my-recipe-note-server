import express from 'express';
import { body } from 'express-validator';
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import * as recipeController from '../controller/recipes.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const validateRecipe = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 50 })
    .withMessage('Title length cannot exceed 50 letters'),
  body('contents').notEmpty().withMessage('Content is required'),
  validate,
];
router.get('/', isAuth, recipeController.getRecipes);

router.get('/:id', isAuth, recipeController.getRecipe);

router.post('/', isAuth, validateRecipe, recipeController.postRecipe);

router.put('/:id', isAuth, validateRecipe, recipeController.updateRecipe);

router.delete('/:id', isAuth, recipeController.deleteRecipe);

export default router;
