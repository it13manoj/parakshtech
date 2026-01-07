import axios from "axios";
import { useEffect, useState } from "react"
import API from "../../Config/API";
import { Link } from "react-router-dom";


export const AboutUs = () => {
    const [templates, setTemplates] = useState();

    const getAboutTemplates = () => {
        try {
            axios.get(`${API.BASE_URL}home-hero/AboutUs`).then(res => {
                setTemplates(res?.data?.data?.[0]);

            })
        } catch {

        }
    }

    useEffect(() => {
        getAboutTemplates()
    }, [0])

    console.log(templates?.assets);
    

    return (
        <>
            <section className="w3l-about-2 py-5">
                <div className="container py-md-5 py-4">
                    <div className="row align-items-center">
                        <div className="col-lg-6 about-2-secs-left">
                            <h5 className="small-title mb-2">{templates?.title}</h5>
                            <h3 className="title-style mb-2">{templates?.heading}</h3>
                            <p dangerouslySetInnerHTML={{ __html: templates?.contents }} ></p>
                            <ul className="list-about-2 mt-sm-4 mt-3">
                                {templates && templates?.assets?.map(rows => (
                                    <li className="py-1"><i className="far fa-check-square"></i>{rows?.sub_heading}</li>
                                ))}
                            </ul>
                            <Link className="btn btn-style mt-lg-5 mt-4" to="/services">View Our Services</Link>
                        </div>
                        <div className="col-lg-6 about-2-secs-right mt-lg-4 mt-5">
                            <img src={`${API.BASE_URL_IMAGES}${templates?.images}`} alt="" className="img-fluid radius-image" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}