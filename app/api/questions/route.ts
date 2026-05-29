import { NextResponse } from "next/server";
import { ddbDocClient } from "../../../lib/dynamodb";
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tableName = process.env.DYNAMODB_TABLE_CONSENT_QUESTIONS || "consent_questions";
    const data = await ddbDocClient.send(new ScanCommand({ TableName: tableName }));
    
    // Sort items by created_at ascending in-memory
    const items = data.Items || [];
    items.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateA - dateB;
    });

    return NextResponse.json(items);
  } catch (err: any) {
    console.error("Failed to fetch consent questions from DynamoDB:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch consent questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || !body.question_en || !body.service_type) {
      return NextResponse.json(
        { message: "Invalid request body or missing required fields" },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_CONSENT_QUESTIONS || "consent_questions";
    
    const id = body.id || crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const newItem = {
      id: String(id),
      service_type: body.service_type,
      question_en: body.question_en,
      question_ta: body.question_ta || "",
      created_at: createdAt,
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: tableName,
        Item: newItem,
      })
    );

    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    console.error("Failed to create consent question in DynamoDB:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create consent question" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Invalid consent question ID" },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_CONSENT_QUESTIONS || "consent_questions";

    await ddbDocClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id: String(id) },
      })
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Failed to delete consent question in DynamoDB:", err);
    return NextResponse.json(
      { message: err.message || "Failed to delete consent question" },
      { status: 500 }
    );
  }
}
