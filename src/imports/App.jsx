<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Punto Vivo Bogotá — Sistema Inteligente de Gestión de Residuos Voluminosos</title>
<link rel="icon" type="image/png" href="https://image.qwenlm.ai/public_source/336adb89-9b16-413d-a580-66cd15437c99/11774eb4d-181a-4fc2-919b-6ee2b4a4bd54.png">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<style>
:root{
--bg:#0a0f1c;--panel:#0f1629;--card:#131c33;--card2:#17203a;--border:#1e2a45;--border2:#2a3a5c;
--text:#e7eef9;--muted:#8ea6c6;--dim:#5b7396;
--green:#22c55e;--green-d:#052e16;--green-l:#4ade80;
--red:#ef4444;--red-d:#450a0a;--red-l:#f87171;
--amber:#f59e0b;--amber-d:#451a03;--amber-l:#fbbf24;
--sky:#38bdf8;--sky-d:#082f49;--sky-l:#7dd3fc;
--violet:#a78bfa;--violet-d:#1b1436;--violet-l:#c4b5fd;
--mono:'JetBrains Mono',ui-monospace,monospace;
--font:'Inter',system-ui,-apple-system,sans-serif;
--radius:12px;--radius-lg:16px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body,#app{height:100%}
body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;overflow:hidden}
::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-thumb{background:#26385a;border-radius:8px}::-webkit-scrollbar-track{background:transparent}
button{font-family:var(--font);cursor:pointer;border:none;background:none;color:inherit}
input,select,textarea{font-family:var(--font)}
:focus-visible{outline:2px solid var(--sky);outline-offset:2px;border-radius:6px}

/* LOGIN */
.login-wrap{min-height:100vh;display:grid;place-items:center;background:radial-gradient(1200px 600px at 70% -10%,#12305e 0%,var(--bg) 60%);padding:20px;position:relative}
.login-lang-switch{position:absolute;top:20px;right:20px;z-index:10;display:flex;gap:6px}
.login-lang-switch .lang-btn{background:#182848;border:1px solid var(--border);color:var(--muted);padding:8px 14px;font-size:12px;font-weight:700;border-radius:8px;transition:all .16s}
.login-lang-switch .lang-btn:hover{color:var(--text);background:#1d3054}
.login-lang-switch .lang-btn.active{background:var(--sky);color:#0a0f1c;border-color:var(--sky)}
.login-card{width:440px;max-width:100%;background:var(--card);border:1px solid var(--border);border-radius:18px;padding:32px;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.login-logo{width:120px;height:120px;margin:0 auto 20px;display:block;border-radius:16px;overflow:hidden;background:#fff;padding:8px}
.login-logo img{width:100%;height:100%;object-fit:contain}
.login-card h1{font-size:22px;font-weight:800;text-align:center;margin-bottom:4px}
.login-card .subtitle{text-align:center;color:var(--muted);font-size:12.5px;margin-bottom:24px;line-height:1.5}
.login-card label{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:6px;margin-top:14px}
.login-card input{width:100%;background:#0d1728;border:1px solid var(--border);color:var(--text);border-radius:10px;padding:11px 13px;font-size:13.5px}
.login-card input:focus{border-color:var(--sky)}
.login-card .btn-primary{width:100%;margin-top:20px;padding:12px;background:#0284c7;border:none;color:#fff;border-radius:10px;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .16s}
.login-card .btn-primary:hover:not(:disabled){background:#0369a1}
.login-card .btn-primary:disabled{opacity:.6;cursor:not-allowed}
.login-hint{margin-top:16px;padding:10px 12px;border:1px dashed #4c3a8f;background:#1b1436;color:#c4b5fd;border-radius:10px;font-size:11.5px;line-height:1.5}
.login-hint code{background:#0d1728;padding:1px 5px;border-radius:4px;font-family:var(--mono);font-size:10.5px}
.login-error{margin-top:12px;padding:10px 12px;border:1px solid #7f1d1d;background:#2a0d0d;border-radius:10px;color:#fca5a5;font-size:12.5px;display:flex;gap:8px;align-items:center}

/* APP SHELL */
.app-shell{display:flex;height:100vh;overflow:hidden}
.sidebar{width:260px;min-width:260px;background:var(--panel);border-right:1px solid var(--border);display:flex;flex-direction:column;transition:width .25s,min-width .25s;z-index:40;overflow:hidden}
.sidebar.collapsed{width:72px;min-width:72px}
.sb-logo{display:flex;gap:10px;align-items:center;padding:16px;border-bottom:1px solid var(--border)}
.sb-logo .lg-ic{width:40px;height:40px;border-radius:10px;background:#fff;display:grid;place-items:center;flex:none;overflow:hidden;padding:3px}
.sb-logo .lg-ic img{width:100%;height:100%;object-fit:contain}
.sb-logo .lg-tx b{display:block;font-size:13px;letter-spacing:.4px;color:var(--text)}.sb-logo .lg-tx span{font-size:10.5px;color:var(--muted);line-height:1.3}
.sb-nav{flex:1;padding:10px;display:flex;flex-direction:column;gap:3px;overflow-y:auto}
.sb-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;color:var(--muted);background:none;border:none;font-size:13px;font-weight:600;text-align:left;width:100%;transition:background .15s,color .15s}
.sb-item:hover{background:#182848;color:var(--text)}
.sb-item.active{background:#1b3055;color:#fff;box-shadow:inset 3px 0 0 var(--sky)}
.sb-item .sb-badge{margin-left:auto;background:var(--red);color:#fff;font-size:10px;font-weight:700;border-radius:999px;padding:2px 7px;font-family:var(--mono)}
.sb-item .sb-badge.amber{background:var(--amber)}
.sb-foot{border-top:1px solid var(--border);padding:12px}
.sb-foot .pf{display:flex;gap:10px;align-items:center;padding:6px}
.sb-foot .pf .nm{font-size:12.5px;font-weight:600}.sb-foot .pf .rl{font-size:11px;color:var(--muted)}
.sb-foot .acts{display:flex;gap:6px;margin-top:8px}

.iconbtn{background:#182848;border:1px solid var(--border);color:var(--muted);border-radius:8px;padding:7px 9px;display:inline-flex;align-items:center;gap:6px;font-size:12px;transition:all .16s}
.iconbtn:hover{color:var(--text);background:#1d3054}
.avatar{width:36px;height:36px;border-radius:10px;overflow:hidden;background:#1b3055;display:grid;place-items:center;font-weight:700;color:var(--sky);flex:none;font-size:13px}
.avatar img{width:100%;height:100%;object-fit:cover}

.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
.topbar{display:flex;align-items:center;gap:14px;padding:14px 22px;border-bottom:1px solid var(--border);background:rgba(15,22,41,.85);backdrop-filter:blur(8px);flex-wrap:wrap}
.tb-title h1{font-size:17px;font-weight:800}.tb-title p{font-size:11.5px;color:var(--muted)}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.tb-menu{display:none}
.conn-pill{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono);font-size:10.5px;font-weight:600;border-radius:999px;padding:5px 11px;border:1px solid var(--border)}
.conn-pill .dot{width:7px;height:7px;border-radius:50%}
.conn-pill.live{color:#4ade80;border-color:#14532d;background:#052e16}.conn-pill.live .dot{background:var(--green);animation:pulse 1.6s infinite}
.conn-pill.reconnecting{color:#fbbf24;border-color:#713f12;background:#451a03}.conn-pill.reconnecting .dot{background:var(--amber);animation:pulse .8s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(255,255,255,.25)}70%{box-shadow:0 0 0 7px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}
.lang-switch{display:flex;background:#0d1728;border:1px solid var(--border);border-radius:8px;overflow:hidden}
.lang-switch button{padding:5px 10px;font-size:11px;font-weight:700;color:var(--muted);transition:all .16s}
.lang-switch button.active{background:var(--sky);color:#0a0f1c}

.page{flex:1;overflow-y:auto;padding:22px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:0 4px 18px rgba(0,0,0,.25)}
.card-h{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--border);flex-wrap:wrap}
.card-h h3{font-size:12.5px;font-weight:800;letter-spacing:.3px;text-transform:uppercase}.card-h .sub{font-size:11px;color:var(--muted)}
.card-b{padding:16px}
.grid{display:grid;gap:16px}.g2{grid-template-columns:repeat(2,1fr)}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}.g5{grid-template-columns:repeat(5,1fr)}

.stat{position:relative;overflow:hidden;padding:16px;border-radius:var(--radius-lg);background:var(--card);border:1px solid var(--border);display:flex;flex-direction:column;gap:6px;transition:transform .15s,border-color .15s,box-shadow .15s}
.stat:hover{border-color:#31507f;box-shadow:0 12px 28px rgba(2,10,30,.34)}
.stat .lb{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.6px}
.stat .lb .ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:none}
.stat .vl{font-family:var(--mono);font-size:22px;font-weight:700}.stat .vl.big{font-size:28px}.stat .sb2{font-size:11px;color:var(--muted)}
.t-green{color:#4ade80}.t-red{color:#f87171}.t-amber{color:#fbbf24}.t-sky{color:#7dd3fc}.t-violet{color:#c4b5fd}

.pill{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:3px 9px;font-size:10.5px;font-weight:700;font-family:var(--mono)}
.pill .pd{width:6px;height:6px;border-radius:50%}
.pill.green{background:#052e16;color:#4ade80;border:1px solid #14532d}.pill.green .pd{background:var(--green)}
.pill.red{background:#450a0a;color:#f87171;border:1px solid #7f1d1d}.pill.red .pd{background:var(--red)}
.pill.amber{background:#451a03;color:#fbbf24;border:1px solid #713f12}.pill.amber .pd{background:var(--amber)}
.pill.sky{background:#082f49;color:#7dd3fc;border:1px solid #164e63}.pill.sky .pd{background:var(--sky)}
.pill.violet{background:#1b1436;color:#c4b5fd;border:1px solid #4c3a8f}.pill.violet .pd{background:var(--violet)}
.sev{border-radius:6px;padding:2px 7px;font-size:10px;font-weight:700;font-family:var(--mono);text-transform:uppercase}
.sev.low{background:#082f49;color:#7dd3fc}.sev.medium{background:#451a03;color:#fbbf24}.sev.high{background:#431407;color:#fb923c}.sev.critical{background:#450a0a;color:#f87171}

.tbl-wrap{overflow-x:auto}table.tbl{width:100%;border-collapse:collapse;font-size:12.5px;min-width:760px}
.tbl th{padding:10px 14px;text-align:left;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid var(--border);background:#0d1728}
.tbl td{padding:11px 14px;border-bottom:1px solid #1a2a45;vertical-align:middle}.tbl tbody tr:hover{background:#14233d}
.mono{font-family:var(--mono)}

.btn{display:inline-flex;align-items:center;gap:7px;border-radius:10px;padding:8px 13px;font-size:12.5px;font-weight:600;border:1px solid var(--border);background:#182848;color:var(--text);transition:all .16s}
.btn:hover{background:#1e335a}.btn.primary{background:#0284c7;border-color:#0284c7;color:#fff}.btn.primary:hover{background:#0369a1}
.btn.danger{background:#7f1d1d;border-color:#991b1b;color:#fecaca}.btn.danger:hover{background:#991b1b}
.btn.ghost{background:transparent}.btn:disabled{opacity:.5;cursor:not-allowed}
.btn.sm{padding:5px 9px;font-size:11px}
.input,.select,.textarea{background:#0d1728;border:1px solid var(--border);color:var(--text);border-radius:10px;padding:9px 12px;font-size:13px;width:100%}
.input:focus,.select:focus,.textarea:focus{border-color:var(--sky)}
.textarea{resize:vertical;min-height:64px;line-height:1.5}
.label{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:6px}

.toasts{position:fixed;top:16px;right:16px;z-index:1100;display:flex;flex-direction:column;gap:10px;width:330px;max-width:calc(100vw - 32px)}
.toast{display:flex;gap:10px;align-items:flex-start;border-radius:12px;padding:12px;border:1px solid var(--border);background:#101c31;box-shadow:0 10px 30px rgba(0,0,0,.45);animation:tin .25s ease}
@keyframes tin{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}
.toast .tic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;flex:none}
.toast.success .tic{background:#052e16;color:#4ade80}.toast.alert .tic{background:#450a0a;color:#f87171}.toast.info .tic{background:#1e293b;color:#94a3b8}
.toast b{font-size:12.5px;display:block}.toast p{font-size:11.5px;color:var(--muted);margin-top:2px}
.toast .tx{margin-left:auto;background:none;border:none;color:var(--muted);padding:2px}

.menu-wrap{position:relative}
.menu{position:absolute;right:0;top:calc(100% + 8px);width:320px;max-width:80vw;background:var(--card);border:1px solid var(--border);border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.5);z-index:60;overflow:hidden;animation:tin .18s ease}
.menu .mh{padding:12px 14px;border-bottom:1px solid var(--border);font-size:12px;font-weight:700}
.menu .ml{max-height:340px;overflow-y:auto}
.menu .mi{display:flex;gap:10px;padding:11px 14px;border-bottom:1px solid #1a2a45;font-size:12px;cursor:pointer;transition:background .12s}.menu .mi:hover{background:#14233d}.menu .mi:last-child{border-bottom:none}

.empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:40px 20px;color:var(--muted);text-align:center}
.empty .eic{width:46px;height:46px;border-radius:12px;background:#182848;display:grid;place-items:center}

/* Map */
.map-container{height:500px;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border)}
.map-container.full{height:calc(100vh - 180px)}
.leaflet-container{background:#0a0f1c}

/* Kanban */
.kanban{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;overflow-x:auto}
.kanban-col{background:#0d1728;border:1px solid var(--border);border-radius:12px;padding:12px;min-height:300px}
.kanban-col h4{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--muted);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.kanban-col h4 .count{background:var(--border);padding:2px 7px;border-radius:999px;font-size:10px}
.kanban-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:8px;cursor:pointer;transition:all .12s}
.kanban-card:hover{border-color:var(--sky);transform:translateY(-1px)}
.kanban-card .kc-id{font-family:var(--mono);font-size:10.5px;color:var(--sky);font-weight:600}
.kanban-card .kc-title{font-size:12px;margin:4px 0;font-weight:600}
.kanban-card .kc-meta{font-size:10.5px;color:var(--muted);display:flex;justify-content:space-between}

/* Log stream */
.log-stream{background:#060b16;border:1px solid var(--border);border-radius:12px;padding:14px;font-family:var(--mono);font-size:11.5px;height:400px;overflow-y:auto}
.log-line{padding:4px 0;border-bottom:1px solid #1a2a45;display:flex;gap:10px}
.log-line:last-child{border-bottom:none}
.log-time{color:var(--dim);flex:none}
.log-type{font-weight:700;flex:none;min-width:140px}
.log-msg{color:#b9c9e2;flex:1}

/* Hero */
.hero{position:relative;border-radius:20px;overflow:hidden;border:1px solid #24365c;min-height:180px;box-shadow:0 20px 50px rgba(2,10,30,.45);margin-bottom:20px}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.4}
.hero-veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,10,22,.95) 0%,rgba(5,10,22,.78) 45%,rgba(5,10,22,.25) 100%)}
.hero-in{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:20px;padding:26px 28px}
.hero-kicker{font-family:var(--mono);font-size:10px;letter-spacing:2.6px;color:var(--sky);font-weight:600;margin-bottom:9px;display:flex;align-items:center;gap:8px}
.hero-title{font-size:28px;font-weight:800;letter-spacing:-.4px;line-height:1.08}
.hero-sub{margin-top:9px;color:#aec3e0;font-size:12.5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.hero-stats{margin-left:auto;display:flex;gap:12px;flex-wrap:wrap}
.hero-chip{background:rgba(8,15,30,.74);border:1px solid #24365c;backdrop-filter:blur(6px);border-radius:14px;padding:10px 14px;min-width:120px}
.hero-chip .hc-l{font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-weight:700}
.hero-chip .hc-v{font-family:var(--mono);font-size:17px;font-weight:700;margin-top:3px}

/* Tabs */
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--border);margin-bottom:16px;flex-wrap:wrap}
.tab{padding:9px 14px;font-size:12.5px;font-weight:600;color:var(--muted);border-bottom:2px solid transparent;cursor:pointer;transition:all .16s}
.tab:hover{color:var(--text)}.tab.active{color:var(--sky);border-bottom-color:var(--sky)}

/* News card */
.news-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:all .16s}
.news-card:hover{border-color:var(--sky);transform:translateY(-2px)}
.news-card img{width:100%;height:160px;object-fit:cover}
.news-card .nc-body{padding:14px}
.news-card .nc-title{font-size:14px;font-weight:700;margin-bottom:6px}
.news-card .nc-excerpt{font-size:12px;color:var(--muted);line-height:1.5}
.news-card .nc-meta{font-size:10.5px;color:var(--dim);margin-top:8px;display:flex;justify-content:space-between}

/* Responsive */
@media(max-width:1200px){.g4,.g5{grid-template-columns:repeat(2,1fr)}}
@media(max-width:1024px){.sidebar{position:fixed;left:0;top:0;bottom:0;transform:translateX(-100%);transition:transform .25s}.sidebar.mobile-open{transform:none;box-shadow:30px 0 60px rgba(0,0,0,.5)}.tb-menu{display:inline-flex}.g3{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.g2,.g3,.g4,.g5{grid-template-columns:1fr}.page{padding:14px}.tb-title p{display:none}.field-grid{grid-template-columns:1fr}.hero-title{font-size:20px}.hero-stats{margin-left:0}}

/* Animations */
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.rise{animation:rise .55s cubic-bezier(.22,1,.36,1) both}
@keyframes rowflash{0%{background:rgba(34,197,94,.22)}100%{background:transparent}}.row-flash{animation:rowflash 1.8s ease}

/* Drawer */
.drawer-back{position:fixed;inset:0;background:rgba(4,10,22,.6);z-index:800}
.drawer{position:fixed;right:0;top:0;bottom:0;width:560px;max-width:100%;background:var(--card);border-left:1px solid var(--border);z-index:850;display:flex;flex-direction:column;animation:slideIn .25s ease}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:none}}
.drawer .dh{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);background:#0d1728}
.drawer .db{overflow-y:auto;padding:20px;flex:1;display:flex;flex-direction:column;gap:16px}
.drawer .df{display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--border);background:#0d1728}

/* Search */
.search-box{position:relative}
.search-box input{padding-left:34px;width:260px;max-width:100%}
.search-box .si{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted)}
</style>
</head>
<body>
<div id="app"></div>

<script>
/* ============================================================================
PUNTO VIVO BOGOTÁ — ADMIN WEB PLATFORM
Single-file build with Views architecture, i18n, Leaflet, Chart.js
============================================================================ */

const LOGO_URL='https://image.qwenlm.ai/public_source/336adb89-9b16-413d-a580-66cd15437c99/11774eb4d-181a-4fc2-919b-6ee2b4a4bd54.png';

/* ---------- i18n ---------- */
const I18N={
es:{
app_name:'Punto Vivo Bogotá',subtitle:'Sistema Inteligente de Gestión de Residuos Voluminosos',
nav:{dashboard:'Panel',reports:'Reportes de Residuos',collections:'Solicitudes de Recolección',tracking:'Seguimiento en Vivo',ecopoints:'Ecopuntos',citizens:'Ciudadanos',agencies:'Agencias',fleet:'Flota',rewards:'Recompensas',analytics:'Analíticas',news:'Noticias',logs:'Registros',settings:'Configuración'},
dashboard:{title:'Panel de Operaciones',subtitle:'Centro de Comando de Gestión de Residuos',reports:'Reportes Totales',pending:'Pendientes',scheduled:'Programadas',active:'Activas',completed:'Completadas',citizens:'Ciudadanos Registrados',ecopoints:'Ecopuntos Activos',rewards:'Recompensas Emitidas',waste_activity:'Actividad de Residuos',categories:'Categorías de Residuos',agency_ops:'Operaciones de Agencias',map_title:'Mapa Operativo Bogotá',hotspots:'Zonas Críticas',this_month:'este mes',this_week:'esta semana'},
reports:{title:'Reportes de Residuos',id:'ID',citizen:'Ciudadano',type:'Tipo',ai_class:'Clasificación IA',location:'Ubicación',reported:'Reportado',action:'Acción',agency:'Agencia',status:'Estado',actions:'Acciones',view:'Ver',assign:'Asignar'},
collections:{title:'Solicitudes de Recolección',new:'Nueva',awaiting:'Esperando Agencia',approved:'Aprobada',scheduled:'Programada',assigned:'Colector Asignado',enroute:'En Camino',arrived:'Llegó',collected:'Recolectada',completed:'Completada',cancelled:'Cancelada'},
tracking:{title:'Seguimiento en Vivo',vehicle:'Vehículo',driver:'Conductor',distance:'Distancia',eta:'ETA',status:'Estado',request:'Solicitud'},
ecopoints:{title:'Gestión de Ecopuntos',name:'Nombre',address:'Dirección',waste:'Residuos Aceptados',hours:'Horario',capacity:'Capacidad',occupancy:'Ocupación',agency:'Agencia',status:'Estado',open:'Abierto',busy:'Ocupado',near:'Casi Lleno',full:'Lleno',closed:'Cerrado Temporalmente'},
citizens:{title:'Directorio de Ciudadanos',name:'Nombre',phone:'Teléfono',email:'Email',reports:'Reportes',collections:'Recolecciones',points:'Puntos',rewards:'Recompensas',last:'Última Actividad',status:'Estado'},
agencies:{title:'Operaciones de Agencias',name:'Nombre',type:'Tipo',contact:'Contacto',requests:'Solicitudes Activas',pending:'Pendientes',completed:'Completadas',vehicles:'Vehículos',response:'Tiempo Respuesta'},
fleet:{title:'Gestión de Flota',id:'ID',plate:'Placa',agency:'Agencia',driver:'Conductor',type:'Tipo',capacity:'Capacidad',location:'Ubicación',load:'Carga Actual',status:'Estado',available:'Disponible',assigned:'Asignado',enroute:'En Ruta',collecting:'Recolectando',maintenance:'Mantenimiento',offline:'Desconectado'},
rewards:{title:'Gestión de Recompensas',earned:'Puntos Ganados',redeemed:'Puntos Canjeados',outstanding:'Saldo Pendiente',pending_red:'Canjes Pendientes',approved_red:'Canjes Aprobados',rejected_red:'Canjes Rechazados',approve:'Aprobar',reject:'Rechazar'},
analytics:{title:'Analíticas',efficiency:'Eficiencia de Recolección',trends:'Tendencias de Residuos',hotspots:'Zonas Críticas',performance:'Rendimiento de Agencias',utilization:'Utilización de Ecopuntos'},
news:{title:'Gestión de Noticias',create:'Crear Noticia',edit:'Editar',publish:'Publicar',unpublish:'Despublicar',schedule:'Programar'},
logs:{title:'Registros de Actividad',filter:'Filtrar'},
settings:{title:'Configuración',general:'General',waste:'Residuos',ecopoints_s:'Ecopuntos',notifications:'Notificaciones',map_s:'Mapa',ai:'IA'},
auth:{email:'Correo electrónico',password:'Contraseña',signin:'Iniciar Sesión',demo:'Cuenta demo',logout:'Cerrar Sesión'},
common:{save:'Guardar',cancel:'Cancelar',delete:'Eliminar',edit:'Editar',view:'Ver',close:'Cerrar',search:'Buscar',filter:'Filtrar',export:'Exportar',loading:'Cargando...',no_data:'Sin datos',all:'Todos',yes:'Sí',no:'No',confirm:'Confirmar',status:'Estado'},
lang:{es:'ES',en:'EN'}
},
en:{
app_name:'Punto Vivo Bogotá',subtitle:'Smart Bulky Waste Management System',
nav:{dashboard:'Dashboard',reports:'Waste Reports',collections:'Collection Requests',tracking:'Live Tracking',ecopoints:'EcoPoints',citizens:'Citizens',agencies:'Agencies',fleet:'Fleet',rewards:'Rewards',analytics:'Analytics',news:'News',logs:'Activity Logs',settings:'Settings'},
dashboard:{title:'Operations Dashboard',subtitle:'Bulky Waste Management Command Center',reports:'Total Reports',pending:'Pending',scheduled:'Scheduled',active:'Active',completed:'Completed',citizens:'Registered Citizens',ecopoints:'Active EcoPoints',rewards:'Rewards Issued',waste_activity:'Waste Activity',categories:'Waste Categories',agency_ops:'Agency Operations',map_title:'Bogotá Operations Map',hotspots:'Hotspot Zones',this_month:'this month',this_week:'this week'},
reports:{title:'Waste Reports',id:'ID',citizen:'Citizen',type:'Type',ai_class:'AI Class',location:'Location',reported:'Reported',action:'Action',agency:'Agency',status:'Status',actions:'Actions',view:'View',assign:'Assign'},
collections:{title:'Collection Requests',new:'New',awaiting:'Awaiting Agency',approved:'Approved',scheduled:'Scheduled',assigned:'Collector Assigned',enroute:'En Route',arrived:'Arrived',collected:'Collected',completed:'Completed',cancelled:'Cancelled'},
tracking:{title:'Live Collection Tracking',vehicle:'Vehicle',driver:'Driver',distance:'Distance',eta:'ETA',status:'Status',request:'Request'},
ecopoints:{title:'EcoPoints Management',name:'Name',address:'Address',waste:'Accepted Waste',hours:'Hours',capacity:'Capacity',occupancy:'Occupancy',agency:'Agency',status:'Status',open:'Open',busy:'Busy',near:'Near Capacity',full:'Full',closed:'Temporarily Closed'},
citizens:{title:'Citizen Directory',name:'Name',phone:'Phone',email:'Email',reports:'Reports',collections:'Collections',points:'Points',rewards:'Rewards',last:'Last Activity',status:'Status'},
agencies:{title:'Agency Operations',name:'Name',type:'Type',contact:'Contact',requests:'Active Requests',pending:'Pending',completed:'Completed',vehicles:'Vehicles',response:'Response Time'},
fleet:{title:'Fleet Management',id:'ID',plate:'Plate',agency:'Agency',driver:'Driver',type:'Type',capacity:'Capacity',location:'Location',load:'Current Load',status:'Status',available:'Available',assigned:'Assigned',enroute:'En Route',collecting:'Collecting',maintenance:'Maintenance',offline:'Offline'},
rewards:{title:'Rewards Management',earned:'Points Earned',redeemed:'Points Redeemed',outstanding:'Outstanding Balance',pending_red:'Pending Redemptions',approved_red:'Approved Redemptions',rejected_red:'Rejected Redemptions',approve:'Approve',reject:'Reject'},
analytics:{title:'Analytics',efficiency:'Collection Efficiency',trends:'Waste Trends',hotspots:'Geographic Hotspots',performance:'Agency Performance',utilization:'EcoPoint Utilization'},
news:{title:'News Management',create:'Create News',edit:'Edit',publish:'Publish',unpublish:'Unpublish',schedule:'Schedule'},
logs:{title:'Activity Logs',filter:'Filter'},
settings:{title:'Settings',general:'General',waste:'Waste',ecopoints_s:'EcoPoints',notifications:'Notifications',map_s:'Map',ai:'AI'},
auth:{email:'Email',password:'Password',signin:'Sign In',demo:'Demo account',logout:'Sign Out'},
common:{save:'Save',cancel:'Cancel',delete:'Delete',edit:'Edit',view:'View',close:'Close',search:'Search',filter:'Filter',export:'Export',loading:'Loading...',no_data:'No data',all:'All',yes:'Yes',no:'No',confirm:'Confirm',status:'Status'},
lang:{es:'ES',en:'EN'}
}
};
let currentLang='es';
const t=(path)=>{const keys=path.split('.');let obj=I18N[currentLang];for(const k of keys){if(obj===undefined)return path;obj=obj[k];}return obj||path;};

/* ---------- State ---------- */
const State={
user:null,page:'dashboard',sidebarOpen:true,mobileSidebar:false,lang:'es',
notifications:[],connection:'live',
stats:{reports:12842,pending:284,scheduled:156,active:42,completed:11890,citizens:8420,ecopoints:28,rewards:3420},
reports:[],collections:[],ecopoints:[],citizens:[],agencies:[],vehicles:[],rewards:[],news:[],logs:[],
chartRange:'30',kanbanMode:false,
selectedReport:null,selectedCollection:null,selectedCitizen:null,selectedEcopoint:null
};

/* ---------- Mock Data ---------- */
const BOGOTA_COORDS=[[4.7110,-74.0721],[4.6533,-74.0836],[4.6685,-74.1065],[4.6097,-74.0817],[4.7517,-74.0584],[4.6981,-74.0420],[4.5964,-74.0757],[4.7866,-74.0458],[4.6400,-74.0900],[4.6800,-74.0600],[4.7200,-74.0800],[4.6600,-74.0700]];
const WASTE_TYPES=['Furniture','Mattresses','Appliances','Electronics','Wood','Construction','Garden','Household','Other'];
const WASTE_TYPES_ES=['Muebles','Colchones','Electrodomésticos','Electrónicos','Madera','Construcción','Jardín','Hogar','Otros'];
const STATUSES=['Submitted','AI Processing','EcoPoint Recommended','Awaiting Citizen','Collection Requested','Agency Review','Scheduled','Collector En Route','Collected','Completed','Cancelled'];
const STATUSES_ES=['Enviado','Procesando IA','Ecopunto Recomendado','Esperando Ciudadano','Recolección Solicitada','Revisión Agencia','Programada','Colector En Camino','Recolectado','Completado','Cancelado'];
const AGENCIES=['UAESP','Secretaría de Ambiente','Alcaldía Local Chapinero','Alcaldía Local Usaquén','Alcaldía Local Suba','Alcaldía Local Kennedy','Recicladores Organizados','Limpieza Bogotá SAS'];
const DRIVERS=['Carlos Andrés Rodríguez','María Fernanda Gómez','Juan Sebastián Martínez','Valentina Torres','Andrés Felipe Cárdenas','Camila Rodríguez','Luis Miguel Herrera','Sofía Ramírez'];
const VEHICLES=['PV-001','PV-002','PV-003','PV-004','PV-005','PV-006','PV-007','PV-008','PV-009','PV-010'];
const CITIZEN_NAMES=['Ana María López','Pedro José Sánchez','Laura Cristina Díaz','Miguel Ángel Torres','Carmen Rosa Vargas','Diego Fernando Castro','Isabella Martínez','Santiago Gómez','Valentina Herrera','Mateo Rodríguez'];

function rnd(a,b){return Math.floor(a+Math.random()*(b-a+1));}
function pick(arr){return arr[rnd(0,arr.length-1)];}
function fmtDate(d){return new Date(d).toLocaleDateString(currentLang==='es'?'es-CO':'en-US',{year:'numeric',month:'short',day:'2-digit'});}
function fmtTime(d){return new Date(d).toLocaleTimeString(currentLang==='es'?'es-CO':'en-US',{hour:'2-digit',minute:'2-digit'});}
function fmtDateTime(d){return fmtDate(d)+' '+fmtTime(d);}

function generateReports(n=50){
const reports=[];const now=Date.now();
for(let i=0;i<n;i++){
const idx=rnd(1,9999);
reports.push({
id:`WR-${String(idx).padStart(4,'0')}`,
citizen:pick(CITIZEN_NAMES),
type:pick(WASTE_TYPES),
typeEs:pick(WASTE_TYPES_ES),
aiClass:pick(WASTE_TYPES),
confidence:(0.75+Math.random()*0.24).toFixed(2),
location:pick(BOGOTA_COORDS),
reportedAt:new Date(now-rnd(0,30*864e5)).toISOString(),
recommendedAction:pick(['EcoPoint','Collection','Self-disposal']),
agency:pick(AGENCIES),
status:pick(STATUSES),
statusEs:pick(STATUSES_ES),
image:null,
description:'Reporte de residuo voluminoso en vía pública'
});}
return reports.sort((a,b)=>new Date(b.reportedAt)-new Date(a.reportedAt));
}

function generateCollections(n=40){
const cols=[];const now=Date.now();
for(let i=0;i<n;i++){
const idx=rnd(1000,1999);
cols.push({
id:`CR-${idx}`,
reportId:`WR-${rnd(1000,9999)}`,
citizen:pick(CITIZEN_NAMES),
type:pick(WASTE_TYPES),
location:pick(BOGOTA_COORDS),
createdAt:new Date(now-rnd(0,14*864e5)).toISOString(),
agency:pick(AGENCIES),
vehicle:pick(VEHICLES),
driver:pick(DRIVERS),
status:pick(['New','Awaiting Agency','Approved','Scheduled','Collector Assigned','En Route','Arrived','Collected','Completed','Cancelled']),
scheduleDate:new Date(now+rnd(0,7*864e5)).toISOString(),
eta:rnd(5,45)
});}
return cols.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
}

function generateEcopoints(){
return[
{id:'EP-001',name:'Ecopunto Chapinero',address:'Cra 13 #63-45',lat:4.6533,lng:-74.0836,waste:['Furniture','Mattresses','Appliances'],hours:'7:00-17:00',capacity:500,occupancy:342,agency:'UAESP',status:'Open'},
{id:'EP-002',name:'Ecopunto Usaquén',address:'Cra 7 #153-20',lat:4.7517,lng:-74.0584,waste:['Furniture','Electronics','Wood'],hours:'8:00-16:00',capacity:400,occupancy:380,agency:'UAESP',status:'Near Capacity'},
{id:'EP-003',name:'Ecopunto Suba',address:'Cll 145 #11-25',lat:4.7866,lng:-74.0458,waste:['Mattresses','Appliances','Garden'],hours:'7:00-18:00',capacity:600,occupancy:120,agency:'UAESP',status:'Open'},
{id:'EP-004',name:'Ecopunto Kennedy',address:'Av. Américas #68-15',lat:4.6097,lng:-74.0817,waste:['Furniture','Construction','Household'],hours:'6:00-17:00',capacity:450,occupancy:445,agency:'UAESP',status:'Full'},
{id:'EP-005',name:'Ecopunto Fontibón',address:'Cll 16 #100-30',lat:4.6685,lng:-74.1065,waste:['Electronics','Appliances','Wood'],hours:'8:00-17:00',capacity:350,occupancy:180,agency:'UAESP',status:'Open'},
{id:'EP-006',name:'Ecopunto Bosa',address:'Cll 50 #80-12',lat:4.5964,lng:-74.0757,waste:['Furniture','Mattresses','Garden'],hours:'7:00-16:00',capacity:400,occupancy:320,agency:'UAESP',status:'Busy'}
];}

function generateCitizens(){
return CITIZEN_NAMES.map((name,i)=>({
id:`CIT-${String(i+1).padStart(3,'0')}`,
name,phone:`+57 3${rnd(10,99)} ${rnd(100,999)} ${rnd(1000,9999)}`,
email:name.toLowerCase().replace(/ /g,'.')+'@email.com',
reports:rnd(1,25),collections:rnd(0,15),points:rnd(50,2500),rewards:rnd(0,8),
lastActivity:new Date(Date.now()-rnd(0,30*864e5)).toISOString(),
status:Math.random()>0.1?'Active':'Inactive'
}));}

function generateAgencies(){
return AGENCIES.map((name,i)=>({
id:`AG-${String(i+1).padStart(3,'0')}`,
name,type:i<2?'Municipal':'Local',
contact:`contacto${i+1}@${name.toLowerCase().replace(/ /g,'')}.gov.co`,
requests:rnd(10,80),pending:rnd(2,15),completed:rnd(50,500),
vehicles:rnd(2,12),responseTime:rnd(15,120),
status:Math.random()>0.15?'Active':'Inactive'
}));}

function generateVehicles(){
return VEHICLES.map((id,i)=>({
id,plate:`${pick(['ABC','DEF','GHI','JKL'])}-${rnd(100,999)}`,
agency:pick(AGENCIES),driver:DRIVERS[i%DRIVERS.length],
type:pick(['Truck','Van','Pickup']),capacity:rnd(2,8),
location:pick(BOGOTA_COORDS),load:rnd(0,8),
status:pick(['Available','Assigned','En Route','Collecting','Maintenance','Offline'])
}));}

function generateRewards(){
return CITIZEN_NAMES.slice(0,8).map((name,i)=>({
id:`RW-${1000+i}`,citizen:name,pointsEarned:rnd(100,3000),
pointsRedeemed:rnd(0,1500),balance:rnd(50,2000),
pendingRedemptions:rnd(0,3),approvedRedemptions:rnd(1,10),
rejectedRedemptions:rnd(0,2),
lastRedemption:pick(['Shopping Voucher','Eco Groceries Coupon','Cash'])
}));}

function generateNews(){
return[
{id:1,title:'Nuevos Ecopuntos en Bogotá',titleEn:'New EcoPoints in Bogotá',excerpt:'Se inauguraron 3 nuevos ecopuntos en las localidades de Suba y Kennedy.',excerptEn:'3 new ecopoints were inaugurated in Suba and Kennedy localities.',image:null,date:new Date(Date.now()-2*864e5).toISOString(),published:true,scheduled:null},
{id:2,title:'Campaña de Reciclaje 2026',titleEn:'Recycling Campaign 2026',excerpt:'Únete a la campaña ciudadana de manejo responsable de residuos voluminosos.',excerptEn:'Join the citizen campaign for responsible bulky waste management.',image:null,date:new Date(Date.now()-5*864e5).toISOString(),published:true,scheduled:null},
{id:3,title:'Actualización de la App Móvil',titleEn:'Mobile App Update',excerpt:'Nueva versión con seguimiento en tiempo real de recolecciones.',excerptEn:'New version with real-time collection tracking.',image:null,date:new Date(Date.now()+3*864e5).toISOString(),published:false,scheduled:new Date(Date.now()+3*864e5).toISOString()}
];}

function generateLogs(){
const logs=[];const now=Date.now();const types=['REPORT','COLLECTION','VEHICLE','CITIZEN','SYSTEM','AGENCY'];
for(let i=0;i<60;i++){
const type=pick(types);
logs.push({
id:i,timestamp:new Date(now-rnd(0,48*3600e3)).toISOString(),
type,msg:`${type} ${pick(['created','updated','approved','assigned','completed','cancelled'])} — ${pick(['WR-1234','CR-1042','PV-042','CIT-001','AG-003','EP-002'])}`
});}
return logs.sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
}

/* ---------- API Layer ---------- */
const API={
async getDashboard(){await delay(300);return State.stats;},
async getReports(){await delay(200);return State.reports;},
async getCollections(){await delay(200);return State.collections;},
async getEcopoints(){await delay(200);return State.ecopoints;},
async getCitizens(){await delay(200);return State.citizens;},
async getAgencies(){await delay(200);return State.agencies;},
async getVehicles(){await delay(200);return State.vehicles;},
async getRewards(){await delay(200);return State.rewards;},
async getNews(){await delay(200);return State.news;},
async getLogs(){await delay(200);return State.logs;},
async login(email,password){await delay(600);if(email&&password.length>=4){State.user={name:'Admin',email,role:'Super Admin'};return{ok:true,user:State.user};}return{ok:false,error:'Invalid credentials'};},
async updateReportStatus(id,status){const r=State.reports.find(x=>x.id===id);if(r){r.status=status;r.statusEs=STATUSES_ES[STATUSES.indexOf(status)]||status;}return{ok:true};},
async updateCollectionStatus(id,status){const c=State.collections.find(x=>x.id===id);if(c)c.status=status;return{ok:true};},
async approveReward(id){const r=State.rewards.find(x=>x.id===id);if(r)r.approvedRedemptions++;return{ok:true};},
async rejectReward(id){const r=State.rewards.find(x=>x.id===id);if(r)r.rejectedRedemptions++;return{ok:true};},
async saveNews(news){State.news=[news,...State.news];return{ok:true};},
async updateEcopoint(id,patch){const e=State.ecopoints.find(x=>x.id===id);if(e)Object.assign(e,patch);return{ok:true};}
};
const delay=(ms)=>new Promise(r=>setTimeout(r,ms));

/* ---------- Views ---------- */
const Views={
renderDashboard(){
const s=State.stats;
return`
<div class="rise">
<div class="hero">
<img class="hero-bg" src="${LOGO_URL}" alt=""/>
<div class="hero-veil"></div>
<div class="hero-in">
<div style="flex:1;min-width:260px">
<div class="hero-kicker"><i data-lucide="shield" style="width:12px;height:12px"></i> PUNTO VIVO • CENTRO DE COMANDO OPERATIVO</div>
<h2 class="hero-title">${t('dashboard.title')}</h2>
<div class="hero-sub"><span>${new Date().toLocaleDateString(currentLang==='es'?'es-CO':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
<span class="conn-pill ${State.connection}"><span class="dot"></span>${State.connection==='live'?'LIVE':'RECONNECTING'}</span></div>
</div>
<div class="hero-stats">
<div class="hero-chip rise" style="animation-delay:120ms"><div class="hc-l">${t('dashboard.reports')}</div><div class="hc-v t-sky">${s.reports.toLocaleString()}</div></div>
<div class="hero-chip rise" style="animation-delay:200ms"><div class="hc-l">${t('dashboard.completed')}</div><div class="hc-v t-green">${s.completed.toLocaleString()}</div></div>
<div class="hero-chip rise" style="animation-delay:280ms"><div class="hc-l">${t('dashboard.ecopoints')}</div><div class="hc-v t-violet">${s.ecopoints}</div></div>
</div>
</div>
</div>

<div class="grid g4" style="margin-bottom:20px">
${kpiCard('users',s.reports.toLocaleString(),t('dashboard.reports'),`+8.4% ${t('dashboard.this_month')}`,'#38bdf8')}
${kpiCard('clock',s.pending,t('dashboard.pending'),`${s.scheduled} ${t('dashboard.scheduled').toLowerCase()}`,'#f59e0b')}
${kpiCard('truck',s.active,t('dashboard.active'),`${s.completed.toLocaleString()} ${t('dashboard.completed').toLowerCase()}`,'#22c55e')}
${kpiCard('award',s.rewards.toLocaleString(),t('dashboard.rewards'),`${s.citizens.toLocaleString()} ${t('dashboard.citizens').toLowerCase()}`,'#a78bfa')}
</div>

<div class="grid g2" style="margin-bottom:20px">
<div class="card rise">
<div class="card-h"><h3>${t('dashboard.waste_activity')}</h3><span class="sub">${t('dashboard.this_month')}</span>
<div style="margin-left:auto;display:flex;gap:6px">
${['7','30','90'].map(r=>`<button class="btn sm ${State.chartRange===r?'primary':''}" onclick="setChartRange('${r}')">${r}d</button>`).join('')}
</div></div>
<div class="card-b" style="height:280px"><canvas id="activityChart"></canvas></div>
</div>
<div class="card rise">
<div class="card-h"><h3>${t('dashboard.categories')}</h3></div>
<div class="card-b" style="height:280px"><canvas id="categoryChart"></canvas></div>
</div>
</div>

<div class="card rise" style="margin-bottom:20px">
<div class="card-h"><h3>${t('dashboard.map_title')}</h3><span class="sub">${BOGOTA_COORDS.length} ${t('dashboard.hotspots').toLowerCase()}</span></div>
<div class="card-b" style="padding:0"><div id="dashMap" class="map-container"></div></div>
</div>

<div class="card rise">
<div class="card-h"><h3>${t('dashboard.agency_ops')}</h3></div>
<div class="card-b">
<div class="tbl-wrap"><table class="tbl"><thead><tr>
<th>${t('agencies.name')}</th><th>${t('agencies.requests')}</th><th>${t('agencies.pending')}</th><th>${t('agencies.completed')}</th><th>${t('agencies.vehicles')}</th><th>${t('agencies.response')}</th><th>${t('common.status')}</th>
</tr></thead><tbody>
${State.agencies.slice(0,6).map(a=>`<tr>
<td><b>${a.name}</b><div class="mono" style="font-size:10px;color:var(--muted)">${a.type}</div></td>
<td class="mono">${a.requests}</td><td class="mono t-amber">${a.pending}</td><td class="mono t-green">${a.completed}</td>
<td class="mono">${a.vehicles}</td><td class="mono">${a.responseTime}min</td>
<td><span class="pill ${a.status==='Active'?'green':'red'}"><span class="pd"></span>${a.status}</span></td>
</tr>`).join('')}
</tbody></table></div>
</div>
</div>
</div>`;
},

renderReports(){
return`<div class="rise">
<div class="card">
<div class="card-h">
<h3>${t('reports.title')}</h3><span class="sub">${State.reports.length} ${t('common.all').toLowerCase()}</span>
<div class="search-box" style="margin-left:auto"><span class="si"><i data-lucide="search" style="width:14px;height:14px"></i></span>
<input class="input" placeholder="${t('common.search')}..." id="reportSearch" oninput="filterReports(this.value)"/></div>
</div>
<div class="card-b" style="padding:0">
<div class="tbl-wrap"><table class="tbl" id="reportsTable"><thead><tr>
<th>${t('reports.id')}</th><th>${t('reports.citizen')}</th><th>${t('reports.type')}</th><th>${t('reports.ai_class')}</th>
<th>${t('reports.location')}</th><th>${t('reports.reported')}</th><th>${t('reports.agency')}</th><th>${t('reports.status')}</th><th>${t('reports.actions')}</th>
</tr></thead><tbody>
${State.reports.map(r=>`<tr class="row-flash">
<td class="mono" style="color:var(--sky)">${r.id}</td><td>${r.citizen}</td>
<td>${currentLang==='es'?r.typeEs:r.type}</td>
<td>${r.aiClass} <span class="mono" style="font-size:10px;color:var(--dim)">(${Math.round(r.confidence*100)}%)</span></td>
<td class="mono" style="font-size:10.5px">${r.location[0].toFixed(4)}, ${r.location[1].toFixed(4)}</td>
<td class="mono">${fmtDateTime(r.reportedAt)}</td><td>${r.agency}</td>
<td><span class="pill ${getStatusPill(r.status)}"><span class="pd"></span>${currentLang==='es'?r.statusEs:r.status}</span></td>
<td><button class="btn sm" onclick="viewReport('${r.id}')"><i data-lucide="eye" style="width:12px;height:12px"></i> ${t('reports.view')}</button></td>
</tr>`).join('')}
</tbody></table></div>
</div>
</div>
</div>`;
},

renderCollections(){
const statuses=currentLang==='es'?['Nueva','Esperando Agencia','Aprobada','Programada','Colector Asignado','En Camino','Llegó','Recolectada','Completada','Cancelada']:['New','Awaiting Agency','Approved','Scheduled','Collector Assigned','En Route','Arrived','Collected','Completed','Cancelled'];
const statusKeys=['New','Awaiting Agency','Approved','Scheduled','Collector Assigned','En Route','Arrived','Collected','Completed','Cancelled'];
return`<div class="rise">
<div class="card">
<div class="card-h"><h3>${t('collections.title')}</h3><span class="sub">${State.collections.length} ${t('common.all').toLowerCase()}</span>
<div style="margin-left:auto;display:flex;gap:6px">
<button class="btn sm primary" onclick="toggleKanban()"><i data-lucide="layout" style="width:12px;height:12px"></i> ${State.kanbanMode?'Table':'Kanban'}</button>
</div></div>
<div class="card-b" style="padding:0">
${State.kanbanMode?`<div class="kanban" style="padding:16px">
${statusKeys.map((sk,i)=>{const items=State.collections.filter(c=>c.status===sk);return`
<div class="kanban-col"><h4>${statuses[i]} <span class="count">${items.length}</span></h4>
${items.map(c=>`<div class="kanban-card" onclick="viewCollection('${c.id}')">
<div class="kc-id">${c.id}</div><div class="kc-title">${c.citizen}</div>
<div class="kc-meta"><span>${c.type}</span><span class="mono">${fmtDate(c.createdAt)}</span></div>
</div>`).join('')}
</div>`;}).join('')}
</div>`:`<div class="tbl-wrap"><table class="tbl"><thead><tr>
<th>${t('reports.id')}</th><th>${t('reports.citizen')}</th><th>${t('reports.type')}</th><th>${t('reports.agency')}</th>
<th>${t('tracking.vehicle')}</th><th>${t('tracking.driver')}</th><th>${t('reports.reported')}</th><th>${t('reports.status')}</th><th>${t('reports.actions')}</th>
</tr></thead><tbody>
${State.collections.map(c=>`<tr>
<td class="mono" style="color:var(--sky)">${c.id}</td><td>${c.citizen}</td><td>${c.type}</td><td>${c.agency}</td>
<td class="mono">${c.vehicle}</td><td>${c.driver}</td><td class="mono">${fmtDateTime(c.createdAt)}</td>
<td><span class="pill ${getStatusPill(c.status)}"><span class="pd"></span>${c.status}</span></td>
<td><button class="btn sm" onclick="viewCollection('${c.id}')"><i data-lucide="eye" style="width:12px;height:12px"></i></button></td>
</tr>`).join('')}
</tbody></table></div>`}
</div>
</div>
</div>`;
},

renderTracking(){
const activeCollections=State.collections.filter(c=>['En Route','Collector Assigned','Arrived','Collecting'].includes(c.status)).slice(0,6);
return`<div class="rise">
<div class="grid g2" style="margin-bottom:20px">
${activeCollections.map(c=>`<div class="card">
<div class="card-h"><h3>${t('tracking.vehicle')}: ${c.vehicle}</h3><span class="pill sky"><span class="pd"></span>${c.status}</span></div>
<div class="card-b">
<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">
<div><div class="label">${t('tracking.driver')}</div><div style="font-weight:600">${c.driver}</div></div>
<div><div class="label">${t('tracking.distance')}</div><div class="mono" style="font-size:18px;font-weight:700;color:var(--sky)">${(Math.random()*5+0.5).toFixed(1)} km</div></div>
<div><div class="label">${t('tracking.eta')}</div><div class="mono" style="font-size:18px;font-weight:700;color:var(--green)">${c.eta} min</div></div>
<div><div class="label">${t('tracking.request')}</div><div class="mono">${c.id}</div></div>
</div>
<div class="label">${t('reports.citizen')}</div><div style="margin-bottom:8px">${c.citizen}</div>
<div class="label">${t('reports.location')}</div><div class="mono" style="font-size:11px">${c.location[0].toFixed(5)}, ${c.location[1].toFixed(5)}</div>
</div></div>`).join('')}
</div>
<div class="card">
<div class="card-h"><h3>${t('dashboard.map_title')} — ${t('tracking.title')}</h3></div>
<div class="card-b" style="padding:0"><div id="trackingMap" class="map-container full"></div></div>
</div>
</div>`;
},

renderEcopoints(){
return`<div class="rise">
<div class="grid g3" style="margin-bottom:20px">
${State.ecopoints.map(ep=>{const pct=Math.round(ep.occupancy/ep.capacity*100);
const statusClass=ep.status==='Open'?'green':ep.status==='Busy'?'amber':ep.status==='Near Capacity'?'amber':ep.status==='Full'?'red':'red';
const statusText=currentLang==='es'?(ep.status==='Open'?'Abierto':ep.status==='Busy'?'Ocupado':ep.status==='Near Capacity'?'Casi Lleno':ep.status==='Full'?'Lleno':'Cerrado'):ep.status;
return`<div class="card">
<div class="card-h"><h3>${ep.name}</h3><span class="pill ${statusClass}"><span class="pd"></span>${statusText}</span></div>
<div class="card-b">
<div style="font-size:11px;color:var(--muted);margin-bottom:10px"><i data-lucide="map-pin" style="width:11px;height:11px"></i> ${ep.address}</div>
<div style="margin-bottom:12px">
<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:5px"><span>${t('ecopoints.occupancy')}</span><span class="mono" style="font-weight:700">${pct}%</span></div>
<div style="height:8px;background:#0d1728;border-radius:99px;overflow:hidden;border:1px solid var(--border)">
<div style="height:100%;width:${pct}%;background:${pct>90?'var(--red)':pct>70?'var(--amber)':'var(--green)'};border-radius:99px;transition:width .6s"></div>
</div>
<div style="font-size:10px;color:var(--dim);margin-top:4px">${ep.occupancy} / ${ep.capacity} units</div>
</div>
<div style="font-size:11px;color:var(--muted);margin-bottom:6px"><b>${t('ecopoints.hours')}:</b> ${ep.hours}</div>
<div style="font-size:11px;color:var(--muted);margin-bottom:6px"><b>${t('ecopoints.agency')}:</b> ${ep.agency}</div>
<div style="font-size:11px;color:var(--muted)"><b>${t('ecopoints.waste')}:</b> ${ep.waste.join(', ')}</div>
</div></div>`;}).join('')}
</div>
<div class="card">
<div class="card-h"><h3>${t('dashboard.map_title')} — ${t('ecopoints.title')}</h3></div>
<div class="card-b" style="padding:0"><div id="ecopointMap" class="map-container"></div></div>
</div>
</div>`;
},

renderCitizens(){
return`<div class="rise">
<div class="card">
<div class="card-h"><h3>${t('citizens.title')}</h3><span class="sub">${State.citizens.length} ${t('common.all').toLowerCase()}</span>
<div class="search-box" style="margin-left:auto"><span class="si"><i data-lucide="search" style="width:14px;height:14px"></i></span>
<input class="input" placeholder="${t('common.search')}..." id="citizenSearch" oninput="filterCitizens(this.value)"/></div>
</div>
<div class="card-b" style="padding:0">
<div class="tbl-wrap"><table class="tbl" id="citizensTable"><thead><tr>
<th>${t('citizens.name')}</th><th>${t('citizens.phone')}</th><th>${t('citizens.email')}</th>
<th>${t('citizens.reports')}</th><th>${t('citizens.collections')}</th><th>${t('citizens.points')}</th>
<th>${t('citizens.rewards')}</th><th>${t('citizens.last')}</th><th>${t('citizens.status')}</th>
</tr></thead><tbody>
${State.citizens.map(c=>`<tr>
<td><b>${c.name}</b><div class="mono" style="font-size:10px;color:var(--dim)">${c.id}</div></td>
<td class="mono" style="font-size:11px">${c.phone}</td><td style="font-size:11px">${c.email}</td>
<td class="mono">${c.reports}</td><td class="mono">${c.collections}</td>
<td class="mono t-sky" style="font-weight:700">${c.points.toLocaleString()}</td>
<td class="mono">${c.rewards}</td><td class="mono">${fmtDate(c.lastActivity)}</td>
<td><span class="pill ${c.status==='Active'?'green':'red'}"><span class="pd"></span>${c.status}</span></td>
</tr>`).join('')}
</tbody></table></div>
</div>
</div>
</div>`;
},

renderAgencies(){
return`<div class="rise">
<div class="grid g2" style="margin-bottom:20px">
${State.agencies.map(a=>`<div class="card">
<div class="card-h"><h3>${a.name}</h3><span class="pill ${a.status==='Active'?'green':'red'}"><span class="pd"></span>${a.status}</span></div>
<div class="card-b">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
<div><div class="label">${t('agencies.type')}</div><div style="font-weight:600">${a.type}</div></div>
<div><div class="label">${t('agencies.contact')}</div><div style="font-size:11px;color:var(--muted);word-break:break-all">${a.contact}</div></div>
<div><div class="label">${t('agencies.requests')}</div><div class="mono" style="font-size:20px;font-weight:700;color:var(--sky)">${a.requests}</div></div>
<div><div class="label">${t('agencies.pending')}</div><div class="mono" style="font-size:20px;font-weight:700;color:var(--amber)">${a.pending}</div></div>
<div><div class="label">${t('agencies.completed')}</div><div class="mono" style="font-size:20px;font-weight:700;color:var(--green)">${a.completed}</div></div>
<div><div class="label">${t('agencies.vehicles')}</div><div class="mono" style="font-size:20px;font-weight:700;color:var(--violet)">${a.vehicles}</div></div>
<div style="grid-column:1/-1"><div class="label">${t('agencies.response')}</div><div class="mono" style="font-size:16px;font-weight:700">${a.responseTime} min</div></div>
</div>
</div></div>`).join('')}
</div>
</div>`;
},

renderFleet(){
return`<div class="rise">
<div class="grid g2" style="margin-bottom:20px">
${State.vehicles.map(v=>{const statusClass=v.status==='Available'?'green':v.status==='Assigned'||v.status==='En Route'?'sky':v.status==='Collecting'?'amber':v.status==='Maintenance'?'amber':'red';
const statusText=currentLang==='es'?(v.status==='Available'?'Disponible':v.status==='Assigned'?'Asignado':v.status==='En Route'?'En Ruta':v.status==='Collecting'?'Recolectando':v.status==='Maintenance'?'Mantenimiento':'Desconectado'):v.status;
return`<div class="card">
<div class="card-h"><h3>${v.id}</h3><span class="pill ${statusClass}"><span class="pd"></span>${statusText}</span></div>
<div class="card-b">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
<div><div class="label">${t('fleet.plate')}</div><div class="mono" style="font-weight:600">${v.plate}</div></div>
<div><div class="label">${t('fleet.type')}</div><div style="font-weight:600">${v.type}</div></div>
<div><div class="label">${t('fleet.driver')}</div><div style="font-size:11px">${v.driver}</div></div>
<div><div class="label">${t('fleet.agency')}</div><div style="font-size:11px">${v.agency}</div></div>
<div><div class="label">${t('fleet.capacity')}</div><div class="mono">${v.capacity} tons</div></div>
<div><div class="label">${t('fleet.load')}</div><div class="mono" style="font-weight:700;color:${v.load>v.capacity*.8?'var(--red)':'var(--green)'}">${v.load} tons</div></div>
<div style="grid-column:1/-1"><div class="label">${t('fleet.location')}</div><div class="mono" style="font-size:10.5px">${v.location[0].toFixed(5)}, ${v.location[1].toFixed(5)}</div></div>
</div>
</div></div>`;}).join('')}
</div>
<div class="card">
<div class="card-h"><h3>${t('dashboard.map_title')} — ${t('fleet.title')}</h3></div>
<div class="card-b" style="padding:0"><div id="fleetMap" class="map-container"></div></div>
</div>
</div>`;
},

renderRewards(){
return`<div class="rise">
<div class="grid g4" style="margin-bottom:20px">
${kpiCard('award',State.rewards.reduce((a,r)=>a+r.pointsEarned,0).toLocaleString(),t('rewards.earned'),'','t-green')}
${kpiCard('refresh-cw',State.rewards.reduce((a,r)=>a+r.pointsRedeemed,0).toLocaleString(),t('rewards.redeemed'),'','t-sky')}
${kpiCard('clock',State.rewards.reduce((a,r)=>a+r.balance,0).toLocaleString(),t('rewards.outstanding'),'','t-amber')}
${kpiCard('check-circle',State.rewards.reduce((a,r)=>a+r.approvedRedemptions,0),t('rewards.approved_red'),'','t-violet')}
</div>
<div class="card">
<div class="card-h"><h3>${t('rewards.title')}</h3></div>
<div class="card-b" style="padding:0">
<div class="tbl-wrap"><table class="tbl"><thead><tr>
<th>${t('citizens.name')}</th><th>${t('rewards.earned')}</th><th>${t('rewards.redeemed')}</th>
<th>${t('rewards.outstanding')}</th><th>${t('rewards.pending_red')}</th><th>${t('rewards.approved_red')}</th>
<th>${t('rewards.rejected_red')}</th><th>Last</th><th>${t('reports.actions')}</th>
</tr></thead><tbody>
${State.rewards.map(r=>`<tr>
<td><b>${r.citizen}</b></td>
<td class="mono t-green">${r.pointsEarned.toLocaleString()}</td>
<td class="mono t-sky">${r.pointsRedeemed.toLocaleString()}</td>
<td class="mono t-amber" style="font-weight:700">${r.balance.toLocaleString()}</td>
<td class="mono">${r.pendingRedemptions}</td>
<td class="mono t-green">${r.approvedRedemptions}</td>
<td class="mono t-red">${r.rejectedRedemptions}</td>
<td style="font-size:11px">${r.lastRedemption}</td>
<td><div style="display:flex;gap:4px">
<button class="btn sm primary" onclick="approveReward(${r.id})"><i data-lucide="check" style="width:11px;height:11px"></i></button>
<button class="btn sm danger" onclick="rejectReward(${r.id})"><i data-lucide="x" style="width:11px;height:11px"></i></button>
</div></td>
</tr>`).join('')}
</tbody></table></div>
</div>
</div>
</div>`;
},

renderAnalytics(){
return`<div class="rise">
<div class="grid g2" style="margin-bottom:20px">
<div class="card"><div class="card-h"><h3>${t('analytics.efficiency')}</h3></div>
<div class="card-b" style="height:260px"><canvas id="efficiencyChart"></canvas></div></div>
<div class="card"><div class="card-h"><h3>${t('analytics.trends')}</h3></div>
<div class="card-b" style="height:260px"><canvas id="trendsChart"></canvas></div></div>
</div>
<div class="grid g2" style="margin-bottom:20px">
<div class="card"><div class="card-h"><h3>${t('analytics.performance')}</h3></div>
<div class="card-b" style="height:260px"><canvas id="performanceChart"></canvas></div></div>
<div class="card"><div class="card-h"><h3>${t('analytics.utilization')}</h3></div>
<div class="card-b" style="height:260px"><canvas id="utilizationChart"></canvas></div></div>
</div>
<div class="card">
<div class="card-h"><h3>${t('analytics.hotspots')}</h3><span class="sub">Bogotá</span></div>
<div class="card-b" style="padding:0"><div id="heatmapMap" class="map-container"></div></div>
</div>
</div>`;
},

renderNews(){
return`<div class="rise">
<div class="card" style="margin-bottom:20px">
<div class="card-h"><h3>${t('news.title')}</h3>
<button class="btn primary" style="margin-left:auto" onclick="createNews()"><i data-lucide="plus" style="width:14px;height:14px"></i> ${t('news.create')}</button></div>
<div class="card-b">
<div class="grid g3">
${State.news.map(n=>`<div class="news-card">
${n.image?`<img src="${n.image}" alt=""/>`:`<div style="height:160px;background:linear-gradient(135deg,#1b3055,#0d1728);display:grid;place-items:center"><i data-lucide="image" style="width:32px;height:32px;color:var(--dim)"></i></div>`}
<div class="nc-body">
<div class="nc-title">${currentLang==='es'?n.title:n.titleEn}</div>
<div class="nc-excerpt">${currentLang==='es'?n.excerpt:n.excerptEn}</div>
<div class="nc-meta"><span>${fmtDate(n.date)}</span>
<span class="pill ${n.published?'green':'amber'}"><span class="pd"></span>${n.published?(currentLang==='es'?'Publicado':'Published'):(currentLang==='es'?'Borrador':'Draft')}</span></div>
<div style="display:flex;gap:6px;margin-top:10px">
<button class="btn sm" onclick="editNews(${n.id})"><i data-lucide="pencil" style="width:11px;height:11px"></i> ${t('common.edit')}</button>
<button class="btn sm ${n.published?'danger':'primary'}" onclick="toggleNews(${n.id})">${n.published?t('news.unpublish'):t('news.publish')}</button>
</div>
</div></div>`).join('')}
</div>
</div>
</div>
</div>`;
},

renderLogs(){
return`<div class="rise">
<div class="card">
<div class="card-h"><h3>${t('logs.title')}</h3><span class="sub">${State.logs.length} events</span>
<div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap">
<select class="select" style="width:140px" id="logTypeFilter" onchange="filterLogs()">
<option value="">${t('common.all')} Types</option>
<option>REPORT</option><option>COLLECTION</option><option>VEHICLE</option><option>CITIZEN</option><option>SYSTEM</option><option>AGENCY</option>
</select>
<input type="date" class="input" style="width:140px" id="logDateFilter" onchange="filterLogs()"/>
</div></div>
<div class="card-b" style="padding:0">
<div class="log-stream" id="logStream">
${State.logs.map(l=>`<div class="log-line">
<span class="log-time">${fmtTime(l.timestamp)}</span>
<span class="log-type ${getLogTypeColor(l.type)}">${l.type}</span>
<span class="log-msg">${l.msg}</span>
</div>`).join('')}
</div>
</div>
</div>
</div>`;
},

renderSettings(){
return`<div class="rise">
<div class="tabs">
<div class="tab active" onclick="switchSettingsTab('general')">${t('settings.general')}</div>
<div class="tab" onclick="switchSettingsTab('waste')">${t('settings.waste')}</div>
<div class="tab" onclick="switchSettingsTab('ecopoints')">${t('settings.ecopoints_s')}</div>
<div class="tab" onclick="switchSettingsTab('notifications')">${t('settings.notifications')}</div>
<div class="tab" onclick="switchSettingsTab('map')">${t('settings.map_s')}</div>
<div class="tab" onclick="switchSettingsTab('ai')">${t('settings.ai')}</div>
</div>
<div class="card">
<div class="card-b">
<div id="settingsContent">
<div class="field-grid">
<div><label class="label">${t('settings.general')} — Platform Name</label><input class="input" value="Punto Vivo Bogotá"/></div>
<div><label class="label">Default Language</label><select class="select"><option>Español</option><option>English</option></select></div>
<div><label class="label">Timezone</label><input class="input" value="America/Bogota (UTC-5)"/></div>
<div><label class="label">Currency</label><input class="input" value="COP — Colombian Peso"/></div>
</div>
<div style="margin-top:20px;padding-top:20px;border-top:1px dashed var(--border)">
<div class="label" style="margin-bottom:12px">${t('settings.waste')}</div>
<div class="field-grid">
<div><label class="label">AI Classification Threshold</label><input class="input" type="number" value="0.75" step="0.05"/></div>
<div><label class="label">Collection Distance Threshold (km)</label><input class="input" type="number" value="5" step="0.5"/></div>
</div>
</div>
<div style="margin-top:20px;padding-top:20px;border-top:1px dashed var(--border)">
<div class="label" style="margin-bottom:12px">${t('settings.ecopoints_s')}</div>
<div class="field-grid">
<div><label class="label">Capacity Warning Threshold (%)</label><input class="input" type="number" value="70"/></div>
<div><label class="label">Full Threshold (%)</label><input class="input" type="number" value="95"/></div>
</div>
</div>
<div style="margin-top:20px;padding-top:20px;border-top:1px dashed var(--border)">
<div class="label" style="margin-bottom:12px">${t('settings.notifications')}</div>
<div style="display:flex;gap:20px;flex-wrap:wrap">
<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" checked/> Push Notifications</label>
<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" checked/> Email Notifications</label>
<label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox"/> SMS Notifications</label>
</div>
</div>
<div style="margin-top:20px;padding-top:20px;border-top:1px dashed var(--border)">
<div class="label" style="margin-bottom:12px">${t('settings.map_s')}</div>
<div class="field-grid">
<div><label class="label">Map Provider</label><select class="select"><option>Leaflet (OpenStreetMap)</option><option>Mapbox GL JS</option><option>Google Maps</option></select></div>
<div><label class="label">Default Bogotá Coordinates</label><input class="input" value="4.7110, -74.0721"/></div>
<div><label class="label">Tracking Update Interval (sec)</label><input class="input" type="number" value="5"/></div>
</div>
</div>
<div style="margin-top:20px;padding-top:20px;border-top:1px dashed var(--border)">
<div class="label" style="margin-bottom:12px">${t('settings.ai')}</div>
<div class="field-grid">
<div><label class="label">Ollama Endpoint</label><input class="input" value="http://localhost:11434"/></div>
<div><label class="label">Model</label><input class="input" value="llama3.1:8b"/></div>
<div><label class="label">Timeout (ms)</label><input class="input" type="number" value="30000"/></div>
<div><label class="label">Confidence Threshold</label><input class="input" type="number" value="0.75" step="0.05"/></div>
</div>
</div>
<div style="margin-top:24px;display:flex;justify-content:flex-end;gap:10px">
<button class="btn">${t('common.cancel')}</button>
<button class="btn primary" onclick="saveSettings()"><i data-lucide="check" style="width:14px;height:14px"></i> ${t('common.save')}</button>
</div>
</div>
</div>
</div>
</div>`;
}
};

/* ---------- Helpers ---------- */
function kpiCard(icon,value,label,sub,color){
return`<div class="stat rise"><div class="lb"><span class="ic" style="background:${color}22;color:${color}"><i data-lucide="${icon}" style="width:15px;height:15px"></i></span>${label}</div><div class="vl big" style="color:${color}">${value}</div>${sub?`<div class="sb2">${sub}</div>`:''}</div>`;
}
function getStatusPill(status){
const map={'Completed':'green','Collected':'green','Approved':'green','Scheduled':'sky','En Route':'sky','Collector Assigned':'sky','Arrived':'amber','Collecting':'amber','New':'amber','Awaiting Agency':'amber','AI Processing':'violet','EcoPoint Recommended':'violet','Submitted':'sky','Agency Review':'amber','Cancelled':'red','Collection Requested':'sky','Awaiting Citizen':'amber'};
return map[status]||'sky';
}
function getLogTypeColor(type){
const map={REPORT:'t-sky',COLLECTION:'t-green',VEHICLE:'t-amber',CITIZEN:'t-violet',SYSTEM:'t-red',AGENCY:'t-green'};
return map[type]||'t-sky';
}

/* ---------- Chart Data ---------- */
function generateChartData(days){
const data=[];const now=new Date();
for(let i=days-1;i>=0;i--){
const d=new Date(now);d.setDate(d.getDate()-i);
data.push({
date:d.toLocaleDateString(currentLang==='es'?'es-CO':'en-US',{month:'short',day:'2-digit'}),
reports:rnd(20,80),completed:rnd(15,60),scheduled:rnd(5,25),unresolved:rnd(2,15)
});}
return data;
}
function generateCategoryData(){
const types=currentLang==='es'?WASTE_TYPES_ES:WASTE_TYPES;
return types.map((t,i)=>({name:t,value:rnd(50,500),color:['#38bdf8','#22c55e','#f59e0b','#a78bfa','#fb7185','#06b6d4','#84cc16','#f97316','#64748b'][i]}));
}

/* ---------- Map Helpers ---------- */
let maps={};
function initMap(containerId,center=[4.7110,-74.0721],zoom=11){
if(maps[containerId]){maps[containerId].remove();delete maps[containerId];}
setTimeout(()=>{
const el=document.getElementById(containerId);if(!el)return;
const map=L.map(containerId,{zoomControl:true,attributionControl:false}).setView(center,zoom);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
maps[containerId]=map;
return map;
},100);
}
function addReportMarkers(map,reports){
reports.slice(0,30).forEach(r=>{
const marker=L.circleMarker([r.location[0],r.location[1]],{radius:8,fillColor:'#f59e0b',color:'#fff',weight:2,fillOpacity:0.8}).addTo(map);
marker.bindPopup(`<b>${r.id}</b><br>${r.citizen}<br>${r.type}<br>${fmtDateTime(r.reportedAt)}<br><span class="pill ${getStatusPill(r.status)}">${r.status}</span>`);
});
}
function addEcopointMarkers(map,ecopoints){
ecopoints.forEach(ep=>{
const color=ep.status==='Open'?'#22c55e':ep.status==='Busy'?'#f59e0b':'#ef4444';
const marker=L.circleMarker([ep.lat,ep.lng],{radius:10,fillColor:color,color:'#fff',weight:2,fillOpacity:0.9}).addTo(map);
marker.bindPopup(`<b>${ep.name}</b><br>${ep.address}<br>${ep.waste.join(', ')}<br>${ep.occupancy}/${ep.capacity} (${Math.round(ep.occupancy/ep.capacity*100)}%)<br>${ep.hours}`);
});
}
function addVehicleMarkers(map,vehicles){
vehicles.filter(v=>v.status!=='Offline'&&v.status!=='Maintenance').forEach(v=>{
const marker=L.circleMarker([v.location[0],v.location[1]],{radius:9,fillColor:'#38bdf8',color:'#fff',weight:2,fillOpacity:0.9}).addTo(map);
marker.bindPopup(`<b>${v.id}</b><br>${v.driver}<br>${v.agency}<br>${v.status}<br>${v.plate}`);
});
}

/* ---------- App Shell ---------- */
function renderApp(){
const app=document.getElementById('app');
if(!State.user){app.innerHTML=renderLogin();lucide.createIcons();attachLoginHandler();return;}
app.innerHTML=`
<div class="app-shell">
<aside class="sidebar ${State.sidebarOpen?'':'collapsed'} ${State.mobileSidebar?'mobile-open':''}" aria-label="Primary navigation">
<div class="sb-logo">
<span class="lg-ic"><img src="${LOGO_URL}" alt="Punto Vivo"/></span>
${State.sidebarOpen?`<span class="lg-tx"><b>PUNTO VIVO</b><span>Bogotá Admin</span></span>`:''}
</div>
<nav class="sb-nav">
${navItem('dashboard','layout-dashboard',t('nav.dashboard'),State.stats.pending)}
${navItem('reports','file-text',t('nav.reports'))}
${navItem('collections','truck',t('nav.collections'),State.collections.filter(c=>c.status==='New').length)}
${navItem('tracking','navigation',t('nav.tracking'))}
${navItem('ecopoints','recycle',t('nav.ecopoints'))}
${navItem('citizens','users',t('nav.citizens'))}
${navItem('agencies','building-2',t('nav.agencies'))}
${navItem('fleet','car',t('nav.fleet'))}
${navItem('rewards','award',t('nav.rewards'))}
${navItem('analytics','bar-chart-3',t('nav.analytics'))}
${navItem('news','newspaper',t('nav.news'))}
${navItem('logs','scroll-text',t('nav.logs'))}
${navItem('settings','settings',t('nav.settings'))}
</nav>
<div class="sb-foot">
<div class="pf">
<span class="avatar">${State.user.name[0]}</span>
${State.sidebarOpen?`<span><span class="nm">${State.user.name}</span><br/><span class="rl">${State.user.role}</span></span>`:''}
</div>
<div class="acts" style="${State.sidebarOpen?'':'justify-content:center'}">
${State.sidebarOpen?`<button class="iconbtn" style="flex:1;justify-content:center" onclick="toggleLang()"><i data-lucide="globe" style="width:13px;height:13px"></i> ${currentLang.toUpperCase()}</button>`:''}
<button class="iconbtn" onclick="logout()" aria-label="Logout"><i data-lucide="log-out" style="width:13px;height:13px"></i></button>
</div>
</div>
</aside>
<div class="main">
<header class="topbar">
<button class="iconbtn tb-menu" onclick="toggleMobileSidebar()" aria-label="Open menu"><i data-lucide="menu" style="width:16px;height:16px"></i></button>
<div class="tb-title"><h1>${getPageTitle()}</h1><p>${new Date().toLocaleDateString(currentLang==='es'?'es-CO':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p></div>
<div class="tb-right">
<span class="conn-pill ${State.connection}"><span class="dot"></span>${State.connection==='live'?'LIVE':'RECONNECTING'}</span>
<div class="lang-switch">
<button class="${currentLang==='es'?'active':''}" onclick="setLang('es')">ES</button>
<button class="${currentLang==='en'?'active':''}" onclick="setLang('en')">EN</button>
</div>
<div class="menu-wrap">
<button class="iconbtn" onclick="toggleNotifMenu()" aria-label="Notifications" style="position:relative">
<i data-lucide="bell" style="width:15px;height:15px"></i>
${State.notifications.length?`<span style="position:absolute;top:-4px;right:-4px;background:var(--red);border-radius:999px;font-size:9px;padding:1px 5px;color:#fff;font-family:var(--mono)">${State.notifications.length}</span>`:''}
</button>
<div id="notifMenu" class="menu" style="display:none">
<div class="mh">Notifications</div>
<div class="ml">
${State.notifications.length?State.notifications.map(n=>`<div class="mi"><span style="color:${n.type==='alert'?'var(--red-l)':'var(--sky-l)'}"><i data-lucide="${n.type==='alert'?'alert-triangle':'info'}" style="width:13px;height:13px"></i></span><span><b style="font-size:12px">${n.title}</b><br/><span style="color:var(--muted);font-size:11px">${n.body}</span><br/><span class="mono" style="color:var(--dim);font-size:10px">${fmtTime(n.ts)}</span></span></div>`).join(''):'<div class="empty" style="padding:20px"><span class="eic"><i data-lucide="bell" style="width:18px;height:18px"></i></span><b>No notifications</b></div>'}
</div>
</div>
</div>
<div class="menu-wrap">
<button class="iconbtn" onclick="toggleProfileMenu()">
<span class="avatar" style="width:26px;height:26px;border-radius:7px;font-size:11px">${State.user.name[0]}</span>${State.user.name}
</button>
<div id="profileMenu" class="menu" style="display:none;width:200px">
<div class="mh">${State.user.email}</div>
<div class="mi" onclick="logout()"><i data-lucide="log-out" style="width:13px;height:13px"></i> ${t('auth.logout')}</div>
</div>
</div>
</div>
</header>
<main class="page" aria-label="${getPageTitle()}">
${Views['render'+State.page.charAt(0).toUpperCase()+State.page.slice(1)]()}
</main>
</div>
</div>`;
lucide.createIcons();
initPageCharts();
initPageMaps();
}

function navItem(key,icon,label,badge){
return`<button class="sb-item ${State.page===key?'active':''}" onclick="navigate('${key}')">
<i data-lucide="${icon}" style="width:16px;height:16px"></i>
${State.sidebarOpen?`<span style="flex:1">${label}</span>${badge?`<span class="sb-badge ${badge>10?'':'amber'}">${badge}</span>`:''}`:''}
</button>`;
}

function renderLogin(){
return`<div class="login-wrap">
<div class="login-lang-switch">
<button class="lang-btn ${currentLang==='es'?'active':''}" onclick="setLang('es')">ES</button>
<button class="lang-btn ${currentLang==='en'?'active':''}" onclick="setLang('en')">EN</button>
</div>
<form class="login-card" id="loginForm">
<div class="login-logo"><img src="${LOGO_URL}" alt="Punto Vivo Bogotá"/></div>
<h1>PUNTO VIVO BOGOTÁ</h1>
<div class="subtitle">${t('subtitle')}</div>
<div class="login-hint">
<i data-lucide="zap" style="width:13px;height:13px;flex:none"></i>
<span><b>DEMO MODE:</b> use <code>admin@puntovivo.gov.co</code> / <code>admin123</code> — or any email + 4-char password.</span>
</div>
<label for="em">${t('auth.email')}</label>
<input id="em" type="email" autocomplete="username" placeholder="admin@puntovivo.gov.co" value="admin@puntovivo.gov.co"/>
<label for="pw">${t('auth.password')}</label>
<input id="pw" type="password" autocomplete="current-password" placeholder="••••••••" value="admin123"/>
<button type="button" class="btn-primary" id="loginBtn"><i data-lucide="log-in" style="width:15px;height:15px"></i> ${t('auth.signin')}</button>
</form>
</div>`;
}

function attachLoginHandler(){
// Wait for DOM to be ready, then attach handler
setTimeout(()=>{
const btn=document.getElementById('loginBtn');
if(!btn){
console.error('[Login] Button #loginBtn not found in DOM');
return;
}
// Remove any existing listeners by cloning
const newBtn=btn.cloneNode(true);
btn.parentNode.replaceChild(newBtn,btn);
newBtn.addEventListener('click',handleLogin);
console.log('[Login] Handler attached to button');
},50);
}

function getPageTitle(){
const titles={dashboard:t('dashboard.title'),reports:t('reports.title'),collections:t('collections.title'),tracking:t('tracking.title'),ecopoints:t('ecopoints.title'),citizens:t('citizens.title'),agencies:t('agencies.title'),fleet:t('fleet.title'),rewards:t('rewards.title'),analytics:t('analytics.title'),news:t('news.title'),logs:t('logs.title'),settings:t('settings.title')};
return titles[State.page]||'Punto Vivo';
}

/* ---------- Actions ---------- */
function handleLogin(){
console.log('[Login] handleLogin called');
const emailEl=document.getElementById('em');
const pwEl=document.getElementById('pw');
const btn=document.getElementById('loginBtn');

if(!emailEl||!pwEl){
console.error('[Login] Form elements not found');
return;
}
if(!btn){
console.error('[Login] Button not found');
return;
}

const email=emailEl.value.trim();
const pw=pwEl.value;

console.log('[Login] Email:',email,'Password length:',pw.length);

if(!email){
showLoginError('Please enter your email');
return;
}
if(pw.length<4){
showLoginError('Password must be at least 4 characters');
return;
}

// Disable button and show loading
btn.disabled=true;
const originalHTML=btn.innerHTML;
btn.innerHTML='<i data-lucide="loader-2" style="width:15px;height:15px;animation:spin 1s linear infinite"></i> '+t('common.loading');
try{lucide.createIcons();}catch(e){console.warn('Lucide error:',e);}

// Clear any previous error
const existingErr=document.querySelector('.login-error');
if(existingErr)existingErr.remove();

// Call API
API.login(email,pw).then(res=>{
console.log('[Login] API response:',res);
if(res&&res.ok){
State.user=res.user;
console.log('[Login] Success, user:',State.user);
renderApp();
}else{
btn.disabled=false;
btn.innerHTML=originalHTML;
try{lucide.createIcons();}catch(e){}
showLoginError(res&&res.error?res.error:'Invalid credentials');
}
}).catch(err=>{
console.error('[Login] API error:',err);
btn.disabled=false;
btn.innerHTML=originalHTML;
try{lucide.createIcons();}catch(e){}
showLoginError('Connection error. Please try again.');
});
}

function showLoginError(msg){
const form=document.getElementById('loginForm');
if(!form)return;
// Remove existing error
const existingErr=form.querySelector('.login-error');
if(existingErr)existingErr.remove();
const errDiv=document.createElement('div');
errDiv.className='login-error';
errDiv.innerHTML='<i data-lucide="alert-circle" style="width:14px;height:14px"></i> '+msg;
form.appendChild(errDiv);
try{lucide.createIcons();}catch(e){}
}

function navigate(page){State.page=page;State.mobileSidebar=false;renderApp();window.scrollTo(0,0);}
function toggleSidebar(){State.sidebarOpen=!State.sidebarOpen;renderApp();}
function toggleMobileSidebar(){State.mobileSidebar=!State.mobileSidebar;renderApp();}
function setLang(lang){currentLang=lang;State.lang=lang;renderApp();}
function toggleLang(){setLang(currentLang==='es'?'en':'es');}
function logout(){State.user=null;renderApp();}
function toggleNotifMenu(){const m=document.getElementById('notifMenu');if(m)m.style.display=m.style.display==='none'?'block':'none';const p=document.getElementById('profileMenu');if(p)p.style.display='none';}
function toggleProfileMenu(){const p=document.getElementById('profileMenu');if(p)p.style.display=p.style.display==='none'?'block':'none';const n=document.getElementById('notifMenu');if(n)n.style.display='none';}
function setChartRange(r){State.chartRange=r;renderApp();}
function toggleKanban(){State.kanbanMode=!State.kanbanMode;renderApp();}
function viewReport(id){const r=State.reports.find(x=>x.id===id);if(!r)return;showDrawer('report',r);}
function viewCollection(id){const c=State.collections.find(x=>x.id===id);if(!c)return;showDrawer('collection',c);}
function filterReports(q){const rows=document.querySelectorAll('#reportsTable tbody tr');rows.forEach(row=>{row.style.display=row.textContent.toLowerCase().includes(q.toLowerCase())?'':'none';});}
function filterCitizens(q){const rows=document.querySelectorAll('#citizensTable tbody tr');rows.forEach(row=>{row.style.display=row.textContent.toLowerCase().includes(q.toLowerCase())?'':'none';});}
function filterLogs(){const type=document.getElementById('logTypeFilter').value;const date=document.getElementById('logDateFilter').value;const lines=document.querySelectorAll('#logStream .log-line');lines.forEach(line=>{const matchType=!type||line.textContent.includes(type);const matchDate=!date||line.textContent.includes(date);line.style.display=matchType&&matchDate?'':'none';});}
function approveReward(id){API.approveReward(id);showToast('success','Reward Approved','Redemption request has been approved.');renderApp();}
function rejectReward(id){API.rejectReward(id);showToast('alert','Reward Rejected','Redemption request has been rejected.');renderApp();}
function toggleNews(id){const n=State.news.find(x=>x.id===id);if(n){n.published=!n.published;renderApp();showToast('success',n.published?'News Published':'News Unpublished','');}}
function editNews(id){showToast('info','Edit News','News editor would open here.');}
function createNews(){showToast('info','Create News','News creation form would open here.');}
function switchSettingsTab(tab){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));event.target.classList.add('active');showToast('info','Settings',`Switched to ${tab} settings`);}
function saveSettings(){showToast('success','Settings Saved','All configuration has been updated.');}
function showToast(type,title,body){const container=document.querySelector('.toasts')||createToastContainer();const toast=document.createElement('div');toast.className=`toast ${type}`;toast.innerHTML=`<span class="tic"><i data-lucide="${type==='success'?'check-circle':type==='alert'?'alert-triangle':'info'}" style="width:15px;height:15px"></i></span><div><b>${title}</b>${body?`<p>${body}</p>`:''}</div><button class="tx" onclick="this.parentElement.remove()"><i data-lucide="x" style="width:13px;height:13px"></i></button>`;container.appendChild(toast);lucide.createIcons();setTimeout(()=>toast.remove(),4500);}
function createToastContainer(){const c=document.createElement('div');c.className='toasts';document.body.appendChild(c);return c;}
function showDrawer(type,data){
const back=document.createElement('div');back.className='drawer-back';back.onclick=()=>back.remove();
const drawer=document.createElement('div');drawer.className='drawer';
let content='';
if(type==='report'){content=`
<div class="dh"><span class="avatar" style="background:var(--amber-d);color:var(--amber-l)"><i data-lucide="file-text" style="width:16px;height:16px"></i></span>
<div style="flex:1"><b style="font-size:14px">${data.id}</b><div style="font-size:11px;color:var(--muted)">${currentLang==='es'?data.statusEs:data.status} • ${fmtDateTime(data.reportedAt)}</div></div>
<button class="iconbtn" onclick="this.closest('.drawer-back').remove()"><i data-lucide="x" style="width:14px;height:14px"></i></button></div>
<div class="db">
<div><div class="label">${t('reports.citizen')}</div><div style="font-weight:600">${data.citizen}</div></div>
<div><div class="label">${t('reports.type')}</div><div>${currentLang==='es'?data.typeEs:data.type}</div></div>
<div><div class="label">${t('reports.ai_class')}</div><div>${data.aiClass} <span class="mono" style="color:var(--sky)">(${Math.round(data.confidence*100)}% confidence)</span></div></div>
<div><div class="label">${t('reports.location')}</div><div class="mono" style="font-size:11px">${data.location[0].toFixed(5)}, ${data.location[1].toFixed(5)}</div></div>
<div><div class="label">${t('reports.agency')}</div><div>${data.agency}</div></div>
<div><div class="label">${t('reports.action')}</div><div class="pill sky"><span class="pd"></span>${data.recommendedAction}</div></div>
<div><div class="label">Description</div><div style="color:var(--muted);font-size:13px;line-height:1.5">${data.description}</div></div>
</div>
<div class="df"><button class="btn" onclick="this.closest('.drawer-back').remove()">${t('common.close')}</button>
<button class="btn primary" onclick="changeReportStatus('${data.id}')"><i data-lucide="check" style="width:13px;height:13px"></i> Update Status</button></div>`;}
else if(type==='collection'){content=`
<div class="dh"><span class="avatar" style="background:var(--sky-d);color:var(--sky-l)"><i data-lucide="truck" style="width:16px;height:16px"></i></span>
<div style="flex:1"><b style="font-size:14px">${data.id}</b><div style="font-size:11px;color:var(--muted)">${data.status} • ${fmtDateTime(data.createdAt)}</div></div>
<button class="iconbtn" onclick="this.closest('.drawer-back').remove()"><i data-lucide="x" style="width:14px;height:14px"></i></button></div>
<div class="db">
<div><div class="label">${t('reports.citizen')}</div><div style="font-weight:600">${data.citizen}</div></div>
<div><div class="label">${t('reports.type')}</div><div>${data.type}</div></div>
<div><div class="label">${t('tracking.vehicle')}</div><div class="mono" style="font-weight:600">${data.vehicle}</div></div>
<div><div class="label">${t('tracking.driver')}</div><div>${data.driver}</div></div>
<div><div class="label">${t('reports.agency')}</div><div>${data.agency}</div></div>
<div><div class="label">${t('tracking.eta')}</div><div class="mono" style="font-size:18px;font-weight:700;color:var(--green)">${data.eta} min</div></div>
<div><div class="label">${t('reports.location')}</div><div class="mono" style="font-size:11px">${data.location[0].toFixed(5)}, ${data.location[1].toFixed(5)}</div></div>
</div>
<div class="df"><button class="btn" onclick="this.closest('.drawer-back').remove()">${t('common.close')}</button>
<button class="btn primary" onclick="advanceCollection('${data.id}')"><i data-lucide="arrow-right" style="width:13px;height:13px"></i> Advance Status</button></div>`;}
drawer.innerHTML=content;back.appendChild(drawer);document.body.appendChild(back);lucide.createIcons();}
function changeReportStatus(id){const statuses=['Submitted','AI Processing','EcoPoint Recommended','Awaiting Citizen','Collection Requested','Agency Review','Scheduled','Collector En Route','Collected','Completed','Cancelled'];const current=State.reports.find(r=>r.id===id).status;const idx=statuses.indexOf(current);const next=statuses[(idx+1)%statuses.length];API.updateReportStatus(id,next);showToast('success','Status Updated',`Report ${id} → ${next}`);renderApp();}
function advanceCollection(id){const statuses=['New','Awaiting Agency','Approved','Scheduled','Collector Assigned','En Route','Arrived','Collected','Completed','Cancelled'];const current=State.collections.find(c=>c.id===id).status;const idx=statuses.indexOf(current);const next=statuses[(idx+1)%statuses.length];API.updateCollectionStatus(id,next);showToast('success','Status Advanced',`Collection ${id} → ${next}`);renderApp();}

/* ---------- Charts ---------- */
let charts={};
function initPageCharts(){
setTimeout(()=>{
if(State.page==='dashboard'){
if(charts.activity)charts.activity.destroy();
if(charts.category)charts.category.destroy();
const actCtx=document.getElementById('activityChart');if(actCtx){
charts.activity=new Chart(actCtx,{type:'line',data:{labels:generateChartData(parseInt(State.chartRange)).map(d=>d.date),datasets:[
{label:'Reports',data:generateChartData(parseInt(State.chartRange)).map(d=>d.reports),borderColor:'#38bdf8',backgroundColor:'rgba(56,189,248,0.1)',fill:true,tension:0.4},
{label:'Completed',data:generateChartData(parseInt(State.chartRange)).map(d=>d.completed),borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,0.1)',fill:true,tension:0.4},
{label:'Scheduled',data:generateChartData(parseInt(State.chartRange)).map(d=>d.scheduled),borderColor:'#f59e0b',tension:0.4}
]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8ea6c6',font:{size:11}}}},scales:{x:{ticks:{color:'#5b7396',maxTicksLimit:10},grid:{color:'#1e2a45'}},y:{ticks:{color:'#5b7396'},grid:{color:'#1e2a45'}}}}});}
const catCtx=document.getElementById('categoryChart');if(catCtx){
charts.category=new Chart(catCtx,{type:'doughnut',data:{labels:generateCategoryData().map(d=>d.name),datasets:[{data:generateCategoryData().map(d=>d.value),backgroundColor:generateCategoryData().map(d=>d.color),borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#8ea6c6',font:{size:10},boxWidth:12}}}}});}
}
if(State.page==='analytics'){
['efficiency','trends','performance','utilization'].forEach(k=>{if(charts[k])charts[k].destroy();});
const effCtx=document.getElementById('efficiencyChart');if(effCtx){charts.efficiency=new Chart(effCtx,{type:'bar',data:{labels:['Response Time','Collection Time','On-time %'],datasets:[{label:'Minutes/%',data:[45,28,87],backgroundColor:['#38bdf8','#22c55e','#f59e0b']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8ea6c6'}}},scales:{x:{ticks:{color:'#5b7396'},grid:{color:'#1e2a45'}},y:{ticks:{color:'#5b7396'},grid:{color:'#1e2a45'}}}}});}
const trCtx=document.getElementById('trendsChart');if(trCtx){charts.trends=new Chart(trCtx,{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Reports',data:[45,52,38,65,48,72,55],borderColor:'#38bdf8',tension:0.4},{label:'Collections',data:[38,45,32,58,42,65,48],borderColor:'#22c55e',tension:0.4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8ea6c6'}}},scales:{x:{ticks:{color:'#5b7396'},grid:{color:'#1e2a45'}},y:{ticks:{color:'#5b7396'},grid:{color:'#1e2a45'}}}}});}
const perfCtx=document.getElementById('performanceChart');if(perfCtx){charts.performance=new Chart(perfCtx,{type:'bar',data:{labels:State.agencies.slice(0,6).map(a=>a.name.substring(0,10)),datasets:[{label:'Requests',data:State.agencies.slice(0,6).map(a=>a.requests),backgroundColor:'#38bdf8'},{label:'Completed',data:State.agencies.slice(0,6).map(a=>a.completed/10),backgroundColor:'#22c55e'}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{labels:{color:'#8ea6c6'}}},scales:{x:{ticks:{color:'#5b7396'},grid:{color:'#1e2a45'}},y:{ticks:{color:'#5b7396',font:{size:9}},grid:{color:'#1e2a45'}}}}});}
const utilCtx=document.getElementById('utilizationChart');if(utilCtx){charts.utilization=new Chart(utilCtx,{type:'bar',data:{labels:State.ecopoints.map(e=>e.name.replace('Ecopunto ','')),datasets:[{label:'Occupancy %',data:State.ecopoints.map(e=>Math.round(e.occupancy/e.capacity*100)),backgroundColor:State.ecopoints.map(e=>e.occupancy/e.capacity>0.9?'#ef4444':e.occupancy/e.capacity>0.7?'#f59e0b':'#22c55e')}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8ea6c6'}}},scales:{x:{ticks:{color:'#5b7396',font:{size:9}},grid:{color:'#1e2a45'}},y:{ticks:{color:'#5b7396'},grid:{color:'#1e2a45'},max:100}}}});}
}
},200);
}

/* ---------- Maps ---------- */
function initPageMaps(){
setTimeout(()=>{
if(State.page==='dashboard'){const m=initMap('dashMap');if(m)addReportMarkers(m,State.reports);}
if(State.page==='tracking'){const m=initMap('trackingMap',[4.6981,-74.0420],12);if(m){addReportMarkers(m,State.reports);addVehicleMarkers(m,State.vehicles);}}
if(State.page==='ecopoints'){const m=initMap('ecopointMap');if(m)addEcopointMarkers(m,State.ecopoints);}
if(State.page==='fleet'){const m=initMap('fleetMap');if(m)addVehicleMarkers(m,State.vehicles);}
if(State.page==='analytics'){const m=initMap('heatmapMap');if(m)addReportMarkers(m,State.reports);}
},300);
}

/* ---------- Init ---------- */
State.reports=generateReports(50);
State.collections=generateCollections(40);
State.ecopoints=generateEcopoints();
State.citizens=generateCitizens();
State.agencies=generateAgencies();
State.vehicles=generateVehicles();
State.rewards=generateRewards();
State.news=generateNews();
State.logs=generateLogs();
State.notifications=[
{type:'alert',title:'Ecopunto Kennedy Full',body:'Capacity reached 99%',ts:new Date(Date.now()-5*60000).toISOString()},
{type:'info',title:'New Report WR-1234',body:'Furniture reported in Chapinero',ts:new Date(Date.now()-15*60000).toISOString()},
{type:'success',title:'Collection CR-1042 Completed',body:'Vehicle PV-042 finished route',ts:new Date(Date.now()-30*60000).toISOString()}
];

renderApp();

/* Close menus on outside click */
document.addEventListener('click',(e)=>{
if(!e.target.closest('.menu-wrap')){document.querySelectorAll('.menu').forEach(m=>m.style.display='none');}
});

/* Simulate realtime */
setInterval(()=>{
if(Math.random()>0.7){
const types=['info','success','alert'];const type=pick(types);
const msgs={info:['New waste report received','Citizen location updated','EcoPoint capacity updated'],success:['Collection completed','Reward issued','Report resolved'],alert:['EcoPoint near capacity','Vehicle maintenance required','High report volume detected']};
State.notifications.unshift({type,title:pick(msgs[type]),body:pick(['Chapinero','Usaquén','Suba','Kennedy','Fontibón']),ts:new Date().toISOString()});
if(State.notifications.length>10)State.notifications.pop();
if(State.page==='dashboard'||State.page==='logs')renderApp();
}
},20000);

/* Add spin animation */
const style=document.createElement('style');style.textContent='@keyframes spin{to{transform:rotate(360deg)}}';document.head.appendChild(style);
</script>
</body>
</html>
