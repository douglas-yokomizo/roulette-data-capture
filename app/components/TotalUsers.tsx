import { useEffect, useState } from "react";
import { fetchUsersData } from "@/app/utils/supabase/client";
import CountUp from "react-countup";

const TotalUsers = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const users = await fetchUsersData();
      setTotalUsers(users.length);
      setIsLoaded(true);
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Total de Usuários</h2>
      {isLoaded ? (
        <p className="text-3xl font-bold">
          <CountUp end={totalUsers} duration={2} />
        </p>
      ) : (
        <p className="text-3xl font-bold">0</p>
      )}
    </div>
  );
};

export { TotalUsers };
