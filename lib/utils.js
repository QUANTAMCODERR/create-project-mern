import fs from "fs-extra";

export function isValidName(name) {
  return /^[a-zA-Z0-9-_]+$/.test(name);
}

export async function copyTemplate(src, dest) {
  await fs.copy(src, dest);
}