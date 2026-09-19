import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { nav, zones, trend, distribution } from "./data";

const Icon = ({ name, ...props }) => {
  const C = Icons[name] || Icons.Circle;
  return <C {...props} />;
};
const navIcons = [
  "LayoutDashboard",
  "Map",
  "ChartNoAxesCombined",
  "BellRing",
  "Satellite",
  "Activity",
  "FileText",
  "Flag",
  "History",
];
const updatesBase = [
  [
    "CloudRain",
    "Rainfall intensity increased",
    "in Zone 04 - East Ridge",
    "2 min ago",
    "Rainfall",
  ],
  [
    "Radar",
    "New high risk zone detected",
    "in North Valley",
    "8 min ago",
    "Risk Update",
  ],
  [
    "Flag",
    "New field report received",
    "near Hill Top Road",
    "12 min ago",
    "Field Report",
  ],
  [
    "Activity",
    "Seismic activity recorded",
    "M 4.8, 32 km away",
    "28 min ago",
    "Seismic",
  ],
];

function Modal({ title, children, close }) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="icon-button modal-close" onClick={close}>
          <Icon name="X" />
        </button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}
function MiniChart({ color = "#4da3ff", data = [21, 29, 26, 35, 30, 42, 38] }) {
  return (
    <ResponsiveContainer width="100%" height={54}>
      <AreaChart data={data.map((v, i) => ({ i, v }))}>
        <defs>
          <linearGradient id={`g${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor={color} stopOpacity=".45" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          fill={`url(#g${color.slice(1)})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
function Stat({ title, value, label, icon, color = "blue", children }) {
  return (
    <article className="card stat-card">
      <div>
        <p className="eyebrow">{title}</p>
        <strong>{value}</strong>
        <span>{label}</span>
        {children}
      </div>
      <div className={`stat-icon ${color}`}>
        <Icon name={icon} />
      </div>
    </article>
  );
}
function EnvCard({ icon, title, value, status, detail, color, data }) {
  return (
    <article className="card env-card">
      <div className={`small-icon ${color}`}>
        <Icon name={icon} />
      </div>
      <div className="env-copy">
        <p className="eyebrow">{title}</p>
        <b>{value}</b>
        <span className={color}>{status}</span>
        <small>{detail}</small>
      </div>
      <div className="mini">
        <MiniChart
          color={
            color === "red"
              ? "#ff6b6b"
              : color === "yellow"
                ? "#f5c542"
                : color === "green"
                  ? "#35d07f"
                  : "#4da3ff"
          }
          data={data}
        />
      </div>
    </article>
  );
}
function Map({ layers, setLayers, onZoneSelect }) {
  const [zoom, setZoom] = useState(1);

  const toggle = (k) => setLayers((x) => ({ ...x, [k]: !x[k] }));
  const changeZoom = (amount) =>
    setZoom((value) => Math.min(1.25, Math.max(1, value + amount)));
  const locateCriticalZone = () => {
    setLayers((current) => ({ ...current, risk: true }));
    setZoom(1.12);
  };
  const toggleFullscreen = () => {
    const map = document.querySelector(".map");
    if (!document.fullscreenElement) map?.requestFullscreen();
    else document.exitFullscreen();
  };
  return (
    <section className={`card map-card ${layers.satellite ? "satellite" : ""}`}>
      <header>
        <div>
          <h2>
            LIVE RISK MAP{" "}
            <span className="live">
              <i /> LIVE
            </span>
          </h2>
          <p>Eastern monitoring region • 12 zones</p>
        </div>
        <div className="layers">
          {[
            ["risk", "Shield", "Risk Zones"],
            ["rain", "CloudRain", "Rainfall"],
            ["satellite", "Satellite", "Satellite"],
            ["terrain", "Mountain", "Terrain"],
            ["seismic", "Activity", "Seismic"],
            ["reports", "Flag", "Reports"],
          ].map(([k, i, t]) => (
            <button
              className={layers[k] ? "active" : ""}
              onClick={() => toggle(k)}
              key={k}
            >
              <Icon name={i} />
              {t}
            </button>
          ))}
        </div>
      </header>
      <div
        className={`map ${layers.terrain ? "terrain" : ""}`}
        style={{ backgroundSize: `${zoom * 100}% ${zoom * 100}%` }}
      >
        {layers.rain && <div className="rainfall" />}
        {layers.risk && (
          <svg className="risk-overlay" viewBox="0 0 1000 600">
            <path
              className="risk-zone low-zone"
              d="M100 88 C165 44 255 62 282 119 C300 164 244 205 177 190 C112 176 62 130 100 88Z"
              onClick={() => onZoneSelect(zones[4])}
            />
            <path
              className="risk-zone high-zone"
              d="M606 104 C688 55 817 73 854 144 C884 202 818 251 729 239 C649 229 574 176 606 104Z"
              onClick={() => onZoneSelect(zones[1])}
            />
            <path
              className="risk-zone critical-zone"
              d="M376 259 C460 195 590 218 648 286 C699 346 659 431 572 450 C481 470 351 421 327 342 C315 304 341 282 376 259Z"
              onClick={() => onZoneSelect(zones[0])}
            />
            <path
              className="risk-zone medium-zone"
              d="M689 371 C750 334 848 355 879 419 C898 463 854 519 771 516 C700 513 642 474 646 430 C649 403 666 387 689 371Z"
              onClick={() => onZoneSelect(zones[3])}
            />
          </svg>
        )}
        <span className="village v1">Hillview Village</span>
        <span className="village v2">Sunrise Hamlet</span>
        <span className="village v3">Green Valley</span>
        <span className="village v4">Riverdale</span>
        <span className="village v5">Pinewood</span>
        {layers.risk && (
          <>
            <span className="map-pin">
              <Icon name="MapPin" fill="#ff4b4b" />
            </span>
            <span className="warning w1">
              <Icon name="TriangleAlert" />
            </span>
            <span className="warning w2">
              <Icon name="TriangleAlert" />
            </span>
          </>
        )}
        {layers.seismic && (
          <span className="quake">
            <Icon name="Activity" /> <b>M 4.8 Earthquake</b>
            <small>32 km away • 2 hours ago</small>
          </span>
        )}
        {layers.reports && (
          <span className="report">
            <Icon name="Flag" fill="#f5c542" />
          </span>
        )}
        <div className="legend">
          <b>RISK LEGEND</b>
          {[
            ["#ff4b4b", "Critical Risk"],
            ["#ff9f1c", "High Risk"],
            ["#f5c542", "Medium Risk"],
            ["#46c36f", "Low Risk"],
          ].map((x) => (
            <span key={x[1]}>
              <i style={{ background: x[0] }} />
              {x[1]}
            </span>
          ))}
          <span>⌂ Village</span>
          <span>⚡ Recent Earthquake</span>
          <span>⚑ Citizen Report</span>
        </div>
        <div className="map-controls">
          <button
            onClick={locateCriticalZone}
            aria-label="Locate critical zone"
          >
            <Icon name="Crosshair" />
          </button>
          <button onClick={() => changeZoom(0.05)} aria-label="Zoom in">
            +
          </button>
          <button onClick={() => changeZoom(-0.05)} aria-label="Zoom out">
            −
          </button>
          <button onClick={toggleFullscreen} aria-label="Fullscreen map">
            <Icon name="Maximize" />
          </button>
        </div>
      </div>
    </section>
  );
}
function Feed({ updates }) {
  return (
    <aside className="stack">
      <section className="card side-card">
        <header>
          <h2>RECENT UPDATES</h2>
        </header>
        {updates.map(([ic, a, b, time, tag], i) => (
          <div className="update" key={i}>
            <div className={`update-icon c${i}`}>
              <Icon name={ic} />
            </div>
            <div>
              <b>{a}</b>
              <p>{b}</p>
              <small>
                {time} <em>{tag}</em>
              </small>
            </div>
          </div>
        ))}
        <button className="text-button">
          View All Updates <Icon name="ArrowRight" />
        </button>
      </section>
      <section className="card side-card alerts">
        <header>
          <h2>ACTIVE ALERTS</h2>
          <button className="text-button">View All</button>
        </header>
        {[
          [
            "High Risk Zone",
            "Zone 04 - East Ridge",
            "2 min ago",
            "HIGH PRIORITY",
          ],
          ["Heavy Rainfall Warning", "Multiple Zones", "15 min ago", ""],
          ["Seismic Activity Detected", "M 4.8, 32 km away", "28 min ago", ""],
          ["New Field Report", "Hill Top Road", "35 min ago", ""],
        ].map((a, i) => (
          <div className={`alert ${i === 0 ? "priority" : ""}`} key={a[0]}>
            <Icon name="TriangleAlert" />
            <div>
              <b>{a[0]}</b>
              <p>{a[1]}</p>
              <small>
                {a[2]} {a[3] && <em>{a[3]}</em>}
              </small>
            </div>
          </div>
        ))}
      </section>
    </aside>
  );
}
function App() {
  const [page, setPage] = useState("Dashboard"),
    [open, setOpen] = useState(false),
    [layers, setLayers] = useState({
      risk: true,
      rain: false,
      satellite: false,
      terrain: false,
      seismic: true,
      reports: true,
    }),
    [risk, setRisk] = useState(78),
    [rain, setRain] = useState(124),
    [updates, setUpdates] = useState(updatesBase),
    [modal, setModal] = useState(null),
    [bell, setBell] = useState(false),
    [profile, setProfile] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setRisk((v) => (v >= 81 ? 77 : v + 1));
      setRain((v) => (v >= 130 ? 124 : v + 1));
      setUpdates((u) => [
        [
          "CloudRain",
          "Rainfall monitoring update",
          `East Ridge now at ${rain + 1} mm`,
          "Just now",
          "Rainfall",
        ],
        ...u.slice(0, 3),
      ]);
    }, 18000);
    return () => clearInterval(id);
  }, [rain]);
  const placeholder = page !== "Dashboard";
  return (
    <div className="app">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="logo">
            <Icon name="Mountain" />
          </div>
          <div>
            <b>LANDSLIDE</b>
            <span>EARLY WARNING SYSTEM</span>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <Icon name="X" />
          </button>
        </div>
        <nav>
          {nav.map((n, i) => (
            <button
              className={page === n ? "selected" : ""}
              onClick={() => {
                setPage(n);
                setOpen(false);
              }}
              key={n}
            >
              <Icon name={navIcons[i]} />
              {n}
              {n === "Alerts" && <em>3</em>}
            </button>
          ))}
        </nav>
        <div className="nav-divider" />
        <nav>
          <button>
            <Icon name="Settings" />
            Settings
          </button>
          <button>
            <Icon name="CircleHelp" />
            Help & Support
          </button>
        </nav>
        <div className="system">
          <p>SYSTEM STATUS</p>
          <b>
            <i /> All Systems Operational
          </b>
          <span>
            Data Last Updated
            <br />
            21 May 2024, 10:42:15 AM
          </span>
          <small>
            <Icon name="RefreshCw" /> Auto refresh in 15 sec
          </small>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <button className="menu" onClick={() => setOpen(true)}>
              <Icon name="Menu" />
            </button>
            <h1>LANDSLIDE EARLY WARNING SYSTEM</h1>
            <p>
              Monitoring <i /> Analysis <i /> Alerts{" "}
              <span className="live">
                <i /> LIVE
              </span>
            </p>
          </div>
          <div className="header-actions">
            <span>
              <Icon name="Clock" />
              10:42 AM<small>21 May 2024</small>
            </span>
            <span>
              <Icon name="CloudRain" />
              22°C<small>Moderate Rain</small>
            </span>
            <div className="pop-wrap">
              <button className="icon-button" onClick={() => setBell(!bell)}>
                <Icon name="Bell" />
                <em>3</em>
              </button>
              {bell && (
                <div className="pop notifications">
                  <b>Notifications</b>
                  <p>3 active warnings need review.</p>
                </div>
              )}
            </div>
            <div className="pop-wrap">
              <button className="profile" onClick={() => setProfile(!profile)}>
                <div>AC</div>
                <span>
                  <b>Admin</b>
                  <small>Control Center</small>
                </span>
                <Icon name="ChevronDown" />
              </button>
              {profile && (
                <div className="pop profile-pop">
                  <button>Profile</button>
                  <button>Settings</button>
                  <button>Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>
        {placeholder ? (
          <section className="placeholder card">
            <Icon name={navIcons[nav.indexOf(page)]} />
            <h2>{page}</h2>
            <p>
              This monitoring workspace is ready for operational data. Return to
              Dashboard for the live prototype.
            </p>
            <button onClick={() => setPage("Dashboard")}>Open Dashboard</button>
          </section>
        ) : (
          <div className="content">
            <section className="overview">
              <article className="card gauge-card">
                <p className="eyebrow">
                  OVERALL RISK LEVEL <Icon name="Info" />
                </p>
                <div className="gauge">
                  <div className="gauge-fill" />
                  <div
                    className="needle"
                    style={{ transform: `rotate(${risk * 1.8 - 90}deg)` }}
                  />
                  <div>
                    <b>HIGH</b>
                    <strong>
                      {risk} <small>/ 100</small>
                    </strong>
                    <span>Risk Score</span>
                  </div>
                </div>
                <p className="up">
                  ↑ 12% <span>from last 1 hour</span>
                </p>
              </article>
              <Stat
                title="ACTIVE ALERTS"
                value="03"
                label="Active Warnings"
                icon="TriangleAlert"
                color="red"
              >
                <p className="up">
                  ↑ 1 new alert <span>in last 30 min</span>
                </p>
              </Stat>
              <Stat
                title="MONITORED ZONES"
                value="12"
                label="Total Zones"
                icon="MapPin"
              >
                <p className="breakdown">
                  <i className="red" />2 Critical <i className="orange" />4 High{" "}
                  <i className="yellow" />4 Medium <i className="green" />2 Low
                </p>
              </Stat>
              <Stat
                title="AFFECTED POPULATION"
                value="8,452"
                label="People"
                icon="Users"
                color="purple"
              >
                <p>
                  In High & Critical
                  <br />
                  Risk Zones
                </p>
              </Stat>
              <Stat
                title="DATA SOURCES"
                value="6 / 6"
                label="Online"
                icon="Satellite"
                color="green"
              >
                <p className="green-text">All systems Operational</p>
              </Stat>
            </section>
            <section className="environment">
              <EnvCard
                icon="CloudRain"
                title="RAINFALL (24H)"
                value={`${rain} mm`}
                status="Increasing"
                detail="Heavy rainfall in multiple zones"
                color="blue"
                data={[15, 24, 20, 40, 35, 52, 57]}
              />
              <EnvCard
                icon="Droplets"
                title="SOIL MOISTURE"
                value="85%"
                status="High Saturation"
                detail="↑ 8% from yesterday"
                color="green"
                data={[50, 52, 60, 62, 70, 78, 85]}
              />
              <EnvCard
                icon="Thermometer"
                title="TEMPERATURE"
                value="22°C"
                status="Moderate"
                detail="Feels like 23°C"
                color="yellow"
                data={[18, 20, 21, 24, 25, 23, 22]}
              />
              <EnvCard
                icon="Wind"
                title="WIND SPEED"
                value="18 km/h"
                status="Moderate Breeze"
                detail="SW Direction"
                color="blue"
                data={[13, 18, 15, 24, 19, 16, 18]}
              />
            </section>
            <section className="map-layout">
              <Map
                layers={layers}
                setLayers={setLayers}
                onZoneSelect={setModal}
              />
              <Feed updates={updates} />
            </section>
            <section className="analytics">
              <article className="card chart-card">
                <header>
                  <div>
                    <h2>RISK TREND</h2>
                    <p>Last 24 Hours</p>
                  </div>
                  <b className="current">{risk}</b>
                </header>
                <ResponsiveContainer width="100%" height={210}>
                  <LineChart data={trend}>
                    <defs>
                      <linearGradient id="risk" x1="0" x2="0" y1="0" y2="1">
                        <stop stopColor="#ff9f1c" stopOpacity=".3" />
                        <stop offset="1" stopColor="#ff9f1c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="t"
                      stroke="#65768b"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#65768b"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f1d2e",
                        border: "1px solid #253a52",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="r"
                      stroke="#ff9f1c"
                      strokeWidth={3}
                      dot={{ fill: "#ff9f1c", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </article>
              <article className="card distribution">
                <header>
                  <h2>RISK DISTRIBUTION</h2>
                </header>
                <div className="donut">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={distribution}
                        dataKey="value"
                        innerRadius={55}
                        outerRadius={77}
                        paddingAngle={3}
                      >
                        {distribution.map((d) => (
                          <Cell fill={d.color} key={d.name} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <b>
                    12<small>Total Zones</small>
                  </b>
                </div>
                {distribution.map((d) => (
                  <p key={d.name}>
                    <i style={{ background: d.color }} />
                    {d.name}{" "}
                    <span>
                      {d.value} ({((d.value / 12) * 100).toFixed(1)}%)
                    </span>
                  </p>
                ))}
              </article>
            </section>
            <section className="card zones">
              <header>
                <div>
                  <h2>HIGH RISK ZONES</h2>
                  <p>Priority areas requiring monitoring</p>
                </div>
              </header>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {[
                        "Zone ID",
                        "Location",
                        "Risk Level",
                        "Risk Score",
                        "Trend",
                        "Last Updated",
                        "Action",
                      ].map((x) => (
                        <th key={x}>{x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((z) => (
                      <tr key={z[0]}>
                        <td>{z[0]}</td>
                        <td>
                          <b>{z[1]}</b>
                        </td>
                        <td>
                          <em className={z[2].toLowerCase()}>{z[2]}</em>
                        </td>
                        <td>
                          <div className="score">
                            <i style={{ width: `${z[3]}%` }} />
                            {z[3]} / 100
                          </div>
                        </td>
                        <td className={z[4] === "Increasing" ? "up" : "stable"}>
                          {z[4] === "Increasing" ? "↑" : "→"} {z[4]}
                        </td>
                        <td>{z[5]}</td>
                        <td>
                          <button className="view" onClick={() => setModal(z)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="announcement">
              <Icon name="Radio" />
              <div>
                <b>SYSTEM ANNOUNCEMENT</b>
                <p>
                  Moderate to heavy rainfall expected in next 24–48 hours in
                  Eastern and Northern regions. Stay alert and follow safety
                  guidelines.
                </p>
              </div>
              <button onClick={() => setModal("safety")}>
                View Safety Guidelines <Icon name="ArrowRight" />
              </button>
            </section>
          </div>
        )}
      </main>
      {modal && (
        <Modal
          title={
            modal === "safety"
              ? "LANDSLIDE SAFETY GUIDELINES"
              : `${modal[1]} • ${modal[0]}`
          }
          close={() => setModal(null)}
        >
          {modal === "safety" ? (
            <div className="guidelines">
              <h3>Before a landslide</h3>
              <p>
                • Monitor official warnings
                <br />• Prepare emergency supplies
                <br />• Identify safe evacuation routes
              </p>
              <h3>During a landslide</h3>
              <p>
                • Move away from the affected area
                <br />• Avoid river valleys and unstable slopes
                <br />• Follow evacuation instructions
              </p>
              <h3>After a landslide</h3>
              <p>
                • Stay away from damaged areas
                <br />• Report hazards to authorities
                <br />• Do not return until the area is declared safe
              </p>
            </div>
          ) : (
            <div className="zone-modal">
              <em className={modal[2].toLowerCase()}>{modal[2]}</em>
              <h3>Risk score: {modal[3]} / 100</h3>
              <p>
                Current trend: {modal[4]}. Field monitoring shows persistent
                rainfall and saturated soil conditions in this zone.
              </p>
              <button onClick={() => setModal(null)}>Close details</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
export default App;
