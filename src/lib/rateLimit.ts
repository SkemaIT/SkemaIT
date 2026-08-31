/**
 * rateLimit.ts — Rate limiter ligero para /api/contact
 *
 * @description
 * Previene spam/ataques de fuerza bruta sin depender de infra externa (Redis/KV).
 * Usa memoria in-process con Map y ventanas deslizantes. En Vercel serverless
 * cada instancia tiene su propio Map (no distribuido) — suficiente para MVP.
 * Para escala real migrar a Upstash Redis / Vercel KV.
 *
 * @estrategia
 * - Doble llave: IP + email normalizado. IP sola es muy agresiva en oficinas/CGNAT,
 *   email solo es baneable con rotación. Combinar ambos es balanceado.
 * - Límites: 3 req / 10min por IP  y  1 req / 5min por email (ver checkRateLimit).
 * - Respuesta 429 con Retry-After en segundos.
 *
 * @uso
 * const rl = checkRateLimit(request, email);
 * if (rl.limited) return new Response(..., { status: 429, headers: { "Retry-After": ... }});
 */

type Entry = {
  count: number;
  resetAt: number; // epoch ms
};

// Stores separados para no mezclar llaves
const ipStore = new Map<string, Entry>();
const emailStore = new Map<string, Entry>();

// ── Config ──
const IP_MAX = 3;
const IP_WINDOW_MS = 10 * 60 * 1000; // 10 min

const EMAIL_MAX = 1;
const EMAIL_WINDOW_MS = 5 * 60 * 1000; // 5 min

// Limpieza perezosa en cada check para evitar memory leak
function purgeExpired(store: Map<string, Entry>, now: number) {
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
}

function getClientIp(request: Request): string {
  // Vercel / Cloudflare / NGINX headers — prioridad x-forwarded-for
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  // Astro en dev puede no tener headers
  return "unknown";
}

export type RateLimitResult =
  | { limited: false }
  | {
      limited: true;
      reason: "ip" | "email";
      retryAfterSec: number;
      message: string;
    };

/**
 * Verifica si el request debe ser limitado.
 * @param request - Request entrante (para extraer IP)
 * @param email - Email del formulario (normalizado lower)
 */
export function checkRateLimit(
  request: Request,
  email: string
): RateLimitResult {
  const now = Date.now();
  const ip = getClientIp(request);
  const normalizedEmail = email.trim().toLowerCase();

  purgeExpired(ipStore, now);
  purgeExpired(emailStore, now);

  // ── IP check ──
  const ipEntry = ipStore.get(ip);
  if (ipEntry) {
    if (ipEntry.count >= IP_MAX) {
      const retryAfterSec = Math.ceil((ipEntry.resetAt - now) / 1000);
      return {
        limited: true,
        reason: "ip",
        retryAfterSec: retryAfterSec > 0 ? retryAfterSec : 1,
        message: `Demasiados envíos desde esta red. Intenta de nuevo en ${Math.ceil(retryAfterSec / 60)} min.`,
      };
    }
    ipEntry.count += 1;
  } else {
    ipStore.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
  }

  // ── Email check ──
  const emailEntry = emailStore.get(normalizedEmail);
  if (emailEntry) {
    if (emailEntry.count >= EMAIL_MAX) {
      const retryAfterSec = Math.ceil((emailEntry.resetAt - now) / 1000);
      // Rollback IP increment para no penalizar IP por rate de email
      const ipE = ipStore.get(ip);
      if (ipE) ipE.count = Math.max(0, ipE.count - 1);
      return {
        limited: true,
        reason: "email",
        retryAfterSec: retryAfterSec > 0 ? retryAfterSec : 1,
        message: `Ya recibimos tu mensaje recientemente. Espera ${Math.ceil(retryAfterSec / 60)} min antes de reenviar.`,
      };
    }
    emailEntry.count += 1;
  } else {
    emailStore.set(normalizedEmail, {
      count: 1,
      resetAt: now + EMAIL_WINDOW_MS,
    });
  }

  return { limited: false };
}

/**
 * Util p/ tests: limpia stores
 * @internal
 */
export function _resetRateLimitStores() {
  ipStore.clear();
  emailStore.clear();
}
