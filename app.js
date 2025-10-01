const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // Caminho absoluto do diretório público
    const publicDir = process.cwd() + "/";

    // Tenta servir arquivos estáticos
    try {
      // Evita diretórios
      if (path === "/") path = "/index.html";
      const file = Bun.file(publicDir + path);
      if (await file.exists()) {
        return new Response(file);
      }
    } catch {}

    // Fallback: retorna index.html para qualquer rota não encontrada
    const indexFile = Bun.file(publicDir + "index.html");
    return new Response(indexFile, {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.log(`Bun server running at http://localhost:${server.port}`);