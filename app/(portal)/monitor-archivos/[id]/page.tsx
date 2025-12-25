
import { MonitorDetail } from './components/monitor-detail'

interface DetallePageProps {
  params: Promise<{ id: string }>
}

export default async function DetallePage({ params }: DetallePageProps) {
  const { id } = await params

  return <MonitorDetail documentId={id} />
}
