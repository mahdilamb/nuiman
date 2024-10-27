export const method = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

export type Method = (typeof method)[number];

export const auth = [
  "apikey",
  "awsv4",
  "basic",
  "bearer",
  "digest",
  "edgegrid",
  "hawk",
  "noauth",
  "oauth1",
  "oauth2",
  "ntlm",
] as const;

export type Auth = (typeof auth)[number];

export const body = [
  "none",
  "form-data",
  "x-www-form-urlencoded",
  "raw",
  "binary",
  "GraphQL",
] as const;
export type Body = (typeof body)[number];

export const bodyLanguage = [
  "text",
  "javascript",
  "json",
  "html",
  "xml",
] as const;

export type BodyLanguage = (typeof bodyLanguage)[number];
