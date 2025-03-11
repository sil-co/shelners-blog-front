import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import { Form, Link, redirect } from "react-router";

import type { Post } from "~/types/blog";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Shelner's Blog" },
    { name: "description", content: "Welcome to Shelner's Blog!" },
  ];
}

export async function loader(): Promise<Post[]> {
  const res = await fetch(
    `http://localhost:8081/api/posts`
  );
  const posts: Post[] = await res.json();
  return posts;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [loggedIn,setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Shelner's Blog</h1>

      {/* Show New button if logged in */}
      {loggedIn && (
        <div className="text-right mb-4">
          <Link to="/post/new">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer">New</button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
        {loaderData.map((post: Post, index: number) => (
          <div
            key={index}
            className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition bg-white relative"
          >
            <h2 className="text-2xl font-semibold mb-2">
              <Link to={`/${post.id}`} className="text-blue-500 hover:text-blue-700 transition">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500 absolute bottom-2 right-2">
              Last updated: {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))
        }
      </div>
    </div >
  );
}
