'use client';

import NextTopLoader from 'nextjs-toploader';

export default function TopLoader() {
    return (
        <NextTopLoader
            color="#46b94e"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #46b94e,0 0 5px #46b94e"
        />
    );
}