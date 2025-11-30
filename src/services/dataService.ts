import { httpsCallable } from 'firebase/functions';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { functions, db } from './firebase';
import type { WebsiteData } from '../types';

/**
 * Fetch website data directly from Firestore (faster fallback)
 */
const fetchDirectFromFirestore = async (projectId: string): Promise<WebsiteData> => {
    const configRef = doc(db, 'projects', projectId, 'website', 'config');
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
        throw new Error('Website configuration not found');
    }

    const data = configSnap.data();

    // Fetch services from subcollection with error handling
    let servicesArray: any[] = [];
    try {
        const servicesRef = collection(db, 'projects', projectId, 'services');
        const servicesSnap = await getDocs(servicesRef);
        servicesArray = servicesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log('📦 Fetched services from subcollection:', servicesArray);
    } catch (servicesError) {
        console.warn('⚠️ Could not fetch services from subcollection:', servicesError);
        // Try fallback to services.items in config
        servicesArray = data.services?.items || [];
    }

    // Map SuperAdmin data structure to user-template3 expected structure
    return {
        niche: data.niche || null, // Add niche support
        homepage: {
            heroHeading: data.homepage?.heroHeading || '',
            heroSubtext: data.homepage?.heroSubtext || data.homepage?.heroTagline || '', // New field, fallback to old
            heroImageUrl: data.homepage?.heroImageUrl || data.homepage?.heroImage || '', // New single hero image
            ctaText: data.homepage?.ctaText || '', // Add CTA buttons
            cta2Text: data.homepage?.cta2Text || '',
            // Map portfolioItems to heroSlides (keep for backward compatibility)
            heroSlides: (data.homepage?.portfolioItems || [])
                .filter((item: any) => item.status === 'active') // Only show active slides
                .map((item: any) => ({
                    id: item.slide_id || `slide-${Date.now()}`,
                    title: item.title || '',
                    content: item.description || '',
                    imageUrl: item.image || ''
                })),
            testimonials: data.homepage?.testimonials || []
        },
        // Use services from subcollection
        services: servicesArray.map((service: any) => ({
            ...service,
            shortDesc: service.shortDesc || service.description?.substring(0, 100) || ''
        })),
        // Add new wizard fields
        pricingTiers: data.pricingTiers || [],
        reviews: data.reviews || data.homepage?.testimonials || [], // Support both locations
        faqs: data.faqs || data.homepage?.faqs || [], // Support both locations
        about: data.about || {},
        contact: {
            ...data.contact,
            customFields: data.contact?.customFields || [], // Add custom fields support
            socialMedia: data.contact?.socialMedia || data.socialMedia || {} // Check both locations
        },
        settings: {
            businessName: data.settings?.businessName || data.settings?.siteName || 'My Business',
            websiteTitle: data.settings?.websiteTitle || data.settings?.seoTitle || 'Welcome',
            primaryColor: data.settings?.primaryColor || '#0066FF',
            secondaryColor: data.settings?.secondaryColor || '#FFCC00',
            gradientType: data.settings?.gradientType || 'linear', // Add gradient type
            logoUrl: data.settings?.logoUrl || data.settings?.logo || '',
            faviconUrl: data.settings?.faviconUrl || data.settings?.favicon || ''
        },
        seo: {
            metaTitle: data.seo?.metaTitle || data.settings?.seoTitle || '',
            metaDescription: data.seo?.metaDescription || data.settings?.seoDescription || '',
            keywords: data.seo?.keywords || data.settings?.seoKeywords || []
        },
        socialMedia: data.socialMedia || data.contact?.socialMedia || {},
        theme: {
            name: data.theme?.name || 'default',
            colors: {
                primary: data.settings?.primaryColor || data.theme?.colors?.primary || '#0066FF',
                secondary: data.settings?.secondaryColor || data.theme?.colors?.secondary || '#FFCC00',
                accent: data.theme?.colors?.accent || '#FF6B6B',
                background: data.theme?.colors?.background || '#FFFFFF',
                text: data.theme?.colors?.text || '#1a1a1a',
                textLight: data.theme?.colors?.textLight || '#666666'
            }
        },
        whatsapp: data.whatsapp || { phoneNumber: data.contact?.whatsapp || '' },
        header: data.header || {},
        selectedTemplate: data.selectedTemplate
    } as WebsiteData;
};

/**
 * Main function to fetch website data
 * Tries Firestore first (faster), falls back to Cloud Function
 */
export const fetchWebsiteData = async (): Promise<WebsiteData> => {
    try {
        const projectId = import.meta.env.VITE_PROJECT_ID;

        console.log('🔍 Project ID:', projectId);
        console.log('🔍 All env vars:', import.meta.env);

        if (!projectId) {
            throw new Error('No project ID configured. Please set VITE_PROJECT_ID environment variable.');
        }

        // Try direct Firestore access first (faster)
        try {
            console.log('📊 Attempting direct Firestore access...');
            const data = await fetchDirectFromFirestore(projectId);
            console.log('✅ Data loaded from Firestore:', data);
            return data;
        } catch (firestoreError: any) {
            console.warn('⚠️ Firestore access failed, trying Cloud Function:', firestoreError.message);
            console.warn('⚠️ Firestore error stack:', firestoreError.stack);

            // Fallback to Cloud Function
            console.log('☁️ Calling Cloud Function getWebsiteData...');
            const getWebsiteData = httpsCallable(functions, 'getWebsiteData');
            const result = await getWebsiteData({ projectId });

            console.log('📦 Raw Cloud Function result:', result);
            console.log('📦 result.data type:', typeof result.data);
            console.log('📦 result.data:', result.data);

            // Handle different response structures
            // Sometimes the response is: result.data = {success, data}
            // Sometimes it's: result.data = {result: {success, data}}
            let response: any = result.data;

            // Check if response is wrapped in a 'result' object
            if (response && response.result && typeof response.result === 'object') {
                console.log('📦 Response has nested result object, unwrapping...');
                response = response.result;
            }

            console.log('📦 Final response object:', response);
            console.log('📦 Response.success:', response?.success);
            console.log('📦 Response.data:', response?.data);

            // Check if response has the expected structure
            if (!response) {
                console.error('❌ Response is null or undefined');
                throw new Error('Cloud Function returned null response');
            }

            if (!response.success) {
                console.error('❌ Response.success is false or missing');
                throw new Error('Cloud Function returned unsuccessful response');
            }

            if (!response.data) {
                console.error('❌ Response.data is missing');
                throw new Error('No website data found in Cloud Function response');
            }

            console.log('✅ Data loaded from Cloud Function');
            console.log('✅ Returning data:', response.data);
            return response.data as WebsiteData;
        }
    } catch (error: any) {
        console.error('❌ Error fetching website data:', error);
        console.error('❌ Error stack:', error.stack);

        // Provide helpful error message
        const errorMessage = error.message.includes('Website configuration not found') ||
            error.message.includes('No website data found')
            ? 'No website data found in Firebase. Please configure your website in the admin panel.'
            : `Failed to load website data: ${error.message}`;

        throw new Error(errorMessage);
    }
};
