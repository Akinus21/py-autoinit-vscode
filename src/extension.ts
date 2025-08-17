import * as vscode from 'vscode';
import { generateInitForFolder } from './generateInit';
import * as fs from 'fs';

// Create a dedicated output channel for your extension
const outputChannel = vscode.window.createOutputChannel("AutoInit");

// Helper logger
function log(message: string) {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] ${message}`);
}

export function activate(context: vscode.ExtensionContext) {
    log("Activating AutoInit extension...");

    const disposable = vscode.commands.registerCommand(
        'autoinit.generateInit',
        async (uri?: vscode.Uri) => {
            let targetFolder: string;

            if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
                targetFolder = uri.fsPath;
                log(`Target folder selected: ${targetFolder}`);
            } else {
                const folders = vscode.workspace.workspaceFolders;
                if (!folders) {
                    vscode.window.showErrorMessage('No workspace folder open.');
                    log("Error: No workspace folder open.");
                    return;
                }
                targetFolder = folders[0].uri.fsPath;
                log(`Defaulting to workspace root: ${targetFolder}`);
            }

            // Prompt for verbose mode
            const verbosePick = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { placeHolder: 'Run in verbose mode (Include top-level functions and classes)?' }
            );
            if (!verbosePick) {
                vscode.window.showInformationMessage('Operation cancelled.');
                log("Operation cancelled at verbose prompt.");
                return;
            }
            const verbose = verbosePick === 'Yes';
            log(`Verbose mode: ${verbose}`);

            // Prompt for recursive mode
            const recursivePick = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { placeHolder: 'Run in recursive mode?' }
            );
            if (!recursivePick) {
                vscode.window.showInformationMessage('Operation cancelled.');
                log("Operation cancelled at recursive prompt.");
                return;
            }
            const recursive = recursivePick === 'Yes';
            log(`Recursive mode: ${recursive}`);

            // Run generateInit for the folder
            try {
                await generateInitForFolder(targetFolder, recursive, verbose);
                vscode.window.showInformationMessage(
                    `__init__.py generation complete!\nFolder: ${targetFolder}\nVerbose: ${verbose}\nRecursive: ${recursive}`
                );
                log(`__init__.py generation complete for ${targetFolder}`);
            } catch (err: any) {
                vscode.window.showErrorMessage(`Error generating __init__.py: ${err.message}`);
                log(`Error: ${err.stack || err.message}`);
            }
        }
    );

    context.subscriptions.push(disposable);
    context.subscriptions.push(outputChannel);

    log("AutoInit extension activated successfully.");
}

export function deactivate() {
    log("Deactivating AutoInit extension.");
}
