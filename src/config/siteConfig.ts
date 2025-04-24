export interface SiteConfig {
  business: {
    name: string;
    location: string;
    email: string;
    phone: string;
    description: string;
  };
  about: {
    title: string;
    content: string;
    mission: string;
    vision: string;
    experience: string;
    image: string;
  };
  services: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      quote: string;
      name: string;
      role: string;
      image: string;
    }>;
  };
  contact: {
    title: string;
    description: string;
  };
}

export const defaultConfig: SiteConfig = {
  business: {
    name: "[Business Name]",
    location: "[Business Location]",
    email: "contact@business.com",
    phone: "(123) 456-7890",
    description: "Transforming ideas into exceptional digital experiences"
  },
  about: {
    title: "About Us",
    content: "We are a dedicated team of professionals committed to delivering exceptional services. Our mission is to provide innovative solutions that help businesses grow and succeed in today's competitive market.",
    mission: "To deliver exceptional value through innovative solutions",
    vision: "To be the leading provider of digital solutions",
    experience: "10+",
    image: "https://placehold.co/600x400"
  },
  services: {
    title: "Our Services",
    items: [
      {
        title: "Web Development",
        description: "Custom website development tailored to your business needs, using the latest technologies and best practices."
      },
      {
        title: "Digital Marketing",
        description: "Comprehensive digital marketing strategies to help your business reach its target audience and achieve growth."
      },
      {
        title: "Business Consulting",
        description: "Expert business consulting services to help you optimize operations and maximize your business potential."
      }
    ]
  },
  testimonials: {
    title: "What Our Clients Say",
    items: [
      {
        quote: "Working with this team has been an absolute pleasure. They delivered exceptional results that exceeded our expectations.",
        name: "John Smith",
        role: "CEO, Tech Solutions",
        image: "https://placehold.co/100x100"
      },
      {
        quote: "The level of professionalism and expertise demonstrated throughout our project was outstanding. Highly recommended!",
        name: "Sarah Johnson",
        role: "Marketing Director, Innovate Inc",
        image: "https://placehold.co/100x100"
      },
      {
        quote: "Their attention to detail and commitment to quality made all the difference in our project's success.",
        name: "Michael Brown",
        role: "Founder, StartupX",
        image: "https://placehold.co/100x100"
      }
    ]
  },
  contact: {
    title: "Get in Touch",
    description: "Have a question or want to work together? We'd love to hear from you!"
  }
}; 