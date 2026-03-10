import Hoodie from "../assets/Hodie/hoodie_1.png"
import Three from "../components/Three"

function Home(){
    return(
    <>
      <section id="page-1" className="w-full h-screen pl-8 pr-8">
        <div className="flex items-center justify-between h-full">
            <div id="page-count" className="flex flex-col gap-4 w-30">
                <div className="w-30 h-1.25 rounded-2xl bg-n-100"></div>
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
            </div>

            <div id="Model_3D"  className="w-150 h-150 ">
                <Three/>
            </div>

            <div id="infomation" className="flex flex-col items-center justify-around border-4 w-22 h-112 rounded-2xl border-n-100">
                <img src={Hoodie} className="object-contain w-full h-auto "/>
                <div className="flex">
                    <p className="font-Jaro text-2xl text-p-50 [writing-mode:vertical-rl] rotate-180">BEST SELLER IN 2026</p>
                    <p className="font-Jaro text-lg text-n-100 [writing-mode:vertical-rl] rotate-180">THUNDER HODIE BLACK BOIZ</p>
                </div>
                <p className="flex items-center justify-center w-16 h-16 text-3xl border-2 rounded-full cursor-pointer font-Jaro text-n-100 border-n-100 hover:bg-n-100 hover:text-p-50">
                    &rarr;
                </p>

            </div>
        </div>
      </section>  


      <section id="page-2" className="w-full h-screen pl-8 pr-8">
        <div className="flex items-center justify-between h-full">
            <div id="page-count" className="flex flex-col gap-4 w-30">
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                <div className="w-30 h-1.25 rounded-2xl bg-n-100"></div>
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
            </div>
            <img src={Hoodie} className="object-contain w-auto h-full"/>
            <div id="Buy_NewArrival"  className="flex items-center h-150">
                
                <div className="flex flex-col justify-around gap-4 p-4 h-130 w-90 rounded-2xl bg-n-200">
                    <p className="text-3xl font-medium font-Genos text-n-100">COLOR</p>
                    <div className="flex w-full h-[5px] items-center justify-between">
                        <div className="w-[25%] h-full bg-n-50 rounded-2xl"></div>
                        <div className="w-[25%] h-full bg-p-50 rounded-2xl"></div>
                        <div className="w-[25%] h-full bg-n-300 rounded-2xl"></div>
                    </div>

                    <p className="text-3xl font-medium font-Genos text-n-100">SIZE</p>
                    <div className="flex justify-around w-full">
                        <button className="text-2xl rounded-full cursor-pointer font-Genos size-16 text-n-100 hover:bg-n-50 border-3 border-n-100">
                        M
                        </button>

                        <button className="text-2xl rounded-full cursor-pointer font-Genos size-16 text-n-100 hover:bg-n-50 border-3 border-n-100">
                        L
                        </button>

                        <button className="text-2xl rounded-full cursor-pointer font-Genos size-16 text-n-100 hover:bg-n-50 border-3 border-n-100">
                        XL
                        </button>
                    </div>

                    <p className="text-3xl font-medium font-Genos text-n-100">MATERIAL</p>
                    <p className="w-full pl-4 font-light text-24 font-Genos text-n-100">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                    <p className="text-6xl font-extrabold text-right font-Genos text-n-100">449$</p>
                </div>
            </div>
          
        </div>
      </section>  


      <section id="page-3" className="w-full h-screen pl-8 pr-8">
        <div className="flex items-center justify-between h-full">
            <div id="page-count" className="flex flex-col gap-4 w-30">
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
                <div className="w-30 h-1.25 rounded-2xl bg-n-100"></div>
                <div className="w-23 h-1.25 rounded-2xl bg-n-50"></div>
            </div>
            
            <div className="relative flex items-center w-[80%] h-full">
                <div className="absolute flex flex-col items-end z-15">
                    <p className="text-6xl font-Jaro text-n-100">"STORY"</p>
                    <p className="text-2xl font-light w-[60%] text-right font-Genos text-n-100">“It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).”</p>
                </div>
                <img src="/Pic_Home1.png" className="object-contain w-auto h-full"/>
            </div>
        </div>
      </section> 


      <section id="page-4" className="w-full h-auto pt-12">
        <div className="flex flex-col items-center justify-between h-full gap-4">
            <p className="text-6xl font-Jaro text-n-100">“NEW ARRIVAL 2026”</p>
            <img src="/Pic_Home2.png" className="object-contain w-full h-auto "/>
        </div>
      </section> 
    </>
    )
}export default Home