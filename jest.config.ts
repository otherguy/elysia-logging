import type { Config } from "jest";

const config: Config = {
  verbose: true,
  roots: ["spec"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>[/\\\\](node_modules)[/\\\\]"],
  coverageReporters: ["text", "json", "lcov", "json-summary"],
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "reports", addFileAttribute: "true" }],
    ["jest-sonar", { outputDirectory: "reports" }],
  ],
  coverageDirectory: "reports",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,tsx}"],
};

module.exports = config;
