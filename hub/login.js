(async () => {
  document.documentElement.classList.remove("auth-pending");
  const form = document.querySelector("[data-login]");
  const status = document.querySelector("[data-status]");
  const query = new URLSearchParams(location.search);
  if (query.has("expired")) status.textContent = "Sua sessão expirou. Entre novamente.";
  if (query.has("denied")) status.textContent = "Esta conta ainda não possui acesso ativo ao ASAS HUB.";
  if (window.ASAS_AUTH.readSession()?.access_token) location.replace(query.get("return") || "../asas-hub.html");
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); status.textContent = "Verificando acesso…";
    const data = new FormData(form);
    const response = await window.ASAS_AUTH.request("/auth/v1/token?grant_type=password", { method:"POST", body:JSON.stringify({ email:data.get("email"), password:data.get("password") }) });
    if (!response.ok) { status.textContent = "Não foi possível entrar. Confira os dados ou solicite a ativação da conta."; return; }
    const session = await response.json(); window.ASAS_AUTH.saveSession(session);
    location.replace(query.get("return") || "../asas-hub.html");
  });
})();
