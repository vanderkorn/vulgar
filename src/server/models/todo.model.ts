// ```
// todo.model.ts
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// todo.model.ts may be freely distributed under the MIT license
// ```

// */app/models/todo.model.ts*

// # Todo Model

// Note: MongoDB will autogenerate an `_id` for each `Todo` object created

// Grab the Mongoose module
import mongoose = require('mongoose');

let Schema = mongoose.Schema;

interface ITodo {
  text: string;
}

export class Todo implements ITodo {
  text: string;

  constructor(data: ITodo) {
    this.text = data.text;
  }
}

// Create a `schema` for the `Todo` object
let todoSchema = new Schema({
  text: { required: true, type : String }
});

// Export `Document`
export interface TodoDocument extends Todo, mongoose.Document { }

// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export let Todos = mongoose.model<TodoDocument>('Todo', todoSchema);
