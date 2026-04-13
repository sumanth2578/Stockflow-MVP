import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, defaultLowStockThreshold } = await req.json();
    
    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name,
        defaultLowStockThreshold: parseInt(defaultLowStockThreshold.toString()),
      },
    });

    return NextResponse.json(organization);
  } catch (error: any) {
    console.error("Update organization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
