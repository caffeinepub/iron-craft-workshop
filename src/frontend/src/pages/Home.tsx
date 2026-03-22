import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  Hammer,
  Mail,
  MapPin,
  Phone,
  Shield,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { SEED_PRODUCTS } from "../data/seedProducts";
import { useGetAllProducts, useGetContactInfo } from "../hooks/useQueries";

export default function Home() {
  const { data: backendProducts } = useGetAllProducts();
  const { data: contactInfo } = useGetContactInfo();
  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts.slice(0, 4)
      : SEED_PRODUCTS;

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex items-center"
        style={{
          background:
            "url('/assets/generated/hero-welding.dim_1400x700.jpg') center/cover no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-background/75" />
        <div className="relative max-w-6xl mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-block border border-primary px-3 py-1 mb-6">
              <span className="font-heading font-bold text-xs tracking-widest text-primary">
                CRAFTED SINCE 1998
              </span>
            </div>
            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl text-foreground uppercase leading-none tracking-tight mb-6">
              PREMIUM FORGED IRON: DOORS, WINDOWS &amp; GATES
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Master craftsmen shaping raw iron into architectural masterpieces.
              Durable, elegant, and built to last generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" data-ocid="hero.primary_button">
                <button
                  type="button"
                  className="font-heading font-black text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors uppercase flex items-center gap-2"
                >
                  EXPLORE PRODUCTS <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/contact" data-ocid="hero.secondary_button">
                <button
                  type="button"
                  className="font-heading font-black text-sm tracking-widest border border-primary text-primary px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors uppercase"
                >
                  GET A QUOTE
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-section-band">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-black text-4xl tracking-widest uppercase text-foreground">
              OUR CRAFTED COLLECTIONS
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-primary mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} index={i + 1} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" data-ocid="collections.primary_button">
              <button
                type="button"
                className="font-heading font-bold text-sm tracking-widest border border-primary text-primary px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors uppercase"
              >
                VIEW ALL PRODUCTS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background" id="about">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-black text-4xl tracking-widest uppercase text-foreground">
              WHY CHOOSE US?
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-primary mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "LIFETIME DURABILITY",
                text: "Every piece is crafted from premium-grade iron with protective coatings that resist rust and weathering for decades.",
              },
              {
                icon: Hammer,
                title: "MASTER CRAFTSMANSHIP",
                text: "Over 25 years of experience in traditional ironworking techniques combined with modern precision tools.",
              },
              {
                icon: Wrench,
                title: "CUSTOM DESIGNS",
                text: "Every project is unique. We work closely with clients to bring their vision to life with custom patterns and dimensions.",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card border border-border p-8 text-center group hover:border-primary/50 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <feat.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-black text-lg tracking-widest text-foreground mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation */}
      <section className="py-20 bg-section-band">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading font-black text-4xl tracking-widest uppercase text-foreground mb-5">
                REQUEST A CONSULTATION
              </h2>
              <div className="w-12 h-0.5 bg-primary mb-6" />
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you need a single custom door or a complete property
                security solution, our team is ready to help you design and
                build the perfect ironwork. Get in touch today for a free
                consultation and quote.
              </p>
              <Link to="/contact" data-ocid="consultation.primary_button">
                <button
                  type="button"
                  className="font-heading font-black text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors uppercase"
                >
                  CONTACT US
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border p-8"
            >
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: Phone,
                    label: "PHONE",
                    value: contactInfo?.phone ?? "+1 (555) 987-6543",
                  },
                  {
                    icon: MapPin,
                    label: "ADDRESS",
                    value:
                      contactInfo?.address ??
                      "42 Industrial Ave, Steel City, TX 75001",
                  },
                  {
                    icon: Mail,
                    label: "EMAIL",
                    value: contactInfo?.email ?? "info@ironcraft.com",
                  },
                  {
                    icon: Clock,
                    label: "HOURS",
                    value:
                      contactInfo?.workingHours ??
                      "Mon–Fri: 8AM–6PM | Sat: 9AM–3PM",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-heading font-black text-xs tracking-widest text-primary mb-1">
                        {label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
