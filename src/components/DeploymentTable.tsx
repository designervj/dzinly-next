"use client";


import { Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react';

interface DeploymentTableProps {
    data: DeploymentEntry[];
    onEdit: (entry: DeploymentEntry) => void;
    onDelete: (id: string) => void;
    onView: (entry: DeploymentEntry) => void;
}

export default function DeploymentTable({ data, onEdit, onDelete, onView }: DeploymentTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Error':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Ready':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Pending':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const getEnvironmentColor = (environment: string) => {
        switch (environment) {
            case 'Production':
                return 'text-blue-400';
            case 'Staging':
                return 'text-yellow-400';
            case 'Development':
                return 'text-green-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Environment
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Branch
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Author
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Commit
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-12 text-gray-500">
                                No deployments found. Try adjusting your filters or add a new deployment.
                            </td>
                        </tr>
                    ) : (
                        data.map((entry) => (
                            <tr
                                key={entry.id}
                                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{entry.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`text-sm font-medium ${getEnvironmentColor(entry.environment)}`}>
                                        {entry.environment}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M11.5 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h2.293L8.146 1.354a.5.5 0 0 1 .708-.708L11 2.793V.5a.5.5 0 0 1 .5-.5z" />
                                            <path d="M11.5 16a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-2.293l2.147 2.146a.5.5 0 0 1-.708.708L11 13.207v2.293a.5.5 0 0 1-.5.5z" />
                                            <path d="M4.5 0a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1H5.207L7.354 1.854a.5.5 0 1 0-.708-.708L4.5 2.793V.5a.5.5 0 0 0-.5-.5z" />
                                            <path d="M4.5 16a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h2.293L1.146 15.146a.5.5 0 0 0 .708.708L4 13.707v2.293a.5.5 0 0 0 .5.5z" />
                                        </svg>
                                        <span className="text-gray-300 text-sm">{entry.branch}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(entry.status)}`}>
                                            {entry.status}
                                        </span>
                                        <span className="text-gray-500 text-xs">{entry.statusTime}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{entry.avatarUrl}</span>
                                        <span className="text-gray-300 text-sm">{entry.author}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="text-sm">
                                        <code className="text-purple-400 font-mono">{entry.commit}</code>
                                        <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">
                                            {entry.commitMessage}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onView(entry)}
                                            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(entry)}
                                            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(entry.id)}
                                            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
