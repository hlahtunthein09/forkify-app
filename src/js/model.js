
import {API_URL, RES_PER_PAGE, KEY} from "./config.js";
// import { getJSON, sendJSON } from "./helper.js";
import { AJAX } from "./helper.js";

export const state = {
    recipe: {},
    bookMarks: [],
    search: {
      query: "",
      results: [],
      page: 1,
      resultPerPage: RES_PER_PAGE,
    }
};

const createRecipeObject = function(data)
{
        const {recipe} = data.data;
        return{
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients,
          ...(recipe.key && {key: recipe.key}),
        };
};

export const loadRecipe =async function(id){
      try{
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = createRecipeObject(data);

        if(state.bookMarks.some(book => book.id === id)) state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        
        console.log("recipe: ", state.recipe);
      }
      catch(err){
        // Temporary Error handling.
        console.error(`${err}💥💥💥💥`);
        throw err;
      }
};

// Load Search results
export const loadSearchResults = async function(query)
{
  try{
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log("Search Value: ", data);

    state.search.results = data.data.recipes.map(rec => {
      return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          ...(rec.key && {key: rec.key}),
      }
    });
    state.search.page = 1;
  }
  catch(err)
  {
    console.error(`${err}💥💥💥💥`);
    throw err;
  }
};

// as the result are loaded at this point, this func not gonna be a async func.
export const getSearchResultsPage = function(page = state.search.page)
{
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;  // 0
  const end = page * state.search.resultPerPage;  // 9

  return state.search.results.slice(start, end);
}

// Updating servings 
export const updateServings = function(newServings)
{ 
  state.recipe.ingredients.forEach(ing => {
    if(ing.quantity !== null)
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
      // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
}


// Persist bookmarks into localstorage
const persistBookmarks = function()
{
  localStorage.setItem("bookmarks", JSON.stringify(state.bookMarks));
}

// Add Bookmark function
export const addBookmark = function(recipe)
{
  // add bookmark
  state.bookMarks.push(recipe);

  // mark the current recipe as a bookmarked
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

// Delete Bookmark function
export const deleteBookmark = function(id)
{
  // Delete bookmark
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);

  // mark the current recipe as a NOT bookmarked
  if(id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

// retrieve the bookmarks from localstorage
const init = function()
{
  const storage = localStorage.getItem("bookmarks");
  // console.log("Storage: ", JSON.parse(storage));
  if(storage) state.bookMarks = JSON.parse(storage);
}

init();

// this is for only development purporse
const clearBookmarks = function()
{
  localStorage.clear("bookmarks");
}

// clearBookmarks();


// Function for uploading new recipes
export const uploadRecipe = async function(newRecipe) 
{
  try{
      const ingredients = Object.entries(newRecipe)
                                .filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
                                .map(ing => {
                                  // const ingArr = ing[1].replaceAll(" ", "").split(",");
                                  const ingArr = ing[1].split(",").map(el => el.trim());
                                  if(ingArr.length !== 3) 
                                      throw new Error("Wrong ingredient format! Please use the correct format :)");

                                  const [quantity, unit, description] = ingArr;

                                  return {quantity : quantity ? +quantity : null, unit, description};
                                });
       
      const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
      }
      
      const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
      state.recipe = createRecipeObject(data);
      addBookmark(state.recipe);
      }
      catch(err)
      {
        throw err;
      }

}