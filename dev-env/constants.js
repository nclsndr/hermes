module.exports = {
  localServer: {
    protocol: 'http',
    host: 'localhost',
    port: 8001
  },
  bridge: {
    host: 'localhost',
    httpPort: 8000,
    socketPort: 9000
  },
  adaptor: {
    maxAttempts: 10,
    attemptDelay: 600,
    authTokens: [
      'EFQVYPrm5x54zstCjCFNRSts2Ypuv4',
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
