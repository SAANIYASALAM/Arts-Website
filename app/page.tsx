import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Layatharang & Chakravyuh 2026
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Model Engineering College
        </p>
        <p className="text-lg text-gray-600 mb-12">
          College Arts and Sports Festival Management System
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button size="lg" className="w-48">
              Login
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button size="lg" variant="outline" className="w-48">
              View Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
