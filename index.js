import * as THREE from "three";

const $esfera_contenedor = document.querySelector("#esfera_contenedor");
let esferas_array = [];

let escena = new THREE.Scene();
escena.background = new THREE.Color(0x333333);
let camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
};
resize();
$esfera_contenedor.appendChild(renderer.domElement);
window.addEventListener("resize", resize);

class Esfera {

  constructor(dimenciones, color) {

    this.geometria = new THREE.SphereGeometry(dimenciones[0], dimenciones[1], dimenciones[2]);
    this.material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true
    });
    this.esfera = new THREE.Mesh(this.geometria, this.material);
    esferas_array.push(this.esfera);
  }

  insertar_escena() {
    escena.add(this.esfera);
  }

  agregar_esfera_hija(esfera_padre) {
    esfera_padre.add(this.esfera);
  }

  animar() {
    const animate = () => {

      requestAnimationFrame(animate);
      this.esfera.rotation.x += 0.005;
      this.esfera.rotation.y += 0.005;
      renderer.render(escena, camara);
    };
    animate();
  }
}

const mostrar_esfera_caso = (caso, radio_esfera, carga_esfera, radio_gaus) => {

  const EO = 8.8541878176;
  let $resultado = document.querySelector("#resultado");

  if(caso == 1){
    
    let esfera_padre_caso1 = new Esfera([2, 32, 32], 0xffff00);
    esfera_padre_caso1.insertar_escena();
    esfera_padre_caso1.animar();
    
    let esfera_hija_caso1 = new Esfera([1, 32, 32], 0xffffff);
    esfera_hija_caso1.agregar_esfera_hija(esfera_padre_caso1.esfera);

    let operacion = (1) / (4 * Math.PI * EO) * (carga_esfera * Math.pow(10, -6)) / (radio_esfera * radio_esfera);
    $resultado.innerHTML = operacion + "(N/C)*m²";
  }
  else if(caso == 2){
  
    let esfera_padre_caso2 = new Esfera([2, 32, 32], 0xffffff);
    esfera_padre_caso2.insertar_escena();
    esfera_padre_caso2.animar();
  
    let esfera_hija_caso2 = new Esfera([1, 32, 32],  0xffff00);
    esfera_hija_caso2.agregar_esfera_hija(esfera_padre_caso2.esfera);

    let operacion = ((carga_esfera * Math.pow(10, -6)).toFixed(6) * radio_esfera ) / (4 * Math.PI * EO * radio_gaus * radio_gaus * radio_gaus );
    $resultado.innerHTML = operacion + "(N/C)*m²";
  }
  else{
  
    let esfera_padre_caso3 = new Esfera([2, 32, 32], 0xffff99);
    esfera_padre_caso3.insertar_escena();
    esfera_padre_caso3.animar();
  
    let esfera_hija_caso3 = new Esfera([1.99, 32, 32], 0xffffff );
    esfera_hija_caso3.agregar_esfera_hija(esfera_padre_caso3.esfera);

    let operacion = ((carga_esfera * Math.pow(10, -6)) * radio_esfera ) / (4 * Math.PI * EO * radio_gaus * radio_gaus * radio_gaus);
    $resultado.innerHTML = operacion + "(N/C)*m²";
  }
}

document.querySelector("#formulario").addEventListener("submit", (e) => {

  e.preventDefault();
  document.querySelector("body").style.overflowY = "visible";

  let carga_esfera = Number(document.querySelector("#carga_esfera").value);
  let radio_esfera = Number(document.querySelector("#radio-esfera").value);
  let radio_gaus = Number(document.querySelector("#radio-superficie").value);
  document.querySelector("#superficieText").innerHTML = radio_gaus;
  document.querySelector("#esferaText").innerHTML = radio_esfera;
  document.querySelector("#cargaText").innerHTML = carga_esfera;
  let caso;

  console.log(carga_esfera + 10, carga_esfera * 10, carga_esfera / 2)

  if(radio_esfera > radio_gaus) caso = 1;
  if(radio_esfera < radio_gaus) caso = 2;
  if(radio_esfera == radio_gaus) caso = 3;

  esferas_array.forEach(esfera => {

  escena.remove(esfera);
  esfera.geometry.dispose();
  esfera.material.dispose();
  })

  esferas_array = [];
  document.querySelector("#carga_esfera").value = "";
  document.querySelector("#radio-esfera").value = "";
  document.querySelector("#radio-superficie").value = "";
  mostrar_esfera_caso(caso, radio_esfera, carga_esfera, radio_gaus);
})

camara.position.z = 5;
