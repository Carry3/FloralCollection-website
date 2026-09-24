import HeroMontage from "@/components/homepage/HeroMontage";
import HeroShrinkWrapper from "@/components/homepage/HeroShrinkWrapper";
import ServicesIntro from "@/components/homepage/ServicesIntro";
import WeddingPackages from "@/components/homepage/WeddingPackages";
import Comments from "@/components/homepage/Comments";
import ContactDark from "@/components/homepage/ContactDark";
import { TESTIMONIALS } from "@/lib/testimonials";

export default function HomePage() {
  return (
    <>
      <HeroShrinkWrapper>
        <HeroMontage />
      </HeroShrinkWrapper>
      <ServicesIntro />
      <WeddingPackages />
      <Comments comments={TESTIMONIALS} />
      <ContactDark />
    </>
  );
}
