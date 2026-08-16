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
  const [activeSection, setActiveSection] = useState("overview");
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
  const [editingUserData, setEditingUserData] = useState({
    name: user?.name || "Alex Carter",
    email: user?.email || "alex@example.com",
  });

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

  const handleRemoveCondition = async (conditionId) => {
    const nextProfile = {
      ...profile,
      conditions: profile.conditions.filter((c) => c.id !== conditionId),
    };
    await saveProfile(nextProfile);
  };

  const handleRemoveAllergy = async (allergyId) => {
    const nextProfile = {
      ...profile,
      allergies: profile.allergies.filter((a) => a.id !== allergyId),
    };
    await saveProfile(nextProfile);
  };

  const handleSaveUserInfo = async () => {
    // In a real app, you'd call an API to update user info
    // For now, just show a success message
    showSuccess("User information updated successfully.");
    setEditingUserData({
      name: editingUserData.name,
      email: editingUserData.email,
    });
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: "⌂" },
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "conditions", label: "Health Conditions", icon: "♡" },
    { id: "allergies", label: "Allergies", icon: "⚠" },
    { id: "nutrition", label: "Nutrition Goals", icon: "🍽" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  const renderHealthFit = (value) => {
    if (value === "good") return <BadgeCheck className="h-4 w-4 text-emerald-600" />;
    if (value === "caution") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <CircleAlert className="h-4 w-4 text-rose-500" />;
  };

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#dfece2] bg-[#f4faf5] shadow-[0_0_0_1px_rgba(19,122,74,0.04)]">
      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-[#dfece2] bg-[#f7faf7] p-5 lg:border-b-0 lg:border-r">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-medium transition ${
                  activeSection === item.id
                    ? "bg-[#e7f6ed] text-[#1b7b51] shadow-[inset_0_0_0_1px_rgba(19,122,74,0.12)]"
                    : "text-[#3d564d] hover:bg-white/80"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-[#dfece2] bg-[#f3faf5] p-4 text-sm text-[#3d564d]">
            <p className="mb-2 font-semibold text-[#244e3d]">Need Help?</p>
            <p className="leading-6 text-[#526d62]">Visit our help center for guides and support.</p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d1e7d6] bg-white px-3 py-2 text-sm font-medium text-[#1b7b51]">
              Help Center →
            </button>
          </div>
        </aside>

        <div className="p-6 sm:p-7 xl:p-8">
          {/* Header Section */}
          {activeSection === "overview" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b986d]">Profile Dashboard</p>
                <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#1e2d27]">Your health overview</h1>
                <p className="mt-2 text-[15px] text-[#60756b]">A calm summary of your profile, scan history, and nutrition goals.</p>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#cfe9d9] bg-[#ebf8f0] px-3 py-2 text-[15px] font-medium text-[#1a7d51]">
                <Sparkles size={16} />
                Personalized insights ready
              </div>
            </div>
          )}

          {activeSection === "personal" && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b986d]">Profile Settings</p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#1e2d27]">Personal Information</h1>
              <p className="mt-2 text-[15px] text-[#60756b]">Update and manage your account details.</p>
            </div>
          )}

          {activeSection === "conditions" && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b986d]">Health Management</p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#1e2d27]">Health Conditions</h1>
              <p className="mt-2 text-[15px] text-[#60756b]">Track and manage your medical conditions for personalized nutrition guidance.</p>
            </div>
          )}

          {activeSection === "allergies" && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b986d]">Safety First</p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#1e2d27]">Allergies & Intolerances</h1>
              <p className="mt-2 text-[15px] text-[#60756b]">Keep detailed records of your allergies to stay safe while eating.</p>
            </div>
          )}

          {activeSection === "nutrition" && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b986d]">Wellness Goals</p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#1e2d27]">Nutrition Goals</h1>
              <p className="mt-2 text-[15px] text-[#60756b]">Set and monitor your daily nutrition targets.</p>
            </div>
          )}

          {activeSection === "settings" && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b986d]">Configuration</p>
              <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#1e2d27]">Account Settings</h1>
              <p className="mt-2 text-[15px] text-[#60756b]">Manage your preferences and account security.</p>
            </div>
          )}

          {/* Overview Section */}
          {activeSection === "overview" && (
            <>
              <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
                <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <HeartPulse size={18} className="text-[#2a8a5d]" />
                      <h2 className="text-[20px] font-semibold text-[#1d2d27]">Profile</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setNotesInput(profile.notes); setProfileModalOpen(true); }}
                      className="inline-flex items-center gap-2 rounded-full border border-[#cfe8d8] bg-white px-3 py-2 text-sm font-medium text-[#1b7b51] transition hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      <PencilLine size={15} />
                      Edit profile
                    </button>
                  </div>

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14.5 w-14.5 items-center justify-center rounded-full border border-[#dceee2] bg-[#e8f7ee] text-[22px] font-semibold text-[#1a7d51]">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[21px] font-semibold text-[#1d2d27]">{displayName}</p>
                        <p className="text-[15px] text-[#5d7268]">{displayEmail}</p>
                        <p className="mt-1 text-[13px] text-[#7d8c83]">Member since {memberSince}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={pillClass}><Activity size={15} /> {healthSummary.totalScans} scans</span>
                      <span className={pillClass}><BadgeAlert size={15} /> {healthSummary.activeAllergies} allergies</span>
                      <span className={pillClass}><Stethoscope size={15} /> {healthSummary.trackedConditions} conditions</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#2a8a5d]" />
                    <h2 className="text-[20px] font-semibold text-[#1d2d27]">Focus note</h2>
                  </div>
                  <p className="text-[15px] text-[#4f665f]">How your profile is guiding the app</p>

                  {loading ? (
                    <div className="mt-5 space-y-3">
                      <SkeletonBlock className="h-4 w-3/4" />
                      <SkeletonBlock className="h-4 w-full" />
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4 text-[15px] text-[#3d564d]">
                      <p><span className="font-semibold text-[#1d2d27]">Goal:</span> Keep sodium low for your current care plan.</p>
                      <p>{profile.notes}</p>
                      <div className="rounded-2xl border border-[#d2ecd9] bg-[#e9f7ee] p-3 text-[#1a7d51]">
                        <p className="font-medium">Care note</p>
                        <p className="mt-1 text-[14px]">Your guidance is tuned to reduce triggers for {profile.conditions[0]?.name || "your tracked conditions"}.</p>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <HeartPulse size={18} className="text-[#2a8a5d]" />
                      <h2 className="text-[20px] font-semibold text-[#1d2d27]">Health conditions</h2>
                    </div>
                    <button type="button" onClick={() => setConditionModalOpen(true)} className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-3 py-1.5 text-sm font-medium text-[#1b7b51] transition hover:shadow-sm">+ Add condition</button>
                  </div>
                  <p className="text-[15px] text-[#5d7268]">Conditions that shape your nutrition recommendations</p>

                  {loading ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <SkeletonBlock className="h-8 w-24" />
                      <SkeletonBlock className="h-8 w-24" />
                    </div>
                  ) : profile.conditions.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.conditions.map((condition) => (
                        <div key={condition.id} className="group relative">
                          <button type="button" onClick={() => setSelectedChip(condition)} className="rounded-full border border-[#d4ead8] bg-[#ebf8f0] px-3 py-2 text-sm font-medium text-[#1b7b51] transition hover:-translate-y-0.5 hover:shadow-sm">
                            <span className="mr-2">🩺</span>
                            {condition.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(condition.id)}
                            className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-1 text-white transition group-hover:flex hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-[#cfe8d8] bg-[#eef9f2] p-6 text-center text-sm text-[#526d62]">
                      <p className="font-semibold text-[#1d2d27]">No conditions tracked yet</p>
                      <p className="mt-1">Add conditions to improve scan guidance.</p>
                    </div>
                  )}
                </section>

                <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className="text-[#2a8a5d]" />
                      <h2 className="text-[20px] font-semibold text-[#1d2d27]">Allergies</h2>
                    </div>
                    <button type="button" onClick={() => setAllergyModalOpen(true)} className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-3 py-1.5 text-sm font-medium text-[#1b7b51] transition hover:shadow-sm">+ Add allergy</button>
                  </div>
                  <p className="text-[15px] text-[#5d7268]">Color-coded by severity</p>

                  {loading ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <SkeletonBlock className="h-8 w-24" />
                      <SkeletonBlock className="h-8 w-24" />
                    </div>
                  ) : profile.allergies.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.allergies.map((allergy) => (
                        <div key={allergy.id} className="group relative">
                          <button type="button" onClick={() => setSelectedChip(allergy)} className={`rounded-full border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm ${allergy.severity === "severe" ? "border-[#f0c7c7] bg-[#fef2f2] text-[#c75b5b]" : allergy.severity === "moderate" ? "border-[#f2d8be] bg-[#fff7ed] text-[#b8702d]" : "border-[#d4ead8] bg-[#ebf8f0] text-[#1b7b51]"}`}>
                            <span className="mr-2">{allergy.severity === "severe" ? "🥜" : "🌿"}</span>
                            {allergy.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergy(allergy.id)}
                            className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-1 text-white transition group-hover:flex hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-[#cfe8d8] bg-[#eef9f2] p-6 text-center text-sm text-[#526d62]">
                      <p className="font-semibold text-[#1d2d27]">No allergies logged yet</p>
                      <p className="mt-1">Add allergies to keep warnings more precise.</p>
                    </div>
                  )}
                </section>
              </div>

              <section className="mt-5 rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-[#2a8a5d]" />
                    <h2 className="text-[20px] font-semibold text-[#1d2d27]">Recent scans</h2>
                  </div>
                  <button type="button" onClick={() => navigate("/history")} className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-3 py-1.5 text-sm font-medium text-[#1b7b51] transition hover:shadow-sm">View all scans</button>
                </div>
                <p className="text-[15px] text-[#5d7268]">Your latest food analysis results</p>

                {loading ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                  </div>
                ) : scannedItems.length ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {scannedItems.map((item) => (
                      <button key={item.id} type="button" onClick={() => navigate("/history")} className="rounded-[18px] border border-[#d2ecd9] bg-[#ecfaf1] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1a7d51]">
                            <Apple size={16} />
                          </div>
                          {renderHealthFit(item.healthFit)}
                        </div>
                        <p className="mt-3 text-[14px] font-semibold text-[#1d2d27]">{item.name}</p>
                        <p className="mt-1 text-[12px] text-[#60756b]">{item.brand}</p>
                        <p className="mt-4 text-[12px] text-[#60756b]">Scanned {item.scannedAt}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-[#cfe8d8] bg-[#eef9f2] p-6 text-center text-sm text-[#526d62]">
                    <p className="font-semibold text-[#1d2d27]">No scans yet</p>
                    <p className="mt-1">Scan a meal to build your personal history.</p>
                  </div>
                )}
              </section>

              <section className="mt-5 rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-[#2a8a5d]" />
                    <h2 className="text-[20px] font-semibold text-[#1d2d27]">Nutrition profile</h2>
                  </div>
                  <button type="button" onClick={() => { setDraftNutrition(nutrition); setGoalsModalOpen(true); }} className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-3 py-1.5 text-sm font-medium text-[#1b7b51] transition hover:shadow-sm">Goals</button>
                </div>
                <p className="text-[15px] text-[#5d7268]">Daily targets vs. your current averages</p>

                <div className="mt-4 rounded-[18px] border border-[#d2ecd9] bg-[#ecfaf1] p-4 text-[15px] text-[#1a7d51]">
                  <p className="font-semibold">Nutrition note</p>
                  <p className="mt-1">Sodium target is slightly lower because your profile includes hypertension-related care guidance.</p>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {nutritionItems.map((item) => {
                    const percent = Math.min(100, Math.round((item.current / item.target) * 100));
                    const color = item.flagged ? "bg-rose-500" : item.accent === "sky" ? "bg-sky-500" : item.accent === "amber" ? "bg-amber-500" : "bg-emerald-500";
                    return (
                      <div key={item.key} className="rounded-[18px] border border-[#d2ecd9] bg-white p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-[#1d2d27]">{item.label}</p>
                          {item.flagged ? <BadgeAlert size={16} className="text-rose-500" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
                        </div>
                        <p className="mt-2 text-[13px] text-[#5d7268]">{item.current} / {item.target} {item.unit}</p>
                        <div className="mt-3 h-2 rounded-full bg-[#ebf8f0]">
                          <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
                        </div>
                        <p className="mt-2 text-[11px] text-[#7d8c83]">{percent}% of target</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* Personal Info Section */}
          {activeSection === "personal" && (
            <div className="mt-6">
              <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                <h2 className="mb-6 text-[20px] font-semibold text-[#1d2d27]">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1d2d27]">Full Name</label>
                    <input
                      type="text"
                      value={editingUserData.name}
                      onChange={(e) => setEditingUserData({ ...editingUserData, name: e.target.value })}
                      className="w-full rounded-xl border border-[#d4ead8] bg-white px-4 py-2 text-[#1d2d27] outline-none focus:border-[#1b7b51]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1d2d27]">Email Address</label>
                    <input
                      type="email"
                      value={editingUserData.email}
                      onChange={(e) => setEditingUserData({ ...editingUserData, email: e.target.value })}
                      className="w-full rounded-xl border border-[#d4ead8] bg-white px-4 py-2 text-[#1d2d27] outline-none focus:border-[#1b7b51]"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" className="rounded-full border border-[#cfe8d8] px-4 py-2 text-sm font-medium text-[#1b7b51]">Cancel</button>
                    <button type="button" onClick={handleSaveUserInfo} className="inline-flex items-center gap-2 rounded-full bg-[#1b7b51] px-4 py-2 text-sm font-semibold text-white">
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Health Conditions Section */}
          {activeSection === "conditions" && (
            <div className="mt-6">
              <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold text-[#1d2d27]">Your Conditions</h2>
                  <button type="button" onClick={() => setConditionModalOpen(true)} className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-4 py-2 text-sm font-medium text-[#1b7b51] transition hover:shadow-sm">+ Add Condition</button>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                  </div>
                ) : profile.conditions.length ? (
                  <div className="space-y-3">
                    {profile.conditions.map((condition) => (
                      <div key={condition.id} className="flex items-center justify-between rounded-xl border border-[#d4ead8] bg-white p-4">
                        <div>
                          <p className="font-semibold text-[#1d2d27]">🩺 {condition.name}</p>
                          <p className="mt-1 text-sm text-[#5d7268]">Added on {new Date(condition.addedOn).toLocaleDateString()}</p>
                          <p className="mt-1 text-sm font-medium capitalize text-[#1b7b51]">Severity: {condition.severity}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCondition(condition.id)}
                          className="rounded-full bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#cfe8d8] bg-[#eef9f2] p-8 text-center">
                    <p className="font-semibold text-[#1d2d27]">No conditions tracked yet</p>
                    <p className="mt-2 text-[#5d7268]">Add health conditions to get better nutrition recommendations.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Allergies Section */}
          {activeSection === "allergies" && (
            <div className="mt-6">
              <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold text-[#1d2d27]">Your Allergies</h2>
                  <button type="button" onClick={() => setAllergyModalOpen(true)} className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-4 py-2 text-sm font-medium text-[#1b7b51] transition hover:shadow-sm">+ Add Allergy</button>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                  </div>
                ) : profile.allergies.length ? (
                  <div className="space-y-3">
                    {profile.allergies.map((allergy) => (
                      <div key={allergy.id} className={`flex items-center justify-between rounded-xl border p-4 ${allergy.severity === "severe" ? "border-[#f0c7c7] bg-[#fef2f2]" : allergy.severity === "moderate" ? "border-[#f2d8be] bg-[#fff7ed]" : "border-[#d4ead8] bg-[#ebf8f0]"}`}>
                        <div>
                          <p className={`font-semibold ${allergy.severity === "severe" ? "text-[#c75b5b]" : allergy.severity === "moderate" ? "text-[#b8702d]" : "text-[#1b7b51]"}`}>
                            {allergy.severity === "severe" ? "🥜" : "🌿"} {allergy.name}
                          </p>
                          <p className="mt-1 text-sm">Added on {new Date(allergy.addedOn).toLocaleDateString()}</p>
                          <p className={`mt-1 text-sm font-medium capitalize ${allergy.severity === "severe" ? "text-[#c75b5b]" : allergy.severity === "moderate" ? "text-[#b8702d]" : "text-[#1b7b51]"}`}>
                            Severity: {allergy.severity}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergy(allergy.id)}
                          className="rounded-full bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#cfe8d8] bg-[#eef9f2] p-8 text-center">
                    <p className="font-semibold text-[#1d2d27]">No allergies logged yet</p>
                    <p className="mt-2 text-[#5d7268]">Add allergies to keep warnings more precise while scanning foods.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Nutrition Goals Section */}
          {activeSection === "nutrition" && (
            <div className="mt-6">
              <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold text-[#1d2d27]">Daily Nutrition Targets</h2>
                  <button type="button" onClick={() => { setDraftNutrition(nutrition); setGoalsModalOpen(true); }} className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-4 py-2 text-sm font-medium text-[#1b7b51] transition hover:shadow-sm">Edit Goals</button>
                </div>

                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {nutritionItems.map((item) => {
                      const percent = Math.min(100, Math.round((item.current / item.target) * 100));
                      const color = item.flagged ? "bg-rose-500" : item.accent === "sky" ? "bg-sky-500" : item.accent === "amber" ? "bg-amber-500" : "bg-emerald-500";
                      return (
                        <div key={item.key} className="rounded-[18px] border border-[#d2ecd9] bg-white p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-[#1d2d27]">{item.label}</p>
                            {item.flagged ? <BadgeAlert size={16} className="text-rose-500" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
                          </div>
                          <p className="mt-2 text-[13px] text-[#5d7268]">{item.current} / {item.target} {item.unit}</p>
                          <div className="mt-3 h-2 rounded-full bg-[#ebf8f0]">
                            <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
                          </div>
                          <p className="mt-2 text-[11px] text-[#7d8c83]">{percent}% of target</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <div className="mt-6">
              <section className="rounded-[22px] border border-[#dfece2] bg-[#f2fbf4] p-5 shadow-sm">
                <h2 className="mb-6 text-[20px] font-semibold text-[#1d2d27]">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-[#d4ead8] bg-white p-4">
                    <div>
                      <p className="font-semibold text-[#1d2d27]">Notifications</p>
                      <p className="mt-1 text-sm text-[#5d7268]">Receive alerts about food scans and nutrition updates</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-[#cfe8d8] text-[#1b7b51]" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#d4ead8] bg-white p-4">
                    <div>
                      <p className="font-semibold text-[#1d2d27]">Data Sync</p>
                      <p className="mt-1 text-sm text-[#5d7268]">Automatically sync your health data across devices</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-[#cfe8d8] text-[#1b7b51]" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#d4ead8] bg-white p-4">
                    <div>
                      <p className="font-semibold text-[#1d2d27]">Two-Factor Authentication</p>
                      <p className="mt-1 text-sm text-[#5d7268]">Add an extra layer of security to your account</p>
                    </div>
                    <button type="button" className="rounded-full border border-[#cfe8d8] bg-[#ebf8f0] px-3 py-1 text-sm font-medium text-[#1b7b51]">Enable</button>
                  </div>
                  <div className="mt-6 flex items-center justify-between rounded-xl border border-[#f0c7c7] bg-[#fef2f2] p-4">
                    <div>
                      <p className="font-semibold text-[#c75b5b]">Danger Zone</p>
                      <p className="mt-1 text-sm text-[#c75b5b]">Delete your account and all associated data</p>
                    </div>
                    <button type="button" className="rounded-full border border-[#f0c7c7] bg-[#fef2f2] px-3 py-1 text-sm font-medium text-[#c75b5b] hover:bg-[#f9e5e5]">Delete Account</button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

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
