import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import type { ImageProps } from "../utils/types";
import getResults from "../utils/cachedImages";

const Gallery: NextPage = ({ images }: { images: ImageProps[] }) => {
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);

  return (
    <>
      <Head>
        <title>Gallery — Terry Wildlife Photography</title>
      </Head>

      <main className="min-h-screen bg-stone-100 pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-12 text-5xl font-bold uppercase text-stone-900">
            Gallery
          </h1>

          {/* Masonry Grid */}
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {images.map((image) => (
              <div
                key={image.id}
                id={`image-${image.id}`} // Add ID for anchor links
                className="group mb-6 cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-lg bg-stone-200">
                  <Image
                    src={image.url}
                    alt={image.title || "Wildlife photograph"}
                    width={600}
                    height={400}
                    className="w-full transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Title overlay on hover */}
                <div className="mt-3 px-2">
                  <h3 className="text-lg font-bold text-stone-900">
                    {image.title || "Untitled"}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-serif text-sm italic text-stone-600">
                    {image.description ||
                      "A moment captured in the wild of Botswana."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal - keep the same */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 text-white transition hover:text-stone-300"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            className="w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-6 aspect-[4/3]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title || "Wildlife photograph"}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <div className="text-white">
              <h2 className="mb-3 text-3xl font-bold">
                {selectedImage.title || "Untitled"}
              </h2>
              <p className="font-serif italic text-stone-300">
                {selectedImage.description ||
                  "A moment captured in the wild of Botswana."}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;

export async function getStaticProps() {
  return {
    props: {
      images: await getResults(),
    },
    revalidate: 10,
  };
}
