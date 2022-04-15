const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

const RUNTIME_ENV = process.env.RUNTIME_ENV || process.env.NODE_ENV || "production";




const DEFUALT_ENV_DIR = path.resolve(process.cwd(), `./envs/`)

function setupRuntimeEnvs(options) {
  options = options || {}
  const envdir = options.envdir || DEFUALT_ENV_DIR;

  const dotenvFiles = [
    path.resolve(envdir,'.env.local'),
    path.resolve(envdir,`.env.${RUNTIME_ENV}`),
    path.resolve(envdir,'.env')
    
  ].filter(Boolean);

  dotenvFiles.forEach(envFile => {
    if(fs.existsSync(envFile)) {
      dotenvExpand.expand(
        dotenv.config({
          path:envFile
        })
      )
    }
  })
}


module.exports = setupRuntimeEnvs