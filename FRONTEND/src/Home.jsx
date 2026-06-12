import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
export default function Home(){
return (
    <>
    <div className="h-10 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
    <Header />

    <section>
      <Hero />
    </section>

  <div className="h-22 bg-gradient-to-b  from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
    <section>
      <Features />
    </section>
    </>
);
}
