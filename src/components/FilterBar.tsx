"use client";

import { ChevronDown, Calendar } from 'lucide-react';

interface FilterBarProps {
    branches: string[];
    authors: string[];
    environments: string[];
    selectedBranch: string;
    selectedAuthor: string;
    selectedEnvironment: string;
    selectedStatus: string;
    onBranchChange: (branch: string) => void;
    onAuthorChange: (author: string) => void;
    onEnvironmentChange: (environment: string) => void;
    onStatusChange: (status: string) => void;
    onClearFilters: () => void;
}

export default function FilterBar({
    branches,
    authors,
    environments,
    selectedBranch,
    selectedAuthor,
    selectedEnvironment,
    selectedStatus,
    onBranchChange,
    onAuthorChange,
    onEnvironmentChange,
    onStatusChange,
    onClearFilters
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Branch Filter */}
            <div className="relative">
                <select
                    value={selectedBranch}
                    onChange={(e) => onBranchChange(e.target.value)}
                    className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-gray-750 transition-colors"
                >
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                        <option key={branch} value={branch}>
                            {branch}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Author Filter */}
            <div className="relative">
                <select
                    value={selectedAuthor}
                    onChange={(e) => onAuthorChange(e.target.value)}
                    className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-gray-750 transition-colors"
                >
                    <option value="">All Authors</option>
                    {authors.map((author) => (
                        <option key={author} value={author}>
                            {author}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Environment Filter */}
            <div className="relative">
                <select
                    value={selectedEnvironment}
                    onChange={(e) => onEnvironmentChange(e.target.value)}
                    className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-gray-750 transition-colors"
                >
                    <option value="">All Environments</option>
                    {environments.map((env) => (
                        <option key={env} value={env}>
                            {env}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Range Selector */}
            <button className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-750 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Select Date Range</span>
            </button>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 ml-auto">
                <span className="text-gray-400 text-sm mr-2">Status:</span>
                {['All', 'Error', 'Ready', 'Pending'].map((status) => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status === 'All' ? '' : status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedStatus === (status === 'All' ? '' : status)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Clear Filters */}
            {(selectedBranch || selectedAuthor || selectedEnvironment || selectedStatus) && (
                <button
                    onClick={onClearFilters}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
}
