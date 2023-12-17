interface Ingredient {
    name: string,
    quantity: string
}

interface Recipe {
    name: string,
    ingredients: Ingredient[],
    instructions: string[]
}

class Recipes {
    private static recipes: Recipe[] = [];
    public static getAll() {
        return this.recipes;
    }
    public static create(recipe: Recipe) {
        this.recipes.push(recipe);
    }
    public static delete(name: string) {
        this.recipes = this.recipes.filter((recipe) => recipe.name !== name);
    }
}

function recipeToString(recipe: Recipe) {
    const ingredients = recipe.ingredients.map((ingredient) => `- ${ingredient.quantity} ${ingredient.name}`).join('\n');
    return `${recipe.name}\nIngredients:\n${ingredients}\nInstructions:\n${recipe.instructions.join('\n')}`;
}