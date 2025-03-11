import { Outlet } from "react-router";

export default function Dashboard() {

    return (
        <div>
            {" "}
            this is dashboard page! <Outlet />
        </div>
    )
}