import { motion } from "framer-motion";
import { InteractiveHoverButton } from "@/components/Sections/Contact/components/interactive-hover-button";
// Iconos centralizados — ver `src/components/icons.tsx` para documentación y uso
import { Linkedin, Instagram, Github, X, Whatsapp } from "@/components/icons";

/**
 * ContactInfo — Manifiesto editorial premium
 * Solo whatsapp expuesto + socials. Sin email/tel genéricos.
 *
 * @notas
 * - Los iconos se importan desde `@/components/icons` (single source of truth).
 *   No redefinir SVGs locales para evitar duplicación con Footer u otras secciones.
 * - Cada entrada de `SOCIAL_LINKS` usa `Icon` como componente React para render dinámico via `<item.Icon />`.
 */

// ── Config de enlaces sociales (usa iconos centralizados) ──
const SOCIAL_LINKS = [
  { name: "LinkedIn", url: "https://linkedin.com", Icon: Linkedin },
  { name: "Instagram", url: "https://instagram.com", Icon: Instagram },
  { name: "GitHub", url: "https://github.com", Icon: Github },
  { name: "X (Twitter)", url: "https://x.com", Icon: X },
];

const WHATSAPP_NUMBER = "+57 300 3397741";
const WHATSAPP_LINK = "https://wa.me/573003397741?text=Hola%20SkemaIT%2C%20quiero%20impulsar%20mi%20proyecto";

export default function ContactInfo() {
  return (
    <div className="relative flex flex-col gap-8">
      {/* Eyebrow pill — sin ping infinito, solo dot con glow sutil */}
      <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
        <span className="relative flex size-2 items-center justify-center">
          <span className="absolute size-2 rounded-full bg-[#2FE6A6] blur-[4px] opacity-60" aria-hidden="true" />
          <span className="relative size-1.5 rounded-full bg-[#2FE6A6]" />
        </span>
        <span className="text-[10px] font-bold tracking-[0.14em] text-white/65 uppercase">Disponible — Proyectos 2026</span>
      </div>

      {/* Heading — solid accent, balance, -0.02em */}
      <div data-contact-title>
        <h2 className="text-[2rem] sm:text-[2.45rem] md:text-[2.85rem] lg:text-[3.05rem] font-extrabold tracking-[-0.02em] text-white leading-[0.98] text-balance">
          Hablemos de tu <span className="text-[#E17246]">proyecto</span>
        </h2>
        <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-[#C9C4D8]/85 text-pretty">
          Diseñamos plataformas de alto rendimiento y sistemas de crecimiento. Respuesta humana, propuesta técnica en menos de 24 horas.
        </p>
      </div>

      {/* WhatsApp direct — único contacto expuesto */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.035] p-1 transition-colors duration-200 hover:border-white/[0.10]">
        <div className="flex items-center gap-4 rounded-[calc(1rem-2px)] border border-white/[0.03] bg-[#13131A] px-4 py-4 sm:px-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          {/* Icono WhatsApp centralizado — importado desde @/components/icons */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)]">
            <Whatsapp className="size-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">WhatsApp directo</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block text-[15px] font-semibold tracking-tight text-white hover:text-[#25D366] transition-colors duration-200"
            >
              {WHATSAPP_NUMBER}
            </a>
            <p className="text-xs text-white/35">Respuesta promedio &lt; 2h · Lun–Vie 9–19h</p>
          </div>
          <InteractiveHoverButton
            aria-label="Abrir WhatsApp"
            onClick={() => window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer")}
            className="hidden sm:inline-flex shrink-0 border-white bg-white px-5 py-2.5 text-xs font-bold tracking-wide text-[#0A0A0F] hover:text-white"
          >
            Escribir
          </InteractiveHoverButton>
        </div>
      </div>

      {/* Trust strip — prueba social minimal */}
      <div className="grid grid-cols-2 gap-3 border-y border-white/[0.06] py-5">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold leading-none tracking-tight text-white">24h</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40 leading-tight">Propuesta<br />técnica</span>
        </div>
        <div className="flex flex-col gap-1 border-l border-white/[0.06] pl-4">
          <span className="text-lg font-bold leading-none tracking-tight text-white">10+</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40 leading-tight">Proyectos<br />entregados</span>
        </div>
        
      </div>

      {/* Socials — premium pill, hover solo en hover:hover */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Síguenos</p>
        <div className="flex items-center gap-2.5 flex-wrap">
          {SOCIAL_LINKS.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              whileTap={{ scale: 0.96 }}
              className="group/icon relative flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-colors duration-200 hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-[0.97] [@media(hover:hover)]:hover:-translate-y-0.5"
            >
              <item.Icon className="size-[18px] transition-transform duration-200 group-hover/icon:scale-105" />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
