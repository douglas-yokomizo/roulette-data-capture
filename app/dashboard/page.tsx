"use client";
import Image from "next/image";
import { NewsletterSubscribers } from "../components/NewLetterSubs";
import { TotalUsers } from "../components/TotalUsers";
import { UserAges } from "../components/UserAge";
import afyaLogo from "../public/images/logoRosa.png";
import { UsersChoice } from "../components/UsersChoice";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-8">
        <Image src={afyaLogo} alt="Afya logo" width={100} />
      </div>
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <TotalUsers />
        <NewsletterSubscribers />
      </div>
      <div className="flex gap-6">
        <div className="w-2/3">
          <UserAges />
        </div>
        <div className="w-1/3">
          <UsersChoice />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
