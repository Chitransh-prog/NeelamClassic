"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Save,
  UploadCloud,
  History,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Video as VideoIcon,
  Search,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { SiteSectionsData } from "@/lib/content";

type DeviceMode = "desktop" | "tablet" | "mobile";
type ActivePanel = "inspector" | "theme" | "seo" | "sections" | "versions";

export default function VisualEditorPage() {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [activePanel, setActivePanel] = useState<ActivePanel>("inspector");
  const [selectedSection, setSelectedSection] = useState<string>("hero");

  const [content, setContent] = useState<SiteSectionsData | null>(null);
  const [historyStack, setHistoryStack] = useState<SiteSectionsData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Versions modal
  const [versions, setVersions] = useState<Array<{ id: string; createdAt: string; createdBy: string }>>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  // Media picker modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<{ section: string; field: string } | null>(null);
  const [mediaAssets, setMediaAssets] = useState<Array<{ id: string; url: string; title?: string }>>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Load draft content on mount
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/admin/content?mode=draft");
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
          setHistoryStack([data.content]);
          setHistoryIndex(0);
          setLastSaved(new Date().toLocaleTimeString());
        }
      } catch {
        toast.error("Failed to load draft content");
      }
    }
    loadContent();
  }, []);

  // Debounced auto-save to draft
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveDraft = useCallback(async (dataToSave: SiteSectionsData) => {
    setIsSavingDraft(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch {
      console.warn("Draft autosave failed");
    } finally {
      setIsSavingDraft(false);
    }
  }, []);

  const updateContent = (updater: (prev: SiteSectionsData) => SiteSectionsData) => {
    if (!content) return;
    const updated = updater(JSON.parse(JSON.stringify(content)));
    setContent(updated);

    // Update undo/redo stack
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(updated);
    if (newStack.length > 30) newStack.shift();
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);

    // Debounced autosave (800ms)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(updated);
    }, 800);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      const target = historyStack[newIdx];
      setContent(target);
      setHistoryIndex(newIdx);
      saveDraft(target);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const newIdx = historyIndex + 1;
      const target = historyStack[newIdx];
      setContent(target);
      setHistoryIndex(newIdx);
      saveDraft(target);
    }
  };

  const handlePublish = async () => {
    if (!content) return;
    setIsPublishing(true);
    try {
      // First ensure current draft is saved
      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      // Now publish live
      const res = await fetch("/api/admin/content/publish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");

      toast.success("Website is live! All changes published & ISR refreshed.", {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setIsPublishing(false);
    }
  };

  const loadVersions = async () => {
    setIsLoadingVersions(true);
    try {
      const res = await fetch("/api/admin/content/versions");
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch {
      toast.error("Failed to load version snapshots");
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const restoreVersion = async (versionId: string) => {
    try {
      const res = await fetch("/api/admin/content/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed");
      setContent(data.draftJson);
      toast.success("Version restored to draft!");
      setActivePanel("inspector");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to restore");
    }
  };

  const openMediaPicker = (section: string, field: string) => {
    setMediaTargetField({ section, field });
    setMediaModalOpen(true);
    // Load media assets
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setMediaAssets(d.assets || []))
      .catch(() => {});
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (mediaTargetField) {
        updateContent((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sec = (prev as any)[mediaTargetField.section];
          if (sec) {
            sec[mediaTargetField.field] = data.url;
          }
          return prev;
        });
      }
      setMediaModalOpen(false);
      toast.success("Media uploaded and applied!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload error");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const selectExistingAsset = (url: string) => {
    if (mediaTargetField) {
      updateContent((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sec = (prev as any)[mediaTargetField.section];
        if (sec) {
          sec[mediaTargetField.field] = url;
        }
        return prev;
      });
    }
    setMediaModalOpen(false);
  };

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-3 border-[#4A1330]/20 border-t-[#4A1330] rounded-full animate-spin" />
        <p className="text-xs font-medium text-[#7A6470]">Loading visual website editor...</p>
      </div>
    );
  }

  const sectionsList = [
    { id: "hero", name: "Hero Banner" },
    { id: "about", name: "About & Founder" },
    { id: "servicesOverview", name: "Services Portfolio" },
    { id: "makeupPriceList", name: "Makeup Price List" },
    { id: "videoShowcase", name: "Video Showcase" },
    { id: "academy", name: "Academy Courses" },
    { id: "gallery", name: "Photo Gallery" },
    { id: "testimonials", name: "Client Reviews" },
    { id: "contact", name: "Contact & Hours" },
    { id: "footer", name: "Footer & Copyright" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Top Editor Header Control Bar */}
      <div className="bg-white rounded-2xl border border-[#F8E8EC] p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Monogram & Device Switcher & History */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden shadow-xs border border-[#C9A66B]/60 bg-black hidden md:block">
            <Image
              src="/images/logo-icon.png"
              alt="Neelam Classic Monogram"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex items-center bg-[#FFF9F5] border border-[#F8E8EC] p-1 rounded-xl">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                device === "desktop"
                  ? "bg-[#4A1330] text-[#FFF9F5] shadow-xs"
                  : "text-[#7A6470] hover:text-[#2B1B24]"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                device === "tablet"
                  ? "bg-[#4A1330] text-[#FFF9F5] shadow-xs"
                  : "text-[#7A6470] hover:text-[#2B1B24]"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                device === "mobile"
                  ? "bg-[#4A1330] text-[#FFF9F5] shadow-xs"
                  : "text-[#7A6470] hover:text-[#2B1B24]"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <div className="h-6 w-px bg-[#F8E8EC] mx-1 hidden sm:block" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-lg text-[#7A6470] hover:bg-[#F8E8EC] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= historyStack.length - 1}
              className="p-2 rounded-lg text-[#7A6470] hover:bg-[#F8E8EC] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Save state */}
        <div className="flex items-center gap-2 text-xs text-[#7A6470]">
          {isSavingDraft ? (
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Autosaving draft...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Draft saved {lastSaved && `at ${lastSaved}`}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Version History */}
          <button
            onClick={() => {
              setActivePanel("versions");
              loadVersions();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#F8E8EC] bg-[#FFF9F5] text-xs font-medium text-[#7A6470] hover:text-[#4A1330] hover:bg-[#F8E8EC] flex items-center gap-1.5 transition"
          >
            <History className="w-4 h-4 text-[#B76E79]" />
            <span className="hidden sm:inline">Versions</span>
          </button>

          {/* Theme panel */}
          <button
            onClick={() => setActivePanel("theme")}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#F8E8EC] text-xs font-medium flex items-center gap-1.5 transition ${
              activePanel === "theme"
                ? "bg-[#4A1330] text-[#FFF9F5]"
                : "bg-[#FFF9F5] text-[#7A6470] hover:text-[#4A1330]"
            }`}
          >
            <Sliders className="w-4 h-4 text-[#C9A66B]" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* SEO panel */}
          <button
            onClick={() => setActivePanel("seo")}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#F8E8EC] text-xs font-medium flex items-center gap-1.5 transition ${
              activePanel === "seo"
                ? "bg-[#4A1330] text-[#FFF9F5]"
                : "bg-[#FFF9F5] text-[#7A6470] hover:text-[#4A1330]"
            }`}
          >
            <Search className="w-4 h-4 text-[#B76E79]" />
            <span className="hidden sm:inline">SEO</span>
          </button>

          {/* Publish Live */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-gradient-to-r from-[#4A1330] to-[#2F001B] hover:opacity-95 shadow-md shadow-[#4A1330]/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace: Preview Area + Right Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Live Visual Viewport */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Section Picker Pills */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSection(sec.id);
                  setActivePanel("inspector");
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
                  selectedSection === sec.id
                    ? "bg-[#4A1330] text-[#FFF9F5] shadow-sm"
                    : "bg-white border border-[#F8E8EC] text-[#7A6470] hover:text-[#2B1B24]"
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          {/* Device Frame Viewport */}
          <div
            className={`w-full bg-white border border-[#F8E8EC] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 flex flex-col ${
              device === "mobile"
                ? "max-w-[390px] h-[750px]"
                : device === "tablet"
                ? "max-w-[768px] h-[800px]"
                : "max-w-full min-h-[750px]"
            }`}
          >
            {/* Viewport Top Bar */}
            <div className="bg-[#FFF9F5] border-b border-[#F8E8EC] px-4 py-2 flex items-center justify-between text-xs text-[#7A6470]">
              <span className="font-semibold text-[#4A1330]">
                Live Preview: {sectionsList.find((s) => s.id === selectedSection)?.name}
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                Click any field on the right to edit
              </span>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FFF9F5] space-y-6">
              {/* Hero Section Preview */}
              <div
                onClick={() => {
                  setSelectedSection("hero");
                  setActivePanel("inspector");
                }}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition ${
                  selectedSection === "hero"
                    ? "border-[#4A1330] bg-[#4A1330]/5 shadow-md"
                    : "border-dashed border-transparent hover:border-[#B76E79]/50"
                }`}
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#4A1330] text-[#FFF9F5] rounded text-[10px] uppercase font-bold tracking-wider">
                  Hero Section
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#4A1330] text-[#C9A66B] text-xs font-semibold uppercase tracking-wider mb-3">
                  {content.hero.badge}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#4A1330] leading-tight mb-2">
                  {content.hero.titleLine1}{" "}
                  <span className="text-[#B76E79]">{content.hero.titleHighlight}</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#7A6470] mb-4 leading-relaxed line-clamp-3">
                  {content.hero.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 rounded-xl bg-[#B76E79] text-[#FFF9F5] text-xs font-medium shadow-sm">
                    {content.hero.primaryBtnText}
                  </span>
                  <span className="px-4 py-2 rounded-xl border border-[#4A1330] text-[#4A1330] text-xs font-medium">
                    {content.hero.secondaryBtnText}
                  </span>
                </div>
              </div>

              {/* About Section Preview */}
              <div
                onClick={() => {
                  setSelectedSection("about");
                  setActivePanel("inspector");
                }}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition ${
                  selectedSection === "about"
                    ? "border-[#4A1330] bg-[#4A1330]/5 shadow-md"
                    : "border-dashed border-transparent hover:border-[#B76E79]/50"
                }`}
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#4A1330] text-[#FFF9F5] rounded text-[10px] uppercase font-bold tracking-wider">
                  About Section
                </div>
                <div className="text-xs font-bold text-[#B76E79] uppercase tracking-wider mb-1">
                  {content.about.badge}
                </div>
                <h2 className="text-xl font-bold text-[#4A1330] mb-2">{content.about.title}</h2>
                <p className="text-xs text-[#7A6470] mb-3 leading-relaxed">
                  {content.about.description1}
                </p>
                <div className="text-xs font-semibold text-[#4A1330]">
                  {content.about.ownerName} —{" "}
                  <span className="text-[#B76E79]">{content.about.ownerRole}</span>
                </div>
              </div>

              {/* Services & Pricing Preview */}
              <div
                onClick={() => {
                  setSelectedSection("servicesOverview");
                  setActivePanel("inspector");
                }}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition ${
                  selectedSection === "servicesOverview"
                    ? "border-[#4A1330] bg-[#4A1330]/5 shadow-md"
                    : "border-dashed border-transparent hover:border-[#B76E79]/50"
                }`}
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#4A1330] text-[#FFF9F5] rounded text-[10px] uppercase font-bold tracking-wider">
                  Services Portfolio
                </div>
                <div className="text-xs font-bold text-[#B76E79] uppercase tracking-wider mb-1">
                  {content.servicesOverview.badge}
                </div>
                <h2 className="text-xl font-bold text-[#4A1330] mb-1">
                  {content.servicesOverview.title}
                </h2>
                <p className="text-xs text-[#7A6470]">{content.servicesOverview.subtitle}</p>
              </div>

              {/* Academy Section Preview */}
              <div
                onClick={() => {
                  setSelectedSection("academy");
                  setActivePanel("inspector");
                }}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition ${
                  selectedSection === "academy"
                    ? "border-[#4A1330] bg-[#4A1330]/5 shadow-md"
                    : "border-dashed border-transparent hover:border-[#B76E79]/50"
                }`}
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#4A1330] text-[#FFF9F5] rounded text-[10px] uppercase font-bold tracking-wider">
                  Academy Section
                </div>
                <div className="text-xs font-bold text-[#B76E79] uppercase tracking-wider mb-1">
                  {content.academy.badge}
                </div>
                <h2 className="text-xl font-bold text-[#4A1330] mb-1">
                  {content.academy.title}
                </h2>
                <p className="text-xs text-[#7A6470]">{content.academy.subtitle}</p>
              </div>

              {/* Contact Section Preview */}
              <div
                onClick={() => {
                  setSelectedSection("contact");
                  setActivePanel("inspector");
                }}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition ${
                  selectedSection === "contact"
                    ? "border-[#4A1330] bg-[#4A1330]/5 shadow-md"
                    : "border-dashed border-transparent hover:border-[#B76E79]/50"
                }`}
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#4A1330] text-[#FFF9F5] rounded text-[10px] uppercase font-bold tracking-wider">
                  Contact Section
                </div>
                <h2 className="text-xl font-bold text-[#4A1330] mb-1">{content.contact.title}</h2>
                <p className="text-xs text-[#7A6470] mb-2">{content.contact.subtitle}</p>
                <div className="text-xs font-medium text-[#2B1B24]">
                  Phone: {content.contact.formattedPhone} | Hours: {content.contact.hours}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inspector Panel */}
        <div className="lg:col-span-4 bg-white border border-[#F8E8EC] rounded-2xl p-5 shadow-sm min-h-[700px] sticky top-20">
          {/* Header of Inspector */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F8E8EC]">
            <h3 className="font-semibold text-sm text-[#4A1330]">
              {activePanel === "inspector" && `Editing: ${sectionsList.find((s) => s.id === selectedSection)?.name}`}
              {activePanel === "theme" && "Theme & Color Palette"}
              {activePanel === "seo" && "SEO & Meta Settings"}
              {activePanel === "versions" && "Version History & Restore"}
            </h3>
            {activePanel !== "inspector" && (
              <button
                onClick={() => setActivePanel("inspector")}
                className="text-xs font-medium text-[#B76E79] hover:underline"
              >
                Back to Content
              </button>
            )}
          </div>

          {/* Panel: Content Inspector for Selected Section */}
          {activePanel === "inspector" && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {/* HERO SECTION FIELDS */}
              {selectedSection === "hero" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={content.hero.badge}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.hero.badge = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Headline (First Part)
                    </label>
                    <input
                      type="text"
                      value={content.hero.titleLine1}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.hero.titleLine1 = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Headline (Highlight Word)
                    </label>
                    <input
                      type="text"
                      value={content.hero.titleHighlight}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.hero.titleHighlight = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Description Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.description}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.hero.description = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                        Primary CTA Button
                      </label>
                      <input
                        type="text"
                        value={content.hero.primaryBtnText}
                        onChange={(e) =>
                          updateContent((prev) => {
                            prev.hero.primaryBtnText = e.target.value;
                            return prev;
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                        Secondary CTA Button
                      </label>
                      <input
                        type="text"
                        value={content.hero.secondaryBtnText}
                        onChange={(e) =>
                          updateContent((prev) => {
                            prev.hero.secondaryBtnText = e.target.value;
                            return prev;
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                      />
                    </div>
                  </div>

                  {/* Image Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Hero Bride Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={content.hero.image}
                        onChange={(e) =>
                          updateContent((prev) => {
                            prev.hero.image = e.target.value;
                            return prev;
                          })
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker("hero", "image")}
                        className="p-2 rounded-xl bg-[#4A1330] text-[#FFF9F5] hover:opacity-90 transition"
                        title="Upload or pick media"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ABOUT SECTION FIELDS */}
              {selectedSection === "about" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={content.about.badge}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.about.badge = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      About Title
                    </label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.about.title = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Description Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={content.about.description1}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.about.description1 = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={content.about.ownerName}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.about.ownerName = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>
                </>
              )}

              {/* SERVICES & ACADEMY & CONTACT FIELDS */}
              {selectedSection === "servicesOverview" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={content.servicesOverview.title}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.servicesOverview.title = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={content.servicesOverview.subtitle}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.servicesOverview.subtitle = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>
                </>
              )}

              {selectedSection === "contact" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Contact Title
                    </label>
                    <input
                      type="text"
                      value={content.contact.title}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.contact.title = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Phone Number (Raw)
                    </label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.contact.phone = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={content.contact.hours}
                      onChange={(e) =>
                        updateContent((prev) => {
                          prev.contact.hours = e.target.value;
                          return prev;
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Panel: Theme & Brand Colors */}
          {activePanel === "theme" && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Primary Plum (#4A1330)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.theme.primaryColor}
                    onChange={(e) =>
                      updateContent((prev) => {
                        prev.theme.primaryColor = e.target.value;
                        return prev;
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-[#F8E8EC]"
                  />
                  <input
                    type="text"
                    value={content.theme.primaryColor}
                    onChange={(e) =>
                      updateContent((prev) => {
                        prev.theme.primaryColor = e.target.value;
                        return prev;
                      })
                    }
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Accent Rose Gold (#B76E79)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.theme.accentColor}
                    onChange={(e) =>
                      updateContent((prev) => {
                        prev.theme.accentColor = e.target.value;
                        return prev;
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-[#F8E8EC]"
                  />
                  <input
                    type="text"
                    value={content.theme.accentColor}
                    onChange={(e) =>
                      updateContent((prev) => {
                        prev.theme.accentColor = e.target.value;
                        return prev;
                      })
                    }
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Champagne Accent (#C9A66B)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.theme.champagneColor}
                    onChange={(e) =>
                      updateContent((prev) => {
                        prev.theme.champagneColor = e.target.value;
                        return prev;
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-[#F8E8EC]"
                  />
                  <input
                    type="text"
                    value={content.theme.champagneColor}
                    onChange={(e) =>
                      updateContent((prev) => {
                        prev.theme.champagneColor = e.target.value;
                        return prev;
                      })
                    }
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WCAG AA Contrast Compliant for Ivory (#FFF9F5) background.</span>
              </div>
            </div>
          )}

          {/* Panel: SEO */}
          {activePanel === "seo" && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  value={content.seo.title}
                  onChange={(e) =>
                    updateContent((prev) => {
                      prev.seo.title = e.target.value;
                      return prev;
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={content.seo.description}
                  onChange={(e) =>
                    updateContent((prev) => {
                      prev.seo.description = e.target.value;
                      return prev;
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={content.seo.keywords}
                  onChange={(e) =>
                    updateContent((prev) => {
                      prev.seo.keywords = e.target.value;
                      return prev;
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                />
              </div>
            </div>
          )}

          {/* Panel: Version History */}
          {activePanel === "versions" && (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              <p className="text-xs text-[#7A6470] mb-2">
                Last 20 published snapshots. Click any snapshot to restore to draft.
              </p>
              {isLoadingVersions ? (
                <div className="py-8 text-center text-xs text-[#7A6470]">Loading versions...</div>
              ) : versions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7A6470]">
                  No past snapshots available yet.
                </div>
              ) : (
                versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl border border-[#F8E8EC] bg-[#FFF9F5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#4A1330]">{ver.createdBy || "Publish"}</div>
                      <div className="text-[10px] text-[#7A6470]">
                        {new Date(ver.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => restoreVersion(ver.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#4A1330] text-[#FFF9F5] text-[11px] font-medium hover:opacity-90"
                    >
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Media Picker Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8E8EC] w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#F8E8EC] mb-4">
              <h3 className="font-bold text-base text-[#4A1330]">Choose or Upload Media</h3>
              <button
                onClick={() => setMediaModalOpen(false)}
                className="p-1 rounded-lg text-[#7A6470] hover:text-[#2B1B24]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload form */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-[#B76E79]/40 bg-[#FFF9F5] text-center mb-5">
              <input
                type="file"
                id="mediaUpload"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="mediaUpload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <UploadCloud className="w-8 h-8 text-[#B76E79] mb-2" />
                <span className="text-xs font-semibold text-[#4A1330]">
                  {isUploadingMedia ? "Uploading..." : "Click to Upload New Photo or Video"}
                </span>
                <span className="text-[11px] text-[#7A6470] mt-1">
                  JPG, PNG, WEBP up to 10MB | MP4, WEBM up to 50MB
                </span>
              </label>
            </div>

            {/* Media Asset Grid */}
            <div className="text-xs font-semibold text-[#2B1B24] mb-2">Available Media Library:</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => selectExistingAsset(asset.url)}
                  className="aspect-square rounded-xl overflow-hidden border border-[#F8E8EC] hover:border-[#4A1330] cursor-pointer group relative bg-black/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.title || "Media"}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
