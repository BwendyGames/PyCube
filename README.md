# PyCube

![logo](https://pycube.org/logo.svg)

A story format for [Twine](https://twinery.org/) that combines the macro power of [SugarCube](https://www.motoslave.net/sugarcube/) with clean, Python-like syntax — indentation-based blocks, no closing tags, no `<<...>>` macro soup.

Big thank you and shoutout to [SugarCube](https://www.motoslave.net/sugarcube/) for making game-making accessible to so many.

Make sure to check out the [Documentation](https://docs.pycube.org/)!

Download the forked [Twine Editor](https://github.com/BwendyGames/twinepy) for Windows, for increased PyCube support!

See it in action with an [online example](https://example.pycube.org/) ([source](https://github.com/BwendyGames/pycube-example)), or open [examples/PyCube-Feature-Demo.html](examples/PyCube-Feature-Demo.html) in this repo for a self-contained demo covering every feature below.

---

## Features

* **Python-like syntax** — indentation-based `if` / `elif` / `else`, `for` / `while` loops, no closing tags.
* **Variables** — `$var` for persistent story variables, `_var` for passage-local temporary ones, displayed inline with `{expr}`.
* **Links** — plain `[[passage]]` / `[[text|passage]]`, setter-links that update variables on click, and image links.
* **Custom macros (widgets)** — define reusable blocks with `def name(args):` and call them like a function.
* **Interactive reveals** — `wait(seconds):` delayed text, `replace('...'):` click-to-reveal, and `choice('...'): option('...'):` branching inline choices.
* **Text markup** — bold, italic, underline, strikethrough, superscript/subscript, styled spans, headers, lists, horizontal rules, and Markdown-style tables.
* **Special passages** — `StoryInit` (runs once before the story starts), `PassageHeader` / `PassageFooter` (wrap every passage), `Sidebar` / `Author` (shown in the menu).
* **Tagged passages** — tag a passage `stylesheet` to inject custom CSS, `script` to run custom JS helpers, or `widget` to register `def` blocks globally.
* **Built-in helpers** — `rand()`, `either()`, `randomFloat()`, `range()`, `hasVisited()`, `passage()`, `previous()`.
* **Save system** — 5 save slots with save/load/export/import, back/forward navigation history, and a restart button, all in a collapsible sidebar.

---

## Syntax Guide

### Variables & comments

```
$gold = 4
$health = 10
_roll = rand(1, 6)   # temporary variable, cleared after this passage renders
# a full-line comment is ignored entirely
```

`$name` variables persist for the whole playthrough (and are saved/loaded with the game). `_name` variables are automatically cleared after each passage renders.

### Displaying values

```
Gold: {gold}
Health: {health}
First item: {inventory[0]}
```

### Conditionals

```
if gold > 10:
    You're rich!
elif gold > 0:
    You have a little gold.
else:
    You're broke.
```

### Loops

```
for item in inventory:
    * {item}

$n = 3
while n > 0:
    Countdown: {n}
    $n -= 1
```

`+=`, `-=`, `*=` and `/=` compound assignment are all supported. Loops are capped at 1000 iterations as a safety net against infinite loops.

### Custom macros (widgets)

```
def greet(name):
    Hello, {name}! Welcome to the cave.

greet("Adventurer")
```

Tag a passage `widget` to make its `def` blocks available from every passage in the story, instead of only the passage that defines them.

### Delayed reveals & interactive blocks

```
wait(2):
    ...the torches flicker and dim...

replace('Search the room for more loot'):
    You find a shiny coin! $gold += 1

choice('Which path do you take?'):
    option('Left - torchlit tunnel'):
        You head left. It's warmer here.
    option('Right - cold draft'):
        You head right. A chill runs through you.
```

### Links

```
[[Go to the Start]]
[[Continue|Next Passage]]
[[Take the rope|Left Room][$hasRope = true]]
[img[cave.png]]
[img[cave.png][Next Passage]]
```

Setter-links (`[[text|target][statements]]`) run one or more `;`-separated statements before navigating to `target`.

### Text markup

```
!! A Section Header

''bold'' //italic// __underline__ ~~strike~~ ^^sup^^ ,,sub,, @@warning;a styled span@@

* bullet one
* bullet two

1. first
2. second

----

| Stat   | Value |
|--------|-------|
| Gold   | 15    |
| Health | 100   |
```

Headers use `!` through `!!!!!!` (for `<h1>`–`<h6>`), since `#` is already the line-comment marker.

### Special & tagged passages

| Name / tag       | Purpose |
|------------------|---------|
| `StoryInit`      | Runs once before the start passage; set up your starting variables here. |
| `PassageHeader`  | Rendered before every passage. |
| `PassageFooter`  | Rendered after every passage. |
| `Sidebar`        | Rendered inside the menu sidebar. |
| `Author`         | Rendered near the top of the sidebar (credits, version, etc.). |
| tag `stylesheet` | Passage text is injected as `<style>` CSS. |
| tag `script`     | Passage text is run as JS; top-level functions become callable from `{expr}` anywhere in the story. |
| tag `widget`     | Passage's `def` blocks are registered globally at startup. |

### Built-in helpers

```
rand(1, 6)             # random integer between min and max, inclusive
either("a", "b", "c")  # random pick from a list of options
randomFloat(0, 1)      # random float
range(5)               # [0, 1, 2, 3, 4]
hasVisited("Start")    # true if the player has ever seen that passage
passage()              # name of the current passage
previous()             # name of the previously shown passage
```

---

## Example

In `StoryInit`:

```
$gold = 4
$health = 10
$inventory = ["torch", "rope"]
```

In `Start`:

```
Gold: {gold}
Health: {health}

for item in inventory:
    * {item}

[[Make More Money|Next]]
```

In `Next`:

```
$gold += 1
You got more gold!

if gold > 5:
    Big money.
else:
    Money is tight.

[[Return|Start]]
```

The end result!

![2025-05-29 19-25-36](https://github.com/user-attachments/assets/f283a064-55d8-4e9e-98b4-22e138266b16)

---

## How to Use

Add the story format to your formats in the Twine editor:

![Screenshot 2025-05-29 192827](https://github.com/user-attachments/assets/b30e37bd-0efd-4f26-b740-23c746adba65)

The PyCube URL is: `https://pycube.org/format.js`

![image](https://github.com/user-attachments/assets/d9f6114c-e27a-47c5-8be1-d281af69b9a0)

Prefer the [forked Twine Editor](https://github.com/BwendyGames/twinepy) for the smoothest experience — it ships with extra PyCube-specific editor support.

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before opening a PR.

## License

[BSD 2-Clause](LICENSE)

