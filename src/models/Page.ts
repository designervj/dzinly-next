// import mongoose, { Schema, Document } from 'mongoose';

// export interface IPage extends Document {
//     tenantId: string;
//     slug: string;
//     title: string;
//     description?: string;
//     html: string;
//     css: string;
//     components: any; // GrapeJS components JSON
//     styles: any; // GrapeJS styles JSON
//     assets: any[]; // GrapeJS assets
//     isPublished: boolean;
//     metaTags?: {
//         title?: string;
//         description?: string;
//         keywords?: string;
//         ogImage?: string;
//     };
//     createdBy: string;
//     updatedBy: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

// const PageSchema: Schema = new Schema(
//     {
//         tenantId: {
//             type: String,
//             required: true,
//             index: true,
//         },
//         slug: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true,
//         },
//         title: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         description: {
//             type: String,
//             trim: true,
//         },
//         html: {
//             type: String,
//             required: true,
//         },
//         css: {
//             type: String,
//             default: '',
//         },
//         components: {
//             type: Schema.Types.Mixed,
//             required: true,
//         },
//         styles: {
//             type: Schema.Types.Mixed,
//             default: [],
//         },
//         assets: {
//             type: [Schema.Types.Mixed],
//             default: [],
//         },
//         isPublished: {
//             type: Boolean,
//             default: false,
//         },
//         metaTags: {
//             title: String,
//             description: String,
//             keywords: String,
//             ogImage: String,
//         },
//         createdBy: {
//             type: String,
//             required: true,
//         },
//         updatedBy: {
//             type: String,
//             required: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// // Compound index for tenant and slug
// PageSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

// export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
