import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  effect,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeOutBounce = (t: number): number => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};

interface RoadNode {
  x: number;
  y: number;
  adj: RoadEdge[];
  main: boolean;
}

interface RoadEdge {
  a: number;
  b: number;
  major: boolean;
  len: number;
  w: number;
}

interface Point {
  x: number;
  y: number;
}

interface BoundingBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

interface RoadPath {
  pts: Point[];
  cum: number[];
  total: number;
  real: number;
  bounds: BoundingBox;
}

interface TrafficParticle {
  e: RoadEdge;
  dir: number;
  s: number;
  v: number;
}

interface CameraState {
  x: number;
  y: number;
  z: number;
}

interface ActiveRoute {
  fromName: string;
  toName: string;
  fromNode: number;
  toNode: number;
  path: RoadPath;
  o: RoadNode;
  d: RoadNode;
  cam0: CameraState;
  camD: CameraState;
  camO: CameraState;
  fit: CameraState;
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  t: number;
  prog: number;
  infoShown: boolean;
  infoDone: boolean;
  km: number;
  t0: number;
}

interface KnownPlace {
  name: string;
  en: string;
  nx: number;
  ny: number;
  node: number;
}

function mulberry32(a: number): () => number {
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss']
})
export class RouteMapComponent implements OnInit, OnDestroy {
  // Input signals
  readonly from = input<string>('');
  readonly to = input<string>('');
  readonly vehicle = input<string>('bus');
  readonly distanceKm = input<number | null>(null);
  readonly durationMinutes = input<number | null>(null);
  readonly fareAmount = input<number | null>(null);
  readonly fareDisplayBn = input<string>('');
  readonly replayTrigger = input<number>(0);

  @ViewChild('stage', { static: true }) stageRef!: ElementRef<HTMLElement>;
  @ViewChild('mapCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // UI state signals
  readonly isRouteActive = signal<boolean>(false);
  readonly isInfoShown = signal<boolean>(false);
  readonly displayFrom = signal<string>('');
  readonly displayTo = signal<string>('');
  readonly displayKm = signal<string>('—');
  readonly displayDuration = signal<string>('—');
  readonly displayFare = signal<string>('—');

  readonly vehicleNameBn = computed(() => {
    const v = (this.vehicle() || 'bus').toLowerCase();
    switch (v) {
      case 'bus': return 'বাস';
      case 'rickshaw': return 'রিকশা';
      case 'cng': return 'সিএনজি';
      case 'bike': return 'বাইক';
      default: return 'বাস';
    }
  });

  readonly canvasAriaLabel = computed(() => {
    const f = this.displayFrom();
    const t = this.displayTo();
    if (this.isRouteActive() && f && t) {
      return `${f} থেকে ${t} রুটের অ্যানিমেটেড ম্যাপ`;
    }
    return 'শহরের রাস্তার অ্যানিমেটেড ম্যাপ';
  });

  readonly ariaLabel = computed(() => {
    const f = this.displayFrom();
    const t = this.displayTo();
    return this.isRouteActive() && f && t ? `রুট ম্যাপ: ${f} থেকে ${t}` : 'রুট ম্যাপ';
  });

  // Road graph & canvas state
  private readonly COLS = 30;
  private readonly ROWS = 22;
  private readonly S = 130;
  private readonly WW = (this.COLS - 1) * this.S;
  private readonly WH = (this.ROWS - 1) * this.S;
  private readonly M_PER_UNIT = 7.5;

  private nodes: RoadNode[] = [];
  private edges: RoadEdge[] = [];
  private mainNodes: number[] = [];
  private minorPath!: Path2D;
  private majorPath!: Path2D;
  private particles: TrafficParticle[] = [];
  private places: KnownPlace[] = [];

  private ctx: CanvasRenderingContext2D | null = null;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private cam: CameraState = { x: 0, y: 0, z: 0.62 };
  private run: ActiveRoute | null = null;
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private lastTime = 0;
  private reduceMotion = false;

  private lastTriggeredFrom = '';
  private lastTriggeredTo = '';
  private lastReplayValue = 0;

  constructor() {
    // Watch from & to input changes
    effect(() => {
      const f = this.from()?.trim() || '';
      const t = this.to()?.trim() || '';
      const replay = this.replayTrigger();

      if (f && t && f.toLowerCase() !== t.toLowerCase()) {
        const isReplay = replay !== this.lastReplayValue;
        const isNewRoute = f !== this.lastTriggeredFrom || t !== this.lastTriggeredTo;

        if (isNewRoute || isReplay) {
          this.lastTriggeredFrom = f;
          this.lastTriggeredTo = t;
          this.lastReplayValue = replay;
          this.startRun(f, t);
        }
      } else {
        if (this.run) {
          this.resetRoute();
        }
        this.lastTriggeredFrom = '';
        this.lastTriggeredTo = '';
      }
    });

    // Watch vehicle and result changes without replaying animation
    effect(() => {
      this.vehicle();
      this.fareAmount();
      this.distanceKm();
      this.durationMinutes();
      this.fareDisplayBn();

      if (this.run && this.run.infoShown) {
        this.updateCountUp(1);
      }
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.reduceMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.initRoadNetwork();
    this.initCanvas();
  }

  ngOnDestroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /* ----------------- Road Graph Generation ----------------- */
  private initRoadNetwork(): void {
    const rnd = mulberry32(20261103);
    this.nodes = [];
    this.edges = [];

    const idx = (c: number, r: number): number => r * this.COLS + c;

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        this.nodes.push({
          x: c * this.S + (rnd() - 0.5) * this.S * 0.42,
          y: r * this.S + (rnd() - 0.5) * this.S * 0.42,
          adj: [],
          main: false
        });
      }
    }

    const addEdge = (a: number, b: number, major: boolean): void => {
      const A = this.nodes[a];
      const B = this.nodes[b];
      const len = Math.hypot(A.x - B.x, A.y - B.y);
      const e: RoadEdge = { a, b, major, len, w: len * (major ? 0.55 : 1) };
      this.edges.push(e);
      A.adj.push(e);
      B.adj.push(e);
    };

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const mr = r % 5 === 2;
        const mc = c % 6 === 3;
        if (c < this.COLS - 1 && (mr || rnd() > 0.1)) addEdge(idx(c, r), idx(c + 1, r), mr);
        if (r < this.ROWS - 1 && (mc || rnd() > 0.1)) addEdge(idx(c, r), idx(c, r + 1), mc);
        if (c < this.COLS - 1 && r < this.ROWS - 1 && rnd() < 0.07)
          addEdge(idx(c, r), idx(c + 1, r + 1), false);
        if (c > 0 && r < this.ROWS - 1 && rnd() < 0.05)
          addEdge(idx(c, r), idx(c - 1, r + 1), false);
      }
    }

    // Major avenues
    for (let k = 0; k < 18; k++) addEdge(idx(2 + k, 1 + k), idx(3 + k, 2 + k), true);
    for (let k = 0; k < 17; k++) addEdge(idx(27 - k, 2 + k), idx(26 - k, 3 + k), true);

    // Connected component flood fill
    const q = [idx(15, 11)];
    this.nodes[q[0]].main = true;
    for (let i = 0; i < q.length; i++) {
      for (const e of this.nodes[q[i]].adj) {
        const v = e.a === q[i] ? e.b : e.a;
        if (!this.nodes[v].main) {
          this.nodes[v].main = true;
          q.push(v);
        }
      }
    }

    this.mainNodes = [];
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].main) this.mainNodes.push(i);
    }

    // Path2D cache for roads
    if (typeof Path2D !== 'undefined') {
      this.minorPath = new Path2D();
      this.majorPath = new Path2D();
      for (const e of this.edges) {
        const P = e.major ? this.majorPath : this.minorPath;
        const A = this.nodes[e.a];
        const B = this.nodes[e.b];
        P.moveTo(A.x, A.y);
        P.lineTo(B.x, B.y);
      }
    }

    // Known places
    const RAW_PLACES: [string, string, number, number][] = [
      ['মিরপুর ১০', 'mirpur 10', 0.33, 0.22],
      ['উত্তরা', 'uttara', 0.55, 0.07],
      ['গাবতলী', 'gabtoli', 0.13, 0.42],
      ['মোহাম্মদপুর', 'mohammadpur', 0.26, 0.53],
      ['ধানমন্ডি', 'dhanmondi', 0.38, 0.6],
      ['ফার্মগেট', 'farmgate', 0.46, 0.46],
      ['মহাখালী', 'mohakhali', 0.56, 0.32],
      ['বনানী', 'banani', 0.64, 0.28],
      ['গুলশান', 'gulshan', 0.71, 0.37],
      ['বসুন্ধরা', 'bashundhara', 0.87, 0.38],
      ['শাহবাগ', 'shahbag', 0.51, 0.57],
      ['আজিমপুর', 'azimpur', 0.42, 0.71],
      ['মতিঝিল', 'motijheel', 0.6, 0.67],
      ['কমলাপুর', 'kamalapur', 0.69, 0.75],
      ['যাত্রাবাড়ী', 'jatrabari', 0.8, 0.85],
      ['সায়েদাবাদ', 'sayedabad', 0.72, 0.93]
    ];

    const taken = new Set<number>();
    this.places = RAW_PLACES.map(([name, en, nx, ny]) => {
      const targetX = this.WW * (0.05 + nx * 0.9);
      const targetY = this.WH * (0.06 + ny * 0.88);
      let best = -1;
      let bd = Infinity;
      this.nodes.forEach((n, i) => {
        if (!n.main || taken.has(i)) return;
        const d = Math.pow(n.x - targetX, 2) + Math.pow(n.y - targetY, 2);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      taken.add(best);
      return { name, en, nx, ny, node: best };
    });

    // Traffic particles
    this.particles = Array.from({ length: 70 }, () => ({
      e: this.edges[(Math.random() * this.edges.length) | 0],
      dir: Math.random() < 0.5 ? 1 : -1,
      s: Math.random(),
      v: 90 + Math.random() * 150
    }));

    // Initial camera
    const c0 = this.idleCam(0);
    this.cam = { x: c0.x, y: c0.y, z: c0.z };
  }

  /* ----------------- Canvas Setup & Lifecycle ----------------- */
  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.resize();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.stageRef.nativeElement);
    }

    this.lastTime = performance.now() / 1000;
    this.animFrameId = requestAnimationFrame((ms) => this.loop(ms));
  }

  private resize(): void {
    const stage = this.stageRef?.nativeElement;
    const canvas = this.canvasRef?.nativeElement;
    if (!stage || !canvas) return;

    const r = stage.getBoundingClientRect();
    this.W = r.width || 600;
    this.H = r.height || 520;
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    canvas.width = Math.round(this.W * this.dpr);
    canvas.height = Math.round(this.H * this.dpr);

    if (this.run) {
      this.run.fit = this.computeFit(this.run.path.bounds);
    }
  }

  private loop(ms: number): void {
    const now = ms / 1000;
    const dt = Math.min(0.05, now - this.lastTime);
    this.lastTime = now;

    this.update(now, dt);
    this.draw(now);

    this.animFrameId = requestAnimationFrame((nextMs) => this.loop(nextMs));
  }

  /* ----------------- Pathfinding & Geometry ----------------- */
  private resolveNode(name: string, excludeNode?: number): { name: string; node: number } {
    const trimmed = name.trim().toLowerCase();
    const match = this.places.find(
      (p) =>
        p.name.toLowerCase() === trimmed ||
        p.en.toLowerCase() === trimmed ||
        trimmed.includes(p.name.toLowerCase()) ||
        trimmed.includes(p.en.toLowerCase())
    );
    if (match && match.node !== excludeNode) {
      return { name: name.trim(), node: match.node };
    }

    // Deterministic hash fallback
    const available =
      excludeNode !== undefined
        ? this.mainNodes.filter((i) => i !== excludeNode)
        : this.mainNodes;
    let hash = 5381;
    for (let i = 0; i < trimmed.length; i++) {
      hash = (hash << 5) + hash + trimmed.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % available.length;
    return { name: name.trim(), node: available[idx] };
  }

  private dijkstra(a: number, b: number): number[] {
    const n = this.nodes.length;
    const dist = new Float32Array(n).fill(Infinity);
    const prev = new Int32Array(n).fill(-1);
    const done = new Uint8Array(n);
    dist[a] = 0;

    for (;;) {
      let u = -1;
      let best = Infinity;
      for (let i = 0; i < n; i++) {
        if (!done[i] && dist[i] < best) {
          best = dist[i];
          u = i;
        }
      }
      if (u < 0 || u === b) break;
      done[u] = 1;
      for (const e of this.nodes[u].adj) {
        const v = e.a === u ? e.b : e.a;
        const nd = dist[u] + e.w;
        if (nd < dist[v]) {
          dist[v] = nd;
          prev[v] = u;
        }
      }
    }

    const ids: number[] = [];
    for (let v = b; v !== -1; v = prev[v]) ids.push(v);
    return ids.reverse();
  }

  private buildPath(ids: number[]): RoadPath {
    const P = ids.map((i) => this.nodes[i]);
    const pts: Point[] = [{ x: P[0].x, y: P[0].y }];

    for (let i = 1; i < P.length - 1; i++) {
      const a = P[i - 1];
      const b = P[i];
      const c = P[i + 1];
      const l1 = Math.hypot(b.x - a.x, b.y - a.y);
      const l2 = Math.hypot(c.x - b.x, c.y - b.y);
      const r1 = Math.min(0.42, 34 / Math.max(1, l1));
      const r2 = Math.min(0.42, 34 / Math.max(1, l2));
      const m1: Point = { x: b.x + (a.x - b.x) * r1, y: b.y + (a.y - b.y) * r1 };
      const m2: Point = { x: b.x + (c.x - b.x) * r2, y: b.y + (c.y - b.y) * r2 };
      pts.push(m1);
      for (let s = 1; s <= 8; s++) {
        const t = s / 8;
        const u = 1 - t;
        pts.push({
          x: u * u * m1.x + 2 * u * t * b.x + t * t * m2.x,
          y: u * u * m1.y + 2 * u * t * b.y + t * t * m2.y
        });
      }
    }

    const L = P[P.length - 1];
    pts.push({ x: L.x, y: L.y });

    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    }

    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const p of pts) {
      x0 = Math.min(x0, p.x);
      y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x);
      y1 = Math.max(y1, p.y);
    }

    let real = 0;
    for (let i = 1; i < ids.length; i++) {
      real += Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y);
    }

    return {
      pts,
      cum,
      total: cum[cum.length - 1],
      real,
      bounds: { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }
    };
  }

  private pointAt(path: RoadPath, L: number): Point {
    const { pts, cum } = path;
    if (L <= 0) return pts[0];
    if (L >= path.total) return pts[pts.length - 1];
    let i = 1;
    while (cum[i] < L) i++;
    const t = (L - cum[i - 1]) / (cum[i] - cum[i - 1]);
    return { x: lerp(pts[i - 1].x, pts[i].x, t), y: lerp(pts[i - 1].y, pts[i].y, t) };
  }

  private tracePath(p2d: Path2D, path: RoadPath, L: number): void {
    const { pts, cum } = path;
    p2d.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      if (cum[i] <= L) {
        p2d.lineTo(pts[i].x, pts[i].y);
      } else {
        const t = (L - cum[i - 1]) / (cum[i] - cum[i - 1]);
        p2d.lineTo(lerp(pts[i - 1].x, pts[i].x, t), lerp(pts[i - 1].y, pts[i].y, t));
        break;
      }
    }
  }

  /* ----------------- Camera Math ----------------- */
  private idleCam(t: number): CameraState {
    return {
      x: this.WW * 0.5 + Math.sin(t * 0.07) * this.WW * 0.17,
      y: this.WH * 0.5 + Math.cos(t * 0.05) * this.WH * 0.14,
      z: 0.62 + 0.05 * Math.sin(t * 0.09)
    };
  }

  private computeFit(b: BoundingBox): CameraState {
    const infoH = 110;
    const padX = Math.min(90, this.W * 0.12);
    const padTop = 64;
    const padBot = infoH + 44;
    const aw = Math.max(120, this.W - padX * 2);
    const ah = Math.max(120, this.H - padTop - padBot);
    const z = clamp(Math.min(aw / Math.max(b.w, 80), ah / Math.max(b.h, 80)), 0.2, 1.7);
    const sy = padTop + ah / 2;
    return { x: b.cx, y: b.cy - (sy - this.H / 2) / z, z };
  }

  private mixCam(a: CameraState, b: CameraState, k: number, arc: number): CameraState {
    return {
      x: lerp(a.x, b.x, k),
      y: lerp(a.y, b.y, k),
      z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), k) - arc * Math.sin(Math.PI * k))
    };
  }

  private camAt(t: number, R: ActiveRoute): CameraState {
    if (t < R.t1) {
      return this.mixCam(R.cam0, R.camD, easeInOutCubic(clamp(t / R.t1)), 0.5);
    }
    if (t < R.t2) {
      return {
        x: R.camD.x,
        y: R.camD.y,
        z: R.camD.z * (1 + (0.07 * (t - R.t1)) / (R.t2 - R.t1))
      };
    }
    if (t < R.t3) {
      return this.mixCam(
        { x: R.camD.x, y: R.camD.y, z: R.camD.z * 1.07 },
        R.camO,
        easeInOutCubic(clamp((t - R.t2) / (R.t3 - R.t2))),
        0.7
      );
    }
    const u = clamp((t - R.t3) / (R.t4 - R.t3));
    const head = this.pointAt(R.path, R.prog * R.path.total);
    const s = easeInOutCubic(u);
    const z = Math.exp(lerp(Math.log(R.camO.z), Math.log(R.fit.z), easeInOutSine(u)));
    const c = { x: lerp(head.x, R.fit.x, s), y: lerp(head.y, R.fit.y, s), z };
    if (u < 1) {
      const m = 70;
      const sx = this.W / 2 + (head.x - c.x) * z;
      const sy = this.H / 2 + (head.y - c.y) * z;
      if (sx < m) c.x -= (m - sx) / z;
      else if (sx > this.W - m) c.x += (sx - (this.W - m)) / z;
      if (sy < m) c.y -= (m - sy) / z;
      else if (sy > this.H - m) c.y += (sy - (this.H - m)) / z;
    }
    return c;
  }

  /* ----------------- Route Execution & State ----------------- */
  startRun(fromName: string, toName: string): void {
    this.resize();
    const fromLoc = this.resolveNode(fromName);
    const toLoc = this.resolveNode(toName, fromLoc.node);

    let ids = this.dijkstra(fromLoc.node, toLoc.node);
    if (ids.length < 2) {
      ids = [fromLoc.node, toLoc.node];
    }

    const path = this.buildPath(ids);
    const now = performance.now() / 1000;
    const o = this.nodes[fromLoc.node];
    const d = this.nodes[toLoc.node];

    const R: ActiveRoute = {
      fromName: fromLoc.name,
      toName: toLoc.name,
      fromNode: fromLoc.node,
      toNode: toLoc.node,
      path,
      o,
      d,
      cam0: { x: this.cam.x, y: this.cam.y, z: this.cam.z },
      camD: { x: d.x, y: d.y, z: 1.9 },
      camO: { x: o.x, y: o.y, z: 1.6 },
      fit: this.computeFit(path.bounds),
      t1: 0.95,
      t2: 1.6,
      t3: 2.6,
      t4: 5.2,
      t: 0,
      prog: 0,
      infoShown: false,
      infoDone: false,
      km: (path.real * this.M_PER_UNIT) / 1000,
      t0: now
    };

    if (this.reduceMotion) {
      R.t0 = now - 20; // Jump straight to completed state
    }

    this.run = R;
    this.displayFrom.set(fromLoc.name);
    this.displayTo.set(toLoc.name);
    this.isRouteActive.set(true);
    this.isInfoShown.set(false);

    if (this.reduceMotion) {
      this.isInfoShown.set(true);
      this.updateCountUp(1);
    }
  }

  resetRoute(): void {
    this.run = null;
    this.isRouteActive.set(false);
    this.isInfoShown.set(false);
    this.displayFrom.set('');
    this.displayTo.set('');
    this.displayKm.set('—');
    this.displayDuration.set('—');
    this.displayFare.set('—');
  }

  private toBn(val: string | number): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(val).replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
  }

  private formatMinutesBn(minutes: number): string {
    if (minutes < 60) {
      return `${this.toBn(minutes)} মিনিট`;
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${this.toBn(h)} ঘণ্টা ${this.toBn(m)} মিনিট`;
  }

  private updateCountUp(k: number): void {
    // 1. Distance
    const targetKm = this.distanceKm();
    if (targetKm !== null && targetKm !== undefined) {
      const val = (targetKm * k).toFixed(1);
      this.displayKm.set(`${this.toBn(val)} কিমি`);
    } else if (this.run) {
      const val = (this.run.km * k).toFixed(1);
      this.displayKm.set(`${this.toBn(val)} কিমি`);
    } else {
      this.displayKm.set('—');
    }

    // 2. Duration
    const targetDuration = this.durationMinutes();
    if (targetDuration !== null && targetDuration !== undefined) {
      const m = Math.max(1, Math.round(targetDuration * k));
      this.displayDuration.set(this.formatMinutesBn(m));
    } else if (this.run) {
      const m = Math.max(3, Math.round((this.run.km / 18) * 60 * k));
      this.displayDuration.set(this.formatMinutesBn(m));
    } else {
      this.displayDuration.set('—');
    }

    // 3. Fare
    const targetFare = this.fareAmount();
    if (targetFare !== null && targetFare !== undefined) {
      const f = Math.round(targetFare * k);
      this.displayFare.set(`৳ ${this.toBn(f)}`);
    } else if (k >= 1 && this.fareDisplayBn()) {
      this.displayFare.set(this.fareDisplayBn());
    } else {
      this.displayFare.set('—');
    }
  }

  /* ----------------- Update Loop ----------------- */
  private update(now: number, dt: number): void {
    if (!this.reduceMotion) {
      for (const p of this.particles) {
        this.stepParticle(p, dt);
      }
    }

    if (this.run) {
      const R = this.run;
      const t = now - R.t0;
      R.t = t;
      R.prog = t < R.t3 ? 0 : easeInOutCubic(clamp((t - R.t3) / (R.t4 - R.t3)));
      const c = t >= R.t4 ? R.fit : this.camAt(t, R);
      this.cam.x = c.x;
      this.cam.y = c.y;
      this.cam.z = c.z;

      if (t > R.t4 + 0.1) {
        if (!R.infoShown) {
          R.infoShown = true;
          this.isInfoShown.set(true);
        }
        const k = easeInOutCubic(clamp((t - R.t4 - 0.1) / 0.9));
        if (k < 1) {
          this.updateCountUp(k);
        } else if (!R.infoDone) {
          R.infoDone = true;
          this.updateCountUp(1);
        }
      }
    } else {
      const tg = this.idleCam(now);
      const a = 1 - Math.exp(-dt * 1.8);
      this.cam.x += (tg.x - this.cam.x) * a;
      this.cam.y += (tg.y - this.cam.y) * a;
      this.cam.z = Math.exp(lerp(Math.log(this.cam.z), Math.log(tg.z), a));
    }
  }

  private stepParticle(p: TrafficParticle, dt: number): void {
    p.s += (p.v * dt) / p.e.len;
    if (p.s >= 1) {
      const n = p.dir > 0 ? p.e.b : p.e.a;
      const adj = this.nodes[n].adj;
      let e2 = adj[(Math.random() * adj.length) | 0];
      if (adj.length > 1 && e2 === p.e) {
        e2 = adj[(Math.random() * adj.length) | 0];
      }
      p.e = e2;
      p.dir = e2.a === n ? 1 : -1;
      p.s = 0;
    }
  }

  /* ----------------- Canvas Rendering ----------------- */
  private toScreen(p: Point): Point {
    return {
      x: this.W / 2 + (p.x - this.cam.x) * this.cam.z,
      y: this.H / 2 + (p.y - this.cam.y) * this.cam.z
    };
  }

  private reveal(n: RoadNode, rgb: string, amt: number): void {
    if (!this.ctx || amt < 0.02) return;
    const z = this.cam.z;
    const R = (230 + 110 * Math.min(amt, 1)) / z;
    const g = this.ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, R);
    g.addColorStop(0, `rgba(${rgb},${Math.min(0.95, 0.9 * amt)})`);
    g.addColorStop(0.35, `rgba(${rgb},${0.4 * amt})`);
    g.addColorStop(1, `rgba(${rgb},0)`);

    this.ctx.strokeStyle = g;
    this.ctx.lineWidth = 1.5 / z;
    this.ctx.stroke(this.minorPath);
    this.ctx.lineWidth = 2.6 / z;
    this.ctx.stroke(this.majorPath);
  }

  private drawLight(sp: Point, amt: number, now: number): void {
    if (!this.ctx || amt < 0.02) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const R = 70 + 120 * amt;
    let g = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, R);
    g.addColorStop(0, `rgba(255,255,255,${0.95 * amt})`);
    g.addColorStop(0.18, `rgba(255,250,235,${0.55 * amt})`);
    g.addColorStop(0.5, `rgba(255,240,210,${0.14 * amt})`);
    g.addColorStop(1, 'rgba(255,240,210,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, R, 0, TAU);
    ctx.fill();

    const bh = 280 * amt;
    g = ctx.createLinearGradient(0, sp.y, 0, sp.y - bh);
    g.addColorStop(0, `rgba(255,255,255,${0.75 * amt})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(sp.x - 6, sp.y);
    ctx.lineTo(sp.x - 1.6, sp.y - bh);
    ctx.lineTo(sp.x + 1.6, sp.y - bh);
    ctx.lineTo(sp.x + 6, sp.y);
    ctx.fill();

    g = ctx.createLinearGradient(0, sp.y, 0, sp.y - bh * 0.8);
    g.addColorStop(0, `rgba(255,245,225,${0.22 * amt})`);
    g.addColorStop(1, 'rgba(255,245,225,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(sp.x - 26, sp.y);
    ctx.lineTo(sp.x - 7, sp.y - bh * 0.8);
    ctx.lineTo(sp.x + 7, sp.y - bh * 0.8);
    ctx.lineTo(sp.x + 26, sp.y);
    ctx.fill();

    const fl = 190 * amt;
    g = ctx.createLinearGradient(sp.x - fl, 0, sp.x + fl, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, `rgba(255,255,255,${0.9 * amt})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(sp.x - fl, sp.y - 1, fl * 2, 2);

    for (let i = 0; i < 2; i++) {
      const ph = (now * 0.7 + i * 0.5) % 1;
      const r = 12 + ph * 120 * Math.min(amt, 1);
      ctx.strokeStyle = `rgba(255,255,255,${(1 - ph) * 0.5 * Math.min(amt, 1)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, r, r * 0.45, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawOrigin(sp: Point, k: number, now: number): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.save();
    for (let i = 0; i < 2; i++) {
      const ph = (now * 0.8 + i * 0.5) % 1;
      const r = 10 + ph * 36;
      ctx.strokeStyle = `rgba(255,106,26,${(1 - ph) * 0.65 * k})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, r, r * 0.55, 0, 0, TAU);
      ctx.stroke();
    }
    const s = easeOutBack(clamp(k));
    ctx.shadowColor = 'rgba(255,106,26,.9)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, 10 * s, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff6a1a';
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, 6.5 * s, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  private drawPin(sp: Point, k: number): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const b = easeOutBounce(clamp(k));
    const off = -(1 - b) * 110;
    ctx.save();
    ctx.translate(sp.x, sp.y);
    ctx.globalAlpha = clamp(k * 1.6);
    ctx.fillStyle = 'rgba(0,0,0,.6)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11 * (0.6 + 0.4 * b), 4.5 * (0.6 + 0.4 * b), 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.translate(0, off);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-6, -10, -17, -19, -17, -31);
    ctx.arc(0, -31, 17, Math.PI, 0, false);
    ctx.bezierCurveTo(17, -19, 6, -10, 0, 0);
    ctx.closePath();

    const g = ctx.createLinearGradient(0, -48, 0, 0);
    g.addColorStop(0, '#ff9a52');
    g.addColorStop(1, '#ff5a0a');
    ctx.shadowColor = 'rgba(255,106,26,.8)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = g;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -31, 6.5, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  private drawChip(x: number, y: number, text: string, dot: string, alpha: number): void {
    if (!this.ctx || alpha < 0.02) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.font = '600 14px "Baloo Da 2", system-ui, sans-serif';
    const w = ctx.measureText(text).width + 36;
    const h = 30;
    const cx = clamp(x, w / 2 + 10, this.W - w / 2 - 10);
    const cy = Math.max(y, 46);
    const rx = cx - w / 2;
    const ry = cy - h / 2;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(8,14,13,.85)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, w, h, 15);
    else ctx.rect(rx, ry, w, h);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = dot;
    ctx.beginPath();
    ctx.arc(rx + 15, cy, 4.5, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(text, rx + 27, cy + 1);
    ctx.restore();
  }

  private draw(now: number): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const z = this.cam.z;

    // Reset transform for background
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    const bg = ctx.createRadialGradient(
      this.W * 0.5,
      this.H * 0.45,
      0,
      this.W * 0.5,
      this.H * 0.45,
      Math.max(this.W, this.H) * 0.75
    );
    bg.addColorStop(0, '#08130f');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.W, this.H);

    // World transform for road network
    ctx.setTransform(
      this.dpr * z,
      0,
      0,
      this.dpr * z,
      this.dpr * (this.W / 2 - this.cam.x * z),
      this.dpr * (this.H / 2 - this.cam.y * z)
    );
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1.1 / z;
    ctx.strokeStyle = 'rgba(40,120,102,.30)';
    ctx.stroke(this.minorPath);
    ctx.lineWidth = 2.4 / z;
    ctx.strokeStyle = 'rgba(58,160,136,.50)';
    ctx.stroke(this.majorPath);

    const R = this.run;
    let t = 0;
    let aO = 0;
    let aD = 0;

    if (R) {
      t = R.t;
      const late = t > R.t4 ? clamp((t - R.t4) / 1.2) : 0;
      aD = clamp(
        (easeInOutSine(clamp((t - 0.3) / 0.55)) * 0.85 +
          Math.exp(-Math.pow((t - 0.9) / 0.16, 2)) * 0.5) *
          lerp(1, 0.5, late),
        0,
        1.2
      );
      aO = easeInOutSine(clamp((t - R.t2 - 0.1) / 0.6)) * lerp(1, 0.6, late);

      ctx.globalCompositeOperation = 'lighter';
      this.reveal(R.o, '255,140,70', aO);
      this.reveal(R.d, '255,255,255', aD);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Ambient traffic lights
    for (const p of this.particles) {
      const A = this.nodes[p.e.a];
      const B = this.nodes[p.e.b];
      const k = p.dir > 0 ? p.s : 1 - p.s;
      const x = lerp(A.x, B.x, k);
      const y = lerp(A.y, B.y, k);
      ctx.fillStyle = 'rgba(255,201,60,.16)';
      ctx.beginPath();
      ctx.arc(x, y, 4.5 / z, 0, TAU);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,236,176,.9)';
      ctx.beginPath();
      ctx.arc(x, y, 1.5 / z, 0, TAU);
      ctx.fill();
    }

    // Glowing route line
    if (R && R.prog > 0) {
      const L = R.path.total * R.prog;
      const rp = new Path2D();
      this.tracePath(rp, R.path, L);

      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,106,26,.16)';
      ctx.lineWidth = 22 / z;
      ctx.stroke(rp);
      ctx.strokeStyle = 'rgba(255,106,26,.38)';
      ctx.lineWidth = 9 / z;
      ctx.stroke(rp);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#ff8a3d';
      ctx.lineWidth = 3.6 / z;
      ctx.stroke(rp);

      if (R.prog >= 0.999) {
        ctx.setLineDash([16 / z, 30 / z]);
        ctx.lineDashOffset = (-now * 80) / z;
        ctx.strokeStyle = 'rgba(255,255,255,.92)';
        ctx.lineWidth = 2 / z;
        ctx.stroke(rp);
        ctx.setLineDash([]);
      } else {
        const h = this.pointAt(R.path, L);
        const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 26 / z);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.25, 'rgba(255,230,190,.7)');
        g.addColorStop(1, 'rgba(255,140,60,0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 26 / z, 0, TAU);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    // Screen-space overlay (pins, beams, name chips)
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Background place labels when zoomed in
    if (z > 0.4) {
      const a = clamp((z - 0.4) / 0.4) * (R ? 0.3 : 0.55);
      ctx.font = '600 13px "Baloo Da 2", system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      for (const p of this.places) {
        if (R && (p.node === R.fromNode || p.node === R.toNode)) continue;
        const s = this.toScreen(this.nodes[p.node]);
        if (s.x < -80 || s.x > this.W + 80 || s.y < -20 || s.y > this.H + 20) continue;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, TAU);
        ctx.fill();
        ctx.fillText(p.name, s.x + 8, s.y + 1);
      }
    }

    if (R) {
      const so = this.toScreen(R.o);
      const sd = this.toScreen(R.d);

      this.drawLight(sd, aD, now);

      const ko = clamp((t - R.t2 - 0.3) / 0.5);
      if (ko > 0) {
        this.drawOrigin(so, ko, now);
        this.drawChip(so.x, so.y - 32, R.fromName, '#ff6a1a', clamp((ko - 0.5) * 2));
      }

      const kp = clamp((t - (R.t4 - 0.2)) / 0.6);
      if (kp > 0) {
        this.drawPin(sd, kp);
        this.drawChip(sd.x, sd.y - 76, R.toName, '#ffffff', clamp((kp - 0.8) * 5));
      }
    }
  }
}
