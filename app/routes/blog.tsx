import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { Post } from "~/types/blog";
import type { Route } from "./+types/blog";
import { Link, redirect, useNavigate } from "react-router";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

export async function loader({ params }: Route.LoaderArgs): Promise<[Post | null, string]> {
    const blogId = params.blogId;
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${blogId}`
    );
    if (!res.ok) {
        console.error("Failed to fetch blog posts");
        return [null, blogId];
    }
    const post: Post = await res.json();
    return [post, blogId];
}

const verifyOwner = async (blogId: string, setIsOwner: React.Dispatch<React.SetStateAction<boolean>>) => {
    const token = localStorage.getItem("token");
    if (!token) {
        setIsOwner(false);
        return;
    }
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/posts/verify-owner/${blogId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (res.ok) {
            const data = await res.json();
            setIsOwner(data.isOwner);
            return;
        } else {
            setIsOwner(false);
            return;
        }
    } catch (error) {
        setIsOwner(false);
        return;
    }
}

export default function Blog({ loaderData }: Route.ComponentProps) {
    const [post, setPost] = useState<Post | null>(loaderData[0]);
    const [blogId, setBlogId] = useState<string>(loaderData[1]);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!post) return;
        setPost(post);
    }, [post]);

    useEffect(() => {
        setBlogId(blogId);
        verifyOwner(blogId, setIsOwner);
    }, [blogId]);

    if (!post) return <p className="mt-10 text-center text-gray-500">Post not found.</p>;

    return (
        <div className="container mx-auto p-6 flex justify-center">
            <article className="markdown-body max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg w-full h-full relative">
                {isOwner && (
                    <button
                        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 cursor-pointer"
                        onClick={() => navigate(`/post/${blogId}`) }
                    >
                        Edit
                    </button>
                )}
                <h1 className="text-4xl font-bold mb-4 text-gray-800">{post.title}</h1>
                <p className="text-sm text-gray-500 mb-6">Last updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
                <hr className="mb-6" />
                <div className="markdown-body prose max-w-none min-h-[calc(100vh-350px)]">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6" {...props} />, // Forces bullet points
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6" {...props} />, // Number list
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
}