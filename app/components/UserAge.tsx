import { useEffect, useState } from "react";
import { fetchUsersData } from "@/app/utils/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserAges = () => {
  const [ageGroups, setAgeGroups] = useState<{ name: string; count: number }[]>(
    []
  );
  const [allAges, setAllAges] = useState<{ name: string; count: number }[]>([]);
  const [viewMode, setViewMode] = useState("grouped");

  useEffect(() => {
    const fetchAges = async () => {
      const users = await fetchUsersData();
      const ageCounts: { [key: string]: number } = {};
      const individualAges: { [key: string]: number } = {};

      users.forEach((user) => {
        const birthDate = new Date(user.dob);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const group = `${Math.floor(age / 10) * 10}-${
          Math.floor(age / 10) * 10 + 9
        }`;
        ageCounts[group] = (ageCounts[group] || 0) + 1;
        individualAges[age] = (individualAges[age] || 0) + 1;
      });

      const ageGroupsArray = Object.keys(ageCounts).map((group) => ({
        name: group,
        count: ageCounts[group],
      }));

      const allAgesArray = Object.keys(individualAges).map((age) => ({
        name: age,
        count: individualAges[age],
      }));

      setAgeGroups(ageGroupsArray);
      setAllAges(allAgesArray);
    };

    fetchAges();
  }, []);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setViewMode(event.target.value);
  };

  const data = viewMode === "grouped" ? ageGroups : allAges;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Idades dos Usuários</h2>
      <div className="mb-4">
        <label htmlFor="viewMode" className="mr-2">
          Visualizar:
        </label>
        <select id="viewMode" value={viewMode} onChange={handleViewModeChange}>
          <option value="grouped">Agrupado por Intervalos</option>
          <option value="individual">Todas as Idades</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#D8005F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { UserAges };
