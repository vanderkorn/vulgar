import * as express from 'express';
import * as passport from 'passport';
// Load `User` `interfaces`, `class`, and `model`
import { IUser, User, UserDocument, Users } from '../models/user.model';

import Router from './router';

// Load the Mongoose ObjectId function to cast string as
// ObjectId
let ObjectId = require('mongoose').Types.ObjectId;

const BASE_URI = '/auth';

module Route {

  export class Routes extends Router {

    passport: any;
    auth: any;
    admin: any;

    constructor(app: express.Application,
                router: express.Router,
                passport: any,
                auth: any,
                admin: any) {
      super(app, router, User);
      this.passport = passport;
      this.auth = auth;
      this.admin = admin;
      // Configure our router;
      this.config();
    }

    private authenticate(req: express.Request,
                         res: express.Response) {
      // If the user is authenticated, return a `user` session object
      // else return `0`
      res.send(req.isAuthenticated() ? req.user : '0');
    }

    private config() {
      let router = super.getRouter();
      // Configure routes
      router.route(`${BASE_URI}/authenticate`)
        .get((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          this.authenticate(req, res);
        });
      router
        .delete(`${BASE_URI}/delete/:uid`, this.admin, (req: express.Request,
                                                        res: express.Response) => {
          this.delete(req, res);
        });
      router.route(`${BASE_URI}/login`)
        .post((req, res, next) => {
          this.login(req, res, next);
        });
      router.route(`${BASE_URI}/logout`)
        .post((req, res, next) => {
          this.logout(req, res);
        });
      router.route(`${BASE_URI}/register`)
        .post((req, res, next) => {
          this.register(req, res, next);
        });
      router
        .get(`${BASE_URI}/session`, this.auth, (req: express.Request,
                                                res: express.Response) => {
          this.getSessionData(req, res);
        });
    }

    private delete(req: express.Request,
                   res: express.Response) {
      Users.remove({
        // Model.find `$or` Mongoose condition
        $or : [
          { 'local.username' : req.params.uid },
          { 'local.email' : req.params.uid },
          { '_id' : ObjectId(req.params.uid) }
        ]
      }, (err: any) => {
        // If there are any errors, return them
        if (err)
          res.json(err);
        // HTTP Status code `204 No Content`
        res.sendStatus(204);
      });
    }

    private getSessionData(req: express.Request,
                           res: express.Response) {
      // Send response in JSON to allow disassembly of object by functions
      res.json(req.user);
    }

    private login(req: express.Request,
                  res: express.Response,
                  next: express.NextFunction) {
      // Call `authenticate()` from within the route handler, rather than
      // as a route middleware. This gives the callback access to the `req`
      // and `res` object through closure.
      // If authentication fails, `user` will be set to `false`. If an
      // exception occured, `err` will be set. `info` contains a message
      // set within the Local Passport strategy.
      passport.authenticate('local-login', (err: any, user: User, info: any) => {
        if (err)
          return next(err);
        // If no user is returned...
        if (!user) {
          // Set HTTP status code `401 Unauthorized`
          res.status(401);
          // Return the info message
          return next(info.message);
        }
        // Use login function exposed by Passport to establish a login
        // session
        req.login(user, (err: any) => {
          if (err)
            return next(err);
          // Set HTTP status code `200 OK`
          res.status(200);
          // Return the user object
          res.send(req.user);
        });
      }) (req, res, next);
    }

    private logout(req: express.Request,
                   res: express.Response) {
      req.logOut();
      // Even though the logout was successful, send the status code
      // `401` to be intercepted and reroute the user to the appropriate
      // page
      res.sendStatus(401);
    }

    private register(req: express.Request,
                     res: express.Response,
                     next: express.NextFunction) {
      // Call `authenticate()` from within the route handler, rather than
      // as a route middleware. This gives the callback access to the `req`
      // and `res` object through closure.
      // If authentication fails, `user` will be set to `false`. If an
      // exception occured, `err` will be set. `info` contains a message
      // set within the Local Passport strategy.
      passport.authenticate('local-signup', (err: any, user: User, info: any) => {
        if (err)
          return next(err);
        // If no user is returned...
        if (!user) {
          // Set HTTP status code `409 Conflict`
          res.status(409);
          // Return the info message
          return next(info.message);
        }
        // Set HTTP status code `204 No Content`
        res.sendStatus(204);
      }) (req, res, next);
    }
  }
}

export = Route;
