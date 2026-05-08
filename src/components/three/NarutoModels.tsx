import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OptimizedModel, ModelLoader, useIsMobile } from './ModelBase';
import { Environment, ContactShadows, PerspectiveCamera, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 1. Hero: Disabled
export const HeroNaruto = () => null;

// 2. Projects: Disabled
export const BaryonNaruto = () => null;

// 3. Contact: Disabled
export const RamenShop = () => null;

// 4. Loading: Disabled
export const RunningNaruto = () => null;
