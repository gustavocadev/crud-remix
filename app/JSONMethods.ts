import fs from "fs/promises";
import path from "path";

export interface User {
  name: string;
  age: number;
  id: string;
}

export const writeJSON = async (name: string, content: User[]) => {
  await fs.writeFile(
    path.join(__dirname, "..", `users/${name}`),
    JSON.stringify(content)
  );
};

export const readJSON = async (name: string): Promise<User[]> => {
  let file = await fs.readFile(
    path.join(__dirname, "..", `users/${name}`),
    "utf-8"
  );

  return JSON.parse(file);
};
