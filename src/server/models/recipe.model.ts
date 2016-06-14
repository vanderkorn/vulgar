// ```
// recipe.model.ts
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// recipe.model.js may be freely distributed under the MIT license
// ```

// */app/models/recipe.model.ts*

// # Recipe Model

// Note: MongoDB will autogenerate an `_id` for each `Recipe` object created

// Grab the Mongoose module
import mongoose = require('mongoose');

let Schema = mongoose.Schema;

interface IRecipe {
  title: string;
  tags: Array<any>;
  rating: number;
  creator: string;
  description: string;
  ingredients: {
    amount: string;
    unit: string;
    name: string;
  };
  directions: Array<any>;
}

export class Recipe implements IRecipe {
  title: string;
  tags: Array<any>;
  rating: number;
  creator: string;
  description: string;
  ingredients: {
    amount: string;
    unit: string;
    name: string;
  };
  directions: Array<any>;

  constructor(data: IRecipe) {
    this.title = data.title;
    this.tags = data.tags;
    this.rating = data.rating;
    this.creator = data.creator;
    this.description = data.description;
    this.ingredients = data.ingredients;
    this.directions = data.directions;
  }
}

// Create a `schema` for the `Todo` object
let recipeSchema = new Schema({
  title: { type : String },
  tags: { type: Array },
  rating: { type: Number},
  creator: { type: String},
  description: { type : String },
  ingredients: [{
    amount: {
      type: String
    },
    unit: {
      type: String
    },
    name: {
      type: String
    }
  }],
  directions: { type: Array }
});

// Export `Document`
export interface RecipeDocument extends Recipe, mongoose.Document { }

// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export let Recipes = mongoose.model<RecipeDocument>('Recipe', recipeSchema);
