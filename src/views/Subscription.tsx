import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  CircleCheck,
  GraduationCap,
  HardHat,
  HeartPulse,
  Hotel,
  House,
  MapPinned,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppState } from "@/lib/types";

interface Props {
  state: AppState;
}

type Billing = "monthly" | "annual";
type PlanKey = "citizen" | "community" | "business" | "enterprise";

interface Plan {
  key: PlanKey;
  name: string;
  nameEs: string;
  eyebrow: string;
  eyebrowEs: string;
  monthly: string;
  annual: string;
  suffix: string;
  suffixEs: string;
  description: string;
  descriptionEs: string;
  features: string[];
  featuresEs: string[];
  cta: string;
  ctaEs: string;
  icon: LucideIcon;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    key: "citizen",
    name: "Citizen",
    nameEs: "Ciudadano",
    eyebrow: "For every Bogotá resident",
    eyebrowEs: "Para toda persona en Bogotá",
    monthly: "$0",
    annual: "$0",
    suffix: "forever",
    suffixEs: "para siempre",
    description: "Report bulky waste, find guidance, and earn rewards at no cost.",
    descriptionEs: "Reporta residuos voluminosos, recibe orientación y gana recompensas sin costo.",
    features: [
      "Bulky-waste requests",
      "Collection status updates",
      "Disposal guidance",
      "Vivos and rewards",
    ],
    featuresEs: [
      "Solicitudes de residuos voluminosos",
      "Estado de recolección",
      "Guía para disponer residuos",
      "Vivos y recompensas",
    ],
    cta: "Get started free",
    ctaEs: "Empezar gratis",
    icon: Users,
  },
  {
    key: "community",
    name: "Community",
    nameEs: "Comunidad",
    eyebrow: "Residential & community",
    eyebrowEs: "Residencial y comunitario",
    monthly: "$50–100",
    annual: "$480–960",
    suffix: "per month",
    suffixEs: "al mes",
    description: "Simple waste coordination for smaller buildings and neighbourhood groups.",
    descriptionEs: "Coordinación simple para edificios pequeños y organizaciones barriales.",
    features: [
      "Bulky-waste requests",
      "Collection scheduling",
      "Disposal guidance",
      "Building or community dashboard",
      "Monthly waste report",
      "Vivos and rewards",
    ],
    featuresEs: [
      "Solicitudes de residuos voluminosos",
      "Programación de recolecciones",
      "Guía para disponer residuos",
      "Panel de edificio o comunidad",
      "Informe mensual de residuos",
      "Vivos y recompensas",
    ],
    cta: "Choose Community",
    ctaEs: "Elegir Comunidad",
    icon: UsersRound,
  },
  {
    key: "business",
    name: "Business",
    nameEs: "Negocios",
    eyebrow: "Operations across locations",
    eyebrowEs: "Operación en varias sedes",
    monthly: "$150–300",
    annual: "$1,440–2,880",
    suffix: "per month",
    suffixEs: "al mes",
    description: "Control collections, records, and impact across teams and locations.",
    descriptionEs: "Controla recolecciones, registros e impacto entre equipos y sedes.",
    features: [
      "Multiple users and locations",
      "Priority collection coordination",
      "Waste tracking and disposal records",
      "Monthly sustainability report",
      "Recovery and recycling reporting",
      "Organisation dashboard",
    ],
    featuresEs: [
      "Múltiples usuarios y sedes",
      "Coordinación prioritaria",
      "Trazabilidad y registros",
      "Informe mensual de sostenibilidad",
      "Reporte de recuperación y reciclaje",
      "Panel para la organización",
    ],
    cta: "Choose Business",
    ctaEs: "Elegir Negocios",
    icon: Building2,
    featured: true,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    nameEs: "Enterprise",
    eyebrow: "Complex portfolios & ESG",
    eyebrowEs: "Portafolios complejos y ESG",
    monthly: "$500–1,500+",
    annual: "$4,800–14,400+",
    suffix: "per month",
    suffixEs: "al mes",
    description: "Advanced intelligence, integrations, and support for large organisations.",
    descriptionEs: "Inteligencia, integraciones y soporte avanzado para grandes organizaciones.",
    features: [
      "Multiple properties",
      "Advanced waste-generation analytics",
      "API and system integrations",
      "Dedicated support",
      "Recovery metrics",
      "Hotspot intelligence by location",
      "ESG and sustainability reporting",
    ],
    featuresEs: [
      "Múltiples propiedades",
      "Analítica avanzada de generación",
      "API e integraciones",
      "Soporte dedicado",
      "Métricas de recuperación",
      "Inteligencia de hotspots por ubicación",
      "Reportes ESG y de sostenibilidad",
    ],
    cta: "Talk to our team",
    ctaEs: "Hablar con el equipo",
    icon: ShieldCheck,
  },
];

const AUDIENCES: Array<{ icon: LucideIcon; en: string; es: string }> = [
  { icon: House, en: "Residential buildings", es: "Edificios residenciales" },
  { icon: Building2, en: "Property managers", es: "Administradores de propiedades" },
  { icon: GraduationCap, en: "Universities", es: "Universidades" },
  { icon: ShoppingBag, en: "Shopping centres", es: "Centros comerciales" },
  { icon: Hotel, en: "Hotels", es: "Hoteles" },
  { icon: HeartPulse, en: "Hospitals", es: "Hospitales" },
  { icon: HardHat, en: "Construction", es: "Constructoras" },
  { icon: MapPinned, en: "Commercial premises", es: "Grandes comercios" },
  { icon: UsersRound, en: "Community groups", es: "Organizaciones comunitarias" },
];

export default function Subscription({ state }: Props) {
  const isEs = state.lang === "es";
  const [billing, setBilling] = useState<Billing>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <div className="subscription-page rise">
      <section className="plans-hero">
        <div className="plans-hero-glow" aria-hidden="true" />
        <div className="plans-kicker">
          <Sparkles size={13} />
          {isEs ? "PUNTO VIVO PARA ORGANIZACIONES" : "PUNTO VIVO FOR ORGANISATIONS"}
        </div>
        <div className="plans-hero-row">
          <div>
            <div className="plans-title">
              {isEs ? "Un plan para cada comunidad." : "One plan for every community."}
              <span>{isEs ? " Menos residuos, más valor." : " Less waste, more value."}</span>
            </div>
            <p className="plans-intro">
              {isEs
                ? "Gestiona residuos voluminosos, coordina recolecciones y demuestra tu impacto desde un solo lugar."
                : "Manage bulky waste, coordinate collections, and prove your impact from one connected workspace."}
            </p>
          </div>
          <div className="billing-toggle" aria-label={isEs ? "Frecuencia de facturación" : "Billing frequency"}>
            {(["monthly", "annual"] as const).map((option) => (
              <motion.button
                type="button"
                key={option}
                className={billing === option ? "active" : ""}
                onClick={() => setBilling(option)}
                whileTap={{ scale: 0.96 }}
              >
                {option === "monthly"
                  ? isEs ? "Mensual" : "Monthly"
                  : isEs ? "Anual" : "Annual"}
                {option === "annual" && <span>{isEs ? "AHORRA 20%" : "SAVE 20%"}</span>}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <div className="plans-grid">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon;
          const features = isEs ? plan.featuresEs : plan.features;
          return (
            <motion.article
              key={plan.key}
              className={`card plan-card${plan.featured ? " featured" : ""}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
            >
              {plan.featured && (
                <div className="plan-popular">
                  <Sparkles size={11} />
                  {isEs ? "RECOMENDADO" : "RECOMMENDED"}
                </div>
              )}
              <div className="plan-head">
                <div className="plan-icon"><Icon size={17} /></div>
                <div className="plan-name">{isEs ? plan.nameEs : plan.name}</div>
                <div className="plan-eyebrow">{isEs ? plan.eyebrowEs : plan.eyebrow}</div>
                <div className="plan-price-row">
                  <span className="plan-price">{billing === "annual" ? plan.annual : plan.monthly}</span>
                  <span className="plan-period">
                    {plan.key === "citizen"
                      ? isEs ? plan.suffixEs : plan.suffix
                      : billing === "annual"
                        ? isEs ? "al año" : "per year"
                        : isEs ? plan.suffixEs : plan.suffix}
                  </span>
                </div>
                {billing === "annual" && plan.key !== "citizen" && (
                  <div className="annual-note">
                    {isEs ? "Facturación anual · 20% de ahorro" : "Billed annually · 20% savings"}
                  </div>
                )}
                <p className="plan-description">{isEs ? plan.descriptionEs : plan.description}</p>
              </div>

              <div className="plan-divider" />
              <div className="plan-features">
                {features.map((feature) => (
                  <div className="plan-feature" key={feature}>
                    <span><Check size={11} strokeWidth={3} /></span>
                    {feature}
                  </div>
                ))}
              </div>

              <motion.button
                type="button"
                className={`plan-cta${plan.featured ? " primary" : ""}`}
                onClick={() => setSelectedPlan(plan)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {isEs ? plan.ctaEs : plan.cta}
                <ArrowRight size={14} />
              </motion.button>
            </motion.article>
          );
        })}
      </div>

      <div className="pricing-assumption">
        <CircleCheck size={13} />
        <span>
          {isEs
            ? "Precios en USD. Los rangos mostrados son supuestos propuestos para planificación y no precios establecidos en el deck."
            : "Prices in USD. The ranges shown are proposed planning assumptions, not prices established by the uploaded deck."}
        </span>
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            className="plan-interest card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="status"
          >
            <div className="plan-interest-icon"><CircleCheck size={17} /></div>
            <div>
              <div className="plan-interest-title">
                {isEs
                  ? `Plan ${selectedPlan.nameEs} seleccionado`
                  : `${selectedPlan.name} plan selected`}
              </div>
              <p>
                {isEs
                  ? "Perfecto. Nuestro equipo puede ayudarte a definir sedes, volumen y frecuencia de recolección."
                  : "Great choice. Our team can help scope locations, waste volume, and collection frequency."}
              </p>
            </div>
            <button
              type="button"
              className="plan-interest-close"
              onClick={() => setSelectedPlan(null)}
              aria-label={isEs ? "Cerrar" : "Close"}
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="audience-section">
        <div className="audience-copy">
          <div className="audience-kicker">{isEs ? "CRECE CONTIGO" : "BUILT TO SCALE WITH YOU"}</div>
          <div className="audience-title">
            {isEs ? "Diseñado para quienes gestionan lugares reales." : "Designed for teams managing real places."}
          </div>
          <p>
            {isEs
              ? "Desde un edificio hasta un portafolio de propiedades, Punto Vivo adapta la coordinación y los reportes a tu operación."
              : "From one building to a property portfolio, Punto Vivo adapts coordination and reporting to your operation."}
          </p>
        </div>
        <div className="audience-grid">
          {AUDIENCES.map(({ icon: Icon, en, es }) => (
            <div className="audience-item" key={en}>
              <Icon size={14} />
              <span>{isEs ? es : en}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
