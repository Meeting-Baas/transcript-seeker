import { Client, isFullDatabase, iteratePaginatedAPI } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export async function createNotionPage(
  children: any, // no proper type available
  speakers: string[],
  now: Date,
) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const DATABASE_ID = process.env.DATABASE_ID || "";
  if (!DATABASE_ID)
    throw new Error(
      "Missing Notion DATABASE_ID: Please verify that the DATABASE_ID is correctly set in your .env file.",
    );

  try {
    // THIS IMPLIES YOUR NOTION Database contains the following Notion Database Schema:
    // - Name: title
    // - Description: rich_text
    // - MeetingDate: date (ISO)
    // - Attendees: multi_select

    // Create a new page in a Notion database
    const response = await notion.pages.create({
      // Set cover image (external URL)
      cover: {
        type: "external" as const,
        external: {
          url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg",
        },
      },

      // Set page icon (emoji)
      icon: {
        type: "emoji" as const,
        emoji: "🗣️",
      },

      // Specify parent database
      parent: {
        type: "database_id" as const,
        database_id: DATABASE_ID, // string
      },

      // Define page properties matching database schema
      properties: {
        // Title property (required)
        Name: {
          title: [
            {
              text: {
                content: `Meeting Summary - ${now.toISOString()}`, // string
              },
            },
          ],
        },

        // Rich text property
        Description: {
          rich_text: [
            {
              text: {
                content: "A meeting name", // string
              },
            },
          ],
        },

        // Date property
        MeetingDate: {
          date: {
            start: new Date().toISOString(), // string (ISO 8601 date)
          },
        },

        // Multi-select property
        Attendees: {
          multi_select: speakers.map((speaker) => ({ name: speaker })), // Array<{ name: string }>
        },
      },

      // Add child blocks to the page
      children: children, // Array of block objects
    });
    return { data: response };
  } catch (error: any) {
    console.error("Error creating Notion page:", error);
    return { error: error?.body || "Unknown error" };
  }
}

export async function listDatabases(
  notionClient: Client,
): Promise<DatabaseObjectResponse[]> {
  const databases: DatabaseObjectResponse[] = [];
  console.log("\n\nlisting available Databases on NOTION:");

  try {
    for await (const page of iteratePaginatedAPI(notionClient.search, {
      filter: {
        property: "object",
        value: "database",
      },
    })) {
      if (isFullDatabase(page)) {
        databases.push(page);
        console.log(
          `- 📚 ${page.title[0]?.plain_text || "Untitled"}: ${page.id}`,
        );
      } else {
        console.log("not a full database.");
      }
    }

    console.log(`Total databases found: ${databases.length}`, "\n\n");

    return databases;
  } catch (error) {
    console.error("Error listing databases:", error, "'\n\n");
    return [];
  }
}
