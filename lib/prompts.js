import inquirer from "inquirer";

export async function askProjectName() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Project name:",
      validate: (input) =>
        input ? true : "Project name cannot be empty"
    }
  ]);
  return name;
}

export async function askFeatures() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Select a language:",
      choices: ["JavaScript", "TypeScript"],
      default: "JavaScript"
    }
  ]);
  return { 
    ...answers, 
    typescript: answers.language === "TypeScript",
    tailwind: true, 
    auth: true 
  };
}