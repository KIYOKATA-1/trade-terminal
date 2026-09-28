import { getMarketAssets } from "@/lib/getMarketAssets";
import styles from "./main.module.scss";

export default async function Home() {
  const assets = await getMarketAssets();

  return (
    <main className={styles.main}>
      <h1>Trade Terminal</h1>

      <div className={styles.market}>
        {assets.map((asset) => (
          <article className={styles.asset} key={asset.symbol}>
            <div>
              <h2>{asset.name}</h2>
              <span>{asset.symbol}</span>
            </div>

            <strong>
              ${asset.price.toLocaleString("en-US")}
            </strong>

            <span
              className={
                asset.changePercent >= 0
                  ? styles.positive
                  : styles.negative
              }
            >
              {asset.changePercent >= 0 ? "+" : ""}
              {asset.changePercent.toFixed(2)}%
            </span>
          </article>
        ))}
      </div>
    </main>
  );
}