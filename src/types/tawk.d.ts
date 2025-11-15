declare global {
    interface Window {
      Tawk_API?: {
        hide: () => void;
        show: () => void;
        [key: string]: unknown;
      };
    }
  }
  
  export {};
  