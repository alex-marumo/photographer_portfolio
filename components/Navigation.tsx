import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const router = useRouter();

  const links = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-stone-200 bg-stone-100/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="Terry Wildlife Photography"
            className="h-10 w-auto"
          />
          <span className="font-serif text-lg italic text-stone-800">
            Terry Wildlife Photography
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm uppercase tracking-wider transition ${
                router.pathname === link.href
                  ? "font-semibold text-stone-900"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
