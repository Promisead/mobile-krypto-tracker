import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const { coins, setCoins } = useMainContext();

  const limit: number = 25;

  const { showToast } = useToast();

  const getCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false`
      );

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setCoins(data);
    } catch (error: any) {
      console.error(error);
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

  const refreshCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setCoins(data);
    } catch (error: any) {
      console.error(error);
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

  const appendCoins = async (page: number) => {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false`
      );

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setCoins([...coins, ...data]);
    } catch (error: any) {
      console.error(error);
      if (error?.status === 429) {
        showToast("Rate limit exceeded, try again later", "error");

        return;
      }
      showToast(getError(error), "error");
    }
  };

  useEffect(() => {
    getCoins();
  }, []);

  const handleRefresh = async () => {
    setError(null);
    setLoading(true);
    refreshCoins();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#3b80e0ff" }}>
      <Header />

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
              onRefresh={() => {
                setPage(1);
                refreshCoins();
              }}
              colors={["#2e6fef", "#fff"]}
              tintColor="#2e6fef"
            />
          }
          onEndReached={() => {
            if (loading) return;

            setPage((prev) => prev + 1);
            appendCoins(page + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <ActivityIndicator
              size="small"
              color="#2e6fef"
              style={{ marginVertical: 10 }}
            />
          }
        />
      )}
    </View>
  );
}
