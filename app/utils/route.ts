import { json } from "@remix-run/node";

export const badRequest = (args: string) =>
  json({ message: `${args} is required` }, { status: 400 });

export const badRequestWithMessage = (message: string) =>
  json({ message }, { status: 400 });

export const notFound = (args?: string) =>
  json({ message: `${args || ""} not found` }, { status: 404 });

export const unauthorized = (message: string) =>
  json({ message }, { status: 401 });

export const internalServerError = (message: string) =>
  json({ message }, { status: 500 });
