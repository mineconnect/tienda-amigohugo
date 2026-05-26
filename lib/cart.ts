export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  size: string | null;
  size_unit?: string | null;
  quantity: number;
};

/** Devuelve "Talle M", "200 ml", "Grande", etc. */
export function formatItemSize(item: CartItem): string {
  if (!item.size) return "";
  const s = item.size.trim();
  if (!s) return "";
  switch ((item.size_unit || "").toLowerCase()) {
    case "talle":  return `Talle ${s}`;
    case "tamaño": return `Tamaño ${s.toLowerCase()}`;
    case "ml":     return `${s} ml`;
    case "l":      return `${s} L`;
    case "g":      return `${s} g`;
    case "kg":     return `${s} kg`;
    case "cm":     return `${s} cm`;
    case "u":      return `${s} u`;
    default:       return s;
  }
}

export const CART_KEY = "vhf_cart";
export const WHATSAPP_PHONE = "5493834789035"; // +54 9 3834 78-9035

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  return cart;
}

export function updateQuantity(id: string, quantity: number) {
  const cart = getCart().map((i) =>
    i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
  );
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/**
 * Construye la URL de WhatsApp con el detalle del pedido pre-armado.
 * El cliente toca "enviar" y la tienda recibe el pedido completo.
 */
export function buildWhatsAppMessage(
  items: CartItem[],
  phone: string = WHATSAPP_PHONE
): string {
  if (items.length === 0) {
    return `https://wa.me/${phone}`;
  }

  const lines: string[] = ["¡Hola! Quiero hacer este pedido:", ""];

  items.forEach((item) => {
    let line = `• ${item.name}`;
    const sizeLbl = formatItemSize(item);
    if (sizeLbl) line += ` (${sizeLbl})`;
    line += ` — $${item.price.toLocaleString("es-AR")} x${item.quantity}`;
    lines.push(line);
  });

  const total = cartTotal(items);
  lines.push("", `Total: $${total.toLocaleString("es-AR")}`, "");
  lines.push("Aguardo tu respuesta para coordinar pago y envío. ¡Gracias!");

  const encoded = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phone}?text=${encoded}`;
}
