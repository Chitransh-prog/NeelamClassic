"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Award,
  BookOpen,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  duration: string;
  description?: string;
  modules: string[];
  hasCertificate: boolean;
  image?: string;
  price?: number;
}

export default function CoursesManagerPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [modulesText, setModulesText] = useState("");
  const [hasCertificate, setHasCertificate] = useState(true);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");

  const loadCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (res.ok) setCourses(data.courses || []);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openAdd = () => {
    setEditingCourse(null);
    setTitle("");
    setDuration("1 Month");
    setDescription("");
    setModulesText("");
    setHasCertificate(true);
    setImage("/images/gallery-5.jpg");
    setPrice("");
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDuration(course.duration);
    setDescription(course.description || "");
    setModulesText(
      Array.isArray(course.modules) ? course.modules.join("\n") : ""
    );
    setHasCertificate(course.hasCertificate);
    setImage(course.image || "");
    setPrice(course.price ? course.price.toString() : "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !duration) return;

    const modules = modulesText
      .split("\n")
      .map((m) => m.trim())
      .filter(Boolean);

    try {
      if (editingCourse) {
        const res = await fetch("/api/admin/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCourse.id,
            title,
            duration,
            description,
            modules,
            hasCertificate,
            image,
            price,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Course updated");
      } else {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            duration,
            description,
            modules,
            hasCertificate,
            image,
            price,
          }),
        });
        if (!res.ok) throw new Error("Creation failed");
        toast.success("Course created");
      }
      setModalOpen(false);
      loadCourses();
    } catch {
      toast.error("Failed to save course");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Course deleted");
      loadCourses();
    } catch {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
            Academy Courses &amp; Certifications
          </h1>
          <p className="text-xs text-[#7A6470] mt-1">
            Empower aspiring artists with hands-on professional diplomas and masterclasses.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] text-xs font-semibold hover:opacity-95 shadow-md shadow-[#4A1330]/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#7A6470]">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#7A6470] bg-white rounded-2xl border border-[#F8E8EC] p-8">
          No courses currently listed.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-xs hover:border-[#B76E79]/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-sm text-[#4A1330] leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(course)}
                      className="p-1.5 rounded-lg text-[#7A6470] hover:text-[#4A1330] hover:bg-[#F8E8EC] transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#7A6470] mb-3">
                  <span className="flex items-center gap-1 font-medium text-[#B76E79]">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                  {course.hasCertificate && (
                    <span className="flex items-center gap-1 font-medium text-emerald-700">
                      <Award className="w-3.5 h-3.5" />
                      Certificate Included
                    </span>
                  )}
                </div>

                {course.description && (
                  <p className="text-xs text-[#2B1B24] leading-relaxed mb-4">
                    {course.description}
                  </p>
                )}

                {/* Modules list */}
                {Array.isArray(course.modules) && course.modules.length > 0 && (
                  <div className="bg-[#FFF9F5] p-3 rounded-xl border border-[#F8E8EC] space-y-1.5 mb-4">
                    <div className="text-[11px] font-semibold text-[#4A1330] uppercase tracking-wider">
                      Course Curriculum Highlights:
                    </div>
                    {course.modules.map((m, idx) => (
                      <div key={idx} className="text-xs text-[#7A6470] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8E8EC] w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8E8EC] mb-4">
              <h3 className="font-bold text-sm text-[#4A1330]">
                {editingCourse ? "Edit Academy Course" : "Create Academy Course"}
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
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Masterclass in Professional Makeup Artistry"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 1 to 2 Months"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Course Fee (₹) [Optional]
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 35000"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of the curriculum and learning outcomes"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Modules / Highlights (one per line)
                </label>
                <textarea
                  rows={4}
                  value={modulesText}
                  onChange={(e) => setModulesText(e.target.value)}
                  placeholder="Skin undertone &amp; color theory&#10;HD bridal &amp; cocktail looks&#10;Airbrush gun operation"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="certificate"
                  checked={hasCertificate}
                  onChange={(e) => setHasCertificate(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4A1330]"
                />
                <label htmlFor="certificate" className="text-xs font-medium text-[#2B1B24]">
                  Provides Professional Certificate upon completion
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
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
