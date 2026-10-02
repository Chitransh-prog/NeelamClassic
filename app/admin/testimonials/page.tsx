"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  stars: number;
  isVerified: boolean;
  avatar?: string;
  isHidden: boolean;
}

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Testimonial | null>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [isVerified, setIsVerified] = useState(true);

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (res.ok) setReviews(data.testimonials || []);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const openAdd = () => {
    setEditingReview(null);
    setName("");
    setText("");
    setStars(5);
    setIsVerified(true);
    setModalOpen(true);
  };

  const openEdit = (rev: Testimonial) => {
    setEditingReview(rev);
    setName(rev.name);
    setText(rev.text);
    setStars(rev.stars);
    setIsVerified(rev.isVerified);
    setModalOpen(true);
  };

  const toggleHide = async (rev: Testimonial) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rev.id, isHidden: !rev.isHidden }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(rev.isHidden ? "Review unhidden" : "Review hidden from website");
      loadReviews();
    } catch {
      toast.error("Error updating review");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    try {
      if (editingReview) {
        const res = await fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingReview.id,
            name,
            text,
            stars,
            isVerified,
          }),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast.success("Review updated");
      } else {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            text,
            stars,
            isVerified,
          }),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast.success("Review added");
      }
      setModalOpen(false);
      loadReviews();
    } catch {
      toast.error("Failed to save review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Review deleted");
      loadReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
            Client Testimonials &amp; Reviews
          </h1>
          <p className="text-xs text-[#7A6470] mt-1">
            Manage genuine client reviews, star ratings, and bridal feedback shown on the public site.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] text-xs font-semibold hover:opacity-95 shadow-md shadow-[#4A1330]/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#7A6470]">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#7A6470] bg-white rounded-2xl border border-[#F8E8EC] p-8">
          No reviews available. Add one using the button above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                rev.isHidden
                  ? "bg-gray-50 border-gray-200 opacity-60"
                  : "bg-white border-[#F8E8EC] shadow-xs hover:border-[#B76E79]/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.stars
                            ? "text-[#C9A66B] fill-[#C9A66B]"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Client</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#2B1B24] leading-relaxed mb-4 italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#F8E8EC] flex items-center justify-between">
                <span className="font-semibold text-xs text-[#4A1330]">{rev.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleHide(rev)}
                    className="p-1.5 rounded-lg text-[#7A6470] hover:bg-[#F8E8EC] transition"
                    title={rev.isHidden ? "Unhide" : "Hide"}
                  >
                    {rev.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(rev)}
                    className="p-1.5 rounded-lg text-[#7A6470] hover:text-[#4A1330] hover:bg-[#F8E8EC] transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8E8EC] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8E8EC] mb-4">
              <h3 className="font-bold text-sm text-[#4A1330]">
                {editingReview ? "Edit Review" : "Add Client Testimonial"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#7A6470] hover:text-[#2B1B24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Star Rating (1 to 5)
                </label>
                <select
                  value={stars}
                  onChange={(e) => setStars(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                >
                  <option value={5}>5 Stars (⭐⭐⭐⭐⭐)</option>
                  <option value={4}>4 Stars (⭐⭐⭐⭐)</option>
                  <option value={3}>3 Stars (⭐⭐⭐)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Feedback Comment *
                </label>
                <textarea
                  rows={3}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write the bride or client review..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4A1330]"
                />
                <label htmlFor="verified" className="text-xs font-medium text-[#2B1B24]">
                  Show &quot;Verified Client&quot; badge
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6470]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330]"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
