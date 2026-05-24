const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export type CategoryInput = {
  slug?: unknown;
  name?: unknown;
  icon?: unknown;
  description?: unknown;
  sort_order?: unknown;
  active?: unknown;
};

export function sanitizeCategoryInput(body: CategoryInput, partial = false) {
  const out: Record<string, unknown> = {};

  if (body.slug !== undefined) {
    if (typeof body.slug !== "string" || !SLUG_RE.test(body.slug)) {
      return { error: "Slug inválido (solo minúsculas, números y guiones)" as const };
    }
    out.slug = body.slug;
  } else if (!partial) {
    return { error: "El slug es obligatorio" as const };
  }

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 100) {
      return {
        error: "El nombre es obligatorio y debe tener menos de 100 caracteres" as const,
      };
    }
    out.name = body.name.trim();
  } else if (!partial) {
    return { error: "El nombre es obligatorio" as const };
  }

  if (body.icon !== undefined) {
    out.icon =
      typeof body.icon === "string" && body.icon.trim() ? body.icon.trim() : "category";
  }
  if (body.description !== undefined) {
    out.description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
  }
  if (body.sort_order !== undefined) {
    const n =
      typeof body.sort_order === "string"
        ? parseInt(body.sort_order, 10)
        : (body.sort_order as number);
    out.sort_order = typeof n === "number" && isFinite(n) ? n : 0;
  }
  if (body.active !== undefined) out.active = !!body.active;

  return { data: out };
}
