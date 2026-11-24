const toHex = bytes => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
const rand = n => {
  const a = new Uint8Array(n);
  const c = globalThis.crypto;
  if (c?.getRandomValues) c.getRandomValues(a); else a.forEach((_, i) => (a[i] = Math.floor(Math.random() * 256)));
  return toHex(a);
};
export const newToken = () => rand(24);

// Senha nunca é guardada em texto puro: PBKDF2 + salt (Web Crypto). Se o navegador não tiver
// Web Crypto, usa um hash simples só para a demonstração continuar funcionando.
export async function hashPassword(password, salt = rand(16)) {
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    const enc = new TextEncoder();
    const key = await subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
    return { salt, hash: toHex(bits) };
  }
  let h = 5381;
  for (const ch of salt + password) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0;
  return { salt, hash: "simple-" + h.toString(16) };
}

export async function checkPassword(password, salt, hash) {
  return (await hashPassword(password, salt)).hash === hash;
}
