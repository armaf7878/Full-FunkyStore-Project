

function Footer(){
    return(
        <>
            <section id="Footer" className="flex items-center justify-between w-full pl-8 pr-8 h-100">
               <div>
                    <p className="text-2xl font-Jaro text-n-100">FUNKY STORE</p>
                    <p className="font-light text-md font-Genos text-n-50"> Descriptive line about what your company does. </p>
                    <img src="/Icon_Social.png" className="object-contain pt-16"/>
               </div>
               <div>
                    <div className="flex gap-16">
                        <div id="Features">
                            <p className="text-lg font-medium font-Genos text-n-100">Features</p>
                            <p className="font-medium text-md font-Genos text-n-50">Core features</p>
                            <p className="font-medium text-md font-Genos text-n-50">Pro experience</p>
                            <p className="font-medium text-md font-Genos text-n-50">Integrations</p>
                        </div>

                        <div id="Learn_more">
                            <p className="text-lg font-medium font-Genos text-n-100">Learn More</p>
                            <p className="font-medium text-md font-Genos text-n-50">Blog</p>
                            <p className="font-medium text-md font-Genos text-n-50">Case studies</p>
                            <p className="font-medium text-md font-Genos text-n-50">Customer stories</p>
                            <p className="font-medium text-md font-Genos text-n-50">Best practices</p>
                        </div>

                        <div id="Support">
                            <p className="text-lg font-medium font-Genos text-n-100">Support</p>
                            <p className="font-medium text-md font-Genos text-n-50">Contact</p>
                            <p className="font-medium text-md font-Genos text-n-50">Support</p>
                            <p className="font-medium text-md font-Genos text-n-50">Legal</p>
                        </div>
                    </div>
               </div>
            </section>
        </>
    )
} export default Footer