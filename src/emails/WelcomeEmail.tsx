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
 * WelcomeEmail — Correo de bienvenida transaccional (lead)
 *
 * @from servicios@skemait.com → to: lead
 * @subject `Gracias {name}, recibimos tu proyecto — te respondemos en <24h`
 *
 * @diseño — Dark editorial premium (SkemaIT)
 * - Paleta sólida (no rgba) para compat Gmail/Outlook: #0A0A0F / #14141A / #E17246 / #2FE6A6 / #C9C4D8
 * - Layout 600px table-based, inline styles, sin Tailwind, sin gradientes frágiles
 * - Jerarquía: eyebrow 10px tracked → H1 26px -0.02em → body 14px/1.7
 * - Espaciado generoso (24-32px), radios 16-20, hairlines sólidos #23232A
 * - CTA bulletproof (table + bgcolor sólido + fallback Outlook)
 * - Accent solo en H1 + CTA, resto monocromo — evita “AI slop”
 */

interface WelcomeEmailProps {
  name: string;
  apellido: string;
}

const WHATSAPP_LINK =
  "https://wa.me/5491123456789?text=Hola%20SkemaIT%2C%20quiero%20impulsar%20mi%20proyecto";

export default function WelcomeEmail({ name, apellido }: WelcomeEmailProps) {
  const displayName = `${name} ${apellido}`.trim() || name || "ahí";

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        Gracias, {displayName} — recibimos tu proyecto en SkemaIT. Te
        respondemos en menos de 24h.
      </Preview>

      {/* Outer — gris muy oscuro sólido, no rgba */}
      <Body
        style={{
          margin: "0",
          padding: "0",
          backgroundColor: "#08080A",
          fontFamily:
            "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {/* Centrado */}
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "32px 16px 24px 16px",
          }}
        >
          {/* Card — borde sólido Outlook-safe */}
          <Section
            style={{
              backgroundColor: "#14141A",
              border: "1px solid #23232A",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {/* Accent top line — sutil, sólido */}
            <Section
              style={{
                height: "3px",
                backgroundColor: "#E17246",
                lineHeight: "3px",
                fontSize: "0",
              }}
            >
              &nbsp;
            </Section>

            {/* Header */}
            <Section style={{ padding: "22px 28px 0 28px" }}>
              <table
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                style={{ borderCollapse: "collapse" }}
              >
                <tr>
                  <td
                    style={{
                      verticalAlign: "middle",
                      fontSize: "13px",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "#FFFFFF",
                      lineHeight: "1",
                    }}
                  >
                    SkemaIT
                    <span style={{ color: "#E17246", marginLeft: "7px" }}>—</span>
                    <span
                      style={{
                        color: "#8A8896",
                        fontWeight: 700,
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        marginLeft: "8px",
                      }}
                    >
                      Sistemas de crecimiento
                    </span>
                  </td>
                  <td align="right" style={{ verticalAlign: "middle", textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.11em",
                        textTransform: "uppercase",
                        color: "#2FE6A6",
                        backgroundColor: "#143023",
                        border: "1px solid #1E4A32",
                        borderRadius: "9999px",
                        padding: "6px 10px",
                        lineHeight: "1",
                      }}
                    >
                      ● Respuesta &lt;24h
                    </span>
                  </td>
                </tr>
              </table>
            </Section>

            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #23232A",
                margin: "18px 0 0 0",
              }}
            />

            {/* Hero */}
            <Section style={{ padding: "28px 28px 0 28px" }}>
              <Text
                style={{
                  margin: "0",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#8A8896",
                  lineHeight: "1.4",
                }}
              >
                Confirmación recibida
              </Text>

              <Heading
                as="h1"
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.08",
                  color: "#FFFFFF",
                }}
              >
                Hola {displayName},
                <br />
                <span style={{ color: "#E17246" }}>recibimos tu proyecto.</span>
              </Heading>

              <Text
                style={{
                  margin: "14px 0 0 0",
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "#C9C4D8",
                }}
              >
                Gracias por escribirnos. Ya estamos revisando tu mensaje y te
                responderemos con una{" "}
                <span style={{ color: "#FFFFFF", fontWeight: 700 }}>
                  propuesta técnica en menos de 24 horas
                </span>
                . Sin compromiso, sin spam.
              </Text>
            </Section>

            {/* Qué sigue — wrapper con padding horizontal, bloque interno con tabla sólida (fix: margin en Section no es Outlook-safe) */}
            <Section style={{ padding: "22px 28px 0 28px" }}>
              <table
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0",
                  backgroundColor: "#1A1A22",
                  border: "1px solid #23232A",
                  borderRadius: "16px",
                }}
              >
                <tr>
                  <td style={{ padding: "18px 18px 16px 18px" }}>
                    <Text
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#8A8896",
                        lineHeight: "1",
                      }}
                    >
                      Qué sigue
                    </Text>

                    {/* Steps — 2 columnas fijas: 32px círculo + resto texto. Sin <Text> anidado en <td> con margin raro */}
                    <table
                      width="100%"
                      cellPadding={0}
                      cellSpacing={0}
                      role="presentation"
                      style={{ borderCollapse: "collapse" }}
                    >
                      {/* Step 1 */}
                      <tr>
                        <td
                          width="32"
                          style={{
                            width: "32px",
                            verticalAlign: "top",
                            padding: "0 10px 14px 0",
                          }}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              backgroundColor: "#2A1F14",
                              border: "1px solid #3D2A16",
                              borderRadius: "9999px",
                              textAlign: "center",
                              lineHeight: "26px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#E17246",
                              display: "block",
                            }}
                          >
                            1
                          </div>
                        </td>
                        <td style={{ verticalAlign: "top", paddingBottom: "14px" }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#FFFFFF",
                              lineHeight: "18px",
                              fontFamily:
                                "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                          >
                            Revisión humana
                          </div>
                          <div
                            style={{
                              marginTop: "3px",
                              fontSize: "12px",
                              color: "#9A98A8",
                              lineHeight: "18px",
                              fontFamily:
                                "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                          >
                            Analizamos tu contexto, objetivos y alcance.
                          </div>
                        </td>
                      </tr>

                      {/* Step 2 */}
                      <tr>
                        <td
                          width="32"
                          style={{
                            width: "32px",
                            verticalAlign: "top",
                            padding: "0 10px 14px 0",
                          }}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              backgroundColor: "#1D1630",
                              border: "1px solid #2E2370",
                              borderRadius: "9999px",
                              textAlign: "center",
                              lineHeight: "26px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#8B7CF8",
                              display: "block",
                            }}
                          >
                            2
                          </div>
                        </td>
                        <td style={{ verticalAlign: "top", paddingBottom: "14px" }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#FFFFFF",
                              lineHeight: "18px",
                              fontFamily:
                                "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                          >
                            Propuesta técnica
                          </div>
                          <div
                            style={{
                              marginTop: "3px",
                              fontSize: "12px",
                              color: "#9A98A8",
                              lineHeight: "18px",
                              fontFamily:
                                "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                          >
                            Stack, tiempos y estimación clara.
                          </div>
                        </td>
                      </tr>

                      {/* Step 3 */}
                      <tr>
                        <td width="32" style={{ width: "32px", verticalAlign: "top", padding: "0 10px 0 0" }}>
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              backgroundColor: "#0F2A22",
                              border: "1px solid #1E4A32",
                              borderRadius: "9999px",
                              textAlign: "center",
                              lineHeight: "26px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#2FE6A6",
                              display: "block",
                            }}
                          >
                            3
                          </div>
                        </td>
                        <td style={{ verticalAlign: "top" }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#FFFFFF",
                              lineHeight: "18px",
                              fontFamily:
                                "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                          >
                            Kickoff
                          </div>
                          <div
                            style={{
                              marginTop: "3px",
                              fontSize: "12px",
                              color: "#9A98A8",
                              lineHeight: "18px",
                              fontFamily:
                                "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                          >
                            Si hay fit, arrancamos en días, no semanas.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </Section>

            {/* CTA — bulletproof table button (solid, no gradient) */}
            <Section style={{ padding: "24px 28px 0 28px", textAlign: "center" }}>
              <table
                align="center"
                cellPadding={0}
                cellSpacing={0}
                style={{ margin: "0 auto", borderCollapse: "collapse" }}
              >
                <tr>
                  <td
                    align="center"
                    // @ts-ignore — bgcolor es atributo Outlook-safe, no tipado en React
                    // eslint-disable-next-line
                    bgColor="#E17246"
                    style={{
                      backgroundColor: "#E17246",
                      borderRadius: "9999px",
                      textAlign: "center",
                    }}
                  >
                    <Link
                      href={WHATSAPP_LINK}
                      style={{
                        display: "inline-block",
                        padding: "13px 26px",
                        fontSize: "13px",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                        textDecoration: "none",
                        lineHeight: "1",
                      }}
                    >
                      Hablar por WhatsApp →
                    </Link>
                  </td>
                </tr>
              </table>

              <Text
                style={{
                  margin: "12px 0 0 0",
                  fontSize: "11px",
                  color: "#8A8896",
                  lineHeight: "1.5",
                  textAlign: "center",
                }}
              >
                O responde a este correo — llega directo a nuestro equipo.
              </Text>
            </Section>

            {/* Footer */}
            <Section style={{ padding: "18px 28px 24px 28px", textAlign: "center" }}>
              <Text
                style={{
                  margin: "0",
                  fontSize: "11px",
                  color: "#8A8896",
                  lineHeight: "1.6",
                  textAlign: "center",
                }}
              >
                SkemaIT — Sistemas de crecimiento & transformación digital
                <br />
                Este es un correo transaccional. Si no fuiste tú, ignóralo.
              </Text>

              <Text
                style={{
                  margin: "14px 0 0 0",
                  fontSize: "11px",
                  textAlign: "center",
                }}
              >
                <Link
                  href="https://skemait.com"
                  style={{
                    color: "#9A98A8",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  skemait.com
                </Link>
                <span style={{ color: "#3A3944", margin: "0 10px" }}>•</span>
                <Link href="https://skemait.com" style={{ color: "#9A98A8", textDecoration: "none" }}>
                  Privacidad
                </Link>
                <span style={{ color: "#3A3944", margin: "0 10px" }}>•</span>
                <Link
                  href={`https://wa.me/5491123456789`}
                  style={{ color: "#9A98A8", textDecoration: "none" }}
                >
                  WhatsApp
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Outside micro footer */}
          <Text
            style={{
              margin: "14px 0 0 0",
              fontSize: "10px",
              color: "#5A5970",
              textAlign: "center",
              lineHeight: "1.5",
            }}
          >
            © 2026 SkemaIT. Todos los derechos reservados. Hecho con ♥ en Colombia.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: "Sofía",
  apellido: "García",
} satisfies WelcomeEmailProps;
