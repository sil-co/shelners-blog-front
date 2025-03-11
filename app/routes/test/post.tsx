import { Form, redirect } from "react-router";
import type { Route } from "./test/+types/post";

export async function loader({ params }: Route.LoaderArgs) {
    const postId = params.postId;
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    return await res.json();
}

export async function action() { }
export async function clientAction({ params}: Route.LoaderArgs) {
    console.log('clientAction is called');
    await fetch(`https://jsonplaceholder.typicode.com/posts/${params.postId}`, {method: "DELETE"});
    return redirect("/");
}

export default function Post({ loaderData }: Route.ComponentProps) {
    return (
        <div>
            {" "}
            <p>Title: {loaderData.title}</p>
            <p>Body: {loaderData.body}</p>
            <Form method="delete">
                <button type="submit">Delete</button>
            </Form>
        </div>
    );
}