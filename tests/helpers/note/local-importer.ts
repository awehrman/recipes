import fs from 'fs-extra';
import path from 'path';

export const copyFiles = async (sourceDir: string, fileName: string) => {
  await fs.ensureDir(sourceDir);

  const destDir = path.resolve('./public', `test-data/${fileName}`);
  await fs.copy(sourceDir, destDir);
};

export const resetTestData = async () => {
  const testData = path.resolve('./public', `test-data`);
  await fs.ensureDir(testData);
  await fs.emptyDir(testData);
};
