import "dotenv/config";

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}`);

  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 4001),
  keycloak: {
    issuer: required("KEYCLOAK_ISSUER").replace(/\/$/, ""),
    audience: required("KEYCLOAK_AUDIENCE"),
  },
};
