import type { APIRoute } from "astro";
import { google } from "googleapis";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import NewLeadEmail from "@/emails/NewLeadEmail";
import { checkRateLimit } from "@/lib/rateLimit";

/**
 * POST /api/contact — Flujo transaccional (3 procesos)
 *
 * @description
 * 1. Rate-limit (IP + email) → 429 si excede
 * 2. Validación estricta (name/apellido >=2, email regex, phone >=10 dígitos locales sin prefijo país, message >=30)
 * 3. Envío de 2 correos vía Resend (desde servicios@skemait.com):
 *    - Bienvenida al lead (to: email del formulario)
 *    - Aviso interno (to: servicios@skemait.com)
 * 4. Append a Google Sheets (solo si los 2 mails fueron OK)
 *
 * @regla de negocio
 * Si al menos 1 de los 3 falla → error usuario "No se pudo enviar el mensaje, intenta de nuevo".
 * Si los mails fallan, NO se hace append (evita fila huérfana). Si Sheets falla tras mails OK,
 * ya se enviaron mails (no hay rollback) → se retorna 500 igual y se loggea PARTIAL_SUCCESS.
 *
 * @logs
 * En desarrollo (import.meta.env.DEV === true) se loggea todo el flujo paso a paso.
 * En producción solo se loggean errores para no filtrar PII.
 */

export const prerender = false;

// Env — no leer .env directamente, usar import.meta.env
const sheetName = import.meta.env.GOOGLE_SHEET_NAME;
const FROM = "SkemaIT <servicios@skemait.com>";
const TO_INTERNAL = "servicios@skemait.com";

/**
 * GET /api/contact — health check (no expone secretos)
 * Útil para verificar en Vercel si env están presentes sin hacer POST
 */
export const GET: APIRoute = async () => {
  const envStatus = {
    RESEND_API_KEY: !!import.meta.env.RESEND_API_KEY,
    GOOGLE_SHEET_ID: !!import.meta.env.GOOGLE_SHEET_ID,
    GOOGLE_SHEET_NAME: !!import.meta.env.GOOGLE_SHEET_NAME,
    GOOGLE_SERVICE_ACCOUNT_JSON: !!import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  };
  const allOk = Object.values(envStatus).every(Boolean);
  return new Response(
    JSON.stringify({
      status: allOk ? "ok" : "missing_env",
      env: envStatus,
      hint: allOk
        ? "Env OK — prueba POST con payload válido"
        : "Faltan env en Vercel → Project Settings → Environment Variables (Production) + Redeploy",
    }),
    {
      status: allOk ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    }
  );
};

// ── Helpers ──

/** Extrae IP del request (Vercel/Cloudflare) */
function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Valida teléfono: mínimo 10 dígitos locales, sin prefijo país (+54 AR)
 * Ej: "+54 9 11 2345-6789" → digits "5491123456789" → local "91123456789" (11) OK
 * Ej: "11 2345-6789" → "1123456789" (10) OK
 * Ej: "123456789" (9) FAIL
 */
function getLocalDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Quita prefijo país AR 54 (y 549 móvil) para contar solo local
  if (digits.startsWith("549")) return digits.slice(3);
  if (digits.startsWith("54")) return digits.slice(2);
  return digits;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  const IS_DEV = import.meta.env.DEV;
  const devLog = (...args: unknown[]) => {
    if (IS_DEV) console.log(...args);
  };
  const devWarn = (...args: unknown[]) => {
    if (IS_DEV) console.warn(...args);
  };

  devLog("[API] ── Request recibido en /api/contact ──");
  devLog("[API] IP:", getClientIp(request));

  // ── Parse body ──
  let data: Record<string, unknown>;
  try {
    data = await request.json();
    devLog("[API] Body parseado:", data);
  } catch {
    return new Response(
      JSON.stringify({ error: "No se pudo enviar el mensaje, intenta de nuevo" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const name = String(data.name ?? "").trim();
  const apellido = String(data.apellido ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const revisado = String(data.revisado ?? "").trim();

  // ── Validación presencia ──
  if (!name || !apellido || !email || !message || !phone || !revisado) {
    devWarn("[API] Faltan campos:", { name, apellido, email, phone, message, revisado });
    return new Response(
      JSON.stringify({ error: "Faltan campos requeridos" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Validación estricta ──
  if (name.length < 2) {
    return new Response(
      JSON.stringify({ error: "El nombre debe tener al menos 2 caracteres." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (apellido.length < 2) {
    return new Response(
      JSON.stringify({ error: "El apellido debe tener al menos 2 caracteres." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: "El correo electrónico no es válido." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  // Teléfono: al menos 10 dígitos locales (sin prefijo país)
  const localDigits = getLocalDigits(phone);
  if (localDigits.length < 10) {
    return new Response(
      JSON.stringify({
        error: "El teléfono debe tener al menos 10 dígitos (sin prefijo país).",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  // Mensaje: mínimo 30 caracteres
  if (message.length < 30) {
    return new Response(
      JSON.stringify({
        error: "El mensaje debe tener al menos 30 caracteres. Cuéntanos más sobre tu proyecto.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Rate limit ──
  const rl = checkRateLimit(request, email);
  if (rl.limited) {
    devWarn(`[API] Rate limited (${rl.reason}) — retry ${rl.retryAfterSec}s`);
    return new Response(
      JSON.stringify({ error: rl.message }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfterSec),
        },
      }
    );
  }
  devLog("[API] Rate-limit OK");

  // ── Verificación env (loggea siempre para Vercel, sin exponer valores) ──
  const envCheck = {
    RESEND_API_KEY: !!import.meta.env.RESEND_API_KEY,
    GOOGLE_SHEET_ID: !!import.meta.env.GOOGLE_SHEET_ID,
    GOOGLE_SHEET_NAME: !!import.meta.env.GOOGLE_SHEET_NAME,
    GOOGLE_SERVICE_ACCOUNT_JSON: !!import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  };
  console.log("[API] Env check:", envCheck, "sheet:", sheetName);
  if (!envCheck.RESEND_API_KEY) {
    console.error("[API] RESEND_API_KEY no configurada — revisa Vercel Env (Production)");
    return new Response(
      JSON.stringify({ error: "No se pudo enviar el mensaje, intenta de nuevo" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  if (!envCheck.GOOGLE_SHEET_ID || !envCheck.GOOGLE_SHEET_NAME || !envCheck.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.error("[API] Faltan variables de Google Sheets:", envCheck);
    return new Response(
      JSON.stringify({ error: "No se pudo enviar el mensaje, intenta de nuevo" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  devLog("[API] Env OK — sheet:", sheetName);

  // ── Resend + Sheets ──
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const createdAt = new Date().toISOString();
  const clientIp = getClientIp(request);

  try {
    // === 1. Mail bienvenida al lead ===
    devLog("[API][MAIL1] Enviando bienvenida a:", email, "— from:", FROM);
    const mail1 = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `Gracias ${name}, recibimos tu proyecto — te respondemos en <24h`,
      react: WelcomeEmail({ name, apellido }),
      replyTo: TO_INTERNAL,
    });
    // Resend puede retornar { error } sin throw
    if ((mail1 as { error?: unknown }).error) {
      console.error("[API][MAIL1] Resend error:", (mail1 as { error: unknown }).error);
      throw new Error("No se pudo enviar el correo de confirmación");
    }
    devLog("[API][MAIL1] OK — id:", (mail1 as { data?: { id?: string } }).data?.id);

    // === 2. Mail aviso interno ===
    devLog("[API][MAIL2] Enviando aviso interno a:", TO_INTERNAL);
    const mail2 = await resend.emails.send({
      from: FROM,
      to: [TO_INTERNAL],
      subject: `Nuevo lead: ${name} ${apellido} — ${email}`,
      react: NewLeadEmail({
        name,
        apellido,
        email,
        phone,
        message,
        createdAt,
        ip: clientIp,
      }),
      replyTo: email, // responder va directo al lead
    });
    if ((mail2 as { error?: unknown }).error) {
      console.error("[API][MAIL2] Resend error:", (mail2 as { error: unknown }).error);
      throw new Error("No se pudo enviar la notificación interna");
    }
    devLog("[API][MAIL2] OK — id:", (mail2 as { data?: { id?: string } }).data?.id);

    // === 3. Google Sheets append (solo si mails OK) ===
    devLog("[API][SHEETS] Ambos mails OK — iniciando append...");
    devLog("[API][SHEETS] Verificando credenciales...");

    let credentials: { client_email?: string };
    try {
      // Vercel a veces guarda JSON con saltos escapados o base64 — intenta parse directo
      const raw = import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON.trim();
      // Si viene con \n literales, JSON.parse lo maneja; si viene base64, decodifica
      let jsonStr = raw;
      if (!raw.startsWith("{")) {
        try {
          jsonStr = Buffer.from(raw, "base64").toString("utf-8");
        } catch {}
      }
      credentials = JSON.parse(jsonStr);
      console.log("[API][SHEETS] Credenciales OK —", credentials.client_email);
    } catch (parseErr) {
      console.error("[API][SHEETS] Credenciales mal formadas:", parseErr);
      console.error("[API][SHEETS] Hint: pega JSON en Vercel sin comillas extra, con \\n escapados");
      throw new Error("No se pudo enviar el mensaje, intenta de nuevo");
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const range = `'${sheetName}'!A:G`;
    devLog("[API][SHEETS] Range:", range);

    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId: import.meta.env.GOOGLE_SHEET_ID,
      range: "TablaClientes",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[createdAt, name, apellido, phone, email, message, revisado]],
      },
    });

    devLog("[API][SHEETS] Append OK — status:", appendResult.status);
    devLog("[API] ── Flujo completo OK (3/3) ──");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const messageErr = err instanceof Error ? err.message : String(err);
    // Log siempre en producción (Vercel) para debug
    console.error("[API] ERROR en flujo:", messageErr);
    const e = err as { code?: unknown; response?: { data?: unknown }; error?: unknown };
    if (e.code) console.error("[API] Código:", e.code);
    if (e.error) console.error("[API] Error obj:", e.error);
    if (e.response?.data) console.error("[API] Respuesta Google/Resend:", e.response.data);

    // Determinar paso fallido por mensaje
    const isSheetsErr = messageErr.includes("Google") || messageErr.includes("Credentials") || messageErr.includes("sheet");
    const isMailErr = messageErr.toLowerCase().includes("correo") || messageErr.toLowerCase().includes("resend") || messageErr.toLowerCase().includes("mail");

    if (isSheetsErr) {
      console.error("[API][SHEETS] ERROR — mails ya enviados, Sheets falló:", err);
      console.error("[API] PARTIAL_SUCCESS: 2/3 (mails OK, sheets FAIL) — requiere revisión manual");
    } else if (isMailErr) {
      console.error("[API] ERROR en envío de correos — Sheets NO ejecutado:", err);
    }

    if (IS_DEV) {
      console.error("[API][DEV] Detalle:", err);
    }

    // Mensaje genérico al usuario (no filtrar detalle interno)
    return new Response(
      JSON.stringify({ error: "No se pudo enviar el mensaje, intenta de nuevo" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
