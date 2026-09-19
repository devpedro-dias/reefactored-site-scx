import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HOME_PORT, PORTS } from '../../data/ports';

type Three = typeof import('three');

/**
 * Cores da cena.
 *
 * O globo é escuro nos dois temas, por decisão de projeto: ele é a peça
 * luminosa da página e os arcos só brilham sobre fundo escuro. No tema
 * claro ele vira um orbe que contrasta com a superfície pálida.
 */
const PALETTE = {
  core: 0x07202a,
  graticule: 0x31859b,
  graticuleOpacity: 0.26,
  equator: 0x7cc4b4,
  port: 0x7cc4b4,
  hub: 0x7cc4b4,
  arcWarm: 0x7cc4b4,
  arcCool: 0x46a7c0,
  pulse: 0xffffff,
};

/** Um arco em trânsito entre o porto-sede e um destino. */
interface Arc {
  line: any;
  pulse: any;
  segments: number;
  /** Posição no ciclo, em [0, 1). */
  t: number;
  speed: number;
  curvePoints: Float32Array;
}

/**
 * Globo de navegação do hero.
 *
 * A retícula (meridianos e paralelos) é deliberada: o logo da SCX é um globo
 * de setas em órbita, e um globo de cartas náuticas é o instrumento que essa
 * marca descreve. Os arcos são rotas reais partindo de Santos.
 *
 * three.js entra por import dinâmico — nada dele pesa no bundle inicial, e a
 * cena só é montada quando o elemento aparece na viewport.
 */
@Component({
  selector: 'app-globe',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './globe.component.html',
  styleUrl: './globe.component.scss',
})
export class GlobeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

  /** Alterna para a arte estática quando o 3D não é apropriado ou falhou. */
  readonly useFallback = signal(false);
  readonly ready = signal(false);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  private three?: Three;
  private renderer?: any;
  private scene?: any;
  private camera?: any;
  private globe?: any;
  private arcs: Arc[] = [];


  private frameId = 0;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private disposed = false;
  private visible = false;

  // Rotação: alvo perseguido suavemente, para o arrasto ter inércia.
  private rotY = 0;
  private rotX = -0.18;
  private targetRotY = 0;
  private targetRotX = -0.18;
  private dragging = false;
  private lastPointer = { x: 0, y: 0 };
  private pointerId: number | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tooNarrow = window.innerWidth < 720;

    if (reduced || tooNarrow) {
      this.useFallback.set(true);
      return;
    }

    // Só monta a cena quando o hero realmente aparece.
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        this.visible = entry.isIntersecting;

        if (entry.isIntersecting && !this.three && !this.disposed) {
          void this.boot();
        }
      },
      { rootMargin: '200px' },
    );
    this.intersectionObserver.observe(this.hostRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.disposed = true;
    this.teardown();
  }

  // -----------------------------------------------------------------
  //  Boot
  // -----------------------------------------------------------------

  private async boot(): Promise<void> {
    let THREE: Three;
    try {
      THREE = await import('three');
    } catch {
      // Sem three.js, a arte estática assume — o hero nunca fica vazio.
      this.zone.run(() => this.useFallback.set(true));
      return;
    }

    if (this.disposed) return;
    this.three = THREE;

    const host = this.hostRef.nativeElement;
    const { clientWidth: w, clientHeight: h } = host;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    renderer.domElement.classList.add('globe__canvas');
    host.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0, 3.35);
    this.camera = camera;

    const globe = new THREE.Group();
    // Inclinação axial — o planeta não fica em pé, e o globo tampouco.
    globe.rotation.z = 0.41;
    scene.add(globe);
    this.globe = globe;

    this.buildSphere(THREE, globe);
    this.buildGraticule(THREE, globe);
    this.buildPorts(THREE, globe);
    this.buildArcs(THREE, globe);

    this.attachPointer(host);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(host);

    this.zone.run(() => this.ready.set(true));

    // Fora do Angular: 60fps não deve disparar detecção de mudanças.
    this.zone.runOutsideAngular(() => this.loop());
  }

  // -----------------------------------------------------------------
  //  Geometria
  // -----------------------------------------------------------------

  /**
   * Esfera opaca — oculta a retícula do hemisfério de trás e dá profundidade.
   *
   * Sem halo atmosférico: a casca de brilho precisava de raio ~1.14 e a
   * meia-altura visível do enquadramento é 1.153 — folga de 3px num canvas
   * de 600px. O brilho encostava nas bordas e era recortado num retângulo
   * bem visível. Afastar a câmera encolheria o globo, então o halo saiu:
   * a silhueta limpa lê melhor nos dois temas.
   */
  private buildSphere(THREE: Three, parent: any): void {
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.995, 64, 48),
      new THREE.MeshBasicMaterial({ color: PALETTE.core }),
    );
    parent.add(core);
  }

  /** Meridianos e paralelos a cada 20° — a cara de um globo de carta náutica. */
  private buildGraticule(THREE: Three, parent: any): void {
    const r = 1.001;
    const positions: number[] = [];

    const push = (lat: number, lng: number) => {
      const v = this.toVector(THREE, lat, lng, r);
      positions.push(v.x, v.y, v.z);
    };

    // Meridianos
    for (let lng = -180; lng < 180; lng += 20) {
      for (let lat = -90; lat < 90; lat += 3) {
        push(lat, lng);
        push(lat + 3, lng);
      }
    }

    // Paralelos
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = -180; lng < 180; lng += 3) {
        push(lat, lng);
        push(lat, lng + 3);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );

        parent.add(
      new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({
          color: PALETTE.graticule,
          transparent: true,
          opacity: PALETTE.graticuleOpacity,
        }),
      ),
    );

    // Equador destacado — a única linha que o olho deve encontrar sozinha.
    const equator: number[] = [];
    for (let lng = -180; lng < 180; lng += 2) {
      const a = this.toVector(THREE, 0, lng, 1.003);
      const b = this.toVector(THREE, 0, lng + 2, 1.003);
      equator.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const eqGeo = new THREE.BufferGeometry();
    eqGeo.setAttribute('position', new THREE.Float32BufferAttribute(equator, 3));
    parent.add(
      new THREE.LineSegments(
        eqGeo,
        new THREE.LineBasicMaterial({
          color: PALETTE.equator,
          transparent: true,
          opacity: 0.55,
        }),
      ),
    );
  }

  /** Marcadores dos portos; Santos ganha um anel para se distinguir. */
  private buildPorts(THREE: Three, parent: any): void {
    const dotGeo = new THREE.SphereGeometry(0.012, 12, 12);
    const dotMat = new THREE.MeshBasicMaterial({ color: PALETTE.port });

    for (const port of PORTS) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(this.toVector(THREE, port.lat, port.lng, 1.01));
      parent.add(dot);
    }

    const home = this.toVector(THREE, HOME_PORT.lat, HOME_PORT.lng, 1.012);

    const hub = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 16, 16),
      new THREE.MeshBasicMaterial({ color: PALETTE.hub }),
    );
    hub.position.copy(home);
    parent.add(hub);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.038, 0.046, 48),
      new THREE.MeshBasicMaterial({
        color: PALETTE.hub,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      }),
    );
    ring.position.copy(home);
    ring.lookAt(0, 0, 0);
    parent.add(ring);
  }

  /** Um arco por destino, com um cometa percorrendo a rota. */
  private buildArcs(THREE: Three, parent: any): void {
        const start = this.toVector(THREE, HOME_PORT.lat, HOME_PORT.lng, 1.01);
    const segments = 128;

    PORTS.forEach((port, index) => {
      const end = this.toVector(THREE, port.lat, port.lng, 1.01);

      // Altura proporcional à distância: rotas longas sobem mais.
      const angle = start.angleTo(end);
      const lift = 1 + 0.12 + (angle / Math.PI) * 0.42;

      const c1 = start.clone().lerp(end, 0.25).normalize().multiplyScalar(lift);
      const c2 = start.clone().lerp(end, 0.75).normalize().multiplyScalar(lift);
      const curve = new THREE.CubicBezierCurve3(start, c1, c2, end);
      const points = curve.getPoints(segments);

      const warm = index % 3 === 0;
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: warm ? PALETTE.arcWarm : PALETTE.arcCool,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      geometry.setDrawRange(0, 0);
      parent.add(line);

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.016, 10, 10),
        new THREE.MeshBasicMaterial({
          color: PALETTE.pulse,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      pulse.visible = false;
      parent.add(pulse);

      // Defasagem por razão áurea: o tráfego fica escalonado, nunca em bloco.
      const phase = (index * 0.6180339887) % 1;

      this.arcs.push({
        line,
        pulse,
        segments,
        t: phase,
        speed: 0.055 + (index % 4) * 0.012,
        curvePoints: new Float32Array(
          points.flatMap((p: any) => [p.x, p.y, p.z]),
        ),
      });
    });
  }

  /** Converte lat/lng em posição na esfera de raio `r`. */
  private toVector(THREE: Three, lat: number, lng: number, r: number): any {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    );
  }

  // -----------------------------------------------------------------
  //  Loop
  // -----------------------------------------------------------------

  private loop = (): void => {
    if (this.disposed) return;
    this.frameId = requestAnimationFrame(this.loop);

    // Fora da viewport não há o que animar — poupa bateria.
    if (!this.visible) return;

    if (!this.dragging) {
      this.targetRotY += 0.0016;
    }

    // Perseguição suave: dá peso ao arrasto e suaviza a soltura.
    this.rotY += (this.targetRotY - this.rotY) * 0.06;
    this.rotX += (this.targetRotX - this.rotX) * 0.06;

    if (this.globe) {
      this.globe.rotation.y = this.rotY;
      this.globe.rotation.x = this.rotX;
    }

    const tailLength = 0.28;

    for (const arc of this.arcs) {
      arc.t = (arc.t + arc.speed * 0.016) % 1;

      const head = arc.t;
      const tail = Math.max(0, head - tailLength);

      const startIdx = Math.floor(tail * arc.segments);
      const count = Math.max(0, Math.floor((head - tail) * arc.segments));
      arc.line.geometry.setDrawRange(startIdx, count);

      // Some perto das pontas do ciclo: a rota "chega" em vez de piscar.
      const fade = Math.sin(Math.min(head / 0.12, 1) * Math.PI * 0.5);
      arc.line.material.opacity = 0.85 * fade;

      const idx = Math.min(
        Math.floor(head * arc.segments) * 3,
        arc.curvePoints.length - 3,
      );
      arc.pulse.position.set(
        arc.curvePoints[idx],
        arc.curvePoints[idx + 1],
        arc.curvePoints[idx + 2],
      );
      arc.pulse.visible = count > 0;
      arc.pulse.material.opacity = 0.9 * fade;
    }

    this.renderer?.render(this.scene, this.camera);
  };

  // -----------------------------------------------------------------
  //  Interação
  // -----------------------------------------------------------------

  private attachPointer(host: HTMLElement): void {
    host.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }

  private onPointerDown = (event: PointerEvent): void => {
    this.dragging = true;
    this.pointerId = event.pointerId;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.hostRef.nativeElement.classList.add('is-grabbing');
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging || event.pointerId !== this.pointerId) return;

    const dx = event.clientX - this.lastPointer.x;
    const dy = event.clientY - this.lastPointer.y;
    this.lastPointer = { x: event.clientX, y: event.clientY };

    this.targetRotY += dx * 0.005;
    // Trava a inclinação: o globo nunca capota.
    this.targetRotX = Math.max(
      -0.85,
      Math.min(0.85, this.targetRotX + dy * 0.005),
    );
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    this.dragging = false;
    this.pointerId = null;
    this.hostRef.nativeElement.classList.remove('is-grabbing');
  };

  private onResize(): void {
    if (!this.renderer || !this.camera) return;
    const { clientWidth: w, clientHeight: h } = this.hostRef.nativeElement;
    if (w === 0 || h === 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  // -----------------------------------------------------------------
  //  Limpeza
  // -----------------------------------------------------------------

  private teardown(): void {
    cancelAnimationFrame(this.frameId);

    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();

    const host = this.hostRef?.nativeElement;
    host?.removeEventListener('pointerdown', this.onPointerDown);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      window.removeEventListener('pointercancel', this.onPointerUp);
    }

    // Descarte explícito: sem isso o contexto WebGL vaza entre navegações.
    this.scene?.traverse((object: any) => {
      object.geometry?.dispose?.();
      const material = object.material;
      if (Array.isArray(material)) {
        material.forEach((m: any) => m.dispose?.());
      } else {
        material?.dispose?.();
      }
    });

    this.renderer?.dispose();
    this.renderer?.domElement?.remove();

    this.arcs = [];
    this.scene = undefined;
    this.camera = undefined;
    this.globe = undefined;
    this.renderer = undefined;
    this.three = undefined;
  }
}
