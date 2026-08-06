import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import heroImage from "@assets/stock_images/about_hero_compact_bedroom.png";
import whatWeDoImage from "@assets/stock_images/what_we_do_living_corner.png";
import founderImage from "@assets/founder_1759774922910.png";
import { DecorativeDivider2, DecorativeDivider3 } from "@/components/Decorative";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function About() {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative w-full overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px]"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Interior design consultation" 
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-[rgba(61,61,61,0.5)]"
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <h1 
            className="text-center font-playfair text-4xl sm:text-5xl lg:text-[72px] leading-tight lg:leading-[80px] tracking-[0.1em] text-white font-normal animate-fade-in"
            data-testid="text-about-hero-title"
          >
            ABOUT US
          </h1>
        </div>
      </section>

      {/* What we do Section */}
      <section className="bg-[#FFFAEF] py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div 
              className="rounded-[20px] sm:rounded-[35px] overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px] animate-fade-up"
            >
              <img 
                src={whatWeDoImage}
                alt="Modern luxury interior design living room" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 
                className="mb-4 sm:mb-6 font-playfair text-3xl sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] text-[#8B7355] font-normal"
                data-testid="text-what-we-do-title"
              >
                What we do?
              </h2>
              <div className="space-y-4">
                <p 
                  className="text-lg leading-relaxed text-[#3D3D3D]"
                  data-testid="text-what-we-do-content"
                >
                  At Di-Aza Studio, we go beyond creating pretty interiors – we design <strong>life-proof homes</strong>. Our work is rooted in the belief that every space should offer psychological comfort, physical safety, spiritual flow, emotional harmony, and financial clarity.
                </p>
                <p 
                  className="text-lg leading-relaxed text-[#3D3D3D]"
                >
                  Through a blend of design expertise, storytelling, and mindful planning, we craft homes that reflect who you are while protecting how you live.
                </p>
                <p 
                  className="text-lg leading-relaxed text-[#3D3D3D]"
                >
                  From space planning and material selection to execution and site supervision, we ensure every detail supports your lifestyle – not just for today, but for years to come.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DecorativeDivider2 />

        {/* About the Founder Section */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 mt-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-fade-up order-2 md:order-1" style={{ animationDelay: '0.3s' }}>
              <h2 
                className="mb-4 sm:mb-6 font-playfair text-3xl sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] text-[#8B7355] font-normal"
                data-testid="text-founder-title"
              >
                About the Founder
              </h2>
              <div className="space-y-4">
                <p 
                  className="text-lg leading-relaxed text-[#3D3D3D]"
                  data-testid="text-founder-content"
                >
                  Rejula Basheer, Founder & Head of Design at Di-Aza Studio, is a former finance professional who turned her lifelong passion for interiors into a thriving design practice.
                </p>
                <p 
                  className="text-lg leading-relaxed text-[#3D3D3D]"
                >
                  After working with global firms like EY, Grant Thornton, and Informatica, she retrained in interior design at Vogue Institute of Design, blending her business acumen with creative vision.
                </p>
                <p 
                  className="text-lg leading-relaxed text-[#3D3D3D]"
                >
                  Her journey began with crafting terracotta jewellery and décor, which shaped her love for storytelling through design. In 2019, she established Di-Aza Studio, driven by a "Whole-istic" philosophy that balances aesthetics, durability, and psychological safety in a house.
                </p>
                <p 
                  className="text-lg leading-relaxed text-[#3D3D3D]"
                >
                  Known for her persuasive communication, sharp psychological insights, and soulful approach, she is dedicated to creating spaces that feel both meaningful and deeply personal.
                </p>
              </div>
            </div>

            <div 
              className="rounded-[20px] sm:rounded-[35px] overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px] animate-fade-up order-1 md:order-2"
              style={{ animationDelay: '0.4s' }}
            >
              <img 
                src={founderImage}
                alt="Rejula Basheer, Founder & Head of Design at Di-Aza Studio" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        <DecorativeDivider3 />

        {/* Tell us About your Project Section */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 mt-12 sm:mt-16 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <h2 
            className="text-center mb-8 sm:mb-12 font-playfair text-3xl sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] text-[#8B7355] font-normal"
            data-testid="text-project-form-title"
          >
            Tell us About your Project
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          data-testid="input-about-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          data-testid="input-about-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        data-testid="input-about-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your project..."
                        className="min-h-[150px]"
                        {...field}
                        data-testid="input-about-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="px-16 bg-[#8B7355] text-white hover:bg-[#8B7355]/90"
                  data-testid="button-about-submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
