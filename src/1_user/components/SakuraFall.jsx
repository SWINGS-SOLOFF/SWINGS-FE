// src/components/SakuraFall.jsx
import { useEffect, useState } from "react";

const SakuraFall = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // %
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      size: 20 + Math.random() * 20,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {petals.map((p) => (
        <img
          key={p.id}
          src="/sakura.png"
          alt="sakura"
          className="absolute animate-sakura"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            top: `-50px`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default SakuraFall;
