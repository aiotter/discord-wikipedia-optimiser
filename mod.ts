import {
  endpoints,
  rest,
  startBot,
} from "https://deno.land/x/discordeno@11.2.0/mod.ts";
import { fetchWikipediaData, getTitles } from "./wikipedia.ts";

const footer = "Powered by discord-wikipedia-optimiser (@aiotter)";

startBot({
  token: Deno.env.get("TOKEN") as string,
  intents: ["Guilds", "GuildMessages"],
  eventHandlers: {
    ready() {
      console.log("Successfully connected to gateway");
    },

    async messageCreate(message) {
      if (message.isBot) return;
      const wikipediaTitles = getTitles(message.content);
      if (wikipediaTitles.length === 0) return;

      try {
        const wikipediaData = await fetchWikipediaData(wikipediaTitles);
        const embeds = wikipediaData.map((datum) => ({
          title: datum.title,
          url: `https://ja.wikipedia.org/?curid=${datum.pageId}`,
          description: datum.summary,
          footer: { text: footer },
          image: { url: datum.pageImageUrl },
        }));

        // if embeds has only one item, the url can be specified; so use it instead.
        if (embeds.length === 1) embeds[0].url = wikipediaTitles[0].url;

        await message.reply({ embeds: embeds }, false);

        // FIXME: `message.edit` is not working now. Needs upstream bugfix.
        // await message.edit({ flags: 4 }).catch(console.error);  // clear embeds
        await rest.runMethod(
          "patch",
          endpoints.CHANNEL_MESSAGE(message.channelId, message.id),
          { flags: 4 }, // clear embeds
        );
      } catch (error) {
        console.error(error);
      }
    },
  },
});
