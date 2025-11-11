export {};

declare global {
  type ToastContextType = {
    showToast: (
      message: string,
      type?: "info" | "error" | "success" | "warning"
    ) => void;
  };

  type Coin = {
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
    id: string;
  };

  interface CoinData {
    name: string;
    symbol: string;
    description: { en: string };
    market_data: {
      market_cap: {
        usd: number;
        gbp: number;
        ngn: number;
      };
      total_supply: number;
      max_supply: number;
    };
  }

  interface ChartPoint {
    value: number;
    // label: string;
  }
}
