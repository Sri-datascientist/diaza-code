import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// Using S3 image for hero background
const contactHeroImage = "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Ai+generated-20251016T014813Z-1-001/Ai+generated/WOOD+HOME/KITCHEN/u7846341386_Prompt_Luxury_compact_kitchen_in_Bangalore_apartmen_2a262666-a09b-433b-a74f-aada6a84bdbe.png";
import { DecorativeDivider1 } from "@/components/Decorative";
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
import { Mail } from "lucide-react";

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  queries: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      queries: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return await apiRequest("POST", "/api/public/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative w-full overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px]"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={contactHeroImage}
            alt="Interior design contact background"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-[rgba(61,61,61,0.5)]"
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <h1 
            className="text-center font-playfair text-4xl sm:text-5xl lg:text-[72px] leading-tight lg:leading-[80px] tracking-[0.1em] text-white font-normal animate-fade-in"
            data-testid="text-contact-hero-title"
          >
            CONTACT US
          </h1>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-[#FFFAEF] py-12 sm:py-16 lg:py-20">
        <DecorativeDivider1 />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 sm:mt-16">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Heading and Contact Info */}
            <div className="animate-fade-up">
              <h2 
                className="mb-8 sm:mb-12 font-playfair text-3xl sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] text-[#3D3D3D] font-normal"
                data-testid="text-contact-form-title"
              >
                Tell us About your Project
              </h2>
              <p className="text-[#3D3D3D] mb-8 font-inria leading-relaxed">
                Ready to transform your space into something extraordinary? Share your vision with us and let our expert design team bring your dream interior to life. Whether it's a complete home makeover, office renovation, or a single room transformation, we're here to make it happen.
              </p>

              {/* Contact Info Box */}
              <div className="border border-[#3D3D3D] rounded-[20px] p-6 inline-block">
                <h3 className="text-[#3D3D3D] font-playfair text-xl mb-4" data-testid="text-different-questions">
                  You have different questions?
                </h3>
                <p className="text-sm text-[#3D3D3D] mb-3 font-inria">
                  Or you can email us if you have any <br />
                  questions. We are here to help!
                </p>
                <div className="flex items-center gap-2">
                  <div className="bg-black rounded-full p-2">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <a 
                    href="mailto:connect@diazastudio.com" 
                    className="text-[#3D3D3D] font-inria"
                    data-testid="link-contact-email"
                  >
                    connect@diazastudio.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#3D3D3D] font-inria">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                              className="bg-white border-gray-300 font-inria"
                              data-testid="input-contact-firstname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#3D3D3D] font-inria">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                              className="bg-white border-gray-300 font-inria"
                              data-testid="input-contact-lastname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#3D3D3D] font-inria">Email address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                              className="bg-white border-gray-300 font-inria"
                              data-testid="input-contact-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#3D3D3D] font-inria">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your Subject"
                              {...field}
                              className="bg-white border-gray-300 font-inria"
                              data-testid="input-contact-subject"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="queries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#3D3D3D] font-inria">Queries</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your Message"
                            className="min-h-[150px] bg-white border-gray-300 font-inria"
                            {...field}
                            data-testid="input-contact-queries"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={contactMutation.isPending}
                      className="w-full sm:w-auto px-12 sm:px-16 bg-black text-white hover:bg-black/90 hover:scale-105 transition-transform rounded-lg font-inria disabled:opacity-50"
                      data-testid="button-contact-submit"
                    >
                      {contactMutation.isPending ? "Sending..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        <DecorativeDivider1 />
      </section>
    </div>
  );
}
