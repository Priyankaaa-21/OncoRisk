/**
 * Directory of verified cancer screening centers, oncology institutes,
 * and comprehensive cancer networks with OpenStreetMap coordinates.
 */

export const CLINIC_DIRECTORY = [
  // India
  {
    id: 'aiims_delhi',
    name: 'Dr. B.R.A. Institute-Rotary Cancer Hospital (AIIMS)',
    city: 'New Delhi',
    country: 'India',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029',
    phone: '+91 11 2658 8500',
    specialties: ['Comprehensive Cancer Care', 'Mammography', 'Low-Dose CT', 'Onco-Surgery'],
    lat: 28.5672,
    lng: 77.2100,
    website: 'https://www.aiims.edu',
    mapUrl: 'https://www.openstreetmap.org/?mlat=28.5672&mlon=77.2100#map=16/28.5672/77.2100'
  },
  {
    id: 'tmc_mumbai',
    name: 'Tata Memorial Hospital (TMC)',
    city: 'Mumbai',
    country: 'India',
    address: 'Dr. E Borges Road, Parel, Mumbai, Maharashtra 400012',
    phone: '+91 22 2417 7000',
    specialties: ['Advanced Oncology', 'Preventive Oncology Screening', 'Radiation Therapy'],
    lat: 19.0044,
    lng: 72.8436,
    website: 'https://tmc.gov.in',
    mapUrl: 'https://www.openstreetmap.org/?mlat=19.0044&mlon=72.8436#map=16/19.0044/72.8436'
  },
  {
    id: 'kidwai_bengaluru',
    name: 'Kidwai Memorial Institute of Oncology',
    city: 'Bengaluru',
    country: 'India',
    address: 'Dr. M.H. Marigowda Road, Bengaluru, Karnataka 560029',
    phone: '+91 80 2609 4000',
    specialties: ['Regional Cancer Center', 'Cervical & Breast Screening', 'Palliative Care'],
    lat: 12.9378,
    lng: 77.5954,
    website: 'https://kidwai.karnataka.gov.in',
    mapUrl: 'https://www.openstreetmap.org/?mlat=12.9378&mlon=77.5954#map=16/12.9378/77.5954'
  },
  {
    id: 'apollo_chennai',
    name: 'Apollo Speciality Cancer Hospital',
    city: 'Chennai',
    country: 'India',
    address: '320, Anna Salai, Teynampet, Chennai, Tamil Nadu 600035',
    phone: '+91 44 2433 6119',
    specialties: ['Proton Therapy', 'PET-CT Screening', 'Robotic Surgery'],
    lat: 13.0382,
    lng: 80.2464,
    website: 'https://chennai.apollohospitals.com',
    mapUrl: 'https://www.openstreetmap.org/?mlat=13.0382&mlon=80.2464#map=16/13.0382/80.2464'
  },

  // USA
  {
    id: 'mskcc_nyc',
    name: 'Memorial Sloan Kettering Cancer Center (MSK)',
    city: 'New York',
    country: 'United States',
    address: '1275 York Avenue, New York, NY 10065',
    phone: '+1 (800) 525-2225',
    specialties: ['NCI-Designated Comprehensive Cancer Center', 'Precision Genomics', 'High-Risk Screening'],
    lat: 40.7640,
    lng: -73.9553,
    website: 'https://www.mskcc.org',
    mapUrl: 'https://www.openstreetmap.org/?mlat=40.7640&mlon=-73.9553#map=16/40.7640/-73.9553'
  },
  {
    id: 'mdanderson_houston',
    name: 'MD Anderson Cancer Center',
    city: 'Houston',
    country: 'United States',
    address: '1515 Holcombe Blvd, Houston, TX 77030',
    phone: '+1 (877) 632-6789',
    specialties: ['#1 Cancer Care Center', 'Cancer Prevention Center', 'Immunotherapy Research'],
    lat: 29.7071,
    lng: -95.3970,
    website: 'https://www.mdanderson.org',
    mapUrl: 'https://www.openstreetmap.org/?mlat=29.7071&mlon=-95.3970#map=16/29.7071/-95.3970'
  },
  {
    id: 'mayo_rochester',
    name: 'Mayo Clinic Comprehensive Cancer Center',
    city: 'Rochester',
    country: 'United States',
    address: '200 1st St SW, Rochester, MN 55905',
    phone: '+1 (507) 538-3270',
    specialties: ['Integrated Multi-Specialty Clinics', 'Early Detection Molecular Imaging'],
    lat: 44.0225,
    lng: -92.4667,
    website: 'https://www.mayoclinic.org',
    mapUrl: 'https://www.openstreetmap.org/?mlat=44.0225&mlon=-92.4667#map=16/44.0225/-92.4667'
  },
  {
    id: 'danafarber_boston',
    name: 'Dana-Farber Cancer Institute',
    city: 'Boston',
    country: 'United States',
    address: '450 Brookline Ave, Boston, MA 02215',
    phone: '+1 (866) 408-3324',
    specialties: ['Harvard Medical School Teaching Affiliate', 'Center for Cancer Genetics and Prevention'],
    lat: 42.3375,
    lng: -71.1070,
    website: 'https://www.dana-farber.org',
    mapUrl: 'https://www.openstreetmap.org/?mlat=42.3375&mlon=-71.1070#map=16/42.3375/-71.1070'
  },

  // UK & Canada
  {
    id: 'royal_marsden_london',
    name: 'The Royal Marsden NHS Foundation Trust',
    city: 'London',
    country: 'United Kingdom',
    address: 'Fulham Road, London SW3 6JJ',
    phone: '+44 20 7352 8171',
    specialties: ['World-Leading Cancer Center', 'Rapid Diagnostic Assessment Center', 'BRCA Clinic'],
    lat: 51.4890,
    lng: -0.1705,
    website: 'https://www.royalmarsden.nhs.uk',
    mapUrl: 'https://www.openstreetmap.org/?mlat=51.4890&mlon=-0.1705#map=16/51.4890/-0.1705'
  },
  {
    id: 'princess_margaret_toronto',
    name: 'Princess Margaret Cancer Centre (UHN)',
    city: 'Toronto',
    country: 'Canada',
    address: '610 University Ave, Toronto, ON M5G 2M9',
    phone: '+1 (416) 946-4501',
    specialties: ['Top 5 Global Cancer Center', 'High Risk Breast & Colorectal Screening'],
    lat: 43.6582,
    lng: -79.3900,
    website: 'https://www.uhn.ca',
    mapUrl: 'https://www.openstreetmap.org/?mlat=43.6582&mlon=-79.3900#map=16/43.6582/-79.3900'
  }
];
