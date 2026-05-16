import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

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

  // New state for viewing existing images
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [view, setView] = useState<"upload" | "manage">("upload");

  useEffect(() => {
    const checkAuth = async () => {
      const urlKey = router.query.key as string;
      const sessionAuth = sessionStorage.getItem("upload_auth");

      if (sessionAuth === "true") {
        setAuthed(true);
        setLoading(false);
        return;
      }

      if (urlKey) {
        const res = await fetch("/api/verify-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: urlKey }),
        });

        if (res.ok) {
          sessionStorage.setItem("upload_auth", "true");
          setAuthed(true);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [router.query]);

  // Fetch existing images when switching to manage view
  useEffect(() => {
    if (view === "manage" && authed) {
      fetchExistingImages();
    }
  }, [view, authed]);

  const fetchExistingImages = async () => {
    const res = await fetch("/api/images");
    if (res.ok) {
      const data = await res.json();
      setExistingImages(data.images);
    }
  };

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

  const handleDelete = async (url: string) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;

    const res = await fetch("/api/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (res.ok) {
      fetchExistingImages();
      alert("Image deleted");
    } else {
      alert("Delete failed");
    }
  };

  const handleEdit = async () => {
    if (!editingImage) return;

    const res = await fetch("/api/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: editingImage.url,
        title: editingImage.title,
        description: editingImage.description,
      }),
    });

    if (res.ok) {
      setEditingImage(null);
      fetchExistingImages();
      alert("Image updated");
    } else {
      alert("Update failed");
    }
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
          {/* Toggle buttons */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setView("upload")}
              className={`rounded px-6 py-3 font-semibold transition ${
                view === "upload"
                  ? "bg-white text-stone-950"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              Upload New
            </button>
            <button
              onClick={() => setView("manage")}
              className={`rounded px-6 py-3 font-semibold transition ${
                view === "manage"
                  ? "bg-white text-stone-950"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              Manage Existing
            </button>
          </div>

          {/* Upload View */}
          {view === "upload" && (
            <>
              <h1 className="mb-8 text-4xl font-bold">Upload Photos</h1>

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
                  onChange={(e) =>
                    e.target.files && handleFiles(e.target.files)
                  }
                  className="hidden"
                />
              </label>

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
            </>
          )}

          {/* Manage View */}
          {view === "manage" && (
            <>
              <h1 className="mb-8 text-4xl font-bold">Manage Photos</h1>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {existingImages.map((image) => (
                  <div
                    key={image.url}
                    className="overflow-hidden rounded-lg bg-stone-900"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image.url}
                        alt={image.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-3 p-4">
                      <h3 className="truncate text-lg font-bold">
                        {image.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-stone-400">
                        {image.description}
                      </p>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setEditingImage(image)}
                          className="flex-1 rounded bg-stone-800 px-4 py-2 text-sm font-semibold transition hover:bg-stone-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(image.url)}
                          className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-stone-900 p-6">
            <h2 className="mb-4 text-2xl font-bold">Edit Photo</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Title
                </label>
                <input
                  type="text"
                  value={editingImage.title}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, title: e.target.value })
                  }
                  className="w-full rounded border border-stone-800 bg-stone-950 px-4 py-2 outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editingImage.description}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      description: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded border border-stone-800 bg-stone-950 px-4 py-2 outline-none focus:border-stone-600"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleEdit}
                  className="flex-1 rounded bg-white px-6 py-3 font-semibold text-stone-950 transition hover:bg-stone-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingImage(null)}
                  className="flex-1 rounded bg-stone-800 px-6 py-3 font-semibold transition hover:bg-stone-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
