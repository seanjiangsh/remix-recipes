import Cryptr from "cryptr";

const { MAGIC_LINK_SECRET, ORIGIN } = process.env;

if (typeof MAGIC_LINK_SECRET !== "string")
  throw new Error("MAGIC_LINK_SECRET must be defined in your .env file");

if (typeof ORIGIN !== "string")
  throw new Error("ORIGIN must be defined in your .env file");

const cryptr = new Cryptr(MAGIC_LINK_SECRET);

type MagicLinkPayload = {
  email: string;
  nonce: string;
  createdAt: string;
};

export const generateMagicLink = (email: string, nonce: string) => {
  const payload: MagicLinkPayload = {
    email,
    nonce,
    createdAt: new Date().toISOString(),
  };
  const encryptedPayload = cryptr.encrypt(JSON.stringify(payload));
  const url = new URL("/validate-magic-link", ORIGIN);
  url.searchParams.set("magic", encryptedPayload);
  return url.toString();
};
