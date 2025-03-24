#!/usr/bin/env node
import { execSync } from "child_process";
import process from "process";
import path from "path";
import fs from "fs";

const projectName = process.argv[2];

if (!projectName) {
    console.error("Errore: devi specificare il nome del progetto!");
    process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

console.log(`✨ Creazione del progetto React: ${projectName}...`);
execSync(`git clone https://github.com/GabriWasTaken/backoffice.git ${projectPath}`, { stdio: "inherit" });

// Rimuovi la cartella .git per evitare problemi
fs.rmSync(path.join(projectPath, ".git"), { recursive: true, force: true });

console.log("📦 Installazione dipendenze...");
execSync(`cd ${projectName} && npm install`, { stdio: "inherit" });

console.log("✅ Setup completato! Usa:");
console.log(`   cd ${projectName}`);
console.log("   npm start");
