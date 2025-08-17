"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const generateInit_1 = require("./generateInit");
const fs = __importStar(require("fs"));
// Create a dedicated output channel for your extension
const outputChannel = vscode.window.createOutputChannel("AutoInit");
// Helper logger
function log(message) {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] ${message}`);
}
function activate(context) {
    log("Activating AutoInit extension v0.0.1...");
    const disposable = vscode.commands.registerCommand('autoinit.generateInit', async (uri) => {
        let targetFolder;
        if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
            targetFolder = uri.fsPath;
            log(`Target folder selected: ${targetFolder}`);
        }
        else {
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
        const verbosePick = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Run in verbose mode (Include top-level functions and classes)?' });
        if (!verbosePick) {
            vscode.window.showInformationMessage('Operation cancelled.');
            log("Operation cancelled at verbose prompt.");
            return;
        }
        const verbose = verbosePick === 'Yes';
        log(`Verbose mode: ${verbose}`);
        // Prompt for recursive mode
        const recursivePick = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Run in recursive mode?' });
        if (!recursivePick) {
            vscode.window.showInformationMessage('Operation cancelled.');
            log("Operation cancelled at recursive prompt.");
            return;
        }
        const recursive = recursivePick === 'Yes';
        log(`Recursive mode: ${recursive}`);
        // Run generateInit for the folder
        try {
            await (0, generateInit_1.generateInitForFolder)(targetFolder, recursive, verbose);
            vscode.window.showInformationMessage(`__init__.py generation complete!\nFolder: ${targetFolder}\nVerbose: ${verbose}\nRecursive: ${recursive}`);
            log(`__init__.py generation complete for ${targetFolder}`);
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error generating __init__.py: ${err.message}`);
            log(`Error: ${err.stack || err.message}`);
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(outputChannel);
    log("AutoInit extension activated successfully.");
}
function deactivate() {
    log("Deactivating AutoInit extension.");
}
