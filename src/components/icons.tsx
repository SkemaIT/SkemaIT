import type { SVGProps } from "react";

/**
 * icons.tsx — Librería centralizada de iconos de marca (SkemaIT)
 *
 * @description
 * Single source of truth para todos los iconos de marcas/redes.
 * Cada icono es una función React pura que retorna un SVG con `currentColor`,
 * por lo que hereda el color del padre vía `text-*` / `className` o tamaño
 * explícito vía `size`.
 *
 * @uso
 * ```tsx
 * import { Whatsapp, Linkedin, Instagram, Github, X } from "@/components/icons";
 * <Whatsapp className="size-5" />
 * <Whatsapp size={22} />
 * <Linkedin className="size-[18px] text-white/60" />
 * ```
 *
 * @convenciones
 * - Nombre corto PascalCase sin sufijo `Icon` para import limpio: `Whatsapp`, no `WhatsappIcon`.
 * - Soporta `className` (Tailwind `size-5`) y `size`/`width`/`height` numéricos.
 *   Si se pasa `className`, manda para color/tamaño Tailwind; si se pasa `size`,
 *   se aplica como `width`/`height` SVG.
 * - `aria-hidden="true"` por defecto (decorativo). Si el icono es el único
 *   contenido accesible, el padre debe tener `aria-label`.
 * - `fill="currentColor"` según diseño — no hardcodear colores.
 * - `viewBox="0 0 24 24"` consistente para escalado uniforme.
 *
 * @origen
 * Extraído de `src/components/Sections/Contact/components/ContactInfo.tsx` (2026-08-30)
 * y unificado para `ContactInfo` y `Footer`. Evita duplicación de SVGs.
 * @actualizado 2026-08-31 — normalizado `size`+`className`, docs JSDoc por icono.
 */

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

/**
 * Props comunes para todos los iconos de marca.
 * Extiende `SVGProps` y añade `size` opcional para uso sin Tailwind.
 */
type IconProps = {
  /** Clases Tailwind/CSS para tamaño y color. Ej: `size-5`, `size-[22px]` */
  className?: string;
  /** Tamaño numérico alternativo a className (se aplica a width/height) */
  size?: number | string;
  width?: number | string;
  height?: number | string;
} & Omit<SVGProps<SVGSVGElement>, "className" | "width" | "height">;

// ─────────────────────────────────────────────────────────────
// Iconos
// ─────────────────────────────────────────────────────────────

/**
 * Icono de LinkedIn — logotipo oficial (fill).
 * @param className - Tamaño/color. Ej: `size-5`, `size-[18px]`
 */
export function Linkedin({
  size = 20,
  width,
  height,
  ...props
}: IconProps & {
  size?: number | string;
  width?: number | string;
  height?: number | string;
}) {
  return (
      <svg
    fill="currentColor"
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    {...props}
  >
    <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z" />
  </svg>
  );
}

/**
 * Icono de Instagram — trazo outline premium (stroke 1.6).
 * Diseño minimal con rect + círculo + punto.
 */
export function Instagram({
  size = 20,
  width,
  height,
  ...props
}: IconProps & {
  size?: number | string;
  width?: number | string;
  height?: number | string;
}) {
  return (
      <svg
    fill="currentColor"
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="m16 12v-.001c0-2.209-1.791-4-4-4s-4 1.791-4 4 1.791 4 4 4c1.104 0 2.104-.448 2.828-1.171.723-.701 1.172-1.682 1.172-2.768 0-.021 0-.042-.001-.063v.003zm2.16 0c-.012 3.379-2.754 6.114-6.135 6.114-3.388 0-6.135-2.747-6.135-6.135s2.747-6.135 6.135-6.135c1.694 0 3.228.687 4.338 1.797 1.109 1.08 1.798 2.587 1.798 4.256 0 .036 0 .073-.001.109v-.005zm1.687-6.406v.002c0 .795-.645 1.44-1.44 1.44s-1.44-.645-1.44-1.44.645-1.44 1.44-1.44c.398 0 .758.161 1.018.422.256.251.415.601.415.988v.029-.001zm-7.84-3.44-1.195-.008q-1.086-.008-1.649 0t-1.508.047c-.585.02-1.14.078-1.683.17l.073-.01c-.425.07-.802.17-1.163.303l.043-.014c-1.044.425-1.857 1.237-2.272 2.254l-.01.027c-.119.318-.219.695-.284 1.083l-.005.037c-.082.469-.14 1.024-.159 1.589l-.001.021q-.039.946-.047 1.508t0 1.649.008 1.195-.008 1.195 0 1.649.047 1.508c.02.585.078 1.14.17 1.683l-.01-.073c.07.425.17.802.303 1.163l-.014-.043c.425 1.044 1.237 1.857 2.254 2.272l.027.01c.318.119.695.219 1.083.284l.037.005c.469.082 1.024.14 1.588.159l.021.001q.946.039 1.508.047t1.649 0l1.188-.024 1.195.008q1.086.008 1.649 0t1.508-.047c.585-.02 1.14-.078 1.683-.17l-.073.01c.425-.07.802-.17 1.163-.303l-.043.014c1.044-.425 1.857-1.237 2.272-2.254l.01-.027c.119-.318.219-.695.284-1.083l.005-.037c.082-.469.14-1.024.159-1.588l.001-.021q.039-.946.047-1.508t0-1.649-.008-1.195.008-1.195 0-1.649-.047-1.508c-.02-.585-.078-1.14-.17-1.683l.01.073c-.07-.425-.17-.802-.303-1.163l.014.043c-.425-1.044-1.237-1.857-2.254-2.272l-.027-.01c-.318-.119-.695-.219-1.083-.284l-.037-.005c-.469-.082-1.024-.14-1.588-.159l-.021-.001q-.946-.039-1.508-.047t-1.649 0zm11.993 9.846q0 3.578-.08 4.953c.005.101.009.219.009.337 0 3.667-2.973 6.64-6.64 6.64-.119 0-.237-.003-.354-.009l.016.001q-1.375.08-4.953.08t-4.953-.08c-.101.005-.219.009-.337.009-3.667 0-6.64-2.973-6.64-6.64 0-.119.003-.237.009-.354l-.001.016q-.08-1.375-.08-4.953t.08-4.953c-.005-.101-.009-.219-.009-.337 0-3.667 2.973-6.64 6.64-6.64.119 0 .237.003.354.009l-.016-.001q1.375-.08 4.953-.08t4.953.08c.101-.005.219-.009.337-.009 3.667 0 6.64 2.973 6.64 6.64 0 .119-.003.237-.009.354l.001-.016q.08 1.374.08 4.953z" />
  </svg>
  );
}

/**
 * Icono de GitHub — Octocat (fill).
 * Path con `fillRule`/`clipRule` para forma correcta.
 */
export function Github({
  size = 20,
  width,
  height,
  ...props
}: IconProps & {
  size?: number | string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <svg
    fill="currentColor"
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    {...props}
  >
    <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z" />
  </svg>
  );
}


/**
 * Icono de X (ex-Twitter) — logotipo "X" (fill).
 * Usar con `aria-label="X (Twitter)"` en el enlace padre.
 * @param className - Tailwind size/color
 * @param size - alternativo numérico
 */
export function X({ className, size = 20, width, height, ...props }: IconProps) {
  const hasClassName = Boolean(className);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={!hasClassName ? size || width : undefined}
      height={!hasClassName ? size || height : undefined}
      aria-hidden="true"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Icono de WhatsApp — burbuja con teléfono (fill).
 * Ideal para CTAs directos. Ej: fondo `bg-[#25D366]` + `text-white`.
 */
export function Whatsapp({
  size = 20,
  width,
  height,
  ...props
}: IconProps & {
  size?: number | string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <svg
      fill="currentColor"
      width={size || width}
      height={size || height}
      id="Icon"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 24 24"
      enableBackground="new 0 0 24 24"
      xmlSpace="preserve"
      {...props}
    >
      <g id="WA_Logo">
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.5,3.5C18.25,1.25,15.2,0,12,0C5.41,0,0,5.41,0,12c0,2.11,0.65,4.11,1.7,5.92 L0,24l6.33-1.55C8.08,23.41,10,24,12,24c6.59,0,12-5.41,12-12C24,8.81,22.76,5.76,20.5,3.5z M12,22c-1.78,0-3.48-0.59-5.01-1.49 l-0.36-0.22l-3.76,0.99l1-3.67l-0.24-0.38C2.64,15.65,2,13.88,2,12C2,6.52,6.52,2,12,2c2.65,0,5.2,1.05,7.08,2.93S22,9.35,22,12 C22,17.48,17.47,22,12,22z M17.5,14.45c-0.3-0.15-1.77-0.87-2.04-0.97c-0.27-0.1-0.47-0.15-0.67,0.15 c-0.2,0.3-0.77,0.97-0.95,1.17c-0.17,0.2-0.35,0.22-0.65,0.07c-0.3-0.15-1.26-0.46-2.4-1.48c-0.89-0.79-1.49-1.77-1.66-2.07 c-0.17-0.3-0.02-0.46,0.13-0.61c0.13-0.13,0.3-0.35,0.45-0.52s0.2-0.3,0.3-0.5c0.1-0.2,0.05-0.37-0.02-0.52 C9.91,9.02,9.31,7.55,9.06,6.95c-0.24-0.58-0.49-0.5-0.67-0.51C8.22,6.43,8.02,6.43,7.82,6.43S7.3,6.51,7.02,6.8 C6.75,7.1,5.98,7.83,5.98,9.3c0,1.47,1.07,2.89,1.22,3.09c0.15,0.2,2.11,3.22,5.1,4.51c0.71,0.31,1.27,0.49,1.7,0.63 c0.72,0.23,1.37,0.2,1.88,0.12c0.57-0.09,1.77-0.72,2.02-1.42c0.25-0.7,0.25-1.3,0.17-1.42C18,14.68,17.8,14.6,17.5,14.45z"
          />
        </g>
      </g>
    </svg>
  );
}
