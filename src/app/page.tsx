import { LoginModal } from "@/components/auth/login";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8">
          Welcome to <span className="text-blue-500">excel-sync!</span>
        </h1>
        <p className="text-gray-600 text-xl mb-12 leading-relaxed">
          This web app lets you seamlessly synchronize your Excel files online. Please sign in or sign up to get started.
        </p>
        <LoginModal />
      </div>
    </div>
  );
}
