/// <reference types="vite/client" />

// Asset module declarations (Vite 官方 types/client.d.ts 通常已涵蓋，
// 但本專案 tsconfig 有時未自動 include — 明示補齊 *.png / *.webp / *.svg / *.jpg)
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
