// ```
// base.ts
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// base.ts may be freely distributed under the MIT license
// ```

// *base.ts*

// This file contains the most basic functionality for server Socket.io
// functionality.
export default (io) => {
  io.sockets.on('connect', (socket: any) => {
    let handle: any = 'unknown';
    console.log(`{socket} [client:connect] ${ handle } client connected`);
    socket.on('disconnect', () => {
      console.log(`{socket} [client:disconnect] ${ handle } disconnected`);
      io.emit('chat:message', `{socket} ${ handle } has left the channel`);
    });
    socket.on('chat:message', (message: any) =>  {
      // Just relay all messages to everybody
      io.emit('chat:message', `${ handle } : ${ message }`);
      // Logging
      console.log(`{socket} [chat:message] ${ handle } : ${ message }`);
    });
    socket.on('chat:register', (input: any) => {
      handle = input;
      console.log(`{socket} [client:register] ${ handle } has registered with the server`);
      io.emit('chat:message', `{socket} ${ handle } has joined the channel`);
    });
  });

};
