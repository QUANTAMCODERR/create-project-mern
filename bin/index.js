#!/usr/bin/env node

import createProject from "../lib/createProject.js";

const projectName = process.argv[2];

createProject(projectName);