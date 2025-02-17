import { NextResponse } from "next/server";

const SHEET_ID = process.env.SECRET_SHEET_ID;
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export async function GET() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47, text.length - 2)); // Parsing JSON dari format gviz

    const sheetData = json.table.rows.map(
      (row: { c: { v: string | number | null }[] }) =>
        row.c.map((cell) => (cell?.v !== null ? String(cell?.v) : ""))
    );

    const data = sheetData.map((row: string[], index: number) => {
      const [
        name,
        jobTitle,
        department,
        location,
        yoe,
        educationDegree,
        educationInstitution,
        educationGraduationYear,
        careerLevel,
        status,
        cvUrl,
        email,
      ] = row;

      return {
        key: (index + 1).toString(),
        name,
        jobTitle,
        department,
        location,
        yoe: Number(yoe),
        educationDegree,
        educationInstitution,
        educationGraduationYear: Number(educationGraduationYear),
        careerLevel,
        status,
        cvUrl,
        email,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch data ${error}` },
      { status: 500 }
    );
  }
}
