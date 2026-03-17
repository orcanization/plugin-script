// scripts/react-shim.js

const React = window.React;

// Default Export (für: import React from "react")
export default React;

// Named Exports (für: import { useState } from "react")
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useMemo = React.useMemo;
export const useCallback = React.useCallback;
export const useRef = React.useRef;
export const useContext = React.useContext;
export const useReducer = React.useReducer;

// Optional, aber oft gebraucht
export const createElement = React.createElement;
export const Fragment = React.Fragment;