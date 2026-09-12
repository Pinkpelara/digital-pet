"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights } from "@/components/stage/StudioKit";
import { useNest } from "@/lib/state/nest-context";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import type { CreatureMood, SpeciesId } from "@/lib/types";

/**
 * The site is their home. Three companions live loose over the page — one
 * watches your cursor, one naps next to buttons, one climbs things it should
 * not. One transparent canvas, pointer-events none: they are never in the way,
 * they are just around.
 */

type Role = "watcher" | "sleeper" | "menace";

type Actor = {
  x: number;
  y: number; // feet, px
  facing: 1 | -1;
  mood: CreatureMood;
  until: number; // performance.now() ms
  target: { x: number; y: number } | null;
};

type Spot = { x: number; y: number };

const CREATURE_PX: Record<Role, number> = { watcher: 96, sleeper: 122, menace: 92 };
const STARTLE_SPEED = 2.4; // px per ms — sudden cursor movement spooks the watcher

function groundY() {
  return window.innerHeight - 26;
}

function clampX(x: number) {
  return Math.min(Math.max(x, 44), window.innerWidth - 44);
}

/** Where the buttons and headings currently are (viewport coords). */
function scanSpots(): { spots: Spot[]; peek: Spot | null } {
  const spots: Spot[] = [];
  document.querySelectorAll("[data-creature-spot]").forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.bottom < -40 || rect.top > window.innerHeight + 40) return;
    spots.push({ x: clampX(rect.right + 56), y: Math.min(rect.bottom + 2, groundY()) });
  });
  let peek: Spot | null = null;
  const peekNode = document.querySelector("[data-creature-peek]");
  if (peekNode) {
    const rect = peekNode.getBoundingClientRect();
    if (rect.bottom > 60 && rect.top < window.innerHeight - 60) {
      peek = { x: clampX(rect.right - 8), y: Math.min(rect.bottom - 4, groundY()) };
    }
  }
  return { spots, peek: peek ?? null };
}

function moveToward(actor: Actor, target: Spot, speed: number, dt: number) {
  const dx = target.x - actor.x;
  const dy = target.y - actor.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 4) return true;
  const step = Math.min(dist, speed * dt);
  actor.x += (dx / dist) * step;
  actor.y += (dy / dist) * step;
  if (Math.abs(dx) > 2) actor.facing = dx >= 0 ? 1 : -1;
  return dist <= 8;
}

function stepWatcher(actor: Actor, dt: number, now: number, pointer: { x: number; y: number; speed: number } | null) {
  if (pointer && pointer.speed > STARTLE_SPEED && actor.mood !== "hide") {
    actor.mood = "hide";
    actor.until = now + 2600;
    return;
  }
  if (now > actor.until) {
    actor.mood = Math.random() < 0.72 ? "follow" : "idle";
    actor.until = now + (actor.mood === "follow" ? 4200 + Math.random() * 3200 : 1800 + Math.random() * 1600);
  }
  if (actor.mood === "follow" && pointer) {
    const dx = pointer.x - actor.x;
    const dy = pointer.y + 96 - actor.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 130) {
      const step = Math.min(dist - 110, 0.085 * dt * (1 + dist / 400));
      actor.x += (dx / dist) * step;
      actor.y += (dy / dist) * step * 0.55;
      actor.facing = dx >= 0 ? 1 : -1;
    }
    actor.y = Math.min(Math.max(actor.y, 90), groundY());
  }
}

function stepSleeper(actor: Actor, dt: number, now: number, spots: Spot[]) {
  if (actor.mood === "nap" && now < actor.until) return;
  if (actor.mood === "nap" || !actor.target) {
    const options = spots.length > 0 ? spots : [{ x: window.innerWidth * 0.8, y: groundY() }];
    actor.target = options[Math.floor(Math.random() * options.length)];
    actor.mood = "walk";
    actor.until = now + 30000;
    return;
  }
  if (moveToward(actor, actor.target, 0.055, dt)) {
    actor.mood = "nap";
    actor.until = now + 11000 + Math.random() * 9000;
    actor.target = null;
  }
}

function stepMenace(actor: Actor, dt: number, now: number, peek: Spot | null) {
  if (now < actor.until) {
    if (actor.mood === "climb") {
      actor.y -= 0.062 * dt;
      if (actor.y < 130) {
        actor.mood = "happy";
        actor.until = now + 1600;
        actor.y = groundY();
      }
    } else if (actor.mood === "walk" && actor.target) {
      moveToward(actor, actor.target, 0.075, dt);
    } else if (actor.mood === "hide" && actor.target) {
      moveToward(actor, actor.target, 0.09, dt);
    }
    return;
  }
  const roll = Math.random();
  if (peek && roll < 0.3) {
    actor.mood = "hide";
    actor.target = peek;
    actor.until = now + 5200;
  } else if (roll < 0.5) {
    actor.mood = "climb";
    actor.x = window.innerWidth - 58;
    actor.facing = -1;
    actor.until = now + 9000;
  } else if (roll < 0.68) {
    actor.mood = "happy";
    actor.until = now + 2000;
  } else {
    actor.mood = "walk";
    // Keep to the bottom band and the page gutters — around the words, not over them.
    const gutter = (window.innerWidth - 1152) / 2;
    const inGutters = gutter > 80 && Math.random() < 0.45;
    const x = inGutters
      ? (Math.random() < 0.5 ? 60 + Math.random() * (gutter - 100) : window.innerWidth - gutter + 40 + Math.random() * (gutter - 100))
      : 60 + Math.random() * (window.innerWidth - 120);
    actor.target = { x, y: groundY() - Math.random() * 46 };
    actor.until = now + 3600 + Math.random() * 2600;
  }
}

function Roamer({ role, species, start }: { role: Role; species: SpeciesId; start: Spot }) {
  const group = useRef<Group>(null);
  const actor = useRef<Actor>({
    x: start.x,
    y: start.y,
    facing: 1,
    mood: role === "sleeper" ? "walk" : "idle",
    until: 0,
    target: null,
  });
  const pointer = useRef<{ x: number; y: number; speed: number } | null>(null);
  const spots = useRef<{ spots: Spot[]; peek: Spot | null }>({ spots: [], peek: null });
  const [mood, setMood] = useState<CreatureMood>(actor.current.mood);
  const [pointerNorm, setPointerNorm] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let last = { x: 0, y: 0, t: 0 };
    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - last.t);
      const speed = Math.hypot(event.clientX - last.x, event.clientY - last.y) / dt;
      last = { x: event.clientX, y: event.clientY, t: now };
      pointer.current = { x: event.clientX, y: event.clientY, speed };
      setPointerNorm({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const scan = window.setInterval(() => {
      spots.current = scanSpots();
    }, 1400);
    spots.current = scanSpots();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearInterval(scan);
    };
  }, []);

  useFrame((state, delta) => {
    const a = actor.current;
    const now = performance.now();
    const dt = Math.min(delta * 1000, 60);
    if (role === "watcher") stepWatcher(a, dt, now, pointer.current);
    else if (role === "sleeper") stepSleeper(a, dt, now, spots.current.spots);
    else stepMenace(a, dt, now, spots.current.peek);
    a.x = clampX(a.x);
    a.y = Math.min(Math.max(a.y, 60), groundY());
    if (a.mood !== mood) setMood(a.mood);

    const node = group.current;
    if (!node) return;
    const { width, height } = state.size;
    const worldH = 2 * 10 * Math.tan((35 * Math.PI) / 360);
    const worldW = worldH * (width / height);
    const targetPx = CREATURE_PX[role];
    const scale = targetPx / 2.2 / (height / worldH);
    const originPy = a.y - targetPx * 0.42;
    node.position.set((a.x - width / 2) * (worldW / width), -(originPy - height / 2) * (worldH / height), 0);
    node.scale.setScalar(scale);
    const wantRot = a.mood === "walk" ? a.facing * 0.5 : a.mood === "climb" ? -0.35 : 0;
    node.rotation.y += (wantRot - node.rotation.y) * 0.08;
  });

  return (
    <group ref={group}>
      <FigurineMesh
        species={species}
        quality="medium"
        mood={mood}
        followPointer={role === "watcher"}
        pointer={pointerNorm}
      />
    </group>
  );
}

export function SiteWorld() {
  const { creaturesEnabled } = useNest();
  const reducedMotion = useReducedMotion();
  const [bigEnough, setBigEnough] = useState(false);

  useEffect(() => {
    const check = () => setBigEnough(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!creaturesEnabled || reducedMotion || !bigEnough) return null;

  const h = typeof window === "undefined" ? 800 : window.innerHeight;
  const w = typeof window === "undefined" ? 1200 : window.innerWidth;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      <StageCanvas eager alpha dprMax={1.25} camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 40 }} className="h-full w-full">
        <StudioLights intensity={1.05} />
        <Roamer role="watcher" species="sprout" start={{ x: w * 0.3, y: h - 26 }} />
        <Roamer role="sleeper" species="mochi" start={{ x: w * 0.78, y: h - 26 }} />
        <Roamer role="menace" species="niblet" start={{ x: w * 0.55, y: h - 26 }} />
      </StageCanvas>
    </div>
  );
}
