import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mindmorph Edubridge",
    short_name: "Mindmorph",
    description: "West Africa's trusted bridge to global education.",
    start_url: "/",
    display: "standalone",
    background_color: "#F1EFE8",
    theme_color: "#0C447C",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
