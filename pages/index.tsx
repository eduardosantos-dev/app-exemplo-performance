import type { NextPage } from "next";
import React, { FormEvent, useCallback, useState } from "react";
import { SearchResults } from "../components/SearchResults";

type Results = {
  totalPrice: number;
  data: any[];
};

const Home: NextPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Results>({
    totalPrice: 0,
    data: [],
  });

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();
    const products = data.map((product: any) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        priceFormatted: formatter.format(product.price),
      };
    });

    const totalPrice = data.reduce((total: any, product: any) => {
      return total + product.price;
    }, 0);

    setResults({ totalPrice, data: products });
  };

  const addToWishList = useCallback(async (id: number) => {
    console.log(id);
  }, []);

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults
        results={results.data}
        totalPrice={results.totalPrice}
        onAddToWishList={addToWishList}
      />
    </div>
  );
};

export default Home;
