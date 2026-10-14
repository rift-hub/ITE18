import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import * as dat from 'lil-gui'

// RectAreaLight needs its lookup tables initialised once
RectAreaLightUniformsLib.init()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 * (the starter AmbientLight and PointLight were removed, then every
 *  light type from the lesson was added one by one)
 */

// AmbientLight - omnidirectional light on every face (fakes light bounce)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
ambientLight.visible = false // switch on from the Debug UI
scene.add(ambientLight)

// DirectionalLight - sun-like, parallel rays
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

// HemisphereLight - sky color / ground color / intensity
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

// PointLight - like a lighter, with distance + decay
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, - 0.5, 1)
scene.add(pointLight)

// RectAreaLight - photoshoot panel (Standard / Physical materials only)
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// SpotLight - flashlight: color, intensity, distance, angle, penumbra, decay
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

// The target must be in the scene or moving it does nothing
spotLight.target.position.x = - 0.75
scene.add(spotLight.target)

/**
 * Light helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

/**
 * Debug UI
 */
const lightsFolder = gui.addFolder('Lights')
lightsFolder.add(ambientLight, 'visible').name('ambient on')
lightsFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambient intensity')
lightsFolder.add(directionalLight, 'visible').name('directional on')
lightsFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directional intensity')
lightsFolder.add(hemisphereLight, 'visible').name('hemisphere on')
lightsFolder.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('hemisphere intensity')
lightsFolder.add(pointLight, 'visible').name('point on')
lightsFolder.add(pointLight, 'intensity').min(0).max(2).step(0.001).name('point intensity')
lightsFolder.add(rectAreaLight, 'visible').name('rectArea on')
lightsFolder.add(rectAreaLight, 'intensity').min(0).max(5).step(0.001).name('rectArea intensity')
lightsFolder.add(spotLight, 'visible').name('spot on')
lightsFolder.add(spotLight, 'intensity').min(0).max(2).step(0.001).name('spot intensity')

const helpersFolder = gui.addFolder('Helpers')
helpersFolder.add(hemisphereLightHelper, 'visible').name('hemisphere')
helpersFolder.add(directionalLightHelper, 'visible').name('directional')
helpersFolder.add(pointLightHelper, 'visible').name('point')
helpersFolder.add(spotLightHelper, 'visible').name('spot')
helpersFolder.add(rectAreaLightHelper, 'visible').name('rectArea')

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Keep the spot light helper in sync with the light/target
    spotLightHelper.update()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
