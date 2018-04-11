# Hermes

#### Listen to the outside world 🌍 from your bedroom 🛌,
##### 📡 HTTP request forwarding with no hassle


[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Motivation

You have an online service that need to hit your local server (e.g. webhooks). Basically, your computer is connected to your personal network (behind your NAT), so your localhost is invisible from the outside world...

Then Hermes comes and provides two modules:

- The *bridge* is running on your remote server and listen to any *provider* requests
- The *adaptor* is running on your localhost and replicate all the requests to your *local server*

When the response is emitted from the *local server*, it brings the response back to the *provider* following the same logic.

### Execution modes
#### 1 to 1 communication

![](https://github.com/chance-get-yours/hermes/blob/master/docs/assets/basic.jpg?raw=true)

#### Concurrency

Hermes allows **concurrent calls among clients**. By default, the first response received from any client (*adaptor*) will be used as the final response for the *provider*. This feature is particularly useful for teams of developers working at the same time.

![](https://github.com/chance-get-yours/hermes/blob/master/docs/assets/concurrent.jpg?raw=true)

## Usage

---
### 🌍 Bridge: Server side
You need to procure any kind of server able to 1. run node 8+, 2. allow specific port access (different from 80 and 443) 

> All the information provided here are gathered into this [example directory](https://github.com/chance-get-yours/hermes/tree/master/examples/basic-bridge)

#### 1. Create a new project

```
$ mkdir basic-bridge && cd basic-bridge
$ npm init
```

#### 2. Install hermes-bridge and dotenv

```
$ npm install hermes-bridge dotenv
```

*We encourage you to use [dotenv](https://www.npmjs.com/package/dotenv) package in order to protect your sensitive data from being published online. NB: .env should be listed into your `.gitignore`*

#### 3. Create the configuration

```javascript
// index.js
const createBridgeServer = require('hermes-bridge')

// Response used when no adaptors are connected (some providers like Facebook, accept 2xx status code only)
const responseFallback = {
  statusCode: 500,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ error: 'No local server provided' })
}

createBridgeServer({
  httpPort: 8000, // make sure you can acess from outside of your machine
  socketPort: 9000, // this port will be reused for the adaptor configuration
  loggerLevel: 'verbose', // 'info'
  clients: {
    adaptors: {
      isAuthRequired: true, // enable/disable authentication check
      authTokens: tokens // [stringToken]
    }
  },
  defaultResponse: responseFallback // by default, hermes provide the fallback described above
})
```


#### 4. 🚀 Launch it!

```
$ node index.js
```

**Notes**

- For a basic DNS resolution you can use our [NGINX configuration file](https://github.com/chance-get-yours/hermes/blob/master/examples/basic-bridge/nginx.conf)
- Some providers require to use HTTPS, we recommend to use [Let's Encrypt](https://letsencrypt.org/) with [Cerbot](https://certbot.eff.org/)
- DNS resolution for the socket endpoint is possible but not as easy as it seems. We recommend to use the IP for configuring the adaptor.
- [Heroku](https://www.heroku.com/) users, as far as the service doesn't allow multi-port exposure, hermes-bridge will not be compatible.


---
### 🛌 Adaptor: Local dev env
The adaptor can be set in any dev environment that support NodeJS 8+.

> All the information provided here are gathered into this [example directory](https://github.com/chance-get-yours/hermes/tree/master/examples/basic-adaptor)

#### 1. Install hermes-adaptor

Navigate to your project directory, then

```
$ npm install -D hermes-adaptor
```

#### 2. Create configuration
Create a `hermes.js` file.

```javascript
const adaptor = require('hermes-adaptor)

adaptor.init({
  bridgeHost: 'my-hermes-bridge-domain.com',
  bridgeSocketPort: 9000,
  localServerProtocol: 'http',
  localServerHost: 'localhost',
  localServerPort: 8888,
  maxAttempts: 10, // number of attempts to reconnect in case of network errors
  attemptDelay: 200,
  auth: {
    token: 'gHmFyUkCSpGRXiWFxvLMpGYbMXvcsi', // This token has to be listed into the Bridge configurartion
    username: 'Nico' // Up to you
  },
  verbose: true // logger output level
})
```

#### 3. 🚀 Launch it!

```
$ node hermes.js
```

You need to launch your local server too if you want the all system to do his job!

**Notes**

- We recommend to use [concurrently](https://www.npmjs.com/package/concurrently) in order to start your dev-server in parallel with the adaptor
- For setup testing, you can try a `curl http://my-bridge.com`, then you should receive the request on your adaptor console (verbose = true).

### Hermes in action

![](https://github.com/chance-get-yours/hermes/blob/master/docs/assets/cli-demo.gif?raw=true)

### Requirements

- Node >= 8.10.0

## Why not use [ngrok](https://ngrok.com/)?

Ngrok is a great product to start developing alone or as a small team. It solves most of the problem you encounter by developing locally with remote providers (eg. Facebook Messenger). It also provides a good and secured SSH forwarding.

The philosophy behind Hermes is a bit different.

Here, we are interested to work as a team, each guy is developing locally chatbots and real time front-ends. But, one day the team get larger, and you miss some features, *like being able to select on a UI the client that should receive the next request...* — So we decide to give a try by developping Hermes.

Here a small features comparison to help you choose.

| Features | ngrok | hermes |
|:--|:--|:--|
| HTTP tunnel | ✅ | ✅ |
| SSH tunnel | ✅ | ❌ |
| IP Whitelisting | ✅ | ❌ |
| Custom sub-domain | ✅ | ✅ |
| Custom domain | ❌ | ✅ |
| Command Line Interface | ✅ | ❌ (not priority) |
| Authentication | ✅ | ⏳ (Plan for 1.0) |
| Web based real time dashboard | ❌ | ⏳ (Plan for 1.0) |
| Concurrent clients | ❌ | ✅ |
| Concurrency management | ❌ | ⏳ (Plan for 2.0) |
| Server to server management | ❌ | ⏳ (Plan for 2.0) |
| Retry strategy for failed requests | ❌ | ⏳ (Plan for 2.0) |
| Request replay | ✅ | ⏳ (Plan for 3.0) |
| Open-source | ❌ | ✅ |

# Contributing
## Dev environment
- Jest
- Lerna bootstrap

## Guidelines

- We do not use Babel, why because we believe Node is now mature enough, and who REALLY needs `import/export` in 2018.
- We try to use as less as possible package for the `bridge` and `adaptor` packages in order to keep focus on performance and limitate the dependency tree.
- We use the same eslint configuration for all the repository, it is opinionated, but we are good with that.
 
## Roadmap
### V1 Release
#### Adaptor
- [ ] *Adaptor* is able to restart on error
- [ ] *Adaptor* send fixed token to *bridge*
- [ ] *Adaptor* warn all users that a new *adaptor* connects

#### Bridge
- [ ] *Bridge* validates the *adaptor* token
- [ ] *Bridge* prevents any *adaptor* that do not provide an auth token to receive data

#### Test-env
- [ ] Provide an integration test suite

#### Test-env - Provider
- [ ] Provide multiple types of requests (string, JSON, files, buffer, methods...)

## License

This project is distributed under the [MIT License](https://github.com/chance-get-yours/hermes/blob/master/LICENSE).
