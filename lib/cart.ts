export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  size: string | null;
  quantity: number;
};

export const CART_KEY = "vhf_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
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

export function buildWhatsAppMessage(items: CartItem[]): string {
  const phone = "5493834789035";
  let msg = "¡Hola! Quiero hacer el siguiente pedido:%0A%0A";
  items.forEach((item) => {
    msg += `• *${item.name}*`;
    if (item.size) msg += ` (${item.size})`;
    msg += ` — $${item.price.toLocaleString("es-AR")} x${item.quantity}%0A`;
  });
  const total = cartTotal(items);
  msg += `%0A*Total: $${total.toLocaleString("es-AR")}*%0A%0AAguardo tu respuesta para coordinar el envío. ¡Gracias!`;
  return `https://wa.me/${phone}?text=${msg}`;
}
