import { async } from 'regenerator-runtime';
import { API_URL, PAGE_NUMBER, KEY } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: +1,
    resultsPerPage: PAGE_NUMBER,
  },
  bookmarks: [],
};

const createJsonObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    image: recipe.image_url,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // const res = await fetch(`${API_URL}/${id}`);
    // const data = await res.json();

    // if (!res.ok) throw new Error(data.message);
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createJsonObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
    // console.log(state.bookmarks);
  } catch (err) {
    console.error(err);
    throw `this is from the model ${err}`;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    const { recipes } = data.data;
    state.search.result = recipes.map(res => {
      return {
        id: res.id,
        image: res.image_url,
        publisher: res.publisher,
        title: res.title,
        ...(res.key && { key: res.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResult = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // console.log(state.search.page);

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // console.log(recipe);
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadeRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));

  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ings = ing[1].replaceAll(' ', '').split(',');
        const ings = ing[1].split(',').map(ee => ee.trim());
        if (ings.length !== 3) {
          throw new Error(
            'wrong ingradient format! Please use the correct format :)'
          );
        }
        const [quantity, unit, description] = ings;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      // id: newRecipe.id,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createJsonObject(data);
    // console.log(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
