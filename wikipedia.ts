import tds from "https://cdn.skypack.dev/turndown@7.1.1";
import { DOMParser } from "https://github.com/b-fuze/deno-dom/raw/188d7240e5371caf1b4add8bb7183933d142337e/deno-dom-wasm.ts";

const parser = new DOMParser();
const turndownService = new tds({});

export const wikipediaRegex = new RegExp(
  "https?://.*?ja\\.wikipedia\\.org/wiki/([^/\\s]+)(?!/)",
  "g",
);
const wikipediaApi = new URL(
  "https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&pithumbsize=300",
);

interface WikipediaRawData {
  query: {
    pages: {
      [id: string]: {
        extract: string;
        pageid: number;
        title: string;
        thumbnail?: {
          width: number;
          height: number;
          source: string;
        };
      };
    };
  };
}

export interface WikipediaData {
  pageId: number;
  title: string;
  summary: string;
  pageImageUrl?: string;
}

export function getTitles(content: string) {
  return Array.from(content.matchAll(wikipediaRegex))
    .map((match) => match[1]);
}

export function fetchWikipediaData(titles: string[]) {
  const url = wikipediaApi;
  url.href += `&titles=${titles.join("|")}`;
  return fetch(url)
    .then((response) => response.json())
    .then((json: WikipediaRawData) =>
      Object.values(json.query.pages).map((rawDataFragment) => {
        const document = parser.parseFromString(
          rawDataFragment.extract,
          "text/html",
        );
        const markdown = turndownService.turndown(document);

        return {
          pageId: rawDataFragment.pageid,
          title: rawDataFragment.title.trim(),
          summary: markdown.trim(),
          pageImageUrl: rawDataFragment.thumbnail?.source ?? undefined,
        } as WikipediaData;
      })
    );
}
