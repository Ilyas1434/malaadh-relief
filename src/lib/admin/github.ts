/** The site's repository, where the "Add video" job runs. */
const REPO = process.env.GITHUB_REPO ?? "Ilyas1434/malaadh-relief";

export function github(path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${process.env.GITHUB_DISPATCH_TOKEN}`,
      "x-github-api-version": "2022-11-28",
      "content-type": "application/json",
      ...init.headers,
    },
  });
}

/** Only files in our own upload store, under uploads/. */
export function isOurUpload(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com") && u.pathname.startsWith("/uploads/");
  } catch {
    return false;
  }
}
