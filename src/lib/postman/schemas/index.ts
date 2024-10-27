import {schema as environment} from "./environment.schema";
import {schema as collection_v2_0_0} from "./collection-v2_0_0.schema";
import {schema as collection_v2_1_0} from "./collection-v2_1_0.schema";
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
export const environmentValidator = createValidator(environment);

export const collection_v2_0_0Validator = createValidator(collection_v2_0_0);

export const collection_v2_1_0Validator = createValidator(collection_v2_1_0);
