import { DAY } from "../lib/format";

export type Kind = "pdf" | "word" | "excel" | "slides";
export type TagId = "clients" | "study" | "tax";

export type Doc = {
  id: number;
  name: string;
  ext: string;
  kind: Kind;
  folder: string;
  size: number;
  modified: number;
  text: string;
  tags: TagId[];
  favourite?: boolean;
  opened?: { count: number; last: number };
  /** Documents with the same group are byte-identical copies. */
  dupe?: string;
};

export const TAGS: { id: TagId; name: string; color: string }[] = [
  { id: "clients", name: "Clients", color: "var(--tag-blue)" },
  { id: "study", name: "Study", color: "var(--tag-plum)" },
  { id: "tax", name: "Tax 2026", color: "var(--tag-moss)" },
];

export const KINDS: { id: Kind; label: string; bucket: string; formats: string }[] = [
  { id: "pdf", label: "PDF", bucket: "PDFs", formats: "pdf" },
  { id: "word", label: "Word", bucket: "Word documents", formats: "docx" },
  { id: "excel", label: "Excel", bucket: "Spreadsheets", formats: "xlsx, csv" },
  { id: "slides", label: "PowerPoint", bucket: "Presentations", formats: "pptx" },
];

const U = "C:\\Users\\Maya";
const D = `${U}\\Documents`;
const KB = 1024;

type Raw = Omit<Doc, "id" | "kind" | "ext" | "modified"> & { days: number; hours?: number };

const KIND_OF: Record<string, Kind> = {
  pdf: "pdf",
  docx: "word",
  xlsx: "excel",
  csv: "excel",
  pptx: "slides",
};

// A made-up library: every name, company and figure below is fictional.
const RAW: Raw[] = [
  {
    name: "Invoice INV-2063.pdf",
    folder: `${D}\\Work\\Clients\\Blue Fern Cafe`,
    size: 182 * KB,
    days: 2,
    hours: 3,
    text: "Invoice INV-2063 Blue Fern Café · issued 2 days ago. Menu design (print and social) 780.00. Photography half day 450.00. Total due 1,230.00. Payment due within 30 days by bank transfer. Please quote the invoice number as the payment reference.",
    tags: ["clients"],
    favourite: true,
    opened: { count: 3, last: 55 * 60 * 1000 },
    dupe: "inv2063",
  },
  {
    name: "Sales Report September.xlsx",
    folder: `${D}\\Work\\Finance`,
    size: 94 * KB,
    days: 0,
    hours: 5,
    text: "September sales by region. North 41,200 · South 38,900 · East 29,450 · West 33,100. Growth 12% month on month. Top product: seasonal menu printing.",
    tags: [],
  },
  {
    name: "Thesis Draft v7.docx",
    folder: `${D}\\Study\\MSc`,
    size: 612 * KB,
    days: 1,
    text: "Chapter 3: Methods. Semi-structured interviews with 14 participants explored how people re-find documents on their own computers. Transcripts were coded using thematic analysis. Ethics approval reference MSC-2026-118.",
    tags: ["study"],
    opened: { count: 9, last: 3 * 60 * 60 * 1000 },
  },
  {
    name: "Cash Flow Forecast.xlsx",
    folder: `${D}\\Work\\Finance`,
    size: 118 * KB,
    days: 4,
    text: "Cash flow forecast 2026. Month, opening balance, income, expenses, closing balance. Q4 projection assumes two new retainers from October. Quarterly VAT payment due 7 November.",
    tags: [],
    opened: { count: 4, last: 4 * DAY },
  },
  {
    name: "Budget 2026.xlsx",
    folder: `${D}\\Home\\Finance`,
    size: 46 * KB,
    days: 6,
    text: "Household budget 2026. Rent 1,150 · groceries 320 · utilities 140 · travel 90 · savings goal 400 · holiday fund 120. Emergency fund target: six months of expenses.",
    tags: ["tax"],
    dupe: "budget",
  },
  {
    name: "Q3 Client Review.pptx",
    folder: `${D}\\Work\\Presentations`,
    size: 4.8 * 1024 * KB,
    days: 8,
    text: "Q3 client review. Wins: Blue Fern Café rebrand, Northfield Dental booking page. Pipeline: three proposals out. Retention 92%. Next quarter goals: raise day rate, launch the studio newsletter.",
    tags: ["clients"],
  },
  {
    name: "Invoice INV-2057.pdf",
    folder: `${D}\\Work\\Clients\\Northfield Dental`,
    size: 182 * KB,
    days: 9,
    text: "Invoice INV-2057 Northfield Dental Practice. Website refresh and appointment booking page, phase one. Total due 2,400.00. Payment due within 30 days.",
    tags: ["clients"],
  },
  {
    name: "Meeting Notes 2026-09-18.docx",
    folder: `${D}\\Work\\Notes`,
    size: 22 * KB,
    days: 9,
    text: "Weekly sync. Decisions: ship the booking page on the 30th, keep the old phone line for a month. Actions: Maya to send the invoice, Sam to review the copy, Priya to test on mobile.",
    tags: [],
  },
  {
    name: "Travel Itinerary Lisbon.pdf",
    folder: `${U}\\Downloads`,
    size: 332 * KB,
    days: 11,
    text: "Travel itinerary: Lisbon. Flights and hotel, 3 nights. Outbound Friday 07:10, seat 14A. Hotel Alfama, Rua de São Miguel, check-in from 15:00. Return Monday 19:45. Booking reference QX7KD2.",
    tags: [],
    favourite: true,
    opened: { count: 2, last: 11 * DAY },
  },
  {
    name: "Receipts Q3.xlsx",
    folder: `${D}\\Home\\Tax`,
    size: 58 * KB,
    days: 12,
    text: "Receipts July to September: laptop 1,249.00, software subscriptions, train tickets to client meetings, coworking day passes. Keep receipts for six years.",
    tags: ["tax"],
  },
  {
    name: "Project Proposal - Northfield.docx",
    folder: `${D}\\Work\\Clients\\Northfield Dental`,
    size: 88 * KB,
    days: 14,
    text: "Proposal: patient booking redesign for Northfield Dental. Scope: online booking, reminders by text message, accessible forms. Timeline six weeks. Fixed fee. Next steps: sign and return by Friday.",
    tags: ["clients"],
  },
  {
    name: "Resume - Maya Patel 2026.pdf",
    folder: `${U}\\Desktop`,
    size: 141 * KB,
    days: 17,
    text: "Maya Patel, product designer. Experience: Harbor & Pine Studio, 2021 to present, design lead. Skills: interaction design, prototyping, user research, accessibility.",
    tags: [],
  },
  {
    name: "Literature Review.docx",
    folder: `${D}\\Study\\MSc`,
    size: 204 * KB,
    days: 19,
    text: "Literature review: personal information management. Re-finding is more common than finding; people remember what a document was about rather than where it was saved.",
    tags: ["study"],
  },
  {
    name: "Invoice INV-2049.pdf",
    folder: `${D}\\Work\\Clients\\Kestrel Logistics`,
    size: 182 * KB,
    days: 20,
    text: "Invoice INV-2049 Kestrel Logistics Ltd · fleet dashboard icons and onboarding illustrations. Total due 960.00. Paid with thanks.",
    tags: ["clients"],
  },
  {
    name: "Brand Workshop - Blue Fern.pptx",
    folder: `${D}\\Work\\Clients\\Blue Fern Cafe`,
    size: 9.6 * 1024 * KB,
    days: 23,
    text: "Brand workshop. Moodboard, typography, colour palette, menu layout options, signage mock-ups for the new café on Harbour Road.",
    tags: ["clients"],
  },
  {
    name: "Conference Badge.pdf",
    folder: `${U}\\Downloads`,
    size: 61 * KB,
    days: 25,
    text: "Design Systems Day 2026. Attendee badge. Main hall, doors open 08:30. Please bring photo ID.",
    tags: [],
  },
  {
    name: "Grades Tracker.xlsx",
    folder: `${D}\\Study\\MSc`,
    size: 31 * KB,
    days: 26,
    text: "Module grades: Research Methods 71, Human Factors 68, Statistics 74. Dissertation weighting 60 credits.",
    tags: ["study"],
  },
  {
    name: "Tax Return 2025-26 Summary.pdf",
    folder: `${D}\\Home\\Tax`,
    size: 276 * KB,
    days: 30,
    text: "Self assessment summary 2025–26. Total income, allowable expenses, tax due, payment on account. Filing deadline 31 January; keep records for five years.",
    tags: ["tax"],
    favourite: true,
  },
  {
    name: "Wedding Guest List.xlsx",
    folder: `${D}\\Home\\Events`,
    size: 27 * KB,
    days: 33,
    text: "Guest list: names, RSVP, dietary requirements, table number. 86 invited, 71 confirmed. Venue: The Old Boathouse.",
    tags: [],
  },
  {
    name: "Portfolio 2026.pptx",
    folder: `${U}\\Desktop`,
    size: 22 * 1024 * KB,
    days: 40,
    text: "Selected work 2026: Blue Fern Café identity, Northfield Dental booking flow, Kestrel Logistics dashboard, Paper Planes pitch.",
    tags: [],
  },
  {
    name: "Statistics Lecture 4.pdf",
    folder: `${D}\\Study\\MSc\\Lectures`,
    size: 2.1 * 1024 * KB,
    days: 45,
    text: "Lecture 4: linear regression, confidence intervals, p-values and effect sizes. Worked example: reading time against font size.",
    tags: ["study"],
  },
  {
    name: "customers.csv",
    folder: `${D}\\Work\\Finance`,
    size: 12 * KB,
    days: 48,
    text: "name, email, city, first order. Blue Fern Café, Portsmouth. Northfield Dental, Leeds. Kestrel Logistics, Bristol.",
    tags: [],
  },
  {
    name: "Pitch Deck - Paper Planes.pptx",
    folder: `${D}\\Work\\Side project`,
    size: 6.4 * 1024 * KB,
    days: 52,
    text: "Paper Planes: a paper craft kit subscription for kids. Problem, solution, market size, pricing, go-to-market, the ask.",
    tags: [],
  },
  {
    name: "Research Paper - Attention.pdf",
    folder: `${D}\\Study\\Reading`,
    size: 1.3 * 1024 * KB,
    days: 60,
    text: "Abstract. We examine how interface latency affects sustained attention. Responses under 100 ms feel instantaneous; delays above one second break the flow of thought.",
    tags: ["study"],
  },
  {
    name: "Passport Renewal Form.pdf",
    folder: `${D}\\Home\\Documents`,
    size: 410 * KB,
    days: 70,
    text: "Passport renewal application. Countersignatory details, digital photo code, old passport number. Allow three weeks.",
    tags: [],
  },
  {
    name: "Home Insurance Policy.pdf",
    folder: `${D}\\Home\\Housing`,
    size: 530 * KB,
    days: 95,
    text: "Policy schedule. Contents cover 30,000. Accidental damage included. Excess 100. Renewal date 14 March. Claims line open 24 hours.",
    tags: [],
  },
  {
    name: "Car Service Record.pdf",
    folder: `${D}\\Home\\Car`,
    size: 205 * KB,
    days: 120,
    text: "Service record. MOT passed. Brake pads replaced, tyres checked. Next service due at 48,000 miles or in twelve months.",
    tags: [],
  },
  {
    name: "Lease Agreement - Flat 4B.pdf",
    folder: `${D}\\Home\\Housing`,
    size: 890 * KB,
    days: 150,
    text: "Tenancy agreement. Flat 4B, 22 Quay Street. Term twelve months. Deposit protected in a government scheme. Notice period two months. Rent reviewed yearly.",
    tags: [],
  },
  {
    name: "Recipe Collection.docx",
    folder: `${D}\\Home`,
    size: 1.1 * 1024 * KB,
    days: 200,
    text: "Recipes: pastel de nata, shakshuka, red lentil dal, banana bread, lemon drizzle cake. Oven temperatures in Celsius.",
    tags: [],
  },
  {
    name: "Invoice Template.docx",
    folder: `${D}\\Work\\Templates`,
    size: 26 * KB,
    days: 211,
    text: "Invoice template. Invoice number, client name, date issued, due date, line items, quantity, rate, amount, bank details.",
    tags: [],
    opened: { count: 6, last: 6 * DAY },
  },
  {
    name: "Employee Handbook.pdf",
    folder: `${D}\\Work\\Reference`,
    size: 3.2 * 1024 * KB,
    days: 300,
    text: "Holiday allowance 25 days plus bank holidays. Expenses policy: claim within 30 days with receipts. Remote work guidelines and equipment.",
    tags: [],
  },
  {
    name: "Invoice INV-2063 (1).pdf",
    folder: `${U}\\Downloads`,
    size: 182 * KB,
    days: 2,
    hours: 7,
    text: "Invoice INV-2063 Blue Fern Café · issued 2 days ago. Menu design (print and social) 780.00. Photography half day 450.00. Total due 1,230.00. Payment due within 30 days by bank transfer.",
    tags: [],
    dupe: "inv2063",
  },
  {
    name: "Budget 2026 - Copy.xlsx",
    folder: `${D}\\Home\\Finance\\Old`,
    size: 46 * KB,
    days: 6,
    hours: 1,
    text: "Household budget 2026. Rent 1,150 · groceries 320 · utilities 140 · travel 90 · savings goal 400 · holiday fund 120.",
    tags: [],
    dupe: "budget",
  },
];

/** Builds the library with dates relative to now, so "2 days ago" is always true. */
export function makeLibrary(now = Date.now()): Doc[] {
  return RAW.map(({ days, hours = 0, opened, ...d }, i) => {
    const ext = d.name.slice(d.name.lastIndexOf(".") + 1).toLowerCase();
    return {
      ...d,
      id: i + 1,
      ext,
      kind: KIND_OF[ext],
      size: Math.round(d.size),
      modified: now - days * DAY - hours * 3600 * 1000 - (i % 7) * 13 * 60 * 1000,
      opened: opened && { count: opened.count, last: now - opened.last },
    };
  });
}
