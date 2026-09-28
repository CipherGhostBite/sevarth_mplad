import math
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

# Realistic Multi-Level Indian Government Projects Dataset
# Spanning Central, State, District, and Local/Municipal levels
MULTI_LEVEL_PROJECTS = [
    {
        "id": "PRJ-GOV-CENTRAL-01",
        "name": "PM GatiShakti National Highway Corridor Expansion (NH-31 / NH-83 Connection)",
        "level": "CENTRAL",
        "department": "Ministry of Road Transport and Highways (MoRTH) / NHAI",
        "category": "Transport",
        "latitude": 25.1950,
        "longitude": 85.5180,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 4500000000, # INR 450 Cr
        "startDate": "2026-06-01",
        "endDate": "2028-05-31",
        "status": "UNDER_IMPLEMENTATION",
        "description": "4-lane elevated corridor connecting Rajgir-Bihar Sharif arterial bypass under PM GatiShakti Masterplan.",
        "sharedResource": "Arterial Corridor NH-31",
        "prerequisites": []
    },
    {
        "id": "PRJ-GOV-STATE-01",
        "name": "Bihar Urban Infrastructure Upgrade - State Highway SH-78 Arterial Strengthening",
        "level": "STATE",
        "department": "Public Works Department (PWD), Govt of Bihar",
        "category": "Road",
        "latitude": 25.1980,
        "longitude": 85.5140,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 184000000, # INR 18.4 Cr
        "startDate": "2026-10-01",
        "endDate": "2027-12-31",
        "status": "APPROVED",
        "description": "PCC resurfacing, shoulder expansion, and storm-water drain construction along Bihar Sharif township road.",
        "sharedResource": "Township Arterial Corridor",
        "prerequisites": ["PRJ-GOV-DISTRICT-01"] # Requires pipeline first
    },
    {
        "id": "PRJ-GOV-DISTRICT-01",
        "name": "Nalanda District Bulk Water Supply & Underground Feeder Pipeline Phase-II",
        "level": "DISTRICT",
        "department": "Bihar Urban Infrastructure Development Corporation (BUIDCO) / District Water Board",
        "category": "Water",
        "latitude": 25.1970,
        "longitude": 85.5150,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 240000000, # INR 24.0 Cr
        "startDate": "2026-08-15",
        "endDate": "2027-08-14",
        "status": "UNDER_IMPLEMENTATION",
        "description": "Trenchless and open excavation underground duct laying along Bihar Sharif main road corridor.",
        "sharedResource": "Sub-surface Road Trench & Utility Corridor",
        "prerequisites": []
    },
    {
        "id": "PRJ-GOV-LOCAL-01",
        "name": "Bihar Sharif Municipal Ward 12 Storm Drainage & Smart Street Lighting Utility",
        "level": "LOCAL",
        "department": "Bihar Sharif Municipal Corporation (BSMC)",
        "category": "Drainage",
        "latitude": 25.1990,
        "longitude": 85.5120,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 45000000, # INR 4.5 Cr
        "startDate": "2026-11-01",
        "endDate": "2027-06-30",
        "status": "PROPOSED",
        "description": "Constructing micro-drains and underground electrical cable conduits in Bihar Sharif municipal jurisdiction.",
        "sharedResource": "Municipal Right-of-Way Drain Corridor",
        "prerequisites": ["PRJ-GOV-DISTRICT-01"]
    },
    {
        "id": "PRJ-GOV-STATE-02",
        "name": "State Model Primary Healthcare Center & Critical Care Block",
        "level": "STATE",
        "department": "Department of Health & Family Welfare, Govt of Bihar",
        "category": "Healthcare",
        "latitude": 25.2100,
        "longitude": 85.5300,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 120000000, # INR 12.0 Cr
        "startDate": "2026-03-01",
        "endDate": "2027-09-30",
        "status": "UNDER_IMPLEMENTATION",
        "description": "Construction of 50-bed multi-specialty OPD block with solar rooftop backup.",
        "sharedResource": "Civil Land Parcel Sector-4",
        "prerequisites": []
    },
    {
        "id": "PRJ-GOV-DISTRICT-02",
        "name": "District Community Health & Diagnostic Wellness Facility",
        "level": "DISTRICT",
        "department": "District Health Society, Nalanda",
        "category": "Healthcare",
        "latitude": 25.2120,
        "longitude": 85.5315,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 85000000, # INR 8.5 Cr
        "startDate": "2026-05-01",
        "endDate": "2027-04-30",
        "status": "PROPOSED",
        "description": "Diagnostic and primary immunization center establishment adjacent to District Hospital block.",
        "sharedResource": "Health Campus Perimeter",
        "prerequisites": []
    },
    {
        "id": "PRJ-GOV-CENTRAL-02",
        "name": "Rooftop Solar & Green Energy Grid Substation (PM-KUSUM Component-C)",
        "level": "CENTRAL",
        "department": "Ministry of New and Renewable Energy (MNRE)",
        "category": "Electricity",
        "latitude": 25.2050,
        "longitude": 85.5000,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 350000000, # INR 35.0 Cr
        "startDate": "2026-01-01",
        "endDate": "2027-02-28",
        "status": "COMPLETED",
        "description": "Central solar grid interconnect station supplying clean energy to institutional campuses.",
        "sharedResource": "Power Grid Feeder 33kV",
        "prerequisites": []
    },
    {
        "id": "PRJ-GOV-LOCAL-02",
        "name": "Panchayat Solar Street Lighting & Community Water Kiosk Installation",
        "level": "LOCAL",
        "department": "Gram Panchayat Raj Bihar Sharif / Rural Development Dept",
        "category": "Electricity",
        "latitude": 25.1900,
        "longitude": 85.5200,
        "constituency": "Nalanda",
        "district": "Nalanda",
        "state": "Bihar",
        "budget": 15000000, # INR 1.5 Cr
        "startDate": "2026-09-01",
        "endDate": "2027-03-31",
        "status": "UNDER_IMPLEMENTATION",
        "description": "Local solar LED installation across 25 rural community junctions.",
        "sharedResource": "Panchayat Right-of-Way Poles",
        "prerequisites": []
    }
]

# Haversine distance in kilometers
def calculate_haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

# Calculate months overlap between two ISO date ranges
def calculate_months_overlap(start1_str: str, end1_str: str, start2_str: str, end2_str: str) -> float:
    try:
        s1 = datetime.strptime(start1_str, "%Y-%m-%d")
        e1 = datetime.strptime(end1_str, "%Y-%m-%d")
        s2 = datetime.strptime(start2_str, "%Y-%m-%d")
        e2 = datetime.strptime(end2_str, "%Y-%m-%d")
        
        latest_start = max(s1, s2)
        earliest_end = min(e1, e2)
        
        if latest_start < earliest_end:
            days = (earliest_end - latest_start).days
            return round(days / 30.44, 1)
    except Exception:
        pass
    return 0.0

# Calculate 5-Factor Coordination Index & Conflicts
def analyze_coordination_relationship(subject: Dict[str, Any], target: Dict[str, Any]) -> Dict[str, Any]:
    distance_km = calculate_haversine_km(
        subject["latitude"], subject["longitude"],
        target["latitude"], target["longitude"]
    )
    
    overlap_months = calculate_months_overlap(
        subject["startDate"], subject["endDate"],
        target["startDate"], target["endDate"]
    )
    
    # 1. Spatial score (Max 30 pts)
    # Projects within 1.5 km are in immediate spatial overlap zone
    if distance_km <= 0.5:
        spatial_score = 30.0
    elif distance_km <= 1.5:
        spatial_score = 22.0
    elif distance_km <= 3.0:
        spatial_score = 12.0
    else:
        spatial_score = 2.0

    # 2. Timeline score (Max 25 pts)
    if overlap_months >= 6.0:
        timeline_score = 25.0
    elif overlap_months >= 3.0:
        timeline_score = 18.0
    elif overlap_months > 0.0:
        timeline_score = 10.0
    else:
        timeline_score = 0.0

    # 3. Infrastructure Conflict score (Max 20 pts)
    # If categories interact e.g. Road + Water, Road + Drainage, Healthcare + Healthcare
    category_pair = set([subject["category"], target["category"]])
    if "Road" in category_pair and "Water" in category_pair:
        infra_score = 20.0
        shared_resource_desc = "Shared Sub-surface Corridor (PCC Road & Utility Pipeline)"
    elif "Road" in category_pair and "Drainage" in category_pair:
        infra_score = 18.0
        shared_resource_desc = "Shared Storm Drain & Roadway Margin"
    elif "Transport" in category_pair and "Road" in category_pair:
        infra_score = 15.0
        shared_resource_desc = "Arterial Highway Traffic Alignment & Corridor Access"
    elif len(category_pair) == 1:
        infra_score = 14.0
        shared_resource_desc = f"Shared Category Resource ({list(category_pair)[0]})"
    else:
        infra_score = 5.0
        shared_resource_desc = "Geographic Proximity Zone"

    # 4. Dependency score (Max 20 pts)
    is_prerequisite = target["id"] in subject.get("prerequisites", []) or subject["id"] in target.get("prerequisites", [])
    if is_prerequisite:
        dependency_score = 20.0
        dependency_type = "PREREQUISITE_UTILITY_WORK"
    elif "Water" in category_pair and "Road" in category_pair:
        dependency_score = 18.0
        dependency_type = "RECOMMENDED_UTILITY_FIRST"
    elif "Drainage" in category_pair and "Road" in category_pair:
        dependency_score = 16.0
        dependency_type = "DRAINAGE_BEFORE_SURFACING"
    else:
        dependency_score = 3.0
        dependency_type = "INDEPENDENT_PARALLEL"

    # 5. Project Similarity / Duplication score (Max 5 pts)
    if subject["category"] == target["category"] and distance_km <= 1.0:
        similarity_score = 5.0
        duplication_flag = True
    else:
        similarity_score = 1.0
        duplication_flag = False

    total_risk_score = round(spatial_score + timeline_score + infra_score + dependency_score + similarity_score, 1)

    if total_risk_score >= 75.0:
        risk_level = "CRITICAL"
    elif total_risk_score >= 50.0:
        risk_level = "HIGH"
    elif total_risk_score >= 30.0:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    # Relationship classification
    if dependency_score >= 15.0:
        rel_type = "dependency"
    elif spatial_score >= 20.0 and timeline_score >= 15.0:
        rel_type = "spatial_overlap"
    elif timeline_score >= 15.0:
        rel_type = "timeline_overlap"
    elif duplication_flag:
        rel_type = "duplication"
    else:
        rel_type = "inactive"

    return {
        "targetProject": target,
        "distanceKm": distance_km,
        "overlapMonths": overlap_months,
        "totalCoordinationScore": total_risk_score,
        "riskLevel": risk_level,
        "relationshipType": rel_type,
        "scoreBreakdown": {
            "spatial": round(spatial_score, 1),
            "timeline": round(timeline_score, 1),
            "infrastructure": round(infra_score, 1),
            "dependency": round(dependency_score, 1),
            "similarity": round(similarity_score, 1),
        },
        "sharedResource": shared_resource_desc,
        "dependencyType": dependency_type,
        "duplicationFlag": duplication_flag
    }

def get_coordination_overview(constituency: str = "Nalanda") -> Dict[str, Any]:
    projects = MULTI_LEVEL_PROJECTS
    
    # Calculate overview stats
    total_projects = len(projects)
    level_counts = {
        "CENTRAL": sum(1 for p in projects if p["level"] == "CENTRAL"),
        "STATE": sum(1 for p in projects if p["level"] == "STATE"),
        "DISTRICT": sum(1 for p in projects if p["level"] == "DISTRICT"),
        "LOCAL": sum(1 for p in projects if p["level"] == "LOCAL"),
    }
    
    # Count pairwise overlaps
    total_spatial_overlaps = 0
    total_timeline_overlaps = 0
    total_dependencies = 0
    critical_conflicts = 0

    for i in range(len(projects)):
        for j in range(i + 1, len(projects)):
            rel = analyze_coordination_relationship(projects[i], projects[j])
            if rel["scoreBreakdown"]["spatial"] >= 20.0:
                total_spatial_overlaps += 1
            if rel["overlapMonths"] > 0:
                total_timeline_overlaps += 1
            if rel["scoreBreakdown"]["dependency"] >= 15.0:
                total_dependencies += 1
            if rel["riskLevel"] in ["HIGH", "CRITICAL"]:
                critical_conflicts += 1

    # Overall Coordination Index calculation (0-100)
    # Higher score means higher coordination priority/risk needing inter-departmental action
    overall_index = min(95, max(40, round(65.0 + (critical_conflicts * 6.5))))

    return {
        "constituency": constituency,
        "totalProjects": total_projects,
        "levelCounts": level_counts,
        "overallCoordinationIndex": overall_index,
        "coordinationRiskLevel": "MODERATE" if overall_index < 75 else "HIGH",
        "totalSpatialOverlaps": total_spatial_overlaps,
        "totalTimelineOverlaps": total_timeline_overlaps,
        "totalDependencies": total_dependencies,
        "criticalConflictsCount": critical_conflicts,
        "lastAnalysisTime": "Just now",
        "statusMessage": "LIVE MULTI-LEVEL INFRASTRUCTURE INTELLIGENCE ENGINE ONLINE"
    }

def get_coordination_matrix(constituency: str = "Nalanda") -> List[Dict[str, Any]]:
    projects = MULTI_LEVEL_PROJECTS
    matrix = []

    for p in projects:
        # Compare with all other projects to find worst conflict & summary
        conflicts = []
        for other in projects:
            if other["id"] == p["id"]:
                continue
            rel = analyze_coordination_relationship(p, other)
            conflicts.append(rel)
        
        conflicts.sort(key=lambda x: x["totalCoordinationScore"], reverse=True)
        top_conflict = conflicts[0] if conflicts else None

        matrix.append({
            "projectId": p["id"],
            "projectName": p["name"],
            "level": p["level"],
            "department": p["department"],
            "category": p["category"],
            "budget": p["budget"],
            "status": p["status"],
            "latitude": p["latitude"],
            "longitude": p["longitude"],
            "hasSpatialOverlap": any(c["scoreBreakdown"]["spatial"] >= 20.0 for c in conflicts),
            "hasTimelineOverlap": any(c["overlapMonths"] > 0 for c in conflicts),
            "hasDependency": any(c["scoreBreakdown"]["dependency"] >= 15.0 for c in conflicts),
            "highestConflictScore": top_conflict["totalCoordinationScore"] if top_conflict else 0,
            "coordinationRisk": top_conflict["riskLevel"] if top_conflict else "LOW",
            "topRelatedProject": top_conflict["targetProject"]["name"] if top_conflict else "None",
            "topRelatedLevel": top_conflict["targetProject"]["level"] if top_conflict else "None"
        })

    return matrix

def get_project_coordination_dossier(project_id: str) -> Optional[Dict[str, Any]]:
    # Find project or fallback to main state project
    subject = next((p for p in MULTI_LEVEL_PROJECTS if p["id"] == project_id), None)
    if not subject:
        # Match against main database project IDs or fallback
        subject = MULTI_LEVEL_PROJECTS[1] # PRJ-GOV-STATE-01

    related_projects = []
    for other in MULTI_LEVEL_PROJECTS:
        if other["id"] == subject["id"]:
            continue
        rel = analyze_coordination_relationship(subject, other)
        related_projects.append(rel)

    related_projects.sort(key=lambda x: x["totalCoordinationScore"], reverse=True)

    top_rel = related_projects[0] if related_projects else None
    coordination_score = top_rel["totalCoordinationScore"] if top_rel else 25.0
    risk_level = top_rel["riskLevel"] if top_rel else "LOW"

    # AI Recommendation generation
    spatial_count = sum(1 for r in related_projects if r["scoreBreakdown"]["spatial"] >= 20.0)
    timeline_count = sum(1 for r in related_projects if r["overlapMonths"] > 0)
    dependency_count = sum(1 for r in related_projects if r["scoreBreakdown"]["dependency"] >= 15.0)

    recommendations = []
    if dependency_count > 0:
        recommendations.append(
            "MANDATORY SEQUENCE: Complete underground utility trenching and bulk water pipeline laying (BUIDCO/District) BEFORE final road compaction and asphalt resurfacing (PWD State Highway)."
        )
        recommendations.append(
            "JOINT EXECUTION COMMITTEE: Form a joint weekly coordination desk between PWD Bihar Sharif and BUIDCO to align excavation corridors and avoid repeated pavement destruction."
        )
    if timeline_count > 0:
        recommendations.append(
            "TIMELINE ALIGNMENT: Stagger the active construction windows of SH-78 road upgrade and Municipal Ward 12 micro-drainage to mitigate traffic gridlock on the main arterial junction."
        )
    if spatial_count > 0:
        recommendations.append(
            "GEOSPATIAL VERIFICATION: Deploy GIS ground-penetrating radar before excavation to map existing power cables (MNRE 33kV solar grid feed) and prevent accidental line outages."
        )

    # 3D Network Node & Edge generation for visual relationship graph
    nodes = [
        {
            "id": subject["id"],
            "name": subject["name"],
            "level": subject["level"],
            "category": subject["category"],
            "isPrimary": True,
            "heightVal": 100,
            "budget": subject["budget"],
            "latitude": subject["latitude"],
            "longitude": subject["longitude"]
        }
    ]
    edges = []

    for rel in related_projects:
        tp = rel["targetProject"]
        nodes.append({
            "id": tp["id"],
            "name": tp["name"],
            "level": tp["level"],
            "category": tp["category"],
            "isPrimary": False,
            "heightVal": 80 if tp["level"] == "CENTRAL" else (65 if tp["level"] == "STATE" else 45),
            "budget": tp["budget"],
            "latitude": tp["latitude"],
            "longitude": tp["longitude"]
        })
        edges.append({
            "id": f"edge-{subject['id']}-{tp['id']}",
            "source": subject["id"],
            "target": tp["id"],
            "relationshipType": rel["relationshipType"],
            "coordinationScore": rel["totalCoordinationScore"],
            "distanceKm": rel["distanceKm"],
            "overlapMonths": rel["overlapMonths"],
            "sharedResource": rel["sharedResource"],
            "riskLevel": rel["riskLevel"]
        })

    # Timeline Spatial items
    timeline_items = []
    for p in MULTI_LEVEL_PROJECTS:
        timeline_items.append({
            "id": p["id"],
            "name": p["name"],
            "level": p["level"],
            "startDate": p["startDate"],
            "endDate": p["endDate"],
            "isSubject": p["id"] == subject["id"]
        })

    return {
        "subjectProject": subject,
        "coordinationScore": coordination_score,
        "riskLevel": risk_level,
        "scoreBreakdown": top_rel["scoreBreakdown"] if top_rel else {
            "spatial": 10.0, "timeline": 10.0, "infrastructure": 5.0, "dependency": 5.0, "similarity": 0.0
        },
        "spatialOverlapsCount": spatial_count,
        "timelineOverlapsCount": timeline_count,
        "dependenciesCount": dependency_count,
        "relatedProjects": related_projects,
        "aiSummary": {
            "headline": f"Inter-Agency Coordination Recommended ({risk_level} Priority)",
            "summaryText": f"The project '{subject['name']}' exhibits high spatial and temporal correlation with {len(related_projects)} nearby multi-level government projects. Significant subterranean utility dependency detected.",
            "recommendations": recommendations
        },
        "networkGraph": {
            "nodes": nodes,
            "edges": edges
        },
        "timelineSpatial": timeline_items
    }
