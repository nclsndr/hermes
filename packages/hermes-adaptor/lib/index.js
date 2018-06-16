/* ------------------------------------------
   Hermes adaptor core
--------------------------------------------- */
const { fork } = require('child_process')
const { resolve } = require('path')
require('colors')
const clearCLI = require('clear')

const createLogger = require('./utils/logger')
const ascii = require('./utils/ascii')

const logger = createLogger('info')
let attempts = 1

function createChildProcess (config) {
  const cp = fork(
    resolve(__dirname, 'childProcess')
  )
  cp.send({
    config
  })
  cp.on('message', ({ connectionError, connectionSuccess, shouldRestart }) => {
    if (connectionSuccess) {
      attempts = 1
    }
    if (connectionError) {
      logger.error(`${attempts} / ${config.maxAttempts}`.red)
      logger.line('info', 'red')
      if (attempts < config.maxAttempts && shouldRestart) {
        setTimeout(() => {
          attempts += 1
          createChildProcess(config)
        }, config.attemptDelay)
      } else {
        logger.error(`\nMax connection attempts (${config.maxAttempts})\n`.red)
        logger.line('error', 'red')
        logger.line('info', 'yellow')
        logger.info('\n    Please retry\n'.yellow)
        process.exit(1)
      }
    }
  })
  // cp.on('error', a => console.log('error : ', a))
  // cp.on('close', a => console.log('close : ', a))
  // cp.on('disconnect', a => console.log('disconnect : ', a))
}

function createAdaptor ({
  bridgeHost,
  bridgeSocketPort,
  localServerProtocol,
  localServerHost,
  localServerPort,
  auth,
  maxAttempts = 20,
  attemptDelay = 1000,
  verbose = false
}) {
  const config = {
    bridgeHost,
    bridgeSocketPort,
    localServerProtocol,
    localServerHost,
    localServerPort,
    auth,
    maxAttempts,
    attemptDelay: attemptDelay > 299 ? attemptDelay : 300,
    verbose
  }

  clearCLI()
  logger.info(ascii.yellow)
  logger.info('    Hermes Adaptor on Start'.yellow)
  logger.line('info', 'yellow')
  logger.info('Logger level :'.gray, `${verbose ? 'verbose' : 'info'}`.gray)

  createChildProcess(config)
}

module.exports = createAdaptor
