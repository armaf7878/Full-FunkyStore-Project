import { Outlet } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import Footer from "./components/Footer";
function Admin() {
  
  return (
    <>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Genos:ital,wght@0,100..900;1,100..900&display=swap');
      </style>
      <div className="relative w-full h-auto">
        <AdminHeader />
        <main className="w-full h-full">
          <Outlet /> 
          <Footer/>
        </main>
        
      </div>
    </>
  )
}

export default Admin
