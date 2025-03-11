import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
    route("test/about", "routes/test/about.tsx"),
    route("test/post/:postId", "routes/test/post.tsx"),
    // Nested Routes
    layout("routes/test/dashboard.tsx", [
        route("test/finances", "routes/test/finances.tsx"),
        route("test/personal-info", "routes/test/personal-info.tsx"),
    ]),
    
    index("routes/home.tsx"),
    route(":blogId", "routes/blog.tsx"),
    route("login", "routes/login.tsx"),
    route("post/:blogId", "routes/post.tsx"),
] satisfies RouteConfig;
