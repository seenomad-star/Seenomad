
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
    question: string;
    answer: string;
}

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    faqs?: FAQItem[];
    schema?: object;
}

const BASE_URL = 'https://typingos.com';

export const SEOHead: React.FC<SEOHeadProps> = ({
    title = "Free Typing Speed Test Online | TypingOS",
    description = "Take a free typing speed test online. Improve your WPM and accuracy with interactive lessons, real-time performance tracking, and AI-powered coaching. Practice for SSC, Railway, and Banking exams.",
    keywords = "free typing speed test, typing test online, wpm calculator, words per minute test, typing practice online, ssc typing test, railway typing exam, touch typing, hindi typing test, improve typing speed",
    image = `${BASE_URL}/og-image.png`,
    url = typeof window !== 'undefined' ? `${BASE_URL}${window.location.pathname}` : BASE_URL,
    type = "website",
    author = "TypingOS",
    publishedTime,
    modifiedTime,
    faqs,
    schema,
}) => {
    const siteTitle = title.includes("TypingOS") ? title : `${title} | TypingOS`;
    const canonicalUrl = url.replace(/#.*$/, ''); // strip any hash just in case

    const faqSchema = faqs && faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="title" content={siteTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="TypingOS" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Article Specific Tags */}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

            {/* Canonical Link — always clean, no hash */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Custom JSON-LD schema (e.g. WebApplication) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}

            {/* FAQ Schema */}
            {faqSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            )}
        </Helmet>
    );
};
