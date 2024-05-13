import * as assert from "assert";
import * as fs from "fs";
import { beforeEach, describe, it } from "mocha";
import { createIndexFile } from "../createIndexFile";

const pathToTsFiles = __dirname.replace("/out/", "/src/");
const pathToMockFolder = `${pathToTsFiles}/mockTestFolder`;
const pathToIndexFile = `${pathToMockFolder}/index.ts`;
const pathToMockIndexFile = `${pathToTsFiles}/mockIndex.txt`;

describe("The extension", () => {
  // Delete the index file before each test
  beforeEach(() => {
    if (fs.existsSync(pathToIndexFile)) {
      fs.unlinkSync(pathToIndexFile);
    }
  });

  it("should create an index file containing the expected exports", async () => {
    // Create the index file from the mock folder
    await createIndexFile(pathToMockFolder);

    // Check if the index file was created
    assert.equal(fs.existsSync(pathToIndexFile), true);

    // Check that the content of the generated index file is as expected
    const indexFileContent = fs.readFileSync(pathToIndexFile).toString();
    const expectedIndexFileContent = fs
      .readFileSync(pathToMockIndexFile)
      .toString();
    assert.equal(indexFileContent, expectedIndexFileContent);
  });
});
