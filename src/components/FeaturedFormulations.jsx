import { useRef } from "react";
import { Link } from "react-router-dom";
import "./FeaturedFormulations.css";

const FORMULATIONS = [
  {
    name: "HUNGRY Syrup (Kiwi Flavour)",
    form: "Syrup",
    composition: "Cyproheptadine HCL & Tricholine Citrate Syrup",
    image: "/product_images/WhatsApp Image 2026-09-28 at 11.50.39 AM.jpeg",
    href: "/products/11",
    tint: "#D6EEC9",
  },
  {
    name: "Ev-Pik 400",
    form: "Softgel Capsule",
    composition: "Vitamin E (Natural) D-Alpha Tocopherol Capsules",
    image: "/product_images/WhatsApp Image 2026-09-28 at 11.50.40 AM.jpeg",
    href: "/products/12",
    tint: "#C9E3F6",
  },
  {
    name: "Prednexa 10",
    form: "Tablet",
    composition: "Prednisolone Tablets IP 10mg",
    image: "/product_images/WhatsApp Image 2026-09-28 at 11.50.42 AM.jpeg",
    href: "/products/13",
    tint: "#F6D2DE",
  },
  {
    name: "Mecoforte-Plus Capsules",
    form: "Hard Gelatin Capsule",
    composition:
      "Methylcobalamin, Alpha Lipoic Acid, Pyridoxine Hydrochloride & Folic Acid",
    image: "/product_images/WhatsApp Image 2026-09-28 at 11.50.43 AM.jpeg",
    href: "/products/14",
    tint: "#FBDFAA",
  },
  {
    name: "NEUROBEE FORTE",
    form: "Film Coated Tablet",
    composition: "Tablet of Vitamin B Complex with B12",
    image: "/product_images/WhatsApp Image 2026-09-28 at 11.50.14 AM.jpeg",
    href: "/products/1",
    tint: "#F7C9C9",
  },
  {
    name: "ACE-SP",
    form: "Film Coated Tablet",
    composition: "Aceclofenac, Paracetamol & Serratiopeptidase Tablets",
    image: "/product_images/WhatsApp Image 2026-09-28 at 11.50.38 AM.jpeg",
    href: "/products/10",
    tint: "#CDDEFA",
  },
];

const ArrowRight = ({ size = 16, className }) => (
  <svg
    className={className}
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir }) => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

export default function FeaturedFormulations() {
  const trackRef = useRef(null);

  const scrollTrack = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="ff" aria-label="Featured Formulations">
      <span className="ff__circle ff__circle--a" aria-hidden="true" />
      <span className="ff__circle ff__circle--b" aria-hidden="true" />

      <div className="ff__inner">
        <header className="ff__head">
          <div className="ff__bars" aria-hidden="true">
            <span />
            <span />
          </div>
          <h2 className="ff__title">
            Featured Medicine <span>Formulations</span>
          </h2>
          <p className="ff__sub">
            High-bioavailability pharmaceutical syrups, creams, pain relief
            oils, and oral therapeutics formulated under strict quality
            compliance.
          </p>
        </header>

        <div className="ff__track" ref={trackRef}>
          {FORMULATIONS.map((f) => (
            <Link
              key={f.name}
              to={f.href}
              className="ff__card"
              aria-label={`View formulation: ${f.name}`}
            >
              <div className="ff__stage" style={{ "--tint": f.tint }}>
                <span className="ff__disc" aria-hidden="true" />
                <img className="ff__img" src={f.image} alt={`${f.name} pack`} loading="lazy" />
              </div>
              <div className="ff__body">
                <span className="ff__form">{f.form}</span>
                <h3 className="ff__name">{f.name}</h3>
                <p className="ff__comp">{f.composition}</p>
                <span className="ff__link">
                  View Formulation
                  <span className="ff__go">
                    <ArrowRight size={14} />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="ff__controls">
          <Link className="ff__cta" to="/products">
            Explore Full Formulations Directory
            <ArrowRight className="ff__cta-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
