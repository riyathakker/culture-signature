import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const reviews = [
  {
    id: 1,
    author: "Isabella R.",
    date: "February 12, 2026",
    rating: 5,
    title: "Breathtaking Artistry",
    content: "The way the light catches the diamonds in this ring is simply magical. It's much more substantial than it looks in the photos. The craftsmanship is evident in every detail.",
  },
  {
    id: 2,
    author: "Marcus T.",
    date: "January 28, 2026",
    rating: 5,
    title: "The Perfect Anniversary Gift",
    content: "My wife was speechless. The packaging itself was a work of art. Customer service was excellent throughout the custom sizing process.",
  },
];

export function ProductReviews() {
  return (
    <div className="py-20 border-t">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Rating Summary */}
        <div className="space-y-8">
          <h3 className="font-heading text-3xl">Client Experiences</h3>
          <div className="flex items-center gap-6">
            <span className="text-6xl font-heading">4.9</span>
            <div className="space-y-1">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Based on 48 Reviews</p>
            </div>
          </div>
          
          <div className="space-y-3 pt-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-4">
                <span className="text-xs font-bold w-3">{rating}</span>
                <Progress value={rating === 5 ? 90 : rating === 4 ? 8 : 2} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-8">({rating === 5 ? 42 : rating === 4 ? 4 : 2})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-12">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-current" : "opacity-30")} />
                    ))}
                  </div>
                  <h4 className="font-heading text-xl">{review.title}</h4>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{review.date}</span>
              </div>
              <p className="font-serif italic text-muted-foreground text-lg leading-relaxed">
                "{review.content}"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                  {review.author[0]}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold">{review.author}</span>
              </div>
            </div>
          ))}
          
          <button className="text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-primary pb-1 hover:opacity-70 transition-opacity">
            Read All 48 Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
