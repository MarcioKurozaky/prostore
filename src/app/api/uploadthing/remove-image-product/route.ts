export const runtime = "nodejs";

import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const { productId, imageUrl } = await req.json();

    if (!productId || !imageUrl) {
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

    const updatedImages = product.images.filter((img) => img !== imageUrl);

    await prisma.product.update({
      where: { id: productId },
      data: { images: updatedImages },
    });

    const fileKey = imageUrl.split("/").pop();
    await utapi.deleteFiles(fileKey as string);

    return NextResponse.json({
      success: true,
      message: "Imagem removida com sucesso",
    });
  } catch (error) {
    console.error("[REMOVE_IMAGE]", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao remover imagem" },
      { status: 500 }
    );
  }
}
