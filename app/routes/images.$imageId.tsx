import { LoaderFunctionArgs } from "@remix-run/node";

import { getImage } from "~/utils/files/images";
import { badRequest, internalServerError, notFound } from "~/utils/route";

export async function loader({ params }: LoaderFunctionArgs) {
  const { imageId } = params;
  if (!imageId) throw badRequest("imageId");
  try {
    const image = await getImage(imageId);
    if (!image) throw notFound("Image");
    const { mime, buffer } = image;
    const cacheControl = "max-age=30, stale-while-revalidate=60";
    const headers = {
      "content-type": mime,
      "cache-control": cacheControl,
    };
    return new Response(buffer, { headers });
  } catch (error) {
    console.error("Error reading image:", error);
    throw internalServerError("Failed to read image");
  }
}
