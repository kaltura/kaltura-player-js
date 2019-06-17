# Kaltura Player JS Platform - Cloud TV and OVP Media Players Based on the [PlayKit JS Player]

[![Build Status](https://travis-ci.org/kaltura/kaltura-player-js.svg?branch=master)](https://travis-ci.org/kaltura/kaltura-player-js)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The Kaltura Player utilizes a highly modular approach for creating a powerful media player.
Each functionality of the player is isolated into separate packages, which are designed to deliver a specific set of abilities.
This approach enables extensibility, simplicity and easy maintenance.

The Kaltura Player integrates:

- [PlayKit JS ](https://github.com/kaltura/playkit-js) - The core library.
- [PlayKit JS UI](https://github.com/kaltura/playkit-js-ui) - The UI framework.
- [PlayKit JS DASH](https://github.com/kaltura/playkit-js-dash) and [PlayKit JS HLS](https://github.com/kaltura/playkit-js-hls) for HLS & MPEG-DASH media source extensions capabilities.
- [PlayKit JS IMA](https://github.com/kaltura/playkit-js-ima) for ads and monetization.
- [PlayKit JS Providers](https://github.com/kaltura/playkit-js-providers) as the backend media providers.
- [PlayKit JS Youbora](https://github.com/kaltura/playkit-js-youbora), [PlayKit JS KAVA](https://github.com/kaltura/playkit-js-kava), and [PlayKit JS OTT Analytics](https://github.com/kaltura/playkit-js-ott-analytics) as the different analytics plugins.

The Kaltura Player exposes two different players: the _Kaltura OVP Player_ and _Kaltura Cloud TV Player_. Each player integrates its related packages, as you can see in the following table:

|                 | PlayKit JS | PlayKit JS Providers | PlayKit JS UI | PlayKit JS DASH | PlayKit JS HLS | PlayKit JS Youbora | PlayKit JS OTT Analytics | PlayKit JS KAVA |
| --------------- | ---------- | -------------------- | ------------- | --------------- | -------------- | ------------------ | ------------------------ | --------------- |
| OVP Player      | V          | OVP                  | V             | V               | V              | V                  |                          | V               |  |
| Cloud TV Player | V          | OTT                  | V             | V               | V              | V                  | V                        | V (\*)          |

> \* Needs to be configured.

The Kaltura Player is written in [ECMAScript6], statically analysed using [Flow] and transpiled in ECMAScript5 using [Babel].

[flow]: https://flow.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io
[playkit js player]: https://github.com/kaltura/playkit-js

## Getting Started

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/kaltura-player-js.git
cd kaltura-player-js
yarn install
```

### Building

Then, build the player

```javascript
// OVP player
yarn run build:ovp

// Cloud TV player
yarn run build:ott
```

Next, let's look at how to [get started](./docs/player-setup.md) by creating a player using the Player API set.

## Documentation

- [**Configuration**](./docs/configuration.md)
- [**API**](./docs/api.md)
- [**Guides**](./docs/guides.md)

## Running the tests

Tests can be run locally via [Karma], which will run on Chrome, Firefox and Safari

[karma]: https://karma-runner.github.io/1.0/index.html

```
yarn run test
```

You can test individual browsers:

```
yarn run test:chrome
yarn run test:firefox
yarn run test:safari
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://github.com/kaltura/platform-install-packages/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-providers/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details
