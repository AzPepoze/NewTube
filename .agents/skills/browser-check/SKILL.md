---
name: browser-check
description: Check the built StyleShift extension in a real browser (headless Chromium or Firefox) by taking screenshots, running page scripts and running the welcome and Theme Manager scenarios. Use when the user asks to see, test or verify the extension on YouTube, or to check a UI change in the real page.
---

# Browser Check

Drive the built extension in a real browser and look at the result. Local tool in `.agents/browser/`, not tracked by git.

## Before you start

1. Build the extension: `bun run build`. The tool loads `out/dist/chromium` or `out/dist/firefox`.
2. Make sure nothing else holds ports `9222` (Chromium) or `9223` (Firefox).

## Commands

Run from the repo root.

| Command                                                              | What it does                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `bun .agents/browser/cli.ts shot --browser chromium`                 | Screenshot YouTube home into `out/shots/shot-chromium.png`    |
| `bun .agents/browser/cli.ts eval "document.title" --browser firefox` | Run a page expression, print the JSON result                  |
| `bun .agents/browser/cli.ts scenario home --browser chromium`        | Home page screenshot                                          |
| `bun .agents/browser/cli.ts scenario welcome --browser firefox`      | First-run welcome: every step, then the tutorial prompt       |
| `bun .agents/browser/cli.ts scenario themes --browser chromium`      | Theme Manager: 13 presets listed, every card renders the mock |

`--browser` defaults to `chromium`. `--url` changes the page for `shot` and `eval`.

## How it works

| Browser  | Launch                                                                                   | Control                               |
| -------- | ---------------------------------------------------------------------------------------- | ------------------------------------- |
| Chromium | Direct headless launch with `--load-extension`, fresh profile in `out/browser-profiles/` | Chrome DevTools Protocol on port 9222 |
| Firefox  | `web-ext run` (installs the add-on in a temp profile), headless                          | WebDriver BiDi on port 9223           |

Each run starts from a clean profile, so the first-run welcome shows every time. The tool closes its browser when done.

## Scenarios

| Scenario  | Checks                                                                              |
| --------- | ----------------------------------------------------------------------------------- |
| `home`    | StyleShift button is on the page                                                    |
| `welcome` | Confirm, welcome steps, Next on the look step, tutorial prompt                      |
| `themes`  | Settings > Themes opens Theme Manager; each preset name shown; each card has a mock |

Screenshots land in `out/shots/`. Read them to judge the layout.

## Notes

- A failed check exits with code 1 and prints which assertion failed.
- Firefox `web-ext` does not always remove its Firefox process on exit. The tool kills it by its port argument. If a port stays busy, kill the process named in `ps -eo pid,args | grep remote-debugging-port`.
- Headless Chromium cannot show YouTube's signed-in feed. Anything that needs an account is out of reach.
- Names in the page come from the build: `StyleShift` shows as the configured name, e.g. `NewTube`. Match with the built text.
