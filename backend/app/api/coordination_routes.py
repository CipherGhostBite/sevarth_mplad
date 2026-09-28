from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Query, HTTPException

from backend.app.services.coordination_service import (
    get_coordination_overview,
    get_coordination_matrix,
    get_project_coordination_dossier,
    MULTI_LEVEL_PROJECTS
)

router = APIRouter(prefix="/projects/coordination", tags=["Multi-Level Project Coordination"])

@router.get("/overview")
def coordination_overview(
    constituency: Optional[str] = Query("Nalanda", description="Parliamentary Constituency")
):
    """
    Get overview metrics for multi-level government project coordination.
    """
    return get_coordination_overview(constituency=constituency)

@router.get("/projects")
def list_coordination_projects(
    level: Optional[str] = Query(None, description="Filter by level: CENTRAL, STATE, DISTRICT, LOCAL"),
    category: Optional[str] = Query(None, description="Filter by category: Road, Water, Electricity, Healthcare, etc."),
    status: Optional[str] = Query(None, description="Filter by project status")
):
    """
    Get list of multi-level government projects across Central, State, District, and Local levels.
    """
    projects = MULTI_LEVEL_PROJECTS
    if level:
        projects = [p for p in projects if p["level"].upper() == level.upper()]
    if category:
        projects = [p for p in projects if p["category"].lower() == category.lower()]
    if status:
        projects = [p for p in projects if p["status"].upper() == status.upper()]
    return projects

@router.get("/matrix")
def coordination_matrix(
    constituency: Optional[str] = Query("Nalanda", description="Parliamentary Constituency")
):
    """
    Get Project Coordination Matrix for all multi-level projects.
    """
    return get_coordination_matrix(constituency=constituency)

@router.get("/{project_id}")
def project_coordination_dossier(project_id: str):
    """
    Get complete Multi-Level Coordination & Conflict Dossier for a specific project ID.
    Includes spatial overlap, timeline overlap, dependency graph, and AI recommendations.
    """
    dossier = get_project_coordination_dossier(project_id)
    if not dossier:
        raise HTTPException(status_code=404, detail=f"Coordination dossier for project {project_id} not found")
    return dossier
