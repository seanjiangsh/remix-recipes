import fse from "fs-extra";
import mime from "mime";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const { imageId } = params;
  const notFound = json({ message: "imageId is required" }, { status: 400 });
  if (!imageId) throw notFound;
  // TODO: currently is for dev only, need to add S3 support in production
  const imagePath = `public/images/${imageId}`;
  try {
    const imageExists = fse.existsSync(imagePath);
    const mimeType = mime.getType(imageId);
    if (!imageExists || !mimeType) throw notFound;
    const imageBuffer = await fse.readFile(imagePath);
    const headers = { "Content-Type": mimeType };
    return new Response(imageBuffer, { headers });
  } catch (error) {
    throw json({ message: "Failed to read image" }, { status: 500 });
  }
}
