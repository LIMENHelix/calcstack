/**
 * Reference data for the data-hub pages.
 *
 * HONESTY NOTE: these are rounded, order-of-magnitude figures compiled from
 * publicly reported housing-market indices and federal wage statistics.
 * They drift over time and vary within states. Every page that uses them
 * must display the "approximate, verify with current sources" disclaimer
 * and the year. Update this file when fresh numbers are published.
 *
 * SOURCES (September 2026 refresh):
 * - HOME_VALUES: Redfin median single-family sale price by state, May 2026
 *   (via Forbes Advisor, accessed Sept 2026). North Dakota and Wyoming are
 *   Zillow typical/median home values, Aug 2026 (Redfin table omitted them).
 * - SALARIES: BLS Occupational Employment and Wage Statistics (OEWS),
 *   May 2025 survey (released May 15, 2026, USDL-26-0725), national median
 *   annual wages rounded to the nearest $1,000. Occupations not in the
 *   OEWS summary table retain prior rounded estimates.
 */

/** Data year shown on the state mortgage pages (home values). */
export const DATA_YEAR = 2026

/** Survey year shown on the salary pages (BLS OEWS May 2025). */
export const SALARY_DATA_YEAR = 2025

/** Approximate typical home value by state (USD, rounded, ~2026). */
export const HOME_VALUES: { state: string; slug: string; value: number }[] = [
  { state: 'Alabama', slug: 'alabama', value: 299000 },
  { state: 'Alaska', slug: 'alaska', value: 400000 },
  { state: 'Arizona', slug: 'arizona', value: 453000 },
  { state: 'Arkansas', slug: 'arkansas', value: 270000 },
  { state: 'California', slug: 'california', value: 854000 },
  { state: 'Colorado', slug: 'colorado', value: 605000 },
  { state: 'Connecticut', slug: 'connecticut', value: 445000 },
  { state: 'Delaware', slug: 'delaware', value: 366000 },
  { state: 'District of Columbia', slug: 'washington-dc', value: 677000 },
  { state: 'Florida', slug: 'florida', value: 417000 },
  { state: 'Georgia', slug: 'georgia', value: 374000 },
  { state: 'Hawaii', slug: 'hawaii', value: 773000 },
  { state: 'Idaho', slug: 'idaho', value: 476000 },
  { state: 'Illinois', slug: 'illinois', value: 314000 },
  { state: 'Indiana', slug: 'indiana', value: 273000 },
  { state: 'Iowa', slug: 'iowa', value: 251000 },
  { state: 'Kansas', slug: 'kansas', value: 302000 },
  { state: 'Kentucky', slug: 'kentucky', value: 277000 },
  { state: 'Louisiana', slug: 'louisiana', value: 260000 },
  { state: 'Maine', slug: 'maine', value: 390000 },
  { state: 'Maryland', slug: 'maryland', value: 447000 },
  { state: 'Massachusetts', slug: 'massachusetts', value: 645000 },
  { state: 'Michigan', slug: 'michigan', value: 270000 },
  { state: 'Minnesota', slug: 'minnesota', value: 355000 },
  { state: 'Mississippi', slug: 'mississippi', value: 265000 },
  { state: 'Missouri', slug: 'missouri', value: 281000 },
  { state: 'Montana', slug: 'montana', value: 506000 },
  { state: 'Nebraska', slug: 'nebraska', value: 307000 },
  { state: 'Nevada', slug: 'nevada', value: 469000 },
  { state: 'New Hampshire', slug: 'new-hampshire', value: 500000 },
  { state: 'New Jersey', slug: 'new-jersey', value: 545000 },
  { state: 'New Mexico', slug: 'new-mexico', value: 378000 },
  { state: 'New York', slug: 'new-york', value: 596000 },
  { state: 'North Carolina', slug: 'north-carolina', value: 382000 },
  { state: 'North Dakota', slug: 'north-dakota', value: 292000 },
  { state: 'Ohio', slug: 'ohio', value: 263000 },
  { state: 'Oklahoma', slug: 'oklahoma', value: 257000 },
  { state: 'Oregon', slug: 'oregon', value: 508000 },
  { state: 'Pennsylvania', slug: 'pennsylvania', value: 309000 },
  { state: 'Rhode Island', slug: 'rhode-island', value: 535000 },
  { state: 'South Carolina', slug: 'south-carolina', value: 398000 },
  { state: 'South Dakota', slug: 'south-dakota', value: 319000 },
  { state: 'Tennessee', slug: 'tennessee', value: 392000 },
  { state: 'Texas', slug: 'texas', value: 342000 },
  { state: 'Utah', slug: 'utah', value: 575000 },
  { state: 'Vermont', slug: 'vermont', value: 438000 },
  { state: 'Virginia', slug: 'virginia', value: 462000 },
  { state: 'Washington', slug: 'washington', value: 644000 },
  { state: 'West Virginia', slug: 'west-virginia', value: 253000 },
  { state: 'Wisconsin', slug: 'wisconsin', value: 338000 },
  { state: 'Wyoming', slug: 'wyoming', value: 372000 },
]

/**
 * Approximate US median annual pay by occupation (USD, rounded).
 * BLS OEWS May 2025 national medians where available (see header note).
 */
export const SALARIES: { job: string; pay: number }[] = [
  { job: 'Software Developer', pay: 130000 },
  { job: 'Registered Nurse', pay: 98000 },
  { job: 'Accountant', pay: 83000 },
  { job: 'Teacher (High School)', pay: 78000 },
  { job: 'Electrician', pay: 63000 },
  { job: 'Plumber', pay: 63000 },
  { job: 'Police Officer', pay: 69000 },
  { job: 'Firefighter', pay: 60000 },
  { job: 'Truck Driver', pay: 54000 },
  { job: 'Real Estate Agent', pay: 54000 },
  { job: 'Graphic Designer', pay: 58000 },
  { job: 'Web Developer', pay: 79000 },
  { job: 'Data Analyst', pay: 85000 },
  { job: 'Marketing Manager', pay: 145000 },
  { job: 'Financial Analyst', pay: 99000 },
  { job: 'Mechanical Engineer', pay: 95000 },
  { job: 'Civil Engineer', pay: 94000 },
  { job: 'Nurse Practitioner', pay: 132000 },
  { job: 'Physician Assistant', pay: 126000 },
  { job: 'Physical Therapist', pay: 99000 },
  { job: 'Dental Hygienist', pay: 88000 },
  { job: 'Paralegal', pay: 60000 },
  { job: 'Chef / Head Cook', pay: 58000 },
  { job: 'Restaurant Manager', pay: 64000 },
  { job: 'Construction Manager', pay: 101000 },
  { job: 'Carpenter', pay: 58000 },
  { job: 'HVAC Technician', pay: 58000 },
  { job: 'Welder', pay: 49000 },
  { job: 'Pharmacist', pay: 136000 },
  { job: 'Veterinarian', pay: 120000 },
  { job: 'Pilot (Commercial)', pay: 150000 },
  { job: 'Air Traffic Controller', pay: 136000 },
  { job: 'IT Support Specialist', pay: 60000 },
  { job: 'Cybersecurity Analyst', pay: 112000 },
  { job: 'UX Designer', pay: 95000 },
  { job: 'Social Worker', pay: 58000 },
  { job: 'Librarian', pay: 64000 },
  { job: 'Journalist', pay: 57000 },
  { job: 'Photographer', pay: 50000 },
  { job: 'Personal Trainer', pay: 47000 },
]
