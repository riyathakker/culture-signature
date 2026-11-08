/**
 * Rewrites a Cloudinary delivery URL to serve an optimized variant:
 *   f_auto  → best format the browser supports (AVIF / WebP)
 *   q_auto  → automatic quality (big byte savings, visually lossless)
 *   w_<n>,c_limit → cap the delivered width (never upscales) when given
 *
 * Non-Cloudinary URLs (local `/images/...`, `data:`, `blob:`) and URLs that
 * already carry a transformation are returned unchanged.
 */
export function optimizeImage(url?: string | null, width?: number): string {
  if (!url) return "";

  const marker = "/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) return url;

  const [head, tail] = url.split(marker);
  // Already transformed (e.g. starts with f_auto / w_ / c_ )? Leave it alone.
  if (/^(f_|q_|w_|c_|h_|e_|t_)/.test(tail)) return url;

  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`, "c_limit");

  return `${head}${marker}${transforms.join(",")}/${tail}`;
}
