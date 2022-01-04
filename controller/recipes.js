import * as recipeRepository from '../data/recipes.js';

/**
 * 들어오는 데이터, 보내지는 데이터에 대한
 *  백엔드 로직을 처리
 */

export async function getTags(req, res) {
  const result = await recipeRepository.getAllTags(req.userId, req.query.title);
  res.status(200).json(result);
}

export async function getRecipes(req, res) {
  const { title, tag } = req.query;
  if (!title && !tag) {
    const result = await recipeRepository.getAll(req.userId);
    res.status(200).json(result);
  } else {
    const result = await recipeRepository.getByTitle({
      userId: req.userId,
      title,
      tag,
    });
    res.status(200).json(result);
  }
}

export async function getRecipe(req, res) {
  const detail = await recipeRepository.getById(req.params.id);

  if (detail) {
    res.status(200).json(detail);
  } else {
    return res.status(404).json({ message: `Note ${req.params.id} not found` });
  }
}

export async function postRecipe(req, res) {
  const { userId } = req;
  const { title, ingredients, contents, tags } = req.body;
  const recipe = {
    userId,
    title,
    ingredients,
    contents,
    tags,
    createdAt: Date.now().toString(),
    modifiedAt: Date.now().toString(),
  };

  await recipeRepository.create(recipe);
  res.status(201).json(recipe);
}

export async function updateRecipe(req, res) {
  const { id } = req.params;
  const { body } = req;
  const updated = await recipeRepository.update(id, body);
  res.status(200).json(updated);
}

export async function deleteRecipe(req, res) {
  const { id } = req.params;
  if (id) {
    await recipeRepository.remove(id);
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: `Note ${req.params.id} not found` });
  }
}
