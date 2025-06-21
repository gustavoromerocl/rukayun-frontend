"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react";

const data = [
  { name: "Ene", adopciones: 4, solicitudes: 10 },
  { name: "Feb", adopciones: 3, solicitudes: 8 },
  { name: "Mar", adopciones: 5, solicitudes: 12 },
  { name: "Abr", adopciones: 7, solicitudes: 15 },
  { name: "May", adopciones: 6, solicitudes: 14 },
  { name: "Jun", adopciones: 8, solicitudes: 18 },
  { name: "Jul", adopciones: 9, solicitudes: 20 },
  { name: "Ago", adopciones: 11, solicitudes: 22 },
  { name: "Sep", adopciones: 10, solicitudes: 21 },
  { name: "Oct", adopciones: 12, solicitudes: 25 },
  { name: "Nov", adopciones: 14, solicitudes: 28 },
  { name: "Dic", adopciones: 15, solicitudes: 30 },
]

export function ActivityChart() {
  const [adopcionesColor, setAdopcionesColor] = useState("oklch(0 0 0)");
  const [solicitudesColor, setSolicitudesColor] = useState("oklch(0 0 0)");

  useEffect(() => {
    // Using a timeout to ensure CSS variables are applied
    const timer = setTimeout(() => {
      const style = getComputedStyle(document.body);
      const chart1Var = style.getPropertyValue('--chart-1').trim();
      const chart2Var = style.getPropertyValue('--chart-2').trim();
      
      if (chart1Var) setAdopcionesColor(chart1Var);
      if (chart2Var) setSolicitudesColor(chart2Var);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="adopciones"
          stroke={adopcionesColor}
          strokeWidth={2}
          name="Adopciones"
          dot={{ r: 4, fill: adopcionesColor, strokeWidth: 1, stroke: 'hsl(var(--background))' }}
        />
        <Line
          type="monotone"
          dataKey="solicitudes"
          stroke={solicitudesColor}
          strokeWidth={2}
          name="Solicitudes"
          dot={{ r: 4, fill: solicitudesColor, strokeWidth: 1, stroke: 'hsl(var(--background))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 