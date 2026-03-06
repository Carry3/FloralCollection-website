import HeroMontage from "@/components/homepage/HeroMontage";
import HeroShrinkWrapper from "@/components/homepage/HeroShrinkWrapper";
import PackageColumns from "@/components/homepage/PackageColumns";
import Guarantees from "@/components/homepage/Guarantees";
import ContactDark from "@/components/homepage/ContactDark";

export default function HomePage() {
  return (
    <>
      <HeroShrinkWrapper>
        <HeroMontage />
      </HeroShrinkWrapper>
      <PackageColumns />
      <Guarantees />
      <ContactDark />
    </>
  );
}
