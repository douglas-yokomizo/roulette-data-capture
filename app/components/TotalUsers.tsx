import { useEffect, useState } from "react";
import { fetchUsersData } from "@/app/utils/supabase/client";

const TotalUsers = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const users = await fetchUsersData();
      setTotalUsers(users.length);
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Total de Usuários</h2>
      <p className="text-3xl font-bold">{totalUsers}</p>
    </div>
  );
};

export { TotalUsers };
