"use server";
import fs from "node:fs";
import path from "node:path";

export const postmanType = fs.readFileSync(
  path.join(__dirname, "..", "node_modules/postman-sandbox/types/index.d.ts"),
  "utf8"
);
console.log(postmanType)
