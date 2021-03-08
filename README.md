# Todito for Obsidian 

- Move completed tasks to today's daily note
- Defer tasks to another daily note
- All in 100% Obsidian Markdown!

## How to use

Tasks are created using normal markdown syntax, for example `- [ ] Water the
plants`.

Incomplete tasks can also be moved to another day, and the original task and the moved
task will link bidirectionally (if option is enabled in the configuratio of the plugin).

![move-completed-tasks](docs/screenshots/todito.gif)

## Links between todos

If you want to keep references, on settings disable the option of remove after move.

## Install

This is an Obsidian plugin like any other, and must be cloned or unzipped into your vault's `.obsidian/plugins/` directory, then enabled in the Obsidian configuration. It's not registered as a standard community plugin for downloading or updating within Obsidian, yet.

## Credits

Adapted from [Slated Obsidian](https://github.com/tgrosinger/slated-obsidian) to my current needs. Please, if you find this library usefull please check the sponsor program of Slated-Obsidian library 

[![GitHub Sponsors](https://img.shields.io/github/sponsors/tgrosinger?style=social)](https://github.com/sponsors/tgrosinger)
[![Paypal](https://img.shields.io/badge/paypal-tgrosinger-yellow?style=social&logo=paypal)](https://paypal.me/tgrosinger)
[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/tgrosinger)

This tool has smaller features and instead of incompleted tasks is based on completed tasks

#### Task Format

- [ ] This task is incomplete and repeats ; Every Monday and Tuesday ^task-1234
- [-] This repeating task occurence was skipped ; Every Sunday ^task-5678
- [>] This task was moved to >[[2021-05-01]] ^task-9101
- [x] This task was completed
- [ ] This task was moved here from [[2020-12-31|< Origin]]
- [ ] This task has sub-items that will move with it
  - [ ] Sub items can be a task
  - Or not
- [ ] Tasks can have non-list subcontent too
      Such as this line
