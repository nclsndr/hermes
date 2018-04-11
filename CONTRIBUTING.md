# Contributing

## Abstract 

Hermes is developed under a mono-repo structure. We use [Lerna](https://lernajs.io/) to manage npm publishing.

Actually there is 2 main groups:

 - The *Bridge*, *Backend* and *Dashboard* needs to be deployed as a all-in-one block online (on a dedicated instance/VM/server)
 - The *Adaptor* will lives into the project devDependencies. It embodies the missing link between a *Local-server* (listening on localhost:xxxx) and the online *Provider*

## Vocable

**Provider:** refers to any external server that can call Hermes over an HTTP interface. Providers are mainly webhooks.

**Local server:** refers to a server running locally. It is responsible for listening the requests from the *Adaptor* and to respond back.

**Adaptor:** refers to the `hermes-adaptor` package.

**Bridge:** refers to the `hermes-bridge` package.

**Backend:** refers to the `hermes-backend` package.

**Dashboard:** refers to the `hermes-dashboard` package.

**Utils:** refers to the `hermes-utils` package.

## Directories architecture

```
dev-env
    (Dedicated environment to run the solution locally for development purpose)
docs
    (All the assets for the documentation)
packages
    (Actual packages published on npm)
    hermes-adaptor
    hermes-backend
    hermes-bridge
    hermes-dashboard
    hermes-utils
```

## Packages

### Adaptor (hermes-adaptor)

**Abstract:** The *Adaptor* is responsible for connecting to the *Bridge* — Provide its authentication token — Receive any request from the *Bridge* over a socket connection and replicate this request to the *Local server*.

The *Adaptor* is the only package that nests into your `package.json` file when you are using Hermes for developing in real life.

**Technologies:** NodeJS Net (Socket)

**Notes:** The *Adaptor* tends to use as less as possible external dependencies in order to keep it small and performance oriented.

---

### Bridge (hermes-bridge)

**Abstract:** The *Bridge* is the masterpiece of Hermes system. It is responsible for managing the incoming requests for the *Provider(s)* and broadcast them over socket to the listening *Adaptor(s)*.

**Technologies:** NodeJS Net (Socket) & HTTP

**Notes:** The *Bridge* tends to use as less as possible external dependencies in order to keep it small and performance oriented.

---

### Dashboard (hermes-dashboard)

**Abstract:** As far as you can use Hermes in "blind mode", you sometimes need to control more precisely the behaviors among your clients (adaptors and servers). With the dashboard, you can dynamically control who has access and the mode (concurrency, exclusive, offline) that fits best your current situation.

The dashboard package is distributed as a dependency of `hermes-backend`. Its purpose is to only provide the frontend UI of the service.

**Technologies:** ReactJS, Socket.io

**Notes:** based on [create-react-app](https://github.com/facebook/create-react-app). The idea here is to provide a: as simple as possible dev to production environment.

---

### Backend (hermes-backend)

**Abstract:** The *Backend* is responsible to provide the logic and the static server in order to access the dashboard. The *Backend* is a dependency of the *Bridge*, it listens and broadcast the application state to the *Dashboard* over Socket.io

**Technologies:** NodeJS, Express, Socket.io

**Notes:** the mindset here is fundamentally different than for the adaptor/bridge. We aim to have more dependencies, the *Backend* will never be under high pressure as it is used only for development purpose.

---

### Utils (hermes-utils)

**Abstract:** The utils packages is used to store the shared constants and the common functions.

## Setup

```
$ git clone git@github.com:chance-get-yours/hermes.git
$ cd hermes

```

## Test