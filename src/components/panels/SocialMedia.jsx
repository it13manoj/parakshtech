import { Link } from "react-router-dom";
import "../../index.css"

export const SocialMedia = () => {
    return (
        <>
            <section className="w3l-grids-block py-5" >
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="title-main text-center mx-auto mb-md-5 mb-4" style={{ maxwidth: "600px" }}>
                        <h5 className="small-title mb-2">SOCIAL</h5>
                        <h3 className="title-style">Follow us for the latest updates</h3>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-3 sub-one-left">
                          
                            <ul className="socialMedia pt-lg-1">
                                <li><Link to="https://www.facebook.com/people/Paraksh-Sharma/pfbid02kDxURo3yks5bV91njfKh32wD5P8MU9d8PKtdCoiR5UM1BbLQgBbKgcgasYMvhWSKl/" target="_blank"><span className="fab fa-facebook-f"></span></Link></li>
                                {/* <li><Link to="#twitter"><span className="fab fa-twitter"></span></Link></li> */}
                                <li><Link to="https://www.linkedin.com/company/parakshtech" target="_blank"><span className="fab fa-linkedin-in"></span></Link></li>
                                {/* <li><Link to="#google-plus"><span className="fab fa-google-plus-g"></span></Link></li> */}
                                <li><Link to="https://www.instagram.com/parakshtech/" target="_blank"><span className="fab fa-instagram"></span></Link></li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}