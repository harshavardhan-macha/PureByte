import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getHealthProfile, updateHealthProfile, getErrorMessage } from "../../lib/mlApi";
import { Loader2, Save, Check } from "lucide-react";
import { showError, showSuccess } from "../../lib/toast";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";

export default function ProfilePage() {
  const { user } = useAuthContext();
  const [conditions, setConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : null;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getHealthProfile();
        setConditions((data.conditions || []).join(", "));
        setAllergies((data.allergies || []).join(", "));
        setNotes(data.notes || "");
      } catch (err) {
        setError(getErrorMessage(err, "Could not load health profile."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setJustSaved(false);
    setMessage("");
    setError("");
    try {
      const payload = {
        conditions: conditions
          .split(",")
          .map((s) => s.trim().toLowerCase().replace(/\s+/g, "_"))
          .filter(Boolean),
        allergies: allergies
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
        notes: notes.trim() || null,
      };
      await updateHealthProfile(payload);
      const successMsg = "Health profile saved. Future scans will use these settings.";
      setMessage(successMsg);
      showSuccess(successMsg);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch (err) {
      const errMsg = getErrorMessage(err, "Could not save health profile.");
      setError(errMsg);
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Your account and health preferences.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-emerald-900/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Account</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{displayName}</p>
          <p className="text-sm text-slate-600">{displayEmail}</p>
          {memberSince && (
            <p className="mt-1 text-xs text-slate-400">Member since {memberSince}</p>
          )}
        </div>

        <div className="rounded-xl border border-emerald-900/10 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Health profile</h2>
          <p className="mt-1 text-sm text-slate-500">
            Used to personalize scan warnings. Comma-separated values.
          </p>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-emerald-800" />
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Conditions
                </label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. diabetes, hypertension, pregnancy"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Examples: diabetes, hypertension, heart_disease, nut_allergy
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Allergies
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. peanut, shellfish, soy"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any dietary notes…"
                  className={`${inputClass} resize-y`}
                />
              </div>

              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving || justSaved}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-80 ${
                  justSaved
                    ? "bg-emerald-600 hover:bg-emerald-600"
                    : "bg-emerald-800 hover:bg-emerald-900"
                }`}
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : justSaved ? (
                  <Check size={16} />
                ) : (
                  <Save size={16} />
                )}
                {justSaved ? "Saved!" : "Save health profile"}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Name and email are managed through your account registration and cannot be changed here yet.
        </p>
      </div>
    </div>
  );
}
