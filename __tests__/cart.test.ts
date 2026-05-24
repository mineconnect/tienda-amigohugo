import {
  CART_KEY,
  WHATSAPP_PHONE,
  addToCart,
  buildWhatsAppMessage,
  cartTotal,
  clearCart,
  getCart,
  removeFromCart,
  saveCart,
  updateQuantity,
} from "@/lib/cart";

const item1 = {
  id: "p1",
  name: "Campera de jean",
  price: 28500,
  image_url: null,
  size: "M",
};
const item2 = {
  id: "p2",
  name: "Zapatillas urbanas",
  price: 32000,
  image_url: null,
  size: "40",
};

describe("lib/cart", () => {
  beforeEach(() => {
    clearCart();
  });

  it("empieza vacío", () => {
    expect(getCart()).toEqual([]);
  });

  it("agrega un producto con quantity 1", () => {
    addToCart(item1);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
    expect(cart[0].id).toBe("p1");
  });

  it("incrementa quantity si el mismo producto se agrega dos veces", () => {
    addToCart(item1);
    addToCart(item1);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it("acumula distintos productos por separado", () => {
    addToCart(item1);
    addToCart(item2);
    expect(getCart()).toHaveLength(2);
  });

  it("actualiza la cantidad sin bajar de 1", () => {
    addToCart(item1);
    updateQuantity("p1", 5);
    expect(getCart()[0].quantity).toBe(5);
    updateQuantity("p1", 0);
    expect(getCart()[0].quantity).toBe(1); // clamp
    updateQuantity("p1", -3);
    expect(getCart()[0].quantity).toBe(1);
  });

  it("elimina un producto del carrito", () => {
    addToCart(item1);
    addToCart(item2);
    removeFromCart("p1");
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe("p2");
  });

  it("calcula el total correctamente", () => {
    saveCart([
      { ...item1, quantity: 2 }, // 57000
      { ...item2, quantity: 1 }, // 32000
    ]);
    expect(cartTotal(getCart())).toBe(89000);
  });

  it("persiste en localStorage", () => {
    addToCart(item1);
    const raw = window.localStorage.getItem(CART_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed[0].id).toBe("p1");
  });

  describe("buildWhatsAppMessage", () => {
    it("usa el número de WhatsApp correcto por default", () => {
      const url = buildWhatsAppMessage([{ ...item1, quantity: 1 }]);
      expect(url).toContain(`wa.me/${WHATSAPP_PHONE}`);
      expect(WHATSAPP_PHONE).toBe("5493834789035");
    });

    it("contiene el nombre, talle, precio y cantidad de cada item", () => {
      const url = buildWhatsAppMessage([
        { ...item1, quantity: 2 },
        { ...item2, quantity: 1 },
      ]);
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain("Campera de jean");
      expect(decoded).toContain("(M)");
      expect(decoded).toContain("x2");
      expect(decoded).toContain("Zapatillas urbanas");
      expect(decoded).toContain("(40)");
    });

    it("incluye el total formateado en pesos argentinos", () => {
      const url = buildWhatsAppMessage([
        { ...item1, quantity: 1 }, // 28500
        { ...item2, quantity: 1 }, // 32000
      ]);
      const decoded = decodeURIComponent(url);
      expect(decoded).toMatch(/Total: \$60\.500/);
    });

    it("escapa caracteres especiales correctamente", () => {
      const url = buildWhatsAppMessage([{ ...item1, quantity: 1 }]);
      // Los espacios deben ir codificados como %20 (encodeURIComponent)
      expect(url).toContain("%20");
      // El símbolo $ debe quedar literal en URL (encodeURIComponent no lo codifica)
      expect(url).toContain("%24");
    });

    it("devuelve url base si el carrito está vacío", () => {
      const url = buildWhatsAppMessage([]);
      expect(url).toBe(`https://wa.me/${WHATSAPP_PHONE}`);
    });

    it("permite override del teléfono", () => {
      const url = buildWhatsAppMessage([{ ...item1, quantity: 1 }], "5491100000000");
      expect(url).toContain("wa.me/5491100000000");
    });
  });
});
