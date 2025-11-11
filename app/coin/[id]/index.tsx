import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { LineChart } from "react-native-gifted-charts";
import axios from "axios";

import DetailHeader from "@/components/DetailHeader";
import Loader from "@/components/Loader";
import { useToast } from "@/providers/ToastProvider";
import { getError } from "@/utils";
import { SIZES } from "@/constants";
import Error from "@/components/Error";

export default function Index() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchCoinData = async () => {
    try {
      const [{ data: coinData }, { data: chartData }] = await Promise.all([
        axios.get(`https://api.coingecko.com/api/v3/coins/${id}`),
        axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`
        ),
      ]);

      const step = Math.floor(chartData.prices.length / 8);

      const reducedData = chartData.prices.filter(
        (_: any, index: number) => index % step === 0
      );

      const formattedChart = reducedData.map(
        ([timestamp, price]: [number, number]) => ({
          value: price,
          dataPointText: new Date(timestamp).toLocaleDateString("en-GB", {
            day: "2-digit",
          }),
        })
      );

      setCoin(coinData);
      setChart(formattedChart);
    } catch (error: any) {
      // console.log("error fecthing data: ", JSON.stringify(error));
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
    fetchCoinData();
  }, []);

  const handleRefresh = async () => {
    setError(null);
    setLoading(true);
    fetchCoinData();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#3b80e0ff" }}>
      <DetailHeader id={id} />
      {error ? (
        <Error onPress={handleRefresh} error={error} />
      ) : loading ? (
        <Loader />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ backgroundColor: "#1A3461" }}>
            <LineChart
              areaChart
              hideDataPoints
              isAnimated
              animationDuration={1200}
              startFillColor="#0BA5A4"
              startOpacity={1}
              endOpacity={0.3}
              initialSpacing={0}
              data={chart}
              spacing={SIZES.width / 8.3}
              thickness={5}
              hideRules
              hideYAxisText
              yAxisColor="#0BA5A4"
              showVerticalLines
              verticalLinesColor="rgba(14,164,164,0.5)"
              xAxisColor="#0BA5A4"
              color="#0BA5A4"
            />
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text style={styles.heading}>Total Supply</Text>
            <Text style={styles.body}>
              {coin?.market_data?.total_supply?.toLocaleString() ?? 0}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text style={styles.heading}>Max Supply</Text>
            <Text style={styles.body}>
              {coin?.market_data?.max_supply?.toLocaleString() ?? 0}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 20, rowGap: 5 }}>
            <Text style={styles.heading}>Max Cap</Text>
            <View>
              <Text style={styles.body}>
                USD: {coin?.market_data?.market_cap?.usd?.toLocaleString() ?? 0}
              </Text>
            </View>
            <View>
              <Text style={styles.body}>
                NGN: {coin?.market_data.market_cap?.ngn?.toLocaleString() ?? 0}
              </Text>
            </View>
            <View>
              <Text style={styles.body}>
                GBP: {coin?.market_data.market_cap.gbp.toLocaleString() ?? 0}
              </Text>
            </View>
          </View>
          <View
            style={{ paddingHorizontal: 20, marginTop: 20, paddingBottom: 10 }}
          >
            <Text style={styles.heading}>Description</Text>
            <Text style={styles.body}>{coin?.description.en}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: "#fff",
    marginBottom: 10,
    fontFamily: "semi-bold",
    fontSize: 20,
  },
  body: {
    color: "rgba(255, 255, 255, 0.7)",
    // marginBottom: 10,
    fontFamily: "regular",
    fontSize: 17,
  },
});
