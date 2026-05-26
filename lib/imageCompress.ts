/**
 * Comprime una imagen en el cliente antes de subirla.
 *
 * - Redimensiona manteniendo aspect ratio (máx maxWidth de ancho)
 * - Convierte a JPEG con la quality indicada (0–1)
 * - Devuelve un data URL listo para guardar
 *
 * Foto típica de celular (~3 MB) → ~150–300 KB. Eso entra cómodo en el
 * límite de body de Vercel y se guarda bien en Supabase (columna text).
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.85
): Promise<string> {
  // PNG con transparencia o SVG: mantener original si es chico, sino convertir a JPEG
  if (file.size < 200 * 1024) {
    return await fileToDataURL(file);
  }

  const dataUrl = await fileToDataURL(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  return canvas.toDataURL("image/jpeg", quality);
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("No se pudo leer el archivo"));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo decodificar la imagen"));
    img.src = src;
  });
}
