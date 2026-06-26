"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

type AdminData = {
  hero: any[];
  about: any[];
  styleGallerySettings: any[];
  styleGalleryStyles: any[];
  workProcessSettings: any[];
  workSteps: any[];
  portfolioCategories: any[];
  portfolioTechniques: any[];
  portfolioItems: any[];
  contactSettings: any[];
  socialLinks: any[];
};

type ToastState = {
  open: boolean;
  type: "success" | "error" | "info";
  message: string;
};

const TAB_ITEMS = [
  "Hero",
  "About",
  "Galería de estilos",
  "Proceso",
  "Portfolio",
  "Contacto",
];

const STYLE_ICON_OPTIONS = ["FaUniversity", "FaShieldAlt", "FaLeaf"];
const STEP_ICON_OPTIONS = [
  "FaFlask",
  "FaPaintBrush",
  "FaMagic",
  "FaCheckCircle",
  "FaSearch",
];
const SOCIAL_ICON_OPTIONS = ["FaInstagram", "FaFacebook", "FaWhatsapp"];
const SOCIAL_PLATFORM_OPTIONS = ["INSTAGRAM", "FACEBOOK", "WHATSAPP"];

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function fileToDataUrl(file: File | null) {
  if (!file || file.size === 0) return undefined;
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function getOptionalFile(formData: FormData, key: string) {
  const file = formData.get(key);
  if (!(file instanceof File)) return undefined;
  return fileToDataUrl(file);
}

// ── Subcomponentes de presentación ───────────────────────────────────────────

function PublishedChip({ value }: { value: boolean }) {
  return (
    <Chip
      label={value ? "Publicado" : "Oculto"}
      size="small"
      color={value ? "success" : "default"}
      variant={value ? "filled" : "outlined"}
    />
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  collapsible = true,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.04)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, pb: open ? undefined : "20px !important" }}>
        <Stack spacing={open ? 3 : 0}>
          <Box
            onClick={collapsible ? () => setOpen((v) => !v) : undefined}
            sx={collapsible ? { cursor: "pointer", userSelect: "none" } : undefined}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "var(--font-display), Georgia, serif",
                    color: "white",
                    lineHeight: 1.1,
                  }}
                >
                  {title}
                </Typography>
                {subtitle ? (
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", mt: 0.6 }}>
                    {subtitle}
                  </Typography>
                ) : null}
              </Box>
              {collapsible ? (
                <IconButton
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    flexShrink: 0,
                    ml: 1,
                    transition: "transform 0.25s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    "&:hover": { color: "#c8853a" },
                  }}
                  onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              ) : null}
            </Stack>
          </Box>
          <Collapse in={open} unmountOnExit>
            <Stack spacing={3}>
              {children}
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}

/** Preview de imagen: muestra la actual (url) o la recién elegida (dataUrl). */
function ImagePreviewField({
  name,
  label,
  currentUrl,
  previewKey,
  previews,
  onPreview,
}: {
  name: string;
  label: string;
  currentUrl?: string;
  previewKey: string;
  previews: Record<string, string>;
  onPreview: (key: string, src: string) => void;
}) {
  const src = previews[previewKey] ?? currentUrl;
  return (
    <Stack spacing={1}>
      {src ? (
        <Box
          component="img"
          src={src}
          alt={label}
          sx={{
            width: "100%",
            maxHeight: 140,
            objectFit: "contain",
            borderRadius: 2,
            backgroundColor: "rgba(168,105,58,0.05)",
            border: "1px solid rgba(168,105,58,0.12)",
          }}
        />
      ) : null}
      <Button
        component="label"
        variant="outlined"
        fullWidth
        size="small"
        sx={{ borderStyle: "dashed" }}
      >
        {src ? `Cambiar: ${label}` : `Subir: ${label}`}
        <input
          name={name}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onPreview(previewKey, String(reader.result));
            reader.readAsDataURL(file);
          }}
        />
      </Button>
    </Stack>
  );
}

/** Selector múltiple de técnicas con checkboxes. */
function TechniqueCheckboxes({
  allTechniques,
  selected,
  onChange,
}: {
  allTechniques: any[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <Box>
      <FormLabel sx={{ fontSize: "0.8rem", fontWeight: 600, mb: 0.5, display: "block" }}>
        Técnicas
      </FormLabel>
      <FormGroup row>
        {allTechniques.map((t) => (
          <FormControlLabel
            key={t.id}
            control={
              <Checkbox
                size="small"
                checked={selected.includes(t.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selected, t.id]);
                  } else {
                    onChange(selected.filter((id) => id !== t.id));
                  }
                }}
              />
            }
            label={<Typography variant="body2">{t.name}</Typography>}
          />
        ))}
      </FormGroup>
    </Box>
  );
}

/** Ítem colapsable para listas de elementos (estilos, pasos, portfolio items). */
function CollapsibleItem({
  label,
  badge,
  badgeColor,
  children,
  defaultOpen = false,
}: {
  label: string;
  badge?: string;
  badgeColor?: "success" | "default" | "error" | "warning" | "info";
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, border: "1px solid rgba(168,105,58,0.14)" }}
    >
      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{
          px: 2.5,
          py: 1.8,
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          "&:hover": { background: "rgba(200,133,58,0.05)" },
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography
            fontWeight={600}
            sx={{
              color: "white",
              fontSize: "0.95rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Typography>
          {badge ? (
            <Chip
              label={badge}
              size="small"
              color={badgeColor ?? "default"}
              variant={badgeColor === "success" ? "filled" : "outlined"}
            />
          ) : null}
        </Stack>
        <IconButton
          size="small"
          sx={{
            color: "rgba(255,255,255,0.5)",
            flexShrink: 0,
            transition: "transform 0.25s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            "&:hover": { color: "#c8853a" },
          }}
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ px: 2.5, pb: 2.5, pt: 0.5 }}>
          {children}
        </Box>
      </Collapse>
    </Card>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function AdminDashboard({ initialData }: { initialData: AdminData }) {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    type: "info",
    message: "",
  });
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // Técnicas seleccionadas por item del portfolio (id del item → ids de técnicas)
  const [itemTechIds, setItemTechIds] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    initialData.portfolioItems.forEach((item: any) => {
      map[item.id] = (item.techniques ?? []).map((t: any) => t.id);
    });
    return map;
  });
  const [newItemTechIds, setNewItemTechIds] = useState<string[]>([]);

  // Previews de imágenes por clave descriptiva
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const addPreview = (key: string, src: string) =>
    setPreviews((prev) => ({ ...prev, [key]: src }));

  const latestHero = initialData.hero[0] ?? null;
  const latestAbout = initialData.about[0] ?? null;
  const styleSettings = initialData.styleGallerySettings[0] ?? null;
  const workSettings = initialData.workProcessSettings[0] ?? null;
  const contactSettings = initialData.contactSettings[0] ?? null;

  const withRequest = async (
    key: string,
    request: () => Promise<Response>,
    successMessage: string,
    pendingMessage: string = "Procesando cambio..."
  ) => {
    setBusyKey(key);
    setToast({
      open: true,
      type: "info",
      message: pendingMessage,
    });
    try {
      const response = await request();
      const payload = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        router.push("/admin/login");
        router.refresh();
        return;
      }
      if (!response.ok) {
        throw new Error(payload.error ?? "No fue posible guardar el cambio.");
      }

      setToast({
        open: true,
        type: "success",
        message: successMessage,
      });
      router.refresh();
    } catch (error) {
      setToast({
        open: true,
        type: "error",
        message: error instanceof Error ? error.message : "Error inesperado.",
      });
    } finally {
      setBusyKey(null);
    }
  };

  const sendJson = (url: string, method: string, body?: Record<string, unknown>) =>
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

  const handleLogout = async () => {
    await withRequest(
      "logout",
      () => fetch("/api/auth/session", { method: "DELETE" }),
      "Sesión cerrada."
    );
    router.push("/admin/login");
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", color: "white" }}>
      {/* Header sticky */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          px: { xs: 2.5, md: 5 },
          py: { xs: 2, md: 2.5 },
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(25,15,8,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1.5}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: { xs: "1.7rem", md: "2.2rem" },
                lineHeight: 1,
                mb: 0.4,
                color: "white",
              }}
            >
              Panel de Contenido
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
              Administra las secciones del sitio, sube imágenes y gestiona el catálogo de piezas.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleLogout}
            disabled={busyKey === "logout"}
            sx={{
              color: "rgba(255,255,255,0.8)",
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              flexShrink: 0,
              "&:hover": { borderColor: "#c8853a", color: "#c8853a", background: "rgba(200,133,58,0.08)" },
            }}
          >
            Cerrar sesión
          </Button>
        </Stack>
      </Box>

      {/* Body */}
      <Box sx={{ maxWidth: 1480, mx: "auto", px: { xs: 2, md: 5 }, py: { xs: 2, md: 3 } }}>
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                mb: 3,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "0.01em",
                  color: "rgba(255,255,255,0.5)",
                  "&.Mui-selected": { color: "white" },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#c8853a",
                  height: 2,
                  borderRadius: 2,
                },
                "& .MuiTabs-scrollButtons": { color: "rgba(255,255,255,0.5)" },
              }}
            >
              {TAB_ITEMS.map((item) => (
                <Tab key={item} label={item} />
              ))}
            </Tabs>

            <Stack spacing={3}>
              {/* ── HERO ── */}
              {tab === 0 ? (
                <SectionCard
                  title="Hero principal"
                  subtitle="Edita el banner principal. Los cambios se reflejan de inmediato en el sitio."
                >
                  <Box
                    component="form"
                    onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const imageBase64 = await getOptionalFile(formData, "image");
                      const ogImageBase64 = await getOptionalFile(formData, "ogImage");
                      const id = String(formData.get("id") ?? "");

                      await withRequest(
                        "hero-save",
                        () =>
                          sendJson(
                            id ? `/api/hero/${id}` : "/api/hero",
                            id ? "PUT" : "POST",
                            {
                              title: formData.get("title"),
                              description: formData.get("description"),
                              buttonText: formData.get("buttonText"),
                              metaTitle: formData.get("metaTitle"),
                              metaDescription: formData.get("metaDescription"),
                              published: formData.get("published") === "on",
                              ...(imageBase64 ? { imageBase64 } : {}),
                              ...(ogImageBase64 ? { ogImageBase64 } : {}),
                            }
                          ),
                        id ? "Hero actualizado." : "Hero creado."
                      );
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="id"
                          type="hidden"
                          defaultValue={latestHero?.id ?? ""}
                        />
                        <TextField
                          name="title"
                          label="Título"
                          fullWidth
                          defaultValue={latestHero?.title ?? ""}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="buttonText"
                          label="Texto del botón"
                          fullWidth
                          defaultValue={latestHero?.buttonText ?? ""}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="description"
                          label="Descripción"
                          multiline
                          minRows={4}
                          fullWidth
                          defaultValue={latestHero?.description ?? ""}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="metaTitle"
                          label="Meta title (SEO)"
                          fullWidth
                          defaultValue={latestHero?.metaTitle ?? ""}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="metaDescription"
                          label="Meta description (SEO)"
                          fullWidth
                          defaultValue={latestHero?.metaDescription ?? ""}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ImagePreviewField
                          name="image"
                          label="Imagen principal"
                          currentUrl={
                            latestHero?.id ? `/api/hero/${latestHero.id}/image` : undefined
                          }
                          previewKey="hero-image"
                          previews={previews}
                          onPreview={addPreview}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ImagePreviewField
                          name="ogImage"
                          label="Imagen OG (redes sociales)"
                          currentUrl={
                            latestHero?.id
                              ? `/api/hero/${latestHero.id}/og-image`
                              : undefined
                          }
                          previewKey="hero-og"
                          previews={previews}
                          onPreview={addPreview}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="published"
                              defaultChecked={latestHero?.published ?? true}
                            />
                          }
                          label="Publicado"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={busyKey === "hero-save"}
                        >
                          Guardar hero
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {initialData.hero.length > 0 ? (
                    <>
                      <Divider />
                      <Stack spacing={1.5}>
                        {initialData.hero.map((item) => (
                          <Stack
                            key={item.id}
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            spacing={1.5}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              backgroundColor: "rgba(168,105,58,0.05)",
                              border: "1px solid rgba(168,105,58,0.08)",
                            }}
                          >
                            <Stack direction="row" spacing={1.2} alignItems="center">
                              <Typography fontWeight={700}>{item.title}</Typography>
                              <PublishedChip value={item.published} />
                            </Stack>
                            <Button
                              color="error"
                              size="small"
                              onClick={() =>
                                withRequest(
                                  `hero-delete-${item.id}`,
                                  () => fetch(`/api/hero/${item.id}`, { method: "DELETE" }),
                                  "Hero eliminado."
                                )
                              }
                            >
                              Eliminar
                            </Button>
                          </Stack>
                        ))}
                      </Stack>
                    </>
                  ) : null}
                </SectionCard>
              ) : null}

              {/* ── ABOUT ── */}
              {tab === 1 ? (
                <SectionCard
                  title="Sobre nosotros"
                  subtitle="Historia, imagen y campos SEO de la sección About."
                >
                  <Box
                    component="form"
                    onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const imageBase64 = await getOptionalFile(formData, "image");
                      const ogImageBase64 = await getOptionalFile(formData, "ogImage");
                      const id = String(formData.get("id") ?? "");

                      await withRequest(
                        "about-save",
                        () =>
                          sendJson(
                            id ? `/api/about/${id}` : "/api/about",
                            id ? "PUT" : "POST",
                            {
                              title: formData.get("title"),
                              paragraphs: splitLines(
                                String(formData.get("paragraphs") ?? "")
                              ),
                              metaTitle: formData.get("metaTitle"),
                              metaDescription: formData.get("metaDescription"),
                              published: formData.get("published") === "on",
                              ...(imageBase64 ? { imageBase64 } : {}),
                              ...(ogImageBase64 ? { ogImageBase64 } : {}),
                            }
                          ),
                        id ? "About actualizado." : "About creado."
                      );
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="id"
                          type="hidden"
                          defaultValue={latestAbout?.id ?? ""}
                        />
                        <TextField
                          name="title"
                          label="Título"
                          fullWidth
                          defaultValue={latestAbout?.title ?? ""}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="paragraphs"
                          label="Párrafos (uno por línea)"
                          multiline
                          minRows={8}
                          fullWidth
                          defaultValue={
                            Array.isArray(latestAbout?.paragraphs)
                              ? latestAbout.paragraphs.join("\n")
                              : ""
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="metaTitle"
                          label="Meta title (SEO)"
                          fullWidth
                          defaultValue={latestAbout?.metaTitle ?? ""}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="metaDescription"
                          label="Meta description (SEO)"
                          fullWidth
                          defaultValue={latestAbout?.metaDescription ?? ""}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ImagePreviewField
                          name="image"
                          label="Imagen principal"
                          currentUrl={
                            latestAbout?.id
                              ? `/api/about/${latestAbout.id}/image`
                              : undefined
                          }
                          previewKey="about-image"
                          previews={previews}
                          onPreview={addPreview}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ImagePreviewField
                          name="ogImage"
                          label="Imagen OG"
                          currentUrl={
                            latestAbout?.id
                              ? `/api/about/${latestAbout.id}/og-image`
                              : undefined
                          }
                          previewKey="about-og"
                          previews={previews}
                          onPreview={addPreview}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="published"
                              defaultChecked={latestAbout?.published ?? true}
                            />
                          }
                          label="Publicado"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={busyKey === "about-save"}
                        >
                          Guardar about
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </SectionCard>
              ) : null}

              {/* ── STYLE GALLERY ── */}
              {tab === 2 ? (
                <>
                  <SectionCard title="Encabezado de galería">
                    <Box
                      component="form"
                      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const id = String(formData.get("id") ?? "");
                        withRequest(
                          "style-settings-save",
                          () =>
                            sendJson(
                              id
                                ? `/api/style-gallery/settings/${id}`
                                : "/api/style-gallery/settings",
                              id ? "PUT" : "POST",
                              {
                                title: formData.get("title"),
                                description: formData.get("description"),
                              }
                            ),
                          id ? "Ajustes actualizados." : "Ajustes creados."
                        );
                      }}
                    >
                      <Stack spacing={2}>
                        <TextField
                          name="id"
                          type="hidden"
                          defaultValue={styleSettings?.id ?? ""}
                        />
                        <TextField
                          name="title"
                          label="Título de la sección"
                          defaultValue={styleSettings?.title ?? ""}
                          required
                        />
                        <TextField
                          name="description"
                          label="Descripción"
                          defaultValue={styleSettings?.description ?? ""}
                          multiline
                          minRows={3}
                          required
                        />
                        <Box>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={busyKey === "style-settings-save"}
                          >
                            Guardar encabezado
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  </SectionCard>

                  <SectionCard title="Estilos de la galería">
                    <Stack spacing={2.5}>
                      {initialData.styleGalleryStyles.map((style) => (
                        <CollapsibleItem
                          key={style.id}
                          label={style.name}
                          badge={style.published ? "Publicado" : "Oculto"}
                          badgeColor={style.published ? "success" : "default"}
                        >
                            <Box
                              component="form"
                              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                withRequest(
                                  `style-gallery-style-${style.id}`,
                                  () =>
                                    sendJson(`/api/style-gallery/styles/${style.id}`, "PUT", {
                                      name: formData.get("name"),
                                      description: formData.get("description"),
                                      icon: formData.get("icon") || null,
                                      techniques: splitLines(
                                        String(formData.get("techniques") ?? "")
                                      ),
                                      examples: formData.get("examples"),
                                      order: Number(formData.get("order") ?? 0),
                                      published: formData.get("published") === "on",
                                    }),
                                  "Estilo actualizado."
                                );
                              }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    name="name"
                                    label="Nombre"
                                    fullWidth
                                    defaultValue={style.name}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    name="icon"
                                    label="Icono"
                                    fullWidth
                                    select
                                    defaultValue={style.icon ?? ""}
                                  >
                                    {STYLE_ICON_OPTIONS.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    name="order"
                                    label="Orden"
                                    type="number"
                                    fullWidth
                                    defaultValue={style.order}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    name="description"
                                    label="Descripción"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    defaultValue={style.description}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    name="techniques"
                                    label="Técnicas (una por línea)"
                                    multiline
                                    minRows={4}
                                    fullWidth
                                    defaultValue={
                                      Array.isArray(style.techniques)
                                        ? style.techniques.join("\n")
                                        : ""
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    name="examples"
                                    label="Ejemplos (separados por coma)"
                                    multiline
                                    minRows={4}
                                    fullWidth
                                    defaultValue={style.examples ?? ""}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Stack
                                    direction={{ xs: "column", md: "row" }}
                                    justifyContent="space-between"
                                    spacing={1.5}
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          name="published"
                                          defaultChecked={style.published}
                                        />
                                      }
                                      label="Publicado"
                                    />
                                    <Stack direction="row" spacing={1.5}>
                                      <Button type="submit" variant="contained">
                                        Guardar
                                      </Button>
                                      <Button
                                        color="error"
                                        onClick={() =>
                                          withRequest(
                                            `style-gallery-style-delete-${style.id}`,
                                            () =>
                                              fetch(
                                                `/api/style-gallery/styles/${style.id}`,
                                                { method: "DELETE" }
                                              ),
                                            "Estilo eliminado."
                                          )
                                        }
                                      >
                                        Eliminar
                                      </Button>
                                    </Stack>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Box>
                        </CollapsibleItem>
                      ))}

                      <Divider />

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "var(--font-display), Georgia, serif",
                            mb: 2,
                          }}
                        >
                          Nuevo estilo
                        </Typography>
                        <Box
                          component="form"
                          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            withRequest(
                              "style-gallery-create",
                              () =>
                                sendJson("/api/style-gallery/styles", "POST", {
                                  name: formData.get("name"),
                                  description: formData.get("description"),
                                  icon: formData.get("icon") || null,
                                  techniques: splitLines(
                                    String(formData.get("techniques") ?? "")
                                  ),
                                  examples: formData.get("examples"),
                                  order: Number(formData.get("order") ?? 0),
                                  published: formData.get("published") === "on",
                                }),
                              "Estilo creado."
                            );
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField name="name" label="Nombre" fullWidth required />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                name="icon"
                                label="Icono"
                                fullWidth
                                select
                                defaultValue=""
                              >
                                {STYLE_ICON_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                name="order"
                                label="Orden"
                                fullWidth
                                type="number"
                                defaultValue={0}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                name="description"
                                label="Descripción"
                                multiline
                                minRows={3}
                                fullWidth
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                name="techniques"
                                label="Técnicas (una por línea)"
                                multiline
                                minRows={4}
                                fullWidth
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                name="examples"
                                label="Ejemplos"
                                multiline
                                minRows={4}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={<Checkbox name="published" defaultChecked />}
                                label="Publicado"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button type="submit" variant="contained">
                                Crear estilo
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Stack>
                  </SectionCard>
                </>
              ) : null}

              {/* ── WORK PROCESS ── */}
              {tab === 3 ? (
                <>
                  <SectionCard title="Encabezado del proceso">
                    <Box
                      component="form"
                      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        withRequest(
                          "work-settings-save",
                          () =>
                            sendJson(
                              "/api/work-process/settings",
                              workSettings ? "PUT" : "POST",
                              {
                                title: formData.get("title"),
                                description: formData.get("description"),
                                stepLabel: formData.get("stepLabel"),
                              }
                            ),
                          workSettings ? "Ajustes actualizados." : "Ajustes creados."
                        );
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="title"
                            label="Título"
                            fullWidth
                            defaultValue={workSettings?.title ?? ""}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="stepLabel"
                            label="Etiqueta del paso"
                            fullWidth
                            defaultValue={workSettings?.stepLabel ?? "Paso"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="description"
                            label="Descripción"
                            fullWidth
                            multiline
                            minRows={3}
                            defaultValue={workSettings?.description ?? ""}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button type="submit" variant="contained">
                            Guardar encabezado
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </SectionCard>

                  <SectionCard title="Pasos del proceso">
                    <Stack spacing={2}>
                      {initialData.workSteps.map((step) => (
                        <CollapsibleItem
                          key={step.id}
                          label={`Paso ${step.order}: ${step.title}`}
                          badge={step.published ? "Publicado" : "Oculto"}
                          badgeColor={step.published ? "success" : "default"}
                        >
                            <Box
                              component="form"
                              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                withRequest(
                                  `work-step-${step.id}`,
                                  () =>
                                    sendJson(`/api/work-process/steps/${step.id}`, "PUT", {
                                      title: formData.get("title"),
                                      description: formData.get("description"),
                                      icon: formData.get("icon") || null,
                                      order: Number(formData.get("order") ?? 0),
                                      published: formData.get("published") === "on",
                                    }),
                                  "Paso actualizado."
                                );
                              }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <TextField
                                    name="title"
                                    label="Título"
                                    fullWidth
                                    defaultValue={step.title}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <TextField
                                    name="icon"
                                    label="Icono"
                                    fullWidth
                                    select
                                    defaultValue={step.icon ?? ""}
                                  >
                                    {STEP_ICON_OPTIONS.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <TextField
                                    name="order"
                                    label="Orden"
                                    type="number"
                                    fullWidth
                                    defaultValue={step.order}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    name="description"
                                    label="Descripción"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    defaultValue={step.description}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Stack
                                    direction={{ xs: "column", md: "row" }}
                                    justifyContent="space-between"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          name="published"
                                          defaultChecked={step.published}
                                        />
                                      }
                                      label="Publicado"
                                    />
                                    <Stack direction="row" spacing={1.5}>
                                      <Button type="submit" variant="contained">
                                        Guardar
                                      </Button>
                                      <Button
                                        color="error"
                                        onClick={() =>
                                          withRequest(
                                            `work-step-delete-${step.id}`,
                                            () =>
                                              fetch(`/api/work-process/steps/${step.id}`, {
                                                method: "DELETE",
                                              }),
                                            "Paso eliminado."
                                          )
                                        }
                                      >
                                        Eliminar
                                      </Button>
                                    </Stack>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Box>
                        </CollapsibleItem>
                      ))}

                      <Divider />

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "var(--font-display), Georgia, serif",
                            mb: 2,
                          }}
                        >
                          Nuevo paso
                        </Typography>
                        <Box
                          component="form"
                          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            withRequest(
                              "work-step-create",
                              () =>
                                sendJson("/api/work-process/steps", "POST", {
                                  title: formData.get("title"),
                                  description: formData.get("description"),
                                  icon: formData.get("icon") || null,
                                  order: Number(formData.get("order") ?? 0),
                                  published: formData.get("published") === "on",
                                }),
                              "Paso creado."
                            );
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <TextField name="title" label="Título" fullWidth required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="icon"
                                label="Icono"
                                fullWidth
                                select
                                defaultValue=""
                              >
                                {STEP_ICON_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="order"
                                label="Orden"
                                type="number"
                                fullWidth
                                defaultValue={0}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                name="description"
                                label="Descripción"
                                fullWidth
                                multiline
                                minRows={3}
                                required
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={<Checkbox name="published" defaultChecked />}
                                label="Publicado"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button type="submit" variant="contained">
                                Crear paso
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Stack>
                  </SectionCard>
                </>
              ) : null}

              {/* ── PORTFOLIO ── */}
              {tab === 4 ? (
                <>
                  <SectionCard title="Categorías">
                    <Stack spacing={2}>
                      {initialData.portfolioCategories.map((category) => (
                        <Box
                          key={category.id}
                          component="form"
                          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            withRequest(
                              `portfolio-category-${category.id}`,
                              () =>
                                sendJson(
                                  `/api/portfolio/categories/${category.id}`,
                                  "PUT",
                                  {
                                    name: formData.get("name"),
                                    slug: formData.get("slug"),
                                  }
                                ),
                              "Categoría actualizada."
                            );
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="name"
                                label="Nombre"
                                fullWidth
                                defaultValue={category.name}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="slug"
                                label="Slug"
                                fullWidth
                                defaultValue={category.slug}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Stack direction="row" spacing={1.5}>
                                <Button type="submit" variant="contained">
                                  Guardar
                                </Button>
                                <Button
                                  color="error"
                                  onClick={() =>
                                    withRequest(
                                      `portfolio-category-delete-${category.id}`,
                                      () =>
                                        fetch(
                                          `/api/portfolio/categories/${category.id}`,
                                          { method: "DELETE" }
                                        ),
                                      "Categoría eliminada."
                                    )
                                  }
                                >
                                  Eliminar
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Divider />
                      <Box
                        component="form"
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          withRequest(
                            "portfolio-category-create",
                            () =>
                              sendJson("/api/portfolio/categories", "POST", {
                                name: formData.get("name"),
                                slug: formData.get("slug"),
                              }),
                            "Categoría creada."
                          );
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={5}>
                            <TextField
                              name="name"
                              label="Nueva categoría"
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <TextField name="slug" label="Slug" fullWidth />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button type="submit" variant="contained" fullWidth>
                              Crear
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>
                  </SectionCard>

                  <SectionCard title="Técnicas">
                    <Stack spacing={2}>
                      {initialData.portfolioTechniques.map((technique) => (
                        <Box
                          key={technique.id}
                          component="form"
                          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            withRequest(
                              `portfolio-technique-${technique.id}`,
                              () =>
                                sendJson(
                                  `/api/portfolio/techniques/${technique.id}`,
                                  "PUT",
                                  {
                                    name: formData.get("name"),
                                    slug: formData.get("slug"),
                                  }
                                ),
                              "Técnica actualizada."
                            );
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="name"
                                label="Nombre"
                                fullWidth
                                defaultValue={technique.name}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="slug"
                                label="Slug"
                                fullWidth
                                defaultValue={technique.slug}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Stack direction="row" spacing={1.5}>
                                <Button type="submit" variant="contained">
                                  Guardar
                                </Button>
                                <Button
                                  color="error"
                                  onClick={() =>
                                    withRequest(
                                      `portfolio-technique-delete-${technique.id}`,
                                      () =>
                                        fetch(
                                          `/api/portfolio/techniques/${technique.id}`,
                                          { method: "DELETE" }
                                        ),
                                      "Técnica eliminada."
                                    )
                                  }
                                >
                                  Eliminar
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Divider />
                      <Box
                        component="form"
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          withRequest(
                            "portfolio-technique-create",
                            () =>
                              sendJson("/api/portfolio/techniques", "POST", {
                                name: formData.get("name"),
                                slug: formData.get("slug"),
                              }),
                            "Técnica creada."
                          );
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={5}>
                            <TextField
                              name="name"
                              label="Nueva técnica"
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <TextField name="slug" label="Slug" fullWidth />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button type="submit" variant="contained" fullWidth>
                              Crear
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>
                  </SectionCard>

                  <SectionCard title="Ítems del catálogo">
                    <Stack spacing={3}>
                      {initialData.portfolioItems.map((item) => (
                        <CollapsibleItem
                          key={item.id}
                          label={item.title}
                          badge={item.published ? "Publicado" : "Oculto"}
                          badgeColor={item.published ? "success" : "default"}
                        >
                            <Stack spacing={3}>
                              {/* Datos del ítem */}
                              <Box
                                component="form"
                                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                                  event.preventDefault();
                                  const formData = new FormData(event.currentTarget);
                                  withRequest(
                                    `portfolio-item-${item.id}`,
                                    () =>
                                      sendJson(`/api/portfolio/items/${item.id}`, "PUT", {
                                        title: formData.get("title"),
                                        slug: formData.get("slug"),
                                        description: formData.get("description"),
                                        dimensions: formData.get("dimensions"),
                                        categoryId: formData.get("categoryId"),
                                        techniqueIds: itemTechIds[item.id] ?? [],
                                        order: Number(formData.get("order") ?? 0),
                                        published: formData.get("published") === "on",
                                        metaTitle: formData.get("metaTitle"),
                                        metaDescription: formData.get("metaDescription"),
                                      }),
                                    "Ítem actualizado."
                                  );
                                }}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      name="title"
                                      label="Título"
                                      fullWidth
                                      defaultValue={item.title}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      name="slug"
                                      label="Slug"
                                      fullWidth
                                      defaultValue={item.slug}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      name="dimensions"
                                      label="Dimensiones"
                                      fullWidth
                                      defaultValue={item.dimensions ?? ""}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      name="description"
                                      label="Descripción"
                                      fullWidth
                                      multiline
                                      minRows={3}
                                      defaultValue={item.description}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      name="categoryId"
                                      label="Categoría"
                                      fullWidth
                                      select
                                      defaultValue={item.categoryId}
                                    >
                                      {initialData.portfolioCategories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                          {cat.name}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      name="order"
                                      label="Orden"
                                      type="number"
                                      fullWidth
                                      defaultValue={item.order}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <Stack direction="row" spacing={1} alignItems="center" height="100%">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            name="published"
                                            defaultChecked={item.published}
                                          />
                                        }
                                        label="Publicado"
                                      />
                                    </Stack>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TechniqueCheckboxes
                                      allTechniques={initialData.portfolioTechniques}
                                      selected={itemTechIds[item.id] ?? []}
                                      onChange={(ids) =>
                                        setItemTechIds((prev) => ({
                                          ...prev,
                                          [item.id]: ids,
                                        }))
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      name="metaTitle"
                                      label="Meta title (SEO)"
                                      fullWidth
                                      defaultValue={item.metaTitle ?? ""}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      name="metaDescription"
                                      label="Meta description (SEO)"
                                      fullWidth
                                      defaultValue={item.metaDescription ?? ""}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Stack direction="row" spacing={1.5}>
                                      <Button type="submit" variant="contained">
                                        Guardar ítem
                                      </Button>
                                      <Button
                                        color="error"
                                        onClick={() =>
                                          withRequest(
                                            `portfolio-item-delete-${item.id}`,
                                            () =>
                                              fetch(`/api/portfolio/items/${item.id}`, {
                                                method: "DELETE",
                                              }),
                                            "Ítem eliminado."
                                          )
                                        }
                                      >
                                        Eliminar ítem
                                      </Button>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              </Box>

                              <Divider />

                              {/* Imágenes del ítem */}
                              <Typography
                                variant="h6"
                                sx={{ fontFamily: "var(--font-display), Georgia, serif" }}
                              >
                                Imágenes
                              </Typography>
                              <Stack spacing={2}>
                                {item.images.map((image: any) => (
                                  <Box
                                    key={image.id}
                                    component="form"
                                    onSubmit={async (
                                      event: React.FormEvent<HTMLFormElement>
                                    ) => {
                                      event.preventDefault();
                                      const formData = new FormData(event.currentTarget);
                                      const imageBase64 = await getOptionalFile(
                                        formData,
                                        "image"
                                      );
                                      await withRequest(
                                        `portfolio-image-${image.id}`,
                                        () =>
                                          sendJson(`/api/portfolio/images/${image.id}`, "PUT", {
                                            alt: formData.get("alt"),
                                            order: Number(formData.get("order") ?? 0),
                                            ...(imageBase64 ? { imageBase64 } : {}),
                                          }),
                                        "Imagen actualizada."
                                      );
                                    }}
                                  >
                                    <Grid container spacing={2} alignItems="center">
                                      <Grid item xs={12} md={2}>
                                        <Box
                                          component="img"
                                          src={
                                            previews[`img-${image.id}`] ??
                                            `/api/portfolio/images/${image.id}?asImage=true`
                                          }
                                          alt={image.alt ?? item.title}
                                          sx={{
                                            width: "100%",
                                            maxHeight: 120,
                                            objectFit: "contain",
                                            borderRadius: 2,
                                            backgroundColor: "rgba(168,105,58,0.05)",
                                            border: "1px solid rgba(168,105,58,0.12)",
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <TextField
                                          name="alt"
                                          label="Texto alt"
                                          fullWidth
                                          defaultValue={image.alt ?? ""}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={2}>
                                        <TextField
                                          name="order"
                                          label="Orden"
                                          type="number"
                                          fullWidth
                                          defaultValue={image.order}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={2}>
                                        <Button
                                          component="label"
                                          variant="outlined"
                                          fullWidth
                                          size="small"
                                          sx={{ borderStyle: "dashed" }}
                                        >
                                          Reemplazar
                                          <input
                                            name="image"
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              const reader = new FileReader();
                                              reader.onload = () =>
                                                addPreview(
                                                  `img-${image.id}`,
                                                  String(reader.result)
                                                );
                                              reader.readAsDataURL(file);
                                            }}
                                          />
                                        </Button>
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <Stack direction="row" spacing={1}>
                                          <Button type="submit" variant="contained">
                                            Guardar
                                          </Button>
                                          <Button
                                            color="error"
                                            onClick={() =>
                                              withRequest(
                                                `portfolio-image-delete-${image.id}`,
                                                () =>
                                                  fetch(`/api/portfolio/images/${image.id}`, {
                                                    method: "DELETE",
                                                  }),
                                                "Imagen eliminada."
                                              )
                                            }
                                          >
                                            Borrar
                                          </Button>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                ))}
                              </Stack>

                              {/* Agregar imagen */}
                              <Box
                                component="form"
                                onSubmit={async (
                                  event: React.FormEvent<HTMLFormElement>
                                ) => {
                                  event.preventDefault();
                                  const formData = new FormData(event.currentTarget);
                                  const imageBase64 = await getOptionalFile(
                                    formData,
                                    "image"
                                  );
                                  if (!imageBase64) {
                                    setToast({
                                      open: true,
                                      type: "error",
                                      message:
                                        "Selecciona una imagen antes de guardarla.",
                                    });
                                    return;
                                  }
                                  await withRequest(
                                    `portfolio-image-create-${item.id}`,
                                    () =>
                                      sendJson("/api/portfolio/images", "POST", {
                                        itemId: item.id,
                                        alt: formData.get("alt"),
                                        order: Number(formData.get("order") ?? 0),
                                        imageBase64,
                                      }),
                                    "Imagen agregada."
                                  );
                                }}
                              >
                                <Grid container spacing={2} alignItems="center">
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      name="alt"
                                      label="Alt de la nueva imagen"
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      name="order"
                                      label="Orden"
                                      type="number"
                                      fullWidth
                                      defaultValue={0}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <ImagePreviewField
                                      name="image"
                                      label="Nueva imagen"
                                      previewKey={`new-img-${item.id}`}
                                      previews={previews}
                                      onPreview={addPreview}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <Button type="submit" variant="contained" fullWidth>
                                      Agregar imagen
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Stack>
                        </CollapsibleItem>
                      ))}

                      <Divider />

                      {/* Nuevo ítem */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "var(--font-display), Georgia, serif",
                            mb: 2,
                          }}
                        >
                          Nuevo ítem
                        </Typography>
                        <Box
                          component="form"
                          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            withRequest(
                              "portfolio-item-create",
                              () =>
                                sendJson("/api/portfolio/items", "POST", {
                                  title: formData.get("title"),
                                  slug: formData.get("slug"),
                                  description: formData.get("description"),
                                  dimensions: formData.get("dimensions"),
                                  categoryId: formData.get("categoryId"),
                                  techniqueIds: newItemTechIds,
                                  order: Number(formData.get("order") ?? 0),
                                  published: formData.get("published") === "on",
                                  metaTitle: formData.get("metaTitle"),
                                  metaDescription: formData.get("metaDescription"),
                                }),
                              "Ítem creado."
                            );
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <TextField name="title" label="Título" fullWidth required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField name="slug" label="Slug" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField name="dimensions" label="Dimensiones" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                name="description"
                                label="Descripción"
                                fullWidth
                                multiline
                                minRows={3}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="categoryId"
                                label="Categoría"
                                fullWidth
                                select
                                required
                                defaultValue=""
                              >
                                {initialData.portfolioCategories.map((cat) => (
                                  <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                name="order"
                                label="Orden"
                                fullWidth
                                type="number"
                                defaultValue={0}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <FormControlLabel
                                control={<Checkbox name="published" defaultChecked />}
                                label="Publicado"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TechniqueCheckboxes
                                allTechniques={initialData.portfolioTechniques}
                                selected={newItemTechIds}
                                onChange={setNewItemTechIds}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField name="metaTitle" label="Meta title (SEO)" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                name="metaDescription"
                                label="Meta description (SEO)"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button type="submit" variant="contained">
                                Crear ítem
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Stack>
                  </SectionCard>
                </>
              ) : null}

              {/* ── CONTACTO ── */}
              {tab === 5 ? (
                <>
                  <SectionCard title="Configuración del formulario">
                    <Box
                      component="form"
                      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const id = String(formData.get("id") ?? "");
                        withRequest(
                          "contact-settings-save",
                          () =>
                            sendJson(
                              id
                                ? `/api/contact/settings/${id}`
                                : "/api/contact/settings",
                              id ? "PUT" : "POST",
                              {
                                title: formData.get("title"),
                                description: formData.get("description"),
                                formNameLabel: formData.get("formNameLabel"),
                                formEmailLabel: formData.get("formEmailLabel"),
                                formMessageLabel: formData.get("formMessageLabel"),
                                submitSuccessText: formData.get("submitSuccessText"),
                                submitErrorText: formData.get("submitErrorText"),
                              }
                            ),
                          id
                            ? "Configuración actualizada."
                            : "Configuración creada."
                        );
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            name="id"
                            type="hidden"
                            defaultValue={contactSettings?.id ?? ""}
                          />
                          <TextField
                            name="title"
                            label="Título de la sección"
                            fullWidth
                            defaultValue={contactSettings?.title ?? ""}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="description"
                            label="Descripción"
                            fullWidth
                            multiline
                            minRows={3}
                            defaultValue={contactSettings?.description ?? ""}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            name="formNameLabel"
                            label="Label campo nombre"
                            fullWidth
                            defaultValue={contactSettings?.formNameLabel ?? ""}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            name="formEmailLabel"
                            label="Label campo email"
                            fullWidth
                            defaultValue={contactSettings?.formEmailLabel ?? ""}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            name="formMessageLabel"
                            label="Label campo mensaje"
                            fullWidth
                            defaultValue={contactSettings?.formMessageLabel ?? ""}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="submitSuccessText"
                            label="Texto de éxito al enviar"
                            fullWidth
                            defaultValue={contactSettings?.submitSuccessText ?? ""}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="submitErrorText"
                            label="Texto de error al enviar"
                            fullWidth
                            defaultValue={contactSettings?.submitErrorText ?? ""}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button type="submit" variant="contained">
                            Guardar configuración
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </SectionCard>

                  <SectionCard title="Redes sociales">
                    <Stack spacing={2}>
                      {initialData.socialLinks.map((link) => (
                        <Box
                          key={link.id}
                          component="form"
                          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            withRequest(
                              `social-link-${link.id}`,
                              () =>
                                sendJson(`/api/contact/social-links/${link.id}`, "PUT", {
                                  platform: formData.get("platform"),
                                  title: formData.get("title"),
                                  info: formData.get("info"),
                                  url: formData.get("url"),
                                  icon: formData.get("icon"),
                                }),
                              "Enlace actualizado."
                            );
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={2}>
                              <TextField
                                name="platform"
                                label="Plataforma"
                                fullWidth
                                select
                                defaultValue={link.platform}
                              >
                                {SOCIAL_PLATFORM_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                name="icon"
                                label="Icono"
                                fullWidth
                                select
                                defaultValue={link.icon ?? ""}
                              >
                                {SOCIAL_ICON_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                name="title"
                                label="Título"
                                fullWidth
                                defaultValue={link.title}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                name="info"
                                label="Info"
                                fullWidth
                                defaultValue={link.info ?? ""}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                name="url"
                                label="URL"
                                fullWidth
                                defaultValue={link.url}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Stack direction="row" spacing={1}>
                                <Button type="submit" variant="contained">
                                  Guardar
                                </Button>
                                <Button
                                  color="error"
                                  onClick={() =>
                                    withRequest(
                                      `social-link-delete-${link.id}`,
                                      () =>
                                        fetch(`/api/contact/social-links/${link.id}`, {
                                          method: "DELETE",
                                        }),
                                      "Enlace eliminado."
                                    )
                                  }
                                >
                                  Borrar
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}

                      <Divider />

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "var(--font-display), Georgia, serif",
                            mb: 2,
                          }}
                        >
                          Nuevo enlace social
                        </Typography>
                        <Box
                          component="form"
                          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);

                            if (!contactSettings?.id) {
                              setToast({
                                open: true,
                                type: "error",
                                message:
                                  "Crea primero la configuración de contacto antes de agregar redes.",
                              });
                              return;
                            }

                            withRequest(
                              "social-link-create",
                              () =>
                                sendJson("/api/contact/social-links", "POST", {
                                  platform: formData.get("platform"),
                                  title: formData.get("title"),
                                  info: formData.get("info"),
                                  url: formData.get("url"),
                                  icon: formData.get("icon"),
                                  contactSettingsId: contactSettings.id,
                                }),
                              "Enlace social creado."
                            );
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={2}>
                              <TextField
                                name="platform"
                                label="Plataforma"
                                fullWidth
                                select
                                defaultValue="INSTAGRAM"
                              >
                                {SOCIAL_PLATFORM_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                name="icon"
                                label="Icono"
                                fullWidth
                                select
                                defaultValue="FaInstagram"
                              >
                                {SOCIAL_ICON_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField name="title" label="Título" fullWidth required />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField name="info" label="Info" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField name="url" label="URL" fullWidth required />
                            </Grid>
                            <Grid item xs={12} md={1}>
                              <Button type="submit" variant="contained" fullWidth>
                                Crear
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Stack>
                  </SectionCard>
                </>
              ) : null}
            </Stack>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
