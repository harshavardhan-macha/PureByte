import Header from "../components/Header"
function Features(){
    return(
         <>
         <div className="sm:h-10  h-8 bg-gradient-to-b from-green-200 via-green-100 to-white blur-sm opacity-80"></div>
         <Header />
        <div className="min-h-screen px-4 sm:px-6 lg:px-16 md:px-10 py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl mx-auto">
         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-green-500">
            Features
         </h1>
         <p className="mt-4 text-sm sm:text-base md:text-lg  text-gray-600leading-relaxed">
            Discover the powerful Ai food detection features of PureByte.
         </p>
        </div>
        </div>
        </>
    );
}
export default Features;