import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // 👈 URL params ke liye
import { submitMeterReading } from "../services/usageService";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Camera,
  MapPin,
  Send,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Activity,
  AlertCircle,
} from "lucide-react";

export default function MeterEntry() {
  const router = useRouter();
  const { id } = router.query; // 👈 URL se Customer ID uthayega

  const [customer, setCustomer] = useState(null); // Asali data yahan save hoga
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reading, setReading] = useState("");
  const [image, setImage] = useState(null);

  // 📡 Real Development: Fetching Customer details from Backend
  // backend/api/src/modules/gas-usage/gas-usage.controller.js -> MeterEntry.js mein ye update karo

  useEffect(() => {
    // 🟢 CHANGE: Agar router taiyar hai par ID nahi mili, toh loading band karo
    if (router.isReady && !id) {
      setLoading(false);
      return;
    }

    if (!id) return;

    const fetchKisanData = async () => {
      try {
        setLoading(true);
        console.log("📡 Fetching data for ID:", id);

        const res = await fetch(`http://localhost:4000/v1/customers/${id}`);

        if (!res.ok) throw new Error("Server ne mana kar diya!");

        const result = await res.json();
        if (result.success) {
          setCustomer(result.data);
        }   
      } catch (error) {
        console.error("❌ Connection Error:", error);
        setCustomer(null);
      } finally {
        setLoading(false); // ✅ Yahan loading hamesha band hogi
      }
    };

    fetchKisanData();
  }, [id, router.isReady]); // 👈 router.isReady ko dependency mein daalo

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert("Bhai, photo toh kheencho! Evidence zaroori hai.");
    if (!customer) return alert("System Error: No customer identified.");

    setSubmitting(true);

    try {
      // ✅ CHANGE: Ab dummy "CUST-RAM-001" nahi, asali customer.id jayegi
      const result = await submitMeterReading(customer.id, reading, image);

      if (result.success) {
        setSuccess(true);
      } else {
        alert("Sync Failed: " + result.message);
      }
    } catch (error) {
      alert("Something went wrong with the grid sync!");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading Screen
  if (loading && !customer) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="ml-4 font-black uppercase tracking-widest text-neutral-400">
          Connecting to Grid...
        </p>
      </Section>
    );
  }

  // Error Screen (Agar ID galat ho)
  if (!loading && !customer) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <Container narrow className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-black mb-4">No Record Found!</h2>
          <Button href="/" variant="secondary">
            Go Back to Dashboard
          </Button>
        </Container>
      </Section>
    );
  }

  if (success) {
    return (
      <Section className="min-h-screen flex items-center">
        <Container narrow className="text-center">
          <div className="w-24 h-24 bg-emerald-100 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-100">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 mb-4 tracking-tight">
            Reading Captured!
          </h2>
          <p className="text-neutral-500 font-medium mb-10">
            The grid data for{" "}
            <span className="text-primary font-bold">{customer.name}</span> has
            been updated.
          </p>
          <Button
            onClick={() => {
              setSuccess(false);
              setReading("");
              setImage(null);
            }}
            className="w-full"
          >
            Record New Reading
          </Button>
        </Container>
      </Section>
    );
  }

  return (
    <Section alt className="min-h-screen !py-10">
      <Container narrow>
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="!p-3 border-none bg-white shadow-sm"
          >
            <ArrowLeft size={20} className="text-neutral-500" />
          </Button>
          <h1 className="text-xl font-black text-neutral-900">Usage Entry</h1>
        </div>

        {/* 🟢 DYNAMIC CUSTOMER CARD */}
        <Card className="bg-primary text-white mb-8 shadow-xl shadow-primary/20 border-none relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              Active Grid User
            </div>
            {/* ✅ CHANGE: Dynamic Name */}
            <h2 className="text-2xl font-black mt-1 leading-none">
              {customer.name}
            </h2>

            <div className="flex flex-col gap-1 mt-4">
              <div className="flex items-center gap-2 text-xs font-medium opacity-90">
                <MapPin size={12} /> {customer.villages?.name || "Village Hub"},
                Sector-A
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Activity size={12} /> Meter: #{customer.meter_number}
              </div>
            </div>
          </div>

          {/* Last Reading Badge */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 p-4 rounded-2xl backdrop-blur-md text-right border border-white/10">
            <div className="text-[8px] font-black uppercase opacity-60">
              Last Reading
            </div>
            <div className="text-xl font-black">
              {customer.meters?.[0]?.last_reading || "0.00"}
            </div>
            <div className="text-[8px] font-bold">m³</div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">
              Evidence / Photo Proof
            </label>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              id="meter-photo"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <label htmlFor="meter-photo" className="block cursor-pointer">
              <Card
                className={`bg-white border-2 border-dashed !p-10 flex flex-col items-center justify-center transition-all group ${image ? "border-primary bg-emerald-50" : "border-neutral-200"}`}
                hover
              >
                <div className="w-16 h-16 bg-emerald-50 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera size={28} />
                </div>
                <span className="font-black text-neutral-500 text-center">
                  {image ? "Photo Captured ✓" : "Tap to Scan Meter"}
                </span>
                {image && (
                  <p className="text-[10px] mt-2 text-primary font-bold">
                    {image.name}
                  </p>
                )}
              </Card>
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">
              Current Reading (m³)
            </label>
            <Card className="bg-white border-none p-2 shadow-sm">
              <input
                type="number"
                step="0.001"
                placeholder="0000.000"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                className="w-full bg-transparent p-6 text-4xl font-black text-center text-primary outline-none placeholder:text-neutral-100"
                required
              />
            </Card>
          </div>

          <Button
            type="submit"
            className="w-full !py-6 text-lg"
            disabled={submitting || !reading}
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send size={20} className="mr-2" /> Sync to Grid
              </>
            )}
          </Button>
        </form>
      </Container>
    </Section>
  );
}
