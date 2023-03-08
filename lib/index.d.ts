/**
 * @description 启动注入，根据RUNTIME_ENV，按照规则将一些列的dotenv注入到当前环境
 * @param {string} envdir 环境变量所在的文件夹，默认./envs  (env file dir, default is ./envs)
 * @param {string} envSpliter .env文件名称中的分割符，默认 .  (split syntax in dotenv's name)
 * @return {void}
 */
export declare function setupRuntimeEnvs(envdir?: string, envSpliter?: string): void;
interface IEnvsObject {
    [key: string]: string;
}
/**
 * @description 根据prefix 过滤环境变量，返回环境变量对象中的值被JSON.stringify
 * @param {string} objectKeyPrefix 返回对象中，key的前缀
 * @param {string} prefix 目标环境变量的前缀，默认 "APP_RUNTIME_"
 * @returns {IEnvsObject} 所有包含prefix变量的键值对，其中值已被JSON.stringify
 */
export declare function getStringifyEnvsByPrefix(objectKeyPrefix?: string, prefix?: string): IEnvsObject;
export {};
