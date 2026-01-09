"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/shared/ui/Button";

export default function PublicNavigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Akademik Platforma
            </span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              href="/website"
              className={`px-3 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/" || pathname === "/website"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="hidden sm:inline">Asosiy</span>
              <span className="sm:hidden">🏠</span>
            </Link>
            <Link
              href="/about"
              className={`px-3 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/about"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="hidden sm:inline">Website Haqida</span>
              <span className="sm:hidden">ℹ️</span>
            </Link>
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center md:text-sm"
              >
                <LogIn className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
