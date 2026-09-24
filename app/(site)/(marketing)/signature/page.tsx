import PackagePage, { packageMetadata } from "@/components/packages/PackagePage";

export const metadata = packageMetadata("signature");

export default function SignatureCollectionPage() {
    return <PackagePage id="signature" />;
}
