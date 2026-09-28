import MarketBoard from "@/components/MarketBoard/MarketBoard";
import { getMarketAssets } from "@/lib/getMarketAssets";
import styles from "./main.module.scss";

export default async function Home() {
  const assets = await getMarketAssets();

  return (
    <main className={styles.main}>
      <h1>Trade Terminal</h1>
      <MarketBoard assets={assets} />
    </main>
  );
}