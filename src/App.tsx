import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ClipboardList, Truck, MapPin, Leaf, Users, Building2,
  Car, Award, BarChart3, Brain, Store, CreditCard, Settings as SettingsIcon, ChevronLeft,
  Menu, Bell, Globe, LogOut, CheckCircle, AlertTriangle, Info, X,
  Shield, Loader2, Eye, EyeOff, Activity, Clock, Navigation,
  Copy, Route, Tag, ChevronRight, User, Phone, Hash,
} from "lucide-react";
import MapboxMap from "@/components/MapboxMap";
import logoImg from "@/imports/Untitled_-_September_02__2026_at_03.21.36.png";
import type { AppState, Page, Lang, Toast, Report, Collection, DrawerState } from "@/lib/types";
import {
  generateReports, generateCollections, generateEcopoints, generateCitizens,
  generateAgencies, generateVehicles, generateRewards, generateNews, generateLogs,
  getStatusPill,
} from "@/lib/data";
import { useT } from "@/lib/i18n";
import Dashboard from "@/views/Dashboard";
import Reports from "@/views/Reports";
import Collections from "@/views/Collections";
import Tracking from "@/views/Tracking";
import EcoPoints from "@/views/EcoPoints";
import Citizens from "@/views/Citizens";
import Agencies from "@/views/Agencies";
import Fleet from "@/views/Fleet";
import Rewards from "@/views/Rewards";
import Analytics from "@/views/Analytics";
import AIPrediction from "@/views/AIPrediction";
import Marketplace from "@/views/Marketplace";
import Subscription from "@/views/Subscription";
import Settings from "@/views/Settings";
import { AGENCIES } from "@/lib/data";

// ─── Initial State ────────────────────────────────────────────────────────────

const mkState = (): AppState => {
  const reports = generateReports(50);
  const collections = generateCollections(40, reports.map(r => r.id));
  return {
  user: null,
  page: "dashboard",
  lang: "es",
  sidebarOpen: true,
  mobileSidebar: false,
  connection: "live",
  stats: {
    reports: 2847, pending: 423, scheduled: 189, active: 67,
    completed: 1956, citizens: 12483, ecopoints: 28, rewards: 8492,
  },
  reports,
  collections,
  ecopoints: generateEcopoints(),
  citizens: generateCitizens(),
  agencies: generateAgencies(),
  vehicles: generateVehicles(),
  rewards: generateRewards(),
  news: generateNews(),
  logs: generateLogs(),
  notifications: [
    { type: "alert", title: "New Report", body: "WR-2923 submitted — Furniture, Suba", ts: new Date().toISOString() },
    { type: "info", title: "Collection CR-1087", body: "Vehicle PV-003 en route", ts: new Date().toISOString() },
    { type: "success", title: "EcoPoint EP-003", body: "Capacity restored to 20%", ts: new Date().toISOString() },
  ],
  chartRange: "30",
  kanbanMode: false,
  drawer: { open: false, type: null, data: null },
  toasts: [],
}; };

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV: Array<{ key: Page; icon: React.ElementType; badge?: (s: AppState) => number }> = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "reports", icon: ClipboardList, badge: s => s.reports.filter(r => r.status === "Submitted").length },
  { key: "collections", icon: Truck, badge: s => s.collections.filter(c => c.status === "Awaiting Agency").length },
  { key: "tracking", icon: MapPin },
  { key: "ecopoints", icon: Leaf },
  { key: "citizens", icon: Users },
  { key: "agencies", icon: Building2 },
  { key: "fleet", icon: Car },
  { key: "rewards", icon: Award },
  { key: "analytics", icon: BarChart3 },
  { key: "ai", icon: Brain },
  { key: "marketplace", icon: Store },
  { key: "subscription", icon: CreditCard },
  { key: "settings", icon: SettingsIcon },
];

// ─── Animated blobs (UIlora Nebula-inspired) for login ───────────────────────

function Blobs() {
  return (
    <div className="login-blobs" aria-hidden>
      <motion.div
        className="blob blob1"
        animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob blob2"
        animate={{ x: [0, -70, 40, 0], y: [0, 40, -60, 0], scale: [1, 0.85, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob blob3"
        animate={{ x: [0, 50, -30, 0], y: [0, -30, 50, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ lang, onLogin, onLangChange }: { lang: Lang; onLogin: (u: { name: string; email: string; role: string }) => void; onLangChange: (l: Lang) => void; }) {
  const t = useT(lang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onLogin({ name: "Admin Punto Vivo", email: email || "admin@puntovivo.gov.co", role: "Superadmin" });
  }

  return (
    <div className="login-wrap">
      <Blobs />
      <div className="login-lang-switch">
        {(["es", "en"] as Lang[]).map(l => (
          <motion.button key={l} whileTap={{ scale: 0.92 }} className={`lang-btn ${lang === l ? "active" : ""}`} onClick={() => onLangChange(l)}>
            {l.toUpperCase()}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <motion.div className="login-logo" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }}>
          <img src={logoImg} alt="Punto Vivo" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
          <h1>Punto Vivo Bogotá</h1>
          <p className="subtitle">{lang === "es" ? "Sistema Inteligente de Gestión de Residuos Voluminosos" : "Smart Bulky Waste Management System"}</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.4 }}>
          <label>{t("auth.email")}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="admin@puntovivo.gov.co" />
          <label>{t("auth.password")}</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"} value={password}
              onChange={e => setPassword(e.target.value)} autoComplete="current-password"
              placeholder="••••••••"
              style={{ paddingRight: 40 }}
            />
            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", background: "none", border: "none" }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <motion.button
            type="submit"
            className="btn-primary"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
          >
            {loading ? <><Loader2 size={15} className="spin" /> {lang === "es" ? "Iniciando..." : "Signing in..."}</> : <><Shield size={15} /> {t("auth.signin")}</>}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const sidebarVariants = {
  open: { width: 260, transition: { type: "spring" as const, damping: 28, stiffness: 260 } },
  collapsed: { width: 72, transition: { type: "spring" as const, damping: 28, stiffness: 260 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

function Sidebar({ state, onNav, onCollapse }: { state: AppState; onNav: (p: Page) => void; onCollapse: () => void; }) {
  const t = useT(state.lang);
  const collapsed = !state.sidebarOpen;

  return (
    <motion.aside
      className="sidebar"
      animate={collapsed ? "collapsed" : "open"}
      variants={sidebarVariants}
      style={{ overflow: "hidden", position: "relative" }}
    >
      {/* Premium top glow */}
      <div className="sb-glow" />

      {/* Logo */}
      <div className="sb-logo">
        <div className="lg-ic"><img src={logoImg} alt="PV" /></div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div className="lg-tx" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <b>Punto Vivo</b>
              <span>Bogotá Operaciones</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          className="iconbtn"
          style={{ marginLeft: "auto", flex: "none" }}
          onClick={onCollapse}
          whileTap={{ scale: 0.88 }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft size={15} />
          </motion.div>
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {NAV.map(({ key, icon: Icon, badge }, i) => {
          const active = state.page === key;
          const badgeCount = badge ? badge(state) : 0;
          const label = t(`nav.${key}`);

          return (
            <motion.button
              key={key}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className={`sb-item${active ? " active" : ""}`}
              onClick={() => onNav(key)}
              whileTap={{ scale: 0.97 }}
              title={collapsed ? label : undefined}
              style={{ justifyContent: collapsed ? "center" : undefined }}
            >
              <span style={{ flex: "none" }}><Icon size={15} /></span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", fontSize: 13 }}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* UIlora-style indigo dot on active item */}
              {active && !collapsed && (
                <motion.div
                  className="sb-active-dot"
                  layoutId="active-pill"
                  transition={{ type: "spring" as const, damping: 30, stiffness: 300 }}
                />
              )}
              {badgeCount > 0 && !collapsed && !active && (
                <span className={`sb-badge${key === "collections" ? " amber" : ""}`}>
                  {badgeCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sb-foot">
        {state.user && (
          <div className="pf">
            <div className="avatar">
              {state.user.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  <div className="nm">{state.user.name}</div>
                  <div className="rl">{state.user.role}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ state, onLang, onLogout, onMobileMenu, onNotif, notifOpen, onCloseNotif }:
  { state: AppState; onLang: (l: Lang) => void; onLogout: () => void; onMobileMenu: () => void; onNotif: () => void; notifOpen: boolean; onCloseNotif: () => void; }) {
  const t = useT(state.lang);
  const titles: Record<Page, { title: string; sub: string }> = {
    dashboard: { title: t("dashboard.title"), sub: t("dashboard.subtitle") },
    reports: { title: t("reports.title"), sub: `${state.reports.length} ${t("common.all").toLowerCase()}` },
    collections: { title: t("collections.title"), sub: `${state.collections.length} total` },
    tracking: { title: t("tracking.title"), sub: "Real-time" },
    ecopoints: { title: t("ecopoints.title"), sub: `${state.ecopoints.length} puntos` },
    citizens: { title: t("citizens.title"), sub: `${state.citizens.length} registrados` },
    agencies: { title: t("agencies.title"), sub: `${state.agencies.length} agencias` },
    fleet: { title: t("fleet.title"), sub: `${state.vehicles.length} vehículos` },
    rewards: { title: t("rewards.title"), sub: "Gestión de puntos" },
    analytics: { title: t("analytics.title"), sub: "Métricas operativas" },
    ai: { title: "Predicción IA", sub: "Análisis CCTV en tiempo real" },
    marketplace: { title: "Mercado PV", sub: "Admin · Ciudadanos · Recicladores · Colectores" },
    subscription: { title: "Planes & Suscripción", sub: "Gestión de niveles de acceso" },
    settings: { title: t("settings.title"), sub: "Configuración del sistema" },
  };
  const pg = titles[state.page];

  return (
    <header className="topbar">
      <button className="iconbtn tb-menu" onClick={onMobileMenu}><Menu size={16} /></button>
      <AnimatePresence mode="wait">
        <motion.div className="tb-title" key={state.page} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }}>
          <h1>{pg.title}</h1>
          <p>{pg.sub}</p>
        </motion.div>
      </AnimatePresence>

      <div className="tb-right">
        <span className={`conn-pill ${state.connection}`}>
          <span className="dot" />
          {state.connection === "live" ? "LIVE" : "RECONNECTING"}
        </span>

        <div className="lang-switch">
          {(["es", "en"] as Lang[]).map(l => (
            <motion.button key={l} className={state.lang === l ? "active" : ""} onClick={() => onLang(l)} whileTap={{ scale: 0.9 }}>
              <Globe size={11} style={{ display: "inline", marginRight: 3 }} />{l.toUpperCase()}
            </motion.button>
          ))}
        </div>

        <div className="menu-wrap">
          <motion.button className="iconbtn" onClick={onNotif} whileTap={{ scale: 0.9 }} style={{ position: "relative" }}>
            <Bell size={15} />
            {state.notifications.length > 0 && (
              <motion.span className="notif-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} />
            )}
          </motion.button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div className="menu" initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.18 }}>
                <div className="mh">Notificaciones</div>
                <div className="ml">
                  {state.notifications.map((n, i) => (
                    <div className="mi" key={i} onClick={onCloseNotif}>
                      <span style={{ color: n.type === "alert" ? "var(--red)" : n.type === "success" ? "var(--green)" : "var(--sky)", marginTop: 1 }}>
                        {n.type === "alert" ? <AlertTriangle size={13} /> : n.type === "success" ? <CheckCircle size={13} /> : <Info size={13} />}
                      </span>
                      <div>
                        <b style={{ fontSize: 12.5, display: "block" }}>{n.title}</b>
                        <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{n.body}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button className="iconbtn" onClick={onLogout} whileTap={{ scale: 0.9 }}>
          <LogOut size={15} />
        </motion.button>
      </div>
    </header>
  );
}

// ─── Toast System ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void; }) {
  return (
    <div className="toasts">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className={`toast ${t.type}`}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.88 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            layout
          >
            <span className="tic">
              {t.type === "success" ? <CheckCircle size={15} /> : t.type === "alert" ? <AlertTriangle size={15} /> : <Info size={15} />}
            </span>
            <div style={{ flex: 1 }}>
              <b>{t.title}</b>
              <p>{t.body}</p>
            </div>
            <button className="tx" onClick={() => onDismiss(t.id)}><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

const COLL_STATUSES = ["New","Awaiting Agency","Approved","Scheduled","Collector Assigned","En Route","Arrived","Collected","Completed"];

// Uber-style animated collector route map
function CollectorRouteMap({ c, collectorName }: { c: Collection; collectorName: string }) {
  const [progress, setProgress] = useState(0.18);
  useEffect(() => {
    const id = setInterval(() => setProgress(p => p >= 0.87 ? p : p + 0.0016), 80);
    return () => clearInterval(id);
  }, []);

  const W = 500, H = 250;
  const dx = W * 0.73, dy = H * 0.53;
  const sx = W * 0.09, sy = H * 0.14;
  const c1x = W * 0.09, c1y = H * 0.68;
  const c2x = W * 0.52, c2y = H * 0.68;

  function bz(t: number, a: number, b: number, cc: number, d: number) {
    const m = 1 - t;
    return m*m*m*a + 3*m*m*t*b + 3*m*t*t*cc + t*t*t*d;
  }
  const cpx = bz(progress, sx, c1x, c2x, dx);
  const cpy = bz(progress, sy, c1y, c2y, dy);
  const remaining = Math.max(0, Math.round(c.eta * (1 - progress)));
  const pct = Math.round(progress * 100);
  const pathD = `M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${dx} ${dy}`;

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", background: "#0b0d1a" }}>
        {/* grid */}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`v${i}`} x1={(i+1)*(W/9)} y1={0} x2={(i+1)*(W/9)} y2={H} stroke="rgba(255,255,255,0.022)" strokeWidth={1} />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={(i+1)*(H/5)} x2={W} y2={(i+1)*(H/5)} stroke="rgba(255,255,255,0.022)" strokeWidth={1} />
        ))}
        {/* street blocks */}
        <line x1={sx} y1={0} x2={sx} y2={H*0.68} stroke="#181b2e" strokeWidth={14} />
        <line x1={0} y1={H*0.68} x2={W} y2={H*0.68} stroke="#181b2e" strokeWidth={14} />
        <line x1={dx} y1={H*0.68} x2={dx} y2={H} stroke="#181b2e" strokeWidth={14} />
        <line x1={W*0.37} y1={0} x2={W*0.37} y2={H*0.45} stroke="#14172a" strokeWidth={9} />
        <line x1={W*0.37} y1={H*0.45} x2={W} y2={H*0.45} stroke="#14172a" strokeWidth={9} />
        {/* road surface */}
        <path d={pathD} fill="none" stroke="#252844" strokeWidth={16} strokeLinecap="round" />
        {/* center dashes */}
        <path d={pathD} fill="none" stroke="rgba(255,255,200,0.06)" strokeWidth={1.5} strokeDasharray="12 14" pathLength={1} />
        {/* remaining route - dashed indigo */}
        <path d={pathD} fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth={3} strokeLinecap="round"
          strokeDasharray="0.03 0.05" pathLength={1} strokeDashoffset={-progress} />
        {/* completed route - solid */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth={5} strokeLinecap="round"
          pathLength={1} strokeDasharray={`${progress} 2`} />
        {/* destination pulse */}
        <circle cx={dx} cy={dy} r={18} fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.12)" strokeWidth={1}>
          <animate attributeName="r" values="14;26;14" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={dx} cy={dy} r={11} fill="rgba(239,68,68,0.18)" stroke="#ef4444" strokeWidth={2.5} />
        <circle cx={dx} cy={dy} r={5.5} fill="#ef4444" />
        <text x={dx} y={dy - 18} textAnchor="middle" fill="#f87171" fontSize={9} fontWeight={700} fontFamily="ui-monospace,monospace">DESTINO</text>
        {/* collector glow */}
        <circle cx={cpx} cy={cpy} r={24} fill="rgba(99,102,241,0.07)" />
        <circle cx={cpx} cy={cpy} r={16} fill="rgba(99,102,241,0.14)" />
        {/* collector dot */}
        <circle cx={cpx} cy={cpy} r={12} fill="#4338ca" stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} />
        <text x={cpx} y={cpy + 4.5} textAnchor="middle" fontSize={11}>🚛</text>
        {/* name tag */}
        {cpx < W * 0.58 && (
          <g>
            <rect x={cpx + 16} y={cpy - 14} width={Math.min(collectorName.length * 5.4 + 12, 100)} height={18} rx={4}
              fill="rgba(67,56,202,0.92)" stroke="rgba(99,102,241,0.6)" strokeWidth={1} />
            <text x={cpx + 22} y={cpy - 1} fill="white" fontSize={8.5} fontWeight={700} fontFamily="system-ui">{collectorName}</text>
          </g>
        )}
        {/* origin marker */}
        <circle cx={sx} cy={sy} r={5} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
        <text x={sx} y={sy - 9} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={8} fontFamily="ui-monospace,monospace">ORIGEN</text>
        {/* progress bar */}
        <rect x={16} y={H - 14} width={W - 32} height={3} rx={1.5} fill="rgba(255,255,255,0.07)" />
        <rect x={16} y={H - 14} width={(W - 32) * progress} height={3} rx={1.5} fill="#6366f1" />
      </svg>
      {/* ETA badge */}
      <div style={{ position:"absolute", top:10, right:10, background:"rgba(8,9,22,0.88)", backdropFilter:"blur(10px)", border:"1px solid rgba(99,102,241,0.4)", borderRadius:9, padding:"6px 14px", textAlign:"center" }}>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.38)", fontFamily:"ui-monospace,monospace", letterSpacing:"0.07em" }}>ETA</div>
        <div style={{ fontSize:22, fontWeight:800, color:"#818cf8", fontFamily:"ui-monospace,monospace", lineHeight:1.1 }}>{remaining}</div>
        <div style={{ fontSize:8, color:"rgba(255,255,255,0.32)" }}>min</div>
      </div>
      {/* en-route pill */}
      <div style={{ position:"absolute", bottom:20, left:10, display:"flex", alignItems:"center", gap:5, background:"rgba(8,9,22,0.78)", border:"1px solid rgba(99,102,241,0.35)", borderRadius:99, padding:"3px 10px" }}>
        <span className="pd" style={{ width:6, height:6, borderRadius:"50%", background:"#818cf8", display:"inline-block", animation:"pulseDot 1.4s ease-in-out infinite" }} />
        <span style={{ fontSize:9.5, color:"#818cf8", fontWeight:700, fontFamily:"ui-monospace,monospace", letterSpacing:"0.04em" }}>EN RUTA · {pct}%</span>
      </div>
    </div>
  );
}

function CollectionDrawerContent({ c, state, initialTab, onClose }: { c: Collection; state: AppState; initialTab: string; onClose: () => void }) {
  const t = useT(state.lang);
  const [tab, setTab] = useState(initialTab === "assign" ? "info" : initialTab);
  // Early-stage collections default to En Route in the monitor view
  const earlyStages = ["New", "Awaiting Agency", "Approved", "Scheduled"];
  const enRouteStatus = earlyStages.includes(c.status) ? "En Route" : c.status;
  const [currentStatus, setCurrentStatus] = useState(enRouteStatus);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setTab(prev => initialTab === "assign" ? "info" : initialTab || prev); }, [initialTab]);

  // Deterministic collector data seeded from collection ID
  const collNum = parseInt(c.id.replace("CR-", "")) || 0;
  const collectorId = `COLL-${c.id.replace("CR-", "")}`;
  const COLL_NAMES = ["Jhon Morales", "María Ospina", "Carlos Suárez", "Ana Torres", "Luis Gómez", "Diego Castro", "Sandra Peña"];
  const COLL_PHONES = ["+57 310 234 5678", "+57 320 345 6789", "+57 315 456 7890", "+57 300 567 8901", "+57 311 678 9012"];
  const COLL_VEHICLES = ["Cargo bicycle", "Motorcycle + trailer", "Pickup truck", "Hand cart", "Motorcycle + trailer"];
  const COLL_ZONES = ["Kennedy", "Suba", "Bosa", "Engativá", "Chapinero", "Fontibón", "Usaquén"];
  const collectorName = c.driver || COLL_NAMES[collNum % COLL_NAMES.length];
  const collectorPhone = COLL_PHONES[collNum % COLL_PHONES.length];
  const collectorVehicle = COLL_VEHICLES[collNum % COLL_VEHICLES.length];
  const collectorZone = COLL_ZONES[collNum % COLL_ZONES.length];
  const collectorRating = (4.0 + (collNum % 10) * 0.1).toFixed(1);
  const collectorJobs = 28 + (collNum % 180);

  const statusIdx = COLL_STATUSES.indexOf(currentStatus);

  const handleAdvance = () => {
    const next = COLL_STATUSES[Math.min(statusIdx + 1, COLL_STATUSES.length - 1)];
    setCurrentStatus(next);
  };
  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${c.location[0].toFixed(6)}, ${c.location[1].toFixed(6)}`);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const TABS = [
    { key: "info",    icon: <Eye size={12} />,      label: "Info" },
    { key: "map",     icon: <MapPin size={12} />,   label: "Map" },
    { key: "monitor", icon: <Activity size={12} />, label: "Monitor" },
  ];

  const collectionReport = [{
    id: c.id, citizen: c.citizen, type: c.type, status: c.status,
    location: c.location, reportedAt: c.createdAt, agency: c.agency,
    statusEs: c.status, typeEs: c.type, aiClass: c.type, confidence: "0.9",
    recommendedAction: "Collection", image: null, description: "",
  }];

  return (
    <>
      <div className="dh" style={{ flexDirection: "column", alignItems: "flex-start", gap: 10, padding: "12px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 10 }}>
          <span className="mono" style={{ color: "var(--green)", fontSize: 13, fontWeight: 700 }}>{c.id}</span>
          <span className={`pill ${currentStatus === "Completed" ? "green" : currentStatus === "Cancelled" ? "red" : currentStatus === "En Route" || currentStatus === "Arrived" ? "sky" : "amber"}`} style={{ marginLeft: 2 }}>
            <span className="pd" />{currentStatus}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "var(--dim)" }}><Clock size={10} style={{ display:"inline", marginRight: 3 }} />{c.eta} min ETA</span>
            <button className="iconbtn" onClick={onClose}><X size={15} /></button>
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", width: "100%", marginTop: 4 }}>
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", fontSize: 11.5, fontWeight: 600, border: "none", background: "none", cursor: "pointer", color: tab === tb.key ? "var(--sky)" : "var(--muted)", borderBottom: tab === tb.key ? "2px solid var(--sky)" : "2px solid transparent", marginBottom: -1, transition: "color .15s" }}>
              {tb.icon}{tb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="db" style={{ padding: "14px 16px" }}>

        {/* ── INFO TAB ── */}
        {tab === "info" && (
          <>
            <div className="card">
              <div className="card-h"><h3 style={{ display:"flex", gap:6, alignItems:"center" }}><User size={13} color="var(--sky)" /> {t("reports.citizen")}</h3></div>
              <div className="card-b">
                <div className="field-grid">
                  <div><div className="label">{t("reports.citizen")}</div><div style={{ fontWeight:600 }}>{c.citizen}</div></div>
                  <div><div className="label">{t("reports.type")}</div><div>{c.type}</div></div>
                  <div><div className="label">{t("reports.agency")}</div><div>{c.agency}</div></div>
                  <div><div className="label">{t("tracking.vehicle")}</div><div className="mono">{c.vehicle}</div></div>
                  <div><div className="label">ETA</div><div className="mono" style={{ color:"var(--sky)", fontWeight:700 }}>{c.eta} min</div></div>
                  <div><div className="label">{t("collections.scheduled")}</div><div className="mono" style={{ fontSize:11 }}>{new Date(c.scheduleDate).toLocaleDateString()}</div></div>
                  <div><div className="label">Lat</div><div className="mono">{c.location[0].toFixed(5)}</div></div>
                  <div><div className="label">Lng</div><div className="mono">{c.location[1].toFixed(5)}</div></div>
                  <div><div className="label">{t("reports.reported")}</div><div className="mono" style={{ fontSize:11 }}>{new Date(c.createdAt).toLocaleString()}</div></div>
                  <div><div className="label">Reporte vinculado</div><div className="mono" style={{ color:"var(--sky)" }}>{c.reportId}</div></div>
                </div>
              </div>
            </div>

            {/* Assigned informal collector */}
            <div className="card">
              <div className="card-h"><h3 style={{ display:"flex", gap:6, alignItems:"center" }}><User size={13} color="#f59e0b" /> Colector Asignado</h3></div>
              <div className="card-b">
                <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:12, padding:"7px 11px", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.22)", borderRadius:8 }}>
                  <Hash size={11} color="#f59e0b" />
                  <span style={{ fontFamily:"ui-monospace,monospace", fontSize:11.5, fontWeight:700, color:"#f59e0b" }}>{collectorId}</span>
                  <span style={{ fontSize:10, color:"var(--dim)", marginLeft:4 }}>ID del colector</span>
                </div>
                <div className="field-grid">
                  <div><div className="label"><User size={10} style={{ display:"inline", marginRight:4 }} />Nombre</div><div style={{ fontWeight:600 }}>{collectorName}</div></div>
                  <div><div className="label"><Phone size={10} style={{ display:"inline", marginRight:4 }} />Teléfono</div><div className="mono" style={{ fontSize:11 }}>{collectorPhone}</div></div>
                  <div><div className="label">Vehículo</div><div>{collectorVehicle}</div></div>
                  <div><div className="label">Zona de Cobertura</div><div>{collectorZone}</div></div>
                  <div><div className="label">Calificación</div><div style={{ color:"#f59e0b", fontWeight:700 }}>★ {collectorRating}</div></div>
                  <div><div className="label">Trabajos completados</div><div className="mono" style={{ color:"var(--green)" }}>{collectorJobs}</div></div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-h"><h3>Estado actual</h3></div>
              <div className="card-b">
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span className={`pill ${currentStatus === "Completed" ? "green" : currentStatus === "En Route" || currentStatus === "Arrived" ? "sky" : "amber"}`}><span className="pd"/>{currentStatus}</span>
                  <span style={{ fontSize:11, color:"var(--dim)" }}>→ {COLL_STATUSES[Math.min(statusIdx+1, COLL_STATUSES.length-1)]}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── MAP TAB ── */}
        {tab === "map" && (
          <>
            <div className="card" style={{ padding: 0, overflow:"hidden" }}>
              <div style={{ height: 320 }}>
                <MapboxMap id={`collMap-${c.id}`} center={c.location} zoom={15} reports={collectionReport as never} />
              </div>
            </div>
            <div className="card">
              <div className="card-h"><h3>Location Actions</h3></div>
              <div className="card-b">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <button className="btn" style={{ display:"flex", alignItems:"center", gap:6 }} onClick={handleCopyCoords}>
                    <Copy size={12} /> {copied ? "Copied!" : "Copy Coordinates"}
                  </button>
                  <button className="btn" style={{ display:"flex", alignItems:"center", gap:6 }}
                    onClick={() => window.open(`https://maps.google.com/?q=${c.location[0]},${c.location[1]}`, "_blank")}>
                    <Navigation size={12} /> Open in Maps
                  </button>
                  <button className="btn" style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <Route size={12} /> Route to Collector
                  </button>
                  <button className="btn" style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <Tag size={12} /> Tag Pickup Point
                  </button>
                </div>
                <div style={{ marginTop:12, padding:"8px 12px", background:"var(--bg)", borderRadius:8, border:"1px solid var(--border)" }}>
                  <div style={{ fontSize:10, color:"var(--dim)", marginBottom:4 }}>Coordinates</div>
                  <div className="mono" style={{ fontSize:12, color:"var(--text)" }}>{c.location[0].toFixed(6)}, {c.location[1].toFixed(6)}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── MONITOR TAB ── */}
        {tab === "monitor" && (
          <>
            {/* Animated route map */}
            <CollectorRouteMap c={c} collectorName={collectorName} />

            {/* Status stepper */}
            <div className="card">
              <div className="card-h"><h3>Collection Progress</h3><span className="sub">{currentStatus}</span></div>
              <div className="card-b">
                <div style={{ overflowX:"auto", paddingBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", minWidth: 480 }}>
                    {COLL_STATUSES.map((s, i) => {
                      const done = i < statusIdx;
                      const active = i === statusIdx;
                      const color = done || active ? (active ? "#6366f1" : "#10b981") : "var(--border)";
                      return (
                        <div key={s} style={{ display:"flex", alignItems:"center", flex: i < COLL_STATUSES.length - 1 ? 1 : "none" }}>
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                            <div style={{ width:24, height:24, borderRadius:"50%", background: active ? "#6366f1" : done ? "#10b981" : "var(--bg)", border:`2px solid ${color}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              {done ? <CheckCircle size={11} color="#10b981" /> : active ? <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }} /> : null}
                            </div>
                            <div style={{ fontSize:8.5, color: active ? "#6366f1" : done ? "#10b981" : "var(--dim)", fontWeight: active ? 700 : 400, textAlign:"center", whiteSpace:"nowrap", maxWidth:60, overflow:"hidden", textOverflow:"ellipsis" }}>{s}</div>
                          </div>
                          {i < COLL_STATUSES.length - 1 && (
                            <div style={{ flex:1, height:2, background: done ? "#10b981" : "var(--border)", marginBottom:18, marginLeft:2, marginRight:2 }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                  <button className="btn primary" disabled={statusIdx >= COLL_STATUSES.length - 1} onClick={handleAdvance} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <ChevronRight size={13} /> Advance Status
                  </button>
                  <button className="btn" style={{ color:"var(--sky)", borderColor:"rgba(56,189,248,0.3)", display:"flex", alignItems:"center", gap:6 }}>
                    <Navigation size={13} /> Request Update
                  </button>
                  <button className="btn" style={{ color:"#ef4444", borderColor:"rgba(239,68,68,0.3)", display:"flex", alignItems:"center", gap:6 }}>
                    <X size={13} /> Cancel Collection
                  </button>
                </div>
              </div>
            </div>

            {/* ETA & live stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              <div className="stat"><div className="lb"><Clock size={12} />ETA</div><div className="vl" style={{ color:"var(--sky)", fontFamily:"ui-monospace,monospace" }}>{c.eta} min</div></div>
              <div className="stat"><div className="lb"><Activity size={12} />Status</div><div className="vl" style={{ fontSize:11, fontWeight:700 }}>{currentStatus}</div></div>
              <div className="stat"><div className="lb"><Route size={12} />Driver</div><div className="vl" style={{ fontSize:11 }}>{c.driver || "—"}</div></div>
            </div>

            {/* Activity log */}
            <div className="card">
              <div className="card-h"><h3>Activity Log</h3></div>
              <div className="card-b" style={{ padding:0 }}>
                {[
                  { time: "just now",  msg: `Status: ${currentStatus}`,           color:"#6366f1" },
                  { time: "14 min ago", msg: `Assigned driver: ${c.driver}`,       color:"#10b981" },
                  { time: "32 min ago", msg: `Agency confirmed: ${c.agency}`,      color:"#10b981" },
                  { time: "1h ago",     msg: `Request created by ${c.citizen}`,    color:"var(--dim)" },
                  { time: "1h ago",     msg: `Scheduled: ${new Date(c.scheduleDate).toLocaleDateString()}`, color:"var(--dim)" },
                ].map((e, i) => (
                  <div key={i} style={{ display:"flex", gap:10, padding:"9px 14px", borderBottom:"1px solid var(--border)", alignItems:"flex-start" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:e.color, marginTop:5, flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:11.5, color:"var(--text)" }}>{e.msg}</div>
                    <div style={{ fontSize:10, color:"var(--dim)", whiteSpace:"nowrap" }}>{e.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      <div className="df">
        <button className="btn" onClick={onClose}>{t("common.close")}</button>
      </div>
    </>
  );
}

function ReportDrawerContent({ r, state, onClose }: { r: Report; state: AppState; onClose: () => void }) {
  const t = useT(state.lang);
  const lang = state.lang;
  const [tab, setTab] = useState<"info" | "map" | "collector">("info");
  const [copied, setCopied] = useState(false);

  const linkedCollection = state.collections.find(c => c.reportId === r.id);
  const collNum = parseInt((linkedCollection?.id ?? r.id).replace(/\D/g, "")) || 0;
  const COLL_NAMES = ["Jhon Morales", "María Ospina", "Carlos Suárez", "Ana Torres", "Luis Gómez", "Diego Castro", "Sandra Peña"];
  const COLL_PHONES = ["+57 310 234 5678", "+57 320 345 6789", "+57 315 456 7890", "+57 300 567 8901", "+57 311 678 9012"];
  const COLL_VEHICLES = ["Cargo bicycle", "Motorcycle + trailer", "Pickup truck", "Hand cart", "Motorcycle + trailer"];
  const COLL_ZONES = ["Kennedy", "Suba", "Bosa", "Engativá", "Chapinero", "Fontibón", "Usaquén"];
  const collectorId = linkedCollection ? `COLL-${linkedCollection.id.replace("CR-", "")}` : `COLL-${r.id.replace("WR-", "")}`;
  const collectorName = linkedCollection?.driver || COLL_NAMES[collNum % COLL_NAMES.length];
  const collectorPhone = COLL_PHONES[collNum % COLL_PHONES.length];
  const collectorVehicle = COLL_VEHICLES[collNum % COLL_VEHICLES.length];
  const collectorZone = COLL_ZONES[collNum % COLL_ZONES.length];
  const collectorRating = (4.0 + (collNum % 10) * 0.1).toFixed(1);
  const collectorJobs = 28 + (collNum % 180);

  const reportForMap = [{ id: r.id, citizen: r.citizen, type: r.type, status: r.status, location: r.location, reportedAt: r.reportedAt, agency: r.agency, statusEs: r.statusEs, typeEs: r.typeEs, aiClass: r.aiClass, confidence: r.confidence, recommendedAction: r.recommendedAction, image: null, description: r.description }];

  const TABS = [
    { key: "info" as const, label: "Info", icon: <Eye size={12} /> },
    { key: "map" as const, label: "Mapa", icon: <MapPin size={12} /> },
    { key: "collector" as const, label: lang === "es" ? "Colector" : "Collector", icon: <User size={12} /> },
  ];

  return (
    <>
      <div className="dh" style={{ flexDirection: "column", alignItems: "flex-start", gap: 10, padding: "12px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 10 }}>
          <span className="mono" style={{ color: "var(--sky)", fontSize: 13, fontWeight: 700 }}>{r.id}</span>
          <span className={`pill ${getStatusPill(r.status)}`}><span className="pd" />{lang === "es" ? r.statusEs : r.status}</span>
          <button className="iconbtn" style={{ marginLeft: "auto" }} onClick={onClose}><X size={15} /></button>
        </div>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", width: "100%", marginTop: 4 }}>
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", fontSize: 11.5, fontWeight: 600, border: "none", background: "none", cursor: "pointer", color: tab === tb.key ? "var(--sky)" : "var(--muted)", borderBottom: tab === tb.key ? "2px solid var(--sky)" : "2px solid transparent", marginBottom: -1, transition: "color .15s" }}>
              {tb.icon}{tb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="db" style={{ padding: "14px 16px" }}>
        {tab === "info" && (
          <>
            <div className="card">
              <div className="card-h"><h3>Detalles del reporte</h3></div>
              <div className="card-b">
                <div className="field-grid">
                  <div><div className="label">Ciudadano</div><div style={{ fontWeight: 600 }}>{r.citizen}</div></div>
                  <div><div className="label">{t("reports.type")}</div><div>{lang === "es" ? r.typeEs : r.type}</div></div>
                  <div><div className="label">Clasificación IA</div><div>{r.aiClass} <span className="mono" style={{ color: "var(--dim)", fontSize: 10.5 }}>({Math.round(parseFloat(r.confidence) * 100)}%)</span></div></div>
                  <div><div className="label">Acción recomendada</div><div>{r.recommendedAction}</div></div>
                  <div><div className="label">{t("reports.agency")}</div><div>{r.agency}</div></div>
                  <div><div className="label">Estado</div><div><span className={`pill ${getStatusPill(r.status)}`}><span className="pd" />{lang === "es" ? r.statusEs : r.status}</span></div></div>
                  <div><div className="label">Lat</div><div className="mono">{r.location[0].toFixed(5)}</div></div>
                  <div><div className="label">Lng</div><div className="mono">{r.location[1].toFixed(5)}</div></div>
                  <div style={{ gridColumn: "1/-1" }}><div className="label">Fecha de reporte</div><div className="mono" style={{ fontSize: 11 }}>{new Date(r.reportedAt).toLocaleString()}</div></div>
                </div>
                {r.description && (
                  <div style={{ marginTop: 12 }}>
                    <div className="label">Descripción</div>
                    <div style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.5, marginTop: 4 }}>{r.description}</div>
                  </div>
                )}
              </div>
            </div>
            {linkedCollection && (
              <div className="card">
                <div className="card-h"><h3>Solicitud de recolección</h3><span className="sub mono" style={{ color: "var(--sky)" }}>{linkedCollection.id}</span></div>
                <div className="card-b">
                  <div className="field-grid">
                    <div><div className="label">Vehículo</div><div className="mono">{linkedCollection.vehicle}</div></div>
                    <div><div className="label">ETA</div><div className="mono" style={{ color: "var(--sky)" }}>{linkedCollection.eta} min</div></div>
                    <div><div className="label">Estado</div><div><span className={`pill ${getStatusPill(linkedCollection.status)}`}><span className="pd" />{linkedCollection.status}</span></div></div>
                    <div><div className="label">Programado</div><div className="mono" style={{ fontSize: 11 }}>{new Date(linkedCollection.scheduleDate).toLocaleDateString()}</div></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "map" && (
          <>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: 360 }}>
                <MapboxMap id={`reportMap-${r.id}`} center={r.location} zoom={15} reports={reportForMap as never} />
              </div>
            </div>
            <div className="card">
              <div className="card-b">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button className="btn" style={{ display: "flex", alignItems: "center", gap: 6 }}
                    onClick={() => { navigator.clipboard.writeText(`${r.location[0].toFixed(6)}, ${r.location[1].toFixed(6)}`); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
                    <Copy size={12} /> {copied ? "¡Copiado!" : "Copiar coordenadas"}
                  </button>
                  <button className="btn" style={{ display: "flex", alignItems: "center", gap: 6 }}
                    onClick={() => window.open(`https://maps.google.com/?q=${r.location[0]},${r.location[1]}`, "_blank")}>
                    <Navigation size={12} /> Abrir en Maps
                  </button>
                </div>
                <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, color: "var(--dim)", marginBottom: 4 }}>Coordenadas</div>
                  <div className="mono" style={{ fontSize: 12 }}>{r.location[0].toFixed(6)}, {r.location[1].toFixed(6)}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "collector" && (
          <>
            <div className="card">
              <div className="card-h"><h3 style={{ display: "flex", gap: 6, alignItems: "center" }}><User size={13} color="#f59e0b" /> Colector Informal Asignado</h3></div>
              <div className="card-b">
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14, padding: "8px 12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8 }}>
                  <Hash size={11} color="#f59e0b" />
                  <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>{collectorId}</span>
                  <span style={{ fontSize: 10, color: "var(--dim)", marginLeft: 4 }}>ID del colector asignado</span>
                </div>
                <div className="field-grid">
                  <div><div className="label">Nombre</div><div style={{ fontWeight: 600 }}>{collectorName}</div></div>
                  <div><div className="label">Teléfono</div><div className="mono" style={{ fontSize: 11 }}>{collectorPhone}</div></div>
                  <div><div className="label">Vehículo</div><div>{collectorVehicle}</div></div>
                  <div><div className="label">Zona de cobertura</div><div>{collectorZone}</div></div>
                  <div><div className="label">Calificación</div><div style={{ color: "#f59e0b", fontWeight: 700 }}>★ {collectorRating}</div></div>
                  <div><div className="label">Trabajos completados</div><div className="mono" style={{ color: "var(--green)" }}>{collectorJobs}</div></div>
                </div>
              </div>
            </div>
            {linkedCollection && (
              <div className="card">
                <div className="card-h"><h3>Solicitud vinculada</h3><span className="sub mono" style={{ color: "var(--sky)" }}>{linkedCollection.id}</span></div>
                <div className="card-b">
                  <div className="field-grid">
                    <div><div className="label">Conductor</div><div style={{ fontWeight: 600 }}>{linkedCollection.driver}</div></div>
                    <div><div className="label">Agencia</div><div>{linkedCollection.agency}</div></div>
                    <div><div className="label">Vehículo</div><div className="mono">{linkedCollection.vehicle}</div></div>
                    <div><div className="label">ETA</div><div className="mono" style={{ color: "var(--sky)" }}>{linkedCollection.eta} min</div></div>
                    <div><div className="label">Estado</div><div><span className={`pill ${getStatusPill(linkedCollection.status)}`}><span className="pd" />{linkedCollection.status}</span></div></div>
                    <div><div className="label">Fecha programada</div><div className="mono" style={{ fontSize: 11 }}>{new Date(linkedCollection.scheduleDate).toLocaleDateString()}</div></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="df">
        <button className="btn" onClick={onClose}>{t("common.close")}</button>
      </div>
    </>
  );
}

function DetailDrawer({ drawer, state, onClose }: { drawer: DrawerState; state: AppState; onClose: () => void; }) {
  return (
    <AnimatePresence>
      {drawer.open && (
        <>
          <motion.div className="drawer-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="drawer"
            style={drawer.type === "collection" ? { width: 580 } : { width: 560 }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            {drawer.type === "report" && drawer.data && (
              <ReportDrawerContent r={drawer.data as Report} state={state} onClose={onClose} />
            )}
            {drawer.type === "collection" && drawer.data && (
              <CollectionDrawerContent
                c={drawer.data as Collection}
                state={state}
                initialTab={drawer.tab ?? "info"}
                onClose={onClose}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Mobile sidebar overlay ───────────────────────────────────────────────────

function MobileSidebarOverlay({ state, onNav, onClose }: { state: AppState; onNav: (p: Page) => void; onClose: () => void; }) {
  const t = useT(state.lang);
  return (
    <AnimatePresence>
      {state.mobileSidebar && (
        <>
          <motion.div className="drawer-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ zIndex: 45 }} />
          <motion.div
            style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 260, zIndex: 50, background: "var(--panel)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            <div className="sb-glow" />
            <div className="sb-logo">
              <div className="lg-ic"><img src={logoImg} alt="PV" /></div>
              <div className="lg-tx"><b>Punto Vivo</b><span>Bogotá Operaciones</span></div>
              <button className="iconbtn" style={{ marginLeft: "auto" }} onClick={onClose}><X size={15} /></button>
            </div>
            <nav className="sb-nav">
              {NAV.map(({ key, icon: Icon, badge }) => {
                const active = state.page === key;
                const bc = badge ? badge(state) : 0;
                return (
                  <button key={key} className={`sb-item${active ? " active" : ""}`} onClick={() => { onNav(key); onClose(); }}>
                    <Icon size={15} />
                    <span style={{ flex: 1 }}>{t(`nav.${key}`)}</span>
                    {active && <span className="sb-active-dot" />}
                    {bc > 0 && !active && <span className={`sb-badge${key === "collections" ? " amber" : ""}`}>{bc}</span>}
                  </button>
                );
              })}
            </nav>
            <div className="sb-foot">
              {state.user && (
                <div className="pf">
                  <div className="avatar">{state.user.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
                  <div><div className="nm">{state.user.name}</div><div className="rl">{state.user.role}</div></div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Page content transition ──────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

// ─── Main App ─────────────────────────────────────────────────────────────────

let toastId = 0;

export default function App() {
  const [state, setState] = useState<AppState>(mkState);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // UIlora SpotlightCard effect — track mouse position on all .card/.stat elements
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const els = document.querySelectorAll(".card, .stat") as NodeListOf<HTMLElement>;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const update = useCallback((patch: Partial<AppState>) => setState(s => ({ ...s, ...patch })), []);

  // Close notif on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-dismiss toasts
  useEffect(() => {
    const last = state.toasts[state.toasts.length - 1];
    if (!last) return;
    const t = setTimeout(() => dismissToast(last.id), 4200);
    return () => clearTimeout(t);
  }, [state.toasts]);

  function addToast(type: Toast["type"], title: string, body: string) {
    const id = ++toastId;
    setState(s => ({ ...s, toasts: [...s.toasts.slice(-3), { id, type, title, body }] }));
  }

  function dismissToast(id: number) {
    setState(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }));
  }

  function handleLogin(user: { name: string; email: string; role: string }) {
    update({ user });
    setTimeout(() => addToast("success", "Bienvenido", `Sesión iniciada como ${user.name}`), 400);
  }

  function handleLogout() {
    setState(mkState());
  }

  function handleNav(page: Page) {
    update({ page, mobileSidebar: false });
  }

  function handleLang(lang: Lang) {
    update({ lang });
  }

  if (!state.user) {
    return <LoginScreen lang={state.lang} onLogin={handleLogin} onLangChange={handleLang} />;
  }

  // View props
  const viewReport = (id: string) => {
    const r = state.reports.find(x => x.id === id);
    if (r) update({ drawer: { open: true, type: "report", data: r } });
  };
  const viewCollection = (id: string, tab?: string) => {
    const c = state.collections.find(x => x.id === id);
    if (c) update({ drawer: { open: true, type: "collection", data: c, tab } });
  };

  return (
    <div className="app-shell">
      <Sidebar state={state} onNav={handleNav} onCollapse={() => update({ sidebarOpen: !state.sidebarOpen })} />
      <MobileSidebarOverlay state={state} onNav={handleNav} onClose={() => update({ mobileSidebar: false })} />

      <div className="main">
        <Topbar
          state={state}
          onLang={handleLang}
          onLogout={handleLogout}
          onMobileMenu={() => update({ mobileSidebar: true })}
          onNotif={() => setNotifOpen(v => !v)}
          notifOpen={notifOpen}
          onCloseNotif={() => setNotifOpen(false)}
        />

        <div className="page">
          <AnimatePresence mode="wait">
            <motion.div key={state.page} variants={pageVariants} initial="hidden" animate="show" exit="exit" style={{ height: "100%" }}>
              {state.page === "dashboard" && (
                <Dashboard state={state} />
              )}
              {state.page === "reports" && (
                <Reports state={state} onViewReport={viewReport} />
              )}
              {state.page === "collections" && (
                <Collections state={state} onViewCollection={(id, tab) => viewCollection(id, tab)} onToggleKanban={() => update({ kanbanMode: !state.kanbanMode })} />
              )}
              {state.page === "tracking" && <Tracking state={state} />}
              {state.page === "ecopoints" && <EcoPoints state={state} />}
              {state.page === "citizens" && <Citizens state={state} />}
              {state.page === "agencies" && <Agencies state={state} />}
              {state.page === "fleet" && <Fleet state={state} />}
              {state.page === "rewards" && (
                <Rewards
                  state={state}
                  onApprove={id => { update({ rewards: state.rewards.map(r => r.id === id ? { ...r, pendingRedemptions: Math.max(0, r.pendingRedemptions - 1), approvedRedemptions: r.approvedRedemptions + 1 } : r) }); addToast("success", "Aprobado", `Canje ${id} aprobado`); }}
                  onReject={id => { update({ rewards: state.rewards.map(r => r.id === id ? { ...r, pendingRedemptions: Math.max(0, r.pendingRedemptions - 1), rejectedRedemptions: r.rejectedRedemptions + 1 } : r) }); addToast("info", "Rechazado", `Canje ${id} rechazado`); }}
                />
              )}
              {state.page === "analytics" && <Analytics state={state} />}
              {state.page === "ai" && <AIPrediction state={state} />}
              {state.page === "marketplace" && <Marketplace state={state} />}
              {state.page === "subscription" && <Subscription state={state} />}
              {state.page === "settings" && (
                <Settings state={state} onSave={() => addToast("success", "Guardado", "Configuración actualizada")} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DetailDrawer drawer={state.drawer} state={state} onClose={() => update({ drawer: { open: false, type: null, data: null } })} />
      <ToastContainer toasts={state.toasts} onDismiss={dismissToast} />
    </div>
  );
}
