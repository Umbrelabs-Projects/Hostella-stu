"use client";

import React, { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { PageLoader } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const { posts, categories, loading, error, fetchPosts, fetchCategories } = useBlogStore();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchPosts({ category: selectedCategory, page });
  }, [fetchPosts, fetchCategories, selectedCategory, page]);

  if (loading && posts.length === 0) return <PageLoader />;
  if (error && posts.length === 0) return <ErrorState message={error} onRetry={() => fetchPosts({ category: selectedCategory, page })} />;

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans mt-8 px-4 md:px-[5%]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Blog</h1>

        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(undefined);
                setPage(1);
              }}
            >
              All Posts
            </Button>
            {categories.map((cat, idx) => (
              <Button
                key={idx}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <EmptyState title="No blog posts" description="Check back soon for new content" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      {post.category && <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2">{page}</span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
