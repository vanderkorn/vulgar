// ```
// _validation.router.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// _validation.router.js may be freely distributed under the MIT license
// ```

// */app/routes/_validation.router.js*

// GET    */api/validate/username/:username*   Find `user` by `username`

// ## Validation API object

// Load user model
import User from '../models/user.model.js';

export default (app, router, passport, auth, admin) => {

  // ### Validation API Routes

  router.route('/validate/username/:username')

    // Accessed at GET http://localhost:8080/api/user/:username
    .get((req, res) => {

      // Use mongoose to a single user item by username in the database
      User.findOne({ 'local.username': req.params.username }, (err, user) => {

        if(err) {
          /// DEBUG
          /// TODO: Remove this DEBUG statement
          console.log(err);
          res.send(err);
        }

        else {
          // If no user was found with a matching username
          if(user === null) {
            // Set a `HTTP` status code of `404` `Not Found`
            res.status(404);
            // Send our validation object
            res.json({ usernameTaken: false });
          // If a user was found with a matchin username
          } else {
            // Set a `HTTP` status code of `409` `Conflict`
            res.status(409);
            // Send our validation object
            res.json({ usernameTaken: true });
          }
        }
      });
    })
};
