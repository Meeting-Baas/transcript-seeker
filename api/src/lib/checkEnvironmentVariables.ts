export function checkEnvironmentVariables(): string[] {
  const requiredEnvVars = [
    "OPENAI_BASE_URL",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "NOTION_API_KEY",
    "DATABASE_ID",
    "BASS_API_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.warn(
      "⚠️ Warning: The following required environment variables are not set:",
    );
    missingVars.forEach((varName) => console.warn(`\t‼️ - ${varName}`));
    console.warn(
      "Please set these variables in your .env file or environment.",
      "\n\t- OPENAI_BASE_URL defaults to https://api.openai.com/v1",
      "\n\t- BASS_API_KEY can be set manually in the form.",
    );
  }

  return missingVars;
}
