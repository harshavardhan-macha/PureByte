import Header from "../components/Header";
function About(){
    return(
        <>
       <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
        <Header />
        <div className="text-bold justify-between">
            About
        </div>
        </>
    );
}
export default About;