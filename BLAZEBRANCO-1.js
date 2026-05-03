BlazeWhitePrediction.jsx

import { useEffect, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

export default function BlazeWhitePrediction() {
  const [dados, setDados] = useState([]);
  const [chance, setChance] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1")
        .then(res => res.json())
        .then(json => {
          const giros = json.map(g => ({
            cor: g.color,
            numero: g.roll,
          })).reverse();
          setDados(giros);
          setChance(calcularChanceBranco(giros));
        });
    }, 10000);
    return () => clearInterval(intervalo);
  }, []);

  function calcularChanceBranco(giros) {
    const brancos = giros.filter(g => g.cor === "white");
    const distancia = brancos.length > 0 ? giros.length - giros.lastIndexOf(brancos.at(-1)) : giros.length;
    const ultimos = giros.slice(-5);
    const pretos = ultimos.filter(g => g.cor === "black").length;
    const vermelhos = ultimos.filter(g => g.cor === "red").length;

    let chance = 1;
    if (distancia > 20) chance += 30;
    if (distancia > 30) chance += 40;
    if (pretos === 5 || vermelhos === 5) chance += 25;
    return Math.min(chance, 99);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-white bg-zinc-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center"> Blaze Double: Chance de BRANCO</h1>

      <div className="grid grid-cols-10 gap-2 mb-6">
        {dados.slice(0, 10).map((g, i) => (
          <div key={i} className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold ${g.cor === "white" ? "bg-white text-black" : g.cor === "red" ? "bg-red-600" : "bg-black"}`}>
            {g.numero}
          </div>
        ))}
      </div>

      <div className="bg-zinc-800 p-4 rounded-2xl text-center shadow-xl">
        <p className="text-xl mb-2">Chance de vir BRANCO agora:</p>
        <p className={`text-xl font-extrabold ${chance >= 95 ? "text-green-400" : "text-yellow-400"}`}>{chance}%</p>
        {chance >= 95 ? (
          <div className="mt-4 text-green-500 font-semibold flex items-center justify-center gap-2">
            <CircleCheck className="w-5 h-5" />
            SINAL FORTE! Aposte no BRANCO.
          </div>
        ) : (
          <div className="mt-4 text-zinc-400 flex items-center justify-center gap-2">
            <CircleAlert className="w-5 h-5" />
            Aguardando nova oportunidade...
          </div>
        )}
      </div>
    </div>
  );
}
