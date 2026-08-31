import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
} from "@react-email/components";

/**
 * NewLeadEmail — Aviso interno de nuevo lead para servicios@skemait.com
 *
 * @description
 * Se envía a `servicios@skemait.com`, desde `servicios@skemait.com`.
 * Informa que una persona quiere contactarse. Incluye todos los datos del
 * formulario para acción inmediata. Diseño dark editorial, alta densidad
 * de información pero respiración premium.
 *
 * @uso
 * Resend: react: NewLeadEmail({ name, apellido, email, phone, message, createdAt, ip })
 */

interface NewLeadEmailProps {
  name: string;
  apellido: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string; // ISO string
  ip?: string;
}

function formatDate(iso?: string): string {
  if (!iso) return new Date().toLocaleString("es-AR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  });
  try {
    return new Date(iso).toLocaleString("es-AR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    });
  } catch {
    return iso;
  }
}

export default function NewLeadEmail({
  name,
  apellido,
  email,
  phone,
  message,
  createdAt,
  ip,
}: NewLeadEmailProps) {
  const fullName = `${name} ${apellido}`.trim();
  const sheetUrl = (() => {
    try {
      // No tenemos import.meta aquí, solo placeholder; se reemplaza en API si quiere link real
      return "https://docs.google.com/spreadsheets";
    } catch {
      return "https://docs.google.com/spreadsheets";
    }
  })();

  return (
    <Html lang="es" dir="ltr">
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap');`}</style>
      </Head>
      <Preview>
        Nuevo lead: {fullName} — {email} — {phone}
      </Preview>

      <Body
        style={{
          margin: "0",
          padding: "0",
          backgroundColor: "#0A0A0F",
          fontFamily:
            "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <Section style={{ padding: "24px 0 0 0" }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
            <Section
              style={{
                backgroundColor: "#0F0F13",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 24px 64px -20px rgba(0,0,0,0.65)",
              }}
            >
              {/* Header — alerta */}
              <Section
                style={{
                  backgroundColor: "rgba(225,114,70,0.08)",
                  borderBottom: "1px solid rgba(225,114,70,0.16)",
                  padding: "14px 24px",
                }}
              >
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ borderCollapse: "collapse" }}
                >
                  <tr>
                    <td>
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase" as const,
                          color: "#E17246",
                        }}
                      >
                        ● Nuevo lead — Acción requerida
                      </Text>
                      <Text
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {formatDate(createdAt)} {ip ? `— IP ${ip}` : ""}
                      </Text>
                    </td>
                    <td align="right" style={{ textAlign: "right" as const }}>
                      <Link
                        href={sheetUrl}
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#ffffff",
                          backgroundColor: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: "9999px",
                          padding: "7px 12px",
                          textDecoration: "none",
                        }}
                      >
                        Ver Sheets →
                      </Link>
                    </td>
                  </tr>
                </table>
              </Section>

              {/* Title */}
              <Section style={{ padding: "22px 24px 0 24px" }}>
                <Heading
                  as="h1"
                  style={{
                    margin: "0",
                    fontSize: "20px",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#ffffff",
                    lineHeight: "1.15",
                  }}
                >
                  {fullName}{" "}
                  <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: "13px" }}>
                    quiere contactarse
                  </span>
                </Heading>
                <Text
                  style={{
                    margin: "6px 0 0 0",
                    fontSize: "13px",
                    color: "rgba(201,196,216,0.85)",
                  }}
                >
                  Respuesta esperada <span style={{ color: "#2FE6A6", fontWeight: 700 }}>&lt;24h</span> — revisado: No
                </Text>
              </Section>

              {/* Datos en grid */}
              <Section style={{ padding: "16px 24px 0 24px" }}>
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    borderCollapse: "collapse",
                    backgroundColor: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    overflow: "hidden" as const,
                  }}
                >
                  {/* Row email */}
                  <tr>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        width: "32%",
                      }}
                    >
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.10em",
                          textTransform: "uppercase" as const,
                          color: "rgba(255,255,255,0.40)",
                        }}
                      >
                        Email
                      </Text>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Link
                        href={`mailto:${email}`}
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#ffffff",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                          wordBreak: "break-all" as const,
                        }}
                      >
                        {email}
                      </Link>
                    </td>
                  </tr>

                  {/* Row phone */}
                  <tr>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.10em",
                          textTransform: "uppercase" as const,
                          color: "rgba(255,255,255,0.40)",
                        }}
                      >
                        Teléfono
                      </Text>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Link
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#ffffff",
                          textDecoration: "none",
                        }}
                      >
                        {phone}
                      </Link>
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.40)",
                        }}
                      >
                        ·{" "}
                        <Link
                          href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                          style={{
                            color: "#2FE6A6",
                            textDecoration: "underline",
                          }}
                        >
                          WhatsApp
                        </Link>
                      </span>
                    </td>
                  </tr>

                  {/* Row name */}
                  <tr>
                    <td style={{ padding: "12px 16px" }}>
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.10em",
                          textTransform: "uppercase" as const,
                          color: "rgba(255,255,255,0.40)",
                        }}
                      >
                        Nombre
                      </Text>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Text
                        style={{
                          margin: "0",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#ffffff",
                        }}
                      >
                        {fullName}
                      </Text>
                    </td>
                  </tr>
                </table>
              </Section>

              {/* Mensaje */}
              <Section style={{ padding: "16px 24px 0 24px" }}>
                <Text
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "rgba(255,255,255,0.40)",
                  }}
                >
                  Mensaje del proyecto
                </Text>
                <Section
                  style={{
                    backgroundColor: "#13131A",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderLeft: "3px solid #E17246",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >
                  <Text
                    style={{
                      margin: "0",
                      fontSize: "13px",
                      lineHeight: "1.65",
                      color: "rgba(255,255,255,0.88)",
                      whiteSpace: "pre-wrap" as const,
                      wordBreak: "break-word" as const,
                    }}
                  >
                    {message}
                  </Text>
                </Section>
              </Section>

              {/* CTAs */}
              <Section style={{ padding: "18px 24px 0 24px", textAlign: "center" as const }}>
                <Link
                  href={`mailto:${email}?subject=Re:%20Tu%20proyecto%20en%20SkemaIT&body=Hola%20${encodeURIComponent(name)},%0A%0A`}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#ffffff",
                    color: "#0A0A0F",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    textDecoration: "none",
                    padding: "10px 18px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    marginRight: "8px",
                  }}
                >
                  Responder por Email
                </Link>
                <Link
                  href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#25D366",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    textDecoration: "none",
                    padding: "10px 18px",
                    borderRadius: "9999px",
                  }}
                >
                  WhatsApp
                </Link>
                <Text
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Responde directamente a este correo o por WhatsApp. El lead ya recibió confirmación.
                </Text>
              </Section>

              <Hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  margin: "18px 24px 0 24px",
                }}
              />

              <Section style={{ padding: "12px 24px 18px 24px" }}>
                <Text
                  style={{
                    margin: "0",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.30)",
                    textAlign: "center" as const,
                    lineHeight: "1.5",
                  }}
                >
                  Notificación interna — SkemaIT · Generado automáticamente desde
                  /api/contact · {formatDate(createdAt)}
                </Text>
              </Section>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

NewLeadEmail.PreviewProps = {
  name: "Sofía",
  apellido: "García",
  email: "sofia@empresa.com",
  phone: "+54 9 11 2345-6789",
  message:
    "Hola SkemaIT, quiero rediseñar mi plataforma de e-commerce para escalar a LATAM. Necesito performance, SEO técnico y un sistema de pagos robusto. Presupuesto estimado 15k USD.",
  createdAt: new Date().toISOString(),
  ip: "200.45.12.34",
} satisfies NewLeadEmailProps;
