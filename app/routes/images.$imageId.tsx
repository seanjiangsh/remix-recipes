import fse from "fs-extra";
import mime from "mime";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const { imageId } = params;
  const notFound = json({ message: "Image not found" }, { status: 404 });
  if (!imageId) throw notFound;
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
