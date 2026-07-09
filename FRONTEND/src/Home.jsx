import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
export default function Home(){
return (
    <div className="overflow-x-hidden">
    <div className="h-8 bg-gradient-to-b from-green-200 via-green-100 to-white opacity-80 blur-sm sm:h-10"></div>
    <Header />

    <section>
      <Hero />
    </section>

  <div className="h-8 bg-gradient-to-b from-green-200 via-green-100 to-white opacity-80 blur-sm sm:h-10"></div>
    <section>
      <Features />
    </section>
    </div>
);
}
