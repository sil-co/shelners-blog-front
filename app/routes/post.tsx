import { useEffect, useState } from "react";
import { Form, redirect, useNavigate, type NavigateFunction } from "react-router";
import type { Route } from "./+types/post";
import type { Post } from "~/types/blog";

const verifyOwner = async (blogId: string, navigate: NavigateFunction) => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate(`/${blogId}`);
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
            if (!data.isOwner) { navigate(`/${blogId}`); }
            return;
        } else {
            navigate(`/${blogId}`);
            return;
        }
    } catch (error) {
        navigate(`/${blogId}`);
        return;
    }
}

export async function loader({ params }: Route.LoaderArgs): Promise<[Post | null, string]> {
    const blogId = params.blogId;
    if (blogId === "new") {
        return [
            {
                id: '',
                userId: '',
                title: '',
                content: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            blogId
        ]
    }
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

export async function clientAction({ request, params }: Route.ActionArgs) {
    try {
        if (!confirm("Do you want to Create/Update")) { return; }
        const formData = await request.formData();
        const blogId = params.blogId;
        const postData = {
            title: formData.get("title"),
            content: formData.get("content")
        };
        const url = blogId === "new"
            ? `${import.meta.env.VITE_API_URL}/posts`
            : `${import.meta.env.VITE_API_URL}/posts/${blogId}`;
        const method = blogId === "new" ? "POST" : "PUT";
        // There is a problem when extracting characters on the Java side.
        // If `Bearer` is included, the POST method will not work.
        // Therefore, the token is sent as is only when POSTing.
        const authorization: string = blogId === "new" ? `${localStorage.getItem("token")}` : `Bearer ${localStorage.getItem("token")}`;
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Authorization": authorization,
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            console.error("Failed to create/update post");
            alert("Failed to create/update post");
            return { error: "Failed to process the request" };
        }
        alert("Success!");
        if (blogId === "new") return redirect("/");
        return redirect(`/${blogId}`);
    } catch (e) {
        console.log("error");
        alert("Post Error");
    }
}


export default function Post({
    loaderData
}: Route.ComponentProps) {
    const [post, setPost] = useState<Post | null>(loaderData[0]);
    const [blogId, setBlogId] = useState(loaderData[1]);
    const [title, setTitle] = useState(post?.title || "");
    const [content, setContent] = useState(post?.content || "");
    const navigate = useNavigate();
    
    useEffect(() => {
        if (blogId !== "new") { verifyOwner(blogId, navigate); }
    }, [blogId]);
    
    const handleDelete = async (blogId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) { return; }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${blogId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!res.ok) {
                console.error("Failed to delete post");
                alert("Failed to delete post");
                return;
            }
            alert("Delete successfully!");
            navigate("/");
        } catch(e) {
            console.error(e);
            alert("Delete Error");
        }
    }

    if (!post) return <p className="mt-10 text-center text-gray-500">Post not found.</p>;

    return (
        <Form method="POST" className="flex flex-col gap-6 max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left">
                {post.id === "" ? "New" : "Update"}
            </h1>
            <textarea
                name="title"
                className="w-full text-lg sm:text-xl md:text-2xl font-semibold p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Enter Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                name="content"
                className="w-full min-h-[calc(100vh-500px)] p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
                placeholder="Enter Content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigate(-1)} // Go back to to the previous page
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-400 transition-colors cursor-pointer"
                >
                    Back
                </button>
                <div className="flex items-center gap-2">
                    {post.id !== "" && (
                        <button
                            type="button"
                            onClick={() => handleDelete(blogId)}
                            className="px-4 py-2 bg-transparent border text-red-500 font-semibold rounded-md hover:text-red-700 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    )}
                    <button type="submit"
                        className="self-end px-6 py-2 bg-blue-500 border text-white font-semibold rounded-md shadow hover:bg-blue-600 transition-colors cursor-pointer text-center"
                    >
                        {post.id === "" ? "Create" : "Update"}
                    </button>
                </div>
            </div>
        </Form>
    );
}