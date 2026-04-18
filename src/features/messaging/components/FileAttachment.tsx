import { Download, FileText } from "lucide-react";

interface FileAttachmentProps {
  /** URL of the uploaded file. */
  url: string;
}

/**
 * Renders a sent file attachment inside a message.
 */
export default function FileAttachment({ url }: FileAttachmentProps) {
  const fileName = url.split("/").pop() || "file";
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(url);

  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={url}
          alt={fileName}
          className="max-w-xs rounded-lg border border-gray-200 transition hover:opacity-90"
          loading="lazy"
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      download={fileName}
      className="flex max-w-xs items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
    >
      <FileText size={18} className="shrink-0 text-gray-400" />
      <span className="flex-1 truncate">{fileName}</span>
      <Download size={14} className="shrink-0 text-gray-400" />
    </a>
  );
}
