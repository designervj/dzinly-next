// "use client";

// import { useState, useEffect } from 'react';
// import { DeploymentEntry } from '@/data/mockdata';
// import { X } from 'lucide-react';

// interface DeploymentEditModalProps {
//     entry: DeploymentEntry | null;
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (entry: DeploymentEntry) => void;
//     isNew?: boolean;
// }

// export default function DeploymentEditModal({
//     entry,
//     isOpen,
//     onClose,
//     onSave,
//     isNew = false
// }: DeploymentEditModalProps) {
//     const [formData, setFormData] = useState<DeploymentEntry>({
//         id: '',
//         name: '',
//         environment: 'Production',
//         branch: 'main',
//         status: 'Pending',
//         statusTime: '0s',
//         author: '',
//         commit: '',
//         commitMessage: '',
//         timestamp: new Date(),
//         avatarUrl: '🔵'
//     });

//     useEffect(() => {
//         if (entry) {
//             setFormData(entry);
//         } else if (isNew) {
//             setFormData({
//                 id: Date.now().toString(),
//                 name: '',
//                 environment: 'Production',
//                 branch: 'main',
//                 status: 'Pending',
//                 statusTime: '0s',
//                 author: '',
//                 commit: '',
//                 commitMessage: '',
//                 timestamp: new Date(),
//                 avatarUrl: '🔵'
//             });
//         }
//     }, [entry, isNew]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSave(formData);
//         onClose();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-6 border-b border-gray-800">
//                     <h2 className="text-xl font-bold text-white">
//                         {isNew ? 'Add New Deployment' : 'Edit Deployment'}
//                     </h2>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
//                     >
//                         <X className="w-5 h-5 text-gray-400" />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         {/* Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Name <span className="text-red-400">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 required
//                                 value={formData.name}
//                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="e.g., AJAXYYxD"
//                             />
//                         </div>

//                         {/* Environment */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Environment <span className="text-red-400">*</span>
//                             </label>
//                             <select
//                                 value={formData.environment}
//                                 onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             >
//                                 <option value="Production">Production</option>
//                                 <option value="Staging">Staging</option>
//                                 <option value="Development">Development</option>
//                             </select>
//                         </div>

//                         {/* Branch */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Branch <span className="text-red-400">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 required
//                                 value={formData.branch}
//                                 onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="e.g., main"
//                             />
//                         </div>

//                         {/* Status */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Status <span className="text-red-400">*</span>
//                             </label>
//                             <select
//                                 value={formData.status}
//                                 onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             >
//                                 <option value="Error">Error</option>
//                                 <option value="Ready">Ready</option>
//                                 <option value="Pending">Pending</option>
//                             </select>
//                         </div>

//                         {/* Author */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Author <span className="text-red-400">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 required
//                                 value={formData.author}
//                                 onChange={(e) => setFormData({ ...formData, author: e.target.value })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="e.g., designerv"
//                             />
//                         </div>

//                         {/* Commit Hash */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Commit Hash <span className="text-red-400">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 required
//                                 value={formData.commit}
//                                 onChange={(e) => setFormData({ ...formData, commit: e.target.value })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="e.g., 14e6d41"
//                             />
//                         </div>

//                         {/* Status Time */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Status Time
//                             </label>
//                             <input
//                                 type="text"
//                                 value={formData.statusTime}
//                                 onChange={(e) => setFormData({ ...formData, statusTime: e.target.value })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="e.g., 1m 13s"
//                             />
//                         </div>

//                         {/* Avatar */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-300 mb-2">
//                                 Avatar Emoji
//                             </label>
//                             <input
//                                 type="text"
//                                 value={formData.avatarUrl}
//                                 onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
//                                 className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="e.g., 🔴"
//                             />
//                         </div>
//                     </div>

//                     {/* Commit Message */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-2">
//                             Commit Message <span className="text-red-400">*</span>
//                         </label>
//                         <textarea
//                             required
//                             value={formData.commitMessage}
//                             onChange={(e) => setFormData({ ...formData, commitMessage: e.target.value })}
//                             className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//                             rows={3}
//                             placeholder="e.g., Merge pull request #26 from designerv/main"
//                         />
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
//                         >
//                             {isNew ? 'Add Deployment' : 'Save Changes'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }
