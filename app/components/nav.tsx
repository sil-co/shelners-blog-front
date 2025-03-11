import { useState } from "react";
import { Link } from "react-router";

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* logo */}
                    <div className="text-xl font-bold">
                        <Link to="/">Shelner's Blog</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}