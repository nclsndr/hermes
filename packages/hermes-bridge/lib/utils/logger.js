const colors = require('colors')
const winston = require('winston')

const createLogger = (level = 'info') => {
  const logger = new winston.Logger({
    level,
    transports: [
      new (winston.transports.Console)({
        formatter: options => {
          return (options.message ? options.message : '')
            + (options.meta && Object.keys(options.meta).length
              ? '\n' + JSON.stringify(options.meta)
              : ''
            )
        }
      })
    ]
  })
  logger.line = (l = 'info', color = 'green') => {
    logger[l](colors[color]('=================================================='))
  }
  logger.points = (l, color = 'green') => {
    logger[l](colors[color]('••••••••••••••••••••••••••••••••••••••••••••••••••'))
  }
  return logger
}

module.exports = createLogger
