import { JSONSchemaType } from "ajv";
import {Schema as environment} from "./environment";
export const schema: JSONSchemaType<environment> = {
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "Postman environment",
  "properties": {
    "name": {
      "type": "string"
    },
    "syncedFilename": {
      "type": "string"
    },
    "synced": {
      "type": "boolean"
    },
    "timestamp": {
      "type": "number"
    },
    "values": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "key",
          "value"
        ],
        "properties": {
          "enabled": {
            "type": "boolean"
          },
          "key": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "value": {
            "type": "string"
          }
        }
      }
    }
  }
} as never;