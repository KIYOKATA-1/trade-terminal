"use client";

import { useState, type FormEvent } from "react";
import type { MarketAsset } from "@/types/market";
import styles from "./MarketBoard.module.scss";

type MarketBoardProps = {
  assets: MarketAsset[];
};

type Positions = Record<string, number>;

const START_BALANCE = 10_000;

export default function MarketBoard({ assets }: MarketBoardProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [balance, setBalance] = useState(START_BALANCE);
  const [positions, setPositions] = useState<Positions>({});
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const selectedAsset = assets.find(
    (asset) => asset.symbol === selectedSymbol
  );

  const ownedQuantity = selectedAsset
    ? positions[selectedAsset.symbol] ?? 0
    : 0;

  function handleTrade(event: FormEvent<HTMLFormElement>, side: "buy" | "sell") {
    event.preventDefault();

    if (!selectedAsset) return;

    const tradeAmount = Number(amount);

    if (!Number.isFinite(tradeAmount) || tradeAmount <= 0) {
      setMessage("Введите сумму больше нуля.");
      return;
    }

    if (selectedAsset.price <= 0) {
      setMessage("Цена актива недоступна.");
      return;
    }

    const quantity = tradeAmount / selectedAsset.price;

    if (side === "buy") {
      if (tradeAmount > balance) {
        setMessage("Недостаточно средств на балансе.");
        return;
      }

      setBalance((current) => current - tradeAmount);
      setPositions((current) => ({
        ...current,
        [selectedAsset.symbol]:
          (current[selectedAsset.symbol] ?? 0) + quantity,
      }));
      setMessage(`Покупка ${selectedAsset.name} выполнена.`);
    } else {
      if (quantity > ownedQuantity + 1e-10) {
        setMessage("Недостаточно монет для продажи.");
        return;
      }

      setBalance((current) => current + tradeAmount);
      setPositions((current) => ({
        ...current,
        [selectedAsset.symbol]: Math.max(
          0,
          (current[selectedAsset.symbol] ?? 0) - quantity
        ),
      }));
      setMessage(`Продажа ${selectedAsset.name} выполнена.`);
    }

    setAmount("");
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.market}>
        <h2 className={styles.heading}>Рынок</h2>

        {assets.map((asset) => (
          <button
            key={asset.symbol}
            type="button"
            onClick={() => {
              setSelectedSymbol(asset.symbol);
              setAmount("");
              setMessage("");
            }}
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
        <div className={styles.balance}>
          <span>Виртуальный баланс</span>
          <strong>${balance.toFixed(2)}</strong>
        </div>

        {selectedAsset ? (
          <>
            <span className={styles.caption}>ВЫБРАННЫЙ АКТИВ</span>
            <h2>{selectedAsset.name}</h2>
            <p>{selectedAsset.symbol}</p>

            <strong className={styles.price}>
              ${selectedAsset.price.toLocaleString("en-US")}
            </strong>

            <p>У вас: {ownedQuantity.toFixed(6)} монет</p>

            <form className={styles.tradeForm} onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="trade-amount">Сумма сделки, USDT</label>

              <input
                id="trade-amount"
                type="number"
                min="0"
                step="any"
                placeholder="Например, 100"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.buy}
                  onClick={(event) =>
                    handleTrade(
                      event as unknown as FormEvent<HTMLFormElement>,
                      "buy"
                    )
                  }
                >
                  Купить
                </button>

                <button
                  type="button"
                  className={styles.sell}
                  onClick={(event) =>
                    handleTrade(
                      event as unknown as FormEvent<HTMLFormElement>,
                      "sell"
                    )
                  }
                >
                  Продать
                </button>
              </div>
            </form>

            <p className={styles.message} role="status">
              {message}
            </p>
          </>
        ) : (
          <p>Выберите монету в списке, чтобы совершить виртуальную сделку.</p>
        )}
      </aside>
    </div>
  );
}