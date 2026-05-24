/**
 * @jest-environment node
 */

describe("lib/auth", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("signAdminToken + verifyAdminToken funcionan en round-trip", async () => {
    process.env.ADMIN_JWT_SECRET = "x".repeat(40);
    const { signAdminToken, verifyAdminToken } = await import("@/lib/auth");
    const token = await signAdminToken();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT shape
    const ok = await verifyAdminToken(token);
    expect(ok).toBe(true);
  });

  it("verifyAdminToken rechaza tokens inválidos", async () => {
    process.env.ADMIN_JWT_SECRET = "y".repeat(40);
    const { verifyAdminToken } = await import("@/lib/auth");
    expect(await verifyAdminToken("garbage")).toBe(false);
    expect(await verifyAdminToken("a.b.c")).toBe(false);
  });

  it("verifyAdminToken rechaza tokens firmados con otro secret", async () => {
    process.env.ADMIN_JWT_SECRET = "z".repeat(40);
    const { signAdminToken } = await import("@/lib/auth");
    const token = await signAdminToken();

    jest.resetModules();
    process.env.ADMIN_JWT_SECRET = "w".repeat(40);
    const { verifyAdminToken } = await import("@/lib/auth");
    expect(await verifyAdminToken(token)).toBe(false);
  });

  it("tira error si ADMIN_JWT_SECRET es demasiado corto", async () => {
    process.env.ADMIN_JWT_SECRET = "corto";
    const { signAdminToken } = await import("@/lib/auth");
    await expect(signAdminToken()).rejects.toThrow(/ADMIN_JWT_SECRET/);
  });

  it("tira error si ADMIN_JWT_SECRET falta", async () => {
    delete process.env.ADMIN_JWT_SECRET;
    const { signAdminToken } = await import("@/lib/auth");
    await expect(signAdminToken()).rejects.toThrow(/ADMIN_JWT_SECRET/);
  });
});
