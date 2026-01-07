import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../Config/API";

export const WhyChooseUs = () => {

    const [whychooseusdata, setWhyChooseusData] = useState();
    const [whychooseusdatafet, setWhyChooseusDatafet] = useState();

   const whychooseus =() =>{
          axios.get(`${API.BASE_URL}home-hero/Whychooseus`).then(response => {
            setWhyChooseusData(response?.data?.data?.[0])
            setWhyChooseusDatafet(response?.data?.data?.slice(1));
        })
    }


        useEffect(() => {
            whychooseus()
        }, [0])
    return (
        <>
            <section className="w3l-servicesblock py-5" id="whychoose">
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h5 className="small-title mb-2">{whychooseusdata?.title}</h5>
                            <h3 className="title-style">{whychooseusdata?.heading}</h3>
                            <p className="mt-3" dangerouslySetInnerHTML={{ __html: whychooseusdata?.contents }}></p>
                            <div className="row two-grids mt-5 pt-lg-4">
                                {whychooseusdatafet && whychooseusdatafet.map(rows=>(
                                     <div className="col-sm-6 grids_info d-flex">
                                        <img src={`${API.BASE_URL_IMAGES}${rows.images}`} style={{width:"15%",height:"50px"}} />
                                    {/* <i className="fas fa-hand-holding-usd"></i> */}
                                    <div className="detail ms-3">
                                        <h4>{rows?.sub_heading}</h4>
                                        <p  dangerouslySetInnerHTML={{ __html: rows?.sub_content }}>
                                        </p>
                                    </div>
                                </div>
                                ))}
                               
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1 text-end mt-lg-0 mt-5 position-relative">
                            <img src={`${API.BASE_URL_IMAGES}${whychooseusdata?.images}`} alt="" className="img-fluid radius-image" />
                            <div className="imginfo__box">
                                <h6 className="imginfo__title">{whychooseusdata?.assets}+</h6>
                                <p>Years of experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}