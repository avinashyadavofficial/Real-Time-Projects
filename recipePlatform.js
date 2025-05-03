class RecipeStore {
  constructor() {
    this.recipes = new Map();
  }

  addRecipe(recipeName, recipeObject) {
    if (!this.recipes.has(recipeName)) {
      this.recipes.set(recipeName, new Set());
    }

    const recipeSet = this.recipes.get(recipeName);
    for (const r of recipeSet) {
      if (
        r.ingredients === recipeObject.ingredients &&
        r.instructions === recipeObject.instructions
      ) {
        console.log("Duplicate recipe");
        return false;
      }
    }

    recipeSet.add(recipeObject);
    return true;
  }

  getRecipesByName(recipeName) {
    return this.recipes.get(recipeName) || new Set();
  }

  getRecipeById(recipeName, recipeId) {
    const recipeSet = this.recipes.get(recipeName);
    if (!recipeSet) return null;
    return [...recipeSet].find(r => r.id === recipeId);
  }

  updateRecipe(recipeName, recipeId, chefId, newIngredients, newInstructions) {
    const recipe = this.getRecipeById(recipeName, recipeId);
    if (recipe && recipe.chefId === chefId) {
      recipe.ingredients = newIngredients;
      recipe.instructions = newInstructions;
      return true;
    }
    return false;
  }

  deleteRecipe(recipeName, recipeId, chefId) {
    const recipeSet = this.recipes.get(recipeName);
    if (!recipeSet) return false;
    for (const recipe of recipeSet) {
      if (recipe.id === recipeId && recipe.chefId === chefId) {
        recipeSet.delete(recipe);
        return true;
      }
    }
    return false;
  }
}

const recipeStore = new RecipeStore();

let recipeIdCounter = 1;

class Chef {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  addRecipe(recipeName, ingredients, instructions) {
    const recipe = {
      id: recipeIdCounter++,
      chefId: this.id,
      chefName: this.name,
      ingredients,
      instructions
    };
    return recipeStore.addRecipe(recipeName, recipe);
  }

  editRecipe(recipeName, recipeId, newIngredients, newInstructions) {
    return recipeStore.updateRecipe(
      recipeName,
      recipeId,
      this.id,
      newIngredients,
      newInstructions
    );
  }

  deleteRecipe(recipeName, recipeId) {
    return recipeStore.deleteRecipe(recipeName, recipeId, this.id);
  }

  getMyRecipes(recipeName) {
    const all = recipeStore.getRecipesByName(recipeName);
    return [...all].filter(r => r.chefId === this.id);
  }
}

class Viewer {
  viewRecipe(recipeName) {
    return [...recipeStore.getRecipesByName(recipeName)];
  }
}

const chef1 = new Chef(1, "Avinash");
const chef2 = new Chef(2, "Balaram");

chef1.addRecipe("Tea", "Water, tea leaves, milk, sugar", "Boil water, add tea leaves, milk, and sugar");
chef2.addRecipe("Tea", "Water, tea leaves, lemon", "Boil water, add tea leaves and lemon");
chef1.addRecipe("Maggie", "Maggie noodles, water, salt", "Boil maggie in water, put salt");
chef2.addRecipe("Maggie", "Maggie noodles, water, salt", "Boil maggie in water, put salt");

const viewer = new Viewer();
console.log("Tea recipes:", viewer.viewRecipe("Tea"));
console.log("Maggie recipes:", viewer.viewRecipe("Maggie"));

console.log(recipeStore.getRecipesByName("Tea"));
console.log("Chef recipe for Tea:", chef1.getMyRecipes("Tea"));

chef1.editRecipe("Tea", 1, "Water, tea leaves, ginger, milk, sugar", "Boil water, add tea leaves, ginger, milk, and sugar");
chef2.deleteRecipe("Tea", 2);

console.log("Chef recipe for Tea:", chef1.getMyRecipes("Tea"));
console.log("Tea recipes:", viewer.viewRecipe("Tea"));
