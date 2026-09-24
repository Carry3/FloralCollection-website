import PackagePage, { packageMetadata } from "@/components/packages/PackagePage";

export const metadata = packageMetadata("luxe");

export default function LuxeCollectionPage() {
    return <PackagePage id="luxe" />;
}
