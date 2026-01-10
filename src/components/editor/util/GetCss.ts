export function extractCssFromHtml(html: string): string {
    const matches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (!matches) return "";
    return matches
      .map((styleTag) => {
        const inner = styleTag.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        return inner ? inner[1] : "";
      })
      .join("\n");
  }