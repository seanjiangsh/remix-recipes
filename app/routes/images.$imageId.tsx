import { json, LoaderFunctionArgs } from "@remix-run/node";

import { canReadRecipeImage } from "~/utils/abilities.server";
import { getImage } from "~/utils/files/images";

const badRequest = json({ message: "imageId is required" }, { status: 400 });
const notFound = json({ message: "Image not found" }, { status: 404 });

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { imageId } = params;
  if (!imageId) throw badRequest;
  await canReadRecipeImage(request, imageId);
  try {
    const image = await getImage(imageId);
    if (!image) throw notFound;
    const { mime, buffer } = image;
    const headers = { "Content-Type": mime };
    return new Response(buffer, { headers });
  } catch (error) {
    console.error("Error reading image:", error);
    throw json({ message: "Failed to read image" }, { status: 500 });
  }
}
