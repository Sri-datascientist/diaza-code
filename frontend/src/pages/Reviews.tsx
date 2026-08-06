import { useState } from "react";
import { Star, Quote, User, UserCheck } from "lucide-react";
// Using S3 image for hero background
const luxuryLivingRoom = "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Ai+generated-20251016T014813Z-1-001/Ai+generated/WOOD+HOME/LIVING+%26+DINING/Living+corner.png";
import { DecorativeDivider1, DecorativeDivider2 } from "@/components/Decorative";

interface Testimonial {
  id: number;
  name: string;
  initials: string;
  gender: 'male' | 'female';
  projectType: string;
  rating: number;
  review: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sangamitra",
    initials: "S",
    gender: "female",
    projectType: "Indian Traditional Aesthetics Project",
    rating: 5,
    review: "Finding designers who could bring out Indian traditional aesthetics within our budget felt impossible. Di-Aza's cost-effectiveness was refreshing - they were more careful with our budget than we were! Their transparency in the process, payments, and design decisions built so much trust. We're halfway through and it's already looking beautiful. Would definitely recommend Di-Aza to others.",
    date: "January 2025"
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    gender: "female",
    projectType: "Modern Apartment Renovation",
    rating: 5,
    review: "Di-Aza Studio transformed our outdated apartment into a stunning modern sanctuary. Their attention to detail and ability to understand our vision was exceptional. We couldn't be happier with the results!",
    date: "March 2024"
  },
  {
    id: 3,
    name: "Arjun Singh",
    initials: "AS",
    gender: "male",
    projectType: "Luxury Villa Interior",
    rating: 5,
    review: "Working with Di-Aza was an absolute pleasure. They brought elegance and sophistication to every corner of our villa. The team's professionalism and creative vision exceeded all our expectations.",
    date: "February 2024"
  },
  {
    id: 4,
    name: "Kavya Reddy",
    initials: "KR",
    gender: "female",
    projectType: "Contemporary Home Interior",
    rating: 5,
    review: "Our home has been completely transformed! Di-Aza created an environment that's both functional and beautiful. Our family feels more comfortable and inspired in this stunning new space.",
    date: "January 2024"
  },
  {
    id: 5,
    name: "Rahul Kumar",
    initials: "RK",
    gender: "male",
    projectType: "Classic Home Restoration",
    rating: 4,
    review: "Di-Aza Studio helped us restore our historic home while adding modern comforts. They balanced preservation with innovation beautifully. Highly recommend their expertise!",
    date: "December 2023"
  },
  {
    id: 6,
    name: "Ananya Patel",
    initials: "AP",
    gender: "female",
    projectType: "Minimalist Living Space",
    rating: 5,
    review: "The minimalist design Di-Aza created for us is simply perfect. Every element has purpose, and the space feels calm and inviting. Their design philosophy aligns perfectly with sustainable living.",
    date: "November 2023"
  },
  {
    id: 7,
    name: "Vikram Joshi",
    initials: "VJ",
    gender: "male",
    projectType: "Luxury Home Lobby Design",
    rating: 5,
    review: "Di-Aza designed our home's entrance lobby and it has become the talk of our neighborhood. Visitors constantly compliment the sophisticated ambiance. Their work has truly elevated our home's welcoming atmosphere.",
    date: "October 2023"
  },
  {
    id: 8,
    name: "Sneha Gupta",
    initials: "SG",
    gender: "female",
    projectType: "Penthouse Suite Design",
    rating: 4,
    review: "Our penthouse now feels like a five-star resort. Di-Aza's ability to maximize natural light and create flowing spaces is remarkable. We love entertaining in our beautifully designed home.",
    date: "September 2023"
  },
  {
    id: 9,
    name: "Rajesh Mehta",
    initials: "RM",
    gender: "male",
    projectType: "Family Home Interior Redesign",
    rating: 5,
    review: "Since Di-Aza redesigned our family home, we've seen a complete transformation in our daily living experience. The ambiance they created is exactly what we envisioned for our family. True design excellence!",
    date: "August 2023"
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" data-testid={`star-rating-${rating}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? "fill-[#8B7355] text-[#8B7355]"
              : "fill-none text-[#D4C4B0]"
          }`}
          data-testid={`star-${star <= rating ? "filled" : "empty"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="bg-white rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative group"
      data-testid={`review-card-${testimonial.id}`}
    >
      {/* Quote Icon */}
      <Quote
        className="absolute top-6 right-6 w-12 h-12 text-[#8B7355] opacity-10 group-hover:opacity-20 transition-opacity"
        data-testid="icon-quote"
      />

      {/* Avatar and Name Section */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B7355] to-[#A89080] flex items-center justify-center border-2 border-[#8B7355]"
          data-testid={`avatar-${testimonial.id}`}
        >
          {testimonial.gender === 'male' ? (
            <User className="w-8 h-8 text-white" />
          ) : (
            <UserCheck className="w-8 h-8 text-white" />
          )}
        </div>
        <div>
          <h3
            className="font-playfair text-xl font-semibold text-[#3D3D3D] mb-1"
            data-testid={`name-${testimonial.id}`}
          >
            {testimonial.name}
          </h3>
          <p
            className="font-inria text-sm text-[#8B7355]"
            data-testid={`project-type-${testimonial.id}`}
          >
            {testimonial.projectType}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review Text */}
      <p
        className="font-inria text-base leading-relaxed text-[#4A4A4A] mb-4"
        data-testid={`review-text-${testimonial.id}`}
      >
        "{testimonial.review}"
      </p>

      {/* Date */}
      <p
        className="font-inria text-sm text-[#999] italic"
        data-testid={`review-date-${testimonial.id}`}
      >
        {testimonial.date}
      </p>
    </div>
  );
}

export default function Reviews() {
  const [displayCount, setDisplayCount] = useState(6);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredTestimonials = filterRating
    ? testimonials.filter((t) => t.rating === filterRating)
    : testimonials;

  const displayedTestimonials = filteredTestimonials.slice(0, displayCount);

  const averageRating = (
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
  ).toFixed(1);

  const totalReviews = testimonials.length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden h-[400px]">
        <div className="absolute inset-0 z-0">
          <img
            src={luxuryLivingRoom}
            alt="Interior design background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(61,61,61,0.5)]" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <h1
            className="text-center font-playfair text-5xl sm:text-6xl lg:text-[72px] leading-tight lg:leading-[80px] tracking-[0.1em] text-white font-normal"
            data-testid="text-reviews-hero-title"
          >
            CLIENT REVIEWS
          </h1>
        </div>
      </section>

      {/* Reviews Content Section */}
      <section className="bg-[#FFFAEF] py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Average Rating Display */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span
                  className="font-playfair text-6xl font-bold text-[#8B7355]"
                  data-testid="text-average-rating"
                >
                  {averageRating}
                </span>
                <div>
                  <StarRating rating={Math.round(parseFloat(averageRating))} />
                  <p
                    className="font-inria text-sm text-[#666] mt-1"
                    data-testid="text-total-reviews"
                  >
                    Based on {totalReviews} reviews
                  </p>
                </div>
              </div>
              <p className="font-inria text-lg text-[#4A4A4A] max-w-2xl mx-auto">
                Discover why our clients trust us to transform their spaces into works of art
              </p>
            </div>
          </div>

          <DecorativeDivider1 />

          {/* Filter Options */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={() => setFilterRating(null)}
              className={`px-6 py-2 rounded-full font-inria text-sm transition-all ${
                filterRating === null
                  ? "bg-[#8B7355] text-white"
                  : "bg-white text-[#8B7355] hover:bg-[#F5F0E8]"
              }`}
              data-testid="filter-all"
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-6 py-2 rounded-full font-inria text-sm transition-all flex items-center gap-2 ${
                filterRating === 5
                  ? "bg-[#8B7355] text-white"
                  : "bg-white text-[#8B7355] hover:bg-[#F5F0E8]"
              }`}
              data-testid="filter-5-stars"
            >
              <Star className="w-4 h-4 fill-current" />5 Stars
            </button>
            <button
              onClick={() => setFilterRating(4)}
              className={`px-6 py-2 rounded-full font-inria text-sm transition-all flex items-center gap-2 ${
                filterRating === 4
                  ? "bg-[#8B7355] text-white"
                  : "bg-white text-[#8B7355] hover:bg-[#F5F0E8]"
              }`}
              data-testid="filter-4-stars"
            >
              <Star className="w-4 h-4 fill-current" />4 Stars
            </button>
          </div>

          {/* Reviews Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            data-testid="reviews-grid"
          >
            {displayedTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ReviewCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {displayCount < filteredTestimonials.length && (
            <div className="text-center">
              <DecorativeDivider2 />
              <button
                onClick={() => setDisplayCount(displayCount + 3)}
                className="mt-8 px-10 py-4 bg-[#8B7355] text-white font-inria text-lg rounded-full hover:bg-[#75604A] transition-all hover:scale-105 shadow-md hover:shadow-lg"
                data-testid="button-load-more"
              >
                Load More Reviews
              </button>
            </div>
          )}

          {/* Closing Message */}
          {displayCount >= filteredTestimonials.length && (
            <div className="text-center mt-12">
              <DecorativeDivider2 />
              <p
                className="font-inria text-lg text-[#8B7355] mt-8"
                data-testid="text-end-message"
              >
                Thank you for reading our client testimonials
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
