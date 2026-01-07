"use client";

import Link from 'next/link';
import { Pencil } from 'lucide-react';

interface EditPageButtonProps {
    /** The URL path to navigate to when clicking the edit button */
    editUrl: string;
    /** Optional custom label for the button (default: "Edit Page") */
    label?: string;
    /** Optional custom className for additional styling */
    className?: string;
    /** Optional callback function to execute before navigation */
    onEditClick?: () => void;
}

/**
 * A floating edit button component that navigates to the page editor
 * Displays a pencil icon with customizable label and styling
 */
export default function EditPageButton({
    editUrl,
    label = "Edit Page",
    className = "",
    onEditClick
}: EditPageButtonProps) {

    const handleClick = () => {
        if (onEditClick) {
            onEditClick();
        }
    };

    return (
        <Link
            href={editUrl}
            onClick={handleClick}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold ${className}`}
            style={{
                boxShadow: '0 10px 25px rgba(109, 31, 74, 0.3)'
            }}
        >
            <Pencil className="w-5 h-5" />
            <span>{label}</span>
        </Link>
    );
}
