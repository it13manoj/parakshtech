import { useEffect, useState } from "react";
import API from "../../Config/API";
import axios from "axios";


export const ExpertPeople = () => {
    const [getweb, setweb] = useState();
    const [template, setTemplate] = useState();


    const loadWeb = () => {
        axios.get(`${API.BASE_URL}home-hero/ExpertPeople`).then(response => {
            setweb(response?.data?.data?.[0])
            setTemplate(response?.data?.data?.slice(1));
        })
    }



    useEffect(() => {
        loadWeb()
    }, [0])

    return (
        <>
            <section className="w3l-team py-5" id="team">
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="title-main text-center mx-auto mb-md-5 mb-4" style={{ maxwidth: "700px" }}>
                        <h5 className="small-title mb-2">{getweb?.title}</h5>
                        <h3 className="title-style">{getweb?.heading}</h3>
                    </div>
                    <div className="row text-center">
                        {template && template.map(rows => (
                            <div className="team-info col-md-3 col-6">
                                <div className="column position-relative">
                                    <a href="#"><img src={`${API.BASE_URL_IMAGES}${rows?.images}`} alt="" className="img-fluid" style={{height:"400px"}}/></a>
                                </div>
                                <h4><a href="#team">{rows?.title}</a></h4>
                                <p>{rows?.heading}</p>
                               
                            </div>
                        ))}

                      
                    </div>
                </div>
            </section>
        </>
    );
}