import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-5 flex justify-around items-center">
        <Link href="/" className="hover:text-blue-400">
          Home
        </Link>
        <Link href="/study" className="hover:text-blue-400">
          Study
        </Link>
    </nav>
  );
}
