module.exports = {
  localServer: {
    protocol: 'http',
    host: 'localhost',
    port: 8003
  },
  bridge: {
    host: 'localhost',
    httpPort: 8000,
    socketPort: 9000
  },
  backend: {
    port: 8001
  },
  adaptor: {
    maxAttempts: 10,
    attemptDelay: 600,
    authTokens: [
      'EFQVYPrm5x54zstCjCFNRSts2Ypuv4',
      'MbhJ3SymD98byPs7zB6rEJRnG8NwCu',
      'H5YJNfr5KqhFid7arEyjQWAFJZkx53',
      'cuhtaQXyhQLgng3NGxuimCxfyDv4bY',
      'sXBTv74mTyQytbfaKHhMjVyUJaRSHX',
      '47Usyh9gfLfsrHdrBtvYn2NAEfMAQP'
    ],
    usernames: [
      'Nico',
      'Arnaud',
      'Hugo'
    ]
  }
}
