import axios from "axios";
import { useState } from "react"
import API from "../../Config/API";

export const ContactForm = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        contents: "",
    });

    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const eventHandler = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error while typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        let tempErrors = {};

        if (!form.name.trim()) tempErrors.name = "Name is required";
        if (!form.email.trim()) {
            tempErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            tempErrors.email = "Enter a valid email";
        }
        if (!form.contents.trim()) tempErrors.contents = "Message is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const contactFromSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");

        if (!validate()) return;

        try {
            setLoading(true);

            const res = await axios.post(
                `${API.BASE_URL}contact-us`,
                form
            );

            if (res.data.success) {
                setSuccessMsg("✅ Message sent successfully!");
                setForm({ name: "", email: "", contents: "" });
            }
        } catch (error) {
            setSuccessMsg("❌ Failed to send message. Try again later.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <section className="w3l-contact-info-main py-5" id="contact">
                <div className="container pt-lg-5 pt-md-4 pt-2">
                    <div className="title-main text-center mx-auto mb-md-5 mb-4" style={{ maxWidth: "700px" }}>
                        <h5 className="small-title mb-1">Get In Touch</h5>
                        <h3 className="title-style">Contact Us</h3>
                    </div>
                    <div className="row">
                        <div className="col-md-6 left-cont-contact pe-md-4">
                            <div className="contact-address p-4">
                                <div className="contact-icon d-flex align-items-center">
                                    <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                                    <div className="ms-3">
                                        <h5 className="contact-text">Visit Us:</h5>
                                        <p>Pustakalaya Road Buxar</p>
                                    </div>
                                </div>
                            </div>
                            <div className="contact-address p-4 mt-4">
                                <div className="contact-icon d-flex align-items-center">
                                    <i className="fas fa-phone-alt" aria-hidden="true"></i>
                                    <div className="ms-3">
                                        <h5 className="contact-text">Call Us:</h5>
                                        <a href="tel:+12 23456790">+91 9296454675</a>
                                    </div>
                                </div>
                            </div>
                            <div className="contact-address p-4 mt-4">
                                <div className="contact-icon d-flex align-items-center">
                                    <i className="fas fa-envelope-open-text" aria-hidden="true"></i>
                                    <div className="ms-3">
                                        <h5 className="contact-text">Mail Us:</h5>
                                        <a href="mailto:info@example.com"> support@parakshtech.com</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 right-cont-contact ps-md-4 mt-md-0 mt-5 mx-auto">
                            <form className="w3layouts-contact-fm" onSubmit={contactFromSubmit}>

                                {successMsg && (
                                    <div className="alert alert-info mb-3">{successMsg}</div>
                                )}

                                <div className="form-group mb-3">
                                    <input
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={form.name}
                                        onChange={eventHandler}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="form-group mb-3">
                                    <input
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={form.email}
                                        onChange={eventHandler}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="form-group mb-3">
                                    <textarea
                                        className={`form-control ${errors.contents ? "is-invalid" : ""}`}
                                        name="contents"
                                        placeholder="Write Message"
                                        rows="4"
                                        value={form.contents}
                                        onChange={eventHandler}
                                    ></textarea>
                                    {errors.contents && (
                                        <div className="invalid-feedback">{errors.contents}</div>
                                    )}
                                </div>

                                <div className="form-group-2 mt-3 text-end">
                                    <button type="submit" className="btn btn-style" disabled={loading}>
                                        {loading ? "Sending..." : "Submit Form"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>




            <div className="map-contact pt-5">
                <iframe className="map-w3layouts"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7197.821026251528!2d83.97490119660452!3d25.57464380229675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1765625380298!5m2!1sen!2sin" loading="lazy" referrerpolicy="no-referrer-when-downgrade" width="100%" height="400" frameborder="0" style={{ border: "0px" }} allowfullscreen=""></iframe>
            </div>
        </>
    )
}