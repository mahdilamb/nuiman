/**
 * Download and convert the schemas into typescript.
 */
import * as postmanSchemas from "./sources";
import fs from "fs";
import { JSONSchema } from "json-schema-to-ts";
import path from "path";
import { compile } from "json-schema-to-typescript";

const DEFAULT_OUTPUT_PATH = "src/lib/postman/schemas";
/**
 *
 * @param outputDir the directory to output to
 * @param name the source name of the schema
 * @returns
 */
const getTsPath = (outputDir: string, name: string) => {
  return path.join(
    outputDir,
    name.replace(/collection_/g, "collection-") + ".ts"
  );
};
const transformRequired = (
  data: Exclude<JSONSchema, boolean> & {
    required?: string[];
  }
) => {
  if (data["anyOf"]) {
    data.anyOf.forEach((of) => transformRequired(of as never));
  }
  if (data["allOf"]) {
    data.allOf.forEach((of) => transformRequired(of as never));
  }
  if (data.type === "array") {
    transformRequired(data.items as never);
    return;
  }
  if (!data.properties) {
    return;
  }
  data.required = Object.keys(data.properties).filter((key) => {
    const value = data.properties![key];
    const isRequired =
      typeof value !== "boolean" &&
      (value as Exclude<JSONSchema, boolean>).required;
    delete (value as unknown as never)["required"];
    if (typeof value === "object") {
      transformRequired(value as never);
    }
    return isRequired;
  });
};
/**
 * Dump the schema from the sources file.
 * @param outputDir the directory to output to
 */
const dumpSchemas = async (outputDir = DEFAULT_OUTPUT_PATH) => {
  const sources: { [name: string]: string } = postmanSchemas;
  await Promise.all(
    Object.entries(sources).map(async ([name, url]) => {
      const jsonPath = getTsPath(outputDir, name);
      if (true || !fs.existsSync(jsonPath)) {
        let data = await (await fetch(url)).json();
        if (
          !(data.$schema as string | undefined)?.startsWith(
            "http://json-schema.org/draft-07/schema"
          )
        ) {
          transformRequired(data);
          delete data.required;
          data.$schema = "http://json-schema.org/draft-07/schema";
        }
        data = JSON.parse(
          JSON.stringify(data, (_, value) => {
            if (value) {
              delete value.id;
            }

            return value;
          })
        );
        let root = false;
        await fs.promises.writeFile(
          jsonPath,
          await compile(data, "", {
            customName: (schema, key) => {
              if (!root) {
                root = true;
                return "schema";
              }
              return key;
            },
          }),
          {
            encoding: "utf-8",
          }
        );
        const baseName = jsonPath.split(".", 2)[0];
        await fs.promises.writeFile(
          baseName + ".schema.ts",
          `import { JSONSchemaType } from "ajv";
import {Schema as ${name}} from "./${getTsPath(".", name).split(".", 2)[0]}";
export const schema: JSONSchemaType<${name}> = ${JSON.stringify(data, undefined, 2)} as never;`,
          {
            encoding: "utf-8",
          }
        );
      }
    })
  );
  await fs.promises.writeFile(
    path.join(outputDir, "index.ts"),
    Object.entries(sources)
      .map(
        ([name]) =>
          `import {schema as ${name}} from "./${getTsPath(".", name).split(".", 2)[0]}.schema";`
      )
      .join("\n") +
      `
import Ajv, { JSONSchemaType } from "ajv";

const createValidator = <T>(schema: JSONSchemaType<T>) => {
  const ajv = new Ajv({ allowUnionTypes: true });
  const validate = ajv.compile<T>(schema);

  return (data: unknown) => {
    if (validate(data)) {
      return data;
    } else {
      console.error(validate.errors);
    }
  };
};
` +
      Object.entries(sources)
        .map(
          ([name]) => `export const ${name}Validator = createValidator(${name});
`
        )
        .join("\n"),
    { encoding: "utf-8" }
  );
};
dumpSchemas();
