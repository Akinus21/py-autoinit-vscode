import * as vscode from 'vscode';
import { generateInitForFolder } from './generateInit';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'autoinit.generateInit',
        async (uri?: vscode.Uri) => {
            let targetFolder: string;

            if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
                targetFolder = uri.fsPath;
            } else {
                const folders = vscode.workspace.workspaceFolders;
                if (!folders) {
                    vscode.window.showErrorMessage('No workspace folder open.');
                    return;
                }
                targetFolder = folders[0].uri.fsPath;
            }

            // Prompt for verbose mode
            const verbosePick = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { placeHolder: 'Run in verbose mode (Include top-level functions and classes)?' }
            );
            if (!verbosePick) {
                vscode.window.showInformationMessage('Operation cancelled.');
                return;
            }
            const verbose = verbosePick === 'Yes';

            // Prompt for recursive mode
            const recursivePick = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { placeHolder: 'Run in recursive mode?' }
            );
            if (!recursivePick) {
                vscode.window.showInformationMessage('Operation cancelled.');
                return;
            }
            const recursive = recursivePick === 'Yes';

            // Run generateInit for the folder
            await generateInitForFolder(targetFolder, recursive, verbose);

            vscode.window.showInformationMessage(
                `__init__.py generation complete!\nFolder: ${targetFolder}\nVerbose: ${verbose}\nRecursive: ${recursive}`
            );
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
