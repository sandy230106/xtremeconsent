"use client";

import Image from "next/image";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Search,
  Pencil,
  Trash2,
  Download,
  Plus,
  Save,
  X,
  Upload,
} from "lucide-react";

import jsPDF from "jspdf";

/* =========================
   TYPES
========================= */

type ServiceType =
  | "Tattoo"
  | "PMU"
  | "Piercing"
  | "Tattoo Removal";

type ClientData = {
  id?: number;

  form_no: string;

  consent_date?: string;

  service_type: ServiceType;

  pmu_service?: string;

  name: string;

  dob: string;

  age: string;

  gender: string;

  occupation: string;

  phone: string;

  address: string;

  idProof: string;

  idProofNo?: string;

  needleType?: string;

  payment_mode?: string;

  price?: string;

  questionnaire?: Record<
    string,
    string
  >;

  notes?: string;

  customer_signature?: string;

  artist_signature?: string;

  client_photo?: string;

  created_at?: string;
};

type ConsentQuestion = {
  id: string;

  service_type: string;

  question_en: string;

  question_ta: string;
};

type TabType =
  | "dashboard"
  | "clients"
  | "content"
  | "settings";

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

/* =========================
   PAGE
========================= */

export default function AdminPage() {

  const [tab,
    setTab,
  ] = useState<TabType>(
    "dashboard"
  );

  const [clients,
    setClients,
  ] = useState<
    ClientData[]
  >([]);

  const [loading,
    setLoading,
  ] = useState(true);

  const [search,
    setSearch,
  ] = useState("");

  const [serviceFilter,
    setServiceFilter,
  ] = useState("All");

  const [editing,
    setEditing,
  ] = useState(false);

  const [
    selectedClient,
    setSelectedClient,
  ] =
    useState<ClientData | null>(
      null
    );

  const [questions,
    setQuestions,
  ] = useState<
    ConsentQuestion[]
  >([]);

  const [
    selectedService,
    setSelectedService,
  ] = useState(
    "Tattoo"
  );

  const [
    newQuestion,
    setNewQuestion,
  ] = useState({
    question_en:
      "",
    question_ta:
      "",
  });

  const [
    studioSettings,
    setStudioSettings,
  ] = useState({
    studio_name:
      "XTREME TATTOO STUDIO",

    phone:
      "7010343009",

    address:
      "VIGNESH PLAZA, 12A, 1st Floor, Thillainagar Main Road, Trichy – 620018",
  });

  /* =========================
     FETCH CLIENTS
  ========================= */

  const fetchClients =
    async () => {

      try {

        const response =
          await fetch(
            "/api/consent"
          );

        const data =
          await response.json();

        setClients(
          data || []
        );

      } catch (
        error
      ) {

        console.error(
          error
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  /* =========================
     FETCH QUESTIONS
  ========================= */

  const fetchQuestions =
    async () => {
      try {
        const response = await fetch("/api/questions");
        const data = await response.json();
        setQuestions(data || []);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

  useEffect(() => {

    const timer =
      window.setTimeout(() => {
        fetchClients();

        fetchQuestions();
      }, 0);

    return () =>
      window.clearTimeout(
        timer
      );

  }, []);

  /* =========================
     FILTERED CLIENTS
  ========================= */

  const filteredClients =
    useMemo(() => {

      return clients.filter(
        (
          client
        ) => {

          const query =
            search.toLowerCase();

          const matchesSearch =

            client.name
              ?.toLowerCase()
              .includes(
                query
              ) ||

            client.phone
              ?.toLowerCase()
              .includes(
                query
              ) ||

            client.form_no
              ?.toLowerCase()
              .includes(
                query
              );

          const matchesService =

            serviceFilter ===
            "All"

              ? true

              : client.service_type ===
                serviceFilter;

          return (
            matchesSearch &&
            matchesService
          );
        }
      );

    }, [
      clients,
      search,
      serviceFilter,
    ]);

  const totalRevenue =
    useMemo(
      () =>
        clients.reduce(
          (total, client) =>
            total +
            Number(
              client.price || 0
            ),
          0
        ),
      [clients]
    );
  return (
    <LoginGate>
      <main className="flex min-h-screen flex-col bg-[#050505] text-white lg:flex-row">

      {/* SIDEBAR */}
      <aside className="w-full border-b border-[#D4AF37]/10 bg-[#0a0a0a] p-4 sm:p-6 lg:w-[290px] lg:border-b-0 lg:border-r">

        {/* LOGO */}
        <div className="border-b border-[#D4AF37]/10 pb-5 lg:pb-8">

          <Image
            src="/logo.jpg"
            alt="logo"
            width={180}
            height={90}
            className="mx-auto h-auto object-contain"
          />

          <h1 className="mt-4 text-center text-2xl font-black uppercase tracking-[3px] lg:mt-6 lg:text-[30px]">

            XTREME

            <span className="block text-[#D4AF37]">

              ADMIN

            </span>

          </h1>

          <p className="mt-2 text-center text-sm text-neutral-500">

            Consent Dashboard

          </p>

        </div>

        {/* MENU */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:mt-8 lg:block lg:space-y-3">

          <SidebarButton
            label="Dashboard"
            icon={
              <LayoutDashboard
                size={20}
              />
            }
            active={
              tab ===
              "dashboard"
            }
            onClick={() =>
              setTab(
                "dashboard"
              )
            }
          />

          <SidebarButton
            label="Clients"
            icon={
              <Users
                size={20}
              />
            }
            active={
              tab ===
              "clients"
            }
            onClick={() =>
              setTab(
                "clients"
              )
            }
          />

          <SidebarButton
            label="Consent Content Editor"
            icon={
              <FileText
                size={20}
              />
            }
            active={
              tab ===
              "content"
            }
            onClick={() =>
              setTab(
                "content"
              )
            }
          />

          <SidebarButton
            label="Settings"
            icon={
              <Settings
                size={20}
              />
            }
            active={
              tab ===
              "settings"
            }
            onClick={() =>
              setTab(
                "settings"
              )
            }
          />

        </div>
      </aside>

      {/* MAIN */}
      <section className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">

        {/* DASHBOARD */}
        {tab ===
          "dashboard" && (

          <div>

            <h2 className="text-4xl font-black sm:text-[52px]">

              Dashboard

            </h2>

            <p className="mt-2 text-neutral-500">

              Overview of all consent forms

            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Forms"
                value={
                  clients.length
                }
              />

              <StatCard
                title="Tattoo"
                value={
                  clients.filter(
                    (
                      c
                    ) =>
                      c.service_type ===
                      "Tattoo"
                  ).length
                }
              />

              <StatCard
                title="PMU"
                value={
                  clients.filter(
                    (
                      c
                    ) =>
                      c.service_type ===
                      "PMU"
                  ).length
                }
              />

              <StatCard
                title="Piercing"
                value={
                  clients.filter(
                    (
                      c
                    ) =>
                      c.service_type ===
                      "Piercing"
                  ).length
                }
              />

              <StatCard
                title="Revenue"
                value={`₹${totalRevenue.toLocaleString(
                  "en-IN"
                )}`}
              />

              <StatCard
                title="Cash"
                value={
                  clients.filter(
                    (c) =>
                      c.payment_mode ===
                      "Cash"
                  ).length
                }
              />

              <StatCard
                title="GPay"
                value={
                  clients.filter(
                    (c) =>
                      c.payment_mode ===
                      "GPay"
                  ).length
                }
              />

              <StatCard
                title="Card"
                value={
                  clients.filter(
                    (c) =>
                      c.payment_mode ===
                      "Card"
                  ).length
                }
              />

            </div>

          </div>
        )}

        {/* CLIENTS */}
        {tab ===
          "clients" && (

          <div>

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between gap-5">

              <div>

                <h2 className="text-4xl font-black sm:text-[52px]">

                  Clients

                </h2>

                <p className="mt-2 text-neutral-500">

                  Manage client consent forms

                </p>

              </div>

              {/* SEARCH */}
              <div className="relative w-full lg:w-[420px]">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                />

                <input
                  placeholder="Search name, phone, consent no..."
                  value={
                    search
                  }
                  onChange={(
                    e
                  ) =>
                    setSearch(
                      e.target
                        .value
                    )
                  }
                  className="w-full rounded-[22px] border border-[#D4AF37]/10 bg-[#111111] py-4 pl-12 pr-5 outline-none"
                />

              </div>

            </div>

            {/* FILTERS */}
            <div className="mt-7 flex flex-wrap gap-3">

              {[
                "All",
                "Tattoo",
                "PMU",
                "Piercing",
                "Tattoo Removal",
              ].map(
                (
                  item
                ) => (
                  <button
                    key={item}
                    onClick={() =>
                      setServiceFilter(
                        item
                      )
                    }
                    className={
                      serviceFilter ===
                      item
                        ? "rounded-full px-6 py-3 font-semibold bg-[#D4AF37] text-black"
                        : "rounded-full px-6 py-3 font-semibold border border-[#D4AF37]/10 bg-[#111111]"
                    }
                  >
                    {item}
                  </button>
                )
              )}

            </div>

            {/* TABLE */}
            <div className="mt-8 overflow-x-auto rounded-[24px] border border-[#D4AF37]/10 bg-[#0d0d0d] sm:rounded-[32px]">

              {/* TABLE HEAD */}
              <div className="grid min-w-[900px] grid-cols-12 border-b border-[#D4AF37]/10 bg-[#141414] px-6 py-5 text-xs font-bold uppercase tracking-[2px] text-[#D4AF37]">

                <div className="col-span-2">

                  Consent No

                </div>

                <div className="col-span-2">

                  Name

                </div>

                <div className="col-span-2">

                  Service

                </div>

                <div className="col-span-2">

                  Phone

                </div>

                <div className="col-span-2">

                  Date

                </div>

                <div className="col-span-2 text-center">

                  Actions

                </div>

              </div>
              {/* LOADING */}
              {loading && (
                <div className="py-20 text-center text-neutral-500">

                  Loading...

                </div>
              )}

              {/* EMPTY */}
              {!loading &&
                filteredClients.length ===
                  0 && (
                  <div className="py-20 text-center text-neutral-500">

                    No clients found

                  </div>
                )}

              {/* CLIENT ROWS */}
              {!loading &&
                filteredClients.map(
                  (
                    client,
                    index
                  ) => (

                    <div
                      key={
                        client.id ??
                        index
                      }
                      className="grid min-w-[900px] grid-cols-12 items-center border-b border-[#D4AF37]/10 px-6 py-5 transition hover:bg-[#141414]"
                    >

                      {/* CONSENT */}
                      <div className="col-span-2 font-semibold">

                        {
                          client.form_no
                        }

                      </div>

                      {/* NAME */}
                      <div className="col-span-2 flex items-center gap-3">
                        {client.client_photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={client.client_photo}
                            alt={client.name}
                            className="h-10 w-10 rounded-full object-cover border border-[#D4AF37]/30 flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-neutral-850 border border-neutral-800 flex items-center justify-center text-[10px] text-neutral-400 font-black uppercase flex-shrink-0">
                            {client.name ? client.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "N/A"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">
                            {client.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Age: {client.age}
                          </p>
                        </div>
                      </div>

                      {/* SERVICE */}
                      <div className="col-span-2">

                        <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm text-[#D4AF37]">

                          {
                            client.service_type
                          }

                        </span>

                      </div>

                      {/* PHONE */}
                      <div className="col-span-2 text-neutral-300">

                        {
                          client.phone
                        }

                      </div>

                      {/* DATE */}
                      <div className="col-span-2 text-sm text-neutral-500">

                        {client.created_at
                          ? new Date(
                              client.created_at
                            ).toLocaleDateString()
                          : "--"}

                      </div>

                      {/* ACTIONS */}
                      <div className="col-span-2 flex justify-center gap-3">

                        {/* EDIT */}
                        <button
                          onClick={() => {

                            setSelectedClient(
                              client
                            );

                            setEditing(
                              true
                            );
                          }}
                          className="rounded-full bg-[#D4AF37]/10 p-3 text-[#D4AF37] transition hover:scale-105"
                        >

                          <Pencil
                            size={18}
                          />

                        </button>

                        {/* PDF */}
                        <button
                          onClick={async () => {
                            try {
                              await downloadConsentPdf(
                                client,
                                questions
                              );
                            } catch (error) {
                              console.error(
                                error
                              );

                              alert(
                                `Could not download the PDF. Error: ${error instanceof Error ? error.message : String(error)}`
                              );
                            }
                          }}
                          className="rounded-full bg-blue-500/10 p-3 text-blue-400 transition hover:scale-105"
                        >

                          <Download
                            size={18}
                          />

                        </button>

                        {/* DELETE */}
                        <button
                          onClick={async () => {

                            const ok =
                              confirm(
                                `Delete ${client.name}?`
                              );

                            if (
                              !ok
                            )
                              return;

                            await fetch(
                              `/api/consent?id=${client.id}`,
                              {
                                method:
                                  "DELETE",
                              }
                            );

                            fetchClients();
                          }}
                          className="rounded-full bg-red-500/10 p-3 text-red-400 transition hover:scale-105"
                        >

                          <Trash2
                            size={18}
                          />

                        </button>

                      </div>

                    </div>
                  )
                )}

            </div>
          </div>
        )}
        {/* EDIT MODAL */}
        {editing &&
          selectedClient && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5">

            <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[36px] border border-[#D4AF37]/10 bg-[#0b0b0b]">

              {/* HEADER */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D4AF37]/10 bg-[#141414] px-8 py-6">

                <div>

                  <h2 className="text-[34px] font-black uppercase">

                    Edit Client

                  </h2>

                  <p className="mt-2 text-neutral-500">

                    Update consent details

                  </p>

                </div>

                <button
                  onClick={() =>
                    setEditing(
                      false
                    )
                  }
                  className="rounded-full bg-red-500/10 p-3 text-red-400"
                >
                  <X
                    size={20}
                  />
                </button>

              </div>

              {/* BODY */}
              <div className="p-8">

                {/* CLIENT DETAILS */}
                <div className="rounded-[30px] border border-[#D4AF37]/10 bg-[#121212] p-8">

                  <h3 className="mb-8 text-[28px] font-black uppercase">

                    Client Details

                  </h3>

                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 w-full grid md:grid-cols-2 gap-5">
                      <AdminInput
                        label="Consent No"
                        value={
                          selectedClient.form_no
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            form_no:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="Consent Date"
                        type="date"
                        value={
                          selectedClient.consent_date ||
                          (selectedClient.created_at
                            ? new Date(
                                selectedClient.created_at
                              )
                                .toISOString()
                                .split(
                                  "T"
                                )[0]
                            : "")
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            consent_date:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="Client Name"
                        value={
                          selectedClient.name
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            name:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="Phone"
                        value={
                          selectedClient.phone
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            phone:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="DOB"
                        type="date"
                        value={
                          selectedClient.dob
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            dob:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="Age"
                        value={
                          selectedClient.age
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            age:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="Occupation"
                        value={
                          selectedClient.occupation
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            occupation:
                              value,
                          })
                        }
                      />

                      <AdminSelect
                        label="Gender"
                        value={
                          selectedClient.gender
                        }
                        options={[
                          "Male",
                          "Female",
                          "Other",
                        ]}
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            gender:
                              value,
                          })
                        }
                      />

                      <AdminSelect
                        label="Service"
                        value={
                          selectedClient.service_type
                        }
                        options={[
                          "Tattoo",
                          "PMU",
                          "Piercing",
                          "Tattoo Removal",
                        ]}
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            service_type:
                              value as ServiceType,
                          })
                        }
                      />

                      {/* PMU */}
                      {selectedClient.service_type ===
                        "PMU" && (

                        <AdminSelect
                          label="PMU Service"
                          value={
                            selectedClient.pmu_service ||
                            ""
                          }
                          options={[
                            "Eyebrow PMU",
                            "Microblading",
                            "Lip Blush",
                            "Eyeliner PMU",
                            "Scalp Micropigmentation",
                            "Other",
                          ]}
                          onChange={(
                            value
                          ) =>
                            setSelectedClient({
                              ...selectedClient,
                              pmu_service:
                                value,
                            })
                          }
                        />
                      )}

                      <AdminInput
                        label="ID Proof"
                        value={
                          selectedClient.idProof
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            idProof:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="ID Proof Number"
                        value={
                          selectedClient.idProofNo || ""
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            idProofNo:
                              value,
                          })
                        }
                      />

                      <AdminSelect
                        label="Mode Of Payment"
                        value={
                          selectedClient.payment_mode ||
                          ""
                        }
                        options={[
                          "",
                          "Cash",
                          "GPay",
                          "Card",
                        ]}
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            payment_mode:
                              value,
                          })
                        }
                      />

                      <AdminInput
                        label="Price"
                        value={
                          selectedClient.price ||
                          ""
                        }
                        onChange={(
                          value
                        ) =>
                          setSelectedClient({
                            ...selectedClient,
                            price:
                              value.replace(
                                /[^\d.]/g,
                                ""
                              ),
                          })
                        }
                      />

                      {selectedClient.service_type === "Tattoo" && (
                        <AdminInput
                          label="Type Of Needle Used"
                          value={
                            selectedClient.needleType ||
                            ""
                          }
                          onChange={(
                            value
                          ) =>
                            setSelectedClient({
                              ...selectedClient,
                              needleType:
                                value,
                            })
                          }
                        />
                      )}
                    </div>

                    {/* EDIT CLIENT PHOTO */}
                    <div className="w-full max-w-[240px] lg:w-[240px] mx-auto lg:mx-0 flex-shrink-0 flex flex-col">
                      <label className="mb-3 block text-sm uppercase tracking-[2px] text-[#D4AF37] font-semibold">
                        Client Photo
                      </label>
                      <div className="relative aspect-[3/4] w-full rounded-[22px] border border-[#D4AF37]/10 bg-black/40 overflow-hidden flex flex-col items-center justify-center p-3">
                        {selectedClient.client_photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedClient.client_photo}
                            alt="Client"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Users className="text-neutral-500 mx-auto mb-2" size={24} />
                            <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold">No Photo</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <label className="w-full rounded-full border border-[#D4AF37]/20 bg-black/40 py-3 text-center text-xs font-semibold text-[#D4AF37] cursor-pointer hover:bg-[#D4AF37]/10 transition flex items-center justify-center gap-2">
                          <Upload size={14} />
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSelectedClient({
                                    ...selectedClient,
                                    client_photo: reader.result as string
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {selectedClient.client_photo && (
                          <button
                            type="button"
                            onClick={() => setSelectedClient({ ...selectedClient, client_photo: "" })}
                            className="w-full py-2 text-xs font-semibold text-red-400 underline cursor-pointer"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="mt-5">

                    <label className="mb-3 block text-sm uppercase tracking-[2px] text-[#D4AF37] font-semibold">

                      Address

                    </label>

                    <textarea
                      rows={4}
                      value={
                        selectedClient.address
                      }
                      onChange={(
                        e
                      ) =>
                        setSelectedClient({
                          ...selectedClient,
                          address:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-[22px] border border-[#D4AF37]/10 bg-black/40 p-5 resize-none outline-none"
                    />

                  </div>

                </div>
                {/* QUESTIONNAIRE */}
                <div className="mt-8 rounded-[30px] border border-[#D4AF37]/10 bg-[#121212] p-8">

                  <h3 className="mb-8 text-[28px] font-black uppercase">

                    Questionnaire

                  </h3>

                  <div className="space-y-5">

                    {selectedClient.questionnaire &&
                      Object.entries(
                        selectedClient.questionnaire
                      ).map(
                        ([
                          question,
                          answer,
                        ]) => (

                          <div
                            key={
                              question
                            }
                            className="rounded-[22px] border border-[#D4AF37]/10 bg-black/30 p-5"
                          >

                            <p className="font-medium text-neutral-300">

                              {
                                question
                              }

                            </p>

                            <div className="mt-4 flex gap-3">

                              {[
                                "Yes",
                                "No",
                              ].map(
                                (
                                  option
                                ) => (

                                  <button
                                    key={
                                      option
                                    }
                                    type="button"
                                    onClick={() =>
                                      setSelectedClient({
                                        ...selectedClient,
                                        questionnaire:
                                          {
                                            ...selectedClient.questionnaire,
                                            [question]:
                                              option,
                                          },
                                      })
                                    }
                                    className={
                                      answer ===
                                      option
                                        ? "rounded-full bg-[#D4AF37] px-6 py-3 text-black"
                                        : "rounded-full border border-[#D4AF37]/10 bg-black px-6 py-3"
                                    }
                                  >
                                    {
                                      option
                                    }
                                  </button>
                                )
                              )}

                            </div>

                          </div>
                        )
                      )}

                  </div>
                </div>

                {/* NOTES */}
                <div className="mt-8 rounded-[30px] border border-[#D4AF37]/10 bg-[#121212] p-8">

                  <h3 className="mb-5 text-[28px] font-black uppercase">

                    Notes

                  </h3>

                  <textarea
                    rows={5}
                    value={
                      selectedClient.notes ||
                      ""
                    }
                    onChange={(
                      e
                    ) =>
                      setSelectedClient({
                        ...selectedClient,
                        notes:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-[22px] border border-[#D4AF37]/10 bg-black/40 p-5 resize-none outline-none"
                  />

                </div>

                {/* SAVE */}
                <div className="mt-8 flex justify-end gap-4">

                  <button
                    type="button"
                    onClick={() =>
                      setEditing(
                        false
                      )
                    }
                    className="rounded-full border border-red-500/20 bg-red-500/10 px-8 py-4 font-semibold text-red-400"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          "/api/consent",
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(selectedClient),
                          }
                        );

                        if (res.ok) {
                          alert("Client details updated successfully.");
                          fetchClients();
                          setEditing(false);
                        } else {
                          const errData = await res.json().catch(() => ({}));
                          alert(`Failed to save changes: ${errData.error || errData.message || "Unknown error"}`);
                        }
                      } catch (err: any) {
                        console.error(err);
                        alert(`Failed to save changes: ${err.message || "Network error"}`);
                      }
                    }}
                    className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-8 py-4 font-black uppercase text-black"
                  >
                    <Save
                      size={18}
                    />

                    Save Changes
                  </button>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* CONTENT EDITOR */}
        {tab ===
          "content" && (

          <div>

            <h2 className="text-[50px] font-black">

              Consent Content Editor

            </h2>

            <div className="mt-8 flex flex-wrap gap-3">

              {[
                "Tattoo",
                "PMU",
                "Piercing",
                "Tattoo Removal",
              ].map(
                (
                  item
                ) => (
                  <button
                    key={item}
                    onClick={() =>
                      setSelectedService(
                        item
                      )
                    }
                    className={
                      selectedService ===
                      item
                        ? "rounded-full bg-[#D4AF37] px-6 py-3 text-black"
                        : "rounded-full border border-[#D4AF37]/10 bg-[#111111] px-6 py-3"
                    }
                  >
                    {item}
                  </button>
                )
              )}

            </div>

            {/* ADD QUESTION */}
            <div className="mt-8 rounded-[30px] border border-[#D4AF37]/10 bg-[#111111] p-8">

              <h3 className="text-[26px] font-black uppercase">

                Add Question

              </h3>

              <div className="mt-6 grid md:grid-cols-2 gap-5">

                <input
                  placeholder="English Question"
                  value={
                    newQuestion.question_en
                  }
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question_en:
                        e.target.value,
                    })
                  }
                  className="rounded-[22px] border border-[#D4AF37]/10 bg-black/40 p-5 outline-none"
                />

                <input
                  placeholder="Tamil Question"
                  value={
                    newQuestion.question_ta
                  }
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question_ta:
                        e.target.value,
                    })
                  }
                  className="rounded-[22px] border border-[#D4AF37]/10 bg-black/40 p-5 outline-none"
                />

              </div>

              <button
                onClick={async () => {

                  if (
                    !newQuestion.question_en
                  )
                    return;

                  await fetch("/api/questions", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      service_type: selectedService,
                      question_en: newQuestion.question_en,
                      question_ta: newQuestion.question_ta,
                    }),
                  });

                  setNewQuestion({
                    question_en:
                      "",
                    question_ta:
                      "",
                  });

                  fetchQuestions();
                }}
                className="mt-6 flex items-center gap-2 rounded-full bg-[#D4AF37] px-8 py-4 font-black text-black"
              >
                <Plus
                  size={18}
                />

                Add Question
              </button>

            </div>

            <div className="mt-8 rounded-[30px] border border-[#D4AF37]/10 bg-[#111111] p-8">

              <h3 className="text-[26px] font-black uppercase">
                Questions
              </h3>

              <div className="mt-6 space-y-4">
                {questions
                  .filter(
                    (question) =>
                      question.service_type ===
                      selectedService
                  )
                  .map((question) => (
                    <div
                      key={question.id}
                      className="rounded-[22px] border border-[#D4AF37]/10 bg-black/30 p-5"
                    >
                      <p className="font-semibold text-white">
                        {question.question_en}
                      </p>

                      <p className="mt-2 text-neutral-400">
                        {question.question_ta}
                      </p>
                    </div>
                  ))}

                {questions.filter(
                  (question) =>
                    question.service_type ===
                    selectedService
                ).length === 0 && (
                  <p className="text-neutral-500">
                    No questions added for this service.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* SETTINGS */}
        {tab ===
          "settings" && (

          <div>
            <h2 className="text-[50px] font-black">
              Studio Settings
            </h2>

            <div className="mt-8 rounded-[30px] border border-[#D4AF37]/10 bg-[#111111] p-8">
              <div className="grid md:grid-cols-2 gap-5">
                <AdminInput
                  label="Studio Name"
                  value={studioSettings.studio_name}
                  onChange={(value) =>
                    setStudioSettings({
                      ...studioSettings,
                      studio_name: value,
                    })
                  }
                />

                <AdminInput
                  label="Phone"
                  value={studioSettings.phone}
                  onChange={(value) =>
                    setStudioSettings({
                      ...studioSettings,
                      phone: value,
                    })
                  }
                />
              </div>

              <div className="mt-5">
                <label className="mb-3 block text-sm uppercase tracking-[2px] text-[#D4AF37] font-semibold">
                  Address
                </label>

                <textarea
                  rows={4}
                  value={studioSettings.address}
                  onChange={(e) =>
                    setStudioSettings({
                      ...studioSettings,
                      address:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-[22px] border border-[#D4AF37]/10 bg-black/40 p-5 resize-none outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div
          id="pdf-content"
          className="hidden bg-white p-10 text-black"
        >
          {selectedClient && (
            <div className="mx-auto w-full max-w-[720px] font-sans text-[13px] leading-6 text-black">
              <div className="border-b-4 border-black pb-5 text-center">
                <h1 className="text-2xl font-black uppercase tracking-wide">
                  XTREME TATTOO STUDIO
                </h1>

                <p className="mt-1 text-sm">
                  Consent Form
                </p>

                <p className="mt-2 text-xs">
                  VIGNESH PLAZA, 12A, 1st Floor, Thillainagar Main Road, Trichy - 620018 | Contact: 7010343009
                </p>
              </div>

              

              <div className="mt-6 flex justify-between gap-6">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <PdfField
                    label="Consent No"
                    value={selectedClient.form_no}
                  />

                  <PdfField
                    label="Date"
                    value={
                      selectedClient.consent_date
                        ? new Date(
                            selectedClient.consent_date
                          ).toLocaleDateString()
                        : selectedClient.created_at
                        ? new Date(
                            selectedClient.created_at
                          ).toLocaleDateString()
                        : new Date().toLocaleDateString()
                    }
                  />

                  <PdfField
                    label="Service"
                    value={selectedClient.service_type}
                  />

                  <PdfField
                    label="PMU Service"
                    value={
                      selectedClient.service_type ===
                      "PMU"
                        ? selectedClient.pmu_service
                        : ""
                    }
                  />

                  <PdfField
                    label="Payment Mode"
                    value={selectedClient.payment_mode}
                  />

                  <PdfField
                    label="Price"
                    value={
                      selectedClient.price
                        ? `₹${selectedClient.price}`
                        : ""
                    }
                  />
                </div>

                <div className="w-[120px] h-[160px] border border-black flex items-center justify-center overflow-hidden flex-shrink-0 bg-neutral-50">
                  {selectedClient.client_photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedClient.client_photo}
                      alt="Client Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-bold uppercase text-center p-2">
                      No Photo
                    </span>
                  )}
                </div>
              </div>

              <PdfSection title="Client Details">
                <div className="grid grid-cols-2 gap-3">
                  <PdfField
                    label="Client Name"
                    value={selectedClient.name}
                  />

                  <PdfField
                    label="Phone Number"
                    value={selectedClient.phone}
                  />

                  <PdfField
                    label="Date Of Birth"
                    value={selectedClient.dob}
                  />

                  <PdfField
                    label="Age"
                    value={selectedClient.age}
                  />

                  <PdfField
                    label="Gender"
                    value={selectedClient.gender}
                  />

                  <PdfField
                    label="Occupation"
                    value={selectedClient.occupation}
                  />

                  <PdfField
                    label="ID Proof"
                    value={selectedClient.idProof}
                  />

                  <PdfField
                    label="ID Proof Number"
                    value={selectedClient.idProofNo}
                  />

                  <PdfField
                    label="Type Of Needle Used"
                    value={selectedClient.needleType}
                  />
                </div>

                <PdfField
                  label="Address"
                  value={selectedClient.address}
                  full
                />
              </PdfSection>

              <PdfSection title="Health Declaration">
                <div className="space-y-3">
                  {selectedClient.questionnaire &&
                    Object.entries(
                      selectedClient.questionnaire
                    ).map(
                      ([
                        question,
                        answer,
                      ]) => (
                        <div
                          key={question}
                          className="grid grid-cols-[1fr_90px] gap-3 border-b border-neutral-300 pb-2"
                        >
                          <p>
                            {question}
                          </p>

                          <p className="font-bold">
                            {answer}
                          </p>
                        </div>
                      )
                    )}

                  {!selectedClient.questionnaire && (
                    <p>
                      No health declaration answers recorded.
                    </p>
                  )}
                </div>

                <PdfField
                  label="If yes, specify"
                  value={selectedClient.notes}
                  full
                />
              </PdfSection>

              <PdfSection title="Consent & Acknowledgment">
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    I voluntarily consent to receive the selected procedure at XTREME TATTOO STUDIO.
                  </li>
                  <li>
                    I understand the procedure, results, healing, and risks may vary from person to person.
                  </li>
                  <li>
                    I confirm that I have disclosed all medical conditions truthfully.
                  </li>
                  <li>
                    I understand failure to follow aftercare instructions may affect healing and final results.
                  </li>
                  <li>
                    I consent to studio photos for records and promotional purposes.
                  </li>
                  <li>
                    I confirm I am not under the influence of alcohol or drugs during this procedure.
                  </li>
                  <li>
                    I confirm I have read and understood this consent form fully.
                  </li>
                </ol>
              </PdfSection>

              <PdfSection title="Signatures">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2 font-bold uppercase">
                      Customer Signature
                    </p>

                    <div className="flex h-32 items-center justify-center border border-black">
                      {selectedClient.customer_signature ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedClient.customer_signature}
                          alt="Customer signature"
                          className="max-h-28 object-contain"
                        />
                      ) : (
                        <span>
                          Not signed
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-bold uppercase">
                      Artist Signature
                    </p>

                    <div className="flex h-32 items-center justify-center border border-black">
                      {selectedClient.artist_signature ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedClient.artist_signature}
                          alt="Artist signature"
                          className="max-h-28 object-contain"
                        />
                      ) : (
                        <span>
                          Not signed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </PdfSection>
            </div>
          )}
        </div>

      </section>
    </main>
    </LoginGate>
  );
}

function SidebarButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[18px] px-5 py-4 text-left font-semibold transition ${
        active
          ? "bg-[#D4AF37] text-black"
          : "text-neutral-300 hover:bg-[#141414]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[26px] border border-[#D4AF37]/10 bg-[#111111] p-6">
      <p className="text-sm uppercase tracking-[2px] text-neutral-500">
        {title}
      </p>

      <p className="mt-4 text-[40px] font-black text-[#D4AF37]">
        {value}
      </p>
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-3 block text-sm uppercase tracking-[2px] text-[#D4AF37] font-semibold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-[22px] border border-[#2B6CB0]/10 bg-gray-100 p-5 outline-none"
      />
    </div>
  );
}

function AdminSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-3 block text-sm uppercase tracking-[2px] text-[#D4AF37] font-semibold">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-[22px] border border-[#2B6CB0]/10 bg-gray-100 p-5 outline-none"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

const containsTamil = (str: string): boolean => {
  const tamilRange = /[\u0B80-\u0BFF]/;
  return tamilRange.test(str);
};

const fetchBase64Font = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const base64 = base64data.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

async function downloadConsentPdf(
  client: ClientData,
  questionsList: ConsentQuestion[] = []
) {
  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const setPdfFont = (fontName: string, style: string) => {
    try {
      pdf.setFont(fontName, style);
    } catch (e) {
      console.warn(`Font ${fontName} not available, falling back to helvetica`, e);
      try {
        pdf.setFont("helvetica", style);
      } catch {
        // ultimate fallback
      }
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString();
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString();
    } catch {
      return dateStr || "--";
    }
  };

  const safeSplitText = (textStr: string, width: number): string[] => {
    setPdfFont("helvetica", "normal");
    return pdf.splitTextToSize(String(textStr || ""), width) as string[];
  };

  // Layout constants
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 6;
  let y = 14;

  // Preload logo
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadImage("/logo.jpg");
  } catch (e) {
    console.error("Failed to load logo image:", e);
  }

  // Load Tamil font dynamically
  let hasTamilFont = false;
  try {
    const tamilFontBase64 = await fetchBase64Font("/Lohit-Tamil.ttf");
    pdf.addFileToVFS("Lohit-Tamil.ttf", tamilFontBase64);
    pdf.addFont("Lohit-Tamil.ttf", "Lohit-Tamil", "normal");
    hasTamilFont = true;
  } catch (e) {
    console.error("Failed to load Tamil font:", e);
  }

  const startPage = () => {
    // Ensure a new page only if not the first page
    if (pdf.getNumberOfPages() > 1) pdf.addPage();
    // Reset y to top margin
    y = margin;
    // Use black text on white background
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
  };

  // Initialize first page
  startPage();

  const ensureSpace = (
    height: number
  ) => {
    if (
      y + height >
      pageHeight - margin
    ) {
      pdf.addPage();
      y = margin;
    }
  };

  const drawTamilText = (
    textStr: string,
    x: number,
    yPos: number,
    fontSize: number,
    isBold = false,
    color = "#111111",
    maxWidth = contentWidth,
    dryRun = false
  ): number => {
    if (!containsTamil(textStr)) {
      const spacingMm = fontSize * 0.35 + 1.5;
      if (!dryRun) {
        const r = color.startsWith("#") ? parseInt(color.slice(1,3), 16) : 0;
        const g = color.startsWith("#") ? parseInt(color.slice(3,5), 16) : 0;
        const b = color.startsWith("#") ? parseInt(color.slice(5,7), 16) : 0;
        pdf.setTextColor(r, g, b);
        setPdfFont("helvetica", isBold ? "bold" : "normal");
        pdf.setFontSize(fontSize);
        const cleanLine = textStr.replace(/[^\x00-\x7F]/g, "");
        pdf.text(cleanLine, x, yPos);
      }
      return spacingMm; // spacing in mm
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const scale = 4;
    const fontName = 'Inter, "Noto Sans Tamil", "Segoe UI", sans-serif';
    ctx.font = `${isBold ? "bold" : "normal"} ${fontSize * scale}px ${fontName}`;

    // Split text into words and wrap
    const words = textStr.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    const maxPxWidth = maxWidth * 3.7795 * scale;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + " " + words[i] : words[i];
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxPxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    const spacingMm = (fontSize * 0.35) + 1.8;

    if (dryRun) {
      return lines.length * spacingMm;
    }

    let currentY = yPos;

    lines.forEach((line) => {
      const lineCanvas = document.createElement("canvas");
      const lineCtx = lineCanvas.getContext("2d");
      if (!lineCtx) return;

      const lineFontPx = fontSize * scale;
      lineCtx.font = `${isBold ? "bold" : "normal"} ${lineFontPx}px ${fontName}`;
      
      const textWidth = lineCtx.measureText(line).width;
      const pad = 10;
      
      lineCanvas.width = textWidth + pad * 2;
      lineCanvas.height = lineFontPx * 1.4;

      lineCtx.font = `${isBold ? "bold" : "normal"} ${lineFontPx}px ${fontName}`;
      lineCtx.textBaseline = "middle";
      ctx.fillStyle = color;
      lineCtx.fillStyle = color;
      
      lineCtx.imageSmoothingEnabled = true;
      lineCtx.imageSmoothingQuality = "high";

      lineCtx.fillText(line, pad, lineCanvas.height / 2 + 1);

      const imgDataUrl = lineCanvas.toDataURL("image/png");
      const widthMm = lineCanvas.width / (scale * 3.7795);
      const heightMm = lineCanvas.height / (scale * 3.7795);

      try {
        pdf.addImage(imgDataUrl, "PNG", x, currentY - heightMm + (fontSize * 0.22), widthMm, heightMm);
      } catch (e) {
        console.error("Failed to add canvas image for Tamil text:", e);
      }

      currentY += spacingMm;
    });

    return lines.length * spacingMm;
  };

  const safeText = (
    textLines: string | string[],
    x: number,
    yPos: number,
    fontSize: number,
    style: "normal" | "bold" = "normal",
    color = "#111111",
    dryRun = false
  ): number => {
    const lines = Array.isArray(textLines) ? textLines.map(l => String(l || "")) : [String(textLines || "")];
    let currentY = yPos;
    lines.forEach((line) => {
      const isBold = style === "bold";
      const heightUsed = drawTamilText(line, x, currentY, fontSize, isBold, color, pageWidth - margin - x, dryRun);
      currentY += heightUsed;
    });
    return currentY - yPos;
  };

  const text = (
    value: string,
    x: number,
    fontSize = 10,
    style: "normal" | "bold" =
      "normal"
  ) => {
    safeText(value, x, y, fontSize, style);
  };

  const section = (
    title: string
  ) => {
    const parts = title.split(" / ");
    const enTitle = parts[0];
    const taTitle = parts[1] || "";

    if (taTitle) {
      ensureSpace(28);
      y += 2;
      pdf.setFillColor(26, 26, 26);
      pdf.rect(margin, y, contentWidth, 16, "F");

      safeText(String(enTitle || "").toUpperCase(), margin + 3, y + 6.2, 13, "bold", "#D4AF37");
      safeText(taTitle, margin + 3, y + 12.2, 12, "bold", "#D4AF37");

      pdf.setTextColor(0, 0, 0);
      y += 21;
    } else {
      ensureSpace(24);
      y += 2;
      pdf.setFillColor(26, 26, 26);
      pdf.rect(margin, y, contentWidth, 11, "F");

      safeText(String(title || "").toUpperCase(), margin + 3, y + 7.8, 13.5, "bold", "#D4AF37");

      pdf.setTextColor(0, 0, 0);
      y += 16;
    }
  };

  const field = (
    label: string,
    value?: string,
    width = contentWidth,
    xPos = margin
  ) => {
    const displayValue = String(value || "--");
    const valueLines = safeSplitText(displayValue, width);

    const labelParts = label.split(" / ");
    const enLabel = labelParts[0];
    const taLabel = labelParts[1] || "";

    const enLabelHeight = safeText(enLabel.toUpperCase(), xPos, y, 10.5, "bold", "#444444", true);
    const taLabelHeight = taLabel ? safeText([taLabel], xPos, y, 9.5, "bold", "#666666", true) : 0;
    const valueHeight = safeText(valueLines, xPos, y, 12, "bold", "#000000", true);

    const totalHeight = enLabelHeight + (taLabel ? taLabelHeight + 1.5 : 0) + 2.0 + valueHeight + 3.2;
    ensureSpace(totalHeight);

    safeText(enLabel.toUpperCase(), xPos, y, 10.5, "bold", "#444444");
    y += enLabelHeight + 1.2;

    if (taLabel) {
      safeText([taLabel], xPos, y, 9.5, "bold", "#666666");
      y += taLabelHeight + 1.5;
    } else {
      y += 1.5;
    }

    safeText(valueLines, xPos, y, 12, "bold", "#000000");
    y += valueHeight + 3.2;
  };

  const questionTranslations: Record<string, string> = {
    "Are you above 18 years old?": "உங்களுக்கு 18 வயதிற்கு மேல் உள்ளதா?",
    "Are you pregnant or breastfeeding?": "நீங்கள் கர்ப்பமாக உள்ளீர்களா அல்லது குழந்தைக்கு பாலூட்டுகிறீர்களா?",
    "Are you pregnant or breastfeeding": "நீங்கள் கர்ப்பமாக உள்ளீர்களா அல்லது குழந்தைக்கு பாலூட்டுகிறீர்களா?",
    "Do you have diabetes?": "உங்களுக்கு நீரிழிவு நோய் உள்ளதா?",
    "Do you have diabetes, blood pressure or medical conditions?": "உங்களுக்கு சக்கரை நோய், ரத்த அழுத்தம் அல்லது மருத்துவநிலைகள் உள்ளதா??",
    "Do you have any skin disease, allergy, or infection?": "தோல் நோய், அலர்ஜி அல்லது தொற்று உள்ளதா?",
    "Have you used alcohol, weed, or recreational drugs recently?": "நீங்கள் சமீபத்தில் மதுபானம், கஞ்சா அல்லது வேடிக்கை மருந்துகளை பயன்படுத்தியுள்ளீர்களா?",
    "Have you eaten food today?": "இன்று உணவு சாப்பிட்டீர்களா?",
    "Are you taking blood thinners?": "ரத்தத்தை நீர்த்தாக்கும் மருந்துகள் எடுத்துக்கொள்கிறீர்களா?",
    "Are you taking any medications?": "நீங்கள் தற்போது மருந்துகள் எடுத்துக்கொள்கிறீர்களா?",
    "Do you have epilepsy or seizures?": "உங்களுக்கு மயக்கம் அல்லது மிதக்கத் தாக்கங்கள் உள்ளதா?",
    "Have you recently undergone cosmetic treatment?": "நீங்கள் சமீபத்தில் அழகுசார் சிகிச்சை பெற்றுள்ளீர்களா?",
    "Do you have any medical condition we should know about?": "எங்களுக்கு தெரிய வேண்டிய உடல்நல பிரச்சனை ஏதேனும் உள்ளதா?",
    "Is this your first tattoo?": "இது உங்கள் டாட்டூ ஆகுமா?",
    "Is this your first PMU treatment?": "இது உங்கள் முதல் PMU treatment ஆகுமா?",
    "Is this your first piercing?": "இது உங்கள் முதல் piercing ஆகுமா?",
    "Is this your first tattoo removal session?": "இது உங்கள் முதல் டாட்டூ அகற்றும் session ஆகுமா?",
  };

  const translateAnswer = (ans: string) => {
    if (!ans) return "--";
    const upper = ans.trim().toUpperCase();
    if (upper === "YES") return "Yes / ஆம்";
    if (upper === "NO") return "No / இல்லை";
    return ans;
  };

  const translateGender = (g?: string) => {
    if (!g) return "--";
    const upper = g.trim().toUpperCase();
    if (upper === "MALE") return "Male / ஆண்";
    if (upper === "FEMALE") return "Female / பெண்";
    if (upper === "OTHER") return "Other / மற்றவை";
    return g;
  };

  const translatePaymentMode = (pm?: string) => {
    if (!pm) return "--";
    const upper = pm.trim().toUpperCase();
    if (upper === "CASH") return "Cash / ரொக்கம்";
    if (upper === "GPAY") return "GPay / கூகுள் பே";
    if (upper === "CARD") return "Card / அட்டை";
    return pm;
  };

  const lookupAnswer = (questionEn: string): string => {
    if (!client.questionnaire) return "--";
    if (client.questionnaire[questionEn]) return client.questionnaire[questionEn];
    
    // Trim/case-insensitive match
    const foundEntry = Object.entries(client.questionnaire).find(
      ([key]) => key.trim().toLowerCase() === questionEn.trim().toLowerCase()
    );
    if (foundEntry) return foundEntry[1];
    
    // Fuzzy match (strip spaces and question marks)
    const normalize = (s: string) => s.replace(/[?\s]/g, "").toLowerCase();
    const fuzzyEntry = Object.entries(client.questionnaire).find(
      ([key]) => normalize(key) === normalize(questionEn)
    );
    if (fuzzyEntry) return fuzzyEntry[1];
    
    return "--";
  };

  const questionRow = (
    index: number,
    questionEn: string,
    questionTa: string,
    answer: string
  ) => {
    const enText = `${index}. ${questionEn}`;
    const enLines = safeSplitText(enText, contentWidth - 28);
    
    let taLines: string[] = [];
    if (questionTa) {
      taLines = [questionTa];
    }
    
    const enHeight = enLines.length * 5.8;
    const taHeight = taLines.length * 5.8;
    const height = Math.max(enHeight + (taLines.length > 0 ? taHeight + 2 : 0) + 5, 14);

    ensureSpace(height);

    safeText(enLines, margin, y, 11, "bold", "#111111");
    safeText(translateAnswer(answer), pageWidth - margin - 25, y, 11, "bold", "#111111");

    y += enHeight + 1.5;

    if (taLines.length > 0) {
      safeText(taLines, margin + 2, y, 10, "bold", "#333333");
      y += taHeight;
    }

    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.15);
    pdf.line(margin, y + 2.5, pageWidth - margin, y + 2.5);

    y += 6.5;
  };

  const addSignature = (
    label: string,
    signature: string | undefined,
    x: number
  ) => {
    safeText(label, x, y, 9, "bold");
    pdf.rect(
      x,
      y + 3,
      80,
      26
    );

    if (signature) {
      try {
        const format =
          signature.includes(
            "image/jpeg"
          )
            ? "JPEG"
            : "PNG";

        pdf.addImage(
          signature,
          format,
          x + 3,
          y + 6,
          74,
          20
        );
      } catch {
        pdf.setFont(
          "helvetica",
          "normal"
        );
        pdf.text(
          "Signature image unavailable",
          x + 6,
          y + 16
        );
      }
    } else {
      pdf.setFont(
        "helvetica",
        "normal"
      );
      pdf.text(
        "Not signed",
        x + 28,
        y + 16
      );
    }
  };

  // Draw the nice outer border box around the header
  pdf.setDrawColor(26, 26, 26);
  pdf.setLineWidth(0.3);
  pdf.rect(margin, y, contentWidth, 28);

  if (logoImg) {
    // Draw logo on the left side of the header
    const logoWidth = 32;
    const logoHeight = 22;
    try {
      pdf.addImage(logoImg, "JPEG", margin + 4, y + 3, logoWidth, logoHeight);
    } catch (e) {
      console.warn("Failed to add logo image to PDF:", e);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("LOGO", margin + 12, y + 15);
    }
  } else {
    // Fallback if logo fails
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("LOGO", margin + 12, y + 15);
  }

  // Draw studio name and address inside the header box on the right of the logo
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(212, 175, 55); // Premium Brand Gold
  pdf.text("XTREME TATTOO STUDIO", margin + 42, y + 10);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(80, 80, 80); // Dark Charcoal for legible address
  pdf.text("VIGNESH PLAZA, 12A, 1st Floor, Thillainagar Main Road,", margin + 42, y + 17);
  pdf.text("Trichy - 620018 | Contact: 7010343009", margin + 42, y + 22);

  // Set y past the header box
  y += 28 + 6;

  // Draw the highlighted Consent Form banner centered
  pdf.setFillColor(26, 26, 26); // Dark Charcoal
  pdf.rect((pageWidth - 90) / 2, y - 5, 90, 9, "F"); // expanded background bar

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14); // increased to 14pt
  pdf.setTextColor(212, 175, 55); // Premium Gold
  pdf.text("CONSENT FORM", pageWidth / 2, y + 1.2, { align: "center" });

  // Reset text color to black for normal elements
  pdf.setTextColor(0, 0, 0);
  y += 7;

  // Let's set the baseline for metadata fields and photo side-by-side
  const metadataStart = y;

  // Draw Client Photo on the right side
  pdf.rect(151, metadataStart, 45, 55);
  if (client.client_photo) {
    try {
      const format = client.client_photo.includes("image/jpeg") ? "JPEG" : "PNG";
      pdf.addImage(client.client_photo, format, 151, metadataStart, 45, 55);
    } catch (e) {
      console.error("Could not add photo to PDF:", e);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("PHOTO ERROR", 154, metadataStart + 28);
    }
  } else {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text("CLIENT PHOTO", 159, metadataStart + 26);
    pdf.setFont("helvetica", "normal");
    pdf.text("(NO PHOTO)", 162, metadataStart + 31);
  }

  // Draw metadata fields in two columns on the left side
  const colWidth = 60;
  const col1X = margin; // 14
  const col2X = margin + 64; // 78

  // Row 1
  let curY = y;
  field("Consent No / ஒப்புதல் எண்", client.form_no, colWidth, col1X);
  let y1 = y;
  y = curY;
  field(
    "Date / தேதி",
    client.consent_date
      ? formatDate(client.consent_date)
      : client.created_at
      ? formatDate(client.created_at)
      : new Date().toLocaleDateString(),
    colWidth,
    col2X
  );
  y = Math.max(y1, y);

  // Row 2
  curY = y;
  field("Service / சேவை", client.service_type, colWidth, col1X);
  y1 = y;
  y = curY;
  field("Payment Mode / கட்டண முறை", translatePaymentMode(client.payment_mode), colWidth, col2X);
  y = Math.max(y1, y);

  // Row 3
  curY = y;
  field("Price / விலை", client.price ? `Rs. ${client.price}` : "", colWidth, col1X);
  y1 = y;
  y = curY;
  if (client.service_type === "PMU") {
    field("PMU Service / PMU சேவை", client.pmu_service, colWidth, col2X);
  } else {
    y = y1;
  }
  y = Math.max(y1, y);

  // Ensure y coordinate is past both the metadata fields and the client photo
  y = Math.max(y, metadataStart + 55 + 4);

  section(
    "Client Details / வாடிக்கையாளர் விவரங்கள்"
  );

  const detColWidth = 85;
  const detCol1X = margin; // 14
  const detCol2X = margin + 92; // 106

  // Row 1: Name & Phone
  curY = y;
  field("Client Name / பெயர்", client.name, detColWidth, detCol1X);
  y1 = y;
  y = curY;
  field("Phone Number / தொலைபேசி எண்", client.phone, detColWidth, detCol2X);
  y = Math.max(y1, y);

  // Row 2: DOB & Age
  curY = y;
  field("Date Of Birth / பிறந்த தேதி", client.dob, detColWidth, detCol1X);
  y1 = y;
  y = curY;
  field("Age / வயது", client.age, detColWidth, detCol2X);
  y = Math.max(y1, y);

  // Row 3: Gender & Occupation
  curY = y;
  field("Gender / பாலினம்", translateGender(client.gender), detColWidth, detCol1X);
  y1 = y;
  y = curY;
  field("Occupation / தொழில்", client.occupation, detColWidth, detCol2X);
  y = Math.max(y1, y);

  // Row 4: ID Proof & ID Proof Number
  curY = y;
  field("ID Proof / அடையாள சான்று", client.idProof, detColWidth, detCol1X);
  y1 = y;
  y = curY;
  field("ID Proof Number / அடையாள சான்று எண்", client.idProofNo, detColWidth, detCol2X);
  y = Math.max(y1, y);

  // Row 5: Address (Full width for longer text)
  field("Address / முகவரி", client.address, contentWidth, margin);

  // Row 6: Needle Type (if present, Full width)
  if (client.needleType) {
    field("Type Of Needle Used / பயன்படுத்தப்பட்ட ஊசியின் வகை", client.needleType, contentWidth, margin);
  }

  pdf.addPage();
  y = margin;
  section(
    "Health Declaration / உடல்நல அறிவிப்பு"
  );

  const sType = client.service_type || "Tattoo";
  
  // Custom texts based on service type
  const dynamicProcedure = {
    Tattoo: "tattoo procedure",
    PMU: "PMU treatment",
    Piercing: "piercing procedure",
    "Tattoo Removal": "tattoo removal procedure"
  };

  const dynamicType = {
    Tattoo: "permanent body art",
    PMU: "semi-permanent cosmetic procedure",
    Piercing: "body piercing treatment",
    "Tattoo Removal": "tattoo fading/removal process"
  };

  const dynamicTamilFirstQuestion = {
    Tattoo: "இது உங்கள் முதல் tattoo ஆகுமா?",
    PMU: "இது உங்கள் முதல் PMU treatment ஆகுமா?",
    Piercing: "இது உங்கள் முதல் piercing ஆகுமா?",
    "Tattoo Removal": "இது உங்கள் முதல் tattoo removal session ஆகுமா?"
  };

  const procedureEn = dynamicProcedure[sType] || dynamicProcedure.Tattoo;
  const typeEn = dynamicType[sType] || dynamicType.Tattoo;

  const pdfQuestions = [
    {
      en: "Are you above 18 years old?",
      ta: "உங்களுக்கு 18 வயதிற்கு மேல் உள்ளதா?"
    },
    {
      en: sType === "PMU" ? "Are you pregnant or breastfeeding?" : "Are you pregnant or breastfeeding",
      ta: "நீங்கள் கர்ப்பமாக உள்ளீர்களா அல்லது குழந்தைக்கு பாலூட்டுகிறீர்களா?"
    },
    {
      en: sType === "PMU" ? "Do you have diabetes?" : "Do you have diabetes, blood pressure or medical conditions?",
      ta: sType === "PMU" ? "உங்களுக்கு நீரிழிவு நோய் உள்ளதா?" : "உங்களுக்கு சக்கரை நோய், ரத்த அழுத்தம் அல்லது மருத்துவநிலைகள் உள்ளதா??"
    },
    {
      en: sType === "PMU" ? "Do you have any skin disease, allergy, or infection?" : `Do you have skin issues or conditions that may affect ${procedureEn}?`,
      ta: "தோல் நோய், அலர்ஜி அல்லது தொற்று உள்ளதா?"
    },
    {
      en: "Have you used alcohol, weed, or recreational drugs recently?",
      ta: "நீங்கள் சமீபத்தில் மதுபானம், கஞ்சா அல்லது வேடிக்கை மருந்துகளை பயன்படுத்தியுள்ளீர்களா?"
    },
    {
      en: "Have you eaten food today?",
      ta: "இன்று உணவு சாப்பிட்டீர்களா?"
    },
    {
      en: sType === "PMU" ? "Is this your first PMU treatment?" : sType === "Piercing" ? "Is this your first piercing?" : sType === "Tattoo Removal" ? "Is this your first tattoo removal session?" : "Is this your first tattoo?",
      ta: dynamicTamilFirstQuestion[sType] || dynamicTamilFirstQuestion.Tattoo
    },
    {
      en: sType === "PMU" ? "Are you taking blood thinners?" : "Are you taking any medications?",
      ta: sType === "PMU" ? "ரத்தத்தை நீர்த்தாக்கும் மருந்துகள் எடுத்துக்கொள்கிறீர்களா?" : "நீங்கள் தற்போது மருந்துகள் எடுத்துக்கொள்கிறீர்களா?"
    },
    {
      en: "Do you have epilepsy or seizures?",
      ta: "உங்களுக்கு மயக்கம் அல்லது மிதக்கத் தாக்கங்கள் உள்ளதா?"
    },
    {
      en: sType === "PMU" ? "Have you recently undergone cosmetic treatment?" : `Have you recently undergone treatment related to ${typeEn}?`,
      ta: "நீங்கள் சமீபத்தில் அழகுசார் சிகிச்சை பெற்றுள்ளீர்களா?"
    },
    {
      en: "Do you have any medical condition we should know about?",
      ta: "எங்களுக்கு தெரிய வேண்டிய உடல்நல பிரச்சனை ஏதேனும் உள்ளதா?"
    }
  ];

  if (client.questionnaire) {
    pdfQuestions.forEach((q, index) => {
      const answer = lookupAnswer(q.en);
      questionRow(index + 1, q.en, q.ta, answer);
    });
  } else {
    field(
      "Answers / பதில்கள்",
      "No health declaration answers recorded."
    );
  }

  field(
    "If yes, specify / ஆம் எனில் குறிப்பிடவும்",
    client.notes
  );

  // Start Consent & Acknowledgment (Page 3)
  pdf.addPage();
  y = margin;
  section("Consent & Acknowledgment / ஒப்புதல் மற்றும் அங்கீகாரம்");

  const dynamicContent = {
    Tattoo: {
      procedure: "tattoo procedure",
      tamilProcedure: "டாட்டூ செயல்",
      type: "permanent body art",
      tamilType: "நிரந்தர உடல் கலை",
      risks: "skin irritation, redness, swelling, infection, allergic reaction or dissatisfaction",
      tamilRisks: "தோல் எரிச்சல், சிவப்பு, வீக்கம், infection, allergy அல்லது திருப்தியின்மை",
    },
    PMU: {
      procedure: "PMU treatment",
      tamilProcedure: "PMU சிகிச்சை",
      type: "semi-permanent cosmetic procedure",
      tamilType: "அரைய்நிரந்தர அழகு சிகிச்சை",
      risks: "redness, swelling, fading, irritation or dissatisfaction",
      tamilRisks: "சிவப்பு, வீக்கம், fading, irritation அல்லது திருப்தியின்மை",
    },
    Piercing: {
      procedure: "piercing procedure",
      tamilProcedure: "piercing செயல்",
      type: "body piercing treatment",
      tamilType: "உடல் piercing சிகிச்சை",
      risks: "pain, irritation, infection or swelling",
      tamilRisks: "வலி, irritation, infection அல்லது வீக்கம்",
    },
    "Tattoo Removal": {
      procedure: "tattoo removal procedure",
      tamilProcedure: "டாட்டூ அகற்றும் செயல்",
      type: "tattoo fading/removal process",
      tamilType: "டாட்டூ அகற்றும் செயல்முறை",
      risks: "redness, blistering, discomfort or multiple sessions",
      tamilRisks: "சிவப்பு, blistering, discomfort அல்லது பல sessions",
    },
  };

  const contentVars = dynamicContent[sType] || dynamicContent["Tattoo"];

  const consentStatements = [
    {
      en: `I voluntarily consent to receive ${contentVars.procedure} at XTREME TATTOO STUDIO.`,
      ta: `XTREME TATTOO STUDIO-ல் ${contentVars.tamilProcedure} பெற நான் என் சொந்த விருப்பத்துடன் ஒப்புதல் அளிக்கிறேன்.`
    },
    {
      en: `I understand this is a ${contentVars.type} and results may vary from person to person.`,
      ta: `இது ஒரு ${contentVars.tamilType} என்பதை நான் புரிந்துகொள்கிறேன். முடிவுகள் ஒவ்வொருவருக்கும் மாறுபடலாம்.`
    },
    {
      en: `I understand risks may include ${contentVars.risks}.`,
      ta: `இதனால் ${contentVars.tamilRisks} போன்ற பிரச்சனைகள் ஏற்படலாம் என்பதை நான் புரிந்துகொள்கிறேன்.`
    },
    {
      en: "I confirm that I have disclosed all medical conditions truthfully.",
      ta: "எனது அனைத்து உடல்நல தகவல்களையும் உண்மையாக வழங்கியுள்ளேன்."
    },
    {
      en: "I understand failure to follow aftercare instructions may affect healing and final results.",
      ta: "Aftercare வழிமுறைகளை பின்பற்றவில்லை என்றால் healing மற்றும் இறுதி முடிவுகள் பாதிக்கப்படலாம்."
    },
    {
      en: "I consent to studio photos for records and promotional purposes.",
      ta: "Studio records மற்றும் promotion நோக்கத்திற்காக புகைப்படம் எடுக்க அனுமதி அளிக்கிறேன்."
    },
    {
      en: "I release XTREME TATTOO STUDIO, artists and employees from expected legal liabilities related to healing results.",
      ta: "Healing முடிவுகள் தொடர்பான சட்ட பொறுப்புகளில் இருந்து XTREME TATTOO STUDIO மற்றும் artists-ஐ விடுவிக்கிறேன்."
    },
    {
      en: "I confirm I am not under the influence of alcohol or drugs during this procedure.",
      ta: "இந்த procedure நேரத்தில் alcohol அல்லது drugs தாக்கத்தில் இல்லை என்பதை உறுதிப்படுத்துகிறேன்."
    },
    {
      en: "I confirm I have read and understood this consent form fully.",
      ta: "இந்த consent form-ஐ முழுமையாக படித்து புரிந்துகொண்டேன் என்பதை உறுதிப்படுத்துகிறேன்."
    }
  ];

  consentStatements.forEach((item, index) => {
    const enText = `${index + 1}. ${item.en}`;
    const enLines = safeSplitText(enText, contentWidth);
    
    const enHeight = safeText(enLines, margin, y, 11.5, "bold", "#000000", true);
    const taHeight = item.ta ? safeText([item.ta], margin + 4, y, 10.5, "bold", "#222222", true) : 0;
    const totalHeight = enHeight + (item.ta ? taHeight + 2 : 0) + 5;

    ensureSpace(totalHeight);

    // Draw English: bold, 11.5pt, pure black
    safeText(enLines, margin, y, 11.5, "bold", "#000000");
    y += enHeight + 1.8;

    // Draw Tamil: bold, 10.5pt, dark charcoal
    if (item.ta) {
      safeText([item.ta], margin + 4, y, 10.5, "bold", "#222222");
      y += taHeight;
    }

    y += 5.5; // Space between items - expanded to use page elegantly
  });

  // Signatures on Page 3
  section("Signature Verification / கையொப்பம் சரிபார்ப்பு");
  ensureSpace(45);
  addSignature(
    "Customer Signature / வாடிக்கையாளர் கையொப்பம்",
    client.customer_signature,
    margin
  );
  addSignature(
    "Artist Signature / கலைஞர் கையொப்பம்",
    client.artist_signature,
    pageWidth / 2 + 5
  );

  // Start Aftercare Acknowledgment (Page 4)
  pdf.addPage();
  y = margin;
  section("Aftercare Acknowledgment / பிந்தைய பராமரிப்பு ஒப்புதல்");

  const dynamicAftercare = {
    Tattoo: "Follow all tattoo aftercare instructions provided by your tattoo artist.",
    PMU: "Avoid water, makeup and sweating during healing.",
    Piercing: "Follow all piercing aftercare instructions carefully.",
    "Tattoo Removal": "Avoid direct sunlight and follow removal aftercare instructions."
  };

  const dynamicTamilAftercare = {
    Tattoo: "உங்கள் tattoo artist வழங்கும் aftercare வழிமுறைகளை சரியாக பின்பற்ற வேண்டும்.",
    PMU: "healing காலத்தில் தண்ணீர், makeup மற்றும் sweating தவிர்க்க வேண்டும்.",
    Piercing: "piercing aftercare வழிமுறைகளை சரியாக பின்பற்ற வேண்டும்.",
    "Tattoo Removal": "நேரடி வெயிலை தவிர்த்து aftercare வழிமுறைகளை பின்பற்ற வேண்டும்."
  };

  const aftercareStatements = [
    {
      en: dynamicAftercare[sType] || dynamicAftercare.Tattoo,
      ta: dynamicTamilAftercare[sType] || dynamicTamilAftercare.Tattoo
    },
    {
      en: "Avoid touching treated area.",
      ta: "சிகிச்சை செய்யப்பட்ட பகுதியை தொட வேண்டாம்."
    },
    {
      en: "Avoid swimming, sweating and irritation.",
      ta: "Swimming, sweating மற்றும் irritation தவிர்க்கவும்."
    },
    {
      en: "Do not scratch healing skin.",
      ta: "Healing skin-ஐ scratch செய்ய வேண்டாம்."
    },
    {
      en: "Follow artist instructions carefully.",
      ta: "Artist வழங்கும் வழிமுறைகளை கவனமாக பின்பற்றவும்."
    }
  ];

  aftercareStatements.forEach((item, index) => {
    const enText = `${index + 1}. ${item.en}`;
    const enLines = safeSplitText(enText, contentWidth);
    
    const enHeight = safeText(enLines, margin, y, 12, "bold", "#000000", true);
    const taHeight = item.ta ? safeText([item.ta], margin + 4, y, 11, "bold", "#222222", true) : 0;
    const totalHeight = enHeight + (item.ta ? taHeight + 2 : 0) + 5;

    ensureSpace(totalHeight);

    // Draw English: bold, 12pt, pure black
    safeText(enLines, margin, y, 12, "bold", "#000000");
    y += enHeight + 2.0;

    // Draw Tamil: bold, 11pt, dark charcoal
    if (item.ta) {
      safeText([item.ta], margin + 4, y, 11, "bold", "#222222");
      y += taHeight;
    }

    y += 8.0; // Space between items - expanded to use the page beautifully since signatures are removed
  });

  const fileName =
    `${client.name || "client"}-consent.pdf`.replace(
      /[\\/:*?"<>|]+/g,
      "-"
    );

  pdf.save(fileName);
}

function PdfSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 break-inside-avoid border border-black p-4">
      <h2 className="mb-4 border-b border-black pb-2 text-base font-black uppercase">
        {title}
      </h2>

      {children}
    </section>
  );
}

function PdfField({
  label,
  value,
  full = false,
}: {
  label: string;
  value?: string;
  full?: boolean;
}) {
  return (
    <div
      className={
        full
          ? "mt-3"
          : ""
      }
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-600">
        {label}
      </p>

      <p className="min-h-7 border-b border-neutral-400 pb-1 font-semibold">
        {value || "--"}
      </p>
    </div>
  );
}
