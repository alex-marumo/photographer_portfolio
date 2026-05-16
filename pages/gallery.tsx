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

          <div className="space-y-12">
            {images.map((image) => (
              <div
                key={image.id}
                className="group grid cursor-pointer items-start gap-8 md:grid-cols-2"
                onClick={() => setSelectedImage(image)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200">
                  <Image
                    src={image.url}
                    alt={image.title || "Wildlife photograph"}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Title & Description */}
                <div className="py-4">
                  <h2 className="mb-4 text-3xl font-bold text-stone-900">
                    {image.title || "Untitled"}
                  </h2>
                  <p className="font-serif italic leading-relaxed text-stone-600">
                    {image.description ||
                      "A moment captured in the wild of Botswana."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
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
  };
}
