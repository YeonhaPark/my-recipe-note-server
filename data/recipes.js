import Sequelize from 'sequelize';
import db from '../models/index.js';

const { Ingredient, Tag, Recipe } = db;
const { Op } = Sequelize;

const ATTR = {
  attributes: ['id', 'title', 'contents', 'createdAt', 'updatedAt'],
};

const INCLUDE = {
  include: [
    {
      model: Ingredient,
      as: 'ingredients',
      attributes: ['id', 'isChecked', 'name'],
    },
    { model: Tag, as: 'tags', attributes: ['id', 'title'] },
  ],
};

const ORDER = { order: [['createdAt', 'DESC']] };

export async function getAllTags(userId, title) {
  if (title) {
    return Tag.findAll({
      attributes: ['id', 'title'],
      include: {
        attributes: [],
        model: Recipe,
        where: {
          UserId: userId,
          title: { [Op.like]: `%${title}%` },
        },
      },
    });
  } else {
    return Tag.findAll({
      attributes: ['id', 'title'],
      include: {
        attributes: [],
        model: Recipe,
        where: { UserId: userId },
      },
    });
  }
}

export async function getAll(userId) {
  return Recipe.findAll({
    ...ATTR,
    ...INCLUDE,
    where: { UserId: userId },
    ...ORDER,
  });
}

export async function getById(id) {
  return Recipe.findOne({ ...ATTR, ...INCLUDE, where: { id } });
}

export async function getByTitle({ userId, title, tag }) {
  if (title && tag) {
    return Recipe.findAll({
      where: {
        UserId: userId,
        title: {
          [Op.like]: `%${title}%`,
        },
      },
      include: {
        model: Tag,
        as: 'tags',
        where: { title: tag },
      },
    });
  } else if (title) {
    return Recipe.findAll({
      where: {
        UserId: userId,
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    });
  } else if (tag) {
    return Recipe.findAll({
      where: {
        UserId: userId,
      },
      include: {
        model: Tag,
        as: 'tags',
        where: { title: tag },
      },
    });
  }
}

export async function create(recipe) {
  const { title, contents, ingredients, tags, userId } = recipe;
  const createdRecipe = await Recipe.create({
    title,
    contents,
    UserId: userId,
  });

  if (ingredients) {
    const result = await Promise.all(
      ingredients.map((ingredient) => {
        return Ingredient.findOrCreate({
          where: { name: ingredient.name },
          defaults: { isChecked: false },
        });
      })
    );
    await createdRecipe.addIngredients(result.map((r) => r[0]));
  }
  if (tags) {
    const result = await Promise.all(
      tags.map((tag) => {
        return Tag.findOrCreate({ where: { title: tag.title } });
      })
    );

    await createdRecipe.addTags(result.map((r) => r[0]));
  }
  return createdRecipe;
}

export async function update(id, recipe) {
  const { title, contents, ingredients, tags } = recipe;
  const updatedRecipe = await Recipe.findOne({ where: { id } });
  await Recipe.update({ title, contents }, { where: { id } });

  const recipeIngredients = await Ingredient.findAll({
    include: {
      model: Recipe,
      where: { id },
    },
  });
  const newIngredients = ingredients.map((igr) => igr.name);
  recipeIngredients.forEach(async (rcIngredient) => {
    if (!newIngredients.includes(rcIngredient.dataValues.name)) {
      await updatedRecipe.removeIngredient(rcIngredient);
    }
  });

  if (ingredients) {
    const updatedIngs = await Promise.all(
      ingredients.map((ing) => {
        return Ingredient.findOne({ where: { name: ing.name } }).then(function (
          obj
        ) {
          const newIngVal = {
            ...obj,
            isChecked: ing.isChecked,
          };
          if (obj) {
            return obj.update(newIngVal);
          } else {
            return Ingredient.create(ing);
          }
        });
      })
    );
    if (updatedIngs) await updatedRecipe.addIngredients(updatedIngs);
  }

  const recipeTags = await Tag.findAll({
    include: {
      model: Recipe,
      where: { id },
    },
  });
  const newTags = tags.map((tag) => tag.title);
  recipeTags.forEach(async (rcTags) => {
    if (!newTags.includes(rcTags.dataValues.title)) {
      await updatedRecipe.removeTag(rcTags);
    }
  });
  if (tags) {
    const result = await Promise.all(
      tags.map((tag) => {
        return Tag.findOrCreate({ where: { title: tag.title } });
      })
    );
    if (result) await updatedRecipe.addTags(result.map((r) => r[0]));
  }
}

export async function remove(id) {
  return Recipe.findByPk(id).then((recipe) => recipe.destroy());
}
