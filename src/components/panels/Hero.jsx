import axios from "axios";
import { useEffect, useState } from "react";
import API from "../../Config/API";
import { Link } from "react-router-dom";

const Hero = () => {
  const [heroBanner, setHeroBanner] = useState()



  const hero = () => {
    axios.get(`${API.BASE_URL}home-hero/Hero`).then((res) => {
      setHeroBanner(res?.data?.data)

    })
  }

  useEffect(() => {
    hero()
  }, [0])


  useEffect(() => {
    if (!heroBanner?.length) return; // 🔥 WAIT until slides exist

    const slides = document.querySelectorAll(".slide");
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");

    if (!slides.length || !nextButton || !prevButton) return;

    const auto = true;
    const intervalTime = 3000;
    let slideInterval;

    const nextSlide = () => {
      const current = document.querySelector(".current");
      if (!current) return;

      current.classList.remove("current");

      if (current.nextElementSibling?.classList.contains("slide")) {
        current.nextElementSibling.classList.add("current");
      } else {
        slides[0].classList.add("current");
      }
    };

    const prevSlide = () => {
      const current = document.querySelector(".current");
      if (!current) return;

      current.classList.remove("current");

      if (current.previousElementSibling?.classList.contains("slide")) {
        current.previousElementSibling.classList.add("current");
      } else {
        slides[slides?.length - 1].classList.add("current");
      }
    };

    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    if (auto) {
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    return () => {
      nextButton.removeEventListener("click", nextSlide);
      prevButton.removeEventListener("click", prevSlide);
      clearInterval(slideInterval);
    };
  }, [heroBanner]); // 🔥 THIS LINE FIXES EVERYTHING




  return (

    <>
      <div className="slider">

        {heroBanner?.map((rows, index) => (
          <div
            key={index}
            className={`slide ${index === 0 ? "current" : ""}`}
            style={{
              backgroundImage: `url(${API.BASE_URL_IMAGES}${rows.images})`,
              backgroundSize: "cover"
            }}
          >
            <div className="bg-layer">
              <div className="content">
                <h6>{rows.title}</h6>
                <h3>{rows.heading}</h3>
                <a href="/about" className="btn btn-style mt-4">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        ))}


      </div>

      <div className="buttons">
        <button id="prev"><i className="fas fa-arrow-left"></i></button>
        <button id="next"><i className="fas fa-arrow-right"></i></button>
      </div>
    </>
  );
};



const AboutHero = () => {
  const [about_Hero, setAboutHero] = useState()
  const aboutheros = () => {
    axios.get(`${API.BASE_URL}home-hero/AboutHero`).then((res) => {
      setAboutHero(res?.data?.data?.[0])

    })
  }
  useEffect(() => {
    aboutheros()
  }, [0])

  return (
    <>
      <section className="inner-banner py-5"
        style={{
          marginTop: "4.5%",
          //  minHeight: "60vh",
          backgroundImage: `url(${API.BASE_URL_IMAGES}${about_Hero?.images})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}

      >
        <div className="w3l-breadcrumb py-lg-5">
          <div className="container pt-5 pb-sm-4">
            <h4 className="inner-text-title font-weight-bold pt-sm-5 pt-4">{about_Hero?.title}</h4>
            <ul className="breadcrumbs-custom-path">
              <li><Link to="/">{about_Hero?.heading}</Link></li>
              <li className="active"><i className="fas fa-angle-right mx-2"></i>{about_Hero?.sub_heading}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

const ServicesHero = () => {
  const [service_Hero, setServiceHero] = useState()
  const serviceheros = () => {
    axios.get(`${API.BASE_URL}home-hero/Servicesmain`).then((res) => {
      setServiceHero(res?.data?.data?.[0])
    })
  }


  useEffect(() => {
    serviceheros()
  }, [0])
  return (
    <>
      <section className="inner-banner py-5" style={{
        marginTop: "4.5%",
        //  minHeight: "60vh",
        backgroundImage: `url(${API.BASE_URL_IMAGES}${service_Hero?.images})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
        <div className="w3l-breadcrumb py-lg-5" >
          <div className="container pt-5 pb-sm-4">
            <h4 className="inner-text-title font-weight-bold pt-sm-5 pt-4">{service_Hero?.title}</h4>
            <ul className="breadcrumbs-custom-path">
              <li><Link to="/">{service_Hero?.heading}</Link></li>
              <li className="active"><i className="fas fa-angle-right mx-2"></i>{service_Hero?.sub_heading}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}


const ServicesHeroDetails = ({data}) => {
  const [service_Hero, setServiceHero] = useState()
  const serviceheros = () => {
    axios.get(`${API.BASE_URL}home-hero/Servicesmain`).then((res) => {
      setServiceHero(res?.data?.data?.[0])
    })
  }


  useEffect(() => {
    serviceheros()
  }, [0])

const titleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  return (
    <>
      <section className="inner-banner py-5" style={{
        marginTop: "4.5%",
        //  minHeight: "60vh",
        backgroundImage: `url(${API.BASE_URL_IMAGES}${service_Hero?.images})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
        <div className="w3l-breadcrumb py-lg-5" >
          <div className="container pt-5 pb-sm-4">
            <h4 className="inner-text-title font-weight-bold pt-sm-5 pt-4">{titleCase(data?.title)}</h4>
            <ul className="breadcrumbs-custom-path">
              <li><Link to="/">{service_Hero?.heading}</Link></li>
              <li className="active"><i className="fas fa-angle-right mx-2"></i>{"Service Details"}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}


const WeManageYourBusiness = () => {
  const [service_Hero_sub, setServiceHeroSub] = useState()
  const serviceherosSub = () => {
    axios.get(`${API.BASE_URL}home-hero/Servicessub`).then((res) => {
      setServiceHeroSub(res?.data?.data?.[0])
    })
  }
  useEffect(() => {
    serviceherosSub()
  }, [0])
  return (
     <section className="w3l-about-2">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 about-2-secs-left">
                            <h5 className="small-title mb-2">{service_Hero_sub?.title}</h5>
                            {/* <h3 className="title-style mb-2">{templates?.heading}</h3> */}
                            <p className="mt-4 text-lights" dangerouslySetInnerHTML={{ __html: service_Hero_sub?.contents }} ></p>
                            
                            <Link to="/contact" className="btn btn-style mt-md-5 mt-4">Contact Us</Link>
                        </div>
                        <div className="col-lg-6 about-2-secs-right mt-lg-4 mt-5">
                            <img src={`${API.BASE_URL_IMAGES}${service_Hero_sub?.images}`} alt="" className="img-fluid radius-image" style={{height:"500px"}} />
                        </div>
                    </div>
                </div>
                <style>
                                    {`
                                    h5.small-title {
                              font-size: 28px;
                              font-weight: bold;
                          }
                                                .text-light {
                            color: #f8f9fa;
                            line-height: 1.7;
                            font-size: 16px;
                          }

                          /* Paragraph spacing */
                          .text-lights p {
                            margin: 12px 0;

                          }

                          /* Strong heading */
                          .text-lights strong {
                            display: block;
                            margin: 20px 0 10px;
                            font-size: 18px;
                            font-weight: 600;
                          }

                          /* List styling */
                          .text-lights ul {
                            margin: 12px 0 0 20px;
                            padding: 0;
                          }

                          .text-lights ul li {
                            margin-bottom: 8px;
                            list-style-type: disc;
                          }

                          /* Optional: better mobile spacing */
                          @media (max-width: 768px) {
                            .text-lights {
                              font-size: 15px;
                            }
                          }
                                    
                                    `}
        </style>
            </section>
  )
}


const CareerHero = () => {
 const [career, setCareer] = useState()
  const setCareerget = () => {
    axios.get(`${API.BASE_URL}home-hero/career`).then((res) => {
      setCareer(res?.data?.data?.[0])
    })
  }
  useEffect(() => {
    setCareerget()
  }, [0])
  return (
    <>
      <section className="inner-banner py-5"  style={{
        marginTop: "4.5%",
        //  minHeight: "60vh",
        backgroundImage: `url(${API.BASE_URL_IMAGES}${career?.images})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
        <div className="w3l-breadcrumb py-lg-5">
          <div className="container pt-5 pb-sm-4">
            <h4 className="inner-text-title font-weight-bold pt-sm-5 pt-4">{career?.title}</h4>
            <ul className="breadcrumbs-custom-path">
              <li><Link to="/">{career?.heading}</Link></li>
              <li className="active"><i className="fas fa-angle-right mx-2"></i>{career?.sub_heading}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}



const ContactHero = () => {

  return (
    <>
      <section className="inner-banner py-5">
        <div className="w3l-breadcrumb py-lg-5">
          <div className="container pt-5 pb-sm-4">
            <h4 className="inner-text-title font-weight-bold pt-sm-5 pt-4">Contact</h4>
            <ul className="breadcrumbs-custom-path">
              <li><Link to="/">Home</Link></li>
              <li className="active"><i className="fas fa-angle-right mx-2"></i>Contact</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}


export { Hero, AboutHero, ServicesHero, WeManageYourBusiness, CareerHero, ContactHero , ServicesHeroDetails};
