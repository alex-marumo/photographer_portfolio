import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function UploadPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>(
    []
  );
  const [metadata, setMetadata] = useState<
    Record<string, { title: string; description: string }>
  >({});

  useEffect(() => {
    // Check URL key or session
    const urlKey = router.query.key as string;
    const sessionAuth = sessionStorage.getItem("upload_auth");

    const SECRET_KEY = "midnight-shadow-protocol"; // Change this to your secret

    if (urlKey === SECRET_KEY || sessionAuth === "true") {
      sessionStorage.setItem("upload_auth", "true");
      setAuthed(true);
    }

    setLoading(false);
  }, [router.query]);

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleUpload = async () => {
    if (images.length === 0) return;

    setUploading(true);

    for (const { file, preview } of images) {
      const formData = new FormData();
      formData.append("file", file);

      const meta = metadata[preview] || { title: "", description: "" };
      formData.append("title", meta.title);
      formData.append("description", meta.description);

      try {
        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setImages([]);
    setMetadata({});
    setUploading(false);
    alert("Uploaded successfully. Refresh the gallery to see new images.");
  };

  const removeImage = (preview: string) => {
    setImages((prev) => prev.filter((img) => img.preview !== preview));
    setMetadata((prev) => {
      const { [preview]: removed, ...rest } = prev;
      return rest;
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-stone-950" />;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-white">
        <div className="space-y-4 text-center">
          <svg
            className="mx-auto h-16 w-16 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-stone-500">Access denied</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Upload — Terry Wildlife Photography</title>
      </Head>

      <div className="min-h-screen bg-stone-950 p-8 pt-24 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-4xl font-bold">Upload Photos</h1>

          {/* Drop zone */}
          <label className="mb-8 block">
            <div className="cursor-pointer rounded-lg border-2 border-dashed border-stone-700 p-16 text-center transition hover:border-stone-500">
              <svg
                className="mx-auto mb-4 h-12 w-12 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg">Drop images or click to browse</p>
              <p className="mt-2 text-sm text-stone-500">
                Supports JPG, PNG, WebP
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </label>

          {/* Preview grid with metadata inputs */}
          {images.length > 0 && (
            <div className="space-y-8">
              {images.map(({ file, preview }, i) => (
                <div
                  key={i}
                  className="grid gap-6 rounded-lg bg-stone-900 p-6 md:grid-cols-2"
                >
                  <div className="relative">
                    <img
                      src={preview}
                      alt=""
                      className="h-64 w-full rounded object-cover"
                    />
                    <button
                      onClick={() => removeImage(preview)}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-2 transition hover:bg-red-700"
                    >
                      <svg
                        className="h-4 w-4"
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
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Lioness at Dawn"
                        value={metadata[preview]?.title || ""}
                        onChange={(e) =>
                          setMetadata((prev) => ({
                            ...prev,
                            [preview]: {
                              ...prev[preview],
                              title: e.target.value,
                              description: prev[preview]?.description || "",
                            },
                          }))
                        }
                        className="w-full rounded border border-stone-800 bg-stone-950 px-4 py-2 outline-none focus:border-stone-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Description
                      </label>
                      <textarea
                        placeholder="Tell the story behind this photograph..."
                        rows={4}
                        value={metadata[preview]?.description || ""}
                        onChange={(e) =>
                          setMetadata((prev) => ({
                            ...prev,
                            [preview]: {
                              ...prev[preview],
                              description: e.target.value,
                              title: prev[preview]?.title || "",
                            },
                          }))
                        }
                        className="w-full resize-none rounded border border-stone-800 bg-stone-950 px-4 py-2 outline-none focus:border-stone-600"
                      />
                    </div>

                    <p className="text-sm text-stone-500">{file.name}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full rounded-lg bg-white px-6 py-4 font-semibold text-stone-950 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : `Upload ${images.length} photo${
                      images.length > 1 ? "s" : ""
                    }`}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
