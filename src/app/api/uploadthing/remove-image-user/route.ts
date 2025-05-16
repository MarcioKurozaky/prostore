export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const { fileKey } = await req.json();
    if (!fileKey) {
      return NextResponse.json(
        { success: false, message: "Missing fileKey" },
        { status: 400 }
      );
    }

    await utapi.deleteFiles(fileKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar imagem do usuário:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 }
    );
  }
}
