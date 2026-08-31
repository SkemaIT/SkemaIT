# 🔐 Seguridad — Archivo `.env`

> ⚠️ **NUNCA publiques el archivo `.env`**
>
> Este archivo contiene las llaves privadas de **Resend** y **Google Sheets**.
> Si se expone, cualquiera puede enviar correos a tu nombre, consumir tu cuota
> y leer/escribir en tu hoja `TablaClientes`.
>
> **Nunca se debe subir a Git, a Vercel en claro, ni compartir por Discord, Slack, issues o capturas.**

---

## 📦 Qué contiene `.env` en SkemaIT

| Variable | Servicio | Uso en el código | Riesgo si se filtra |
|---|---|---|---|
| `RESEND_API_KEY` | Resend | `src/pages/api/contact.ts:182` — `new Resend(...)` para enviar `WelcomeEmail` y `NewLeadEmail` desde `servicios@skemait.com` | Envío de spam/phishing a tu nombre, bloqueo de dominio `skemait.com` |
| `GOOGLE_SHEET_ID` | Google Sheets | `contact.ts:247` — `spreadsheetId` | Acceso a datos de leads |
| `GOOGLE_SHEET_NAME` | Google Sheets | `contact.ts:32,244` — `range` | Enumeración de estructura |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | GCP IAM | `contact.ts:232` — credenciales `client_email` | **Acceso total** a la hoja (lectura/escritura/borrado) |

> Todas se leen vía `import.meta.env.*` (Astro). Nunca están hardcodeadas.

---

## 🚨 Avisos críticos

### 1. No commitear — jamás
```bash
# ANTES de hacer git add, verifica:
git status
git diff --cached | grep -E "RESEND|GOOGLE_SHEET|SERVICE_ACCOUNT"
# Si ves .env, NO hagas add. Debe salir: ignored
git check-ignore -v .env   # debe decir .gitignore:.env
```
`.env` está en `.gitignore:18`. Si lo ves en `git status`, es que el ignore falló — avisa.

### 2. No compartir en claro
- ❌ Issues/PRs públicos, Discord, Slack, capturas con el archivo abierto, email sin cifrar, Vercel Logs públicos
- ✅ Canal privado 1:1 con el owner, Vercel Dashboard → Project → Settings → Environment Variables, o vault (1Password / Doppler)

### 3. No hardcodear en código
```ts
// ❌ NUNCA
const key = "re_123abc..."

// ✅ SIEMPRE
const resend = new Resend(import.meta.env.RESEND_API_KEY)
```

### 4. No subir a producción en claro
En Vercel no subas el archivo. Pega cada variable en **Environment Variables** (Production / Preview / Development) y haz redeploy. El build las inyecta vía `import.meta.env`.

### 5. Si se filtra, rotar inmediatamente
1. **Resend**: resend.com → API Keys → Delete / Create new → actualiza Vercel Env → redeploy
2. **Google**: GCP Console → IAM → Service Accounts → Keys → Delete / Create new JSON → actualiza `GOOGLE_SERVICE_ACCOUNT_JSON` → redeploy
3. Avisa al owner, revisa historial: `git log --all -p | grep -i "RESEND_API_KEY\|GOOGLE_SHEET_ID"`
4. Si llegó a GitHub, considera `git filter-repo` o rotar igual (la historia queda expuesta)

---

## 🙋 Si necesitas `.env`

> **Pídelo directamente al owner (@jgelv).** No se envía por canales públicos.
> Indica para qué entorno lo necesitas: `development` (local), `preview` o `production`.

**Flujo:**

1. Solicita por DM privado / Vercel invite indicando tu email y entorno.
2. El owner te lo compartirá por **Vercel Env** o vault privado — nunca pegado en chat público.
3. Copia la plantilla y pega valores:

```bash
cp .env.example .env
# abre .env y pega los valores que te pasó el owner
# NO edites .env.example
```

4. Verifica que no se commitea:

```bash
git status  # .env NO debe aparecer
pnpm dev    # debe arrancar sin errores de env
```

---

## 📋 Plantilla — `.env.example`

Existe en la raíz como referencia **sin valores reales**. Cópiala:

```bash
# Ver .env.example
```

Contiene las mismas keys vacías + comentarios. Nunca le pongas valores reales.

---

## ✅ Checklist pre-push (obligatorio)

Antes de cada `git push`:

- [ ] `git status` no muestra `.env`
- [ ] `git diff --cached` no contiene `RESEND_API_KEY` ni `GOOGLE`
- [ ] `.env.example` no tiene valores reales
- [ ] No hay capturas con el archivo `.env` abierto
- [ ] Vercel Env está actualizado si rotaste keys

---

## 🔗 Referencias

- `.gitignore:17-19` — ignora `.env`, `.env.production`, `.env*.local`
- `src/pages/api/contact.ts:164-177` — validación de env con mensaje genérico (no filtra detalle en prod)
- `docs/ENV_SECURITY.md` — este archivo (enlazado desde `README.md`)

> **Resumen: `.env` = llaves de producción. Si lo necesitas, pídemelo a mí. Nunca lo publiques.**
