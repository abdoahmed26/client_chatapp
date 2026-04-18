import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUpdateProfile } from "@/features/profile/api/useUpdateProfile";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { useAppSelector } from "@/store/hooks";

/**
 * Standalone page for viewing and updating the current user's profile.
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const updateMutation = useUpdateProfile();

  const handleSave = (name: string, imageFile?: File) => {
    updateMutation.mutate({
      name,
      profileImage: imageFile,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <ProfileForm
            user={user}
            onSave={handleSave}
            isSaving={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
