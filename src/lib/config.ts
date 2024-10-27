import fs from "node:fs";
import path from "node:path";
import isValidGlob from "is-valid-glob";
import { globSync } from "glob";

const NUIMAN_COLLECTION_ENV_VAR = "NUIMAN_COLLECTION";
const NUIMAN_ENVIRONMENT_ENV_VAR = "NUIMAN_ENVS";

/**
 *
 * @returns {string} The path to the collection json file. Note this does not test if the collection is valid schema, but does ensure the path exists.
 */
export const getCollectionPath = () => {
  const collection = process.env[NUIMAN_COLLECTION_ENV_VAR];
  if (!collection) {
    throw `Collection was not specified by the variable $${NUIMAN_COLLECTION_ENV_VAR}'`;
  }
  if (!fs.existsSync(collection)) {
    throw `Collection could not be found at ${collection}`;
  }
  return collection;
};

/**
 *
 * @returns {string[]} An array of the paths to environments. Note this does not check if the environments are valid schema, but will expand globs.s
 */
export const getEnvironmentPaths = (): string[] => {
  const environmentsRaw = process.env[NUIMAN_ENVIRONMENT_ENV_VAR];
  if (!environmentsRaw) {
    console.debug(
      `Environment was not specified by the variable $${NUIMAN_ENVIRONMENT_ENV_VAR}'`
    );
    return [];
  }
  const environments = environmentsRaw.split(",");
  return environments.flatMap((environment) => {
    if (fs.statSync(environment).isDirectory()) {
      return globSync(path.join(environment, "**/*.json"));
    } else if (isValidGlob(environment)) {
      return globSync(environment);
    }
    return [environment];
  });
};
