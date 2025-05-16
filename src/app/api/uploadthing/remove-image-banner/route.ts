export const runtime = "nodejs";

import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const { productId, bannerUrl } = await req.json();

    if (!productId || !bannerUrl) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza o banner no banco
    await prisma.product.update({
      where: { id: productId },
      data: { banner: null },
    });

    // Remove o arquivo do UploadThing
    const fileKey = bannerUrl.split("/").pop();
    await utapi.deleteFiles(fileKey as string);

    return NextResponse.json({
      success: true,
      message: "Banner removido com sucesso",
    });
  } catch (error) {
    console.error("[REMOVE_BANNER]", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao remover banner" },
      { status: 500 }
    );
  }
}
