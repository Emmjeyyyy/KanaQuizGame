"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-4 border-t border-neutral-surface bg-background-secondary/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <p className="text-text-muted text-sm">
          Created by{" "}
          <Link
            href="https://github.com/Emmjeyyyy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-info hover:text-highlight-cta transition-colors font-medium hover:underline"
          >
            EmmJeyyyy
          </Link>
        </p>
      </div>
    </footer>
  );
}
