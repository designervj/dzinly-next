export interface ThemeType {
    _id?: string; // MongoDB ObjectId as string
    id: string;
    name: string;
    description: string;
    colors: string[];
    font: string;
    active: boolean;
    cssVariables: Record<string, string>;
    globalCSS: string;
    isSystemTheme?: boolean; // Optional: indicates if it's a built-in theme
    createdAt?: Date | string; // Can be Date object or ISO string
    updatedAt?: Date | string; // Can be Date object or ISO string
}