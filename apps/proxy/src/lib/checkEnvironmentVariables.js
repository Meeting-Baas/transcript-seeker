"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnvironmentVariables = checkEnvironmentVariables;
function checkEnvironmentVariables() {
    var requiredEnvVars = [
        "OPENAI_BASE_URL",
        "OPENAI_API_KEY",
        "OPENAI_MODEL",
        "NOTION_API_KEY",
        "DATABASE_ID",
        "BASS_API_KEY",
    ];
    var missingVars = requiredEnvVars.filter(function (varName) { return !process.env[varName]; });
    if (missingVars.length > 0) {
        console.warn("⚠️ Warning: The following required environment variables are not set:");
        missingVars.forEach(function (varName) { return console.warn("\t\u203C\uFE0F - ".concat(varName)); });
        console.warn("Please set these variables in your .env file or environment.", "\n\t- OPENAI_BASE_URL defaults to https://api.openai.com/v1", "\n\t- BASS_API_KEY can be set manually in the form.");
    }
    return missingVars;
}
