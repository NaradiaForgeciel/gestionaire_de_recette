import { confirm, input, select } from "@inquirer/prompts";

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

const instructionConfig = {
    message: 'What do you want to do?',
    choices: [
        {
            name: 'Get All',
            value: 'get_all',
            description: 'Returns all the recipes in the command line'
        },
        {
            name: 'Create',
            value: 'create',
            description: 'Create a new recipe'
        },
        {
            name: 'Delete',
            value: 'delete',
            description: 'Delecte a recipe'
        },
        {
            name: 'Exit',
            value: 'exit',
            description: 'Exit the program'
        }
    ]
}

async function main() {
    while(true) {
        const instruction = await select(instructionConfig);
        if(instruction === 'exit') break;

        if(instruction === 'get_all') {
            console.log(Recipes.getAll().map(recipeToString).join('\n\n'));
        }else if(instruction === 'create') {
            const name = await input({ message: 'What is the name of the new recipe ?' });
            const ingredients: Ingredient[] = [];

            while(await confirm({ message: 'Do you want to add a new ingredient' })) {
                const ingredientName = await input({ message: 'What is the name of the new ingredient' });
                const ingredientQuantity = await input({ message: `How much of ${ingredientName} is needed ?`});
                ingredients.push({ name: ingredientName, quantity: ingredientQuantity });
            }

            const instructions: string[] = [];

            while(await confirm({ message: 'Do you want to add a new instruction'})) {
                instructions.push(await input({ message: 'The new instruction to add: '}));
            }

            Recipes.create({ name, ingredients, instructions });
            console.log(`Recipe ${name} created`);
        }else if(instruction === 'delete') {
            const toDelete = await select({
                message: 'Which recipe do you want to delete',
                choices: [
                    { name: 'Cancel', value: 'cancel', description: 'Cancels the delection of a recipe' },
                    ...Recipes.getAll().map((recipe) => ({
                        name: recipe.name, value: recipe.name
                    }))
                ]
            });
            if(toDelete === 'cancel') continue;
            Recipes.delete(toDelete);
            console.log(`Recipe ${toDelete} deleted !`);
        }
    }
    console.log('Goodbye !');
}
main();