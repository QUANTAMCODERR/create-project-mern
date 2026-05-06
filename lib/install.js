import { exec } from "child_process";

function run(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

export async function installDependencies(projectPath) {
  await run("npm install", `${projectPath}/client`);
  await run("npm install", `${projectPath}/server`);
}