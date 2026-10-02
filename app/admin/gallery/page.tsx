"use client";

import React, { useState, useEffect } from "react";
import {
  Images,
  UploadCloud,
  Trash2,
  Plus,
  Filter,
  Eye,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  mediaType: string;
  url: string;
  altText?: string;
  isFeatured: boolean;
}

const CATEGORIES = ["All", "Bridal", "Makeup", "Permanent", "Hair", "Academy"];

export default function GalleryManagerPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Bridal");
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const loadGallery = async () => {
    try {
      const url =
        selectedCat === "All"
          ? "/api/admin/gallery"
          : `/api/admin/gallery?category=${selectedCat}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      }
    } catch {
      toast.error("Failed to load gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [selectedCat]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload to Cloudinary/server
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("title", title || file.name);
      formData.append("altText", altText || title);

      const upRes = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error || "Upload failed");

      // 2. Add to GalleryItem table
      const galRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || file.name,
          category,
          mediaType: file.type.startsWith("video/") ? "video" : "image",
          url: upData.url,
          altText: altText || title,
        }),
      });

      if (!galRes.ok) throw new Error("Failed to save to gallery");

      toast.success("Media added to gallery!");
      setUploadModalOpen(false);
      setTitle("");
      setAltText("");
      loadGallery();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this item from the public gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Item removed from gallery");
      loadGallery();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
            Gallery &amp; Media Manager
          </h1>
          <p className="text-xs text-[#7A6470] mt-1">
            Bulk upload transformations, bridal portfolios, and academy student achievements.
          </p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] text-xs font-semibold hover:opacity-95 shadow-md shadow-[#4A1330]/20 transition"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
              selectedCat === cat
                ? "bg-[#4A1330] text-[#FFF9F5] shadow-sm"
                : "bg-white border border-[#F8E8EC] text-[#7A6470] hover:text-[#2B1B24]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Gallery Items */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#7A6470]">Loading gallery items...</div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#7A6470] bg-white rounded-2xl border border-[#F8E8EC] p-8">
          No items found in category &quot;{selectedCat}&quot;. Click &quot;Upload Media&quot; above to add your first photo or video!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-[#F8E8EC] bg-white shadow-xs flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden bg-black/5">
                {item.mediaType === "video" ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#4A1330]/85 text-[#FFF9F5] text-[10px] font-semibold tracking-wider uppercase">
                  {item.category}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#2B1B24] truncate">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#7A6470] truncate">
                    {item.altText || "No description"}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition shrink-0"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8E8EC] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8E8EC] mb-4">
              <h3 className="font-bold text-sm text-[#4A1330]">Upload Gallery Photo / Video</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-[#7A6470] hover:text-[#2B1B24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Title / Look Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Rajputi Bridal Look"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                >
                  <option value="Bridal">Bridal</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Permanent">Permanent (PMU)</option>
                  <option value="Hair">Hair</option>
                  <option value="Academy">Academy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Alt Text (for SEO &amp; Accessibility)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Traditional Indian bridal jewelry & HD makeup"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              {/* File input */}
              <div className="pt-2">
                <input
                  type="file"
                  id="galleryFile"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="galleryFile"
                  className="w-full py-4 border-2 border-dashed border-[#B76E79]/40 bg-[#FFF9F5] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F8E8EC]/40 transition"
                >
                  <UploadCloud className="w-8 h-8 text-[#B76E79] mb-1.5" />
                  <span className="text-xs font-semibold text-[#4A1330]">
                    {isUploading ? "Uploading to Cloud..." : "Select Image or Video"}
                  </span>
                  <span className="text-[10px] text-[#7A6470] mt-1">
                    Auto-formatted with Cloudinary CDN
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
