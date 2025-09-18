"use client"
import { LoginModal } from "@/components/auth/login";
import { useSession } from "next-auth/react";
import { message } from "antd";
import { useEffect, useRef } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const isLogin = session ? true : false
  const hasShownAuthMessageRef = useRef(false);

  useEffect(() => {
    if (!hasShownAuthMessageRef.current && !session && status === "unauthenticated") {
      hasShownAuthMessageRef.current = true;
      message.error("Please login first");
    }
  }, [session, status]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8">
          Welcome to <span className="text-blue-500">excel-sync!</span>
        </h1>
        <p className="text-gray-600 text-xl mb-12 leading-relaxed">
          This web app lets you seamlessly synchronize your Excel files online. Please sign in or sign up to get started.
        </p>
        {isLogin ? <div className="mb-6 text-green-500 font-medium">Login successful</div> : <LoginModal />}  
      </div>
    </div>
  );
}
