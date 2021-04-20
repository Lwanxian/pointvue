<template>
  <div ref="container" id="container"></div>
</template>

<script>
import * as THREE from "three/build/three.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
export default {
  data() {
    return {
      camera: null,
      scene: null,
      light1: null,
      light2: null,
      geometry: null,
      material: null,
      renderer: null,
      mesh: null,
      amount: null,
      axisHelper: null,
      controls: null,
      stats: null,
      mouse: null,
      raycaster: null,
    };
  },
  methods: {
    init: function () {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);
      // 相机
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      this.light1 = new THREE.HemisphereLight(0xffffff, 0x111188);
      this.light1.position.set(-1, 1.5, 1);

      this.light2 = new THREE.HemisphereLight(0xbb2233,  0x080820, 0.5);
      this.light2.position.set(-1, -1.5, -1);
      this.scene.add(this.light1, this.light2);
      // 几何体创建,二十面以上的多面体，当第二个参数大于1时为球体
      this.geometry = new THREE.IcosahedronGeometry(0.1, 4);
      // 材质对象
      this.material = new THREE.MeshPhongMaterial();
      let count = 1000;
      this.mesh = new THREE.InstancedMesh(this.geometry, this.material, count);
      let i = 0;

      this.amount = parseInt(window.location.search.substr(1)) || 10;
      let offset = (this.amount - 1) / 2;
      let matrix = new THREE.Matrix4();
      let color = new THREE.Color();
 
      for (let x = 0; x < this.amount; x++) {
        for (let y = 0; y < this.amount; y++) {
          for (let z = 0; z < this.amount; z++) {
            matrix.setPosition(offset - x, offset - y, offset - z);
            this.mesh.setMatrixAt(i, matrix);
            this.mesh.setColorAt(i, color);
            i++;
          }
        }
      }
      this.scene.add(this.mesh);

      let gui = new GUI();
      gui.add(this.mesh, "count", 0, count);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.container.appendChild(this.renderer.domElement);
      this.stats = new Stats();
      this.$refs.container.appendChild(this.stats.dom);
      // 辅助坐标系
      this.axisHelper = new THREE.AxesHelper(200);
      this.scene.add(this.axisHelper);

      window.addEventListener("resize", this.onWindowResize);
      this.$refs.container.addEventListener("mousemove", this.onMouseMove);
      
      this.controls = new OrbitControls(this.camera, this.renderer.domElement); //创建控件对象（鼠标控制）
      this.controls.update();


    },
    onWindowResize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, 

    onMouseMove: function (event) {
      event.preventDefault();
      this.mouse = new THREE.Vector2(1, 1);
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },

    render() {
      this.raycaster = new THREE.Raycaster();
      let intersection = this.raycaster.intersectObject(this.mesh);
      if (intersection.length > 0) {
        const instanceId = intersection[0].instanceId;
        this.mesh.setColorAt(
          instanceId,
          color.setHex(Math.random() * 0xffffff)
        );
        this.mesh.instanceColor.needsUpdate = true;
      }
      this.renderer.render(this.scene, this.camera); //执行渲染操作
      requestAnimationFrame(this.render);
      this.stats.update();
    },
    
  },
  mounted() {
    this.init();
    this.render();
  },
};
</script>

<style>
#container {
  width: 100%;
  height: 100vh;
}
</style>