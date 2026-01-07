import { useParams } from "react-router-dom";
import { ServicesHeroDetails } from "./panels/Hero";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../Config/API";

export const ServicesDetails = () => {
    const { data } = useParams();
    const [template, setTemplate] = useState();
    const data1 = {
        title: data.replace("-", " ")
    }
    const services = data.replace("-", " ");
    const servicesDetailsGet = () => {
        axios.get(`${API.BASE_URL}home-hero/${services}`).then(response => {
            setTemplate(response?.data?.data?.[0])
        })
    }

    useEffect(() => {
        servicesDetailsGet()
    }, [0])


    return (
        <>
            <ServicesHeroDetails data={data1} />
            <section className="w3l-grids-block py-5" id="feature">
                <div className="container">
                    <div className="title-main text-center mx-auto mb-md-5 mb-4" style={{ maxwidth: "600px" }}>
                        {/* <h5 className="small-title mb-2">Hi</h5>
                        <h3 className="title-style">H</h3> */}
                    </div>
                    <div className="row justify-content-center serviceheading">

                        <div className="col-lg-12 serviceheading">
                            <h3 className="mt-3 mb-2 ">{template?.heading}</h3>
                        </div>
                         <div className="col-md-12 py-5">
                            <p dangerouslySetInnerHTML={{ __html: template?.contents }}></p>
                        </div>
                        <div className="col-lg-5 ">
                            {template?.images && <img src={`${API.BASE_URL_IMAGES}${template?.images}`} style={{width:"100%"}}/>}
                            
                        </div>
                        <div className="col-md-7 py-5">
                            <p dangerouslySetInnerHTML={{ __html: template?.assets }}></p>
                        </div>
                        <div className="col-lg-12 ">
                            <p  dangerouslySetInnerHTML={{ __html: template?.sub_content }}></p>
                        </div>
                        
                    </div>
                    <style>
                        {
                            `
                            .serviceheading h3:hover {
                                color:red
                            }
                            .serviceheading h4:hover {
                                color:red
                            }
                            
                            `
                        }
                    </style>
                </div>
        </section >
        </>
    );
}