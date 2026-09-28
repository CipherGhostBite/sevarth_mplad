#!/usr/bin/env python3
import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and add total page numbers & footers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 760, "MPLAD-GUARD AI — Machine Learning Architecture & Algorithms Report")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 752, 576, 752)
        
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 25, page_text)
        self.drawString(36, 25, "CONFIDENTIAL — MPLAD-GUARD AI TECHNICAL DOCUMENTATION")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 35, 576, 35)
        
        self.restoreState()


def build_pdf(filename="MPLAD_Guard_ML_Algorithms_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#1E293B")     # Dark Slate
    ACCENT = colors.HexColor("#1E40AF")      # Deep Blue
    SECONDARY = colors.HexColor("#0284C7")   # Light Cyan/Blue
    TEXT_DARK = colors.HexColor("#0F172A")   # Body text
    BG_LIGHT = colors.HexColor("#F8FAFC")    # Table / Box background
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#475569"),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        "SectionH1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=ACCENT,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        "SectionH2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        "BodyTextCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        "BulletCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        "CodeCustom",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderColor=colors.HexColor("#CBD5E1"),
        borderWidth=0.5,
        borderPadding=5,
        spaceBefore=4,
        spaceAfter=6
    )

    tbl_header_style = ParagraphStyle(
        "TblHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    tbl_body_style = ParagraphStyle(
        "TblBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
    )

    story = []

    # Banner Header
    story.append(Paragraph("MPLAD-GUARD AI", title_style))
    story.append(Paragraph("Comprehensive Machine Learning & Artificial Intelligence Architecture Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceBefore=0, spaceAfter=10))

    # Executive Overview
    story.append(Paragraph("Executive Summary", h1_style))
    story.append(Paragraph(
        "<b>MPLAD-GUARD AI</b> integrates a multi-layered artificial intelligence engine designed to detect fraud, "
        "cost escalation, timeline overruns, agency concentration risks, and spatial/semantic work duplication in the "
        "Member of Parliament Local Area Development (MPLADS) Scheme. The pipeline combines unsupervised anomaly detection, "
        "natural language processing (NLP), spatial clustering, multi-criteria risk decomposition, graph neural relationship analytics, "
        "and retrieval-augmented generation (RAG) powered by LLMs.",
        body_style
    ))

    # Section 1: Unsupervised Anomaly Detection
    story.append(Paragraph("1. Unsupervised Anomaly Detection (Isolation Forest)", h1_style))
    story.append(Paragraph(
        "<b>Algorithm:</b> <code>Isolation Forest</code> (via <code>scikit-learn</code>)<br/>"
        "<b>Source Code:</b> <font color='#1E40AF'><u>backend/pipeline/ml_anomaly.py</u></font>",
        body_style
    ))
    story.append(Paragraph("<b>Technical Description:</b> The anomaly detection module partitions data spaces using random decision trees to isolate multivariate outliers without requiring labeled historical fraud data.", body_style))
    story.append(Paragraph("• <b>Input Feature Matrix (8 Dimensions):</b>", h2_style))
    
    features = [
        "<b>cost_z_score</b>: Standardized deviation of project cost against category peer median.",
        "<b>cost_to_peer_ratio</b>: Ratio of sanctioned cost to median category cost benchmark.",
        "<b>expenditure_ratio</b>: Ratio of disbursed expenditure against total sanctioned fund.",
        "<b>delay_z_score</b>: Standardized execution delay in days beyond scheduled completion.",
        "<b>delay_ratio</b>: Proportion of delay duration relative to original planned timeline.",
        "<b>agency_delay_rate</b>: Historical proportion of delayed projects assigned to the implementing agency.",
        "<b>projects_within_500m</b>: Count of active or completed MPLAD works within a 500-meter radius.",
        "<b>max_semantic_similarity</b>: Maximum cosine similarity score against all existing work descriptions."
    ]
    for f in features:
        story.append(Paragraph(f"• {f}", bullet_style))

    story.append(Paragraph("• <b>Configuration & Normalization:</b> <code>n_estimators=100</code>, <code>contamination=0.12</code>. "
                           "Raw decision scores are Min-Max normalized into a normalized range <code>[0.0, 1.0]</code> where 1.0 represents the highest anomaly signal.", body_style))

    # Section 2: NLP & Work Scope Duplication
    story.append(Paragraph("2. Natural Language Processing & Work Scope Duplication", h1_style))
    story.append(Paragraph(
        "<b>Algorithms:</b> <code>TF-IDF Vectorization</code>, <code>Cosine Similarity</code>, Regex Rule-Based Entity Resolution<br/>"
        "<b>Source Code:</b> <font color='#1E40AF'><u>backend/pipeline/feature_engineering.py</u></font> & <font color='#1E40AF'><u>backend/pipeline/entity_resolution.py</u></font>",
        body_style
    ))
    story.append(Paragraph("• <b>TF-IDF & Cosine Similarity:</b> Converts combined project names and detailed scope descriptions into TF-IDF n-gram vectors (n-grams 1–2, 500 max features). Computes pairwise Cosine Similarity matrix: $$\\text{Similarity}(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$$.", bullet_style))
    story.append(Paragraph("• <b>Geographic Boost Logic:</b> If two projects share the same work type and block/ward location, a proximity boost (+0.45 for same ward, +0.20 for same block) is applied to detect disguised scope duplication.", bullet_style))
    story.append(Paragraph("• <b>Entity Resolution:</b> Resolves noisy agency names (e.g. <i>'rwd nalanda'</i>, <i>'r.w.d. nalanda'</i>) to canonical agency identities (e.g. <code>AGY-RWD-NAL</code>) using string normalization and alias dictionary matching.", bullet_style))

    # Section 3: Geospatial & Spatial Proximity
    story.append(Paragraph("3. Geospatial & Spatial Proximity Clustering", h1_style))
    story.append(Paragraph(
        "<b>Algorithm:</b> <code>Haversine Great-Circle Distance</code> & Radius Proximity Search<br/>"
        "<b>Source Code:</b> <font color='#1E40AF'><u>backend/pipeline/feature_engineering.py</u></font>",
        body_style
    ))
    story.append(Paragraph("• <b>Haversine Distance Formula:</b>", h2_style))
    story.append(Paragraph("$$d = 2R \\cdot \\arcsin\\left(\\sqrt{\\sin^2\\left(\\frac{\\Delta \\phi}{2}\\right) + \\cos(\\phi_1)\\cos(\\phi_2)\\sin^2\\left(\\frac{\\Delta \\lambda}{2}\\right)}\\right)$$", code_style))
    story.append(Paragraph("• <b>Spatial Triggers:</b> Computes density counts for 500m and 2km radii. Flags an active <b>Spatial Duplication Risk</b> if a project of the exact same work type is located within <b>350 meters</b>.", bullet_style))

    # Page Break for clean multi-page flow
    story.append(PageBreak())

    # Section 4: Statistical Benchmarking
    story.append(Paragraph("4. Statistical Benchmarking & Outlier Analysis", h1_style))
    story.append(Paragraph(
        "<b>Source Code:</b> <font color='#1E40AF'><u>backend/pipeline/feature_engineering.py</u></font>",
        body_style
    ))
    story.append(Paragraph("• <b>Peer Group Normalization:</b> Groups project records dynamically by <code>work_type</code> (e.g. PCC Road, Community Hall, High-Mast Solar Light, Borewell).", bullet_style))
    story.append(Paragraph("• <b>Cost Z-Score:</b> $Z_{\\text{cost}} = \\frac{X_{\\text{cost}} - \\mu_{\\text{peer}}}{\\sigma_{\\text{peer}}}$ to flag statistical financial inflation.", bullet_style))
    story.append(Paragraph("• <b>Timeline Z-Score:</b> $Z_{\\text{delay}} = \\frac{X_{\\text{delay}} - \\mu_{\\text{delay}}}{\\sigma_{\\text{delay}}}$ to identify abnormal execution delays.", bullet_style))

    # Section 5: Multi-Criteria Risk Engine
    story.append(Paragraph("5. Multi-Criteria Explainable Risk Engine", h1_style))
    story.append(Paragraph(
        "<b>Source Code:</b> <font color='#1E40AF'><u>backend/pipeline/risk_calculator.py</u></font>",
        body_style
    ))
    story.append(Paragraph("The system computes 5 sub-risk dimensions (0–100 scale) and synthesizes an <b>Investigation Priority Score</b>:", body_style))
    
    risk_weights = [
        ("Financial Risk (25%)", "Evaluates cost-to-peer ratio (>2.2x triggers score >85) and cost Z-scores."),
        ("Timeline Overrun Risk (25%)", "Evaluates absolute delay days (>300 days triggers score >85) and timeline overrun ratios."),
        ("Agency Risk (20%)", "Profiles implementing agency's historical delay rate (>70% delay rate triggers High Risk)."),
        ("Geographic Risk (15%)", "Triggered by spatial proximity overlap (<250m distance triggers score >80)."),
        ("Similarity Risk (15%)", "Evaluates text description overlap (>85% similarity triggers score >85).")
    ]
    for name, desc in risk_weights:
        story.append(Paragraph(f"• <b>{name}:</b> {desc}", bullet_style))

    story.append(Paragraph("<b>Composite Priority Equation:</b>", h2_style))
    story.append(Paragraph("$$\\text{Priority Score} = 0.25 \\times \\text{Fin} + 0.25 \\times \\text{Time} + 0.20 \\times \\text{Agency} + 0.15 \\times \\text{Geo} + 0.15 \\times \\text{Sim}$$", code_style))

    # Section 6: Graph Intelligence
    story.append(Paragraph("6. Graph Intelligence & Relationship Analytics", h1_style))
    story.append(Paragraph(
        "<b>Algorithm:</b> <code>NetworkX MultiDiGraph</code> & Multi-Hop Traversal<br/>"
        "<b>Source Code:</b> <font color='#1E40AF'><u>backend/app/services/graph_service.py</u></font>",
        body_style
    ))
    story.append(Paragraph("Constructs knowledge graph topologies connecting <b>Projects</b>, <b>Agencies</b>, <b>Locations</b>, and <b>Peer Projects</b>. Uncovers hidden collusion networks, agency concentration risks, and shared contractors.", body_style))

    # Section 7: Generative AI & RAG
    story.append(Paragraph("7. Generative AI & Retrieval-Augmented Generation (RAG)", h1_style))
    story.append(Paragraph(
        "<b>Model:</b> <code>Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)</code><br/>"
        "<b>Source Code:</b> <font color='#1E40AF'><u>backend/app/services/rag_service.py</u></font>",
        body_style
    ))
    story.append(Paragraph("Incorporate MoSPI MPLADS Scheme regulatory guidelines (Para 4.12 on 5-year duplication caps, Para 3.4 on State Schedule of Rates, Para 6.1 on Measurement Book verification) into LLM context prompts to generate structured investigation briefs.", body_style))

    # Section 8: Summary Table of ML Algorithms
    story.append(Paragraph("8. Master Summary of Algorithms", h1_style))
    
    table_data = [
        [
            Paragraph("Algorithm / Technique", tbl_header_style),
            Paragraph("Library / Module", tbl_header_style),
            Paragraph("Input Data", tbl_header_style),
            Paragraph("Output Signal", tbl_header_style),
            Paragraph("File Location", tbl_header_style)
        ],
        [
            Paragraph("<b>Isolation Forest</b>", tbl_body_style),
            Paragraph("scikit-learn", tbl_body_style),
            Paragraph("8 numerical feature dimensions", tbl_body_style),
            Paragraph("Anomaly Score (0.0-1.0)", tbl_body_style),
            Paragraph("ml_anomaly.py", tbl_body_style)
        ],
        [
            Paragraph("<b>TF-IDF Vectorizer</b>", tbl_body_style),
            Paragraph("scikit-learn", tbl_body_style),
            Paragraph("Project titles & descriptions", tbl_body_style),
            Paragraph("500-dim feature vectors", tbl_body_style),
            Paragraph("feature_engineering.py", tbl_body_style)
        ],
        [
            Paragraph("<b>Cosine Similarity</b>", tbl_body_style),
            Paragraph("scikit-learn", tbl_body_style),
            Paragraph("TF-IDF text vectors", tbl_body_style),
            Paragraph("Similarity Score (0.0-1.0)", tbl_body_style),
            Paragraph("feature_engineering.py", tbl_body_style)
        ],
        [
            Paragraph("<b>Haversine Distance</b>", tbl_body_style),
            Paragraph("Math / Custom", tbl_body_style),
            Paragraph("Latitude & Longitude coordinates", tbl_body_style),
            Paragraph("Proximity Distance (km)", tbl_body_style),
            Paragraph("feature_engineering.py", tbl_body_style)
        ],
        [
            Paragraph("<b>Z-Score Standardization</b>", tbl_body_style),
            Paragraph("NumPy / Pandas", tbl_body_style),
            Paragraph("Cost & Delay benchmarks", tbl_body_style),
            Paragraph("Z-Score (+/- Std Dev)", tbl_body_style),
            Paragraph("feature_engineering.py", tbl_body_style)
        ],
        [
            Paragraph("<b>Risk Decomposition Engine</b>", tbl_body_style),
            Paragraph("Custom Rules Engine", tbl_body_style),
            Paragraph("Sub-risk dimension scores", tbl_body_style),
            Paragraph("Priority Score (0-100)", tbl_body_style),
            Paragraph("risk_calculator.py", tbl_body_style)
        ],
        [
            Paragraph("<b>NetworkX MultiDiGraph</b>", tbl_body_style),
            Paragraph("NetworkX", tbl_body_style),
            Paragraph("Entities & Relationship Links", tbl_body_style),
            Paragraph("Graph Topology Nodes/Edges", tbl_body_style),
            Paragraph("graph_service.py", tbl_body_style)
        ],
        [
            Paragraph("<b>RAG + Gemini LLM</b>", tbl_body_style),
            Paragraph("google-generativeai", tbl_body_style),
            Paragraph("DB Context & MoSPI Rules", tbl_body_style),
            Paragraph("Investigation Audit Brief", tbl_body_style),
            Paragraph("rag_service.py", tbl_body_style)
        ]
    ]

    col_widths = [110, 85, 125, 110, 110]
    algo_table = Table(table_data, colWidths=col_widths)
    algo_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))

    story.append(algo_table)
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i>Report generated automatically by MPLAD-GUARD AI documentation engine.</i>", ParagraphStyle("Footnote", parent=styles["Normal"], fontSize=7.5, textColor=colors.HexColor("#64748B"), fontName="Helvetica-Oblique")))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {os.path.abspath(filename)}")

if __name__ == "__main__":
    build_pdf()
