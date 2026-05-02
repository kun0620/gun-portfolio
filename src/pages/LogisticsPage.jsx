import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleMarker, MapContainer, Polygon, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LogisticsNavbar from '../components/logistics/Navbar.jsx';
import LogisticsSidebar from '../components/logistics/Sidebar.jsx';
import ShipmentDrawer from '../components/logistics/ShipmentDrawer.jsx';
import { LogisticsThemeProvider, useLogisticsTheme } from '../context/logisticsThemeContext.jsx';
import { LogisticsLangProvider, useLogisticsLang } from '../context/logisticsLangContext.jsx';
import { alerts, kpis, shipments } from '../data/logistics/mockLogistics.js';

const HUB_COORDS = {
  BKK: [13.7563, 100.5018],
  CNX: [18.7883, 98.9853],
  HKT: [7.8804, 98.3923],
  KKC: [16.4419, 102.835],
  UBP: [15.2447, 104.8472],
  HDY: [7.0084, 100.4747],
  NST: [8.4304, 99.9631],
  UDN: [17.4138, 102.787],
  RYG: [12.6814, 101.2816],
  SKA: [6.997, 100.4747],
};

const INCIDENT_ZONES = [
  {
    id: 'zone-central',
    label: 'Central congestion',
    severity: 'warn',
    coords: [
      [15.3, 100.0],
      [15.1, 101.2],
      [14.2, 101.4],
      [13.8, 100.4],
      [14.7, 99.7],
    ],
  },
  {
    id: 'zone-gulf-south',
    label: 'Storm corridor',
    severity: 'critical',
    coords: [
      [10.2, 99.2],
      [10.8, 100.5],
      [8.4, 100.9],
      [7.2, 99.5],
    ],
  },
];

function shipmentColor(status) {
  if (status === 'delayed') return '#fd8b00';
  if (status === 'offline') return '#6d6d6d';
  return '#00fbfb';
}

function buildRoute(originCode, destinationCode) {
  const origin = HUB_COORDS[originCode];
  const destination = HUB_COORDS[destinationCode];
  if (!origin || !destination) return null;
  return [origin, destination];
}

function resolveShipmentMarker(shipment) {
  const origin = HUB_COORDS[shipment.origin];
  const destination = HUB_COORDS[shipment.destination];
  if (!origin || !destination) return null;
  if (shipment.status === 'offline') return origin;

  const idScore = shipment.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const progress = ((idScore % 55) + 20) / 100;
  return [
    origin[0] + (destination[0] - origin[0]) * progress,
    origin[1] + (destination[1] - origin[1]) * progress,
  ];
}

function KPIGrid() {
  const { tr } = useLogisticsLang();
  return (
    <div className="transitos-kpi-grid">
      <div className="transitos-kpi-card">
        <div className="transitos-kpi-head"><span>{tr.kpi.activeShipments}</span><span className="text-[#00fbfb] text-[10px]">+12%</span></div>
        <strong>{kpis.activeShipments.toLocaleString()}</strong>
      </div>
      <div className="transitos-kpi-card">
        <div className="transitos-kpi-head"><span>{tr.kpi.onTimeRate}</span><span className="text-[#00fbfb] text-[10px]">+0.8%</span></div>
        <strong>{kpis.onTimeRate}%</strong>
      </div>
      <div className="transitos-kpi-card">
        <div className="transitos-kpi-head"><span>{tr.kpi.avgEtaError}</span><span className="text-[#fd8b00] text-[10px]">-2.1m</span></div>
        <strong>{kpis.etaErrorMinutes}m</strong>
      </div>
      <div className="transitos-kpi-card alert">
        <div className="transitos-kpi-head"><span>{tr.kpi.incidents}</span><span className="text-[#fd8b00] text-[10px]">{tr.kpi.active}</span></div>
        <strong>{String(kpis.incidents).padStart(2, '0')}</strong>
      </div>
    </div>
  );
}

function statusClass(status) {
  if (status === 'delayed') return 'warning';
  if (status === 'offline') return 'muted';
  return 'info';
}

function getSeedFromId(id) {
  return id.split('').reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
}

function getSimProgress(shipment, tick) {
  if (shipment.status === 'offline') return 0;
  const seed = getSeedFromId(shipment.id);
  const base = ((seed % 45) + 18) / 100;
  const speed = shipment.status === 'delayed'
    ? ((seed % 5) + 2) / 800
    : ((seed % 6) + 3) / 700;
  const progress = (base + tick * speed) % 1;
  return Math.min(progress, 0.985);
}

function markerByProgress(shipment, progress) {
  const origin = HUB_COORDS[shipment.origin];
  const destination = HUB_COORDS[shipment.destination];
  if (!origin || !destination) return null;
  return [
    origin[0] + (destination[0] - origin[0]) * progress,
    origin[1] + (destination[1] - origin[1]) * progress,
  ];
}

function markerOnRoute(routeCoords, progress, fallbackShipment) {
  if (!routeCoords || routeCoords.length < 2) return markerByProgress(fallbackShipment, progress);
  const clamped = Math.max(0, Math.min(1, progress));

  const segments = [];
  let totalDistance = 0;
  for (let index = 0; index < routeCoords.length - 1; index += 1) {
    const start = routeCoords[index];
    const end = routeCoords[index + 1];
    const segmentDistance = Math.hypot(end[0] - start[0], end[1] - start[1]);
    segments.push({ start, end, segmentDistance });
    totalDistance += segmentDistance;
  }

  if (!totalDistance) return routeCoords[0];
  let targetDistance = totalDistance * clamped;
  for (const segment of segments) {
    if (targetDistance <= segment.segmentDistance) {
      const ratio = segment.segmentDistance === 0 ? 0 : targetDistance / segment.segmentDistance;
      return [
        segment.start[0] + (segment.end[0] - segment.start[0]) * ratio,
        segment.start[1] + (segment.end[1] - segment.start[1]) * ratio,
      ];
    }
    targetDistance -= segment.segmentDistance;
  }

  return routeCoords[routeCoords.length - 1];
}

function computeEtaDelta(shipment, tick) {
  if (shipment.status === 'offline') return null;
  const seed = getSeedFromId(shipment.id);
  const wave = Math.sin((tick + seed % 37) / 5);
  const drift = Math.round(wave * (shipment.status === 'delayed' ? 8 : 4));
  const baseline = shipment.etaDeltaMinutes ?? 0;
  return Math.max(0, baseline + drift);
}

function routeDirectionSegment(coords) {
  if (!coords || coords.length < 2) return null;
  const start = coords[Math.max(0, coords.length - 2)];
  const end = coords[coords.length - 1];
  const anchor = [
    start[0] + (end[0] - start[0]) * 0.78,
    start[1] + (end[1] - start[1]) * 0.78,
  ];
  return [anchor, end];
}

function TransitMap({ shipmentsToRender, selectedShipment, tr, simTick, onShipmentFocus, routePaths }) {
  const routeLines = useMemo(
    () => shipmentsToRender
      .map((shipment) => ({
        id: shipment.id,
        status: shipment.status,
        coords: routePaths[shipment.id] ?? buildRoute(shipment.origin, shipment.destination),
      }))
      .filter((item) => item.coords),
    [shipmentsToRender, routePaths]
  );

  const markers = useMemo(
    () => shipmentsToRender
      .map((shipment) => ({
        id: shipment.id,
        status: shipment.status,
        etaLabel: shipment.etaLabel,
        etaDelta: computeEtaDelta(shipment, simTick),
        point: markerOnRoute(
          routePaths[shipment.id] ?? buildRoute(shipment.origin, shipment.destination),
          getSimProgress(shipment, simTick),
          shipment
        ) ?? resolveShipmentMarker(shipment),
        routeCode: shipment.routeCode,
      }))
      .filter((item) => item.point),
    [shipmentsToRender, simTick]
  );

  return (
    <div className="transitos-real-map">
      <MapContainer
        center={[14.2, 101.0]}
        zoom={6}
        minZoom={5}
        maxZoom={10}
        zoomControl={false}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {INCIDENT_ZONES.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coords}
            pathOptions={{
              color: zone.severity === 'critical' ? '#ff5a5a' : '#fd8b00',
              weight: 1.1,
              fillOpacity: zone.severity === 'critical' ? 0.14 : 0.1,
              fillColor: zone.severity === 'critical' ? '#ff3b3b' : '#fd8b00',
              dashArray: '6 8',
            }}
          >
            <Tooltip direction="center" opacity={0.88}>
              <div className="transitos-map-tooltip">{zone.label}</div>
            </Tooltip>
          </Polygon>
        ))}

        {routeLines.map((route) => (
          <Fragment key={`route-wrap-${route.id}`}>
            <Polyline
              positions={route.coords}
              pathOptions={{
                color: shipmentColor(route.status),
                weight: route.id === selectedShipment?.id ? 4 : 2,
                opacity: route.status === 'offline' ? 0.3 : 0.55,
                dashArray: route.status === 'delayed' ? '8 6' : '10 10',
              }}
            />
            <Polyline
              positions={routeDirectionSegment(route.coords)}
              pathOptions={{
                color: shipmentColor(route.status),
                weight: route.id === selectedShipment?.id ? 5 : 3,
                opacity: route.status === 'offline' ? 0.22 : 0.75,
              }}
            />
          </Fragment>
        ))}

        {markers.map((marker) => (
          <CircleMarker
            key={`marker-${marker.id}`}
            center={marker.point}
            radius={marker.id === selectedShipment?.id ? 8 : 6}
            pathOptions={{
              color: '#0b1016',
              weight: 1,
              fillColor: shipmentColor(marker.status),
              fillOpacity: marker.status === 'offline' ? 0.45 : 0.95,
            }}
            eventHandlers={{
              click: () => onShipmentFocus(marker.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              <div className="transitos-map-tooltip">
                <div>{marker.id}</div>
                <div>{marker.routeCode}</div>
                <div>{tr.table.eta}: {marker.etaLabel}{marker.etaDelta ? ` (+${marker.etaDelta}m)` : ''}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {Object.entries(HUB_COORDS).map(([code, coord]) => (
          <CircleMarker
            key={`hub-${code}`}
            center={coord}
            radius={3.5}
            pathOptions={{
              color: '#0f151d',
              weight: 1,
              fillColor: '#c6d0de',
              fillOpacity: 0.9,
            }}
          >
            <Tooltip direction="right" offset={[7, 0]} opacity={0.9}>
              <div className="transitos-map-tooltip">{code}</div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function LogisticsShell() {
  const navigate = useNavigate();
  const { theme } = useLogisticsTheme();
  const { tr } = useLogisticsLang();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('eta');
  const [selectedId, setSelectedId] = useState(shipments[0]?.id ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [simRunning, setSimRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simTick, setSimTick] = useState(0);
  const [routePaths, setRoutePaths] = useState({});

  const counts = useMemo(() => ({
    all: shipments.length,
    in_transit: shipments.filter((s) => s.status === 'in_transit').length,
    delayed: shipments.filter((s) => s.status === 'delayed').length,
    offline: shipments.filter((s) => s.status === 'offline').length,
  }), []);

  const filteredShipments = useMemo(() => {
    const lower = search.trim().toLowerCase();
    return shipments
      .filter((s) => statusFilter === 'all' || s.status === statusFilter)
      .filter((s) => {
        if (!lower) return true;
        return [s.id, s.driver, s.origin, s.destination, s.routeCode].join(' ').toLowerCase().includes(lower);
      })
      .sort((a, b) => {
        if (sortBy === 'priority') return b.priority.localeCompare(a.priority);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return a.etaDeltaMinutes - b.etaDeltaMinutes;
      });
  }, [search, statusFilter, sortBy]);

  const selectedShipment = useMemo(
    () => filteredShipments.find((shipment) => shipment.id === selectedId) ?? filteredShipments[0] ?? shipments[0],
    [filteredShipments, selectedId]
  );

  useEffect(() => {
    if (!selectedShipment) return;
    setSelectedId(selectedShipment.id);
  }, [selectedShipment]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!simRunning) return undefined;
    const interval = window.setInterval(() => {
      setSimTick((previous) => previous + simSpeed);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [simRunning, simSpeed]);

  useEffect(() => {
    let isCancelled = false;
    const missing = filteredShipments.filter((shipment) => !routePaths[shipment.id]);
    if (!missing.length) return undefined;

    Promise.all(
      missing.map(async (shipment) => {
        const origin = HUB_COORDS[shipment.origin];
        const destination = HUB_COORDS[shipment.destination];
        if (!origin || !destination) return { id: shipment.id, coords: null };

        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`OSRM ${response.status}`);
          const data = await response.json();
          const coordinates = data?.routes?.[0]?.geometry?.coordinates;
          if (!coordinates?.length) return { id: shipment.id, coords: null };
          return {
            id: shipment.id,
            coords: coordinates.map(([lng, lat]) => [lat, lng]),
          };
        } catch {
          return { id: shipment.id, coords: buildRoute(shipment.origin, shipment.destination) };
        }
      })
    ).then((results) => {
      if (isCancelled) return;
      setRoutePaths((previous) => {
        const next = { ...previous };
        results.forEach((result) => {
          if (result.coords && !next[result.id]) next[result.id] = result.coords;
        });
        return next;
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [filteredShipments, routePaths]);

  const totalVisible = filteredShipments.length;
  const inTransitVisible = filteredShipments.filter((s) => s.status === 'in_transit').length;
  const delayedVisible = filteredShipments.filter((s) => s.status === 'delayed').length;
  const offlineVisible = filteredShipments.filter((s) => s.status === 'offline').length;

  return (
    <div className="transitos-root" data-theme={theme}>
      <LogisticsNavbar search={search} onSearch={setSearch} onBack={() => navigate('/')} />
      <div className="transitos-shell">
        <LogisticsSidebar />
        <main className="transitos-main">
          <KPIGrid />

          <section className="transitos-mid-grid">
            <div className="transitos-map-panel">
              <div className="transitos-map-toolbar">
                <button type="button"><span className="material-symbols-outlined text-[16px]">layers</span></button>
                <button type="button"><span className="material-symbols-outlined text-[16px]">filter_list</span></button>
                <button
                  type="button"
                  className={simRunning ? 'is-active' : ''}
                  aria-label={simRunning ? 'pause simulation' : 'resume simulation'}
                  onClick={() => setSimRunning((current) => !current)}
                >
                  <span className="material-symbols-outlined text-[16px]">{simRunning ? 'pause' : 'play_arrow'}</span>
                </button>
                <button
                  type="button"
                  aria-label="change simulation speed"
                  onClick={() => setSimSpeed((current) => (current === 1 ? 3 : current === 3 ? 6 : 1))}
                >
                  <span className="font-['Fira_Code'] text-[10px]">{simSpeed}x</span>
                </button>
              </div>
              <TransitMap
                shipmentsToRender={filteredShipments}
                selectedShipment={selectedShipment}
                tr={tr}
                simTick={simTick}
                routePaths={routePaths}
                onShipmentFocus={(shipmentId) => {
                  setSelectedId(shipmentId);
                  setDrawerOpen(true);
                }}
              />
              <div className="transitos-map-stats">
                <div className="text-[10px] uppercase text-[#828282] mb-1">{tr.map.nodeStatus}</div>
                <div className="flex justify-between text-[12px]"><span>{tr.map.throughput}</span><span className="text-[#00fbfb]">1.2k/hr</span></div>
                <div className="flex justify-between text-[12px]"><span>{tr.map.latency}</span><span>12ms</span></div>
                <div className="flex justify-between text-[12px]">
                  <span>SIM</span>
                  <span className={simRunning ? 'text-[#00fbfb]' : 'text-[#a7a7a7]'}>{simRunning ? `LIVE ${simSpeed}x` : 'PAUSED'}</span>
                </div>
              </div>
            </div>
            <div className="transitos-alert-rails">
              <div className="transitos-alert-head">{tr.controls.alertRails}</div>
              <div className="transitos-alert-list">
                {alerts.map((alert) => (
                  <article key={alert.id} className={`transitos-alert-item ${alert.level}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="transitos-alert-type">{alert.type}</span>
                      <span className="text-[10px] text-[#8c8c8c]">{alert.timeAgo}</span>
                    </div>
                    <h4>{alert.title}</h4>
                    <p>{alert.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="transitos-table-wrap">
            <div className="transitos-table-controls">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
                  {tr.controls.allLive} ({counts.all})
                </button>
                <button type="button" className={`filter-btn ${statusFilter === 'in_transit' ? 'active soft' : 'soft'}`} onClick={() => setStatusFilter('in_transit')}>
                  {tr.controls.inTransit} ({counts.in_transit})
                </button>
                <button type="button" className={`filter-btn ${statusFilter === 'delayed' ? 'active warn' : 'warn'}`} onClick={() => setStatusFilter('delayed')}>
                  {tr.controls.delayed} ({counts.delayed})
                </button>
                <button type="button" className={`filter-btn ${statusFilter === 'offline' ? 'active ghost' : 'ghost'}`} onClick={() => setStatusFilter('offline')}>
                  {tr.controls.offline} ({counts.offline})
                </button>
              </div>
              <div className="transitos-right-controls">
                <select aria-label={tr.controls.sortBy} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="eta">{tr.controls.sortBy}: ETA</option>
                  <option value="priority">{tr.controls.sortBy}: Priority</option>
                  <option value="status">{tr.controls.sortBy}: Status</option>
                </select>
                <div className="transitos-search inline-flex md:hidden">
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr.controls.search} />
                </div>
              </div>
            </div>

            <div className="transitos-table-scroller" role="region" aria-label="shipments table">
              <table className="transitos-table">
                <thead>
                  <tr>
                    <th>{tr.table.status}</th>
                    <th>{tr.table.shipment}</th>
                    <th>{tr.table.route}</th>
                    <th>{tr.table.eta}</th>
                    <th>{tr.table.driver}</th>
                    <th>{tr.table.priority}</th>
                    <th>{tr.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} onClick={() => { setSelectedId(shipment.id); setDrawerOpen(true); }} className={shipment.id === selectedShipment?.id ? 'is-selected' : ''}>
                      <td><span className={`status-dot ${statusClass(shipment.status)}`} /></td>
                      <td className="mono">{shipment.id}</td>
                      <td>{shipment.origin} <span className="text-[#666]">-&gt;</span> {shipment.destination}</td>
                      <td className={shipment.status === 'delayed' ? 'warn-text' : ''}>{shipment.etaLabel}{shipment.etaDeltaMinutes > 0 ? ` (+${shipment.etaDeltaMinutes}m)` : ''}</td>
                      <td>{shipment.driver}</td>
                      <td className="uppercase text-[11px]">{shipment.priority}</td>
                      <td>
                        <button type="button" className="transitos-row-btn" onClick={(e) => { e.stopPropagation(); setSelectedId(shipment.id); setDrawerOpen(true); }}>
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredShipments.length === 0 && <p className="p-4 text-[12px] text-[#9b9b9b]">{tr.table.none}</p>}
            </div>
            <div className="transitos-table-foot">
              <span>{tr.controls.allLive}: {totalVisible}</span>
              <span>{tr.controls.inTransit}: {inTransitVisible}</span>
              <span>{tr.controls.delayed}: {delayedVisible}</span>
              <span>{tr.controls.offline}: {offlineVisible}</span>
            </div>
          </section>
        </main>
      </div>

      <ShipmentDrawer shipment={selectedShipment} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export default function LogisticsPage() {
  return (
    <LogisticsThemeProvider>
      <LogisticsLangProvider>
        <LogisticsShell />
      </LogisticsLangProvider>
    </LogisticsThemeProvider>
  );
}
