import { TransformControls } from 'three/addons/controls/TransformControls.js';
import type { Editor } from './Editor';
import * as THREE from 'three';
import type { EditorObject } from './EditorObject';

export type TransformMode = 'translate' | 'rotate' | 'scale';

export class SelectMgr {
  /** Editor Reference */
  private editor: Editor;

  /** Three Transform Controls */
  private controls: TransformControls;
  /** Three Raycaster */
  private raycaster = new THREE.Raycaster();

  /** NDC */
  private ndc = new THREE.Vector2();

  /** List of selected Objects */
  private selectedObject: EditorObject | null = null;

  /** Current Transform Controls Mode */
  private mode: TransformMode = 'translate';

  private onDraggingChangedHandler = this.onDraggingChanged.bind(this);
  private onObjectChangeHandler = this.onObjectChange.bind(this);
  private onKeyDownHandler = this.onKeyDown.bind(this);
  private onPointerDownHandler = this.onPointerDown.bind(this);

  constructor(editor: Editor) {
    // Assign Editor Reference
    this.editor = editor;

    // Transform Controls Setup
    this.controls = new TransformControls(this.editor.ThreeManager.Camera, this.editor.ThreeManager.Renderer.domElement);
    this.editor.ThreeManager.Scene.add(this.controls.getHelper());
    this.setMode('translate');

    this.controls.addEventListener('dragging-changed', this.onDraggingChangedHandler);
    this.controls.addEventListener('objectChange', this.onObjectChangeHandler);
    this.editor.ThreeManager.Renderer.domElement.addEventListener('pointerdown', this.onPointerDownHandler);
    window.addEventListener('keydown', this.onKeyDownHandler);
  }

  private onObjectChange() {
    const obj = this.controls.object;
    if (!obj) {
      return;
    }

    // lock to ground plane
    obj.position.y = 0;

    // lock scale to X/Z only
    obj.scale.y = 1;
  }

  private onDraggingChanged(ev: any) {
    this.editor.ThreeManager.Orbit.enabled = !ev.value;
  }

  private onPointerDown(ev: PointerEvent) {
    // don't select while dragging gizmo
    if ((this.controls as any).dragging) {
      return;
    }

    const rect = this.editor.ThreeManager.Renderer.domElement.getBoundingClientRect();

    this.ndc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);

    this.raycaster.setFromCamera(this.ndc, this.editor.ThreeManager.Camera);

    // Intersect all editor objects by using their meshes
    const meshes = this.editor.objects.map((o) => o.Mesh);
    const hits = this.raycaster.intersectObjects(meshes, false);

    if (hits.length === 0) {
      this.select(null);
      return;
    }

    const hitMesh = hits[0].object as THREE.Mesh;
    const obj = (hitMesh as any).userData.editorObject as EditorObject | undefined;

    if (!obj) {
      this.select(null);
      return;
    }

    this.select(obj);
  }

  private onKeyDown(ev: KeyboardEvent) {
    // don’t steal keys while typing in inputs
    const el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      return;
    }

    switch (ev.key.toLowerCase()) {
      case 't':
        this.setMode('translate');
        break;
      case 'r':
        this.setMode('rotate');
        break;
      case 's':
        this.setMode('scale');
        break;
      case 'escape':
        this.select(null);
        break;
    }
  }

  public setMode(mode: TransformMode) {
    this.mode = mode;
    this.controls.setMode(mode);
    this.editor.updateTransformControlsUI(mode);

    if (mode === 'translate') {
      this.controls.showX = true;
      this.controls.showY = false;
      this.controls.showZ = true;
    }
    else if (mode === 'rotate') {
      this.controls.showX = false;
      this.controls.showY = true;
      this.controls.showZ = false;
    }
    else if (mode === 'scale') {
      this.controls.showX = true;
      this.controls.showY = false;
      this.controls.showZ = true;
    }
  }

  public get Mode(): TransformMode {
    return this.mode;
  }

  public toggleSnap(val: boolean): void {
    // Enable Snap-ing
    if (val) {
      // grid snap
      this.controls.setTranslationSnap(1);
      // 22.5deg
      this.controls.setRotationSnap(Math.PI / 8);
      this.controls.setScaleSnap(0.25);
    }
    // Disable Snap-ing
    else {
      this.controls.setTranslationSnap(null);
      this.controls.setRotationSnap(null);
      this.controls.setScaleSnap(null);
    }
  }

  public select(object?: EditorObject | null) {
    // Attach to object
    if (object) {
      this.selectedObject = object;

      this.controls.attach(object.Root);
    }
    // Detach existing object
    else {
      this.selectedObject = null;
      this.controls.detach();
    }
  }

  public cleanup() {
    this.controls.removeEventListener('dragging-changed', this.onDraggingChangedHandler);
    this.controls.removeEventListener('objectChange', this.onObjectChangeHandler);
    this.editor.ThreeManager.Renderer.domElement.removeEventListener('pointerdown', this.onPointerDownHandler);
    window.removeEventListener("keydown", this.onKeyDownHandler);
  }
}
