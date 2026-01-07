import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../Config/API";


export const OurFeatures = () => {
    const [ourfeaturesdata, setourfeaturesdata] = useState();
    const [ourfeaturesfet, setOurfeaturesFet] = useState();

    const ourfeatures = () => {
        axios.get(`${API.BASE_URL}home-hero/OurFeatures`).then(response => {
            setourfeaturesdata(response?.data?.data?.[0])
            setOurfeaturesFet(response?.data?.data?.slice(1))
        })
    }

    useEffect(() => {
        ourfeatures()
    }, [0])


    return (
        <>
            <section className="w3l-grids-block py-5" id="features">
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="title-main text-center mx-auto mb-md-5 mb-4" style={{ maxwidth: "600px" }}>
                        <h5 className="small-title mb-2">{ourfeaturesdata?.title}</h5>
                        <h3 className="title-style">{ourfeaturesdata?.heading}</h3>
                    </div>
                    <div className="row justify-content-center">
                        {ourfeaturesfet && ourfeaturesfet.map(rows => (
                            <div className="col-lg-4 col-md-6 col-sm-10">

                                <div className="bottom-block">
                                    <a href="#" className="d-block">
                                        <img src={`${API.BASE_URL_IMAGES}${rows.images}`} style={{ width: "25%" }} />
                                        {/*<i className="fas fa-business-time"></i>*/}
                                        <h3 className="mt-3 mb-2"> {rows?.sub_heading}</h3>
                                        <p className="" dangerouslySetInnerHTML={{ __html: rows?.sub_content }}></p>
                                    </a>
                                </div>

                            </div>
                        ))}
                       
                    </div>
                </div>
            </section>
        </>
    );
}