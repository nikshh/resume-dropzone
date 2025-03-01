
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: any;
          query_id?: string;
        };
        close: () => void;
        expand: () => void;
        isExpanded: boolean;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
}

const tg = window.Telegram?.WebApp;

export function useTelegram() {
  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    queryId: tg?.initDataUnsafe?.query_id,
    isExpanded: tg?.isExpanded || false,
    onClose: () => tg?.close(),
    closeTelegram: () => tg?.close(),
    expandTelegram: () => tg?.expand(),
  };
}
