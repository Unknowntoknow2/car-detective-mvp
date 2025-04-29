
export type DeviceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Breakpoint values in pixels
 * Matches Tailwind's default breakpoints
 */
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Utility for checking responsive behavior in tests and components
 */
export const responsiveUtils = {
  /**
   * Get the current device size based on window width
   */
  getCurrentDeviceSize(): DeviceSize {
    if (typeof window === 'undefined') return 'md'; // Default for SSR
    
    const width = window.innerWidth;
    
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  },
  
  /**
   * Check if the current device is mobile (xs or sm)
   */
  isMobile(): boolean {
    const size = this.getCurrentDeviceSize();
    return size === 'xs' || size === 'sm';
  },
  
  /**
   * Check if the current device is tablet (md)
   */
  isTablet(): boolean {
    return this.getCurrentDeviceSize() === 'md';
  },
  
  /**
   * Check if the current device is desktop (lg, xl, or 2xl)
   */
  isDesktop(): boolean {
    const size = this.getCurrentDeviceSize();
    return size === 'lg' || size === 'xl' || size === '2xl';
  },
  
  /**
   * Create a test string that identifies the current device size
   * Useful for debugging responsive issues
   */
  createResponsiveTestElement(): HTMLElement {
    const el = document.createElement('div');
    el.id = 'responsive-test';
    el.style.position = 'fixed';
    el.style.bottom = '0';
    el.style.right = '0';
    el.style.padding = '4px 8px';
    el.style.backgroundColor = 'rgba(0,0,0,0.5)';
    el.style.color = 'white';
    el.style.fontSize = '12px';
    el.style.zIndex = '9999';
    
    const updateSize = () => {
      const size = this.getCurrentDeviceSize();
      el.textContent = `${size} (${window.innerWidth}px)`;
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return el;
  },
  
  /**
   * Enable responsive testing visual helper
   * Adds a small indicator showing current device size
   */
  enableResponsiveTestingHelper(): void {
    if (document.getElementById('responsive-test')) return;
    
    const el = this.createResponsiveTestElement();
    document.body.appendChild(el);
  },
  
  /**
   * Disable responsive testing visual helper
   */
  disableResponsiveTestingHelper(): void {
    const el = document.getElementById('responsive-test');
    if (el) el.remove();
  }
};

// Add a global method to toggle responsive testing
// Can be called from browser console for debugging
if (typeof window !== 'undefined') {
  (window as any).toggleResponsiveTesting = () => {
    const el = document.getElementById('responsive-test');
    if (el) {
      responsiveUtils.disableResponsiveTestingHelper();
    } else {
      responsiveUtils.enableResponsiveTestingHelper();
    }
  };
}
