const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

const RUNTIME_ENV =
  process.env.RUNTIME_ENV || process.env.NODE_ENV || "production";

const DEFUALT_ENV_DIR = path.resolve(process.cwd(), `./envs/`);
const DEFUALT_ENV_SPLITER = '.'

function setupRuntimeEnvs(options) {
  options = options || {};
  const envdir = options.envdir || DEFUALT_ENV_DIR;
  const envSpliter = options.envSpliter || DEFUALT_ENV_SPLITER;

  const dotenvFiles = [path.resolve(envdir, ".env")];
  RUNTIME_ENV.split(envSpliter).reduce((pre, curr) => {
    const currEnv = pre + envSpliter + curr;
    console.log("currEnv", currEnv);
    dotenvFiles.unshift(path.resolve(envdir, `.env${currEnv}`));
    return currEnv;
  }, "");
  dotenvFiles.unshift(path.resolve(envdir, ".env.local"));

  dotenvFiles.forEach((envFile) => {
    if (fs.existsSync(envFile)) {
      dotenvExpand.expand(
        dotenv.config({
          path: envFile,
        })
      );
    }
  });
}

module.exports = setupRuntimeEnvs;
