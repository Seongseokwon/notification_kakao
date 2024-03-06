import NotionClient from "@/lib/notion";
import { NextResponse } from "next/server";

const AUTH_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function GET() {
  try {
    const response = await NotionClient.databases.query({
      database_id: DATABASE_ID!,
    })
    const data = await response.results
    return NextResponse.json(data);
  } catch(err) {
    console.error(err);
    return new NextResponse('', {
      status: 500,
      statusText: 'Error'
    })
  }
}