import Image from "next/image";
import afyaLogo from "../app/public/images/logoBranco.png";
import Link from "next/link";

const HomePage = () => {
  return (
    <Link href={"/signup"}>
      <div className="h-screen text-white bg-fade w-full bg-cover bg-center flex flex-col justify-center items-center gap-14">
        <h3 className="text-5xl font-bold">Premiações exclusivas</h3>
        <Image src={afyaLogo} alt="Afya Logo" width={700} height={700} />
        <p className="text-3xl animate-pulse">Toque para iniciar</p>
      </div>
    </Link>
  );
};

export default HomePage;
