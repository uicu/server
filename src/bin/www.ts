#!/usr/bin/env node
import fs from'fs';
import path from'path';
import Debug from 'debug';
import http from 'http';
import https from 'https';
import app from '../app';

const debug = Debug('uicu:server');

const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/uicu.club.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/uicu.club_bundle.pem'))
};

const port = normalizePort(process.env.PORT || '3000');
/**
 * creat http server
 * creat https server
 */
const server = http.createServer(app.callback());
const httpsServer = https.createServer(options, app.callback());

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


httpsServer.listen(443);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);

function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error: {syscall: string, code: string}) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
