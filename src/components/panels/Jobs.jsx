import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../Config/API";
import { Link } from "react-router-dom";

export const Jobs = () => {
    const [jobs, setJobs] = useState();
    const jobsFind = () => {
        axios.get(`${API.BASE_URL}home-hero/Jobs`).then(response => {
            setJobs(response?.data?.data)
        })
    }

    useEffect
        (() => {
            jobsFind()
        }, [0])

    return (
        <>
            <section className="w3l-grids-block py-5" id="features">
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="title-main text-center mx-auto mb-md-5 mb-4" style={{ maxwidth: "600px" }}>
                        <h5 className="small-title mb-2">Careers</h5>
                        <h3 className="title-style">We are hiring!</h3>
                    </div>
                    <div className="row justify-content-center">
                        {jobs && jobs?.map(rows => (
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="bottom-block">
                                    <Link to={`/careers/job-detail/${rows?.id}`} className="d-block">

                                        <h3 className="mt-3 mb-2"> <i className="fas fa-business-time"></i> &nbsp; {rows?.title}</h3>
                                        <p dangerouslySetInnerHTML={{
                                            __html: rows.contents?.split("</p>")[0] + "</p>",
                                        }}></p>
                                    </Link>
                                </div>
                            </div>
                        ))}



                    </div>
                </div>
            </section>
        </>
    )
}