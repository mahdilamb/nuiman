"use server";
import fs from "node:fs";
import { getCollectionPath, getEnvironmentPaths } from "../config";
import {
  collection_v2_0_0Validator,
  collection_v2_1_0Validator,
  environmentValidator,
} from "./schemas";
export const getCollectionJson = async () => {
  const data = await fs.promises.readFile(getCollectionPath(), {
    encoding: "utf8",
  });
  const json = JSON.parse(data);
  const schemaId = json.info.schema as string;
  if (schemaId.includes("/collection/v2.1.0")) {
    return collection_v2_1_0Validator(json);
  }
  if (schemaId.includes("/collection/v2.0.0")) {
    return collection_v2_0_0Validator(json);
  }
  throw `Unknown collection schema ${schemaId}.`;
};

export const getEnvironmentsJson = async () => {
  return await Promise.all(
    getEnvironmentPaths().map(async (env) =>
      environmentValidator(
        JSON.parse(
          await fs.promises.readFile(env, {
            encoding: "utf8",
          })
        )
      )
    )
  );
};
