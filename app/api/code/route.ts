import { NextRequest, NextResponse } from "next/server";
import CodeRunner from  "@/utils/CodeRunner"
import { CodeRequestObject } from "@/types"

export async function POST(req: Request){
  try {
    const data = await req.json()
    const { code, lang } = CodeRequestObject.parse(data)
    const result = await CodeRunner(code, lang)
    return NextResponse.json({ message: "Code run successfully", result }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: "Oops! something went wrong..", error: err }, { status: 422 })
  }
}