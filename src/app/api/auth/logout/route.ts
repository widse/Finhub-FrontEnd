import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  cookies().delete("access-token");
  cookies().delete("refresh-token");

  return NextResponse.json({ status: "SUCCESS" });
}
