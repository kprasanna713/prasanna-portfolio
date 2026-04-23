import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (!canvasDiv.current) return;

    const rect = canvasDiv.current.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer;
    let character: THREE.Object3D | null = null;

    const clock = new THREE.Clock();

    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    let rafId = 0;
    let debounce: number | undefined;
    let introTimeout: number | undefined;
    const mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    let touchmoveHandler: ((e: TouchEvent) => void) | null = null;
    let touchmoveTarget: HTMLElement | null = null;

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse.x = x;
        mouse.y = y;
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = window.setTimeout(() => {
        touchmoveTarget = element;
        touchmoveHandler = (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => {
            mouse.x = x;
            mouse.y = y;
          });
        element?.addEventListener("touchmove", touchmoveHandler);
      }, 200);
    };

    const onTouchEnd = () => {
      if (touchmoveHandler && touchmoveTarget) {
        touchmoveTarget.removeEventListener("touchmove", touchmoveHandler);
        touchmoveHandler = null;
        touchmoveTarget = null;
      }
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse.x = x;
        mouse.y = y;
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    const onResize = () => {
      if (character) {
        handleResize(renderer, camera, canvasDiv, character);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    loadCharacter().then((gltf) => {
      if (!gltf) return;
      const animations = setAnimations(gltf);
      hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
      mixer = animations.mixer;
      character = gltf.scene;
      setChar(character);
      scene.add(character);
      headBone = character.getObjectByName("spine006") || null;
      screenLight = character.getObjectByName("screenlight") || null;
      progress.loaded().then(() => {
        introTimeout = window.setTimeout(() => {
          light.turnOnLights();
          animations.startIntro();
        }, 2500);
      });
    });

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(debounce);
      clearTimeout(introTimeout);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
      if (touchmoveHandler && touchmoveTarget) {
        touchmoveTarget.removeEventListener("touchmove", touchmoveHandler);
      }
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss?.();
      if (canvasDiv.current && renderer.domElement.parentElement === canvasDiv.current) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
