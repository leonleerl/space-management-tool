import { Button } from "antd";

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
        <div className="flex justify-center gap-6">
          <Button 
            type="primary" 
            size="large"
            className="px-8 py-2 h-12 text-lg font-medium"
          >
            Sign in
          </Button>
          <Button 
            size="large"
            className="px-8 py-2 h-12 text-lg font-medium"
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
