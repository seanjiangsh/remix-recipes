import fse from "fs-extra";
import mime from "mime";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const { ARC_ENV, AWS_REGION, S3_STATIC_BUCKET } = process.env;
let ARC_STATIC_BUCKET = process.env.ARC_STATIC_BUCKET;

const isDev = ARC_ENV === "testing";

if (isDev) ARC_STATIC_BUCKET = S3_STATIC_BUCKET;
if (typeof ARC_STATIC_BUCKET !== "string" || typeof AWS_REGION !== "string") {
  const msg =
    "S3_STATIC_BUCKET or AWS_REGION must be defined in your .env file in dev environment";
  throw new Error(msg);
}

const LOCAL_DIR = "../public/recipe-images";
const S3_DIR = "recipe-images";

type SaveImageArgs = { recipeId: string; image: File };

export const saveRecipeImage = (args: SaveImageArgs) => {
  return isDev ? saveImageLocal(args) : saveImageS3(args);
};

const saveImageLocal = async (args: SaveImageArgs) => {
  try {
    const buf = Buffer.from(await args.image.arrayBuffer());
    const fileName = getFileName(args);

    // * check files exist then delete
    await deleteImagesLocal(args.recipeId);

    // * save new file
    const path = `${LOCAL_DIR}/${fileName}`;
    await fse.ensureDir(LOCAL_DIR);
    await fse.remove(path);
    await fse.writeFile(path, buf);
    return fileName;
  } catch (err) {
    console.error("Error saving image locally:", err);
  }
};

const saveImageS3 = async (args: SaveImageArgs) => {
  try {
    const s3Client = new S3Client({ region: AWS_REGION });
    const Bucket = ARC_STATIC_BUCKET;
    const file = getFileName(args);
    const Key = `${S3_DIR}/${file}`;

    // * check files exist then delete
    await deleteImagesS3(args.recipeId);

    // * upload new file
    const Body = Buffer.from(await args.image.arrayBuffer());
    const cmd = new PutObjectCommand({ Bucket, Key, Body });
    await s3Client.send(cmd);
    return file;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
};

const getFileName = (args: SaveImageArgs) => {
  const {
    recipeId,
    image: { type },
  } = args;
  return `${recipeId}${type.replace("image/", ".")}`;
};

export const deleteImages = async (recipeId: string) => {
  return isDev ? deleteImagesLocal(recipeId) : deleteImagesS3(recipeId);
};

const deleteImagesLocal = async (recipeId: string) => {
  const images = getImagesLocal(recipeId);
  if (!images.length) return;

  const removeCmds = images.map((f) => fse.remove(`${LOCAL_DIR}/${f}`));
  await Promise.all(removeCmds);
};

const deleteImagesS3 = async (recipeId: string) => {
  const s3Client = new S3Client();
  const Bucket = ARC_STATIC_BUCKET;
  const Prefix = `${S3_DIR}/${recipeId}`;
  const listCmd = new ListObjectsV2Command({ Bucket, Prefix });
  const { Contents: s3Files } = await s3Client.send(listCmd);
  if (!s3Files || !s3Files.length) return;

  const deleteCmds = s3Files.map(({ Key }) => {
    const deleteCmd = new DeleteObjectCommand({ Bucket, Key });
    return s3Client.send(deleteCmd);
  });
  await Promise.all(deleteCmds);
};

export const getImage = (recipeId: string) => {
  return isDev ? getImageLocal(recipeId) : getImageS3(recipeId);
};

type GetImageResult = { mime: string; buffer: Buffer };

const getImageLocal = async (
  recipeId: string
): Promise<GetImageResult | undefined> => {
  const images = getImagesLocal(recipeId);
  if (!images.length) return;

  const image = images[0];
  const mimeType = mime.getType(image);
  if (!mimeType) return;
  const buffer = await fse.readFile(`${LOCAL_DIR}/${image}`);
  return { mime: mimeType, buffer };
};

const getImageS3 = async (
  recipeId: string
): Promise<GetImageResult | undefined> => {
  const s3Client = new S3Client();
  const Bucket = ARC_STATIC_BUCKET;
  const Prefix = `${S3_DIR}/${recipeId}`;
  const listCmd = new ListObjectsV2Command({ Bucket, Prefix });
  const { Contents: s3Files } = await s3Client.send(listCmd);
  if (!s3Files || !s3Files.length) return;

  const Key = s3Files[0].Key;
  const getCmd = new GetObjectCommand({ Bucket, Key });
  const { ContentType, Body } = await s3Client.send(getCmd);
  if (!ContentType || !Body) return;
  const buffer = Buffer.from(await Body.transformToByteArray());
  return { mime: ContentType, buffer };
};

const getImagesLocal = (recipeId: string) =>
  fse.readdirSync(LOCAL_DIR).filter((f) => f.startsWith(recipeId));
