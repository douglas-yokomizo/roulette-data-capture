"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import Image from "next/image";

const AdminPage = () => {
  const [prizes, setPrizes] = useState<any[]>([]);
  const [prize, setPrize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [editingPrizeId, setEditingPrizeId] = useState<number | null>(null);
  const [editingPrizeName, setEditingPrizeName] = useState("");

  const fetchPrizes = async () => {
    const { data, error } = await supabase.from("prizes").select("*");
    if (error) console.error(error);
    else setPrizes(data);
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prize) {
      setError("Esse campo é obrigatório.");
      return;
    }
    setError("");
    const { data, error } = await supabase.from("prizes").insert([
      {
        prize,
        quantity,
        image_url: imageUrl,
        active: true,
      },
    ]);
    if (error) console.error(error);
    else {
      console.log("Prize inserted:", data);
      fetchPrizes(); // Atualiza a lista de prêmios após a inserção
      setPrize("");
      setQuantity(0);
      setImageUrl("");
    }
  };

  const togglePrizeActive = async (id: number, currentStatus: boolean) => {
    const { data, error } = await supabase
      .from("prizes")
      .update({ active: !currentStatus })
      .eq("id", id);
    if (error) console.error(error);
    else {
      setPrizes(
        prizes.map((p) => (p.id === id ? { ...p, active: !currentStatus } : p))
      );
    }
  };

  const updatePrizeQuantity = async (
    id: number,
    newQuantity: number,
    newDailyLimit: number
  ) => {
    const { data, error } = await supabase
      .from("prizes")
      .update({ quantity: newQuantity, daily_limit: newDailyLimit })
      .eq("id", id);
    if (error) console.error(error);
    else {
      setPrizes(
        prizes.map((p) =>
          p.id === id
            ? { ...p, quantity: newQuantity, daily_limit: newDailyLimit }
            : p
        )
      );
    }
  };

  const deletePrize = async (id: number) => {
    const { error } = await supabase.from("prizes").delete().eq("id", id);
    if (error) console.error(error);
    else {
      setPrizes(prizes.filter((p) => p.id !== id));
    }
  };

  const startEditingPrize = (id: number, currentName: string) => {
    setEditingPrizeId(id);
    setEditingPrizeName(currentName);
  };

  const saveEditedPrize = async (id: number) => {
    const { error } = await supabase
      .from("prizes")
      .update({ prize: editingPrizeName })
      .eq("id", id);
    if (error) console.error(error);
    else {
      setPrizes(
        prizes.map((p) => (p.id === id ? { ...p, prize: editingPrizeName } : p))
      );
      setEditingPrizeId(null);
      setEditingPrizeName("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Adicionar Prêmio
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="prize"
            >
              Prêmio
            </label>
            <input
              id="prize"
              type="text"
              placeholder="Nome do Prêmio"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="quantity"
            >
              Quantidade
            </label>
            <input
              id="quantity"
              type="number"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="image_url"
            >
              URL da Imagem
            </label>
            <input
              id="image_url"
              type="text"
              placeholder="URL da Imagem"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Adicionar Prêmio
          </button>
        </form>
      </div>

      <ul className="space-y-4">
        {prizes.map((prize) => (
          <li
            key={prize.id}
            className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex-1">
              {editingPrizeId === prize.id ? (
                <input
                  type="text"
                  value={editingPrizeName}
                  onChange={(e) => setEditingPrizeName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800">
                  {prize.prize}
                </p>
              )}
              <div className="mt-2 flex space-x-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    value={prize.quantity}
                    onChange={(e) =>
                      updatePrizeQuantity(
                        prize.id,
                        Number(e.target.value),
                        prize.daily_limit
                      )
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <p
                className={`mt-2 font-medium ${
                  prize.active ? "text-green-600" : "text-red-600"
                }`}
              >
                {prize.active ? "Ativo" : "Inativo"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src={prize.image_url}
                alt={prize.prize}
                className="w-16 h-16 rounded-lg"
                width={64}
                height={64}
              />
              <button
                onClick={() => togglePrizeActive(prize.id, prize.active)}
                className={`py-2 px-4 rounded-lg text-white ${
                  prize.active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {prize.active ? "Desativar" : "Ativar"}
              </button>
              {editingPrizeId === prize.id ? (
                <button
                  onClick={() => saveEditedPrize(prize.id)}
                  className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Salvar
                </button>
              ) : (
                <button
                  onClick={() => startEditingPrize(prize.id, prize.prize)}
                  className="py-2 px-4 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  Editar
                </button>
              )}
              <button
                onClick={() => deletePrize(prize.id)}
                className="py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
