import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terry Wildlife Photography</title>
        <meta property="og:image" content="/og-image.jpg" />
      </Head>

      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-stone-200 to-stone-100 pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-16">
            <div className="flex-shrink-0">
              <img
                src="/favicon.svg"
                alt="Terry Wildlife Photography"
                className="w-96"
              />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="mb-6 font-serif text-6xl italic text-stone-800 md:text-8xl">
                Terry Wildlife Photography
              </h1>
              <p className="mb-12 font-serif text-2xl italic text-stone-600">
                "its all about nature"
              </p>
              <Link
                href="/gallery"
                className="inline-block rounded bg-stone-900 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-stone-100 transition hover:bg-stone-800"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-stone-200 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-5xl font-bold uppercase text-stone-900">
                About
              </h2>
              <p className="font-serif text-xl italic leading-relaxed text-stone-700">
                Young wildlife photographer capturing the raw beauty and truth
                of the wild of Botswana
              </p>
              <p className="mt-6 leading-relaxed text-stone-600">
                Through the lens, I document the untamed spirit of Africa's
                wildlife—from the golden savannas to the intimate moments
                between predator and prey. Every photograph tells a story of
                survival, majesty, and the delicate balance of nature.
              </p>
            </div>

            <div className="relative h-96 overflow-hidden rounded-lg bg-stone-300">
              {/* Placeholder for about image - replace with actual photographer portrait */}
              <div className="absolute inset-0 flex items-center justify-center text-stone-500">
                <span className="text-sm uppercase tracking-wider">
                  Photographer Portrait
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Teaser */}
      <section className="bg-stone-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold uppercase text-stone-900">
            Featured Work
          </h2>
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-lg bg-stone-300 transition duration-300 hover:scale-105"
              >
                <div className="flex h-full items-center justify-center text-stone-500">
                  <span className="text-sm uppercase tracking-wider">
                    Featured {i}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-block rounded border-2 border-stone-900 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-stone-900 transition hover:bg-stone-900 hover:text-stone-100"
            >
              See All Work
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="bg-stone-950 py-16 text-stone-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-12 font-serif text-3xl italic">
            "its all about nature"
          </p>

          <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
            <a
              href="https://wa.me/26775522637?text=Hi%20Terry%2C%20I%27m%20interested%20to%20in%20your%20work"
              className="flex items-center gap-3 text-lg transition hover:text-stone-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+267 75 522 637</span>
            </a>

            <a
              href="https://instagram.com/itsterrry7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg transition hover:text-stone-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>@itsterrry7</span>
            </a>
            <a
              href="https://facebook.com/profile.php?id=100069310843970"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg transition hover:text-stone-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Terry Machana</span>
            </a>
          </div>

          <div className="mt-12 border-t border-stone-800 pt-8 text-sm text-stone-500">
            <p>
              &copy; {new Date().getFullYear()} Terry Wildlife Photography.
              [_site by alex.marumo_].
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
