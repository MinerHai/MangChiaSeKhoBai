import sanitizeHtml from "sanitize-html";

export const cleanHTML = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      img: ["src", "alt"],
      a: ["href", "target"],
    },
  });
};
