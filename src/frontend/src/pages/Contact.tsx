import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetContactInfo } from "../hooks/useQueries";

export default function Contact() {
  const { data: contactInfo } = useGetContactInfo();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", phone: "", email: "", message: "" });
    setSubmitting(false);
  };

  const info = [
    {
      icon: Phone,
      label: "PHONE",
      value: contactInfo?.phone ?? "+1 (555) 987-6543",
    },
    {
      icon: MapPin,
      label: "ADDRESS",
      value: contactInfo?.address ?? "42 Industrial Ave, Steel City, TX 75001",
      link: contactInfo?.mapLink,
    },
    {
      icon: Mail,
      label: "EMAIL",
      value: contactInfo?.email ?? "info@ironcraft.com",
    },
    {
      icon: Clock,
      label: "WORKING HOURS",
      value: contactInfo?.workingHours ?? "Mon–Fri: 8AM–6PM | Sat: 9AM–3PM",
    },
  ];

  return (
    <main className="pt-[72px] min-h-screen">
      <section className="bg-section-band py-16 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-heading font-black text-5xl tracking-widest uppercase text-foreground">
            CONTACT US
          </h1>
          <div className="w-16 h-0.5 bg-primary mt-4" />
          <p className="text-muted-foreground mt-4 text-lg">
            Reach out for a free quote or consultation. We respond within 24
            hours.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-heading font-black text-2xl tracking-widest uppercase text-foreground mb-6">
              SEND A MESSAGE
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              data-ocid="contact.modal"
            >
              <div>
                <Label
                  htmlFor="name"
                  className="font-heading font-bold text-xs tracking-widest text-primary mb-2 block"
                >
                  YOUR NAME *
                </Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Smith"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground/50"
                  data-ocid="contact.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="phone"
                    className="font-heading font-bold text-xs tracking-widest text-primary mb-2 block"
                  >
                    PHONE
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground/50"
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="font-heading font-bold text-xs tracking-widest text-primary mb-2 block"
                  >
                    EMAIL *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground/50"
                    data-ocid="contact.input"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="message"
                  className="font-heading font-bold text-xs tracking-widest text-primary mb-2 block"
                >
                  MESSAGE *
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Tell us about your project, dimensions, and any special requirements..."
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground/50 resize-none"
                  data-ocid="contact.textarea"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="font-heading font-black text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors uppercase disabled:opacity-50 w-full"
                data-ocid="contact.submit_button"
              >
                {submitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-heading font-black text-2xl tracking-widest uppercase text-foreground mb-6">
              GET IN TOUCH
            </h2>
            <div className="flex flex-col gap-6">
              {info.map(({ icon: Icon, label, value, link }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 bg-card border border-border p-5"
                >
                  <div className="w-11 h-11 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-heading font-black text-xs tracking-widest text-primary mb-1">
                      {label}
                    </div>
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        {value} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {value}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
