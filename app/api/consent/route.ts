import { NextResponse } from "next/server";
import { ddbDocClient } from "../../../lib/dynamodb";
import { ScanCommand, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tableName = process.env.DYNAMODB_TABLE_CONSENT_FORMS || "consent_forms";
    const data = await ddbDocClient.send(new ScanCommand({ TableName: tableName }));
    
    // Sort items by created_at descending in-memory
    const items = data.Items || [];
    items.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(items);
  } catch (err: any) {
    console.error("Failed to fetch consent forms from DynamoDB:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch consent forms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_CONSENT_FORMS || "consent_forms";
    
    // Generate a unique ID if it's missing
    const id = body.id || crypto.randomUUID();
    const createdAt = body.created_at || new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const newItem = {
      ...body,
      id: String(id), // ensure string representation in DynamoDB
      created_at: createdAt,
      updated_at: updatedAt,
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: tableName,
        Item: newItem,
      })
    );

    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    console.error("Failed to create consent form in DynamoDB:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create consent form" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || !body.id) {
      return NextResponse.json(
        { message: "Invalid request body or missing ID" },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_CONSENT_FORMS || "consent_forms";
    const id = String(body.id);

    // Fetch the current item to merge existing values securely
    const current = await ddbDocClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    if (!current.Item) {
      return NextResponse.json(
        { message: "Consent form not found" },
        { status: 404 }
      );
    }

    const updatedItem = {
      ...current.Item,
      ...body,
      id, // preserve ID
      updated_at: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: tableName,
        Item: updatedItem,
      })
    );

    return NextResponse.json(updatedItem);
  } catch (err: any) {
    console.error("Failed to update consent form in DynamoDB:", err);
    return NextResponse.json(
      { message: err.message || "Failed to update consent form" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Invalid consent form ID" },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_CONSENT_FORMS || "consent_forms";

    await ddbDocClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id: String(id) },
      })
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Failed to delete consent form in DynamoDB:", err);
    return NextResponse.json(
      { message: err.message || "Failed to delete consent form" },
      { status: 500 }
    );
  }
}
