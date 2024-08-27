"use client";
import Image from "next/image";
import { NewsletterSubscribers } from "../components/NewLetterSubs";
import { TotalUsers } from "../components/TotalUsers";
import { UserAges } from "../components/UserAge";
import afyaLogo from "../public/images/logoRosa.png";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Image src={afyaLogo} alt="Afya logo" width={100} />
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <TotalUsers />
        <NewsletterSubscribers />
      </div>
      <UserAges />
    </div>
  );
};

export default Dashboard;
