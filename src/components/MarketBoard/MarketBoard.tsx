"use client";

import { useState } from "react";
import type { MarketAsset } from "@/types/market";
import styles from "./MarketBoard.module.scss";

type MarketBoardProps = {
  assets: MarketAsset[];
};

export default function MarketBoard({ assets }: MarketBoardProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const selectedAsset = assets.find(
    (asset) => asset.symbol === selectedSymbol
  );

  return (
    <div className={styles.dashboard}>
      <section className={styles.market}>
        <h2 className={styles.heading}>Рынок</h2>

        {assets.map((asset) => (
          <button
            key={asset.symbol}
            type="button"
            onClick={() => setSelectedSymbol(asset.symbol)}
            className={`${styles.asset} ${
              selectedSymbol === asset.symbol ? styles.selected : ""
            }`}
          >
            <span>
              <strong>{asset.name}</strong>
              <small className={styles.symbol}>{asset.symbol}</small>
            </span>

            <strong>${asset.price.toLocaleString("en-US")}</strong>

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
          </button>
        ))}
      </section>

      <aside className={styles.details}>
        {selectedAsset ? (
          <>
            <span className={styles.caption}>ВЫБРАННЫЙ АКТИВ</span>
            <h2>{selectedAsset.name}</h2>
            <p>{selectedAsset.symbol}</p>
            <strong className={styles.price}>
              ${selectedAsset.price.toLocaleString("en-US")}
            </strong>
          </>
        ) : (
          <p>Выберите монету в списке, чтобы увидеть её данные.</p>
        )}
      </aside>
    </div>
  );
}