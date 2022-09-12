import * as THREE from './node_modules/three/build/three.module.js';
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from './node_modules/three/examples/jsm/postprocessing/GlitchPass.js'
import { DotScreenPass } from './node_modules/three/examples/jsm/postprocessing/DotScreenPass.js'
import { FilmPass } from './node_modules/three/examples/jsm/postprocessing/FilmPass.js'

import { GammaCorrectionShader } from "./node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from './node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from './node_modules/three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from './node_modules/three/examples/jsm/shaders/SobelOperatorShader.js';
import { RGBShiftShader } from './node_modules/three/examples/jsm/shaders/RGBShiftShader.js'
import { KaleidoShader } from './node_modules/three/examples/jsm/shaders/KaleidoShader.js'


/**
 * Cursor
 */
 const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', e => {
    cursor.x = e.clientX / sizes.width - 0.5,
    cursor.y = -(e.clientY / sizes.height - 0.5)
})

/**
 * SCENE
 */

const scene = new THREE.Scene();

const fog = new THREE.FogExp2('#000000', .4);
scene.fog = fog;


/**
 * LIGHT
 */

const ambientLight = new THREE.AmbientLight("#ffffff", 10);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight('#0060D6', 20, 25, Math.PI * 0.1, 0.25);
spotlight.position.set(0.5, 0.75, 2.2);

spotlight.target.position.x = -0.25;
spotlight.target.position.y = 0.25;
spotlight.target.position.z = 0.25;
scene.add(spotlight);
scene.add(spotlight.target);

const spotlight2 = new THREE.SpotLight('#0060D6', 20, 25, Math.PI * 0.1, 0.25);
spotlight2.position.set(-0.5, 0.75, 2.2);

spotlight2.target.position.x = 0.25;
spotlight2.target.position.y = 0.25;
spotlight2.target.position.z = 0.25;
scene.add(spotlight2);
scene.add(spotlight2.target);


/**
 * TEXTURES
 */

const TEXTURE_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657168/blog/vaporwave-threejs-textures/grid.png";
const DISPLACEMENT_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657200/blog/vaporwave-threejs-textures/displacement.png";
const METALNESS_PATH = "https://res.cloudinary.com/dg5nsedzw/image/upload/v1641657200/blog/vaporwave-threejs-textures/metalness.png";

const textureLoader = new THREE.TextureLoader();
const gridTexture = textureLoader.load(TEXTURE_PATH);
const terrainTexture = textureLoader.load(DISPLACEMENT_PATH);
const metalnessTexture = textureLoader.load(METALNESS_PATH);


/**
 * OBJECTS
 */

const geometry = new THREE.PlaneGeometry(1, 2, 24, 24);
const material = new THREE.MeshStandardMaterial({
    map: gridTexture,
    displacementMap: terrainTexture,
    displacementScale: 0.4,
    metalnessMap: metalnessTexture,
    metalness: 0.96,
    roughness: 0.5,
});

const plane = new THREE.Mesh(geometry, material);
// OTHER COOL EFFECT
// plane.rotation.x = -Math.PI * 10; 
plane.rotation.x = -Math.PI * .5;
plane.position.y = 0.0;
plane.position.z = 0.15;
const plane2 = new THREE.Mesh(geometry, material);
// OTHER COOL EFFECT
// plane2.rotation.x = -Math.PI * 10; 
plane2.rotation.x = -Math.PI * .5;
plane2.position.y = 0.0;
plane2.position.z = -1.85;

plane.scale.set(1.2, 1.2, 1.2);
plane2.scale.set(1.2, 1.2, 1.2);
scene.add(plane);
scene.add(plane2);

/**
 * SIZES
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};


/**
 * CAMERA
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .01, 2, 200);
camera.position.x = 0;
camera.position.y = 0.1;
camera.position.z = 1.1;


/**
 * RENDERER
 */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Stats
const stats = new Stats();
document.body.appendChild( stats.dom );

// resize
const reSize = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera's aspect ratio and projection matrix
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', reSize);


/**
 * POST PROCESSING
 */

const composer = new EffectComposer(renderer)

composer.addPass( new RenderPass(scene, camera))

// composer.addPass( new FilmPass())
// composer.addPass( new DotScreenPass( new THREE.Vector2(40, 40), 10, 10))

// const RGBShiftPass = new ShaderPass(RGBShiftShader)
// RGBShiftPass.uniforms[ 'amount' ].value = .005
// composer.addPass(RGBShiftPass)

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrectionPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.002;

composer.addPass(rgbShiftPass);


// const KaleidoShaderPass = new ShaderPass (KaleidoShader)
// composer.addPass(KaleidoShaderPass)

// // GREY EFFECT
// const effectGrayScale = new ShaderPass( LuminosityShader );
// composer.addPass( effectGrayScale );

// let effectSobel;

// effectSobel = new ShaderPass( SobelOperatorShader );
// effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
// effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
// composer.addPass( effectSobel );

composer.addPass( new GlitchPass(10))


/**
 * CONTROLS
 */

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * ANIMATION
 */
const clock = new THREE.Clock();

const tick = () => {

    const elapsedTime = clock.getElapsedTime();
    controls.update();

    // OTHER COOL EFFECTS
    // plane.rotation.z = elapsedTime * 0.5;
    // plane2.rotation.z = elapsedTime * 0.5;

    plane.position.z = (elapsedTime * 0.25) % 2;
    plane2.position.z = ((elapsedTime * 0.25) % 2) - 1;
    
    camera.rotation.x = (cursor.y * Math.PI) * .1
    camera.rotation.y = - (cursor.x * Math.PI) * .1


    // renderer.render(scene, camera);
    composer.render();

    stats.update();

    window.requestAnimationFrame(tick);
};
tick();




