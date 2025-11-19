"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          Created by{" "}
          <Link
            href="https://github.com/Emmjeyyyy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
          >
            EmmJeyyyy
          </Link>
        </p>
      </div>
    </footer>
  );
}

