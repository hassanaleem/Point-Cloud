import { Injectable } from '@angular/core';
import { IHistory, ISaveData } from '../interfaces/viewer.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Mesh } from 'three';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  data:ISaveData[] = [];
  history:IHistory[] = [];

  constructor(private httpClient: HttpClient) { 
  }

  async loadHistory() {
    const data = await lastValueFrom(this.getHistory());
    this.history = data;
    return this.history;
  }

  extractData(Meshes: any) {
    this.data = Meshes.map((mesh: any) => {
     if (mesh.name === 'measurement') {
        const dot1 = mesh.children[0];
        const dot2 = mesh.children[1];
        const dot1_position = dot1.position;
        const dot2_position = dot2.position;
        return {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [0, 0, 0],
          label: 'measurement',
          id: mesh.uuid,
          isMeasurement: true,
          point1 : [dot1_position.x, dot1_position.y, dot1_position.z],
          point2 : [dot2_position.x, dot2_position.y, dot2_position.z],
        };
      }
      else {
        const { position, rotation, scale, uuid, name } = mesh;
        return {
          position: [position.x, position.y, position.z],
          rotation: [rotation.x, rotation.y, rotation.z],
          scale: [scale.x, scale.y, scale.z],
          label: name,
          id: uuid,
        };
      } 
    });
    this.saveMeshes();
  }

  private saveMeshes() {
    this.httpClient.post('http://localhost:5000/mesh', this.data).subscribe((response) => {
    });
  }

  getMeshData(): Observable<any> {
    return this.httpClient.get('http://localhost:5000/mesh');
  }

  updateHistory(mesh: Mesh) { 
    if (!mesh) return;
    const type = mesh.parent?.name === 'measurement' ? 'Measurement' : 'Annotation';
    const newHistory = { updated_at: new Date(), update_type: type };
    this.history.push(newHistory as IHistory);
    this.saveHistory(newHistory as IHistory);
  }

  private saveHistory(obj: IHistory) {
    this.httpClient.post('http://localhost:5000/history', obj).subscribe((response) => {
    });
  }

  getHistory(): Observable<any> {
    return this.httpClient.get('http://localhost:5000/history');
  }

}
