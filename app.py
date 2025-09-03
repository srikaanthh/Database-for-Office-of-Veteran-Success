from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os, asyncpg

app = FastAPI(title="VOS Directory API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/usf")

@app.on_event("startup")
async def startup():
    app.state.pool = await asyncpg.create_pool(dsn=DB_URL, min_size=1, max_size=5)

@app.on_event("shutdown")
async def shutdown():
    await app.state.pool.close()

@app.get("/instructors")
async def list_instructors(term: str | None=None, year: int | None=None, subject: str | None=None, q: str | None=None):
    """
    Returns distinct instructors (name, email) with optional filters.
    """
    sql = """
    select distinct
      coalesce(nullif(trim(i.first_name||' '||i.last_name), ''), split_part(i.email,'@',1)) as name,
      i.email
    from vos.instructors i
    left join vos.instructor_assignments ia on ia.instructor_id = i.instructor_id
    left join vos.sections s on s.section_id = ia.section_id
    left join vos.courses c on c.course_id = s.course_id
    where (coalesce($1::text,'')='' or s.term=$1)
      and (coalesce($2::int,0)=0 or s.year=$2)
      and (coalesce($3::text,'')='' or c.subject_prefix ilike $3||'%')
      and (coalesce($4::text,'')='' or i.email ilike '%'||$4||'%' or i.first_name ilike '%'||$4||'%' or i.last_name ilike '%'||$4||'%')
    order by name nulls last, email
    """
    async with app.state.pool.acquire() as con:
        rows = await con.fetch(sql, term, year, subject, q)
    return [dict(r) for r in rows]

@app.get("/email-list")
async def email_list(term: str | None=None, year: int | None=None, subject: str | None=None):
    """
    Returns a comma-separated unique email list for quick copy/paste.
    """
    sql = """
    select string_agg(distinct i.email, ', ') as emails
    from vos.instructors i
    join vos.instructor_assignments ia on ia.instructor_id = i.instructor_id
    join vos.sections s on s.section_id = ia.section_id
    join vos.courses c on c.course_id = s.course_id
    where (coalesce($1::text,'')='' or s.term=$1)
      and (coalesce($2::int,0)=0 or s.year=$2)
      and (coalesce($3::text,'')='' or c.subject_prefix ilike $3||'%')
    """
    async with app.state.pool.acquire() as con:
        row = await con.fetchval(sql, term, year, subject)
    return {"emails": row or ""}
