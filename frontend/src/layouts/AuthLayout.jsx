import { Outlet } from "react-router-dom";
import { Globe } from "lucide-react";

const AuthLayout = () => (
  <div className="min-h-screen bg-travel-gradient flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Globe size={32} className="text-blue-400" />
        <span className="gradient-text font-bold text-3xl">Traveloop</span>
      </div>
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;