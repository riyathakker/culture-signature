import { HomePageContainer } from "@/components/common/HomePageContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AboutPage() {
  const ourValues = [
    { title: "Creative Designs", desc: "Unique and enchanting jewelry that captures the imagination." },
    { title: "Unwavering Integrity", desc: "Upholding transparency and ethical practices in every transaction." },
    { title: "Master Perfection", desc: "Pursuing excellence in every handcrafted detail." },
    { title: "Eco Responsibility", desc: "Committed to sustainability and ethical sourcing of materials." },
    { title: "Respectful Bonds", desc: "Fostering positive connections with our artisans and clients." },
    { title: "Global Delight", desc: "Anticipating desires and fulfilling cultural preferences worldwide." },
  ]

  const aboutCards = [
    {
      title: "Our Vision",
      description:
        "To globally delight our clients with uniquely crafted jewelry, anticipating and fulfilling their diverse needs and cultural preferences.",
    },
    {
      title: "Our Mission",
      description:
        "Empowering women, celebrating their uniqueness, and inspiring them to embrace their true selves while preserving Indian heritage.",
    },
    {
      title: "Our Legacy",
      description:
        "Pursuing perfection in every handcrafted piece, ensuring that every Culture Signature creation is a masterpiece of its own.",
    },
  ];
  return (
    <HomePageContainer label="About Us" heading="Crafting Legacy Since 2013" description="Where elegance and functionality intertwine to create timeless artisanal masterpieces.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">

          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <SectionHeader>The Visionary</SectionHeader>

            <h3 className="text-4xl md:text-5xl font-heading text-primary leading-tight">
              Jalpa Thakkar
            </h3>

            <div className="prose prose-luxury space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed font-serif italic">
                "Culture Signature was born from a desire to celebrate the
                unique essence of every woman while honoring the rich heritage
                of Indian artistry."
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Founded in 2013, Culture Signature is more than a brand;
                it's a movement. We specialize in handcrafted jewelry and
                bags that serve as a testament to the meticulous skill of
                Indian artisans.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-[3/4] w-full max-w-[380px] max-h-[500px] bg-secondary/10 overflow-hidden rounded-sm group">
              <img
                src="./Founder.jpeg"
                alt="Jalpa Thakkar"
                className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="
                group
                p-10
                rounded-sm
                border border-primary/5
                bg-secondary/5
                text-center
                space-y-6
                transition-all
                duration-500
                hover:bg-primary/5
                hover:border-primary/10
                hover:shadow-md
                hover:scale-100
              "
            >
              <h4 className="font-heading text-2xl text-primary">
                {card.title}
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed font-serif italic">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Our Core Pillars</h2>
            <h3 className="text-4xl font-heading">The Values We Live By</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {ourValues.map((value, i) => (
              <div key={i} className="space-y-3 border-l border-primary/20 pl-6">
                <h5 className="font-heading text-xl text-primary">{value.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
    </HomePageContainer>
  );
}
