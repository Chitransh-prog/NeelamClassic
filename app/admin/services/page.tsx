"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Tag,
  Search,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price?: number;
  priceDisplay?: string;
  badge?: string;
  tab?: string;
  isActive: boolean;
}

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  items: ServiceItem[];
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemPriceDisplay, setItemPriceDisplay] = useState("");
  const [itemBadge, setItemBadge] = useState("");
  const [itemTab, setItemTab] = useState("bridal");

  const loadServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
        if (data.categories?.length > 0 && !selectedCatId) {
          setSelectedCatId(data.categories[0].id);
        }
      }
    } catch {
      toast.error("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddItem = () => {
    setEditingItem(null);
    setItemName("");
    setItemDesc("");
    setItemPrice("");
    setItemPriceDisplay("");
    setItemBadge("");
    setItemTab("bridal");
    setItemModalOpen(true);
  };

  const openEditItem = (item: ServiceItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description || "");
    setItemPrice(item.price ? item.price.toString() : "");
    setItemPriceDisplay(item.priceDisplay || "");
    setItemBadge(item.badge || "");
    setItemTab(item.tab || "bridal");
    setItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    try {
      if (editingItem) {
        // Update
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            type: "item",
            name: itemName,
            description: itemDesc,
            price: itemPrice,
            priceDisplay: itemPriceDisplay || (itemPrice ? `₹${itemPrice}` : ""),
            badge: itemBadge,
            tab: itemTab,
          }),
        });
        if (!res.ok) throw new Error("Failed to update item");
        toast.success("Service updated successfully");
      } else {
        // Create
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "item",
            categoryId: selectedCatId,
            name: itemName,
            description: itemDesc,
            price: itemPrice,
            priceDisplay: itemPriceDisplay || (itemPrice ? `₹${itemPrice}` : ""),
            badge: itemBadge,
            tab: itemTab,
          }),
        });
        if (!res.ok) throw new Error("Failed to create item");
        toast.success("Service created successfully");
      }

      setItemModalOpen(false);
      loadServices();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error saving service");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services?type=item&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Service deleted");
      loadServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const activeCategory = categories.find((c) => c.id === selectedCatId);
  const filteredItems = (activeCategory?.items || []).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
            Services &amp; Pricing Manager
          </h1>
          <p className="text-xs text-[#7A6470] mt-1">
            Manage your 135+ salon treatments, bridal packages, and PMU aesthetics. Feeds the website and invoice picker.
          </p>
        </div>
        <button
          onClick={openAddItem}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] text-xs font-semibold hover:opacity-95 shadow-md shadow-[#4A1330]/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Main Layout: Categories List (Left) + Services (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Categories Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#F8E8EC] p-4 shadow-sm space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470] px-2 mb-2">
            Categories ({categories.length})
          </div>
          <div className="space-y-1 max-h-[650px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`w-full text-left p-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                  selectedCatId === cat.id
                    ? "bg-[#4A1330] text-[#FFF9F5] shadow-sm font-semibold"
                    : "text-[#2B1B24] hover:bg-[#FFF9F5]"
                }`}
              >
                <div>
                  <div>{cat.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      selectedCatId === cat.id ? "text-[#C9A66B]" : "text-[#7A6470]"
                    }`}
                  >
                    {cat.items?.length || 0} services
                  </div>
                </div>
                <Sparkles
                  className={`w-4 h-4 ${
                    selectedCatId === cat.id ? "text-[#C9A66B]" : "text-[#B76E79]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Services Table / Cards */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-sm space-y-4">
          {/* Search Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6470]" />
              <input
                type="text"
                placeholder="Search services in this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
              />
            </div>
          </div>

          {/* Items List */}
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#7A6470]">Loading services...</div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7A6470]">
              No service items found in this category. Click &quot;Add New Service&quot; above to add one.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#F8E8EC] bg-[#FFF9F5] hover:bg-white hover:border-[#B76E79]/40 transition flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#4A1330] truncate">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A66B]/20 text-[#4A1330] border border-[#C9A66B]/40">
                          {item.badge}
                        </span>
                      )}
                      {item.tab && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F8E8EC] text-[#B76E79] capitalize">
                          {item.tab}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-[#7A6470] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#4A1330]">
                        {item.priceDisplay || (item.price ? `₹${item.price}` : "On Request")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditItem(item)}
                        className="p-1.5 rounded-lg text-[#7A6470] hover:text-[#4A1330] hover:bg-[#F8E8EC] transition"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Modal (Create/Edit) */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8E8EC] w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8E8EC] mb-4">
              <h3 className="font-bold text-sm text-[#4A1330]">
                {editingItem ? "Edit Service Item" : "Create New Service Item"}
              </h3>
              <button
                onClick={() => setItemModalOpen(false)}
                className="p-1 rounded-lg text-[#7A6470] hover:text-[#2B1B24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Signature Bridal HD Makeup"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Brief description of the service and products used"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Base Rate (₹) [for Invoice]
                  </label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Display Label / Range
                  </label>
                  <input
                    type="text"
                    value={itemPriceDisplay}
                    onChange={(e) => setItemPriceDisplay(e.target.value)}
                    placeholder="e.g. ₹5,000 to ₹10,000"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={itemBadge}
                    onChange={(e) => setItemBadge(e.target.value)}
                    placeholder="e.g. Bestseller, Signature"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Tab Category
                  </label>
                  <select
                    value={itemTab}
                    onChange={(e) => setItemTab(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
                  >
                    <option value="basic">Basic</option>
                    <option value="party">Party</option>
                    <option value="bridal">Bridal</option>
                    <option value="permanent">Permanent (PMU)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6470] hover:bg-[#F8E8EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330] hover:opacity-90 transition"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
