import PackagePage, { packageMetadata } from "@/components/packages/PackagePage";

export const metadata = packageMetadata("grand");

export default function GrandCollectionPage() {
    return <PackagePage id="grand" />;
}
