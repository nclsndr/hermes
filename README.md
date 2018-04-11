# Hermes

#### Listen to the 🌐outside world 🌍 from your 🏡 bedroom 🛌,
##### 📡 HTTP request forwarding with no hassle


[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Motivation

You have an online service that need to hit your local server (e.g. webhooks). Basically, your computer is connected to your personal network (behind your NAT), so your localhost is invisible from the outside world...

Then Hermes comes and provides two modules:

- The *bridge* is running on your remote server and listen to any *provider* requests
- The *adaptor* is running on your localhost and replicate all the requests to your *local server*

When the response is emitted from the *local server*, it brings the response back to the *provider* following the same logic.

#### 1 to 1 communication


![Basic](https://github.com/chance-get-yours/hermes/blob/docs/docs/assets/basic.jpg)

#### Concurrency

Hermes allows **concurrent calls among clients**. By default, the first response received from any client (*adaptor*) will be used as the final response for the *provider*. This feature is particularly useful for teams of developers working at the same time.

![Concurrent](https://github.com/chance-get-yours/hermes/blob/docs/docs/assets/concurrent.jpg)

## Usage

**⚠️ The packages are not available yet**

---
### Bridge: Server side
You need to procure any kind of server able to run node 8+. Then it's up to you to enhance it with NGNIX if you need DNS resolution.

```
$ npm | yarn install hermes-bridge
```

---
### Adaptor: Local stack

Into your local server directory:

```
$ npm | yarn install -D hermes-adaptor
```

Create a `hermes.js` file.

```
const adaptor = require('hermes-adaptor)
adaptor.init({
    [To define]
})
```

### Preview

![CLI-preview](https://github.com/chance-get-yours/hermes/blob/docs/docs/assets/cli-demo.gif)

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
