
import { DocumentDetail } from './components/document-detail'

interface DetallePageProps {
  params: Promise<{ id: string }>
}

export default async function DetallePage({ params }: DetallePageProps) {
  const { id } = await params

  return <DocumentDetail documentId={id} />
}
