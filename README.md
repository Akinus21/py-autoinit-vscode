# Py-AutoInit VSCode Extension

![AutoInit Logo](./images/logo.png)

## Overview

**Py-AutoInit** is a VSCode extension that helps Python developers automatically generate `__init__.py` files in your project. It recursively creates import statements for all modules and top-level functions/classes, maintaining clean and organized packages.

With Py-AutoInit, you no longer have to manually update `__init__.py` files. It supports both verbose mode (to include top-level functions and classes) and recursive mode (to process all subfolders).

---

## Features

* ✅ Automatically generate `__init__.py` files for Python packages
* ✅ Recursive folder scanning
* ✅ Optional verbose mode to include top-level functions and classes
* ✅ Cross-platform (Linux, macOS, Windows)
* ✅ Right-click context menu integration in VSCode

---

## Installation

### From VSCode Marketplace

1. Open VSCode.
2. Go to **Extensions** (`Ctrl+Shift+X`).
3. Search for **Py-AutoInit**.
4. Click **Install**.

### From VSIX (manual install)

1. Download the latest `.vsix` file from [Releases](https://github.com/yourusername/py-autoinit-vscode/releases).
2. In VSCode, go to **Extensions** → click `...` → **Install from VSIX...**.

---

## Usage

### Generate `__init__.py`

1. In the **Explorer**, right-click a folder.
2. Click **Generate **init**.py**.
3. Answer the prompts:

```
Run in verbose mode (Include top-level functions and classes)? Y/N
Run in recursive mode? Y/N
```

4. The extension generates `__init__.py` in the selected folder and subfolders if recursive mode is selected.

### Example Output

```python
# Auto-generated __init__.py

from . import process
from .process import process_results
from .process import run_command
from . import utils
from .utils import print_results
from .utils import refine_results

__all__ = [
  "process",
  "process_results",
  "run_command",
  "utils",
  "print_results",
  "refine_results",
]
```

---

## Configuration

Currently, Py-AutoInit does not require additional configuration. It automatically detects Python packages in your workspace.

Future versions may include:

* Custom ignore patterns
* Automatic `__init__.py` updates on file save

---

## Contributing

We welcome contributions!

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature-name`.
3. Make your changes.
4. Test the extension locally using `F5` in VSCode.
5. Submit a pull request.

---

## License

MIT License © 2025 Akinus21
