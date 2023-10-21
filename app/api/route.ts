import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request){
  
  return NextResponse.json({ message: "Success..."}, { status: 200 })
}