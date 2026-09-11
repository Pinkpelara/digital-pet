import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="bg-paper px-4 py-16">
      <AuthPanel />
    </div>
  );
}
