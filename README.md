# @otherguy/elysia-logging

An advanced logging plugin designed for [Elysia.js](https://elysiajs.com), prioritizing structured logging tailored for production environments.

<p align="center">

  [![npm version](https://img.shields.io/npm/v/%40otherguy/elysia-logging?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@otherguy/elysia-logging)
  [![npm downloads](https://img.shields.io/npm/dm/%40otherguy/elysia-logging?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@otherguy/elysia-logging)
  [![Snyk Monitored](https://img.shields.io/badge/Snyk-Monitored-8A2BE2?style=for-the-badge&logo=snyk)](https://snyk.io/test/github/otherguy/elysia-logging)
  [![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/otherguy/elysia-logging/ci.yml?event=push&style=for-the-badge&logo=github)](https://github.com/otherguy/elysia-logging/actions/workflows/ci.yml)
  [![GitHub License](https://img.shields.io/github/license/otherguy/elysia-logging?style=for-the-badge)](https://github.com/otherguy/elysia-logging/blob/main/LICENSE.md)
  [![Code Climate Coverage](https://img.shields.io/codeclimate/coverage/otherguy/elysia-logging?style=for-the-badge&logo=codeclimate)](https://codeclimate.com/github/otherguy/elysia-logging)
  [![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/otherguy/elysia-logging?style=for-the-badge&logo=codefactor)](https://www.codefactor.io/repository/github/otherguy/elysia-logging/)
  [![Sonar CodeSmells](https://img.shields.io/sonar/violations/elysia-logging/main?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge&logo=sonarcloud&label=Code%20Smells)](https://sonarcloud.io/project/overview?id=elysia-logging)

</p>

---

## 🌈 Features

* **Structured Logging** - Log in JSON format for easy parsing and filtering
* **Customizable** - Customize the log level, formatter and logger
* **Production First** - Designed for production environments first

## 🚀 Installation

```bash
# For bun
bun add @otherguy/elysia-logging

# For npm
npm install @otherguy/elysia-logging

# For yarn
yarn add @otherguy/elysia-logging
```

## 📚 Usage

By default, the plugin will log to the console using the `console` module. The default formatter is `json` and the default log level is `info`.

```ts
import { Elysia } from "elysia";
import { ElysiaLogging } from "../src/elysiaLogging";

// Create Elysia app
const app = new Elysia()
  .use(ElysiaLogging())
  .get("/", () => {
    return new Response("Welcome to Bun!");
  })
  .listen(3000);

console.log(`Running at http://${app.server?.hostname}:${app.server?.port}`);
```

Using the default settings, the plugin will log the following for each request. Since the `console` module is pretty printing the JSON, the output in the console will be formatted slightly differently.

```json
{
  "message": "GET / completed with status 200 in 363.3µs",
  "request": {
    "ip": "127.0.0.1",
    "method": "GET",
    "url": {
      "path": "/",
      "params": {}
    }
  },
  "response": {
    "status_code": 200,
    "time": 363250
  }
}
```

### Custom Logger

Since the `console` is very limited, you may want to use a custom logger. The recommended logger is [pino](https://github.com/pinojs/pino) but you can use any logger that can implement the `Logger` interface.

See the [examples](examples) directory for implementation examples.

* [Pino](https://github.com/pinojs/pino) (see [Pino](examples/pino.ts) and [Pino Pretty](examples/pino-pretty.ts) examples)
* [Winston](https://github.com/winstonjs/winston) (see [Winston](examples/winston.ts) example)

## 🪜 Examples

A few examples are provided in the [`examples`](examples) directory.

* [Basic](examples/basic.ts) - A basic example of using the plugin with the default settings
* [JSON](examples/json.ts) - A basic example of logging in JSON
* [Custom Function](examples/custom-function.ts) - An example of using a function as custom logging formatter
* [On Error](examples/on-error.ts) - An example of logging errors in addition to access logging
* [Pino](examples/pino.ts) - An example of using the [Pino](https://github.com/pinojs/pino) logger
* [Pino Pretty](examples/pino.ts) - An example of using the [Pino](https://github.com/pinojs/pino) logger with [pino-pretty](https://github.com/pinojs/pino-pretty) _(not recommended for production)_
* [Winston](examples/winston.ts) - An example of using the [Winston](https://github.com/winstonjs/winston) logger

## 📜 To Do

* [ ] Add logger format classes
* [ ] Add whitelist for request parameters
* [ ] Add more logger examples (Bunyan, npmlog)

## ⚖️ License

This project is distributed under the [MIT](LICENSE.md) license, allowing for open source distribution and modification, subject to the terms outlined in the [LICENSE.md](LICENSE.md) file.

## 🚧 Contributing

Bug reports, feature requests and Pull Requests are more than welcome on GitHub at [`otherguy/elysia-logging`](https://github.com/otherguy/elysia-logging)! Please remember to add test coverage for your code if you are contributing.

## ♥️ Acknowledgements

* [SaltyAom](https://github.com/SaltyAom) for the [Elysia.js](https://elysiajs.com) framework.
