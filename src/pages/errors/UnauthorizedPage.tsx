import { Link } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import useTitle from "@/hooks/useChangePageTitle";

export default function UnauthorizedPage() {
  useTitle("Unauthorized");
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your administrator.
          </p>

          <Link
            to={`/`}
            replace
            className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
