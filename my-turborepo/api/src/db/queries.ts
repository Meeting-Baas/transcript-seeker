import { db } from ".";
import {
  asc,
  between,
  count,
  desc,
  eq,
  getTableColumns,
  sql,
} from "drizzle-orm";
import { InsertMeeting, SelectMeeting, meetingsTable } from "./schema";

export async function createMeeting(data: InsertMeeting) {
  await db.insert(meetingsTable).values(data);
}

export async function deleteMeeting(id: SelectMeeting["id"]) {
  await db.delete(meetingsTable).where(eq(meetingsTable.id, id));
}

// export async function getMeetings(
//     page = 1,
//     pageSize = 5,
//   ): Promise<
//     Array<{
//       id: number;
//       bot_id: string;
//       attendees: string[];
//     }>
//   > {
//     return db
//       .select({
//         id: meetingsTable.id,
//         name: meetingsTable.name,
//         bot_id: meetingsTable.bot_id,
//         attendees: meetingsTable.attendees,
//         createdAt: meetingsTable.createdAt,
//       })
//       .from(meetingsTable)
//       .orderBy(desc(meetingsTable.createdAt))
//       .limit(pageSize)
//       .offset((page - 1) * pageSize);
//   }

export async function getMeetings(): Promise<
  Array<{
    id: number;
    bot_id: string;
    attendees: string[];
    createdAt: Date;
  }>
> {
  return db
    .select({
      id: meetingsTable.id,
      name: meetingsTable.name,
      bot_id: meetingsTable.bot_id,
      attendees: meetingsTable.attendees,
      createdAt: meetingsTable.createdAt,
    })
    .from(meetingsTable)
    .orderBy(desc(meetingsTable.createdAt));
}
