import re
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

XLSX = "Copy of Course Information.xlsx"

def extract_instructor_email_pairs(path):
    df = pd.read_excel(path, sheet_name="Instructor Email Addresses")
    blocks = []
    for i in range(df.shape[1]-1):
        if df.iloc[1, i] == "Instructor Name" and df.iloc[1, i+1] == "Instructor Email Addresses":
            sub = df.iloc[2:, [i, i+1]]
            sub.columns = ["name", "email"]
            blocks.append(sub)
    allpairs = pd.concat(blocks, ignore_index=True)
    allpairs = allpairs.dropna(how="all")
    allpairs["name"]  = allpairs["name"].astype(str).str.strip()
    allpairs["email"] = allpairs["email"].astype(str).str.strip().str.rstrip(",")
    allpairs = allpairs[allpairs["email"].str.contains(r"@usf\.edu$", na=False, case=False)]
    allpairs = allpairs[~allpairs["name"].str.lower().eq("nan")]
    # split name into first/last (best effort from "X. Lastname")
    first,last = [],[]
    for n in allpairs["name"]:
        parts = n.replace("  "," ").strip().split(" ",1)
        if len(parts)==2:
            first.append(parts[0].replace(".","").strip())
            last.append(parts[1].strip())
        else:
            first.append(None)
            last.append(parts[0])
    allpairs["first_name"]=first
    allpairs["last_name"]=last
    return allpairs[["first_name","last_name","email"]].drop_duplicates()

def upsert_instructors(rows, dsn):
    sql = """
    insert into vos.instructors (first_name,last_name,email)
    values %s
    on conflict (email) do update set
      first_name = coalesce(excluded.first_name, vos.instructors.first_name),
      last_name  = coalesce(excluded.last_name,  vos.instructors.last_name)
    """
    with psycopg2.connect(dsn) as conn, conn.cursor() as cur:
        execute_values(cur, sql, rows.to_records(index=False))

if __name__=="__main__":
    # Example DSN: "postgresql://postgres:postgres@localhost:5432/usf"
    DSN = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/usf")
    pairs = extract_instructor_email_pairs(XLSX)
    upsert_instructors(pairs, DSN)
    print(f"Upserted {len(pairs)} instructors.")
