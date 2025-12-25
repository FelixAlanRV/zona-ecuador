import { FileText, FileCode, FileArchive, Download, Eye, FileBadge, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DocumentFile } from '../../data/mock-comprobantes'

interface FileCardProps {
  file: DocumentFile
}

const fileIcons = {
  pdf: FileText,
  xml: FileCode,
  zip: FileArchive,
  txt: FileBadge,
  spf: FileCode,
  default: File,
}

const fileColors = {
  pdf: 'text-red-600 bg-red-50',
  xml: 'text-blue-600 bg-blue-50',
  zip: 'text-purple-600 bg-purple-50',
  txt: 'text-gray-600 bg-gray-50',
  spf: 'text-orange-600 bg-orange-50',
  default: 'text-gray-600 bg-gray-50',
}

export function FileCard({ file }: FileCardProps) {
  const Icon = fileIcons[file.tipo] ?? fileIcons.default

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-start gap-3 md:flex-row">
        <div className={`p-3 rounded-lg ${fileColors[file.tipo]??fileColors.default}`}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 ">
            {file.nombre}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {file.tamano}
          </p>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Ver documento"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Descargar"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
