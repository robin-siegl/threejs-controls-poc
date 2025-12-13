import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { App } from './App';
import type { Editor } from './Editor';
import * as THREE from 'three';

export class ThreeMgr {
  /** Editor Reference */
  private editor: Editor;

  /** Three Scene */
  private scene: THREE.Scene;
  /** Three Renderer */
  private renderer: THREE.WebGLRenderer;

  /** Three Camera */
  private camera: THREE.OrthographicCamera;
  /** Three OrbitControls */
  private orbit: OrbitControls;

  /** Resize Handler reference */
  private onResizeHandler = this.onResize.bind(this);

  constructor(editor: Editor) {
    // Assign Editor Reference
    this.editor = editor;

    // Scene Setup
    this.scene = new THREE.Scene();

    // Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    App.Container.appendChild(this.renderer.domElement);

    // Directional Light Setup
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(30, 60, 30);
    this.scene.add(dir);

    // Camera Setup
    const frustumSize = 60;
    const aspect = window.innerWidth / window.innerHeight;

    this.camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      -1000,
      1000
    );

    this.camera.position.set(0, 200, 0);
    this.camera.lookAt(0, 0, 0);
    this.camera.up.set(0, 0, -1);

    // OrbitControls Setup
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableRotate = false;
    this.orbit.enablePan = true;
    this.orbit.enableZoom = true;
    this.orbit.screenSpacePanning = true;
    this.orbit.zoomSpeed = 1.2;
    this.orbit.panSpeed = 1.0;
    this.orbit.target.set(0, 0, 0);
    this.orbit.update();

    // Add Eventlistener
    window.addEventListener('resize', this.onResizeHandler);

    this.animate();
  }

  /**
   * Three Animation Loop
   */
  private animate() {
    this.orbit.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Window Resize Handler
   */
  private onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 60;

    this.camera.left = (-frustumSize * aspect) / 2;
    this.camera.right = (frustumSize * aspect) / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = -frustumSize / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Get Three Scene
   */
  public get Scene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get Three WebGL Renderer
   */
  public get Renderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Get Three Perspective Camera
   */
  public get Camera(): THREE.OrthographicCamera {
    return this.camera;
  }

  /**
   * Get Three Orbit Controls
   */
  public get Orbit(): OrbitControls {
    return this.orbit;
  }

  /**
   * Cleanup Scene
   */
  public cleanup() {
    window.removeEventListener('resize', this.onResizeHandler);
    this.orbit.dispose();
    this.renderer.dispose();
  }
}
