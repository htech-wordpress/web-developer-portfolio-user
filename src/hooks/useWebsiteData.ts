import { useState, useEffect } from 'react';
import type { WebsiteData } from '../types';
import { fetchWebsiteData } from '../services/dataService';

export const useWebsiteData = () => {
    const [data, setData] = useState<WebsiteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const websiteData = await fetchWebsiteData();
                setData(websiteData);
            } catch (err: any) {
                setError(err.message || 'Failed to load website data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, loading, error };
};
