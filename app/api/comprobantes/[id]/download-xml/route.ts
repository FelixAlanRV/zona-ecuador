import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Aquí iría la lógica real para obtener y descargar el XML
    // Por ahora solo retornamos un mensaje de éxito
    
    return NextResponse.json({
      success: true,
      message: "Descarga de XML exitosa",
      documentId: id
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al descargar XML" },
      { status: 500 }
    )
  }
}
