import { Injectable } from '@angular/core';
import { BoxGeometry, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

@Injectable({
  providedIn: 'root'
})
export class PointCloudService {

  constructor() { }
  lineMaterial = new LineBasicMaterial();
  sphereGeometry = new SphereGeometry(1, 32, 32);
  meshBasicMaterial = new MeshBasicMaterial();
  BoxGeometry = new BoxGeometry(5, 5, 5);


  makeLine(point1: Vector3, point2: Vector3) {
    const distance = point1.distanceTo(point2);
    const geometry = new BufferGeometry().setFromPoints([point1, point2]);
    const material = this.lineMaterial.clone();
    material.color.setHex(0xffffff);
    const line = new Line(geometry, material);
    const midPoint = point1.clone().add(point2).divideScalar(2);
    return { distance, line, midPoint };
  }

  createDot(point: Vector3) {
    const geometry = this.sphereGeometry.clone();
    const material = this.meshBasicMaterial.clone();
    material.color.setHex(0xffffff);
    const dot = new Mesh(geometry, material);
    dot.position.set(point.x, point.y, point.z);
    return dot;
  }

  createBox() {
    const geometry = this.BoxGeometry.clone();
    const material = this.meshBasicMaterial.clone();
    material.color.setHex(0xFFC0CB);
    material.opacity = 0.5;
    material.transparent = true;
    const box = new Mesh(geometry, material);
    return box;
  }
}
