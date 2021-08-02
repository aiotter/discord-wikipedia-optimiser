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

    messageCreate(message) {
      if (message.isBot) return;
      const wikipediaTitles = getTitles(message.content);
      if (wikipediaTitles.length === 0) return;
      fetchWikipediaData(wikipediaTitles)
        .then((wikipediaData) =>
          wikipediaData.map((datum) => {
            return {
              title: datum.title,
              url: `https://ja.wikipedia.org/?curid=${datum.pageId}`,
              description: datum.summary,
              footer: { text: footer },
              image: {url: datum.pageImageUrl},
            };
          })
        )
        .then((embeds) => message.reply({ embeds: embeds }, false))
        .then(() =>
          // FIXME: `message.edit` is not working now. Needs upstream bugfix.
          // await message.edit({ flags: 4 }).catch(console.error);  // clear embeds
          rest.runMethod(
            "patch",
            endpoints.CHANNEL_MESSAGE(message.channelId, message.id),
            { flags: 4 }, // clear embeds
          )
        ).catch(console.error);
    },
  },
});
