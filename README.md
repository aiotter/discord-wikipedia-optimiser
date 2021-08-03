# Discord Wikipedia Optimiser
## Description
When you send a message contains an URL of a Japanese article of Wikipedia, discord appends a disgusting embed with percent-encoded title.

<img width="463" alt="image" src="https://user-images.githubusercontent.com/37664775/127960011-01a2d5be-c0b4-4aee-959c-687b1e67515b.png">

This bot removes the embed and send a nice one instead.

<img width="409" alt="image" src="https://user-images.githubusercontent.com/37664775/127960407-4f08bcff-fd7a-4c11-b815-e80426e1f589.png">

## Notice
The bot needs `MANAGE_MESSAGES` permissions to work properly.

It currently available for Japanese only. If you want it to work in your language, please create an issue.

## How to run the bot
1. Install [deno](https://deno.land).
2. Set your discord bot token to `TOKEN` environment.
3. Run `deno -A mod.ts`.
