"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringifyEnvsByPrefix = exports.setupRuntimeEnvs = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const DEFUALT_ENV_DIR = path_1.default.resolve(process.cwd(), `./envs/`);
const DEFUALT_ENV_SPLITER = '.';
function getRuntimeEnvFiles(runtimeEnv, envdir, envSpliter) {
    const files = [path_1.default.resolve(envdir, ".env")];
    runtimeEnv.split(envSpliter).reduce((pre, curr) => {
        const currEnv = pre + envSpliter + curr;
        files.unshift(path_1.default.resolve(envdir, `.env${currEnv}`));
        return currEnv;
    }, "");
    files.unshift(path_1.default.resolve(envdir, ".env.local"));
    return files;
}
/**
 * @description 启动注入，根据RUNTIME_ENV，按照规则将一些列的dotenv注入到当前环境
 * @param {string} envdir 环境变量所在的文件夹，默认./envs  (env file dir, default is ./envs)
 * @param {string} envSpliter .env文件名称中的分割符，默认 .  (split syntax in dotenv's name)
 * @return {void}
 */
function setupRuntimeEnvs(envdir, envSpliter) {
    // 当前运行的环境，例如 cross-env RUNTIME_ENV=mp.alpha npm run xxxx
    const RUNTIME_ENV = process.env.RUNTIME_ENV || process.env.NODE_RUNTIME_ENV || "production";
    envdir = envdir || DEFUALT_ENV_DIR;
    envSpliter = envSpliter || DEFUALT_ENV_SPLITER;
    // 根据分隔符，得到当前环境所需要的全部 .env 文件
    const runtimeEnvFiles = getRuntimeEnvFiles(RUNTIME_ENV, envdir, envSpliter);
    runtimeEnvFiles.forEach((envFile) => {
        if (fs_extra_1.default.existsSync(envFile)) {
            dotenv_expand_1.default.expand(dotenv_1.default.config({
                path: envFile,
            }));
        }
    });
}
exports.setupRuntimeEnvs = setupRuntimeEnvs;
/**
 * @description 根据prefix 过滤环境变量，返回环境变量对象中的值被JSON.stringify
 * @param {string} objectKeyPrefix 返回对象中，key的前缀
 * @param {string} prefix 目标环境变量的前缀，默认 "APP_RUNTIME_"
 * @returns {IEnvsObject} 所有包含prefix变量的键值对，其中值已被JSON.stringify
 */
function getStringifyEnvsByPrefix(objectKeyPrefix, prefix) {
    objectKeyPrefix = objectKeyPrefix || '';
    prefix = prefix || 'APP_RUNTIME_';
    const envsObject = {};
    Object.keys(process.env).forEach((key) => {
        if (key.indexOf(prefix) > -1) {
            envsObject[`${objectKeyPrefix}${key}`] = JSON.stringify(process.env[key]);
        }
    });
    return envsObject;
}
exports.getStringifyEnvsByPrefix = getStringifyEnvsByPrefix;
