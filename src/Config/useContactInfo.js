import { useState, useEffect } from "react";
import axios from "axios";
import API from "./API";

export const DEFAULT_CONTACT_INFO = {
  phone: "+91 9296454675",
  email: "support@parakshtech.com",
  address: "Pustakalaya Road, Buxar, Bihar, India",
  workingHours: "Mon - Sat: 9:30 AM - 6:30 PM IST",
  linkedin: "https://www.linkedin.com/company/parakshtech",
  facebook: "https://www.facebook.com/profile.php?id=61579256180141",
  instagram: "https://www.instagram.com/parakshtech/",
  twitter: "https://twitter.com/parakshtech",
};

export const getCachedContactInfo = () => {
  try {
    const cached = localStorage.getItem("pt_contact_info");
    if (cached) {
      return { ...DEFAULT_CONTACT_INFO, ...JSON.parse(cached) };
    }
  } catch {}
  return DEFAULT_CONTACT_INFO;
};

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState(getCachedContactInfo);

  useEffect(() => {
    let isMounted = true;

    const parseData = (d) => {
      if (!d) return null;
      let meta = {};
      if (typeof d.metadata === "string") {
        try {
          meta = JSON.parse(d.metadata || "{}");
        } catch {}
      } else if (d.metadata && typeof d.metadata === "object") {
        meta = d.metadata;
      }
      return {
        phone: meta.phone || (d.title && d.title.includes("+") ? d.title : undefined),
        email: meta.email,
        address: meta.address || d.contents || d.sub_heading,
        workingHours: meta.workingHours,
        linkedin: meta.linkedin,
        facebook: meta.facebook,
        instagram: meta.instagram,
        twitter: meta.twitter,
      };
    };

    const fetchInfo = async () => {
      try {
        const res = await axios.get(`${API.BASE_URL}content/contact_info`);
        if (res.data?.data) {
          const parsed = parseData(res.data.data);
          if (parsed && isMounted) {
            setContactInfo((prev) => {
              const updated = {
                ...prev,
                ...Object.fromEntries(
                  Object.entries(parsed).filter(([_, v]) => v !== undefined && v !== "")
                ),
              };
              try {
                localStorage.setItem("pt_contact_info", JSON.stringify(updated));
              } catch {}
              return updated;
            });
            return;
          }
        }
      } catch {
        // Fallback to home-hero/ContactUs or Contact if content/contact_info is missing
        try {
          const fallbackRes = await axios.get(`${API.BASE_URL}home-hero/ContactUs`);
          if (fallbackRes.data?.data?.[0] && isMounted) {
            const d = fallbackRes.data.data[0];
            const parsed = parseData(d);
            if (parsed) {
              setContactInfo((prev) => {
                const updated = {
                  ...prev,
                  ...Object.fromEntries(
                    Object.entries(parsed).filter(([_, v]) => v !== undefined && v !== "")
                  ),
                };
                try {
                  localStorage.setItem("pt_contact_info", JSON.stringify(updated));
                } catch {}
                return updated;
              });
            }
          }
        } catch {}
      }
    };

    fetchInfo();

    const handleUpdate = () => {
      setContactInfo(getCachedContactInfo());
    };

    window.addEventListener("pt_contact_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("pt_contact_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return contactInfo;
};

export default useContactInfo;

