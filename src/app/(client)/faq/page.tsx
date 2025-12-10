"use client";

import React, { useEffect, useState } from "react";
import { useFAQStore } from "@/store/useFAQStore";
import { PageLoader } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandedFAQ {
  [key: string]: boolean;
}

export default function FAQs() {
  const { faqs, categories, loading, error, fetchFAQs, fetchCategories } = useFAQStore();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [expanded, setExpanded] = useState<ExpandedFAQ>({});

  useEffect(() => {
    fetchCategories();
    fetchFAQs();
  }, [fetchFAQs, fetchCategories]);

  const toggleFAQ = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={fetchFAQs} />;

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans mt-8 px-4 md:px-[5%]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

        {/* Category Tabs */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
            >
              All
            </Button>
            {categories.map((cat, idx) => (
              <Button
                key={idx}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* FAQs Accordion */}
        {filteredFAQs.length === 0 ? (
          <EmptyState title="No FAQs found" description="Check back soon" />
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border rounded-lg overflow-hidden hover:border-gray-400 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(faq.id.toString())}
                  className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors text-left font-semibold"
                >
                  <span>{faq.question}</span>
                  {expanded[faq.id.toString()] ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0" />
                  )}
                </button>
                {expanded[faq.id.toString()] && (
                  <div className="px-6 py-4 bg-white text-gray-700 border-t">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
