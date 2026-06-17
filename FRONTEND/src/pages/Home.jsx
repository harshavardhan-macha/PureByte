import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Featurescard";

export default function Home(){
return (
    <>

    <div className="h-10 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
    <Header />

    <section>
      <Hero />
    </section>

  <div className="h-10 bg-gradient-to-b  pb-15 from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
    <section>
      <Features />
    </section>
    </>
);
}
