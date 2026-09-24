import PackagePage, { packageMetadata } from "@/components/packages/PackagePage";

export const metadata = packageMetadata("classic");

export default function ClassicCollectionPage() {
    return <PackagePage id="classic" />;
}
