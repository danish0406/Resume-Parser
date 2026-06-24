import os
import sys
import subprocess

# Auto-install backend requirements
print("Checking/installing backend requirements...")
try:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
except Exception as e:
    print(f"\n[!] Versioned installation failed: {e}")
    print("[!] Python 3.13 detected: Attempting unpinned fallback installation for binary compatibility...\n")
    try:
        packages = [
            "fastapi", "uvicorn", "python-multipart", "sqlalchemy", "pymysql",
            "spacy", "nltk", "scikit-learn", "pdfplumber", "python-docx",
            "pandas", "numpy", "python-dotenv", "aiofiles"
        ]
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + packages)
        print("\nFallback installation completed successfully!\n")
    except Exception as ex:
        print(f"Fatal error: Fallback installation failed: {ex}")

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import init_db, save_candidate_profile, SessionLocal, Candidate, JobDescription, MatchScore
from backend.extractor import extract_text_from_pdf, extract_text_from_docx
from backend.parser import parse_resume
from backend.scoring import calculate_tf_idf_match, calculate_skill_match, calculate_skill_gap, calculate_ranking_score

def test_pipeline():
    print("=== Phase 1: Initialize Database ===")
    try:
        init_db()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Database connection / initialization failed: {str(e)}")
        print("Please ensure your MySQL server is running and database configuration in .env is correct.")
        return

    print("\n=== Phase 2: Extract & Parse Sample Resumes ===")
    
    # 1. John Smith (PDF)
    john_pdf = "backend/uploads/john_smith.pdf"
    if not os.path.exists(john_pdf):
        print(f"Error: {john_pdf} not found. Please run generate_test_files.py first.")
        return
        
    john_text = extract_text_from_pdf(john_pdf)
    print("John Smith Raw Text Extracted!")
    john_profile = parse_resume(john_text)
    print(f"Parsed John Smith Profile:\n{john_profile}\n")

    # 2. Priya Sharma (DOCX)
    priya_docx = "backend/uploads/priya_sharma.docx"
    if not os.path.exists(priya_docx):
        print(f"Error: {priya_docx} not found.")
        return
        
    priya_text = extract_text_from_docx(priya_docx)
    print("Priya Sharma Raw Text Extracted!")
    priya_profile = parse_resume(priya_text)
    print(f"Parsed Priya Sharma Profile:\n{priya_profile}\n")

    print("=== Phase 3: Save Profiles to MySQL ===")
    try:
        john_id = save_candidate_profile(john_profile, "uploads/john_smith.pdf")
        print(f"Saved John Smith. Assigned Candidate ID: {john_id}")
        
        priya_id = save_candidate_profile(priya_profile, "uploads/priya_sharma.docx")
        print(f"Saved Priya Sharma. Assigned Candidate ID: {priya_id}")
    except Exception as e:
        print(f"Failed to save profiles: {str(e)}")
        return

    print("\n=== Phase 4: Job Matching Score Validation ===")
    db = SessionLocal()
    try:
        # Create Job Description
        jd_title = "Business Analyst"
        required_skills = ["SQL", "Excel", "Power BI", "Communication"]
        
        # Save to DB
        db_jd = JobDescription(title=jd_title, required_skills=",".join(required_skills))
        db.add(db_jd)
        db.commit()
        db.refresh(db_jd)
        print(f"Saved Job Description: '{jd_title}' (ID: {db_jd.jd_id})")
        print(f"Required Skills: {required_skills}")

        # Fetch candidates back from DB to test scoring
        john = db.query(Candidate).filter(Candidate.candidate_id == john_id).first()
        priya = db.query(Candidate).filter(Candidate.candidate_id == priya_id).first()

        # Score John
        john_cand_skills = [s.skill_name for s in john.skills]
        john_skill_match = calculate_skill_match(john_cand_skills, required_skills)
        john_gap = calculate_skill_gap(john_cand_skills, required_skills)
        
        # Represent JD as Title + Skills
        jd_text = f"{jd_title} {','.join(required_skills).replace(',', ' ')}"
        john_tfidf = calculate_tf_idf_match(john_text, jd_text)
        john_combined = (john_tfidf + john_skill_match) / 2
        
        print(f"\nJohn Smith Match Calculations:")
        print(f"  Skills: {john_cand_skills}")
        print(f"  Skill Match %: {john_skill_match}%")
        print(f"  TF-IDF Cosine Similarity %: {john_tfidf}%")
        print(f"  Combined Match %: {john_combined}%")
        print(f"  Skill Gap (Missing): {john_gap}")

        # Score Priya
        priya_cand_skills = [s.skill_name for s in priya.skills]
        priya_skill_match = calculate_skill_match(priya_cand_skills, required_skills)
        priya_gap = calculate_skill_gap(priya_cand_skills, required_skills)
        priya_tfidf = calculate_tf_idf_match(priya_text, jd_text)
        priya_combined = (priya_tfidf + priya_skill_match) / 2

        print(f"\nPriya Sharma Match Calculations:")
        print(f"  Skills: {priya_cand_skills}")
        print(f"  Skill Match %: {priya_skill_match}%")
        print(f"  TF-IDF Cosine Similarity %: {priya_tfidf}%")
        print(f"  Combined Match %: {priya_combined}%")
        print(f"  Skill Gap (Missing): {priya_gap}")

        # Verify against expected values from prompt:
        # Expected Skill match (based on exact skills found):
        # John has: SQL, Excel, Power BI (3/4 = 75%)
        # Priya has: SQL, Excel (2/4 = 50%)
        print("\n=== Expected Match Verification ===")
        print(f"John Smith expected skill match: 75% | Calculated: {john_skill_match}%")
        print(f"Priya Sharma expected skill match: 50% | Calculated: {priya_skill_match}%")
        
        # Calculate Weighted Ranking Score
        # Weights: SQL=20, Excel=20, Power BI=20, Experience=25, CGPA=15
        from backend.database import serialize_candidate
        john_ranking = calculate_ranking_score(serialize_candidate(john), required_skills)
        priya_ranking = calculate_ranking_score(serialize_candidate(priya), required_skills)
        print(f"\nWeighted Recruiter Ranking Scores (out of 100):")
        print(f"  John Smith: {john_ranking}")
        print(f"  Priya Sharma: {priya_ranking}")

    finally:
        db.close()

if __name__ == "__main__":
    test_pipeline()
