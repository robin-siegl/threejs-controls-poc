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
    const containerElem = document.createElement('div');
    containerElem.id = 'mode-feat';
    containerElem.className = this.SelectManager.Mode;
    containerElem.innerHTML = `
      <div>
        <div id='translate-key'>T</div>
        <span>Translate</span>
      </div>
      <div>
        <div id='rotate-key'>R</div>
        <span>Rotate</span>
      </div>
      <div>
        <div id='scale-key'>S</div>
        <span>Scale</span>
      </div>
    `;

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