import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Three() {
    const mountRef = useRef(null);
    const modelRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const currentRef = mountRef.current;
        if (!currentRef) return;

        // ===== SCENE =====
        const scene = new THREE.Scene();

        const width = currentRef.clientWidth || 500;
        const height = currentRef.clientHeight || 600;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

        // ===== RENDERER (TỐI ƯU MẠNH) =====
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            precision: "mediump",
            stencil: false,
            depth: true
        });

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = false;

        currentRef.innerHTML = "";
        currentRef.appendChild(renderer.domElement);

        // ===== LIGHT (NHẸ NHẤT CÓ THỂ) =====
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        scene.add(ambientLight);

        // ===== LOAD MODEL =====
        const loader = new GLTFLoader();

        loader.load('/HOODIE/base_basic_pbr.glb', (gltf) => {
            const model = gltf.scene;
            modelRef.current = model;

            // Center model
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            camera.position.z = cameraZ * 1.2;
            camera.updateProjectionMatrix();

            // ===== TỐI ƯU MATERIAL & TEXTURE =====
            model.traverse((child) => {
                if (child.isMesh) {

                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.frustumCulled = true;

                    const originalMap = child.material.map || null;

                    if (originalMap) {
                        originalMap.generateMipmaps = false;
                        originalMap.minFilter = THREE.LinearFilter;
                        originalMap.magFilter = THREE.LinearFilter;
                    }

                    // Ép sang material nhẹ hơn
                    child.material = new THREE.MeshLambertMaterial({
                        map: originalMap
                    });
                }
            });

            scene.add(model);
        });

        // ===== FPS LIMIT 30 =====
        let animationId;
        let lastTime = 0;
        const fpsLimit = 30;
        const interval = 1000 / fpsLimit;

        let isActive = true;

        document.addEventListener("visibilitychange", () => {
            isActive = !document.hidden;
        });

        const animate = (time) => {
            animationId = requestAnimationFrame(animate);

            if (!isActive) return;

            if (time - lastTime > interval) {
                lastTime = time;

                if (modelRef.current) {
                    modelRef.current.rotation.y += 0.03;
                }

                renderer.render(scene, camera);
            }
        };

        animate();

        // ===== RESIZE =====
        const handleResize = () => {
            const w = currentRef.clientWidth;
            const h = currentRef.clientHeight;

            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        // ===== CLEANUP TRIỆT ĐỂ =====
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);

            scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });

            renderer.dispose();
            renderer.forceContextLoss();

            modelRef.current = null;

            if (currentRef) currentRef.innerHTML = "";
        };

    }, []);

    return (
        <div className="relative w-full h-full">

            <div ref={mountRef} className="absolute z-10 w-full h-full" />

            <div
                className="absolute z-20 w-full h-full cursor-pointer"
                onClick={() => {
                    if (audioRef.current) {
                        audioRef.current.muted = false;
                        audioRef.current.play();
                    }
                }}
            />

            <div className="absolute w-full h-full rounded-full bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%"></div>

            <audio
                ref={audioRef}
                src="/MP3/2GOILAYS.mp3"
                autoPlay
                muted
                loop
            />

        </div>
    );
}

export default Three;