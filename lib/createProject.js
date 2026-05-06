import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

import { askProjectName, askFeatures } from "./prompts.js";
import { isValidName, copyTemplate } from "./utils.js";
import { installDependencies } from "./install.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createProject(name) {

    try {

        if (!name)
            name = await askProjectName();

        if (!isValidName(name)) {

            console.log(
                chalk.red("Invalid project name")
            );

            process.exit(1);
        }

        const projectPath = path.resolve(name);

        if (fs.existsSync(projectPath)) {

            console.log(
                chalk.red("Directory already exists")
            );

            process.exit(1);
        }

        const answers = await askFeatures();

        const spinner =
            ora("Creating project...").start();

        const templateType =
            answers.typescript ? "ts" : "js";

        await copyTemplate(
            path.join(
                __dirname,
                `../templates/${templateType}`
            ),
            projectPath
        );

        // Copy .env.example → .env
        const envExamplePath = path.join(
            projectPath,
            "server/.env.example"
        );

        const envPath = path.join(
            projectPath,
            "server/.env"
        );

        if (fs.existsSync(envExamplePath)) {

            fs.copyFileSync(
                envExamplePath,
                envPath
            );
        }

        // Root gitignore
        fs.writeFileSync(
            path.join(projectPath, ".gitignore"),
            "node_modules\n.env\ndist\nbuild\n"
        );

        // =========================
        // Tailwind Setup
        // =========================

        if (answers.tailwind) {

            const isTs = answers.typescript;

            fs.writeFileSync(
                path.join(
                    projectPath,
                    "client/tailwind.config.js"
                ),

`/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
            );

            fs.writeFileSync(
                path.join(
                    projectPath,
                    "client/postcss.config.js"
                ),

`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
            );

            // index.css
            const cssPath = path.join(
                projectPath,
                "client/src/index.css"
            );

            fs.writeFileSync(
                cssPath,

`@tailwind base;
@tailwind components;
@tailwind utilities;
`
            );

            // main.jsx / main.tsx
            const mainFile = path.join(
                projectPath,
                isTs
                    ? "client/src/main.tsx"
                    : "client/src/main.jsx"
            );

            if (fs.existsSync(mainFile)) {

                const content =
                    fs.readFileSync(
                        mainFile,
                        "utf8"
                    );

                fs.writeFileSync(
                    mainFile,
                    `import './index.css';\n${content}`
                );
            }

            // client/package.json
            const clientPkgPath = path.join(
                projectPath,
                "client/package.json"
            );

            if (fs.existsSync(clientPkgPath)) {

                const clientPkg = JSON.parse(
                    fs.readFileSync(
                        clientPkgPath,
                        "utf8"
                    )
                );

                clientPkg.devDependencies =
                    clientPkg.devDependencies || {};

                clientPkg.devDependencies[
                    "tailwindcss"
                ] = "^3.4.0";

                clientPkg.devDependencies[
                    "postcss"
                ] = "^8.4.0";

                clientPkg.devDependencies[
                    "autoprefixer"
                ] = "^10.4.0";

                fs.writeFileSync(
                    clientPkgPath,
                    JSON.stringify(
                        clientPkg,
                        null,
                        2
                    )
                );
            }
        }

        // =========================
        // GLOBAL BACKEND PACKAGES
        // =========================

        const serverPkgPathGlobal = path.join(
            projectPath,
            "server/package.json"
        );

        if (fs.existsSync(serverPkgPathGlobal)) {

            const serverPkg = JSON.parse(
                fs.readFileSync(
                    serverPkgPathGlobal,
                    "utf8"
                )
            );

            serverPkg.dependencies =
                serverPkg.dependencies || {};

            // Global packages
            serverPkg.dependencies[
                "express-session"
            ] = "^1.18.0";

            serverPkg.dependencies[
                "connect-flash"
            ] = "^0.1.1";

            serverPkg.dependencies[
                "debug"
            ] = "^4.3.4";

            serverPkg.dependencies[
                "cookie-parser"
            ] = "^1.4.6";

            serverPkg.dependencies[
                "ejs"
            ] = "^3.1.9";

            // TypeScript typings
            if (answers.typescript) {

                serverPkg.devDependencies =
                    serverPkg.devDependencies || {};

                serverPkg.devDependencies[
                    "@types/express-session"
                ] = "^1.17.10";

                serverPkg.devDependencies[
                    "@types/cookie-parser"
                ] = "^1.4.7";

                serverPkg.devDependencies[
                    "@types/connect-flash"
                ] = "^0.0.40";

                serverPkg.devDependencies[
                    "@types/debug"
                ] = "^4.1.12";

                serverPkg.devDependencies[
                    "@types/ejs"
                ] = "^3.1.5";
            }

            fs.writeFileSync(
                serverPkgPathGlobal,
                JSON.stringify(
                    serverPkg,
                    null,
                    2
                )
            );
        }

        // =========================
        // AUTH SETUP
        // =========================

        if (answers.auth) {

            const isTs = answers.typescript;

            const routesDir = path.join(
                projectPath,
                "server/src/routes"
            );

            fs.mkdirSync(
                routesDir,
                { recursive: true }
            );

            // TypeScript Auth Route
            if (isTs) {

                fs.writeFileSync(
                    path.join(
                        routesDir,
                        "auth.ts"
                    ),

`import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {

  const token = jwt.sign(
    { id: 1 },
    process.env.JWT_SECRET || "secret"
  );

  res.json({ token });
});

export default router;
`
                );

            } else {

                // JavaScript Auth Route
                fs.writeFileSync(
                    path.join(
                        routesDir,
                        "auth.js"
                    ),

`const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {

  const token = jwt.sign(
    { id: 1 },
    process.env.JWT_SECRET || "secret"
  );

  res.json({ token });
});

module.exports = router;
`
                );
            }

            // Auth Packages
            const serverPkgPath = path.join(
                projectPath,
                "server/package.json"
            );

            if (fs.existsSync(serverPkgPath)) {

                const serverPkg = JSON.parse(
                    fs.readFileSync(
                        serverPkgPath,
                        "utf8"
                    )
                );

                serverPkg.dependencies =
                    serverPkg.dependencies || {};

                serverPkg.dependencies[
                    "jsonwebtoken"
                ] = "^9.0.0";

                serverPkg.dependencies[
                    "bcryptjs"
                ] = "^2.4.3";

                if (isTs) {

                    serverPkg.devDependencies =
                        serverPkg.devDependencies || {};

                    serverPkg.devDependencies[
                        "@types/jsonwebtoken"
                    ] = "^9.0.0";

                    serverPkg.devDependencies[
                        "@types/bcryptjs"
                    ] = "^2.4.0";
                }

                fs.writeFileSync(
                    serverPkgPath,
                    JSON.stringify(
                        serverPkg,
                        null,
                        2
                    )
                );
            }
        }

        // =========================
        // Install Dependencies
        // =========================

        spinner.text =
            "Installing dependencies...";

        await installDependencies(projectPath);

        // =========================
        // Git Init
        // =========================

        spinner.text =
            "Initializing git...";

        execSync(
            "git init",
            { cwd: projectPath }
        );

        execSync(
            "git add .",
            { cwd: projectPath }
        );

        execSync(
            'git commit -m "Initial commit"',
            { cwd: projectPath }
        );

        spinner.succeed(
            "Project ready!"
        );

        console.log(
            chalk.green(`\ncd ${name}`)
        );

        console.log(
            "In separate terminals, run:"
        );

        console.log(
            chalk.green(
                "  cd client && npm run dev"
            )
        );

        console.log(
            chalk.green(
                "  cd server && npm run dev"
            )
        );

    } catch (err) {

        console.error(
            chalk.red("Error:"),
            err.message
        );

        process.exit(1);
    }
}

export default createProject;