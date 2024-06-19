import { Component, effect } from '@angular/core';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Box3, DirectionalLight, Group, Mesh, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { PanelComponent } from '../panel/panel.component';
import { PointCloudService } from '../../service/point-cloud.service';
import { PanelService } from '../../service/panel-service.service';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { TRANSFOMRATIONS, TRANSFORMATION_MODES } from '../../interfaces/viewer.interface';
import { PANEL_MODES } from '../../constants/panel.constants';
import { LoaderComponent } from '../loader/loader.component';
import { SaveService } from '../../service/save.service';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [PanelComponent, LoaderComponent],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss'
})
export class ViewerComponent {

  scene = new Scene();
  camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new WebGLRenderer();
  light = new DirectionalLight(0xffffff, 1);
  pointCloud: any;
  controls!: OrbitControls;
  measurement: Vector3[] = [];
  raycaster = new Raycaster();
  mouse = new Vector2();
  labelRenderer = new CSS2DRenderer();
  measurementGroup = new Group();
  currentAnnotation: any;
  transformControls = new TransformControls(this.camera, this.renderer.domElement);
  Meshes: any = [];
  progress = 0;

  constructor(private panelService: PanelService, private pointCloudService: PointCloudService, private saveService: SaveService) {
    effect(() => { 
      const mode = this.panelService.selectedMode();
      this.handleButtonClick(mode);
    }, {allowSignalWrites:true})
  } 

  ngOnInit() {
    this.initialize();
    this.saveService.getMeshData().subscribe((data) => {
      this.onLoadAnnotations(data);
    })
  }

  onLoadAnnotations(data: any) { //loading annotation from the backend and adding them to our scene
    data.forEach((annotation: any) => {
      const { position, rotation, scale, label, id, isMeasurement, point1, point2 } = annotation;
      if (isMeasurement) {
        this.measurementGroup = new Group();
        const dot1 = this.pointCloudService.createDot(new Vector3(point1[0], point1[1], point1[2]));
        const dot2 = this.pointCloudService.createDot(new Vector3(point2[0], point2[1], point2[2]));
        this.measurementGroup.add(dot1);
        this.measurementGroup.add(dot2);
        this.makeLine(dot1.position, dot2.position);
        this.Meshes.push(this.measurementGroup);
        this.currentAnnotation = this.measurementGroup.children[2];
      }
      else if (label !== 'Annotation') {         
        const created_label = this.createLabel(label, new Vector3(position[0], position[1], position[2]));
        created_label.name = label;
        this.Meshes.push(created_label);
        this.scene.add(created_label);
      }
      else if (label === 'Annotation') {
        const mesh = this.pointCloudService.createBox();
        mesh.position.fromArray(position);
        mesh.rotation.fromArray(rotation);
        mesh.scale.fromArray(scale);
        mesh.name = label;
        mesh.uuid = id;
        this.Meshes.push(mesh);
        this.scene.add(mesh);
      }
    });
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('dblclick', this.clickHandler.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }
  
  handleButtonClick(mode: string) {
    switch (mode) {
      case PANEL_MODES.rotate:
      case PANEL_MODES.scale:
      case PANEL_MODES.translate:
        this.editAnnotation(mode as TRANSFORMATION_MODES);
        break;
  
      case PANEL_MODES.clearSelection:
        this.editAnnotation('none');
        this.panelService.selectedMode.set(PANEL_MODES.none);
        this.panelService.enableTransformControls.set(false);
        break;
  
      case PANEL_MODES.delete:
        if (this.currentAnnotation) {
          if (this.currentAnnotation.parent?.name === 'measurement') {
            this.currentAnnotation.parent.children.forEach((child: any) => {
              this.scene.remove(child);
              if (child.isCSS2DObject) {
                this.labelRenderer.domElement.removeChild(child.element);
              }
            });
            this.scene.remove(this.currentAnnotation.parent);
            this.Meshes = this.Meshes.filter((mesh: any) => mesh !== this.currentAnnotation.parent);
          }
          else {
            this.Meshes = this.Meshes.filter((mesh: any) => mesh !== this.currentAnnotation);
          }
          this.scene.remove(this.currentAnnotation);
          this.saveService.updateHistory(this.currentAnnotation);
          this.currentAnnotation = null;
          this.editAnnotation('none');
          this.panelService.selectedMode.set(PANEL_MODES.none);
        }
        break;
      case PANEL_MODES.save:
        this.saveService.extractData(this.Meshes);
        this.saveService.updateHistory({...this.currentAnnotation});
        this.panelService.selectedMode.set(PANEL_MODES.none);
        break;
      default:
        this.editAnnotation('none');
    }
  }
  

  clickHandler() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.Meshes);
    if (intersects.length) {
        this.currentAnnotation = intersects[0].object;
        if (this.currentAnnotation.type === 'Mesh') {
          this.panelService.enableTransformControls.set(true);
        }
        this.recenterCamera(this.currentAnnotation);
        return
    }
    this.panelService.enableTransformControls.set(false);
    switch (this.panelService.selectedMode()) {
      case PANEL_MODES.Measurement:
        this.onMeasurement();
        break;
      case PANEL_MODES.createAnnotation:
        this.createAnnotation();
        break;
      case PANEL_MODES.label:
        this.createLabelAnnotation();
        break;
    }
    this.editAnnotation('none');
  }

  createLabelAnnotation() {
    const intersection = this.raycaster.intersectObject(this.pointCloud);
    if (intersection.length) {
      const label = this.createLabel(this.panelService.label(), intersection[0].point);
      label.name = this.panelService.label();
      this.scene.add(label);
      this.Meshes.push(label);
    }
    this.panelService.selectedMode.set(PANEL_MODES.none);
    this.panelService.label.set('');
  } 

  pointCloudLoader(filename: string) {
    const loader = new PCDLoader();
    loader.load(filename,
      (mesh) => {
        this.afterModelLoaded(mesh);
      },
      (xhr) => {
        this.progress = (xhr.loaded / xhr.total * 100);
      }
    );
  }

  initialize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    document.body.appendChild(this.renderer.domElement);
    this.scene.add(this.light);
    this.camera.position.z = 3;
    this.pointCloudLoader('pointcloud.pcd');
  }

  afterModelLoaded(mesh: any) {
    this.pointCloud = mesh;
    this.pointCloud.material.size = 1;
    this.scene.add(mesh);
    this.controls.target = this.pointCloud.position;
    this.animate();
    this.recenterCamera(this.pointCloud ,true);
  }

  recenterCamera(mesh: Mesh, model = false) { //refoucsing camera on the selected object
    const box = new Box3().setFromObject(mesh);
    const center = box.getCenter(new Vector3());
    this.controls.target = center;
    this.controls.update();
    if (model) {
      this.camera.position.set(center.x, center.y - box.getSize(new Vector3()).y, center.z);
    }
    else {
      this.camera.position.set(center.x, center.y + box.getSize(new Vector3()).y*2.5, center.z);
    }
    this.camera.lookAt(center);
    this.camera.updateProjectionMatrix();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  onResize(event: any) {
    this.camera.aspect = event.target.innerWidth / event.target.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(event.target.innerWidth, event.target.innerHeight);
  }

  onMeasurement() { // create measurement between two points
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);
    if (intersects.length) {
      if (this.measurement.length < 2) {
        this.measurement.push(intersects[0].point);
        const dot = this.pointCloudService.createDot(intersects[0].point);
        this.scene.remove(this.measurementGroup);
        this.measurementGroup.add(dot);
        this.scene.add(this.measurementGroup);
      }
    }
    // if two points are selected, create a line between them
    if (this.measurement.length === 2) {
      this.makeLine(this.measurement[0], this.measurement[1]);
      this.currentAnnotation = this.measurementGroup.children[2];
      this.Meshes.push(this.measurementGroup);
      this.measurement = [];
      this.measurementGroup = new Group();
      this.panelService.selectedMode.set(PANEL_MODES.none);
    }
    this.renderer.render(this.scene, this.camera);
  }

  makeLine(point1: Vector3, point2: Vector3) {
    const {distance, line, midPoint} = this.pointCloudService.makeLine(point1, point2);
    const label = this.createLabel('distance = ' + distance.toFixed(3), midPoint);
    this.measurementGroup.add(line);
    this.measurementGroup.add(label);
    this.measurementGroup.name = 'measurement';
    this.scene.add(this.measurementGroup);
  }

  onMouseMove(event: any) { //update mouse position for raycasting
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  createLabel(text: string, position: Vector3) { //create label for annotation
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.color = 'white';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.labelRenderer.domElement);

    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = text;

    const label = new CSS2DObject(labelDiv);
    label.position.set(position.x, position.y, position.z);
    this.labelRenderer.render(this.scene, this.camera);
    return label;
  }

  createAnnotation() { //create annotation box
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);
    if (intersects.length) {
      const annotation = this.pointCloudService.createBox();
      annotation.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
      this.currentAnnotation = annotation;
      annotation.name = 'Annotation';
      this.scene.add(annotation);
      this.Meshes.push(annotation);
      this.panelService.selectedMode.set(PANEL_MODES.none);
    }
  }

  editAnnotation(mode: TRANSFORMATION_MODES) { //edit box annotation by adding transformations
    this.transformControls.detach();
    this.scene.remove(this.transformControls);
    if (mode === PANEL_MODES.none) { 
      this.controls.enabled = true;
      return
    }
    this.controls.enabled = false;
    this.transformControls.attach(this.currentAnnotation);
    this.scene.add(this.transformControls);
    this.transformControls.setMode(mode as TRANSFOMRATIONS);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('dblclick', this.clickHandler);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.body.removeChild(this.renderer.domElement);
    this.labelRenderer.domElement.remove();
  }

}
