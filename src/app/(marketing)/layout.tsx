import { ReactNode, Suspense } from 'react'
import { GlobalHeader, GlobalFooter } from "@/components/GlobalHeaderFooter";

export default function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Suspense fallback={null}>
                <GlobalHeader />
            </Suspense>
            {children}
            <Suspense fallback={null}>
                <GlobalFooter />
            </Suspense>
        </>
    )
}
