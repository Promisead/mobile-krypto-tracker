import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import axios from "axios";

import ListComponent from "@/components/ListComponent";
import Loader from "@/components/Loader";
import Header from "@/components/Header";

import { useToast } from "@/providers/ToastProvider";
import { getError } from "@/utils";
import { useMainContext } from "@/providers/MainProvider";
import ErrorComponent from "@/components/Error";
import { useRouter } from "expo-router";

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);

  const { favourites } = useMainContext();

  const router = useRouter();

  const { showToast } = useToast();

  const getCoins = async () => {
    if (!favourites.length) return;

    try {
      setLoading(true);

      const ids = favourites.join(",");

      console.log("IDs: ", ids);

      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
      );

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setCoins(data);
    } catch (error: any) {
      console.error(JSON.stringify(error));
      if (error?.status === 429) {
        showToast("Rate limit exceeded, try again later", "error");
        setError("Rate limit exceeded, try again later");
        return;
      }
      showToast(getError(error), "error");
      setError(getError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoins();
  }, []);

  const handleRefresh = async () => {
    setError(null);
    setLoading(true);
    getCoins();
  };

  if (!favourites.length) {
    return (
      <ErrorComponent
        error="You do not have any favourite yet, star some coins to see them here"
        onPress={() => router.navigate("/")}
        text="Go to coins"
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#3b80e0ff" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#2e6fef",
        }}
      >
        <Text style={{ fontSize: 24, color: "#fff", fontFamily: "bold" }}>
          Favourites
        </Text>
      </View>

      {error ? (
        <ErrorComponent onPress={handleRefresh} error={error} />
      ) : loading ? (
        <Loader />
      ) : (
        <FlatList
          data={coins}
          renderItem={({ item }) => <ListComponent {...item} />}
          keyExtractor={({ id }) => id}
          contentContainerStyle={{
            marginHorizontal: 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={getCoins}
              colors={["#2e6fef", "#fff"]}
              tintColor="#2e6fef"
            />
          }
        />
      )}
    </View>
  );
}
