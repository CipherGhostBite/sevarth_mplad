import json
import os
import re
from typing import Optional, Dict, Any, List, Tuple

_DATA_CACHE: Optional[Dict[str, Any]] = None

def _load_data() -> Dict[str, Any]:
    global _DATA_CACHE
    if _DATA_CACHE is not None:
        return _DATA_CACHE

    json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/constituencies_543.json"))
    items = []
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            items = json.load(f)
    else:
        # Fallback to frontend ts file
        ts_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend/src/lib/constituenciesData.ts"))
        if os.path.exists(ts_path):
            with open(ts_path, "r", encoding="utf-8") as f:
                content = f.read()
                m = re.search(r'ALL_543_CONSTITUENCIES:\s*Constituency\[\]\s*=\s*(\[[\s\S]*?\]);', content)
                if m:
                    items = json.loads(m.group(1))

    by_id = {}
    by_clean = {}

    for c in items:
        cid = c["id"].lower().replace("-", "_")
        by_id[cid] = c
        
        # normalize various forms
        forms = [
            cid,
            c["name"].lower().replace("-", "_").replace(" ", "_"),
            c["shortName"].lower().replace("-", "_").replace(" ", "_"),
            c["code"].lower(),
        ]
        # Also without "lok_sabha_constituency"
        trimmed = c["name"].lower().replace(" lok sabha constituency", "").strip().replace("-", "_").replace(" ", "_")
        forms.append(trimmed)

        for form in forms:
            by_clean[form] = c

    _DATA_CACHE = {
        "items": items,
        "by_id": by_id,
        "by_clean": by_clean
    }
    return _DATA_CACHE

def resolve_constituency(key: str) -> Optional[Dict[str, Any]]:
    if not key or key.lower() in ["all_india", "all", "national"]:
        return None
    data = _load_data()
    clean = key.lower().replace("-", "_").replace(" ", "_").strip()
    
    # Direct match
    if clean in data["by_clean"]:
        return data["by_clean"][clean]
    
    # Try stripping suffixes
    for suffix in ["_lok_sabha_constituency", "_constituency", "_lok_sabha"]:
        if clean.endswith(suffix):
            trimmed = clean[:-len(suffix)]
            if trimmed in data["by_clean"]:
                return data["by_clean"][trimmed]
                
    # Search by prefix or contains
    for k, v in data["by_clean"].items():
        if clean == k or clean.startswith(k) or k.startswith(clean):
            return v
            
    return None

def get_constituency_db_names(key: str) -> List[str]:
    c = resolve_constituency(key)
    if not c:
        clean = key.replace("_", " ").replace("-", " ").strip()
        return [clean, f"{clean} Lok Sabha Constituency"]
    
    short_name = c["shortName"]
    full_name = c["name"]
    res = [full_name, f"{short_name} Lok Sabha Constituency", short_name]
    if short_name.lower() == "nalanda":
        res.append("Nalanda")
    return list(dict.fromkeys(res))

def get_all_constituency_items() -> List[Dict[str, Any]]:
    return _load_data()["items"]

def get_all_constituency_map() -> Dict[str, Dict[str, Any]]:
    return _load_data()["by_id"]
