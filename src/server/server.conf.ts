
// Reference: https://nodejs.org/api/cluster.html
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Load Socket.io
import * as socketio from 'socket.io';
import socketBase from './sockets/base.socket';

// Import utility functions
let onError = require('./utils/on-error.util');
import {normalizePort} from './utils/normalize-port.util';

// Node Env Variables
// Load Node environment variable configuration file
import {validateEnvVariables} from '../../config/env.conf';

export interface IServerEvent {
  type: string,
  from: string,
  data?: any
}

export enum ServerEvent {
  NotifyRequest = 0x1,
  WorkerInitialized = 0x2,
  WorkerShutdown = 0x4,
  RestartWorkers = 0x6
}

export enum Error {
  BadEventCode = 0x1
}

export namespace Error {
  export function getErrorMessage(error: Error) {
    switch (error) {
      case Error.BadEventCode:
        return 'Unexpected server event code';
    }
  }
}

// Set up appropriate environment variables if necessary
validateEnvVariables();

if (cluster.isMaster && process.env.MULTITHREADING) {
  // Keep track of http requests
  var numReqs = 0;

  for (var i = 0; i < numCPUs; i++) {
    console.log(`{${process.pid}} - Forking cluster...`);
    fork();
  }

  Object.keys(cluster.workers).forEach((id) => {
    cluster.workers[id].on('message', messageHandler);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    for(let i = 5; i > 0; i--) {
      setTimeout(function() {
        console.log(`Starting a new worker in ${i} seconds...`);
      }, 1000);
    }
    console.log('Starting a new worker NOW');
    fork();
  });

  console.log(`Cluster forked into ${numCPUs} workers!`);
} else {

  // Module Dependencies
  const app = require('./app');
  const debug = require('debug')('express:server');
  // Load `Node` `http` module
  const http = require('http');

  // Set `PORT` based on environment and store in `Express`
  const PORT = normalizePort(process.env.PORT || 3000);
  app.set('port', PORT);

  // Create `http` server
  var server = http.createServer(app);

  // Integrate Socket.io
  const SOCKET_PORT = normalizePort(process.env.SOCKET_PORT || 3001);
  let io = socketio.listen(SOCKET_PORT);

  socketBase(io);

  // Listen on the provided `PORT`
  server.listen(PORT);

  // Add `error` handler
  server.on('error', onError.onError);

  // Initiate `listening` on `PORT`
  server.on('listening', onListening);
}

function fork() {
  cluster.fork();
}

// Count requests
function messageHandler(event) {

  switch(event.type) {
    case ServerEvent.NotifyRequest:
      numReqs++;
      console.log('{Cluster} - requests served since last restart: ' + numReqs);
      break;
    case ServerEvent.WorkerInitialized:
      console.log(`Wizardry is afoot on ${event.data}`);
      break;
    case ServerEvent.WorkerShutdown:
      console.log(`Wizardry is afoot on ${event.data}`);
      break;
    default:
      console.error(`Error: ${Error.getErrorMessage(Error.BadEventCode)}`)
  }
}

function restartWorkers() {
  let wid: string = undefined;
  let workerIds: Array<string> = [];

  for(wid in cluster.workers) {
    workerIds.push(wid);
  }

  workerIds.forEach((wid) => {
    cluster.workers[wid].send({
      type: ServerEvent.RestartWorkers,
      from: 'master'
    });

    setTimeout(() => {
      if(cluster.workers[wid]) {
        cluster.workers[wid].kill('SIGKILL');
      }
    }, 5000);
  });
};

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
    process.send({
      type: ServerEvent.WorkerInitialized,
      from: process.pid,
      data: bind
    });
}
