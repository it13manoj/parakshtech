import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../../Config/API";
import { CareerHero } from "./Hero";

function JobsDetails() {
    const [template, setTemplate] = useState(null);
    const { id } = useParams(); // ✅ call useParams()

    useEffect(() => {
        if (!id) return;

        axios
            .get(`${API.BASE_URL}jobs/details/${id}`)
            .then((res) => {
                // console.log(res);
                setTemplate(res?.data.data); // ✅ store response
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]); // ✅ run only when id changes
    console.log(template);

    return (
        <>
        <CareerHero />
            <section className="w3l-grids-block py-5" id="feature">
                <div className="container">
                    {template ? (
                        <div>
                            <h1>{template.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: template.contents }} />
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </section>
        </>
    );
}

export default JobsDetails;
