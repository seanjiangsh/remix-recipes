import { json } from "@remix-run/node";
import Cryptr from "cryptr";

const { MAGIC_LINK_SECRET, ORIGIN } = process.env;

if (typeof MAGIC_LINK_SECRET !== "string")
  throw new Error("MAGIC_LINK_SECRET must be defined in your .env file");

if (typeof ORIGIN !== "string")
  throw new Error("ORIGIN must be defined in your .env file");

const cryptr = new Cryptr(MAGIC_LINK_SECRET);

export type MagicLinkPayload = {
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

const isMagicLinkPayload = (payload: any): payload is MagicLinkPayload => {
  return (
    typeof payload === "object" &&
    typeof payload.email === "string" &&
    typeof payload.nonce === "string" &&
    typeof payload.createdAt === "string"
  );
};

export const invalidMagicLink = (message: string) =>
  json({ error: message }, { status: 400 });

export const getMagicLinkPayload = (request: Request) => {
  const url = new URL(request.url);
  const magic = url.searchParams.get("magic");
  if (!magic) throw invalidMagicLink("'magic' search parameter does not exist");

  const magicLinkPayload = JSON.parse(cryptr.decrypt(magic));
  if (!isMagicLinkPayload(magicLinkPayload))
    throw invalidMagicLink("Invalid magic link payload");

  return magicLinkPayload;
};
