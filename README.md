# PyCube

![logo](https://pycube.org/logo.svg)

A work-in-progress story-format in Twine, combining elements of Sugarcube with Python-like syntax.

[Documentation](https://docs.pycube.org/)

---

## Features

* Python like-syntax, `if / else` blocks, using indentation.
* Link to other passages by typing `[[link text | passage]]` or `[[passage]]`.
* Variables that can you display like {var} directly in the page.
* A growing number of bult-in cool macros.

---

## Examples 

In a passage titled `Init`:

```
$gold = 4
$health = 10
```

In the `start` passage:

```
Gold: {gold}
Health: {health}
Inventory: {inventory}

[[Make More Money | Next]]
```

In the `Next` passage:

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
