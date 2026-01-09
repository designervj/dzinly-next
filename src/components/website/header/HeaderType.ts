import { ObjectId } from "mongodb";

export interface IHeader  {
    name: string;
    slug: string;
    html: string;
    css: string;
    components: object;
    styles: object;
    tenantId: string| ObjectId;
    websiteId: string| ObjectId;
    isActive: boolean;
    metadata: {
        logoText?: string;
        showSearch?: boolean;
        showNotification?: boolean;
        showProfile?: boolean;
        theme?: "light" | "dark";
        customSettings?: Record<string, any>;
    };
    createdAt: Date;
    updatedAt: Date;
}
