"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PageRendererProps {
    slug?: string;
}

export default function PageRenderer({ slug }: PageRendererProps) {
    const params = useParams();
    const pageSlug = slug || params?.slug as string;

    const [pageData, setPageData] = useState<{
        html: string;
        css: string;
        title: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/grapejs-pages?slug=${pageSlug}`);

                if (!response.ok) {
                    throw new Error('Page not found');
                }

                const result = await response.json();

                if (result.success && result.data) {
                    setPageData({
                        html: result.data.html,
                        css: result.data.css,
                        title: result.data.title,
                    });
                } else {
                    throw new Error('Invalid page data');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load page');
            } finally {
                setLoading(false);
            }
        };

        if (pageSlug) {
            fetchPage();
        }
    }, [pageSlug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading page...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-destructive mb-4">Error</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                    <p className="text-muted-foreground">The requested page could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: pageData.css }} />
            <div
                className="grapejs-rendered-page"
                dangerouslySetInnerHTML={{ __html: pageData.html }}
            />
        </>
    );
}
