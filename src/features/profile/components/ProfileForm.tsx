import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Loader2, Save } from "lucide-react";
import type { IUser } from "@/types/auth.types";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface ProfileFormProps {
  user: IUser;
  onSave: (name: string, imageFile?: File) => void;
  isSaving: boolean;
}

/**
 * Always-editable profile form with name, read-only email, provider, and image upload.
 */
export default function ProfileForm({
  user,
  onSave,
  isSaving,
}: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profileImage
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarFallback = name.trim().charAt(0).toUpperCase() || "?";
  const isNameValid = name.trim().length > 0;
  const hasChanges = name.trim() !== user.name || imageFile !== null;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please select an image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!isNameValid) {
      return;
    }

    onSave(name.trim(), imageFile || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="group relative">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-500">
                {avatarFallback}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100"
            aria-label="Change profile image"
          >
            <Camera size={24} className="text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <p className="text-xs text-gray-400">Click to change photo</p>
      </div>

      <div>
        <label
          htmlFor="profile-name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-1 ${
            isNameValid
              ? "border-gray-200 bg-gray-50 focus:border-blue-300 focus:ring-blue-300"
              : "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-400"
          }`}
        />
        {!isNameValid ? (
          <p className="mt-1 text-xs text-red-500">Name is required</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            user.provider === "google"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.provider === "google" ? "Google Account" : "Local Account"}
        </span>
      </div>

      <button
        type="submit"
        disabled={!isNameValid || !hasChanges || isSaving}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save size={16} /> Save Changes
          </>
        )}
      </button>
    </form>
  );
}
