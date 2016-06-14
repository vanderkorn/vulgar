/**
 * Event listener for HTTP server "error" event.
 */
export function onError(error) {
  if (error.syscall !== 'listen')
    throw error;

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // Handle specific listen `errors` with human-friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges!`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use!`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
