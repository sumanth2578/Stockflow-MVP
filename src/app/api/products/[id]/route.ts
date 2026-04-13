import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  const { id } = await params;

  if (!session || !organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const product = await prisma.product.update({
      where: { 
        id,
        organizationId // Ensure product belongs to user's org
      },
      data: {
        ...data,
        lastUpdatedBy: session.user?.email || "System",
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  const { id } = await params;

  if (!session || !organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.product.delete({
      where: { 
        id,
        organizationId 
      },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
