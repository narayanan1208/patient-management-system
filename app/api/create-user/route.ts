import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { users } from "@/lib/appwrite.config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    const newUser = await users.create(
      ID.unique(),
      email,
      phone,
      undefined,
      name
    );

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Create user error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
