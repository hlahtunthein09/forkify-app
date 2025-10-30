import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

// for icon test
import iconsView from "./views/iconsView.js";
 
import 'core-js/stable';
import 'regenerator-runtime/runtime'


// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// Hot Module to maintain the current state.
// if(module.hot){
//   module.hot.accept();
// }

// Fetching
async function controlRecipes() {
  try{
    const id = window.location.hash.slice(1);
    // console.log("ID: ", id);

    if(!id) return;
    recipeView.renderSpinn();

    // 0) Update result view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    
    // 3)Updating bookmarks View
    bookmarksView.update(model.state.bookMarks);
    
    // 1. Loading recipe
    await model.loadRecipe(id);
    
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);

  }
  catch(err)
  {
    recipeView.renderError();
    console.error(err);
  }
}

// search Control
const controlSearchResults = async function() {
  try{
    resultView.renderSpinn();

    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

     // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render serach results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage()); // rendering page 1 as default

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);

  }
  catch(err)
  {
    console.error(err);
  }
};

// Control Pagination
const controlPagination = function(gotoPage)
{
  // 1) Render NEW results
  resultView.render(model.getSearchResultsPage(gotoPage));

  // 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
}

// control servings quantity
const controlServings = function(newServings)
{
  // Update the recipe servings (in state)
    model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);

}

// control for adding bookmark
const controlAddBookmark = function()
{
  // Add or Remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Bookmarks View
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookMarks);
}

const controlBookmarks = function()
{
  bookmarksView.render(model.state.bookMarks)
}

const controlAddRecipe = async function(newRecipe)
{
  try{

    // Show loading spinner
    addRecipeView.renderSpinn();

    // Upload the new Recipe data
    await model.uploadRecipe(newRecipe);
    console.log("🍰new Recipe: ", model.state.recipe);

    // Render new recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookMarks);

    // Change ID in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function(){
      addRecipeView.closeWindow();
      addRecipeView.restoreForm();
    }, MODAL_CLOSE_SEC * 1000);

  }
  catch(err)
  {
    console.error("❌", err);
    addRecipeView.renderError(err.message);
  }
}

const newFeature = function()
{
  console.log("Welcome to the application😍");
}

// initiate the project
const initiate = async function()
{
  // Load icons
  await iconsView.injectIcons();

  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log("Welcome!");
  newFeature();
}

initiate();
