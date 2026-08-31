(() => {
  const projectUrl = "https://yljvlllrvibyongccgmz.supabase.co";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsanZsbGxydmlieW9uZ2NjZ216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzODQ2MDgsImV4cCI6MjEwMTk2MDYwOH0.1wSxovrlmtPQhqcl3zKMG3Qab4CrxfTsqRaw97ObbSI";
  const storageKey = "asas_hub_session";
  const basePath = location.pathname.endsWith("/asas-hub.html") ? "hub/login.html" : location.pathname.includes("/hub/mantenedores/") ? "../login.html" : "login.html";
  const localDemo = ["localhost", "127.0.0.1"].includes(location.hostname);
  document.documentElement.classList.add("auth-pending");

  const readSession = () => { try { return JSON.parse(sessionStorage.getItem(storageKey) || "null"); } catch { return null; } };
  const saveSession = (session) => sessionStorage.setItem(storageKey, JSON.stringify(session));
  const clearSession = () => sessionStorage.removeItem(storageKey);
  const request = (path, options = {}, accessToken) => fetch(`${projectUrl}${path}`, { ...options, headers: { apikey: anonKey, "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...(options.headers || {}) } });
  const safeReturn = (value, fallback = "../asas-hub.html") => (!value || !value.startsWith("/") || value.startsWith("//")) ? fallback : value;
  const refreshSession = async (session = readSession()) => {
    if (!session?.refresh_token) return null;
    const response = await request("/auth/v1/token?grant_type=refresh_token", { method:"POST", body:JSON.stringify({ refresh_token:session.refresh_token }) });
    if (!response.ok) return null;
    const renewed = await response.json(); saveSession(renewed); return renewed;
  };
  const getValidSession = async () => {
    const session = readSession();
    if (!session?.access_token) return null;
    if (!session.expires_at || Number(session.expires_at) > Math.floor(Date.now()/1000) + 120) return session;
    return refreshSession(session);
  };
  const signOut = async () => {
    const session = readSession();
    if (session?.access_token) await request("/auth/v1/logout", { method:"POST" }, session.access_token).catch(()=>null);
    clearSession();
  };

  window.ASAS_AUTH = { projectUrl, anonKey, readSession, saveSession, clearSession, request, safeReturn, refreshSession, getValidSession, signOut };
  window.ASAS_AUTH_READY = (async () => {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    if (hash.get("access_token")) {
      saveSession({ access_token: hash.get("access_token"), refresh_token: hash.get("refresh_token"), expires_at: Math.floor(Date.now()/1000) + Number(hash.get("expires_in") || 3600), setup_required: ["invite","recovery"].includes(hash.get("type")) });
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (location.pathname.endsWith("/hub/login.html")) { document.documentElement.classList.remove("auth-pending"); return { login: true }; }
    if (localDemo) { document.documentElement.classList.remove("auth-pending"); return { demo: true }; }
    const session = await getValidSession();
    if (!session?.access_token) { location.replace(`${basePath}?return=${encodeURIComponent(location.pathname)}`); return new Promise(() => {}); }
    let userResponse = await request("/auth/v1/user", {}, session.access_token);
    if (!userResponse.ok) {
      const renewed = await refreshSession(session);
      if (renewed) userResponse = await request("/auth/v1/user", {}, renewed.access_token);
    }
    if (!userResponse.ok) { clearSession(); location.replace(`${basePath}?expired=1&return=${encodeURIComponent(location.pathname)}`); return new Promise(() => {}); }
    const user = await userResponse.json();
    const activeSession = readSession();
    const profileResponse = await request(`/rest/v1/asas_staff_profiles?user_id=eq.${encodeURIComponent(user.id)}&active=eq.true&select=user_id,display_name,role,roles,active`, {}, activeSession.access_token);
    const profiles = profileResponse.ok ? await profileResponse.json() : [];
    if (!profiles.length) { clearSession(); location.replace(`${basePath}?denied=1`); return new Promise(() => {}); }
    document.documentElement.classList.remove("auth-pending");
    return { user, profile: profiles[0], session: activeSession };
  })();
})();
