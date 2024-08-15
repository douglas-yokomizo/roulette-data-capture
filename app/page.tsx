import Image from "next/image";
import afyaLogo from "./favicon.ico";
import Link from "next/link";

const HomePage = () => {
  return (
    <Link href={"/signup"}>
      <div className="flex-1 w-full h-screen justify-center flex flex-col gap-20 items-center">
        <h3>Premiações exclusivas</h3>
        <Image src={afyaLogo} alt="Afya Logo" />
        <p>Toque para iniciar</p>
      </div>
    </Link>
  );
};

export default HomePage;
