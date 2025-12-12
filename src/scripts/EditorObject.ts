import * as THREE from 'three';

export class EditorObject {
  private root: THREE.Group;
  private mesh: THREE.Mesh;

  constructor(posX: number, posY: number, color: string) {
    this.root = new THREE.Group();

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
      })
    );

    this.mesh.rotation.x = -Math.PI / 2;
    (this.mesh as any).userData.editorObject = this;
    this.root.add(this.mesh);

    this.root.position.set(posX, 0, posY);
  }

  public get Mesh(): THREE.Mesh {
    return this.mesh;
  }

  public get Root(): THREE.Object3D {
    return this.root;
  }
}
