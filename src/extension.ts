import * as vscode from 'vscode';
import { generateInitForFolder } from './generateInit';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'autoinit.generateInit',
        async (uri?: vscode.Uri) => {
            let targetFolder: string | undefined;

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

            // Prompt user for verbose option
            const includeMembers = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                {
                    placeHolder: 'Include top-level functions and classes in __init__.py?',
                }
            );

            if (!includeMembers) {
                vscode.window.showInformationMessage('Operation cancelled.');
                return;
            }

            const verbose = includeMembers === 'Yes';
            await generateInitForFolder(targetFolder, true, verbose);

            vscode.window.showInformationMessage(
                `__init__.py generation complete! Folder: ${targetFolder}, Verbose: ${verbose}`
            );
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
