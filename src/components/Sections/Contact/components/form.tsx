/**
 * form.tsx — Formulario de contacto premium (SkemaIT)
 *
 * @description
 * Formulario React controlado con validación síncrona + envío a `/api/contact`.
 * - Campos: name, apellido, email, phone, message (todos requeridos)
 * - Validación: name/apellido >=2, email regex, phone >=10 dígitos locales
 *   (sin prefijo país, ver getLocalDigits), message >=30
 * - Rate-limit y error genérico se delegan al backend (429/500)
 * - UI: shells con estados idle/focus/error, labels flotantes, iconos lucide,
 *   botón premium con gradiente y shimmer. Success view sin botón "Enviar otro"
 *   (se removió por requerimiento).
 * - A11y: aria-required/invalid/describedby, aria-live en wrapper.
 */

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MessageSquareText,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

interface FormData {
  name: string;
  apellido: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  apellido?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    apellido: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  /**
   * Valida teléfono: mínimo 10 dígitos locales, sin prefijo país (+54 AR)
   * Se quita prefijo 54/549 si existe para contar solo local.
   */
  const getLocalDigits = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("549")) return digits.slice(3);
    if (digits.startsWith("54")) return digits.slice(2);
    return digits;
  };

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "El nombre es obligatorio.";
        if (value.trim().length < 2) return "Ingresa al menos 2 caracteres.";
        return undefined;
      case "apellido":
        if (!value.trim()) return "El apellido es obligatorio.";
        if (value.trim().length < 2) return "Ingresa al menos 2 caracteres.";
        return undefined;
      case "email":
        if (!value.trim()) return "El correo es obligatorio.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingresa un correo electrónico válido.";
        return undefined;
      case "phone": {
        if (!value.trim()) return "El teléfono es obligatorio.";
        // Formato básico permitido
        if (!/^[+0-9\s\-()]{7,25}$/.test(value.trim())) return "Ingresa un número telefónico válido.";
        const local = getLocalDigits(value.trim());
        if (local.length < 10) return "El teléfono debe tener al menos 10 dígitos (sin prefijo país).";
        return undefined;
      }
      case "message":
        if (!value.trim()) return "Por favor cuéntanos sobre tu proyecto.";
        if (value.trim().length < 30) return "El mensaje debe tener al menos 30 caracteres. Cuéntanos más.";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched({ name: true, apellido: true, email: true, phone: true, message: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAll()) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          apellido: formData.apellido.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          revisado: "No",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Error al enviar el mensaje. Inténtalo de nuevo.");
      setStatus("success");
      setFormData({ name: "", apellido: "", email: "", phone: "", message: "" });
      setErrors({});
      setTouched({});
    } catch (err: any) {
      console.error("[FORM] Error:", err);
      setStatus("error");
      setErrorMessage(err?.message || "Ocurrió un error inesperado al enviar el mensaje.");
    }
  };

  // ——— shared input shell ———
  const shellBase =
    "group relative flex items-center rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 ease-out";
  const shellIdle = "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]";
  const shellFocus =
    "border-[#E17246]/55 bg-[#E17246]/[0.045] shadow-[0_0_0_3px_rgba(225,114,70,0.12)]";
  const shellError =
    "border-red-400/60 bg-red-500/[0.04] shadow-[0_0_0_3px_rgba(248,113,113,0.10)]";

  const iconIdle = "text-white/35";
  const iconFocus = "text-[#E17246]";
  const iconError = "text-red-400";

  return (
    <div className="w-full" aria-live="polite">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.16 }}
            className="flex flex-col items-center justify-center py-8 px-2 text-center"
          >
            <div className="relative mb-5 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.08, stiffness: 320, damping: 22 }}
                className="relative z-10 flex size-[68px] items-center justify-center rounded-full border border-[#2FE6A6]/20 bg-[#2FE6A6]/10 text-[#2FE6A6] shadow-[0_0_28px_rgba(47,230,166,0.20)]"
              >
                <CheckCircle2 size={36} strokeWidth={1.9} />
              </motion.div>
              <div className="absolute size-24 rounded-full bg-[#2FE6A6]/10 blur-xl" aria-hidden="true" />
            </div>
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
            >
              ¡Mensaje enviado!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-2 max-w-md text-sm leading-relaxed text-[#C9C4D8]/80"
            >
              Gracias por contactarnos. Revisaremos tu proyecto y te responderemos en menos de 24 horas.
            </motion.p>
            {/* Botón "Enviar otro mensaje" removido por requerimiento — el usuario ve solo confirmación */}
          </motion.div>
        ) : (
          <motion.form
            key="contact-form-fields"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Nombre + Apellido — grid premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="relative">
                <div className={`${shellBase} ${errors.name ? shellError : focusedField === "name" ? shellFocus : shellIdle}`}>
                  <div className={`pointer-events-none absolute left-3.5 flex items-center transition-colors duration-200 ${errors.name ? iconError : focusedField === "name" ? iconFocus : iconIdle}`} aria-hidden="true">
                    <User size={16} strokeWidth={1.7} />
                  </div>
                  <input
                    id="contact-form-name"
                    type="text"
                    required
                    placeholder=" "
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => handleBlur("name")}
                    autoComplete="given-name"
                    className="peer w-full bg-transparent pl-10 pr-3 pt-5 pb-1.5 text-sm text-white placeholder-transparent outline-none"
                  />
                  <label
                    htmlFor="contact-form-name"
                    className={`pointer-events-none absolute left-10 transition-all duration-200 select-none ${formData.name || focusedField === "name" ? "top-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#E17246]" : "top-[14px] text-sm text-white/35"} ${errors.name ? "!text-red-400" : ""}`}
                  >
                    Nombre <span className="text-[#E17246]">*</span>
                  </label>
                </div>
                {errors.name && (
                  <div id="name-error" role="alert" className="mt-1.5 flex items-center gap-1.5 px-1 text-[12px] font-medium text-red-400">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Apellido */}
              <div className="relative">
                <div className={`${shellBase} ${errors.apellido ? shellError : focusedField === "apellido" ? shellFocus : shellIdle}`}>
                  <div className={`pointer-events-none absolute left-3.5 flex items-center transition-colors duration-200 ${errors.apellido ? iconError : focusedField === "apellido" ? iconFocus : iconIdle}`} aria-hidden="true">
                    <User size={16} strokeWidth={1.7} />
                  </div>
                  <input
                    id="contact-form-apellido"
                    type="text"
                    required
                    placeholder=" "
                    aria-required="true"
                    aria-invalid={Boolean(errors.apellido)}
                    aria-describedby={errors.apellido ? "apellido-error" : undefined}
                    value={formData.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                    onFocus={() => setFocusedField("apellido")}
                    onBlur={() => handleBlur("apellido")}
                    autoComplete="family-name"
                    className="peer w-full bg-transparent pl-10 pr-3 pt-5 pb-1.5 text-sm text-white placeholder-transparent outline-none"
                  />
                  <label
                    htmlFor="contact-form-apellido"
                    className={`pointer-events-none absolute left-10 transition-all duration-200 select-none ${formData.apellido || focusedField === "apellido" ? "top-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#E17246]" : "top-[14px] text-sm text-white/35"} ${errors.apellido ? "!text-red-400" : ""}`}
                  >
                    Apellido <span className="text-[#E17246]">*</span>
                  </label>
                </div>
                {errors.apellido && (
                  <div id="apellido-error" role="alert" className="mt-1.5 flex items-center gap-1.5 px-1 text-[12px] font-medium text-red-400">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.apellido}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <div className={`${shellBase} ${errors.email ? shellError : focusedField === "email" ? shellFocus : shellIdle}`}>
                <div className={`pointer-events-none absolute left-3.5 flex items-center transition-colors duration-200 ${errors.email ? iconError : focusedField === "email" ? iconFocus : iconIdle}`} aria-hidden="true">
                  <Mail size={16} strokeWidth={1.7} />
                </div>
                <input
                  id="contact-form-email"
                  type="email"
                  required
                  placeholder=" "
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => handleBlur("email")}
                  autoComplete="email"
                  className="peer w-full bg-transparent pl-10 pr-3 pt-5 pb-1.5 text-sm text-white placeholder-transparent outline-none"
                />
                <label
                  htmlFor="contact-form-email"
                  className={`pointer-events-none absolute left-10 transition-all duration-200 select-none ${formData.email || focusedField === "email" ? "top-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#E17246]" : "top-[14px] text-sm text-white/35"} ${errors.email ? "!text-red-400" : ""}`}
                >
                  Correo electrónico <span className="text-[#E17246]">*</span>
                </label>
              </div>
              {errors.email && (
                <div id="email-error" role="alert" className="mt-1.5 flex items-center gap-1.5 px-1 text-[12px] font-medium text-red-400">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Teléfono */}
            <div className="relative">
              <div className={`${shellBase} ${errors.phone ? shellError : focusedField === "phone" ? shellFocus : shellIdle}`}>
                <div className={`pointer-events-none absolute left-3.5 flex items-center transition-colors duration-200 ${errors.phone ? iconError : focusedField === "phone" ? iconFocus : iconIdle}`} aria-hidden="true">
                  <Phone size={16} strokeWidth={1.7} />
                </div>
                <input
                  id="contact-form-phone"
                  type="tel"
                  required
                  placeholder=" "
                  aria-required="true"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => handleBlur("phone")}
                  autoComplete="tel"
                  className="peer w-full bg-transparent pl-10 pr-3 pt-5 pb-1.5 text-sm text-white placeholder-transparent outline-none"
                />
                <label
                  htmlFor="contact-form-phone"
                  className={`pointer-events-none absolute left-10 transition-all duration-200 select-none ${formData.phone || focusedField === "phone" ? "top-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#E17246]" : "top-[14px] text-sm text-white/35"} ${errors.phone ? "!text-red-400" : ""}`}
                >
                  Teléfono <span className="text-[#E17246]">*</span>
                </label>
              </div>
              {errors.phone && (
                <div id="phone-error" role="alert" className="mt-1.5 flex items-center gap-1.5 px-1 text-[12px] font-medium text-red-400">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Mensaje */}
            <div className="relative">
              <div className={`group relative flex rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 ease-out ${errors.message ? shellError : focusedField === "message" ? shellFocus : shellIdle}`}>
                <div className={`pointer-events-none absolute left-3.5 top-4 flex items-center transition-colors duration-200 ${errors.message ? iconError : focusedField === "message" ? iconFocus : iconIdle}`} aria-hidden="true">
                  <MessageSquareText size={16} strokeWidth={1.7} />
                </div>
                <textarea
                  id="contact-form-message"
                  required
                  rows={4}
                  placeholder=" "
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => handleBlur("message")}
                  className="peer w-full resize-none bg-transparent pl-10 pr-3 pt-5 pb-3 text-sm text-white placeholder-transparent outline-none min-h-[112px]"
                />
                <label
                  htmlFor="contact-form-message"
                  className={`pointer-events-none absolute left-10 transition-all duration-200 select-none ${formData.message || focusedField === "message" ? "top-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#E17246]" : "top-[14px] text-sm text-white/35"} ${errors.message ? "!text-red-400" : ""}`}
                >
                  Mensaje / Cuéntanos tu proyecto <span className="text-[#E17246]">*</span>
                </label>
              </div>
              {errors.message && (
                <div id="message-error" role="alert" className="mt-1.5 flex items-center gap-1.5 px-1 text-[12px] font-medium text-red-400">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.message}</span>
                </div>
              )}
            </div>

            {status === "error" && (
              <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-3.5 text-xs leading-relaxed text-red-200">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                <span>{errorMessage || "No se pudo enviar el mensaje. Intenta de nuevo."}</span>
              </div>
            )}

            {/* Botón premium — fijo, sin magnetismo. Micro-transiciones caras */}
            <div className="mt-1 pt-1">
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileTap={status !== "loading" ? { scale: 0.97 } : {}}
                className="group relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-full bg-[linear-gradient(135deg,#1B0B3A_0%,#3D1FA3_38%,#6B3DF0_66%,#E17246_100%)] p-1.5 pr-1.5 text-sm font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(61,31,163,0.35),0_2px_10px_rgba(225,114,70,0.20)] transition-[transform,box-shadow,filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_12px_32px_rgba(61,31,163,0.45),0_4px_14px_rgba(225,114,70,0.26)] hover:brightness-[1.04] active:scale-[0.98] active:shadow-[0_4px_12px_rgba(61,31,163,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {/* highlight interior */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.13),transparent_48%)]" />
                {/* shimmer sweep on hover — fijo, no sigue mouse */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="relative flex flex-1 items-center justify-center gap-2 py-2.5 pl-4 tracking-[0.08em] uppercase text-[13px]">
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>Enviar mensaje</span>
                      <Send size={14} className="opacity-80 hidden sm:inline transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
                <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1B0B3A] shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04] group-hover:translate-x-0.5 group-active:scale-95">
                  {status === "loading" ? (
                    <Loader2 size={16} className="animate-spin text-[#1B0B3A]" />
                  ) : (
                    <ArrowUpRight size={16} strokeWidth={2.2} className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
                  )}
                </span>
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
