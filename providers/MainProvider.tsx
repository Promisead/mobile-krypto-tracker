import { createContext, useContext, useState } from "react";

const mainContext = createContext<{
  favourites: string[];
  setFavourites: React.Dispatch<React.SetStateAction<string[]>>;

  coins: Coin[];
  setCoins: React.Dispatch<React.SetStateAction<Coin[]>>;
} | null>(null);

export default function MainProvider({
  favourites,
  setFavourites,
  children,
}: {
  favourites: string[];
  setFavourites: React.Dispatch<React.SetStateAction<string[]>>;
  children: React.ReactNode;
}) {
  const [coins, setCoins] = useState<Coin[]>([]);
  return (
    <mainContext.Provider
      value={{ favourites, setFavourites, coins, setCoins }}
    >
      {children}
    </mainContext.Provider>
  );
}

export const useMainContext = () => {
  const context = useContext(mainContext);

  if (!context)
    throw new Error("useMainContext must be used within a MainProvider");

  return context;
};
