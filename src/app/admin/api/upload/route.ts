import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { json, sameOrigin, signedIn } from "@/lib/admin/auth";

const GB = 1024 * 1024 * 1024;

/**
 * Hands the browser a one-off pass to send a video straight to the upload store. The
 * file never passes through the site's own servers, so large videos are fine. Only a
 * signed-in visitor gets a pass, and it only allows one video file under uploads/.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request) || !signedIn(request)) return json({ error: "Sign in first." }, 401);
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^uploads\/[\w.-]{1,120}$/.test(pathname)) throw new Error("Bad file name.");
        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"],
          maximumSizeInBytes: 2 * GB,
          addRandomSuffix: true,
          validUntil: Date.now() + 60 * 60_000,
        };
      },
    });
    return json(result);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Upload failed." }, 400);
  }
}
