export function getImageUrl(
  image: unknown,
  fallback: string = "avatar.png",
): string {
  if (image == null || image === "") {
    return fallback;
  }

  if (typeof image === "string" && /^(https?:\/\/)/i.test(image)) {
    return image;
  }

  if (typeof image === "string") {
    const cleanedPath = image.replace(/^\/+/, "");
    return `/Module_10/${cleanedPath}`;
  }

  if (typeof image === "object" && image !== null) {
    const obj = image as Record<string, unknown>;

    const possibleKeys = [
      "url",
      "path",
      "src",
      "imageUrl",
      "original",
      "secure_url",
      "image",
    ];

    for (const key of possibleKeys) {
      const value = obj[key];
      if (typeof value === "string" && value) {
        const cleaned = value.replace(/^\/+/, "");
        return `/Module_10/${cleaned}`;
      }
    }
  }

  return fallback;
}
