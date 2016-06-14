// ```
// user.model.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// user.model.js may be freely distributed under the MIT license
// ```

// */app/models/user.model.js*

// ## User Model

// Note: MongoDB will autogenerate an _id for each User object created

// Grab the Mongoose module
import mongoose = require('mongoose');

// Import library to hash passwords
import * as bcrypt from 'bcrypt-nodejs';

let Schema = mongoose.Schema;

export interface IUser {
  local: {
    username: string;
    password: string;
    email: string;
  };
  role: string;
  _id: any;
}

export class User implements IUser {
  local: {
    username: string;
    password: string;
    email: string;
  };
  role: string;
  _id: any;

  constructor(data: IUser, role: string) {
    this.local.username = data.local.username;
    this.local.password = data.local.password;
    this.local.email = data.local.email;
    this.role = data.role || '';
  }

  generateHash(password): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };

  validPassword(password): boolean {
    return bcrypt.compareSync(password, this.local.password);
  };
}

// Define the schema for the showcase item
let userSchema = new Schema({

  local : {

    username : { type : String, unique : true },

    password : String,

    email : { type : String, unique : true }
  },

  role : { type : String }
});

// Register methods
userSchema.method('generateHash', User.prototype.generateHash);
userSchema.method('validPassword', User.prototype.validPassword);

// Export `Document`
export interface UserDocument extends User, mongoose.Document { }

// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export let Users = mongoose.model<UserDocument>('User', userSchema);
