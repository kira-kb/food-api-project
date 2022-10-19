import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // inserting spinner
    recipeView.renderSpiner();

    resultsView.update(model.getSearchResult());
    bookmarksView.update(model.state.bookmarks);
    // ajax call for fetching api
    await model.loadRecipe(id);

    // rendering recipe contents
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.error(err);
    recipeView.renderError();
  }
};

const controlLists = async function () {
  try {
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpiner();

    await model.loadSearchResult(query);

    // resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResult());
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
    console.log(err);
  }
};

// console.log('the console works');

const controlPagenation = function (goto) {
  resultsView.render(model.getSearchResult(goto));
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  model.updateServings(newServing);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpiner();

    await model.uploadeRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);

  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandleSearch(controlLists);
  paginationView.addHandlerClick(controlPagenation);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
