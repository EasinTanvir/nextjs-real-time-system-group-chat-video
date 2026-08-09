const morgan = require("morgan");
const chalk = require("chalk");

const coloredMorgan = morgan((tokens, req, res) => {
  const method = tokens.method(req, res);

  let coloredMethod;

  switch (method) {
    case "GET":
      coloredMethod = chalk.green(method);
      break;

    case "POST":
      coloredMethod = chalk.yellow(method);
      break;

    case "PUT":
      coloredMethod = chalk.blue(method);
      break;

    case "PATCH":
      coloredMethod = chalk.magenta(method);
      break;

    case "DELETE":
      coloredMethod = chalk.red(method);
      break;

    default:
      coloredMethod = chalk.white(method);
  }

  const url = chalk.cyan(tokens.url(req, res));
  const status = tokens.status(req, res);
  const responseTime = tokens["response-time"](req, res);

  return `${coloredMethod} ${url} ${status} ${responseTime} ms`;
});

module.exports = coloredMorgan;
