import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  
  return (
    <>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Genos:ital,wght@0,100..900;1,100..900&display=swap');
      </style>
      <div className="relative w-full h-auto">
        <Header />
        <main className="w-full h-full">
          <Outlet /> 
          <Footer/>
        </main>
        
      </div>
    </>
  )
}

export default App
