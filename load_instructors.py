import pandas as pd
import sqlite3
import re

XLSX = "Copy of Course Information.xlsx"
DB_FILE = "veterans_office.db"

def clean_name_email(df, col_name, col_email):
    sub = df.iloc[2:, [col_name, col_email]]
    sub.columns = ["name", "email"]
    sub = sub.dropna(how="all")
    sub["name"]  = sub["name"].astype(str).str.strip()
    sub["email"] = sub["email"].astype(str).str.strip().str.rstrip(",")
    sub = sub[sub["email"].str.contains(r"@usf\.edu$", na=False, case=False)]
    sub = sub[~sub["name"].str.lower().eq("nan")]
    return sub

def extract_instructors(path):
    df = pd.read_excel(path, sheet_name="Instructor Email Addresses")
    instructors = pd.DataFrame(columns=["first_name","last_name","email"])
    for i in range(df.shape[1]-1):
        if df.iloc[1, i] == "Instructor Name" and df.iloc[1, i+1] == "Instructor Email Addresses":
            block = clean_name_email(df, i, i+1)
            first,last = [],[]
            for n in block["name"]:
                parts = n.replace("  "," ").strip().split(" ",1)
                if len(parts)==2:
                    first.append(parts[0].replace(".","").strip())
                    last.append(parts[1].strip())
                else:
                    first.append(None)
                    last.append(parts[0])
            block["first_name"]=first
            block["last_name"]=last
            instructors = pd.concat([instructors, block[["first_name","last_name","email"]]], ignore_index=True)
    return instructors.drop_duplicates()

def init_db(conn):
    cur = conn.cursor()
    cur.executescript("""
    DROP TABLE IF EXISTS instructors;
    DROP TABLE IF EXISTS courses;
    DROP TABLE IF EXISTS sections;

    CREATE TABLE instructors (
        instructor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE
    );

    CREATE TABLE courses (
        course_id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        title TEXT,
        department TEXT
    );

    CREATE TABLE sections (
        section_id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        instructor_id INTEGER,
        meeting_days TEXT,
        start_time TEXT,
        end_time TEXT,
        FOREIGN KEY(course_id) REFERENCES courses(course_id),
        FOREIGN KEY(instructor_id) REFERENCES instructors(instructor_id)
    );
    """)
    conn.commit()

def load_data():
    conn = sqlite3.connect(DB_FILE)
    init_db(conn)

    # Load instructors
    instructors = extract_instructors(XLSX)
    for _, row in instructors.iterrows():
        conn.execute("""
        INSERT OR IGNORE INTO instructors (first_name, last_name, email)
        VALUES (?, ?, ?)
        """, (row.first_name, row.last_name, row.email))

    # Define sample mapping of courses to departments
    courses = [
        ("SPN 1120", "Spanish I", "World Languages"),
        ("SPN 1121", "Spanish II", "World Languages"),
        ("CHM 2045", "General Chemistry I", "Chemistry"),
        ("CHM 2046", "General Chemistry II", "Chemistry"),
        ("BSC 1010", "Biology I", "Biology"),
        ("BSC 1011", "Biology II", "Biology"),
        ("BSC 2093", "Anatomy & Physiology I", "Biology"),
        ("BSC 2094", "Anatomy & Physiology II", "Biology"),
    ]
    for code, title, dept in courses:
        conn.execute("INSERT OR IGNORE INTO courses (code,title,department) VALUES (?,?,?)", (code,title,dept))

    # Assign instructors to some courses with sample timings
    # (In real use, parse each course sheet for CRN/timings)
    cur = conn.cursor()
    cur.execute("SELECT instructor_id FROM instructors")
    instructor_ids = [r[0] for r in cur.fetchall()]

    # Simple rotation: assign instructors to courses
    for idx, iid in enumerate(instructor_ids):
        cid = (idx % len(courses)) + 1
        days = ["MWF","TR","MW","F"][idx % 4]
        conn.execute("INSERT INTO sections (course_id,instructor_id,meeting_days,start_time,end_time) VALUES (?,?,?,?,?)",
                     (cid, iid, days, "10:00 AM", "10:50 AM"))

    conn.commit()
    conn.close()
    print(f"Loaded {len(instructor_ids)} instructors and {len(courses)} courses into {DB_FILE}")

if __name__ == "__main__":
    load_data()
