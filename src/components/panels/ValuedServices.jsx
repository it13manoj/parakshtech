import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../Config/API";
import "./style.css"
import { Link } from "react-router-dom";




export const ValuedServices = () => {
    const [getweb, setweb] = useState();
    const [template, setTemplate] = useState();
 

    const loadWeb = () => {
        axios.get(`${API.BASE_URL}home-hero/ValuedServices`).then(response => {
            setweb(response?.data?.data?.[0])
            setTemplate(response?.data?.data?.slice(1));
        })
    }

 

    useEffect(() => {
        loadWeb()
    }, [0])


    const removewhiteSpace = (rows) => {
         return rows.replace(/\s+/g, "-").toLowerCase();
    }
    return (
        <>    <section className="home-services py-5" id="services">
            <div className="container py-lg-5 py-md-4 py-2">
                <div className="title-main text-center mx-auto mb-md-5 mb-4" style={{ maxwidth: "700px" }}>
                    <h5 className="small-title mb-2">{getweb?.title}</h5>
                    <h3 className="title-style">{getweb?.heading}</h3>
                </div>

                <div className="row justify-content-center bottom-block" align="center">
                    {template && template.map((rows) => (
                        <div className="col-md-4 py-2">
                            <div className="box-wrap" >
                                <div className="icon">
                                    <img src={`${API.BASE_URL_IMAGES}${rows.images}`} style={{ width: "100%" }} />
                                    {/* <i className="fas fa-donate"></i> */}
                                </div>                                
                                <h4><Link to={`/services/${removewhiteSpace(rows?.sub_heading)}`}>{rows?.sub_heading}</Link></h4>
                                <p dangerouslySetInnerHTML={{ __html: rows?.contents }}></p>
                                {/* <Link to={`/services/${removewhiteSpace(rows?.sub_heading)}`} className="read">Read more</Link> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>
                    {
                        `
                        .box-wrap:hover{
                            box-shadow: 0 25px 98px 0 rgba(0, 0, 0, 0.1);
                            background-color:#ffffff;

                        }
                        .box-wrap{
                            box-shadow:none;
                            background-color:#f9f9f9;
                            height:450px;
                            border-radius:30px
                        } 
                        `
                    }

            </style>
        </section></>
    );
}