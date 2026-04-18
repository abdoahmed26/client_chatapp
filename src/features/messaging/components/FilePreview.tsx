import { X, FileText } from "lucide-react";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

/**
 * Shows selected files before they are sent.
 */
export default function FilePreview({ files, onRemove }: FilePreviewProps) {
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file, index) => {
        const isImage = file.type.startsWith("image/");

        return (
          <div
            key={`${file.name}-${index}`}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
          >
            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-20 w-20 object-cover"
              />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <FileText size={16} className="text-gray-400" />
                <div className="min-w-0">
                  <p className="max-w-[120px] truncate text-xs font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{formatSize(file.size)}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => onRemove(index)}
              className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
              aria-label={`Remove ${file.name}`}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
