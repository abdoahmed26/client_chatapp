import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, Loader2, Save } from "lucide-react";
import type { IConversation } from "@/types/conversation.types";
import { useUpdateConversation } from "../api/useUpdateConversation";

interface EditConversationFormProps {
  conversationId: string;
  conversation: IConversation;
  onDone: () => void;
}

/**
 * Inline form for editing group or channel conversation details.
 */
export default function EditConversationForm({
  conversationId,
  conversation,
  onDone,
}: EditConversationFormProps) {
  const [title, setTitle] = useState(conversation.title || "");
  const [description, setDescription] = useState(conversation.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(conversation.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateMutation = useUpdateConversation();

  useEffect(() => {
    setTitle(conversation.title || "");
    setDescription(conversation.description || "");
    setImagePreview(conversation.image);
    setImageFile(null);
  }, [conversation]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    updateMutation.mutate(
      {
        conversationId,
        payload: {
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          image: imageFile || undefined,
        },
      },
      {
        onSuccess: () => {
          onDone();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Edit Conversation
      </h4>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 transition hover:border-blue-400"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={16} className="text-gray-400" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <span className="text-xs text-gray-400">Change image</span>
      </div>

      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Conversation title"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Save size={12} />
          )}
          Save
        </button>
      </div>
    </form>
  );
}
