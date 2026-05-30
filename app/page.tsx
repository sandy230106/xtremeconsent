"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import SignatureCanvas from "react-signature-canvas";

import {
  ShieldCheck,
  FileText,
  User,
  PenTool,
  Camera,
  Upload,
} from "lucide-react";

type ServiceType =
  | "Tattoo"
  | "Tattoo Removal"
  | "Piercing"
  | "PMU";

type PMUService =
  | "Eyebrow PMU"
  | "Microblading"
  | "Lip Blush"
  | "Eyeliner PMU"
  | "Scalp Micropigmentation"
  | "Other";

type ValidationErrors =
  Record<string, string>;

function LoginGate({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("xtreme_auth");
    setIsLoggedIn(auth === "true");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === "xtreme" && password === "muthukumar.m") {
      sessionStorage.setItem("xtreme_auth", "true");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid Login ID or Password");
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-[#D4AF37] font-bold">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-[32px] border border-[#D4AF37]/20 bg-[#111] p-8 sm:p-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-[36px] font-black uppercase text-[#D4AF37] tracking-[2px]">
              XTREME
            </h2>
            <p className="text-neutral-400 text-sm mt-1">TATTOO STUDIO CONSENT GATE</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[2px] text-[#D4AF37] font-semibold mb-2">
                Login ID
              </label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full rounded-2xl border border-[#D4AF37]/10 bg-black/50 p-4 text-base text-white outline-none focus:border-[#D4AF37]/40"
                placeholder="Enter Login ID"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[2px] text-[#D4AF37] font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#D4AF37]/10 bg-black/50 p-4 text-base text-white outline-none focus:border-[#D4AF37]/40"
                placeholder="Enter Password"
              />
            </div>

            {error && (
              <p className="text-sm font-semibold text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#D4AF37] py-4 font-black uppercase tracking-[2px] text-black transition hover:scale-105 cursor-pointer mt-2"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Home() {
  /* SIGNATURES */
  const signatureModalRef =
    useRef<SignatureCanvas>(null);

  const [
    activeSignature,
    setActiveSignature,
  ] = useState<
    "customer" | "artist" | null
  >(null);

  const [
    customerSignature,
    setCustomerSignature,
  ] = useState("");

  const [
    artistSignature,
    setArtistSignature,
  ] = useState("");

  /* CAMERA & CLIENT PHOTO */
  const [clientPhoto, setClientPhoto] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size is under 10MB
      const maxSizeBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeBytes) {
        alert("Photo size must be less than 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onerror = () => {
          alert("Invalid or corrupted image file. Please upload a valid photo.");
          setClientPhoto("");
        };
        img.onload = () => {
          // Initialize canvas
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize so that max dimension is 600px
          const maxDimension = 600;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 0.75 quality (results in standard 30KB - 80KB crisp photo)
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
            setClientPhoto(compressedDataUrl);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  /* STATES */
  const [loading, setLoading] =
    useState(false);

  const [service, setService] =
    useState<ServiceType>(
      "Tattoo"
    );

  const [pmuService, setPmuService] =
    useState<PMUService>(
      "Eyebrow PMU"
    );

  const [todayDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [formNo, setFormNo] =
    useState("XT-TAT-001");

  const [formData, setFormData] =
    useState({
      name: "",
      dob: "",
      age: "",
      gender: "",
      occupation: "",
      phone: "",
      address: "",
      idProof: "",
      idProofNo: "",
      needleType: "",
      payment_mode: "",
      price: "",
    });

  const [answers, setAnswers] =
    useState<Record<
      string,
      string
    >>({});

  const [notes, setNotes] =
    useState("");

  const [
    validationErrors,
    setValidationErrors,
  ] = useState<ValidationErrors>(
    {}
  );

  const calculatedAge =
    useMemo(() => {
      if (!formData.dob)
        return "";

      const birthDate =
        new Date(
          formData.dob
        );

      const today =
        new Date();

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const monthDiff =
        today.getMonth() -
        birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 &&
          today.getDate() <
            birthDate.getDate())
      ) {
        age--;
      }

      return String(age);
    }, [formData.dob]);

  /* AUTO CONSENT NUMBER */
  useEffect(() => {
    const getFormNo =
      async () => {
        try {
          const res =
            await fetch(
              "/api/consent"
            );

          const data =
            await res.json();

          const serviceForms = Array.isArray(data)
            ? data.filter((item: any) => item.service_type === service)
            : [];

          let next = 1;
          if (serviceForms.length > 0) {
            const numbers = serviceForms.map((item: any) => {
              const match = item.form_no?.match(/-(\d+)$/);
              return match ? parseInt(match[1], 10) : 0;
            });
            next = Math.max(...numbers) + 1;
          }

          const prefix =
            service === "Tattoo"
              ? "TAT"
              : service === "PMU"
              ? "PMU"
              : service === "Piercing"
              ? "PRC"
              : "REM";

          setFormNo(
            `XT-${prefix}-${String(next).padStart(3, "0")}`
          );
        } catch {
          setFormNo(
            "XT-TAT-001"
          );
        }
      };

    getFormNo();
  }, [service]);



  /* INPUT CHANGE */
  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    const value =
      e.target.name === "phone"
        ? e.target.value
            .replace(/\D/g, "")
            .slice(0, 10)
        : e.target.name === "price"
        ? e.target.value
            .replace(/[^\d.]/g, "")
            .replace(
              /(\..*)\./g,
              "$1"
            )
        : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        value,
    }));

    setValidationErrors(
      (prev) => {
        const next = {
          ...prev,
        };

        delete next[
          e.target.name
        ];

        return next;
      }
    );
  };

  /* QUESTION ANSWER */
  const setAnswer = (
    question: string,
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));

    setValidationErrors(
      (prev) => {
        const next = {
          ...prev,
        };

        delete next[
          `question-${question}`
        ];

        delete next.notes;

        return next;
      }
    );
  };

  /* DYNAMIC CONTENT */
  const dynamicContent = {
    Tattoo: {
      title:
        "Tattoo Consent Form",

      tamilTitle:
        "டாட்டூ ஒப்புதல் படிவம்",

      procedure:
        "tattoo procedure",

      tamilProcedure:
        "டாட்டூ செயல்",

      type:
        "permanent body art",

      tamilType:
        "நிரந்தர உடல் கலை",

      risks:
        "skin irritation, redness, swelling, infection, allergic reaction or dissatisfaction",

      tamilRisks:
        "தோல் எரிச்சல், சிவப்பு, வீக்கம், infection, allergy அல்லது திருப்தியின்மை",

      aftercare:
        "Follow all tattoo aftercare instructions provided by your tattoo artist.",

      tamilAftercare:
        "உங்கள் tattoo artist வழங்கும் aftercare வழிமுறைகளை சரியாக பின்பற்ற வேண்டும்.",

      firstQuestion:
        "Is this your first tattoo?",

      tamilFirstQuestion:
        "இது உங்கள் முதல் tattoo ஆகுமா?",
    },

    PMU: {
      title:
        "PMU (Permanent Makeup) Consent Form",

      tamilTitle:
        "நிரந்தர மேக்கப் ஒப்புதல் படிவம்",

      procedure:
        "PMU treatment",

      tamilProcedure:
        "PMU சிகிச்சை",

      type:
        "semi-permanent cosmetic procedure",

      tamilType:
        "அரைய்நிரந்தர அழகு சிகிச்சை",

      risks:
        "redness, swelling, fading, irritation or dissatisfaction",

      tamilRisks:
        "சிவப்பு, வீக்கம், fading, irritation அல்லது திருப்தியின்மை",

      aftercare:
        "Avoid water, makeup and sweating during healing.",

      tamilAftercare:
        "healing காலத்தில் தண்ணீர், makeup மற்றும் sweating தவிர்க்க வேண்டும்.",

      firstQuestion:
        "Is this your first PMU treatment?",

      tamilFirstQuestion:
        "இது உங்கள் முதல் PMU treatment ஆகுமா?",
    },

    Piercing: {
      title:
        "Piercing Consent Form",

      tamilTitle:
        "Piercing ஒப்புதல் படிவம்",

      procedure:
        "piercing procedure",

      tamilProcedure:
        "piercing செயல்",

      type:
        "body piercing treatment",

      tamilType:
        "உடல் piercing சிகிச்சை",

      risks:
        "pain, irritation, infection or swelling",

      tamilRisks:
        "வலி, irritation, infection அல்லது வீக்கம்",

      aftercare:
        "Follow all piercing aftercare instructions carefully.",

      tamilAftercare:
        "piercing aftercare வழிமுறைகளை சரியாக பின்பற்ற வேண்டும்.",

      firstQuestion:
        "Is this your first piercing?",

      tamilFirstQuestion:
        "இது உங்கள் முதல் piercing ஆகுமா?",
    },

    "Tattoo Removal": {
      title:
        "Tattoo Removal Consent Form",

      tamilTitle:
        "டாட்டூ அகற்றும் ஒப்புதல் படிவம்",

      procedure:
        "tattoo removal procedure",

      tamilProcedure:
        "டாட்டூ அகற்றும் செயல்",

      type:
        "tattoo fading/removal process",

      tamilType:
        "டாட்டூ அகற்றும் செயல்முறை",

      risks:
        "redness, blistering, discomfort or multiple sessions",

      tamilRisks:
        "சிவப்பு, blistering, discomfort அல்லது பல sessions",

      aftercare:
        "Avoid direct sunlight and follow removal aftercare instructions.",

      tamilAftercare:
        "நேரடி வெயிலை தவிர்த்து aftercare வழிமுறைகளை பின்பற்ற வேண்டும்.",

      firstQuestion:
        "Is this your first tattoo removal session?",

      tamilFirstQuestion:
        "இது உங்கள் முதல் tattoo removal session ஆகுமா?",
    },
  };

  const content =
    dynamicContent[
      service
    ];

  const healthQuestions =
    useMemo(
      () => [
        {
          en:
            "Are you above 18 years old?",

          ta:
            "à®‰à®™à¯à®•à®³à¯à®•à¯à®•à¯ 18 à®µà®¯à®¤à®¿à®±à¯à®•à¯ à®®à¯‡à®²à¯ à®‰à®³à¯à®³à®¤à®¾?",
        },

        {
          en:
            service === "PMU"
              ? "Are you pregnant or breastfeeding?"
              : "Are you pregnant or breastfeeding",

          ta:
            service === "PMU"
              ? "à®¨à¯€à®™à¯à®•à®³à¯ à®•à®°à¯à®ªà¯à®ªà®®à®¾à®• à®‰à®³à¯à®³à¯€à®°à¯à®•à®³à®¾ à®…à®²à¯à®²à®¤à¯ à®•à¯à®´à®¨à¯à®¤à¯ˆà®•à¯à®•à¯ à®ªà®¾à®²à¯‚à®Ÿà¯à®Ÿà¯à®•à®¿à®±à¯€à®°à¯à®•à®³à®¾?"
              : "à®¨à¯€à®™à¯à®•à®³à¯ à®•à®°à¯à®ªà¯à®ªà®®à®¾à®• à®‰à®³à¯à®³à¯€à®°à¯à®•à®³à®¾ à®…à®²à¯à®²à®¤à¯ à®•à¯à®´à®¨à¯à®¤à¯ˆà®•à¯à®•à¯ à®ªà®¾à®²à¯‚à®Ÿà¯à®Ÿà¯à®•à®¿à®±à¯€à®°à¯à®•à®³à®¾?",
        },

        {
          en:
            service === "PMU"
              ? "Do you have diabetes?"
              : "Do you have diabetes, blood pressure or medical conditions?",

          ta:
            service === "PMU"
              ? "à®‰à®™à¯à®•à®³à¯à®•à¯à®•à¯ à®¨à¯€à®°à®¿à®´à®¿à®µà¯ à®¨à¯‹à®¯à¯ à®‰à®³à¯à®³à®¤à®¾?"
              : "à®‰à®™à¯à®•à®³à¯à®•à¯à®•à¯ à®šà®•à¯à®•à®°à¯ˆ à®¨à¯‹à®¯à¯, à®°à®¤à¯à®¤ à®…à®´à¯à®¤à¯à®¤à®®à¯ à®…à®²à¯à®²à®¤à¯ à®®à®°à¯à®¤à¯à®¤à¯à®µà®¨à®¿à®²à¯ˆà®•à®³à¯ à®‰à®³à¯à®³à®¤à®¾??",
        },

        {
          en:
            service === "PMU"
              ? "Do you have any skin disease, allergy, or infection?"
              : `Do you have skin issues or conditions that may affect ${content.procedure}?`,

          ta:
            "à®¤à¯‹à®²à¯ à®¨à¯‹à®¯à¯, à®…à®²à®°à¯à®œà®¿ à®…à®²à¯à®²à®¤à¯ à®¤à¯Šà®±à¯à®±à¯ à®‰à®³à¯à®³à®¤à®¾?",
        },

        {
          en:
            "Have you used alcohol, weed, or recreational drugs recently?",

          ta:
            "à®¨à¯€à®™à¯à®•à®³à¯ à®šà®®à¯€à®ªà®¤à¯à®¤à®¿à®²à¯ à®®à®¤à¯à®ªà®¾à®©à®®à¯, à®•à®žà¯à®šà®¾ à®…à®²à¯à®²à®¤à¯ à®µà¯‡à®Ÿà®¿à®•à¯à®•à¯ˆ à®®à®°à¯à®¨à¯à®¤à¯à®•à®³à¯ˆ à®ªà®¯à®©à¯à®ªà®Ÿà¯à®¤à¯à®¤à®¿à®¯à¯à®³à¯à®³à¯€à®°à¯à®•à®³à®¾?",
        },

        {
          en:
            "Have you eaten food today?",

          ta:
            "à®‡à®©à¯à®±à¯ à®‰à®£à®µà¯ à®šà®¾à®ªà¯à®ªà®¿à®Ÿà¯à®Ÿà¯€à®°à¯à®•à®³à®¾?",
        },

        {
          en:
            content.firstQuestion,

          ta:
            content.tamilFirstQuestion,
        },

        {
          en:
            service === "PMU"
              ? "Are you taking blood thinners?"
              : "Are you taking any medications?",

          ta:
            service === "PMU"
              ? "à®°à®¤à¯à®¤à®¤à¯à®¤à¯ˆ à®¨à¯€à®°à¯à®¤à¯à®¤à®¾à®•à¯à®•à¯à®®à¯ à®®à®°à¯à®¨à¯à®¤à¯à®•à®³à¯ à®Žà®Ÿà¯à®¤à¯à®¤à¯à®•à¯à®•à¯Šà®³à¯à®•à®¿à®±à¯€à®°à¯à®•à®³à®¾?"
              : "à®¨à¯€à®™à¯à®•à®³à¯ à®¤à®±à¯à®ªà¯‹à®¤à¯ à®®à®°à¯à®¨à¯à®¤à¯à®•à®³à¯ à®Žà®Ÿà¯à®¤à¯à®¤à¯à®•à¯à®•à¯Šà®³à¯à®•à®¿à®±à¯€à®°à¯à®•à®³à®¾?",
        },

        {
          en:
            service === "PMU"
              ? "Do you have epilepsy or seizures?"
              : "Do you have epilepsy or seizures?",

          ta:
            "à®‰à®™à¯à®•à®³à¯à®•à¯à®•à¯ à®®à®¯à®•à¯à®•à®®à¯ à®…à®²à¯à®²à®¤à¯ à®®à®¿à®¤à®•à¯à®•à®¤à¯ à®¤à®¾à®•à¯à®•à®™à¯à®•à®³à¯ à®‰à®³à¯à®³à®¤à®¾?",
        },

        {
          en:
            service === "PMU"
              ? "Have you recently undergone cosmetic treatment?"
              : `Have you recently undergone treatment related to ${content.type}?`,

          ta:
            "à®¨à¯€à®™à¯à®•à®³à¯ à®šà®®à¯€à®ªà®¤à¯à®¤à®¿à®²à¯ à®…à®´à®•à¯à®šà®¾à®°à¯ à®šà®¿à®•à®¿à®šà¯à®šà¯ˆ à®ªà¯†à®±à¯à®±à¯à®³à¯à®³à¯€à®°à¯à®•à®³à®¾?",
        },

        {
          en:
            "Do you have any medical condition we should know about?",

          ta:
            "à®Žà®™à¯à®•à®³à¯à®•à¯à®•à¯ à®¤à¯†à®°à®¿à®¯ à®µà¯‡à®£à¯à®Ÿà®¿à®¯ à®‰à®Ÿà®²à¯à®¨à®² à®ªà®¿à®°à®šà¯à®šà®©à¯ˆ à®à®¤à¯‡à®©à¯à®®à¯ à®‰à®³à¯à®³à®¤à®¾?",
        },
      ],
      [
        content.firstQuestion,
        content.procedure,
        content.tamilFirstQuestion,
        content.type,
        service,
      ]
    );

  const validateForm = () => {
    const errors: ValidationErrors =
      {};

    if (!formData.name.trim()) {
      errors.name =
        "Client name is required.";
    }

    if (
      formData.phone.length !== 10
    ) {
      errors.phone =
        "Enter a valid 10 digit phone number.";
    }

    if (!formData.dob) {
      errors.dob =
        "Date of birth is required.";
    } else if (
      Number(calculatedAge) < 18
    ) {
      errors.dob =
        "Client must be 18 or above.";
    }

    if (!formData.gender) {
      errors.gender =
        "Gender is required.";
    }

    if (!formData.occupation.trim()) {
      errors.occupation =
        "Occupation is required.";
    }

    if (!formData.address.trim()) {
      errors.address =
        "Address is required.";
    }

    if (!formData.idProof) {
      errors.idProof =
        "ID proof is required.";
    }

    if (!formData.idProofNo.trim()) {
      errors.idProofNo =
        "ID proof number is required.";
    }

    if (!formData.payment_mode) {
      errors.payment_mode =
        "Payment mode is required.";
    }

    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      errors.price =
        "Enter a valid price.";
    }

    if (
      service === "Tattoo" &&
      !formData.needleType.trim()
    ) {
      errors.needleType =
        "Needle type is required.";
    }

    healthQuestions.forEach(
      (question) => {
        if (!answers[question.en]) {
          errors[
            `question-${question.en}`
          ] =
            "Please select Yes or No.";
        }
      }
    );

    if (
      answers[
        "Are you above 18 years old?"
      ] === "No"
    ) {
      errors[
        "question-Are you above 18 years old?"
      ] =
        "Client must be above 18.";
    }

    const detailQuestions =
      healthQuestions.filter(
        (question) =>
          ![
            "Are you above 18 years old?",
            "Have you eaten food today?",
            content.firstQuestion,
          ].includes(
            question.en
          )
      );

    if (
      detailQuestions.some(
        (question) =>
          answers[question.en] ===
          "Yes"
      ) &&
      !notes.trim()
    ) {
      errors.notes =
        "Please specify details for Yes answers.";
    }

    if (!clientPhoto) {
      errors.clientPhoto =
        "Client photo is required.";
    }

    if (!customerSignature) {
      errors.customer_signature =
        "Customer signature is required.";
    }

    if (!artistSignature) {
      errors.artist_signature =
        "Artist signature is required.";
    }

    setValidationErrors(
      errors
    );

    const firstError =
      Object.keys(errors)[0];

    if (firstError) {
      document
        .querySelector(
          `[data-error-key="${CSS.escape(
            firstError
          )}"]`
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }

    return (
      Object.keys(errors)
        .length === 0
    );
  };

  const openSignaturePad = (
    signatureType:
      | "customer"
      | "artist"
  ) => {
    setActiveSignature(
      signatureType
    );

    window.setTimeout(() => {
      signatureModalRef.current?.clear();
    }, 0);
  };

  const saveSignature = () => {
    if (
      !activeSignature ||
      !signatureModalRef.current ||
      signatureModalRef.current.isEmpty()
    ) {
      alert(
        "Please sign before tapping Done."
      );

      return;
    }

    const signature =
      signatureModalRef.current.toDataURL(
        "image/png"
      );

    if (
      activeSignature ===
      "customer"
    ) {
      setCustomerSignature(
        signature
      );
    } else {
      setArtistSignature(
        signature
      );
    }

    setValidationErrors(
      (prev) => {
        const next = {
          ...prev,
        };

        delete next[
          activeSignature ===
          "customer"
            ? "customer_signature"
            : "artist_signature"
        ];

        return next;
      }
    );

    setActiveSignature(null);
  };

  return (
    <LoginGate>
      <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.08)_0%,_black_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-8 lg:px-6 lg:py-10">

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-[22px] border border-[#D4AF37]/20 bg-[#0f0f0f]/90 shadow-[0_0_80px_rgba(212,175,55,0.08)] backdrop-blur-xl sm:rounded-[30px] lg:rounded-[36px]">
        {/* HEADER */}
<div className="relative overflow-hidden border-b border-[#D4AF37]/20 bg-gradient-to-b from-[#181818] to-[#0d0d0d]">

  {/* GOLD GLOW */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12)_0%,_transparent_70%)]" />

  <div className="relative px-4 py-7 sm:px-8 sm:py-10 lg:py-12">

    {/* TOP BAR */}
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

      {/* LOGO */}
      <div className="flex justify-center lg:justify-start">

        <Image
          src="/logo.jpg"
          alt="Xtreme Tattoo Studio"
          width={360}
          height={180}
          priority
          className="object-contain mix-blend-lighten"
        />
      </div>

      {/* CONSENT NUMBER */}
      <div className="text-center lg:text-right">

        <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs font-semibold">

          Consent No
        </p>

        <h2 className="text-3xl font-black mt-2">
          {formNo}
        </h2>

        <p className="text-neutral-400 mt-2">
          {todayDate}
        </p>
      </div>
    </div>

    {/* TITLE */}
    <div className="text-center mt-10">

      <h1 className="text-3xl font-black uppercase leading-tight tracking-wide sm:text-[42px] lg:text-[52px]">

        <span className="text-white">
          XTREME
        </span>{" "}

        <span className="text-[#D4AF37]">
          CONSENT
        </span>
      </h1>

      <div className="mt-5">

        <p className="text-xl font-bold text-[#D4AF37] sm:text-[28px]">
          {content.title}
        </p>

        <p className="text-neutral-300 text-lg mt-1">
          {content.tamilTitle}
        </p>
      </div>
    </div>
  </div>
  
</div>

{/* BODY */}
<div className="p-4 sm:p-6 lg:p-10">

  {/* SERVICE */}
  <div className="rounded-[22px] border border-[#D4AF37]/20 bg-[#131313] p-5 sm:rounded-[28px] sm:p-8">

    <label className="block text-[#D4AF37] uppercase text-sm tracking-[3px] font-semibold mb-4">

      Select Service
    </label>

    <select
      value={service}
      onChange={(e) =>
        setService(
          e.target
            .value as ServiceType
        )
      }
      className="w-full rounded-2xl border border-[#D4AF37]/20 bg-black/50 p-5 text-white outline-none focus:border-[#D4AF37]"
    >
      <option>
        Tattoo
      </option>

      <option>
        Tattoo Removal
      </option>

      <option>
        Piercing
      </option>

      <option>
        PMU
      </option>
    </select>

    {/* PMU SERVICE */}
    {service ===
      "PMU" && (
      <div className="mt-6">

        <label className="block text-[#D4AF37] uppercase text-sm tracking-[3px] font-semibold mb-4">

          Select PMU Service
        </label>

        <select
          value={
            pmuService
          }
          onChange={(e) =>
            setPmuService(
              e.target
                .value as PMUService
            )
          }
          className="w-full rounded-2xl border border-[#D4AF37]/20 bg-black/50 p-5 text-white outline-none"
        >
          <option>
            Eyebrow PMU
          </option>

          <option>
            Microblading
          </option>

          <option>
            Lip Blush
          </option>

          <option>
            Eyeliner PMU
          </option>

          <option>
            Scalp Micropigmentation
          </option>

          <option>
            Other
          </option>
        </select>
      </div>
    )}
  </div>

  {/* CLIENT DETAILS */}
  <div className="mt-6 rounded-[22px] border border-[#D4AF37]/20 bg-[#131313] p-5 sm:mt-8 sm:rounded-[28px] sm:p-8">

    <div className="flex items-center gap-4 mb-8">

      <div className="p-3 rounded-full bg-[#D4AF37]/10">
        <User
          className="text-[#D4AF37]"
          size={24}
        />
      </div>

      <div>
        <h2 className="text-2xl font-black uppercase sm:text-[30px]">
          Client Details
        </h2>

        <p className="text-neutral-400">
          Personal Information
        </p>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* FIELDS */}
      <div className="flex-1 w-full grid gap-5 md:grid-cols-2">
        <InputField
          label="Client Name"
          name="name"
          value={
            formData.name
          }
          onChange={
            handleChange
          }
          error={
            validationErrors.name
          }
          required
        />

        <InputField
          label="Phone Number"
          name="phone"
          value={
            formData.phone
          }
          onChange={
            handleChange
          }
          error={
            validationErrors.phone
          }
          inputMode="numeric"
          maxLength={10}
          required
        />

        <InputField
          label="Date Of Birth"
          type="date"
          name="dob"
          value={
            formData.dob
          }
          onChange={
            handleChange
          }
          error={
            validationErrors.dob
          }
          required
        />

        <ReadOnlyField
          label="Age"
          value={
            calculatedAge
          }
        />

        <SelectField
          label="Gender"
          name="gender"
          value={
            formData.gender
          }
          onChange={
            handleChange
          }
          error={
            validationErrors.gender
          }
          required
          options={[
            "Male",
            "Female",
            "Other",
          ]}
        />

        <InputField
          label="Occupation"
          name="occupation"
          value={
            formData.occupation
          }
          onChange={
            handleChange
          }
          error={
            validationErrors.occupation
          }
          required
        />
      </div>

      {/* PHOTO UPLOAD */}
      <div 
        className="w-full max-w-[268px] lg:w-[268px] mx-auto lg:mx-0 flex-shrink-0 flex flex-col"
        data-error-key="clientPhoto"
      >
        <label className="block text-[#D4AF37] uppercase text-sm tracking-[2px] font-semibold mb-3">
          Client Photo
        </label>
        
        <label className={`relative aspect-square w-full rounded-2xl border bg-black/50 overflow-hidden flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 ${
          validationErrors.clientPhoto 
            ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:border-red-400" 
            : "border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
        }`}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          
          {clientPhoto ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={clientPhoto}
                alt="Uploaded client"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-semibold bg-[#D4AF37]/10 px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition w-full justify-center">
                  <Upload size={16} />
                  <span>Change Photo</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setClientPhoto("");
                  }}
                  className="text-red-400 text-xs font-semibold hover:underline mt-1 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-2.5 rounded-xl border border-red-500/20 transition w-full text-center"
                >
                  Remove Photo
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-4 transition-transform duration-300 group-hover:scale-102">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-300">
                <Upload className="text-[#D4AF37]" size={24} />
              </div>
              <p className="text-sm font-semibold text-neutral-400 group-hover:text-neutral-300 transition-colors">Upload Photo</p>
              <p className="text-xs text-neutral-500 mt-1">Click to browse (Max 10MB)</p>
            </div>
          )}
        </label>
        
        {validationErrors.clientPhoto && (
          <p className="mt-2 text-sm text-red-400 text-center">
            {validationErrors.clientPhoto}
          </p>
        )}
      </div>
    </div>

    {/* ADDRESS */}
    <div
      className="mt-5"
      data-error-key="address"
    >

      <label className="text-sm uppercase tracking-[2px] text-[#D4AF37] font-semibold">

        Address
      </label>

      <textarea
        rows={4}
        name="address"
        value={
          formData.address
        }
        onChange={
          handleChange
        }
        required
        aria-invalid={
          Boolean(
            validationErrors.address
          )
        }
        className={`mt-2 w-full rounded-2xl border bg-black/50 p-4 text-base text-white outline-none resize-none sm:p-5 ${
          validationErrors.address
            ? "border-red-500"
            : "border-[#D4AF37]/20"
        }`}
      />
      {validationErrors.address && (
        <p className="mt-2 text-sm text-red-400">
          {validationErrors.address}
        </p>
      )}
    </div>

    {/* ID PROOF & PAYMENT */}
    <div className="mt-5 grid gap-5 md:grid-cols-2">
      <SelectField
        label="ID Proof"
        name="idProof"
        value={
          formData.idProof
        }
        onChange={
          handleChange
        }
        error={
          validationErrors.idProof
        }
        required
        options={[
          "Aadhaar Card",
          "Driving License",
          "Passport",
          "PAN Card",
          "Voter ID",
        ]}
      />

      <InputField
        label="ID Proof Number"
        name="idProofNo"
        value={
          formData.idProofNo
        }
        onChange={
          handleChange
        }
        error={
          validationErrors.idProofNo
        }
        required
      />

      <SelectField
        label="Mode Of Payment"
        name="payment_mode"
        value={
          formData.payment_mode
        }
        onChange={
          handleChange
        }
        error={
          validationErrors.payment_mode
        }
        required
        options={[
          "Cash",
          "GPay",
          "Card",
        ]}
      />

      <InputField
        label="Price"
        name="price"
        value={
          formData.price
        }
        onChange={
          handleChange
        }
        error={
          validationErrors.price
        }
        inputMode="decimal"
        required
      />
    </div>
  </div>
</div>
{/* HEALTH DECLARATION */}
<div className="mt-6 rounded-[22px] border border-[#D4AF37]/20 bg-[#131313] p-5 sm:mt-8 sm:rounded-[28px] sm:p-8">

  <div className="flex items-center gap-4 mb-8">

    <div className="p-3 rounded-full bg-[#D4AF37]/10">
      <ShieldCheck
        className="text-[#D4AF37]"
        size={24}
      />
    </div>

    <div>
      <h2 className="text-2xl font-black uppercase sm:text-[30px]">
        Health Declaration
      </h2>

      <p className="text-neutral-300">
        உடல்நல அறிவிப்பு
      </p>
    </div>
  </div>

  {/* QUESTIONS */}
  <div className="space-y-5">

    {[
      {
        en:
          "Are you above 18 years old?",

        ta:
          "உங்களுக்கு 18 வயதிற்கு மேல் உள்ளதா?",
      },

      {
        en:
          service === "PMU"
            ? "Are you pregnant or breastfeeding?"
            : "Are you pregnant or breastfeeding",

        ta:
          service === "PMU"
            ? "நீங்கள் கர்ப்பமாக உள்ளீர்களா அல்லது குழந்தைக்கு பாலூட்டுகிறீர்களா?"
            : "நீங்கள் கர்ப்பமாக உள்ளீர்களா அல்லது குழந்தைக்கு பாலூட்டுகிறீர்களா?",
      },

      {
        en:
          service === "PMU"
            ? "Do you have diabetes?"
            : "Do you have diabetes, blood pressure or medical conditions?",

        ta:
          service === "PMU"
            ? "உங்களுக்கு நீரிழிவு நோய் உள்ளதா?"
            : "உங்களுக்கு சக்கரை நோய், ரத்த அழுத்தம் அல்லது மருத்துவநிலைகள் உள்ளதா??",
      },

      {
        en:
          service === "PMU"
            ? "Do you have any skin disease, allergy, or infection?"
            : `Do you have skin issues or conditions that may affect ${content.procedure}?`,

        ta:
          "தோல் நோய், அலர்ஜி அல்லது தொற்று உள்ளதா?",
      },

      {
        en:
          "Have you used alcohol, weed, or recreational drugs recently?",

        ta:
          "நீங்கள் சமீபத்தில் மதுபானம், கஞ்சா அல்லது வேடிக்கை மருந்துகளை பயன்படுத்தியுள்ளீர்களா?",
      },

      {
        en:
          "Have you eaten food today?",

        ta:
          "இன்று உணவு சாப்பிட்டீர்களா?",
      },

      {
        en:
          content.firstQuestion,

        ta:
          content.tamilFirstQuestion,
      },

      {
        en:
          service === "PMU"
            ? "Are you taking blood thinners?"
            : "Are you taking any medications?",

        ta:
          service === "PMU"
            ? "ரத்தத்தை நீர்த்தாக்கும் மருந்துகள் எடுத்துக்கொள்கிறீர்களா?"
            : "நீங்கள் தற்போது மருந்துகள் எடுத்துக்கொள்கிறீர்களா?",
      },

      {
        en:
          service === "PMU"
            ? "Do you have epilepsy or seizures?"
            : "Do you have epilepsy or seizures?",

        ta:
          "உங்களுக்கு மயக்கம் அல்லது மிதக்கத் தாக்கங்கள் உள்ளதா?",
      },

      {
        en:
          service === "PMU"
            ? "Have you recently undergone cosmetic treatment?"
            : `Have you recently undergone treatment related to ${content.type}?`,

        ta:
          "நீங்கள் சமீபத்தில் அழகுசார் சிகிச்சை பெற்றுள்ளீர்களா?",
      },

      {
        en:
          "Do you have any medical condition we should know about?",

        ta:
          "எங்களுக்கு தெரிய வேண்டிய உடல்நல பிரச்சனை ஏதேனும் உள்ளதா?",
      },
    ].map((q, index) => (

      <QuestionRow
        key={q.en}
        number={
          index + 1
        }
        question={q.en}
        tamilQuestion={
          q.ta
        }
        value={
          answers[
            q.en
          ]
        }
        onChange={(v) =>
          setAnswer(
            q.en,
            v
          )
        }
        error={
          validationErrors[
            `question-${q.en}`
          ]
        }
      />
    ))}
  </div>

  {/* IF YES */}
  <div className="mt-8">

    <label className="text-[#D4AF37] uppercase text-sm tracking-[2px] font-semibold">

      If yes, specify
    </label>

    <p className="text-neutral-400 text-sm mb-3">
      இருந்தால் விவரம்
    </p>

    <textarea
      rows={4}
      value={notes}
      onChange={(e) => {
        setNotes(
          e.target.value
        );

        setValidationErrors(
          (prev) => {
            const next = {
              ...prev,
            };

            delete next.notes;

            return next;
          }
        );
      }}
      data-error-key="notes"
      aria-invalid={
        Boolean(
          validationErrors.notes
        )
      }
      className={`w-full rounded-2xl border bg-black/50 p-4 text-base text-white outline-none resize-none sm:p-5 ${
        validationErrors.notes
          ? "border-red-500"
          : "border-[#D4AF37]/20"
      }`}
    />
    {validationErrors.notes && (
      <p className="mt-2 text-sm text-red-400">
        {validationErrors.notes}
      </p>
    )}
  </div>
</div>
{/* CONSENT & ACKNOWLEDGMENT */}
<div className="mt-6 rounded-[22px] border border-[#D4AF37]/20 bg-[#131313] p-5 sm:mt-8 sm:rounded-[28px] sm:p-8">

  <div className="flex items-center gap-4 mb-8">

    <div className="p-3 rounded-full bg-[#D4AF37]/10">
      <FileText
        className="text-[#D4AF37]"
        size={24}
      />
    </div>

    <div>
      <h2 className="text-2xl font-black uppercase sm:text-[30px]">
        Consent &
        Acknowledgment
      </h2>

      <p className="text-neutral-300">
        ஒப்புதல் மற்றும்
        அங்கீகாரம்
      </p>
    </div>
  </div>

  <ol className="space-y-6">

    {/* 1 */}
    <ConsentItem
      number={1}
      english={`I voluntarily consent to receive ${content.procedure} at XTREME TATTOO STUDIO.`}
      tamil={`XTREME TATTOO STUDIO-ல் ${content.tamilProcedure} பெற நான் என் சொந்த விருப்பத்துடன் ஒப்புதல் அளிக்கிறேன்.`}
    />

    {/* 2 */}
    <ConsentItem
      number={2}
      english={`I understand this is a ${content.type} and results may vary from person to person.`}
      tamil={`இது ஒரு ${content.tamilType} என்பதை நான் புரிந்துகொள்கிறேன். முடிவுகள் ஒவ்வொருவருக்கும் மாறுபடலாம்.`}
    />

    {/* 3 */}
    <ConsentItem
      number={3}
      english={`I understand risks may include ${content.risks}.`}
      tamil={`இதனால் ${content.tamilRisks} போன்ற பிரச்சனைகள் ஏற்படலாம் என்பதை நான் புரிந்துகொள்கிறேன்.`}
    />

    {/* 4 */}
    <ConsentItem
      number={4}
      english="I confirm that I have disclosed all medical conditions truthfully."
      tamil="எனது அனைத்து உடல்நல தகவல்களையும் உண்மையாக வழங்கியுள்ளேன்."
    />

    {/* 5 */}
    <ConsentItem
      number={5}
      english="I understand failure to follow aftercare instructions may affect healing and final results."
      tamil="Aftercare வழிமுறைகளை பின்பற்றவில்லை என்றால் healing மற்றும் இறுதி முடிவுகள் பாதிக்கப்படலாம்."
    />

    {/* 6 */}
    <ConsentItem
      number={6}
      english="I consent to studio photos for records and promotional purposes."
      tamil="Studio records மற்றும் promotion நோக்கத்திற்காக புகைப்படம் எடுக்க அனுமதி அளிக்கிறேன்."
    />

    {/* 7 */}
    <ConsentItem
      number={7}
      english="I release XTREME TATTOO STUDIO, artists and employees from expected legal liabilities related to healing results."
      tamil="Healing முடிவுகள் தொடர்பான சட்ட பொறுப்புகளில் இருந்து XTREME TATTOO STUDIO மற்றும் artists-ஐ விடுவிக்கிறேன்."
    />

    {/* 8 */}
    <ConsentItem
      number={8}
      english="I confirm I am not under the influence of alcohol or drugs during this procedure."
      tamil="இந்த procedure நேரத்தில் alcohol அல்லது drugs தாக்கத்தில் இல்லை என்பதை உறுதிப்படுத்துகிறேன்."
    />

    {/* 9 */}
    <ConsentItem
      number={9}
      english="I confirm I have read and understood this consent form fully."
      tamil="இந்த consent form-ஐ முழுமையாக படித்து புரிந்துகொண்டேன் என்பதை உறுதிப்படுத்துகிறேன்."
    />
  </ol>
</div>

{/* AFTERCARE */}
<div className="mt-6 rounded-[22px] border border-[#D4AF37]/20 bg-[#131313] p-5 sm:mt-8 sm:rounded-[28px] sm:p-8">

  <div className="flex items-center gap-4 mb-8">

    <div className="p-3 rounded-full bg-[#D4AF37]/10">
      <PenTool
        className="text-[#D4AF37]"
        size={24}
      />
    </div>

    <div>
      <h2 className="text-2xl font-black uppercase sm:text-[30px]">
        Aftercare
        Acknowledgment
      </h2>

      <p className="text-neutral-300">
        பிந்தைய பராமரிப்பு
        ஒப்புதல்
      </p>
    </div>
  </div>

  <div className="rounded-[24px] border border-[#D4AF37]/10 bg-black/30 p-6">

    <p className="text-white leading-8">
      {
        content.aftercare
      }
    </p>

    <p className="text-neutral-300 leading-8 mt-3">
      {
        content.tamilAftercare
      }
    </p>
  </div>

  <ul className="mt-6 space-y-4">

    {[
      {
        en:
          "Avoid touching treated area.",

        ta:
          "சிகிச்சை செய்யப்பட்ட பகுதியை தொட வேண்டாம்.",
      },

      {
        en:
          "Avoid swimming, sweating and irritation.",

        ta:
          "Swimming, sweating மற்றும் irritation தவிர்க்கவும்.",
      },

      {
        en:
          "Do not scratch healing skin.",

        ta:
          "Healing skin-ஐ scratch செய்ய வேண்டாம்.",
      },

      {
        en:
          "Follow artist instructions carefully.",

        ta:
          "Artist வழங்கும் வழிமுறைகளை கவனமாக பின்பற்றவும்.",
      },
    ].map(
      (
        item,
        index
      ) => (
        <li
          key={index}
          className="rounded-2xl border border-[#D4AF37]/10 bg-black/30 p-5"
        >
          <p className="text-white">
            {item.en}
          </p>

          <p className="text-neutral-400 mt-1">
            {item.ta}
          </p>
        </li>
      )
    )}
  </ul>
</div>
{/* SIGNATURE SECTION */}
<div className="mt-6 rounded-[22px] border border-[#D4AF37]/20 bg-[#131313] p-5 sm:mt-8 sm:rounded-[28px] sm:p-8">

  <h2 className="mb-6 text-2xl font-black uppercase sm:mb-8 sm:text-[30px]">
    Signature
    Verification
  </h2>

  <div className="grid gap-8 md:grid-cols-2">

    {/* CUSTOMER SIGN */}
    <div>

      <label className="text-[#D4AF37] uppercase text-sm tracking-[2px] font-semibold">

        Customer Signature
      </label>

      <button
        type="button"
        onClick={() =>
          openSignaturePad(
            "customer"
          )
        }
        className={`mt-4 flex h-[170px] w-full items-center justify-center overflow-hidden rounded-[24px] border bg-white p-3 text-black ${
          validationErrors.customer_signature
            ? "border-red-500"
            : "border-[#D4AF37]/20"
        }`}
        data-error-key="customer_signature"
      >
        {customerSignature ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={customerSignature}
            alt="Customer signature"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-sm font-semibold uppercase tracking-[2px] text-neutral-500">
            Tap to Sign
          </span>
        )}
      </button>
      {validationErrors.customer_signature && (
        <p className="mt-2 text-sm text-red-400">
          {validationErrors.customer_signature}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          setCustomerSignature("");
        }}
        className="mt-3 text-[#D4AF37] text-sm"
      >
        Clear Signature
      </button>
    </div>

    {/* ARTIST SIGN */}
    <div>

      <label className="text-[#D4AF37] uppercase text-sm tracking-[2px] font-semibold">

        Artist Signature
      </label>

      <button
        type="button"
        onClick={() =>
          openSignaturePad(
            "artist"
          )
        }
        className={`mt-4 flex h-[170px] w-full items-center justify-center overflow-hidden rounded-[24px] border bg-white p-3 text-black ${
          validationErrors.artist_signature
            ? "border-red-500"
            : "border-[#D4AF37]/20"
        }`}
        data-error-key="artist_signature"
      >
        {artistSignature ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artistSignature}
            alt="Artist signature"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-sm font-semibold uppercase tracking-[2px] text-neutral-500">
            Tap to Sign
          </span>
        )}
      </button>
      {validationErrors.artist_signature && (
        <p className="mt-2 text-sm text-red-400">
          {validationErrors.artist_signature}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          setArtistSignature("");
        }}
        className="mt-3 text-[#D4AF37] text-sm"
      >
        Clear Signature
      </button>
    </div>
  </div>

  {/* NEEDLE TYPE */}
  {service ===
    "Tattoo" && (
    <div className="mt-8">

      <InputField
        label="Type Of Needle Used"
        name="needleType"
        value={
          formData.needleType
        }
        onChange={
          handleChange
        }
        error={
          validationErrors.needleType
        }
        required
      />
    </div>
  )}

  {/* DATE */}
  <div className="mt-8">

    <ReadOnlyField
      label="Date"
      value={todayDate}
    />
  </div>
</div>

{/* SUBMIT */}
<div className="mt-10 flex justify-center">

  <button
    onClick={async () => {
      if (!validateForm()) {
        alert(
          "Please complete all required fields."
        );

        return;
      }

      try {
        setLoading(true);

        const payload = {
          form_no:
            formNo,

          consent_date:
            todayDate,

          service_type:
            service,

          pmu_service:
            pmuService,

          ...formData,

          age:
            calculatedAge,

          questionnaire:
            answers,

          notes,

          customer_signature:
            customerSignature,

          artist_signature:
            artistSignature,

          client_photo:
            clientPhoto,
        };

        const res =
          await fetch(
            "/api/consent",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        if (res.ok) {
          alert(
            "Consent Form Submitted Successfully"
          );

          location.reload();
        } else {
          alert(
            "Failed to submit form"
          );
        }
      } catch {
        alert(
          "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }}
    disabled={loading}
    className="rounded-full bg-[#D4AF37] px-12 py-5 font-black uppercase tracking-[3px] text-black transition hover:scale-105"
  >
    {loading
      ? "Submitting..."
      : "Submit Consent Form"}
  </button>
</div>

{/* FOOTER */}
<div className="mt-14 border-t border-[#D4AF37]/10 pt-8 text-center">

  <p className="text-[#D4AF37] font-bold tracking-[3px]">
    XTREME TATTOO
    STUDIO
  </p>

  <p className="text-neutral-400 mt-3 leading-8">
    VIGNESH PLAZA,
    12A, 1st Floor,
    Thillainagar Main
    Road, Trichy –
    620018
  </p>

  <p className="text-neutral-500">
    Contact:
    7010343009
  </p>
</div>
</div>
</div>

{activeSignature && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6">
    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-[24px] border border-[#D4AF37]/30 bg-[#111111] p-4 shadow-2xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black uppercase text-white sm:text-2xl">
          {activeSignature ===
          "customer"
            ? "Customer Signature"
            : "Artist Signature"}
        </h2>

        <button
          type="button"
          onClick={() =>
            setActiveSignature(null)
          }
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white"
        >
          Close
        </button>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[#D4AF37]/30 bg-white">
        <SignatureCanvas
          ref={signatureModalRef}
          penColor="black"
          canvasProps={{
            width: 1000,
            height: 420,
            className:
              "h-[360px] w-full bg-white sm:h-[420px]",
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            signatureModalRef.current?.clear()
          }
          className="rounded-full border border-[#D4AF37]/30 px-6 py-3 font-semibold text-[#D4AF37]"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={saveSignature}
          className="rounded-full bg-[#D4AF37] px-8 py-3 font-black uppercase tracking-[2px] text-black"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}
 
</main>
</LoginGate>
);
}

/* INPUT FIELD */
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  required = false,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => void;
  type?: string;
  error?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div data-error-key={name}>
      <label className="block text-[#D4AF37] uppercase text-sm tracking-[2px] font-semibold mb-3">
        {label}
        {required && (
          <span className="text-red-400">
            {" "}
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={
          Boolean(error)
        }
        className={`w-full rounded-2xl border bg-black/50 p-4 text-base text-white outline-none focus:border-[#D4AF37] sm:p-5 ${
          error
            ? "border-red-500"
            : "border-[#D4AF37]/20"
        }`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* READ ONLY */
function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="block text-[#D4AF37] uppercase text-sm tracking-[2px] font-semibold mb-3">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="w-full rounded-2xl border border-[#D4AF37]/20 bg-black/50 p-5 text-neutral-300"
      />
    </div>
  );
}

/* SELECT FIELD */
function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div data-error-key={name}>
      <label className="block text-[#D4AF37] uppercase text-sm tracking-[2px] font-semibold mb-3">
        {label}
        {required && (
          <span className="text-red-400">
            {" "}
            *
          </span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={
          Boolean(error)
        }
        className={`w-full rounded-2xl border bg-black/50 p-4 text-base text-white outline-none sm:p-5 ${
          error
            ? "border-red-500"
            : "border-[#D4AF37]/20"
        }`}
      >
        <option value="">
          Select
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
            >
              {option}
            </option>
          )
        )}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* QUESTION ROW */
function QuestionRow({
  number,
  question,
  tamilQuestion,
  value,
  onChange,
  error,
}: {
  number: number;
  question: string;
  tamilQuestion: string;
  value?: string;
  onChange: (
    value: string
  ) => void;
  error?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border bg-black/30 p-4 sm:rounded-[24px] sm:p-5 ${
        error
          ? "border-red-500"
          : "border-[#D4AF37]/10"
      }`}
      data-error-key={`question-${question}`}
    >

      <p className="font-semibold text-white leading-8">
        {number}.{" "}
        {question}
      </p>

      <p className="text-neutral-400 mt-1 leading-7">
        {tamilQuestion}
      </p>

      <div className="mt-5 flex flex-wrap gap-3 sm:gap-4">

        <button
          type="button"
          onClick={() =>
            onChange("Yes")
          }
          className={`min-h-11 rounded-full px-6 py-3 transition ${
            value ===
            "Yes"
              ? "bg-[#D4AF37] text-black"
              : "bg-black/50 border border-[#D4AF37]/20 text-white"
          }`}
        >
          Yes / ஆம்
        </button>

        <button
          type="button"
          onClick={() =>
            onChange("No")
          }
          className={`min-h-11 rounded-full px-6 py-3 transition ${
            value ===
            "No"
              ? "bg-[#D4AF37] text-black"
              : "bg-black/50 border border-[#D4AF37]/20 text-white"
          }`}
        >
          No / இல்லை
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* CONSENT ITEM */
function ConsentItem({
  number,
  english,
  tamil,
}: {
  number: number;
  english: string;
  tamil: string;
}) {
  return (
    <li className="rounded-[24px] border border-[#D4AF37]/10 bg-black/30 p-5 list-none">

      <p className="text-white leading-8">
        {number}.{" "}
        {english}
      </p>

      <p className="text-neutral-400 mt-2 leading-8">
        {tamil}
      </p>
    </li>
  );
}
