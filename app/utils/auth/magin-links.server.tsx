import { json } from "@remix-run/node";
import Cryptr from "cryptr";
import { sendEmail } from "../email/email.server";
import { renderToStaticMarkup } from "react-dom/server";

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

export const sendMagicLinkEmail = async (email: string, link: string) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(link);
    return;
  }
  const from = "Remix Recipes";
  const to = email;
  const subject = "Log in to Remix Recipes!";
  const html = renderToStaticMarkup(
    <div>
      <h1>Log in to Remix Recipes</h1>
      <p>
        Hey there! Click the link below to finish logging in to the Remix
        Recipes app.
      </p>
      <a href={link}>Log In</a>
    </div>
  );
  const senderEmail = "seanjiangsh@gmail.com";
  return sendEmail({ from, to, subject, html, senderEmail });
};
