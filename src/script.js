import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import typefaceFont from '../static/fonts/helvetiker_regular.typeface.json';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
console.log(typefaceFont)
/**
 * Base
 */
// Debug
const gui = new GUI()

//gui

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// center the text => axes helper => bounding: an info associated with the geometry
// tha tells what space is taken by that geometry
// FRUSTUM CULLING => to use the bounding measures to recenter the geometry
//By default three.js is using sphere bounding

/**
 * Axes Helper
 */
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('/textures/matcaps/3.png');
//Textures used as map and matcap are supposed to be encoded in sRGB.
// we need to specify it by setting their colorSpace to THREE.SRGBColorSpace:
matcapTexture.colorSpace = THREE.SRGBColorSpace;
//console.log(matcapTexture)
// const textTexture = textureLoader.loader('/textures/matcaps/8.png');
// textTexture.colorSpace = THREE.SRGBColorSpace;
/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        console.log(font);
        const textGeometry = new TextGeometry(
            'delafuentej - dev',
            
            {
               
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset:0,
                bevelSegments:3,
            }
        )
        //use box bounding
       // textGeometry.computeBoundingBox(); // Box§ coordinates
        // info  with the geometry tha tells what space is taken by that geometry
        // to move the textGeometry,  not move the mesh 
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
        // )
        // textGeometry.computeBoundingBox(); 
        // console.log(textGeometry.boundingBox);

        // the ease way to center the text is: 
        textGeometry.center();
        console.log(textGeometry.boundingBox);

        const material = new THREE.MeshMatcapMaterial();
        material.matcap = matcapTexture;
        material.transparent = true;
        material.opacity= 0.7;
        //textMaterial.wireframe = true;

        const text = new THREE.Mesh(textGeometry, material);
        scene.add(text);

   

        console.time('donuts');

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20,45);
       // const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});
        // to add objects-donuts
        for(let i=0; i< 200; i++){
           
            const donut = new THREE.Mesh(donutGeometry, material);
            //donuts position
            donut.position.x =( Math.random() - 0.5) * 10;
            donut.position.y =( Math.random() - 0.5) * 10;
            donut.position.z =( Math.random() - 0.5) * 10;
            //donut rotation
            donut.rotation.x = (Math.random() * Math.PI)
            donut.rotation.y = (Math.random() * Math.PI)
            scene.add(donut);
            // donut scale
            const scale = Math.random();
            // donut.scale.x = scale;
            // donut.scale.y = scale;
            // donut.scale.z = scale;
            donut.scale.set(scale, scale, scale);
            
        }
        console.timeEnd('donuts');

    }
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()