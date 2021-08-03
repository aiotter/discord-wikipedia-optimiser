import tds from "https://cdn.skypack.dev/turndown@7.1.1";
import { DOMParser } from "https://github.com/b-fuze/deno-dom/raw/188d7240e5371caf1b4add8bb7183933d142337e/deno-dom-wasm.ts";

const parser = new DOMParser();
const turndownService = new tds({});

export const wikipediaRegex = new RegExp(
  "https?://.*?ja\\.wikipedia\\.org/wiki/([^/\\s]+)(?!/)",
  "g",
);
const wikipediaApi =
  "https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&pithumbsize=300";

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

export interface TitleUrlPair {
  title: string;
  url: string;
}

export function getTitles(content: string) {
  return Array.from(content.matchAll(wikipediaRegex))
    .map((match) => ({ title: match[1], url: match[0] }));
}

function convertToMarkdown(html: string) {
  const document = parser.parseFromString(html, "text/html");
  return turndownService.turndown(document);
}

export async function fetchWikipediaData(titles: TitleUrlPair[]) {
  const url = new URL(wikipediaApi);
  url.href += `&titles=${titles.map((pair) => pair.title).join("|")}`;
  const response = await fetch(url);
  const json: WikipediaRawData = await response.json();
  return Object.values(json.query.pages).map((rawDataFragment) => ({
    pageId: rawDataFragment.pageid,
    title: rawDataFragment.title.trim(),
    summary: convertToMarkdown(rawDataFragment.extract).trim(),
    pageImageUrl: rawDataFragment.thumbnail?.source ?? undefined,
  } as WikipediaData));
}
