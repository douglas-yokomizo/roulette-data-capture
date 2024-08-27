import { useEffect, useState } from "react";
import { fetchUsersData } from "@/app/utils/supabase/client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UsersChoice = () => {
  const [choicesData, setChoicesData] = useState<
    { name: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchChoices = async () => {
      const users = await fetchUsersData();
      const choiceCounts: { [key: string]: number } = {};

      users.forEach((user) => {
        const choice = user.choice || "Não especificado";
        choiceCounts[choice] = (choiceCounts[choice] || 0) + 1;
      });

      const choicesArray = Object.keys(choiceCounts).map((choice) => ({
        name: choice,
        count: choiceCounts[choice],
      }));

      setChoicesData(choicesArray);
    };

    fetchChoices();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D8005F"];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 pb-16">
      <h2 className="text-xl font-semibold mb-4">Momento da jornada</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={choicesData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {choicesData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { UsersChoice };
