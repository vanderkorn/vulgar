const crypto = require('crypto');

import { ServerEvent, IServerEvent } from './event.handler';

/**
 * Handler
 *
 * @interface IHandler
 */
interface IHandler {
  id: string;
  eventEmitter: ServerEvent.EventEmitter;
}

/**
 * Handler
 *
 * @class Handler
 */
export default class Handler implements IHandler {
  id: string;
  eventEmitter: ServerEvent.EventEmitter;

  /**
   * Constructor
   *
   * @class Handler
   * @constructor
   */
  constructor(eventEmitter: ServerEvent.EventEmitter) {
    // Generate a unique id for this event handler
    this.id = this.generateHandlerId(7);
    // Grab the passed in reference to the server `EventEmitter`
    this.eventEmitter = eventEmitter;
  }

  /**
   * Generate a random value in hexadecimal format
   *
   * @class Handler
   * @method generateHandlerId
   * @private
   * @param {number} length [8] - the length of the generated id
   * @return {string} - Generated hexadecimal value
   */
  private generateHandlerId(length: number = 8) {
    return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex')   // convert to hexadecimal format
      .slice(0, length); // return required number of characters
  }

  /**
   * Execute the emitted callback function
   *
   * @class Handler
   * @method onHandle
   * @protected
   * @param {IServerEvent} e - the emitted server event to be handled
   * @param {any} cb - the emitted callback function to be handled
   * @return void
   */
  protected onHandle(e: IServerEvent, cb: any) {
    if(cb)
      cb();
  }
}
