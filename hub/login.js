(async () => {
  document.documentElement.classList.remove("auth-pending");
  const form = document.querySelector("[data-login]");
  const status = document.querySelector("[data-status]");
  const query = new URLSearchParams(location.search);
  const destination = window.ASAS_AUTH.safeReturn(query.get("return"));
  if (query.has("expired")) status.textContent = "Sua sessão expirou. Entre novamente.";
  if (query.has("denied")) status.textContent = "Esta conta ainda não possui acesso ativo ao ASAS HUB.";
  if (query.has("signedout")) status.textContent = "Sessão encerrada com segurança.";
  const existing = window.ASAS_AUTH.readSession();
  if (existing?.access_token && existing.setup_required) {
    document.querySelector("h1").textContent = "Defina sua senha";
    document.querySelector("[data-login-intro]").textContent = "Crie uma senha exclusiva com pelo menos 10 caracteres para concluir a ativação.";
    form.innerHTML = '<label>Nova senha<input type="password" name="password" autocomplete="new-password" minlength="10" required></label><label>Confirme a senha<input type="password" name="confirmation" autocomplete="new-password" minlength="10" required></label><button type="submit">Ativar meu acesso</button><p data-status aria-live="polite"></p>';
    const setupStatus = form.querySelector("[data-status]");
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); const data = new FormData(form);
      if (data.get("password") !== data.get("confirmation")) { setupStatus.textContent = "As senhas precisam ser iguais."; return; }
      setupStatus.textContent = "Ativando acesso…";
      const response = await window.ASAS_AUTH.request("/auth/v1/user", { method:"PUT", body:JSON.stringify({ password:data.get("password") }) }, existing.access_token);
      if (!response.ok) { setupStatus.textContent = "Não foi possível ativar. Solicite um novo convite."; return; }
      existing.setup_required = false; window.ASAS_AUTH.saveSession(existing); location.replace(destination);
    });
    return;
  }
  if (existing?.access_token) location.replace(destination);
  document.querySelector("[data-forgot]")?.addEventListener("click", async () => {
    const email = form.elements.email.value.trim();
    if (!email || !form.elements.email.checkValidity()) { status.textContent = "Informe seu e-mail institucional para recuperar a senha."; form.elements.email.focus(); return; }
    status.textContent = "Enviando instruções seguras…";
    const redirectTo = `${location.origin}${location.pathname}?return=${encodeURIComponent(destination)}`;
    const response = await window.ASAS_AUTH.request(`/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, { method:"POST", body:JSON.stringify({ email }) });
    status.textContent = response.ok ? "Se o e-mail estiver autorizado, você receberá as instruções de recuperação." : "Não foi possível solicitar agora. Tente novamente em alguns minutos.";
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); status.textContent = "Verificando acesso…";
    const data = new FormData(form);
    const response = await window.ASAS_AUTH.request("/auth/v1/token?grant_type=password", { method:"POST", body:JSON.stringify({ email:data.get("email"), password:data.get("password") }) });
    if (!response.ok) { status.textContent = "Não foi possível entrar. Confira os dados ou solicite a ativação da conta."; return; }
    const session = await response.json(); window.ASAS_AUTH.saveSession(session);
    location.replace(destination);
  });
})();
