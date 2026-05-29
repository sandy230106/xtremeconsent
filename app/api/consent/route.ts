import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ConsentFormData = Record<string, unknown> & {
  id?: number;
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("consent_forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch consent forms" },
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

    const { data, error } = await supabase
      .from("consent_forms")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to create consent form" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      typeof (body as ConsentFormData).id !== "number"
    ) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { id, ...updateData } = body as ConsentFormData & { id: number };

    const { data, error } = await supabase
      .from("consent_forms")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "Consent form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update consent form" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));

    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { message: "Invalid consent form id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("consent_forms")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete consent form" },
      { status: 500 }
    );
  }
}
