"use client"
import { setPageEdit } from '@/hooks/slices/pageEditSlice';
import { AppDispatch, RootState } from '@/store/store';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";



const Refreshpage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.user)
    const { page: editPageData, hasfetchPage } = useSelector((state: RootState) => state.pageEdit)

    const pathName = usePathname();
    const slug = pathName.split("/").pop();

    // State to store current website ID from API
    const [currentWebsiteId, setCurrentWebsiteId] = React.useState<string | null>(null);

 

    // Fetch current website ID from session API
    useEffect(() => {
        const fetchCurrentWebsite = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/session/website`);
                if (res.ok) {
                    const data = await res.json();
                    setCurrentWebsiteId(data.websiteId);
                }
            } catch (error) {
                console.error("Error fetching current website:", error);
            }
        };

        fetchCurrentWebsite();
    }, []);

    useEffect(() => {

        if (!hasfetchPage &&
            user?.tenantId &&
            slug &&
            currentWebsiteId
        ) {
            fetchPageData();
        }
    }, [hasfetchPage, currentWebsiteId, slug, user])

    const fetchPageData = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/public/pages?slug=${slug}&tenantId=${user?.tenantId}`, {
                method: 'GET',
                cache: 'no-store' // Ensure fresh data on each request
            });
            if (res.ok) {
                const data = await res.json();
                dispatch(setPageEdit(data.item));
            }
        } catch (error: any) {
            toast.error("Error fetching page data:", error);
        }
    }

    return (
        null
    )
}

export default Refreshpage