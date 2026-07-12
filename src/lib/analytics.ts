declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const UMAMI_SCRIPT_URL = import.meta.env.VITE_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';

let umamiLoaded = false;

export function initUmami() {
  if (!UMAMI_WEBSITE_ID || umamiLoaded) return;

  const script = document.createElement('script');
  script.src = UMAMI_SCRIPT_URL;
  script.defer = true;
  script.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
  document.head.appendChild(script);

  umamiLoaded = true;
}

export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  if (window.umami && typeof window.umami.track === 'function') {
    window.umami.track(eventName, data || {});
  }
}

export const Analytics = {
  addIngredient: (ingredientName: string) => {
    trackEvent('add_ingredient', { ingredient: ingredientName });
  },
  generateRecipe: (source: string) => {
    trackEvent('generate_recipe', { source });
  },
  addToShoppingList: (itemName: string) => {
    trackEvent('add_to_shopping_list', { item: itemName });
  },
  shareInvite: (email: string) => {
    trackEvent('share_invite', { email });
  },
};
