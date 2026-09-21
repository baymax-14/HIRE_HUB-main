import Usegetalljobs from "@/hooks/usegetAlljobs";
import Categoery from "./Categoery";
import Footer from "./Footer";
import Herosection from "./Herosection";
import Latestjob from "./Latestjob";
import Navbar from "./shared/Navbar";
import CompanyMarquee from "./CompanyMarquee";
import HowItWorks from "./HowItWorks";
import CtaBanner from "./CtaBanner";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  Usegetalljobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-purple-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Herosection />
        <CompanyMarquee />
        <Categoery />
        <HowItWorks />
        <Latestjob />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}