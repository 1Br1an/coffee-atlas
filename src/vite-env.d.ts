/// <reference types="vite/client" />

// world-atlas ships raw TopoJSON with no bundled types.
declare module 'world-atlas/countries-110m.json' {
  const value: {
    type: 'Topology'
    objects: Record<string, unknown>
    arcs: unknown
    transform?: unknown
  }
  export default value
}
