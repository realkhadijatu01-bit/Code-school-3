const SEARCH_API_URL = "";
const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsGrid = document.getElementById("results-grid");
const messageArea = document.getElementById("message-area");
const randomButton = document.getElementById("random-button");

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim()

    if(searchTerm) {
       searchRecipes(searchTerm); 
    } else {
        showMessage("please enter a search term", true);
    } 
})

async function searchRecipes(query) {
    showMessage(`Searching for "${query}"...`, false, true);
    resultsGrid.innerHTML = "";

    try {
      const response = await fetch(`${"SEARCH_API_URL"}${"query"}`);
      console.log(response);
      if (!response.ok) throw new Error("Network error"); 

      const data = await response.json();
      clearMessage();
      console.log("data:", data);

      if(data.meals) {
        displayRecipes(data.meals);
      } else {
        showMessage(`No recipes found for "${query}", `);
      }
    } catch (error) {
       showMessage("Something ent wrong, Please try again.", true); 
    }
}

function showMessage(message, isError=false, isLoading=false) {
    messageArea.textContent = message;
    if (isError) messageArea.classList.add("error");
    if (isLoading) messageArea.classList.add("loading");
}

function clearMessage() {
    messageArea.textContent = "";
    messageArea.className = "message";
}

function displayRecipes(recipes) {
    if (!recipes || recipes.lenght === 0) {
     showMessage("No recipes to display");
     return; 
    }

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe-item");

        recipeDiv.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
        <h3>${recipe.strMeal}</h3>
        `;
        
        resultsGrid.appendChild(recipeDiv);
    });
}

randomButton.addEventListener("click", getRandomRecipe);

async function getRandomRecipe() {
    showMessage("Getting random recipe...", false, true);
    resultsGrid.innerHTML = "";

    try {
       const response = await fetch(RANDOM_API_URL);
      if (!response.ok) throw new Error("Something went wrong.");
      const data = await response.json(); 

      clearMessage();

      if(data.meals && data,meals.lenght > 0 ) {
        displayRecipes(data.meals);
      } else {
        showMessage("Could not get a random recipe. Please try again.", true);
      }

    } catch (error) {
       showMessage("Failed to get a random recipe. Please check your connection and try again", true); 
    }
}