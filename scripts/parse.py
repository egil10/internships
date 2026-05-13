"""
Parse the Excel tracker into a normalized JSON dataset that powers the dashboard.

- Reads excel-data/Internship Tracker.xlsx (Overview sheet)
- Normalizes categories (type/stage/outcome/source/cycle/location)
- Derives country, year, month, decision flags, simple sentiment buckets
- Writes data/internships.json + data/stats.json
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / "excel-data" / "Internship Tracker.xlsx"
OUT_DIR = ROOT / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)


# --- normalization helpers ---------------------------------------------------

TYPE_MAP = [
    (r"summer", "Summer Internship"),
    (r"diplomat", "Diplomatic"),
    (r"connect|talent pool", "Talent Pool"),
    (r"scholarship", "Scholarship"),
    (r"programme|program", "Programme"),
    (r"research|phd", "Research"),
    (r"competition|event|volunteer|recruit", "Event / Network"),
    (r"part[- ]?time|student", "Part-time / Student"),
    (r"full[- ]?time|permanent|analyst|temporary|junior|graduate", "Full-time"),
    (r"intern", "Internship"),
    (r"speculative|paid language", "Other"),
]


def _s(raw) -> str | None:
    """Coerce openpyxl cell value into Optional[str]."""
    if raw is None:
        return None
    return str(raw)


def norm_type(raw) -> str:
    raw = _s(raw)
    if not raw:
        return "Unknown"
    s = raw.lower()
    for pat, label in TYPE_MAP:
        if re.search(pat, s):
            return label
    return "Other"


STAGE_ORDER = [
    "Deadline tracked",
    "Account / Started",
    "Applied",
    "Online Test",
    "Networking call",
    "First Interview",
    "Second Interview",
    "Third Interview",
    "Case / Assessment",
    "Offer",
    "Withdrew",
]


def norm_stage(raw) -> str:
    raw = _s(raw)
    if not raw:
        return "Deadline tracked"
    s = raw.lower()
    if "withdr" in s:
        return "Withdrew"
    if "offer" in s:
        return "Offer"
    if "case" in s or "advanced" in s:
        return "Case / Assessment"
    if "third" in s or "final round" in s:
        return "Third Interview"
    if "second" in s:
        return "Second Interview"
    if "first" in s or "video" in s or "rescheduled" in s:
        return "First Interview"
    if "network" in s or "info chat" in s:
        return "Networking call"
    if "online test" in s or "assessment" in s:
        return "Online Test"
    if "applied" in s:
        return "Applied"
    if "started" in s or "account" in s or "casting" in s:
        return "Account / Started"
    if "research" in s or "deadline" in s:
        return "Deadline tracked"
    return "Applied"


def norm_outcome(raw) -> str:
    raw = _s(raw)
    if not raw:
        return "Unknown"
    s = raw.lower()
    if "in progress" in s or "pending" in s:
        return "In Progress"
    if "accepted" in s:
        return "Offer Accepted"
    if "declined" in s and "offer" in s:
        return "Offer Declined"
    if "withdr" in s:
        return "Withdrew"
    if "did not complete" in s or "did not pursue" in s:
        return "Did Not Pursue"
    if "declined" in s:
        return "Rejected"
    if "no response" in s:
        return "Ghosted"
    if "led to" in s or "later" in s:
        return "Later Offer"
    if "unclear" in s or "unknown" in s:
        return "Unknown"
    return "Unknown"


SOURCE_BUCKETS = [
    (r"webcruiter", "Webcruiter"),
    (r"teamtailor", "Teamtailor"),
    (r"workday|equinor", "Workday"),
    (r"greenhouse", "Greenhouse"),
    (r"smartrecruiters", "SmartRecruiters"),
    (r"finn", "Finn"),
    (r"bindeleddet|nuu|uib|nhh|uio|altor|microsoft careers|bain|mckinsey|jobbnorge|norway\\.no", "School / Org Network"),
    (r"email|outreach|direct email", "Direct Outreach"),
    (r"linkedin", "LinkedIn"),
    (r"referral", "Referral"),
    (r"successfactors|workable|reachmee|easycruit|bamboo|talentech|workbuster|jobylon|danske|dnb|ud|internal|ats|avature", "Other ATS"),
    (r"direct", "Direct"),
]


def norm_source(raw) -> str:
    raw = _s(raw)
    if not raw:
        return "Unknown"
    s = raw.lower()
    for pat, label in SOURCE_BUCKETS:
        if re.search(pat, s):
            return label
    return "Other"


COUNTRY_HINTS = {
    "norway": "Norway",
    "oslo": "Norway",
    "bergen": "Norway",
    "stavanger": "Norway",
    "arendal": "Norway",
    "lysaker": "Norway",
    "uk": "UK",
    "london": "UK",
    "sweden": "Sweden",
    "stockholm": "Sweden",
    "denmark": "Denmark",
    "copenhagen": "Denmark",
    "china": "China",
    "shanghai": "China",
    "beijing": "China",
    "hong kong": "Hong Kong",
    "taiwan": "Taiwan",
    "singapore": "Singapore",
    "switzerland": "Switzerland",
    "geneva": "Switzerland",
    "zambia": "Zambia",
    "lusaka": "Zambia",
    "mozambique": "Mozambique",
    "maputo": "Mozambique",
    "japan": "Japan",
    "south korea": "South Korea",
    "korea": "South Korea",
    "seoul": "South Korea",
    "saudi arabia": "Saudi Arabia",
    "saudi": "Saudi Arabia",
    "riyadh": "Saudi Arabia",
    "iran": "Iran",
    "tehran": "Iran",
    "teheran": "Iran",
    "ireland": "Ireland",
    "dublin": "Ireland",
    "estonia": "Estonia",
    "tallinn": "Estonia",
    "usa": "USA",
    "us": "USA",
    "new york": "USA",
    "washington": "USA",
    "san francisco": "USA",
    "berkeley": "USA",
    "philadelphia": "USA",
    "germany": "Germany",
    "berlin": "Germany",
    "frankfurt": "Germany",
    "france": "France",
}

COUNTRY_FLAGS = {
    "Norway": "🇳🇴",
    "UK": "🇬🇧",
    "Sweden": "🇸🇪",
    "Denmark": "🇩🇰",
    "China": "🇨🇳",
    "Hong Kong": "🇭🇰",
    "Taiwan": "🇹🇼",
    "Singapore": "🇸🇬",
    "Switzerland": "🇨🇭",
    "Zambia": "🇿🇲",
    "Mozambique": "🇲🇿",
    "Japan": "🇯🇵",
    "South Korea": "🇰🇷",
    "Saudi Arabia": "🇸🇦",
    "Iran": "🇮🇷",
    "Ireland": "🇮🇪",
    "Estonia": "🇪🇪",
    "USA": "🇺🇸",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Global": "🌍",
    "Remote": "💻",
    "Multiple": "🌐",
    "Unknown": "❓",
}


def norm_country(raw) -> str:
    raw = _s(raw)
    if not raw:
        return "Unknown"
    s = raw.lower()
    if "/" in s or " or " in s:
        countries = set()
        for token in re.split(r"[/,]| or ", s):
            for k, v in COUNTRY_HINTS.items():
                if k in token:
                    countries.add(v)
        if len(countries) > 1:
            return "Multiple"
        if len(countries) == 1:
            return next(iter(countries))
    for k, v in COUNTRY_HINTS.items():
        if k in s:
            return v
    if "global" in s:
        return "Global"
    if "remote" in s or "online" in s:
        return "Remote"
    return "Unknown"


def parse_date(raw):
    if raw is None:
        return None
    if isinstance(raw, datetime):
        return raw.date().isoformat()
    s = str(raw).strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%d.%m.%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except ValueError:
            continue
    return s


def cycle_year(cycle) -> int | None:
    cycle = _s(cycle)
    if not cycle:
        return None
    m = re.match(r"(\d{4})", cycle)
    return int(m.group(1)) if m else None


def cycle_season(cycle) -> str:
    cycle = _s(cycle)
    if not cycle:
        return "Unknown"
    s = cycle.upper()
    if "SPR" in s:
        return "Spring"
    if "SUM" in s:
        return "Summer"
    if "AUT" in s:
        return "Autumn"
    if "IB" in s:
        return "Investment Banking"
    if "IS" in s:
        return "Intelligence"
    if "KUK" in s:
        return "Kukula"
    if "UD" in s:
        return "Diplomatic (UD)"
    if "EVENTS" in s:
        return "Event"
    if re.match(r"^\d{4}-\d{2}$", cycle):
        return "Month-specific"
    if re.match(r"^\d{4}$", cycle):
        return "Year-only"
    return "Other"


# --- main --------------------------------------------------------------------

def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb["Overview"]
    rows = list(ws.iter_rows(values_only=True))
    header = rows[0]
    data_rows = rows[1:]

    # User-confirmed corrections: these were marked as accepted offers in the
    # tracker, but the user told me they did not actually take/do them.
    DID_NOT_TAKE_IDS = {223, 237, 253, 262}

    records = []
    for raw in data_rows:
        record = dict(zip(header, raw))
        idx = record.get("#")
        if idx is None:
            continue
        idx = int(idx) if not isinstance(idx, int) else idx
        if idx in DID_NOT_TAKE_IDS:
            record = dict(record)
            record["Outcome"] = "Offer declined"
            record["Did I take it?"] = "No"

        date_applied = parse_date(record.get("Date Applied"))
        cycle = record.get("Cycle")
        type_norm = norm_type(record.get("Type"))
        stage_norm = norm_stage(record.get("Furthest Stage Reached"))
        outcome_norm = norm_outcome(record.get("Outcome"))
        source_norm = norm_source(record.get("Source / Channel"))
        country = norm_country(record.get("Location"))
        discovery = record.get("Source of Discovery") or "Unknown"
        applied_confirmed = discovery != "Calendar-only"

        cycle_s = _s(cycle)
        records.append({
            "id": idx,
            "cycle": cycle_s,
            "cycleYear": cycle_year(cycle_s),
            "cycleSeason": cycle_season(cycle_s),
            "dateApplied": date_applied,
            "year": int(date_applied[:4]) if date_applied and len(str(date_applied)) >= 4 and date_applied[:4].isdigit() else cycle_year(cycle_s),
            "company": record.get("Company") or "Unknown",
            "role": record.get("Role") or "",
            "location": record.get("Location") or "",
            "country": country,
            "flag": COUNTRY_FLAGS.get(country, "📍"),
            "type": record.get("Type") or "",
            "typeNorm": type_norm,
            "source": record.get("Source / Channel") or "",
            "sourceNorm": source_norm,
            "stage": record.get("Furthest Stage Reached") or "",
            "stageNorm": stage_norm,
            "outcome": record.get("Outcome") or "",
            "outcomeNorm": outcome_norm,
            "tookIt": record.get("Did I take it?") or "Pending",
            "notes": record.get("Notes") or "",
            "discovery": discovery,
            "appliedConfirmed": applied_confirmed,
        })

    # write rows
    with (OUT_DIR / "internships.json").open("w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    # aggregate stats
    def count_by(key):
        c = Counter(r[key] for r in records if r.get(key))
        return [{"label": k, "count": v} for k, v in c.most_common()]

    by_year = defaultdict(lambda: {"applications": 0, "offers": 0, "accepted": 0, "interviews": 0, "rejected": 0})
    for r in records:
        y = r["year"]
        if not y:
            continue
        by_year[y]["applications"] += 1
        if r["stageNorm"] == "Offer":
            by_year[y]["offers"] += 1
        if r["outcomeNorm"] == "Offer Accepted":
            by_year[y]["accepted"] += 1
        if r["stageNorm"] in ("First Interview", "Second Interview", "Third Interview", "Case / Assessment", "Offer"):
            by_year[y]["interviews"] += 1
        if r["outcomeNorm"] == "Rejected":
            by_year[y]["rejected"] += 1

    timeline = [
        {"year": y, **by_year[y]} for y in sorted(by_year.keys())
    ]

    stage_counts = Counter(r["stageNorm"] for r in records)
    funnel = [
        {"stage": "Tracked", "count": len(records)},
        {"stage": "Applied", "count": sum(1 for r in records if r["stageNorm"] not in ("Deadline tracked", "Account / Started", "Withdrew"))},
        {"stage": "Interview+", "count": sum(1 for r in records if r["stageNorm"] in ("First Interview", "Second Interview", "Third Interview", "Case / Assessment", "Offer"))},
        {"stage": "Final round", "count": sum(1 for r in records if r["stageNorm"] in ("Second Interview", "Third Interview", "Case / Assessment", "Offer"))},
        {"stage": "Offer", "count": stage_counts.get("Offer", 0)},
        {"stage": "Accepted", "count": sum(1 for r in records if r["outcomeNorm"] == "Offer Accepted")},
    ]

    stats = {
        "totals": {
            "tracked": len(records),
            "appliedConfirmed": sum(1 for r in records if r["appliedConfirmed"]),
            "deadlineOnly": sum(1 for r in records if not r["appliedConfirmed"]),
            "interviewsReached": sum(1 for r in records if r["stageNorm"] in ("First Interview", "Second Interview", "Third Interview", "Case / Assessment", "Offer")),
            "offers": stage_counts.get("Offer", 0),
            "offersAccepted": sum(1 for r in records if r["outcomeNorm"] == "Offer Accepted"),
            "rejections": sum(1 for r in records if r["outcomeNorm"] == "Rejected"),
            "inProgress": sum(1 for r in records if r["outcomeNorm"] == "In Progress"),
            "countriesApplied": len({r["country"] for r in records if r["country"] not in ("Unknown",)}),
            "yearsSpanned": (min(r["year"] for r in records if r["year"]), max(r["year"] for r in records if r["year"])),
        },
        "byYear": timeline,
        "byType": count_by("typeNorm"),
        "byStage": count_by("stageNorm"),
        "byOutcome": count_by("outcomeNorm"),
        "bySource": count_by("sourceNorm"),
        "byCountry": count_by("country"),
        "bySeason": count_by("cycleSeason"),
        "funnel": funnel,
    }

    with (OUT_DIR / "stats.json").open("w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(records)} records.")
    print(json.dumps(stats["totals"], indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
