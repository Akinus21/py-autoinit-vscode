import * as fs from 'fs';
import * as path from 'path';

// Recursively collect all folders excluding __pycache__
function collectFolders(dir: string, recursive: boolean, folders: string[] = []): string[] {
    if (path.basename(dir) === '__pycache__') return folders;

    folders.push(dir);

    if (!recursive) return folders;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== '__pycache__') {
            collectFolders(path.join(dir, entry.name), recursive, folders);
        }
    }

    return folders;
}

// Parse Python file to extract top-level functions/classes (ignore private)
function parsePythonFile(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const members: string[] = [];
    // Match def/class at column 0 only
    const regex = /^(async\s+def|def|class)\s+([A-Za-z_][A-Za-z0-9_]*)/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match && !match[2].startsWith('_')) {
            members.push(match[2]);
        }
    }

    return members;
}

// Generate __init__.py for one folder
export async function generateInitForFolder(folder: string, recursive = true, verbose = true) {
    const folders = collectFolders(folder, recursive);

    for (const dir of folders) {
        const initFile = path.join(dir, '__init__.py');

        const pyFiles = fs.readdirSync(dir)
            .filter(f => f.endsWith('.py') && f !== '__init__.py');

        const modules: string[] = [];
        const membersMap: Record<string, string[]> = {};

        // Process .py files
        for (const file of pyFiles) {
            const moduleName = path.basename(file, '.py');
            modules.push(moduleName);

            if (verbose) {
                const fileMembers = parsePythonFile(path.join(dir, file));
                membersMap[moduleName] = fileMembers;
            }
        }

        // Include subfolders as modules
        const subfolders = fs.readdirSync(dir, { withFileTypes: true })
            .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== '__pycache__')
            .map(d => d.name);

        modules.push(...subfolders);

        // Build content
        let content = '# Auto-generated __init__.py\n\n';

        for (const mod of modules.sort()) {
            content += `from . import ${mod}\n`;
            if (membersMap[mod]) {
                membersMap[mod].sort().forEach(member => {
                    content += `from .${mod} import ${member}\n`;
                });
            }
        }

        // Build __all__: modules first, then members
        content += '\n__all__ = [\n';
        modules.sort().forEach(m => content += `    "${m}",\n`);
        Object.values(membersMap).flat().sort().forEach(mem => content += `    "${mem}",\n`);
        content += ']\n';

        fs.writeFileSync(initFile, content, 'utf-8');
    }
}
