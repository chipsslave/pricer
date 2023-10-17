import * as fs from "fs";
import * as path from "path";

export function saveToFile(content: string, filename: string): void {
  const dirPath = path.join(__dirname, "../htmls");

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(path.join(dirPath, filename), content);
}
