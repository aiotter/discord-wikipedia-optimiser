import { fetchWikipediaData, getTitles } from "./wikipedia.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.103.0/testing/asserts.ts";

Deno.test("Get titles from string", () => {
  const titles = getTitles("https://ja.wikipedia.org/wiki/ユーラシアカワウソ");
  assertEquals(titles, ["ユーラシアカワウソ"]);
});

Deno.test("Fetch wikipedia data", async () => {
  const data = await fetchWikipediaData(["ユーラシアカワウソ"])
    .then((array) => array.pop());
  assert(data);
  assertEquals(data.pageId, 944167);
  assertEquals(data.title, "ユーラシアカワウソ");
  assertEquals(
    data.summary,
    "**ユーラシアカワウソ**(_Lutra lutra_)は、哺乳綱食肉目イタチ科カワウソ属に分類される食肉類。別名**ヨーロッパカワウソ**。",
  );
  assertEquals(
    data.pageImageUrl,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Fischotter%2C_Lutra_Lutra.JPG/300px-Fischotter%2C_Lutra_Lutra.JPG",
  );
});
