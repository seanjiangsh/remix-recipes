import { randomUUID } from "crypto";
import { Readable } from "stream";

import {
  UploadHandlerPart,
  unstable_createFileUploadHandler,
} from "@remix-run/node";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const getRecipeImageUploadHandler = () => {
  const { ARC_ENV } = process.env;
  // if (ARC_ENV === "testing")
  return unstable_createFileUploadHandler({ directory: "public/images" });
  // return s3UploadHandler;
};

const s3UploadHandler = async (part: UploadHandlerPart) => {
  console.log(part);
  return;
  const { data } = part;
  const s3Client = new S3Client();
  const Bucket = "remixrecipesproduction-staticbucket-zlbgqvscyknu";
  const Key = `images/${randomUUID()}`;
  const Body = Readable.from(data);
  const cmd = new PutObjectCommand({ Bucket, Key, Body });
  try {
    await s3Client.send(cmd);
    console.log("Image uploaded successfully!");
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
};

export const stream2buffer = async (stream: Stream): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>();
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`error converting stream - ${err}`));
  });
};
