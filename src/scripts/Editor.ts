import { ThreeMgr } from './ThreeMgr';
import { SelectMgr, type TransformMode } from './SelectMgr';
import type { EditorObject } from './EditorObject';
import { App } from './App';

export class Editor {
  /** Editor Three Logic */
  private threeMgr: ThreeMgr;
  /** Editor Select Logic */
  private selectMgr: SelectMgr;

  /** List of objects */
  private obj: Array<EditorObject> = [];

  constructor() {
    // Scene Setup
    this.threeMgr = new ThreeMgr(this);
    // Select Manager Setup
    this.selectMgr = new SelectMgr(this);


    this.transformControlsFeature();
    this.snapFeature();
  }

  public updateTransformControlsUI(mode: TransformMode) {
    const container = document.getElementById('mode-feat');
    if (!container) {
      return;
    }

    container.className = mode;
  }

  private transformControlsFeature(): void {
    const translateElem = document.createElement('button');
    translateElem.title = 'Press Key "T" on your keyboard for easy switching.';
    translateElem.innerHTML = `
      <span id='translate-key'>T</span>
      <span>Translate</span>
    `;
    translateElem.addEventListener('click', () => this.SelectManager.setMode('translate'))
    const rotateElem = document.createElement('button');
    rotateElem.title = 'Press Key "R" on your keyboard for easy switching.';
    rotateElem.innerHTML = `
      <span id='rotate-key'>R</span>
      <span>Rotate</span>
    `;
    rotateElem.addEventListener('click', () => this.SelectManager.setMode('rotate'))
    const scaleElem = document.createElement('button');
    scaleElem.title = 'Press Key "S" on your keyboard for easy switching.';
    scaleElem.innerHTML = `
      <span id='scale-key'>S</span>
      <span>Scale</span>
    `;
    scaleElem.addEventListener('click', () => this.SelectManager.setMode('scale'))

    const containerElem = document.createElement('div');
    containerElem.id = 'mode-feat';
    containerElem.className = this.SelectManager.Mode;
    containerElem.appendChild(translateElem);
    containerElem.appendChild(rotateElem);
    containerElem.appendChild(scaleElem);

    App.Container.appendChild(containerElem);
  }

  private snapFeature(): void {
    const checkboxElem = document.createElement('input');
    checkboxElem.type = 'checkbox';
    checkboxElem.addEventListener('change', (e) => {
      this.SelectManager.toggleSnap((e.target as HTMLInputElement).checked);
    })
    const spanElem = document.createElement('span');
    spanElem.textContent = 'Snap Feature';
    const labelElem = document.createElement('label');
    labelElem.id = 'snap-feat';
    labelElem.appendChild(checkboxElem);
    labelElem.appendChild(spanElem);
    App.Container.appendChild(labelElem);
  }

  /**
   * Add new Object
   * @param obj to add
   */
  public add(obj: EditorObject): void {
    this.obj.push(obj);
    this.ThreeManager.Scene.add(obj.Root);
  }

  /**
   * Get available Objects
   */
  public get objects(): Array<EditorObject> {
    return this.obj;
  }

  /**
   * Get current Editor Three Logic Instance
   */
  public get ThreeManager(): ThreeMgr {
    return this.threeMgr;
  }

  /**
   * Get current Editor Select Logic Instance
   */
  public get SelectManager(): SelectMgr {
    return this.selectMgr;
  }

  public cleanup() {
    this.selectMgr.cleanup();
    this.threeMgr.cleanup();
  }
}