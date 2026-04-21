"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data: Post[] = await res.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-black dark:text-white">
        Client Side Rendering (API)
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-zinc-500">Loading...</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="border p-4 rounded-md bg-zinc-50 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-black dark:text-white">
                {post.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {post.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}