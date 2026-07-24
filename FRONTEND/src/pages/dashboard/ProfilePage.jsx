import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { getHealthProfile, getScanHistory, updateHealthProfile, getErrorMessage } from "../../lib/mlApi";
import {
  Activity,
  AlertTriangle,
  Apple,
  BadgeAlert,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Flame,
  HeartPulse,
  Loader2,
  PencilLine,
  Save,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { showError, showSuccess } from "../../lib/toast";

const cardClass = "rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6";
const pillClass = "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700";

const fallbackConditions = [
  { id: "d1", name: "Diabetes", severity: "moderate", addedOn: "2024-08-12" },
  { id: "d2", name: "Hypertension", severity: "mild", addedOn: "2024-09-01" },
];

const fallbackAllergies = [
  { id: "a1", name: "Peanuts", severity: "severe", addedOn: "2023-11-18" },
  { id: "a2", name: "Dairy", severity: "mild", addedOn: "2024-01-08" },
];

const fallbackScans = [
  { id: "s1", name: "Green Smoothie Bowl", brand: "PureByte Studio", scannedAt: "2024-10-09", healthFit: "good" },
  { id: "s2", name: "Protein Bar", brand: "Wellness Co", scannedAt: "2024-10-08", healthFit: "caution" },
  { id: "s3", name: "Gluten-Free Pasta", brand: "Harvest", scannedAt: "2024-10-07", healthFit: "avoid" },
];

const fallbackNutrition = {
  calories: { current: 1820, target: 2000 },
  protein: { current: 92, target: 120 },
  carbs: { current: 220, target: 250 },
  fat: { current: 63, target: 70 },
  sodium: { current: 1420, target: 1200, flagged: true },
};

function DashboardCard({ title, subtitle, icon: Icon, action, children, className = "" }) {
  return (
    <section className={`${cardClass} ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {Icon ? <Icon size={18} className="text-emerald-600" /> : null}
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          </div>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SkeletonBlock({ className = "h-4 w-full" }) {
  return <div className={`animate-pulse rounded-full bg-emerald-100 ${className}`} />;
}

export default function ProfilePage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState({
    conditions: fallbackConditions,
    allergies: fallbackAllergies,
    notes: "Keep sodium light and prioritize high-protein meals.",
  });
  const [scannedItems, setScannedItems] = useState(fallbackScans);
  const [nutrition, setNutrition] = useState(fallbackNutrition);
  const [selectedChip, setSelectedChip] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [conditionInput, setConditionInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [notesInput, setNotesInput] = useState(profile.notes);
  const [draftNutrition, setDraftNutrition] = useState(fallbackNutrition);

  const displayName = user?.name || "Alex Carter";
  const displayEmail = user?.email || "alex@example.com";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "Joined recently";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [healthResponse, historyResponse] = await Promise.allSettled([
          getHealthProfile(),
          getScanHistory(6, 0),
        ]);

        if (!mounted) return;

        const healthData = healthResponse.status === "fulfilled" ? healthResponse.value?.data || {} : {};
        const conditions = (healthData.conditions || []).length
          ? (healthData.conditions || []).map((condition, index) => ({
              id: `${condition}-${index}`,
              name: condition.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
              severity: index === 0 ? "moderate" : "mild",
              addedOn: new Date().toISOString(),
            }))
          : fallbackConditions;

        const allergies = (healthData.allergies || []).length
          ? (healthData.allergies || []).map((allergy, index) => ({
              id: `${allergy}-${index}`,
              name: allergy.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
              severity: index === 0 ? "severe" : "mild",
              addedOn: new Date().toISOString(),
            }))
          : fallbackAllergies;

        const historyItems = historyResponse.status === "fulfilled" && historyResponse.value?.data?.items?.length
          ? historyResponse.value.data.items.slice(0, 4).map((item, index) => ({
              id: item.id || `scan-${index}`,
              name: item.productName || "Scanned item",
              brand: item.brand || "Recent scan",
              scannedAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently scanned",
              healthFit: item.safetyScore >= 80 ? "good" : item.safetyScore >= 60 ? "caution" : "avoid",
            }))
          : fallbackScans;

        const nextNutrition = healthData.goals
          ? {
              calories: { current: fallbackNutrition.calories.current, target: Number(healthData.goals.calories || fallbackNutrition.calories.target) },
              protein: { current: fallbackNutrition.protein.current, target: Number(healthData.goals.protein || fallbackNutrition.protein.target) },
              carbs: { current: fallbackNutrition.carbs.current, target: Number(healthData.goals.carbs || fallbackNutrition.carbs.target) },
              fat: { current: fallbackNutrition.fat.current, target: Number(healthData.goals.fat || fallbackNutrition.fat.target) },
              sodium: { current: fallbackNutrition.sodium.current, target: Number(healthData.goals.sodium || fallbackNutrition.sodium.target), flagged: Number(healthData.goals.sodium || fallbackNutrition.sodium.target) < 1200 },
            }
          : fallbackNutrition;

        setProfile({
          conditions,
          allergies,
          notes: healthData.notes || "Keep sodium light and prioritize high-protein meals.",
        });
        setScannedItems(historyItems);
        setNutrition(nextNutrition);
        setDraftNutrition(nextNutrition);
        setNotesInput(healthData.notes || "Keep sodium light and prioritize high-protein meals.");
      } catch (error) {
        if (!mounted) return;
        setProfile({
          conditions: fallbackConditions,
          allergies: fallbackAllergies,
          notes: "Keep sodium light and prioritize high-protein meals.",
        });
        setScannedItems(fallbackScans);
        setNutrition(fallbackNutrition);
        setDraftNutrition(fallbackNutrition);
        setNotesInput("Keep sodium light and prioritize high-protein meals.");
        showError(getErrorMessage(error, "Could not load your profile."));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const healthSummary = useMemo(() => ({
    totalScans: scannedItems.length,
    activeAllergies: profile.allergies.length,
    trackedConditions: profile.conditions.length,
  }), [profile.allergies.length, profile.conditions.length, scannedItems.length]);

  const nutritionItems = useMemo(() => [
    { key: "calories", label: "Calories", unit: "kcal", current: nutrition.calories.current, target: nutrition.calories.target, accent: "emerald" },
    { key: "protein", label: "Protein", unit: "g", current: nutrition.protein.current, target: nutrition.protein.target, accent: "emerald" },
    { key: "carbs", label: "Carbs", unit: "g", current: nutrition.carbs.current, target: nutrition.carbs.target, accent: "sky" },
    { key: "fat", label: "Fat", unit: "g", current: nutrition.fat.current, target: nutrition.fat.target, accent: "amber" },
    { key: "sodium", label: "Sodium", unit: "mg", current: nutrition.sodium.current, target: nutrition.sodium.target, accent: nutrition.sodium.flagged ? "rose" : "emerald", flagged: nutrition.sodium.flagged },
  ], [nutrition]);

  const saveProfile = async (nextProfile = null, nextNutritionTargets = null) => {
    setSavingProfile(true);
    try {
      const payload = {
        conditions: (nextProfile?.conditions || profile.conditions).map((item) => item.name.toLowerCase().replace(/\s+/g, "_")),
        allergies: (nextProfile?.allergies || profile.allergies).map((item) => item.name.toLowerCase().replace(/\s+/g, "_")),
        notes: nextProfile?.notes ?? notesInput,
        goals: nextNutritionTargets
          ? {
              calories: nextNutritionTargets.calories?.target ?? nutrition.calories.target,
              protein: nextNutritionTargets.protein?.target ?? nutrition.protein.target,
              carbs: nextNutritionTargets.carbs?.target ?? nutrition.carbs.target,
              fat: nextNutritionTargets.fat?.target ?? nutrition.fat.target,
              sodium: nextNutritionTargets.sodium?.target ?? nutrition.sodium.target,
            }
          : {
              calories: nutrition.calories.target,
              protein: nutrition.protein.target,
              carbs: nutrition.carbs.target,
              fat: nutrition.fat.target,
              sodium: nutrition.sodium.target,
            },
      };

      await updateHealthProfile(payload);
      const nextConditions = (nextProfile?.conditions || profile.conditions).map((item, index) => ({ ...item, severity: item.severity || (index === 0 ? "moderate" : "mild") }));
      const nextAllergies = (nextProfile?.allergies || profile.allergies).map((item, index) => ({ ...item, severity: item.severity || (index === 0 ? "severe" : "mild") }));
      setProfile({
        conditions: nextConditions,
        allergies: nextAllergies,
        notes: payload.notes,
      });
      setNotesInput(payload.notes);
      if (nextNutritionTargets) {
        const nextTargets = {
          calories: { current: nutrition.calories.current, target: Number(payload.goals.calories) },
          protein: { current: nutrition.protein.current, target: Number(payload.goals.protein) },
          carbs: { current: nutrition.carbs.current, target: Number(payload.goals.carbs) },
          fat: { current: nutrition.fat.current, target: Number(payload.goals.fat) },
          sodium: { current: nutrition.sodium.current, target: Number(payload.goals.sodium), flagged: Number(payload.goals.sodium) < 1200 },
        };
        setNutrition(nextTargets);
        setDraftNutrition(nextTargets);
      }
      showSuccess("Profile updated successfully.");
    } catch (error) {
      showError(getErrorMessage(error, "Could not save your profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddCondition = async (event) => {
    event.preventDefault();
    const value = conditionInput.trim();
    if (!value) return;
    const nextCondition = { id: `${value}-${Date.now()}`, name: value.replace(/\b\w/g, (letter) => letter.toUpperCase()), severity: "mild", addedOn: new Date().toISOString() };
    const nextProfile = {
      ...profile,
      conditions: [...profile.conditions, nextCondition],
    };
    await saveProfile(nextProfile);
    setConditionInput("");
    setConditionModalOpen(false);
  };

  const handleAddAllergy = async (event) => {
    event.preventDefault();
    const value = allergyInput.trim();
    if (!value) return;
    const nextAllergy = { id: `${value}-${Date.now()}`, name: value.replace(/\b\w/g, (letter) => letter.toUpperCase()), severity: "mild", addedOn: new Date().toISOString() };
    const nextProfile = {
      ...profile,
      allergies: [...profile.allergies, nextAllergy],
    };
    await saveProfile(nextProfile);
    setAllergyInput("");
    setAllergyModalOpen(false);
  };

  const handleSaveNotes = async (event) => {
    event.preventDefault();
    await saveProfile({ ...profile, notes: notesInput });
    setProfileModalOpen(false);
  };

  const handleSaveGoals = async (event) => {
    event.preventDefault();
    await saveProfile(profile, draftNutrition);
    setGoalsModalOpen(false);
  };

  const renderHealthFit = (value) => {
    if (value === "good") return <BadgeCheck className="h-4 w-4 text-emerald-600" />;
    if (value === "caution") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <CircleAlert className="h-4 w-4 text-rose-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Profile Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Your health overview</h1>
          <p className="mt-1 text-sm text-slate-500">A calm summary of your profile, scan history, and nutrition goals.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          <Sparkles size={16} />
          Personalized insights ready
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard
          title="Profile"
          subtitle="Your account and health snapshot"
          icon={HeartPulse}
          action={
            <button type="button" onClick={() => { setNotesInput(profile.notes); setProfileModalOpen(true); }} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 transition hover:-translate-y-0.5 hover:shadow-sm">
              <PencilLine size={15} />
              Edit profile
            </button>
          }
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-lg font-semibold text-emerald-700">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{displayName}</p>
                <p className="text-sm text-slate-500">{displayEmail}</p>
                <p className="mt-1 text-sm text-slate-400">Member since {memberSince}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={pillClass}><Activity size={15} /> {healthSummary.totalScans} scans</span>
              <span className={pillClass}><BadgeAlert size={15} /> {healthSummary.activeAllergies} allergies</span>
              <span className={pillClass}><Stethoscope size={15} /> {healthSummary.trackedConditions} conditions</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Focus note" subtitle="How your profile is guiding the app" icon={ShieldCheck}>
          {loading ? (
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Goal:</span> Keep sodium low for your current care plan.</p>
              <p>{profile.notes}</p>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-700">
                <p className="font-medium">Care note</p>
                <p className="mt-1 text-sm">Your guidance is tuned to reduce triggers for {profile.conditions[0]?.name || "your tracked conditions"}.</p>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard
          title="Health conditions"
          subtitle="Conditions that shape your nutrition recommendations"
          icon={HeartPulse}
          action={<button type="button" onClick={() => setConditionModalOpen(true)} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:shadow-sm">+ Add condition</button>}
        >
          {loading ? (
            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-8 w-24" />
              <SkeletonBlock className="h-8 w-24" />
            </div>
          ) : profile.conditions.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.conditions.map((condition) => (
                <button key={condition.id} type="button" onClick={() => setSelectedChip(condition)} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:-translate-y-0.5 hover:shadow-sm">
                  <span className="mr-2">🩺</span>
                  {condition.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-center text-sm text-slate-600">
              <p className="font-semibold text-slate-800">No conditions tracked yet</p>
              <p className="mt-1">Add conditions to improve scan guidance.</p>
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Allergies"
          subtitle="Color-coded by severity"
          icon={AlertTriangle}
          action={<button type="button" onClick={() => setAllergyModalOpen(true)} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:shadow-sm">+ Add allergy</button>}
        >
          {loading ? (
            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-8 w-24" />
              <SkeletonBlock className="h-8 w-24" />
            </div>
          ) : profile.allergies.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy) => (
                <button key={allergy.id} type="button" onClick={() => setSelectedChip(allergy)} className={`rounded-full border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm ${allergy.severity === "severe" ? "border-rose-200 bg-rose-50 text-rose-700" : allergy.severity === "moderate" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                  <span className="mr-2">🥜</span>
                  {allergy.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-center text-sm text-slate-600">
              <p className="font-semibold text-slate-800">No allergies logged yet</p>
              <p className="mt-1">Add allergies to keep warnings more precise.</p>
            </div>
          )}
        </DashboardCard>
      </div>

      <DashboardCard
        title="Recent scans"
        subtitle="Your latest food analysis results"
        icon={CalendarDays}
        action={<button type="button" onClick={() => navigate("/history")} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:shadow-sm">View all scans</button>}
      >
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <SkeletonBlock className="h-20 w-full" />
            <SkeletonBlock className="h-20 w-full" />
            <SkeletonBlock className="h-20 w-full" />
          </div>
        ) : scannedItems.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scannedItems.map((item) => (
              <button key={item.id} type="button" onClick={() => navigate("/history")} className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-700">
                      <Apple size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.brand}</p>
                    </div>
                  </div>
                  {renderHealthFit(item.healthFit)}
                </div>
                <p className="mt-3 text-sm text-slate-500">Scanned {item.scannedAt}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-center text-sm text-slate-600">
            <p className="font-semibold text-slate-800">No scans yet</p>
            <p className="mt-1">Scan a meal to build your personal history.</p>
          </div>
        )}
      </DashboardCard>

      <DashboardCard
        title="Nutrition profile"
        subtitle="Daily targets vs. your current averages"
        icon={Flame}
        action={<button type="button" onClick={() => { setDraftNutrition(nutrition); setGoalsModalOpen(true); }} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:shadow-sm">Goals</button>}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            <p className="font-semibold">Nutrition note</p>
            <p className="mt-1">Sodium target is slightly lower because your profile includes hypertension-related care guidance.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {nutritionItems.map((item) => {
              const percent = Math.min(100, Math.round((item.current / item.target) * 100));
              const color = item.flagged ? "bg-rose-500" : item.accent === "sky" ? "bg-sky-500" : item.accent === "amber" ? "bg-amber-500" : "bg-emerald-500";
              return (
                <div key={item.key} className="rounded-2xl border border-emerald-100 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{item.label}</p>
                    {item.flagged ? <BadgeAlert size={16} className="text-rose-500" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item.current} / {item.target} {item.unit}</p>
                  <div className="mt-3 h-2 rounded-full bg-emerald-100">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{percent}% of target</p>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardCard>

      {selectedChip ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Health detail</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedChip.name}</h3>
              </div>
              <button type="button" onClick={() => setSelectedChip(null)} className="rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Added:</span> {selectedChip.addedOn ? new Date(selectedChip.addedOn).toLocaleDateString() : "Recently added"}</p>
              <p><span className="font-semibold text-slate-800">Severity:</span> {selectedChip.severity || "Tracked"}</p>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-700">
                <p className="font-medium">Suggested watch list</p>
                <p className="mt-1">Reduce salty snacks and favor lower-sugar breakfasts when this condition is active.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {profileModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Update profile</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Notes & care preferences</h3>
              </div>
              <button type="button" onClick={() => setProfileModalOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveNotes} className="mt-4 space-y-4">
              <textarea value={notesInput} onChange={(event) => setNotesInput(event.target.value)} rows={5} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-slate-700 outline-none" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setProfileModalOpen(false)} className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save notes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {conditionModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Add condition</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Track a new health condition</h3>
              </div>
              <button type="button" onClick={() => setConditionModalOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCondition} className="mt-4 space-y-4">
              <input value={conditionInput} onChange={(event) => setConditionInput(event.target.value)} placeholder="e.g. PCOS" className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-slate-700 outline-none" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setConditionModalOpen(false)} className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save condition
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {allergyModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Add allergy</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Log a new allergy</h3>
              </div>
              <button type="button" onClick={() => setAllergyModalOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddAllergy} className="mt-4 space-y-4">
              <input value={allergyInput} onChange={(event) => setAllergyInput(event.target.value)} placeholder="e.g. Sesame" className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-slate-700 outline-none" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setAllergyModalOpen(false)} className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save allergy
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {goalsModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Adjust goals</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Daily nutrition targets</h3>
              </div>
              <button type="button" onClick={() => setGoalsModalOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveGoals} className="mt-4 space-y-4">
              {[
                ["calories", "Calories"],
                ["protein", "Protein"],
                ["carbs", "Carbs"],
                ["fat", "Fat"],
                ["sodium", "Sodium"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
                  <input
                    type="number"
                    value={draftNutrition[key]?.target ?? 0}
                    onChange={(event) => setDraftNutrition((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], target: Number(event.target.value) || 0 },
                    }))}
                    className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setGoalsModalOpen(false)} className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                  {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save goals
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
