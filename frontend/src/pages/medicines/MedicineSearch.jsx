import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Pill,
  Store,
  Phone,
  Home,
  Percent,
  ShieldCheck,
  Loader2,
  Navigation,
  AlertCircle,
  BadgeIndianRupee,
  PackageCheck,
  Send,
  X,
  UserRound,
  MessageSquare,
  CheckCircle2,
  ChevronLeft,
  Star,
  Tag,
  Layers,
  FlaskConical,
  Stethoscope,
  Heart,
  Baby,
  Thermometer,
  Zap,
  Shield,
  Filter,
  ChevronDown,
  Info,
  Activity,
  Eye,
  Droplet,
  Wind,
  Syringe,
} from "lucide-react";
import API from "../../api/axios";

// ─── Static medicine catalogue (50 products) ─────────────────────────────────
const MEDICINE_CATALOGUE = [
  // ── Pain Relief ──────────────────────────────────────────────────────────
  {
    id: "med-001",
    medicineName: "Dolo 650",
    brandName: "Micro Labs",
    genericName: "Paracetamol",
    strength: "650mg",
    category: "Tablet",
    collection: "Pain Relief",
    prescriptionRequired: false,
    price: 30,
    mrp: 36,
    description:
      "Dolo 650 is a widely trusted analgesic and antipyretic used to relieve mild to moderate pain such as headache, muscle aches, and to reduce fever. Suitable for adults and children above 12 years.",
    usage:
      "Take 1 tablet every 4–6 hours as needed. Do not exceed 4 tablets in 24 hours.",
    dosage: "650mg per dose, max 4g/day",
    sideEffects: "Nausea, liver toxicity (with overdose), allergic reactions (rare)",
    variants: ["500mg", "650mg"],
    inStock: true,
    rating: 4.7,
    reviewCount: 3840,
  },
  {
    id: "med-002",
    medicineName: "Combiflam",
    brandName: "Sanofi",
    genericName: "Ibuprofen + Paracetamol",
    strength: "400mg + 325mg",
    category: "Tablet",
    collection: "Pain Relief",
    prescriptionRequired: false,
    price: 42,
    mrp: 50,
    description:
      "Combiflam is a combination NSAID used for faster and longer pain relief. Effective for dental pain, muscular pain, arthritis, and fever.",
    usage: "1 tablet 2–3 times a day after meals.",
    dosage: "1 tablet per dose",
    sideEffects: "Stomach upset, heartburn, dizziness. Avoid on empty stomach.",
    variants: ["Standard", "Plus"],
    inStock: true,
    rating: 4.5,
    reviewCount: 2110,
  },
  {
    id: "med-003",
    medicineName: "Volini Gel",
    brandName: "Sun Pharma",
    genericName: "Diclofenac Diethylamine",
    strength: "1% w/w",
    category: "Gel",
    collection: "Pain Relief",
    prescriptionRequired: false,
    price: 115,
    mrp: 135,
    description:
      "Volini is a topical analgesic gel for fast relief from joint pain, backache, sprains, and sports injuries. Penetrates deep for targeted relief.",
    usage: "Apply 2–4cm of gel to affected area and massage gently 3 times daily.",
    dosage: "Topical application",
    sideEffects: "Mild skin irritation, redness at application site.",
    variants: ["30g", "50g", "100g"],
    inStock: true,
    rating: 4.4,
    reviewCount: 1580,
  },
  {
    id: "med-004",
    medicineName: "Aspirin",
    brandName: "Bayer",
    genericName: "Acetylsalicylic Acid",
    strength: "75mg",
    category: "Tablet",
    collection: "Pain Relief",
    prescriptionRequired: false,
    price: 18,
    mrp: 22,
    description:
      "Low-dose aspirin used as a blood thinner to reduce risk of heart attacks. Also used for mild pain and fever reduction.",
    usage: "1 tablet daily after meals (for cardiac use). As directed by physician.",
    dosage: "75mg daily for cardiac; 325–650mg for pain",
    sideEffects: "Stomach irritation, bleeding risk, tinnitus in high doses.",
    variants: ["75mg", "150mg", "325mg"],
    inStock: true,
    rating: 4.3,
    reviewCount: 920,
  },
  // ── Antibiotics ──────────────────────────────────────────────────────────
  {
    id: "med-005",
    medicineName: "Azithromycin 500",
    brandName: "Cipla",
    genericName: "Azithromycin",
    strength: "500mg",
    category: "Tablet",
    collection: "Antibiotics",
    prescriptionRequired: true,
    price: 68,
    mrp: 80,
    description:
      "Azithromycin is a macrolide antibiotic used to treat bacterial infections like respiratory tract infections, skin infections, and STIs.",
    usage: "1 tablet daily for 3–5 days as prescribed.",
    dosage: "500mg once daily",
    sideEffects: "Nausea, diarrhea, abdominal pain, allergic reactions.",
    variants: ["250mg", "500mg"],
    inStock: true,
    rating: 4.6,
    reviewCount: 1920,
  },
  {
    id: "med-006",
    medicineName: "Amoxicillin 500",
    brandName: "Ranbaxy",
    genericName: "Amoxicillin",
    strength: "500mg",
    category: "Capsule",
    collection: "Antibiotics",
    prescriptionRequired: true,
    price: 45,
    mrp: 55,
    description:
      "Amoxicillin is a broad-spectrum penicillin antibiotic effective against a wide range of bacterial infections including ear, nose, throat, skin, and urinary tract infections.",
    usage: "1 capsule 3 times a day for 5–10 days.",
    dosage: "500mg every 8 hours",
    sideEffects: "Diarrhea, rash, nausea, vomiting.",
    variants: ["250mg", "500mg"],
    inStock: true,
    rating: 4.4,
    reviewCount: 1340,
  },
  {
    id: "med-007",
    medicineName: "Ciprofloxacin 500",
    brandName: "Dr. Reddy's",
    genericName: "Ciprofloxacin HCl",
    strength: "500mg",
    category: "Tablet",
    collection: "Antibiotics",
    prescriptionRequired: true,
    price: 55,
    mrp: 68,
    description:
      "Ciprofloxacin is a fluoroquinolone antibiotic used for urinary tract infections, respiratory infections, typhoid, and anthrax prophylaxis.",
    usage: "1 tablet twice daily for 7–14 days as directed.",
    dosage: "500mg every 12 hours",
    sideEffects: "Tendon damage risk, nausea, dizziness, photosensitivity.",
    variants: ["250mg", "500mg", "750mg"],
    inStock: true,
    rating: 4.3,
    reviewCount: 890,
  },
  {
    id: "med-008",
    medicineName: "Augmentin 625",
    brandName: "GSK",
    genericName: "Amoxicillin + Clavulanic Acid",
    strength: "625mg",
    category: "Tablet",
    collection: "Antibiotics",
    prescriptionRequired: true,
    price: 145,
    mrp: 168,
    description:
      "Augmentin is a combination antibiotic used for severe bacterial infections that are resistant to regular Amoxicillin, including sinusitis, pneumonia, and dental infections.",
    usage: "1 tablet twice daily with meals.",
    dosage: "625mg every 12 hours",
    sideEffects: "Diarrhea, skin rash, liver enzyme elevation.",
    variants: ["375mg", "625mg", "1g"],
    inStock: true,
    rating: 4.5,
    reviewCount: 1120,
  },
  // ── Vitamins & Supplements ───────────────────────────────────────────────
  {
    id: "med-009",
    medicineName: "Shelcal 500",
    brandName: "Elder Pharma",
    genericName: "Calcium Carbonate + Vitamin D3",
    strength: "500mg + 250IU",
    category: "Tablet",
    collection: "Vitamins & Supplements",
    prescriptionRequired: false,
    price: 145,
    mrp: 165,
    description:
      "Shelcal provides calcium and Vitamin D3 for bone health, preventing osteoporosis, and supporting muscle function. Ideal for women, elderly, and pregnant women.",
    usage: "1–2 tablets daily after meals.",
    dosage: "1 tablet twice daily",
    sideEffects: "Constipation, bloating, hypercalcemia (rare with overdose).",
    variants: ["500mg", "500 HD", "CT"],
    inStock: true,
    rating: 4.6,
    reviewCount: 2240,
  },
  {
    id: "med-010",
    medicineName: "Becosules Capsules",
    brandName: "Pfizer",
    genericName: "Vitamin B Complex + Vitamin C",
    strength: "Multi",
    category: "Capsule",
    collection: "Vitamins & Supplements",
    prescriptionRequired: false,
    price: 98,
    mrp: 115,
    description:
      "Becosules provides essential B vitamins and Vitamin C for energy metabolism, immunity, skin health, and overall well-being.",
    usage: "1 capsule daily after breakfast.",
    dosage: "1 capsule daily",
    sideEffects: "Urine discoloration (harmless), mild stomach upset.",
    variants: ["Standard", "Plus", "Z"],
    inStock: true,
    rating: 4.5,
    reviewCount: 3100,
  },
  {
    id: "med-011",
    medicineName: "Vitamin D3 60K",
    brandName: "Sun Pharma",
    genericName: "Cholecalciferol",
    strength: "60,000 IU",
    category: "Capsule",
    collection: "Vitamins & Supplements",
    prescriptionRequired: false,
    price: 55,
    mrp: 68,
    description:
      "High-dose Vitamin D3 supplement for correction of Vitamin D deficiency. Supports bone health, immunity, and calcium absorption.",
    usage: "1 capsule weekly for 8–12 weeks, then monthly for maintenance.",
    dosage: "60,000 IU per week",
    sideEffects: "Hypercalcemia, nausea if overused. Requires doctor guidance.",
    variants: ["60,000 IU", "1,000 IU"],
    inStock: true,
    rating: 4.7,
    reviewCount: 1780,
  },
  {
    id: "med-012",
    medicineName: "Zinc Tablet",
    brandName: "Mankind Pharma",
    genericName: "Zinc Sulphate",
    strength: "50mg",
    category: "Tablet",
    collection: "Vitamins & Supplements",
    prescriptionRequired: false,
    price: 35,
    mrp: 42,
    description:
      "Zinc supports immune function, wound healing, DNA synthesis, and cell division. Also used in COVID-19 recovery protocols.",
    usage: "1 tablet daily after meals.",
    dosage: "50mg once daily",
    sideEffects: "Nausea, vomiting, stomach cramps if taken on empty stomach.",
    variants: ["20mg", "50mg"],
    inStock: true,
    rating: 4.4,
    reviewCount: 980,
  },
  // ── Diabetes Care ────────────────────────────────────────────────────────
  {
    id: "med-013",
    medicineName: "Metformin 500",
    brandName: "USV",
    genericName: "Metformin HCl",
    strength: "500mg",
    category: "Tablet",
    collection: "Diabetes Care",
    prescriptionRequired: true,
    price: 25,
    mrp: 30,
    description:
      "Metformin is the first-line oral medication for Type 2 Diabetes. It lowers blood glucose by decreasing hepatic glucose production and improving insulin sensitivity.",
    usage: "1–2 tablets twice or thrice daily with meals.",
    dosage: "500mg–2000mg per day in divided doses",
    sideEffects: "Nausea, diarrhea, lactic acidosis (rare), B12 deficiency.",
    variants: ["500mg", "850mg", "1000mg", "SR"],
    inStock: true,
    rating: 4.5,
    reviewCount: 2340,
  },
  {
    id: "med-014",
    medicineName: "Glucobay 25",
    brandName: "Bayer",
    genericName: "Acarbose",
    strength: "25mg",
    category: "Tablet",
    collection: "Diabetes Care",
    prescriptionRequired: true,
    price: 88,
    mrp: 105,
    description:
      "Acarbose delays carbohydrate digestion, helping control postprandial blood glucose spikes in Type 2 Diabetes patients.",
    usage: "Chewed with first bite of main meal, 3 times daily.",
    dosage: "25–100mg with each meal",
    sideEffects: "Flatulence, bloating, diarrhea, abdominal discomfort.",
    variants: ["25mg", "50mg", "100mg"],
    inStock: true,
    rating: 4.1,
    reviewCount: 540,
  },
  {
    id: "med-015",
    medicineName: "Glucocheck Strips",
    brandName: "Dr. Morepen",
    genericName: "Glucose Test Strips",
    strength: "N/A",
    category: "Medical Equipment",
    collection: "Diabetes Care",
    prescriptionRequired: false,
    price: 350,
    mrp: 420,
    description:
      "Compatible blood glucose test strips for home blood sugar monitoring. Works with the Glucocheck glucometer. Pack of 50 strips.",
    usage: "Place one strip in glucometer, apply blood sample, read result.",
    dosage: "As required for blood sugar monitoring",
    sideEffects: "None (consumable product).",
    variants: ["25 strips", "50 strips", "100 strips"],
    inStock: true,
    rating: 4.3,
    reviewCount: 1250,
  },
  // ── Heart Care ───────────────────────────────────────────────────────────
  {
    id: "med-016",
    medicineName: "Atorvastatin 10",
    brandName: "Cipla",
    genericName: "Atorvastatin",
    strength: "10mg",
    category: "Tablet",
    collection: "Heart Care",
    prescriptionRequired: true,
    price: 48,
    mrp: 58,
    description:
      "Atorvastatin is a statin used to lower bad cholesterol (LDL) and triglycerides while raising good cholesterol (HDL), reducing cardiovascular risk.",
    usage: "1 tablet daily at bedtime.",
    dosage: "10–80mg once daily",
    sideEffects: "Muscle pain, liver enzyme elevation, memory issues (rare).",
    variants: ["5mg", "10mg", "20mg", "40mg", "80mg"],
    inStock: true,
    rating: 4.5,
    reviewCount: 1680,
  },
  {
    id: "med-017",
    medicineName: "Amlodipine 5",
    brandName: "Sun Pharma",
    genericName: "Amlodipine Besylate",
    strength: "5mg",
    category: "Tablet",
    collection: "Heart Care",
    prescriptionRequired: true,
    price: 38,
    mrp: 46,
    description:
      "Amlodipine is a calcium channel blocker used to treat hypertension and angina. It relaxes blood vessels for easier heart pumping.",
    usage: "1 tablet daily, same time each day.",
    dosage: "5–10mg once daily",
    sideEffects: "Ankle swelling, flushing, palpitations, headache.",
    variants: ["2.5mg", "5mg", "10mg"],
    inStock: true,
    rating: 4.4,
    reviewCount: 1020,
  },
  {
    id: "med-018",
    medicineName: "Ecosprin 75",
    brandName: "USV",
    genericName: "Aspirin",
    strength: "75mg",
    category: "Tablet",
    collection: "Heart Care",
    prescriptionRequired: false,
    price: 15,
    mrp: 18,
    description:
      "Ecosprin is a low-dose aspirin commonly prescribed for prevention of heart attacks, strokes, and blood clot formation in high-risk patients.",
    usage: "1 tablet daily after food.",
    dosage: "75mg once daily",
    sideEffects: "GI bleeding, gastric irritation, bruising.",
    variants: ["75mg", "150mg"],
    inStock: true,
    rating: 4.6,
    reviewCount: 2890,
  },
  // ── Respiratory & Allergy ─────────────────────────────────────────────────
  {
    id: "med-019",
    medicineName: "Asthalin Inhaler",
    brandName: "Cipla",
    genericName: "Salbutamol",
    strength: "100mcg/puff",
    category: "Inhaler",
    collection: "Respiratory & Allergy",
    prescriptionRequired: true,
    price: 148,
    mrp: 175,
    description:
      "Asthalin is a bronchodilator inhaler used to relieve and prevent bronchospasm in asthma and COPD. Provides rapid relief within minutes.",
    usage: "1–2 puffs 3–4 times daily or as needed for relief.",
    dosage: "100–200mcg per dose",
    sideEffects: "Tremor, tachycardia, headache, hypokalemia.",
    variants: ["100mcg", "200mcg", "Nebulisation Solution"],
    inStock: true,
    rating: 4.6,
    reviewCount: 1440,
  },
  {
    id: "med-020",
    medicineName: "Cetirizine 10",
    brandName: "Mankind",
    genericName: "Cetirizine HCl",
    strength: "10mg",
    category: "Tablet",
    collection: "Respiratory & Allergy",
    prescriptionRequired: false,
    price: 22,
    mrp: 28,
    description:
      "Cetirizine is a second-generation antihistamine used for allergic rhinitis, urticaria (hives), hay fever, and dust/pet allergies.",
    usage: "1 tablet once daily at bedtime.",
    dosage: "10mg once daily",
    sideEffects: "Drowsiness, dry mouth, headache (mild).",
    variants: ["5mg", "10mg", "Syrup"],
    inStock: true,
    rating: 4.5,
    reviewCount: 2560,
  },
  {
    id: "med-021",
    medicineName: "Benadryl Cough Syrup",
    brandName: "Johnson & Johnson",
    genericName: "Diphenhydramine + Ammonium Chloride",
    strength: "14.08mg + 138mg / 5ml",
    category: "Syrup",
    collection: "Respiratory & Allergy",
    prescriptionRequired: false,
    price: 92,
    mrp: 110,
    description:
      "Benadryl is a widely used cough syrup that relieves dry and productive coughs, sore throat, and upper respiratory congestion.",
    usage: "10ml (2 teaspoons) 3 times daily after meals.",
    dosage: "10ml per dose, 3 times daily",
    sideEffects: "Drowsiness, dry mouth, blurred vision.",
    variants: ["100ml", "200ml"],
    inStock: true,
    rating: 4.4,
    reviewCount: 3120,
  },
  {
    id: "med-022",
    medicineName: "Montelukast 10",
    brandName: "Cipla",
    genericName: "Montelukast Sodium",
    strength: "10mg",
    category: "Tablet",
    collection: "Respiratory & Allergy",
    prescriptionRequired: true,
    price: 85,
    mrp: 100,
    description:
      "Montelukast is a leukotriene receptor antagonist used for prevention and long-term treatment of asthma and relief of seasonal allergic rhinitis.",
    usage: "1 tablet at bedtime daily.",
    dosage: "10mg once daily",
    sideEffects: "Headache, abdominal pain, mood changes (rare).",
    variants: ["4mg Chewable", "5mg Chewable", "10mg"],
    inStock: true,
    rating: 4.3,
    reviewCount: 780,
  },
  // ── Gastroenterology ─────────────────────────────────────────────────────
  {
    id: "med-023",
    medicineName: "Omeprazole 20",
    brandName: "AstraZeneca",
    genericName: "Omeprazole",
    strength: "20mg",
    category: "Capsule",
    collection: "Gastroenterology",
    prescriptionRequired: false,
    price: 45,
    mrp: 55,
    description:
      "Omeprazole is a proton pump inhibitor (PPI) used to treat acid reflux, GERD, peptic ulcers, and Zollinger-Ellison syndrome.",
    usage: "1 capsule 30 minutes before breakfast.",
    dosage: "20–40mg once daily",
    sideEffects: "Headache, diarrhea, magnesium deficiency (long-term use).",
    variants: ["10mg", "20mg", "40mg"],
    inStock: true,
    rating: 4.5,
    reviewCount: 1890,
  },
  {
    id: "med-024",
    medicineName: "Pantoprazole 40",
    brandName: "Sun Pharma",
    genericName: "Pantoprazole Sodium",
    strength: "40mg",
    category: "Tablet",
    collection: "Gastroenterology",
    prescriptionRequired: false,
    price: 38,
    mrp: 46,
    description:
      "Pantoprazole reduces stomach acid secretion and is used for GERD, gastric ulcers, and erosive esophagitis treatment.",
    usage: "1 tablet daily 30 minutes before a meal.",
    dosage: "40mg once or twice daily",
    sideEffects: "Headache, diarrhea, abdominal pain.",
    variants: ["20mg", "40mg"],
    inStock: true,
    rating: 4.4,
    reviewCount: 1340,
  },
  {
    id: "med-025",
    medicineName: "Digene Gel",
    brandName: "Abbott",
    genericName: "Magnesium Hydroxide + Aluminum Hydroxide",
    strength: "400mg + 400mg / 10ml",
    category: "Syrup",
    collection: "Gastroenterology",
    prescriptionRequired: false,
    price: 95,
    mrp: 112,
    description:
      "Digene is an antacid gel providing fast relief from acidity, heartburn, indigestion, and gas. Mint flavour for pleasant taste.",
    usage: "10–20ml after meals and at bedtime.",
    dosage: "10ml up to 4 times daily",
    sideEffects: "Constipation, diarrhea, electrolyte imbalance (with overuse).",
    variants: ["Gel 200ml", "Tablet", "Double Action"],
    inStock: true,
    rating: 4.6,
    reviewCount: 2780,
  },
  {
    id: "med-026",
    medicineName: "ORS Powder",
    brandName: "Electral",
    genericName: "Oral Rehydration Salts",
    strength: "4.2g per sachet",
    category: "Powder",
    collection: "Gastroenterology",
    prescriptionRequired: false,
    price: 20,
    mrp: 24,
    description:
      "Electral ORS replenishes fluids and electrolytes lost due to diarrhea, vomiting, dehydration, and excessive sweating.",
    usage: "Dissolve 1 sachet in 1 litre of clean water. Sip throughout the day.",
    dosage: "As required based on fluid loss",
    sideEffects: "None when used as directed.",
    variants: ["Mango", "Orange", "Unflavoured"],
    inStock: true,
    rating: 4.7,
    reviewCount: 2100,
  },
  // ── Skin Care ────────────────────────────────────────────────────────────
  {
    id: "med-027",
    medicineName: "Betnovate-C Cream",
    brandName: "GSK",
    genericName: "Betamethasone + Clioquinol",
    strength: "0.1% + 3%",
    category: "Cream",
    collection: "Skin Care",
    prescriptionRequired: true,
    price: 65,
    mrp: 78,
    description:
      "Betnovate-C is a combination steroid and antifungal cream used for inflamed skin conditions like eczema, psoriasis, and infected dermatitis.",
    usage: "Apply a thin layer to affected area 2–3 times daily.",
    dosage: "Topical, 2–3 times daily",
    sideEffects: "Skin thinning, stretch marks, burning sensation on prolonged use.",
    variants: ["15g", "30g"],
    inStock: true,
    rating: 4.2,
    reviewCount: 940,
  },
  {
    id: "med-028",
    medicineName: "Clotrimazole Cream",
    brandName: "Glenmark",
    genericName: "Clotrimazole",
    strength: "1% w/w",
    category: "Cream",
    collection: "Skin Care",
    prescriptionRequired: false,
    price: 42,
    mrp: 50,
    description:
      "Clotrimazole is an antifungal cream used to treat ringworm, athlete's foot, jock itch, and other fungal skin infections.",
    usage: "Apply to clean dry skin 2–3 times daily for 2–4 weeks.",
    dosage: "Topical, 2–3 times daily",
    sideEffects: "Stinging, burning, or itching at application site.",
    variants: ["10g", "20g"],
    inStock: true,
    rating: 4.4,
    reviewCount: 1230,
  },
  {
    id: "med-029",
    medicineName: "Himalaya Neem Face Wash",
    brandName: "Himalaya",
    genericName: "Neem + Turmeric Extract",
    strength: "Herbal",
    category: "Cream",
    collection: "Skin Care",
    prescriptionRequired: false,
    price: 125,
    mrp: 145,
    description:
      "Herbal face wash with neem and turmeric extracts that purify skin, remove excess oil, and help prevent pimples and acne.",
    usage: "Apply on wet face, lather, rinse twice daily.",
    dosage: "Topical, twice daily",
    sideEffects: "None in most users. Allergy possible in sensitive skin.",
    variants: ["50ml", "100ml", "200ml"],
    inStock: true,
    rating: 4.5,
    reviewCount: 4200,
  },
  // ── Baby & Mother Care ────────────────────────────────────────────────────
  {
    id: "med-030",
    medicineName: "Folicaid Tablet",
    brandName: "Elder Pharma",
    genericName: "Folic Acid",
    strength: "5mg",
    category: "Tablet",
    collection: "Baby & Mother Care",
    prescriptionRequired: false,
    price: 30,
    mrp: 36,
    description:
      "Folic acid is essential during pregnancy for neural tube defect prevention and healthy fetal development. Also prescribed for anemia.",
    usage: "1 tablet daily before conception and during first trimester.",
    dosage: "5mg daily",
    sideEffects: "Nausea, bloating (mild). Rarely causes allergic reactions.",
    variants: ["0.5mg", "5mg"],
    inStock: true,
    rating: 4.7,
    reviewCount: 1680,
  },
  {
    id: "med-031",
    medicineName: "Calpol 500 Syrup",
    brandName: "GSK",
    genericName: "Paracetamol",
    strength: "120mg/5ml",
    category: "Syrup",
    collection: "Baby & Mother Care",
    prescriptionRequired: false,
    price: 58,
    mrp: 70,
    description:
      "Calpol is a paracetamol syrup for infants and children to reduce fever and mild pain. Strawberry flavoured for easy administration.",
    usage: "Dose based on child's weight. 10–15mg/kg every 4–6 hours.",
    dosage: "10–15mg per kg of child's weight",
    sideEffects: "Liver toxicity with overdose. Do not exceed recommended dose.",
    variants: ["Infant Drops", "Syrup 60ml", "Syrup 100ml"],
    inStock: true,
    rating: 4.7,
    reviewCount: 3200,
  },
  {
    id: "med-032",
    medicineName: "Iron + Folic Acid Syrup",
    brandName: "Albion",
    genericName: "Ferrous Sulphate + Folic Acid",
    strength: "150mg + 0.5mg / 5ml",
    category: "Syrup",
    collection: "Baby & Mother Care",
    prescriptionRequired: false,
    price: 70,
    mrp: 85,
    description:
      "Iron and folic acid combination syrup for prevention and treatment of iron-deficiency anemia during pregnancy and in children.",
    usage: "5–10ml daily as directed by physician.",
    dosage: "5ml–10ml once or twice daily",
    sideEffects: "Black stools, constipation, stomach cramps.",
    variants: ["100ml", "200ml"],
    inStock: true,
    rating: 4.3,
    reviewCount: 870,
  },
  // ── Eye Care ─────────────────────────────────────────────────────────────
  {
    id: "med-033",
    medicineName: "Moxifloxacin Eye Drops",
    brandName: "Alcon",
    genericName: "Moxifloxacin HCl",
    strength: "0.5% w/v",
    category: "Drops",
    collection: "Eye Care",
    prescriptionRequired: true,
    price: 95,
    mrp: 115,
    description:
      "Moxifloxacin eye drops are a fluoroquinolone antibiotic used to treat bacterial conjunctivitis (pink eye) and corneal infections.",
    usage: "1 drop in affected eye(s) 3 times daily for 7 days.",
    dosage: "1 drop 3 times daily",
    sideEffects: "Burning, stinging, eye irritation, blurred vision.",
    variants: ["3ml", "5ml"],
    inStock: true,
    rating: 4.4,
    reviewCount: 680,
  },
  {
    id: "med-034",
    medicineName: "Refresh Tears",
    brandName: "Allergan",
    genericName: "Carboxymethylcellulose Sodium",
    strength: "0.5%",
    category: "Drops",
    collection: "Eye Care",
    prescriptionRequired: false,
    price: 125,
    mrp: 150,
    description:
      "Refresh Tears are lubricating eye drops that provide instant and lasting relief from dry, irritated eyes caused by screens, contact lenses, or dry weather.",
    usage: "1–2 drops in each eye as needed.",
    dosage: "As needed throughout the day",
    sideEffects: "Mild temporary blurred vision after application.",
    variants: ["Refresh Tears", "Refresh Plus", "Optive"],
    inStock: true,
    rating: 4.6,
    reviewCount: 1580,
  },
  // ── Medical Equipment ─────────────────────────────────────────────────────
  {
    id: "med-035",
    medicineName: "Digital Thermometer",
    brandName: "Dr. Morepen",
    genericName: "Clinical Thermometer",
    strength: "N/A",
    category: "Medical Equipment",
    collection: "Medical Equipment",
    prescriptionRequired: false,
    price: 180,
    mrp: 220,
    description:
      "Fast-reading digital clinical thermometer with fever alarm, auto-off, and memory recall. Measures oral, rectal, or underarm temperature accurately.",
    usage: "Place under tongue / armpit. Beeps when done.",
    dosage: "N/A",
    sideEffects: "N/A",
    variants: ["Standard", "Flexible Tip", "Infrared"],
    inStock: true,
    rating: 4.5,
    reviewCount: 2340,
  },
  {
    id: "med-036",
    medicineName: "BP Monitor",
    brandName: "Omron",
    genericName: "Automatic Blood Pressure Monitor",
    strength: "N/A",
    category: "Medical Equipment",
    collection: "Medical Equipment",
    prescriptionRequired: false,
    price: 1850,
    mrp: 2200,
    description:
      "Omron HEM-7120 upper arm blood pressure monitor with easy, accurate readings, irregular heartbeat detection, and 60-reading memory.",
    usage: "Wrap cuff around upper arm, press start, read measurement.",
    dosage: "N/A",
    sideEffects: "N/A",
    variants: ["HEM-7120", "HEM-7156", "Wrist Monitor"],
    inStock: true,
    rating: 4.6,
    reviewCount: 3450,
  },
  {
    id: "med-037",
    medicineName: "Pulse Oximeter",
    brandName: "Dr. Trust",
    genericName: "SpO2 Finger Pulse Oximeter",
    strength: "N/A",
    category: "Medical Equipment",
    collection: "Medical Equipment",
    prescriptionRequired: false,
    price: 650,
    mrp: 800,
    description:
      "Non-invasive finger pulse oximeter measuring blood oxygen saturation (SpO2) and pulse rate with LED display. Essential for COVID-19 and respiratory monitoring.",
    usage: "Clip on fingertip, press button, read SpO2 and pulse rate.",
    dosage: "N/A",
    sideEffects: "N/A",
    variants: ["Standard", "OLED Display", "Paediatric"],
    inStock: true,
    rating: 4.5,
    reviewCount: 2890,
  },
  {
    id: "med-038",
    medicineName: "Nebulizer Machine",
    brandName: "Philips Respironics",
    genericName: "Compressor Nebulizer",
    strength: "N/A",
    category: "Medical Equipment",
    collection: "Medical Equipment",
    prescriptionRequired: false,
    price: 1450,
    mrp: 1800,
    description:
      "Philips compressor nebulizer converts liquid medicine to fine mist for inhalation. Ideal for asthma, COPD, and respiratory conditions.",
    usage: "Fill chamber with prescribed medicine, inhale mist for 10–15 minutes.",
    dosage: "As per prescribed medicine",
    sideEffects: "N/A",
    variants: ["InnoSpire Elegance", "InnoSpire Mini"],
    inStock: true,
    rating: 4.4,
    reviewCount: 1240,
  },
  // ── Injections & IV ──────────────────────────────────────────────────────
  {
    id: "med-039",
    medicineName: "Insulin Glargine",
    brandName: "Sanofi",
    genericName: "Insulin Glargine",
    strength: "100 IU/ml",
    category: "Injection",
    collection: "Diabetes Care",
    prescriptionRequired: true,
    price: 1050,
    mrp: 1250,
    description:
      "Lantus is a long-acting basal insulin used for Type 1 and Type 2 diabetes. Provides 24-hour blood glucose control.",
    usage: "Inject subcutaneously once daily at the same time.",
    dosage: "As prescribed by diabetologist",
    sideEffects: "Hypoglycemia, injection site reactions, weight gain.",
    variants: ["Vial", "Pen Cartridge", "SoloStar Pen"],
    inStock: true,
    rating: 4.5,
    reviewCount: 880,
  },
  {
    id: "med-040",
    medicineName: "Vitamin B12 Injection",
    brandName: "Piramal",
    genericName: "Cyanocobalamin",
    strength: "1000mcg/ml",
    category: "Injection",
    collection: "Vitamins & Supplements",
    prescriptionRequired: true,
    price: 38,
    mrp: 48,
    description:
      "Vitamin B12 injection for rapid correction of severe B12 deficiency causing anemia, neuropathy, and fatigue.",
    usage: "Administered intramuscularly by healthcare professional.",
    dosage: "1000mcg weekly or as directed",
    sideEffects: "Injection site pain, dizziness, allergic reactions (rare).",
    variants: ["1ml Ampoule", "2ml Ampoule"],
    inStock: true,
    rating: 4.6,
    reviewCount: 540,
  },
  // ── Syrups ───────────────────────────────────────────────────────────────
  {
    id: "med-041",
    medicineName: "Corex Cough Syrup",
    brandName: "Pfizer",
    genericName: "Codeine Phosphate + Chlorpheniramine",
    strength: "10mg + 4mg / 5ml",
    category: "Syrup",
    collection: "Respiratory & Allergy",
    prescriptionRequired: true,
    price: 108,
    mrp: 128,
    description:
      "Corex is an antitussive and antihistamine cough syrup for relief of dry cough and allergic rhinitis symptoms.",
    usage: "5–10ml 3 times daily. Not for children under 6.",
    dosage: "5ml per dose, 3 times daily",
    sideEffects: "Drowsiness, constipation, nausea. Habit-forming potential.",
    variants: ["100ml", "200ml"],
    inStock: true,
    rating: 4.0,
    reviewCount: 1450,
  },
  {
    id: "med-042",
    medicineName: "Liv 52 Syrup",
    brandName: "Himalaya",
    genericName: "Caper Bush + Chicory Extract",
    strength: "Herbal",
    category: "Syrup",
    collection: "Gastroenterology",
    prescriptionRequired: false,
    price: 95,
    mrp: 112,
    description:
      "Liv 52 is an Ayurvedic liver tonic that protects the liver from hepatotoxins, improves liver function, and aids digestion.",
    usage: "15ml twice daily before meals.",
    dosage: "15ml twice daily",
    sideEffects: "Generally safe. Mild GI disturbance in rare cases.",
    variants: ["100ml", "200ml", "DS Tablet"],
    inStock: true,
    rating: 4.4,
    reviewCount: 2340,
  },
  {
    id: "med-043",
    medicineName: "Chericof Syrup",
    brandName: "Alkem",
    genericName: "Dextromethorphan + Phenylephrine + CPM",
    strength: "10mg + 5mg + 2mg / 5ml",
    category: "Syrup",
    collection: "Respiratory & Allergy",
    prescriptionRequired: false,
    price: 62,
    mrp: 75,
    description:
      "Chericof is a multi-symptom cold and cough syrup that relieves congestion, suppresses cough, and reduces allergic symptoms.",
    usage: "10ml 3 times daily after meals.",
    dosage: "10ml per dose, 3 times daily",
    sideEffects: "Drowsiness, dry mouth, dizziness.",
    variants: ["100ml", "200ml"],
    inStock: true,
    rating: 4.2,
    reviewCount: 920,
  },
  // ── Thyroid ──────────────────────────────────────────────────────────────
  {
    id: "med-044",
    medicineName: "Thyronorm 50",
    brandName: "Abbott",
    genericName: "Levothyroxine Sodium",
    strength: "50mcg",
    category: "Tablet",
    collection: "Hormonal & Thyroid",
    prescriptionRequired: true,
    price: 42,
    mrp: 50,
    description:
      "Thyronorm replaces or supplements the thyroid hormone in patients with hypothyroidism. Must be taken consistently for effective management.",
    usage: "1 tablet daily on empty stomach 30–60 minutes before breakfast.",
    dosage: "25–200mcg once daily based on TSH levels",
    sideEffects: "Palpitations, weight loss, tremors if dose is too high.",
    variants: ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg"],
    inStock: true,
    rating: 4.7,
    reviewCount: 1890,
  },
  // ── Women's Health ────────────────────────────────────────────────────────
  {
    id: "med-045",
    medicineName: "Norethindrone 5mg",
    brandName: "Sun Pharma",
    genericName: "Norethindrone",
    strength: "5mg",
    category: "Tablet",
    collection: "Women's Health",
    prescriptionRequired: true,
    price: 78,
    mrp: 92,
    description:
      "Norethindrone is a progestin used for treatment of menstrual disorders, endometriosis, and as a component of contraceptive pills.",
    usage: "As prescribed by gynecologist.",
    dosage: "5mg daily for specific treatment days",
    sideEffects: "Nausea, headache, mood changes, irregular bleeding.",
    variants: ["5mg"],
    inStock: true,
    rating: 4.1,
    reviewCount: 340,
  },
  {
    id: "med-046",
    medicineName: "Gynaecosid Tablet",
    brandName: "Alkem",
    genericName: "Methylergometrine Maleate",
    strength: "0.125mg",
    category: "Tablet",
    collection: "Women's Health",
    prescriptionRequired: true,
    price: 35,
    mrp: 42,
    description:
      "Used to control postpartum bleeding and ensure uterine contraction after childbirth or abortion.",
    usage: "As prescribed by attending physician/gynaecologist.",
    dosage: "0.125–0.25mg 2–4 times daily",
    sideEffects: "Nausea, vomiting, headache, hypertension.",
    variants: ["0.125mg"],
    inStock: true,
    rating: 4.0,
    reviewCount: 220,
  },
  // ── Neuro & Sleep ─────────────────────────────────────────────────────────
  {
    id: "med-047",
    medicineName: "Melatonin 3mg",
    brandName: "La Shield",
    genericName: "Melatonin",
    strength: "3mg",
    category: "Tablet",
    collection: "Neuro & Sleep",
    prescriptionRequired: false,
    price: 210,
    mrp: 250,
    description:
      "Melatonin is a natural sleep hormone supplement used for jet lag, insomnia, shift work sleep disorder, and improving sleep quality.",
    usage: "1 tablet 30–60 minutes before bedtime.",
    dosage: "0.5mg–5mg at bedtime",
    sideEffects: "Drowsiness, headache, dizziness (mild).",
    variants: ["1mg", "3mg", "5mg", "10mg"],
    inStock: true,
    rating: 4.3,
    reviewCount: 1120,
  },
  {
    id: "med-048",
    medicineName: "Pregabalin 75",
    brandName: "Pfizer",
    genericName: "Pregabalin",
    strength: "75mg",
    category: "Capsule",
    collection: "Neuro & Sleep",
    prescriptionRequired: true,
    price: 145,
    mrp: 172,
    description:
      "Pregabalin is used to treat neuropathic pain, fibromyalgia, partial-onset seizures, and generalized anxiety disorder.",
    usage: "1 capsule 2–3 times daily as prescribed.",
    dosage: "75–600mg per day in divided doses",
    sideEffects: "Dizziness, drowsiness, weight gain, blurred vision.",
    variants: ["25mg", "50mg", "75mg", "150mg"],
    inStock: true,
    rating: 4.2,
    reviewCount: 620,
  },
  // ── Urology ───────────────────────────────────────────────────────────────
  {
    id: "med-049",
    medicineName: "Fosfomycin Sachet",
    brandName: "Macleods",
    genericName: "Fosfomycin Trometamol",
    strength: "3g",
    category: "Powder",
    collection: "Antibiotics",
    prescriptionRequired: true,
    price: 285,
    mrp: 340,
    description:
      "Single-dose antibiotic powder sachet for uncomplicated urinary tract infections (UTIs) in women. Dissolve in water and consume.",
    usage: "Dissolve 1 sachet in water, take as a single dose on empty stomach.",
    dosage: "3g single dose",
    sideEffects: "Diarrhea, nausea, headache, vaginitis.",
    variants: ["3g Sachet"],
    inStock: true,
    rating: 4.4,
    reviewCount: 480,
  },
  {
    id: "med-050",
    medicineName: "Digital Glucometer Kit",
    brandName: "Accu-Chek",
    genericName: "Blood Glucose Monitoring System",
    strength: "N/A",
    category: "Medical Equipment",
    collection: "Diabetes Care",
    prescriptionRequired: false,
    price: 1200,
    mrp: 1500,
    description:
      "Accu-Chek Active glucometer kit includes the meter, 10 test strips, 10 lancets, lancing device, and carry pouch. Results in 5 seconds.",
    usage: "Prick fingertip, apply blood to strip inserted in meter, read result.",
    dosage: "N/A",
    sideEffects: "N/A",
    variants: ["Active Kit", "Instant Kit", "Guide Kit"],
    inStock: true,
    rating: 4.6,
    reviewCount: 3120,
  },
];

// ─── Collections config ────────────────────────────────────────────────────────
const COLLECTIONS = [
  { id: "all", label: "All Products", icon: Layers },
  { id: "Pain Relief", label: "Pain Relief", icon: Zap },
  { id: "Antibiotics", label: "Antibiotics", icon: Shield },
  { id: "Vitamins & Supplements", label: "Vitamins", icon: Activity },
  { id: "Diabetes Care", label: "Diabetes Care", icon: Droplet },
  { id: "Heart Care", label: "Heart Care", icon: Heart },
  { id: "Respiratory & Allergy", label: "Respiratory", icon: Wind },
  { id: "Gastroenterology", label: "Gut Health", icon: FlaskConical },
  { id: "Skin Care", label: "Skin Care", icon: Eye },
  { id: "Baby & Mother Care", label: "Baby & Mother", icon: Baby },
  { id: "Eye Care", label: "Eye Care", icon: Eye },
  { id: "Medical Equipment", label: "Equipment", icon: Stethoscope },
  { id: "Hormonal & Thyroid", label: "Thyroid", icon: Activity },
  { id: "Women's Health", label: "Women's Health", icon: Heart },
  { id: "Neuro & Sleep", label: "Neuro & Sleep", icon: Zap },
];

const CATEGORIES = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Drops",
  "Inhaler",
  "Medical Equipment",
  "Powder",
  "Gel",
];

// ─── Collection icon colour map ────────────────────────────────────────────────
const collectionColour = (col) => {
  const map = {
    "Pain Relief": "text-orange-600 bg-orange-50",
    Antibiotics: "text-red-600 bg-red-50",
    "Vitamins & Supplements": "text-yellow-600 bg-yellow-50",
    "Diabetes Care": "text-blue-600 bg-blue-50",
    "Heart Care": "text-rose-600 bg-rose-50",
    "Respiratory & Allergy": "text-sky-600 bg-sky-50",
    Gastroenterology: "text-emerald-600 bg-emerald-50",
    "Skin Care": "text-pink-600 bg-pink-50",
    "Baby & Mother Care": "text-violet-600 bg-violet-50",
    "Eye Care": "text-cyan-600 bg-cyan-50",
    "Medical Equipment": "text-slate-600 bg-slate-100",
    "Hormonal & Thyroid": "text-indigo-600 bg-indigo-50",
    "Women's Health": "text-fuchsia-600 bg-fuchsia-50",
    "Neuro & Sleep": "text-purple-600 bg-purple-50",
  };
  return map[col] || "text-cyan-700 bg-cyan-50";
};

// ─── Premium product imagery ─────────────────────────────────────────────────
// Category-based imagery keeps the existing catalogue data/API untouched while
// giving every product a visual identity. The same image system is used in the
// catalogue cards and the product detail view.
const PRODUCT_IMAGE_BY_CATEGORY = {
  Tablet: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85",
  Capsule: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=1200&q=85",
  Syrup: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1200&q=85",
  Injection: "https://images.unsplash.com/photo-1580281657527-47f249e8f7c4?auto=format&fit=crop&w=1200&q=85",
  Cream: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=85",
  Drops: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
  Inhaler: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1200&q=85",
  "Medical Equipment": "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=85",
  Powder: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=85",
  Gel: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85",
};

const getProductImage = (product) =>
  PRODUCT_IMAGE_BY_CATEGORY[product?.category] ||
  PRODUCT_IMAGE_BY_CATEGORY.Tablet;

// ─── Star rating helper ────────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const MedicineSearch = () => {
  // ── Existing live-search state (preserved exactly) ──────────────────────
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const [medicines, setMedicines] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [requestForm, setRequestForm] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    requestedQuantity: 1,
    message: "",
  });

  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Cream",
    "Drops",
    "Inhaler",
    "Medical Equipment",
    "Other",
  ];

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setRequestSuccess("");
    setSearched(true);

    if (!query.trim() && !city.trim() && !category) {
      setError("Please enter medicine name, city, or category to search.");
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (query.trim()) params.append("q", query.trim());
      if (city.trim()) params.append("city", city.trim());
      if (category) params.append("category", category);

      const res = await API.get(`/medicines/search?${params.toString()}`);

      setMedicines(res.data.medicines || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to search medicine availability.",
      );
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const getDirectionsUrl = (store) => {
    const lat = store?.latitude;
    const lng = store?.longitude;

    if (lat && lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    const address = encodeURIComponent(
      `${store?.storeName || ""}, ${store?.address || ""}, ${store?.city || ""}, ${store?.state || ""}`,
    );

    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  const openRequestModal = (medicine) => {
    setSelectedMedicine(medicine);
    setRequestSuccess("");
    setError("");
    setRequestForm({
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      requestedQuantity: 1,
      message: "",
    });
  };

  const closeRequestModal = () => {
    setSelectedMedicine(null);
    setRequestSuccess("");
    setRequestForm({
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      requestedQuantity: 1,
      message: "",
    });
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;

    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitMedicineRequest = async (e) => {
    e.preventDefault();

    if (!selectedMedicine) return;

    setError("");
    setRequestSuccess("");

    if (!requestForm.patientName.trim() || !requestForm.patientPhone.trim()) {
      setError("Patient name and phone number are required.");
      return;
    }

    try {
      setRequestLoading(true);

      const payload = {
        medicineId: selectedMedicine._id,
        patientName: requestForm.patientName.trim(),
        patientPhone: requestForm.patientPhone.trim(),
        patientEmail: requestForm.patientEmail.trim(),
        requestedQuantity: Number(requestForm.requestedQuantity || 1),
        message: requestForm.message.trim(),
      };

      const res = await API.post("/medicine-requests", payload);

      setRequestSuccess(
        res.data.message || "Medicine request sent successfully.",
      );
      setRequestForm({
        patientName: "",
        patientPhone: "",
        patientEmail: "",
        requestedQuantity: 1,
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send medicine request.",
      );
    } finally {
      setRequestLoading(false);
    }
  };

  // ── Catalogue state (NEW) ───────────────────────────────────────────────
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeCategory, setActiveCategory] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState("all");
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const filteredProducts = useMemo(() => {
    return MEDICINE_CATALOGUE.filter((p) => {
      const matchCollection =
        activeCollection === "all" || p.collection === activeCollection;
      const matchCategory =
        !activeCategory || p.category === activeCategory;
      const matchPrescription =
        prescriptionFilter === "all"
          ? true
          : prescriptionFilter === "rx"
            ? p.prescriptionRequired
            : !p.prescriptionRequired;
      const matchSearch =
        !catalogueSearch.trim() ||
        p.medicineName
          .toLowerCase()
          .includes(catalogueSearch.trim().toLowerCase()) ||
        p.brandName
          .toLowerCase()
          .includes(catalogueSearch.trim().toLowerCase()) ||
        p.genericName
          .toLowerCase()
          .includes(catalogueSearch.trim().toLowerCase());

      return matchCollection && matchCategory && matchPrescription && matchSearch;
    });
  }, [activeCollection, activeCategory, prescriptionFilter, catalogueSearch]);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0] || "");
    setActiveTab("description");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setSelectedVariant("");
    setActiveTab("description");
  };

  const discountPercent = (mrp, price) =>
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* ── Product Detail Overlay ─────────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-cyan-50">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back */}
            <button
              type="button"
              onClick={closeProductDetail}
              className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ChevronLeft size={18} />
              Back to Catalogue
            </button>

            <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
              {/* Left – Premium product image card */}
              <div className="space-y-4">
                <div className="group relative aspect-square overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 shadow-2xl shadow-cyan-100/50">
                  <img
                    src={getProductImage(selectedProduct)}
                    alt={`${selectedProduct.medicineName} product`}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="eager"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/30 bg-white/85 px-3 py-1 text-[11px] font-black text-slate-800 shadow-lg backdrop-blur">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.prescriptionRequired && (
                      <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-black text-white shadow-lg">
                        Rx Required
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                      {selectedProduct.brandName}
                    </p>
                    <p className="mt-1 text-2xl font-black">
                      {selectedProduct.medicineName}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/80">
                      {selectedProduct.strength}
                    </p>
                  </div>
                </div>

                {/* Variant selector */}
                {selectedProduct.variants.length > 1 && (
                  <div className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-lg shadow-cyan-100/30">
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                      Select Variant
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition ${selectedVariant === v
                            ? "bg-gradient-to-r from-cyan-600 to-emerald-500 text-white shadow-md shadow-cyan-200"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-700"
                            }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${collectionColour(selectedProduct.collection)}`}
                  >
                    <Tag size={12} />
                    {selectedProduct.collection}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    <Layers size={12} />
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.prescriptionRequired ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                      <ShieldCheck size={12} />
                      Rx Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      <CheckCircle2 size={12} />
                      OTC
                    </span>
                  )}
                  {selectedProduct.inStock ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                      <PackageCheck size={12} />
                      In Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Right – Details */}
              <div className="space-y-5">
                {/* Heading */}
                <div>
                  <h1 className="text-3xl font-black text-slate-950">
                    {selectedProduct.medicineName}
                  </h1>
                  <p className="mt-1 text-base font-semibold text-slate-500">
                    {selectedProduct.brandName}
                    {selectedProduct.genericName
                      ? ` · ${selectedProduct.genericName}`
                      : ""}
                    {selectedProduct.strength
                      ? ` · ${selectedProduct.strength}`
                      : ""}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <StarRating rating={selectedProduct.rating} />
                    <span className="text-sm font-bold text-slate-500">
                      {selectedProduct.rating} ({selectedProduct.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-emerald-50 p-5">
                  <div className="flex items-end gap-3">
                    <span className="flex items-center text-3xl font-black text-slate-950">
                      <BadgeIndianRupee size={26} className="text-slate-700" />
                      {selectedProduct.price}
                    </span>
                    {selectedProduct.mrp > selectedProduct.price && (
                      <>
                        <span className="mb-1 text-base font-bold text-slate-400 line-through">
                          ₹{selectedProduct.mrp}
                        </span>
                        <span className="mb-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-black text-white">
                          {discountPercent(selectedProduct.mrp, selectedProduct.price)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {selectedVariant && (
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Pack: <strong className="text-slate-800">{selectedVariant}</strong>
                    </p>
                  )}
                </div>

                {/* Request button */}
                <button
                  type="button"
                  onClick={() =>
                    openRequestModal({
                      ...selectedProduct,
                      _id: selectedProduct.id,
                      medicalStore: null,
                    })
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-cyan-200 transition hover:scale-[1.02]"
                >
                  <Send size={19} />
                  Request This Medicine
                </button>

                {/* Tabs */}
                <div className="rounded-[1.5rem] border border-white/80 bg-white shadow-lg shadow-cyan-100/30">
                  <div className="flex gap-1 border-b border-slate-100 p-2">
                    {[
                      { id: "description", label: "Description" },
                      { id: "usage", label: "Usage & Dosage" },
                      { id: "sideEffects", label: "Side Effects" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 rounded-xl px-3 py-2 text-xs font-black transition ${activeTab === tab.id
                          ? "bg-gradient-to-r from-cyan-600 to-emerald-500 text-white shadow"
                          : "text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="p-5 text-sm leading-7 text-slate-600">
                    {activeTab === "description" && (
                      <p>{selectedProduct.description}</p>
                    )}
                    {activeTab === "usage" && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                            How to Use
                          </p>
                          <p className="mt-1">{selectedProduct.usage}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Dosage
                          </p>
                          <p className="mt-1">{selectedProduct.dosage}</p>
                        </div>
                      </div>
                    )}
                    {activeTab === "sideEffects" && (
                      <div className="flex gap-3">
                        <AlertCircle
                          size={18}
                          className="mt-0.5 shrink-0 text-orange-500"
                        />
                        <p>{selectedProduct.sideEffects}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety note */}
                <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                  <Info size={17} className="mt-0.5 shrink-0 text-amber-600" />
                  <p className="text-xs font-semibold leading-5 text-amber-800">
                    Always consult a registered doctor before starting or stopping any medication. Prices shown are indicative and may vary by store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* ── Medicine Catalogue Section (NEW) ──────────────────────────────── */}
      <section className="py-4 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-sm font-black text-emerald-700 shadow-sm backdrop-blur">
              <Layers size={17} />
              Medicine Catalogue
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Browse Our Medicine Catalogue
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
              Explore 50+ medicines, syrups, medical equipment, and health
              supplements — filter by collection, category, or prescription
              requirement.
            </p>
          </div>

          {/* ── Filter bar ─────────────────────────────────────────────────── */}
          <div className="mb-6 rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-xl shadow-cyan-100/40 backdrop-blur-xl">
            {/* Catalogue search */}
            <div className="mb-4 flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                placeholder="Search catalogue by medicine name, brand, or generic..."
                className="ml-3 w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
              />
              {catalogueSearch && (
                <button
                  type="button"
                  onClick={() => setCatalogueSearch("")}
                  className="ml-2 text-slate-400 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Row 2 – Category + Prescription */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 focus-within:border-cyan-400">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400" />
              </div>

              {/* Prescription toggle */}
              <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {[
                  { id: "all", label: "All" },
                  { id: "otc", label: "OTC (No Rx)" },
                  { id: "rx", label: "Rx Required" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPrescriptionFilter(opt.id)}
                    className={`px-4 py-2 text-sm font-bold transition ${prescriptionFilter === opt.id
                      ? "bg-gradient-to-r from-cyan-600 to-emerald-500 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Reset */}
              {(activeCollection !== "all" ||
                activeCategory ||
                prescriptionFilter !== "all" ||
                catalogueSearch) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCollection("all");
                      setActiveCategory("");
                      setPrescriptionFilter("all");
                      setCatalogueSearch("");
                    }}
                    className="flex items-center gap-1 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <X size={14} />
                    Clear Filters
                  </button>
                )}
            </div>
          </div>

          {/* ── Collections horizontal scroll ──────────────────────────────── */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2" style={{ minWidth: "max-content" }}>
              {COLLECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCollection(id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black whitespace-nowrap transition ${activeCollection === id
                    ? "bg-gradient-to-r from-cyan-600 to-emerald-500 text-white shadow-lg shadow-cyan-200"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-700"
                    }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="mb-5 text-sm font-bold text-slate-500">
            Showing{" "}
            <span className="text-slate-900">{filteredProducts.length}</span>{" "}
            of{" "}
            <span className="text-slate-900">{MEDICINE_CATALOGUE.length}</span>{" "}
            products
          </p>

          {/* ── Product Grid ───────────────────────────────────────────────── */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white/70 py-20 text-center backdrop-blur">
              <PackageCheck size={48} className="text-slate-300" />
              <h3 className="mt-4 text-xl font-black text-slate-700">
                No products match your filters
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Try changing the collection, category, or prescription filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const discount = discountPercent(product.mrp, product.price);
                return (
                  <article
                    key={product.id}
                    onClick={() => openProductDetail(product)}
                    className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-lg shadow-cyan-100/30 ring-1 ring-white transition duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-200/40"
                  >
                    {/* Premium product image area */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
                      <img
                        src={getProductImage(product)}
                        alt={`${product.medicineName} product`}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/5" />
                      <div className="absolute left-3 top-3 flex max-w-[85%] flex-wrap gap-1.5">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black shadow-lg backdrop-blur ${collectionColour(product.collection)}`}>
                          {product.collection}
                        </span>
                        {product.prescriptionRequired ? (
                          <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-black text-white shadow-lg">Rx</span>
                        ) : (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black text-white shadow-lg">OTC</span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                        <div className="min-w-0 text-white">
                          <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">{product.brandName}</p>
                          <p className="truncate text-lg font-black">{product.medicineName}</p>
                        </div>
                        <span className="shrink-0 rounded-xl border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                          View details
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      {/* Badges */}
                      <div className="mb-2 flex flex-wrap gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-black ${collectionColour(product.collection)}`}
                        >
                          {product.collection}
                        </span>
                        {product.prescriptionRequired ? (
                          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-700">
                            Rx
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                            OTC
                          </span>
                        )}
                      </div>

                      <h3 className="truncate text-base font-black text-slate-900 group-hover:text-cyan-700">
                        {product.medicineName}
                      </h3>
                      <p className="truncate text-xs font-semibold text-slate-500">
                        {product.brandName}
                        {product.strength ? ` · ${product.strength}` : ""}
                      </p>

                      {/* Rating */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <StarRating rating={product.rating} />
                        <span className="text-xs font-bold text-slate-400">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>

                      {/* Price row */}
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <span className="flex items-center text-lg font-black text-slate-900">
                            <BadgeIndianRupee size={16} />
                            {product.price}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-black text-white">
                            {discount}% off
                          </span>
                        )}
                      </div>

                      {/* Category pill */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">
                          <Layers size={10} />
                          {product.category}
                        </div>
                        <span className="text-xs font-black text-cyan-700 transition group-hover:translate-x-0.5">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Request Medicine Modal (PRESERVED) ────────────────────────────── */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl" style={{ maxHeight: "90vh" }}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Request Medicine
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {selectedMedicine.medicineName}
                  {selectedMedicine.medicalStore?.storeName
                    ? ` from ${selectedMedicine.medicalStore.storeName}`
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRequestModal}
                className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {requestSuccess && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={18} />
                {requestSuccess}
              </div>
            )}

            <form onSubmit={submitMedicineRequest} className="space-y-4">
              <Input
                label="Your Name"
                name="patientName"
                value={requestForm.patientName}
                onChange={handleRequestChange}
                placeholder="Enter your full name"
                icon={<UserRound size={18} />}
                required
              />

              <Input
                label="Phone Number"
                name="patientPhone"
                value={requestForm.patientPhone}
                onChange={handleRequestChange}
                placeholder="Enter phone number"
                icon={<Phone size={18} />}
                required
              />

              <Input
                label="Email"
                name="patientEmail"
                value={requestForm.patientEmail}
                onChange={handleRequestChange}
                placeholder="Optional"
                type="email"
              />

              <Input
                label="Quantity"
                name="requestedQuantity"
                value={requestForm.requestedQuantity}
                onChange={handleRequestChange}
                placeholder="Example: 2"
                type="number"
              />

              <Textarea
                label="Message"
                name="message"
                value={requestForm.message}
                onChange={handleRequestChange}
                placeholder="Example: Please keep this medicine ready. I will visit today."
                icon={<MessageSquare size={18} />}
              />

              <button
                type="submit"
                disabled={requestLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-cyan-100 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {requestLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {requestLoading ? "Sending..." : "Send Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

// ── Sub-components (PRESERVED) ────────────────────────────────────────────────

const MiniInfo = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-800">{value}</p>
    </div>
  );
};

const Badge = ({ icon, text }) => {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 shadow-sm">
      {icon}
      {text}
    </span>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">
        {icon && <span className="text-slate-400">{icon}</span>}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-transparent text-sm outline-none ${icon ? "ml-3" : ""
            }`}
        />
      </div>
    </div>
  );
};

const Textarea = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      />
    </div>
  );
};

export default MedicineSearch;
