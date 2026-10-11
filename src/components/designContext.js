import { createContext, useContext } from 'react';

// Design choices that reach inside a template's own components (bullets,
// photo) without every template having to pass them along.
export const DesignContext = createContext({ bulletStyle: 'auto', photoShape: 'auto' });
export const useDesign = () => useContext(DesignContext);
