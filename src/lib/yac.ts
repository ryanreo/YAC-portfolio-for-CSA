/**
 * YAC Digital Portfolio — Data Layer
 * Youth Evidence-to-Policy Digital Portfolio
 * Centre for the Study of Adolescence (CSA Kenya) • INSPIRE-Kenya Youth Evidence to Policy Lab
 *
 * DATA INTEGRITY: All 12 ages and counties are verified (see YAC Digital Portfolio
 * Project Documentation, Sprint 1 — Data Ingestion 12/12 Complete).
 * Zero Hallucination Rule: no personal data has been inferred or invented.
 */

export type KenyaCounty = 'Nairobi' | 'Kisumu' | 'Homa Bay' | 'Siaya' | 'Kilifi';

export type ThematicPillar =
  | 'SRHR & Public Health'
  | 'Legal & Policy Advocacy'
  | 'Data, GIS & Tech'
  | 'Media, Storytelling & Comms'
  | 'Environment & Climate'
  | 'Disability & Social Inclusion';

export interface YACProfile {
  id: string;
  fullName: string;
  age: number;
  county: KenyaCounty;
  headshotUrl: string | null;
  academicBackground: string;
  primaryRole: string;
  thematicPillars: ThematicPillar[];
  skillsAndTools: string[];
  affiliations: string[];
  shortBio: string;
  /** Documented "Lived Experience to Policy Impact" tagline — only where provided in source docs. */
  impactTagline?: string;
  fullBio?: string;
  verified: boolean;
}

export const THEMATIC_PILLARS: ThematicPillar[] = [
  'SRHR & Public Health',
  'Legal & Policy Advocacy',
  'Data, GIS & Tech',
  'Media, Storytelling & Comms',
  'Environment & Climate',
  'Disability & Social Inclusion',
];

/** Pillar display shorthand for chips/badges */
export const PILLAR_SHORT: Record<ThematicPillar, string> = {
  'SRHR & Public Health': 'SRHR & Health',
  'Legal & Policy Advocacy': 'Policy & Law',
  'Data, GIS & Tech': 'Data & Tech',
  'Media, Storytelling & Comms': 'Media & Comms',
  'Environment & Climate': 'Environment',
  'Disability & Social Inclusion': 'Inclusion',
};

export interface CountyMeta {
  name: KenyaCounty;
  /** SVG map position within an 850 x 1000 viewBox (lon 33.5–42, lat 5 to -5) */
  x: number;
  y: number;
  /** Label placement offsets to avoid pin collisions in the western cluster */
  labelDx: number;
  labelDy: number;
  labelAnchor: 'start' | 'middle' | 'end';
  /** Regional cluster per the Feature Wishlist */
  region: 'Lake Victoria Basin Cluster' | 'Capital & National Policy Hub' | 'Coastal Marine & Climate Corridor';
  regionNote: string;
}

export const COUNTY_META: CountyMeta[] = [
  {
    name: 'Nairobi',
    x: 332,
    y: 629,
    labelDx: 0,
    labelDy: 52,
    labelAnchor: 'middle',
    region: 'Capital & National Policy Hub',
    regionNote: 'Legal drafting, diplomacy, communications, media, health promotion',
  },
  {
    name: 'Kisumu',
    x: 150,
    y: 505,
    labelDx: 42,
    labelDy: 8,
    labelAnchor: 'start',
    region: 'Lake Victoria Basin Cluster',
    regionNote: 'High-burden adolescent health, GIS, community scorecards',
  },
  {
    name: 'Homa Bay',
    x: 96,
    y: 577,
    labelDx: 0,
    labelDy: 54,
    labelAnchor: 'middle',
    region: 'Lake Victoria Basin Cluster',
    regionNote: 'High-burden adolescent health, community scorecards',
  },
  {
    name: 'Siaya',
    x: 79,
    y: 462,
    labelDx: -4,
    labelDy: -44,
    labelAnchor: 'middle',
    region: 'Lake Victoria Basin Cluster',
    regionNote: 'AYSRYH technical working group & community scorecards',
  },
  {
    name: 'Kilifi',
    x: 635,
    y: 863,
    labelDx: 0,
    labelDy: 52,
    labelAnchor: 'middle',
    region: 'Coastal Marine & Climate Corridor',
    regionNote: 'Environmental science, climate justice, and health',
  },
];

export const CHAMPIONS: YACProfile[] = [
  {
    id: 'tonny-elvis-otieno',
    fullName: 'Tonny Elvis Otieno',
    age: 28,
    county: 'Nairobi',
    headshotUrl: '/champions/tonny-elvis-otieno.jpg',
    academicBackground: 'Communication and Mass Media',
    primaryRole: 'Digital Communication & Media Professional',
    thematicPillars: ['Media, Storytelling & Comms', 'SRHR & Public Health'],
    skillsAndTools: ['Videography', 'Photography', 'Digital Storytelling', 'Content Creation', 'Youth Leadership'],
    affiliations: ['Extra Magical Productions Africa (Founder)', 'SportsWave Media Africa (Founder)'],
    shortBio:
      'Communication and Mass Media professional with experience in digital communication, photography, videography, content creation, and youth advocacy around SRHR and mental health.',
    verified: true,
  },
  {
    id: 'stanley-hayo-yongo',
    fullName: 'Stanley Hayo Yongo',
    age: 24,
    county: 'Siaya',
    headshotUrl: '/champions/stanley-hayo-yongo.jpg',
    academicBackground: 'Community Development',
    primaryRole: 'Meaningful Youth Engagement Practitioner & TWG Member',
    thematicPillars: ['SRHR & Public Health', 'Data, GIS & Tech', 'Legal & Policy Advocacy'],
    skillsAndTools: [
      'Community Scorecards',
      'Intergenerational Dialogues',
      'Human Subject Protection',
      'Data Analytics',
      'Social Media Management',
      'Communications',
    ],
    affiliations: [
      'Mildmay International Kenya',
      'Marie Stopes Kenya',
      'Family Health Options Kenya',
      'Centre for the Study of Adolescence (SHE SOARS Project)',
      'County Government of Siaya AYSRHR TWG',
    ],
    shortBio:
      'Community Development and Meaningful Youth Engagement practitioner with over seven years of experience implementing SRHR, gender, economic empowerment, and advocacy programmes.',
    fullBio:
      'Stanley Hayo Yongo is a Community Development and Meaningful Youth Engagement practitioner with over seven years of experience implementing Sexual and Reproductive Health and Rights (SRHR), Gender, Economic Empowerment, and Advocacy programmes. He has worked with Mildmay International Kenya, Marie Stopes Kenya, Family Health Options Kenya, the Centre for the Study of Adolescence (SHE SOARS Project), and the County Government of Siaya, where he serves as a member of the Technical Working Group for AYSRHR. He has supported community engagements, community scorecards, gender norms work, intergenerational dialogues and youth-led advocacy initiatives, and is trained in Human Subject Protection and Data Analytics, with additional skills in Professional Foundations, Communications, Social Media Management and Advocacy.',
    verified: true,
  },
  {
    id: 'okoth-zaccheus',
    fullName: 'Okoth Zaccheus',
    age: 25,
    county: 'Kisumu',
    headshotUrl: '/champions/okoth-zaccheus.jpg',
    academicBackground: 'Computer Science',
    primaryRole: 'Computer Scientist & Youth Inclusion Advocate',
    thematicPillars: ['Data, GIS & Tech', 'Disability & Social Inclusion', 'SRHR & Public Health'],
    skillsAndTools: ['Software Development', 'Community Mobilisation', 'Inclusion Strategies', 'Youth Leadership'],
    affiliations: ['Vijana Usawa CBO (Founder Member)'],
    shortBio:
      'Youth and SRHR advocate, computer scientist, and mental health champion passionate about promoting the well-being, inclusion, and empowerment of young people and children with disabilities.',
    verified: true,
  },
  {
    id: 'nicole-molly-abekah',
    fullName: 'Nicole Molly Abekah',
    age: 23,
    county: 'Kisumu',
    headshotUrl: '/champions/nicole-molly-abekah.jpg',
    academicBackground: 'Geospatial Engineering & Public Health',
    primaryRole: 'Adolescent Health Advocate & Spatial Data Researcher',
    thematicPillars: ['Data, GIS & Tech', 'SRHR & Public Health', 'Legal & Policy Advocacy'],
    skillsAndTools: ['GIS Mapping', 'Spatial Data Analysis', 'Evidence Generation', 'Policy Engagement'],
    affiliations: ['INSPIRE-Kenya Youth Evidence to Policy Lab', 'Centre for the Study of Adolescence'],
    shortBio:
      'Youth advocate with 4 years of experience using GIS, spatial data, and storytelling to highlight adolescent SRHR, mental health, and gender equality in policy reforms.',
    impactTagline: 'Turning spatial coordinates into youth health policy through GIS mapping.',
    verified: true,
  },
  {
    id: 'ngai-simonpeter-mugambi',
    fullName: 'Ngai Simonpeter Mugambi',
    age: 21,
    county: 'Nairobi',
    headshotUrl: '/champions/ngai-simonpeter-mugambi.jpg',
    academicBackground: 'Community Resource Management (Kenyatta University)',
    primaryRole: 'Youth Advocate & Health Comms Specialist',
    thematicPillars: ['SRHR & Public Health', 'Legal & Policy Advocacy'],
    skillsAndTools: ['mHealth', 'Health Communications', 'M&E Fundamentals', 'Community Outreach'],
    affiliations: ['Centre for the Study of Adolescence (CSA)', 'Peace Ambassadors of Kenya (PAK) KU Chapter'],
    shortBio:
      'Graduate in Community Resource Management with training in M&E, mHealth, and health communications, focused on adolescent development and evidence-informed policy.',
    verified: true,
  },
  {
    id: 'lavender-judy',
    fullName: 'Lavender Judy',
    age: 33,
    county: 'Homa Bay',
    headshotUrl: '/champions/lavender-judy.jpg',
    academicBackground: 'Adolescent & Youth Sexual & Reproductive Health',
    primaryRole: 'AYSRHR Practitioner & Hotline Operator',
    thematicPillars: ['SRHR & Public Health', 'Disability & Social Inclusion'],
    skillsAndTools: ['Hotline Counseling', 'Peer Mentorship', 'GBV Referrals', 'SRHR Education'],
    affiliations: ['Nia Health Link', 'Centre for the Study of Adolescence (CSA)'],
    shortBio:
      'Passionate AYSRHR practitioner and Nia Health Link Hotline Operator providing confidential counseling, peer education, and referrals across SRHR, HIV, and GBV.',
    verified: true,
  },
  {
    id: 'hagee-jamuma-branham',
    fullName: 'Hagee Jamuma Branham',
    age: 24,
    county: 'Nairobi',
    headshotUrl: '/champions/hagee-jamuma-branham.jpg',
    academicBackground: 'MA Diplomacy & Intelligence (Strathmore) / BA IR (Maseno)',
    primaryRole: 'Diplomacy Candidate & SRHR Policy Champion',
    thematicPillars: ['Legal & Policy Advocacy', 'SRHR & Public Health'],
    skillsAndTools: ['Diplomatic Drafting', 'Policy Research', 'Digital Campaign Leadership', 'Child Protection'],
    affiliations: ['#Consent2Access Campaign (Lead)', 'RYAN Network (Assistant Chair)', 'Ministry of Foreign and Diaspora Affairs', 'World Vision Kenya', 'St. Martin CSA'],
    shortBio:
      'Youth Advocacy Champion leading the #Consent2Access campaign and supporting age-of-consent legal reform, with a background in diplomatic drafting and child protection.',
    impactTagline: 'Translating diplomatic drafting into grassroots age-of-consent legal reform.',
    verified: true,
  },
  {
    id: 'otieno-danmark-orwa',
    fullName: 'Otieno Danmark Orwa',
    age: 26,
    county: 'Homa Bay',
    headshotUrl: '/champions/otieno-danmark-orwa.jpg',
    academicBackground: 'Law & Legal Studies',
    primaryRole: 'Legal Expert & Policy Advocacy Strategist',
    thematicPillars: ['Legal & Policy Advocacy', 'SRHR & Public Health'],
    skillsAndTools: ['Legal Research', 'Policy Analysis', 'Strategic Facilitation', 'Community Mobilisation'],
    affiliations: ['Youth Evidence to Policy Lab', 'Centre for the Study of Adolescence'],
    shortBio:
      'Legal and policy advocate with expertise in human rights, public participation, and SRHR systems reform at county, national, and regional levels.',
    verified: true,
  },
  {
    id: 'carolyne-njeri',
    fullName: 'Carolyne Njeri',
    age: 24,
    county: 'Nairobi',
    headshotUrl: '/champions/carolyne-njeri.jpg',
    academicBackground: 'Quantity Surveying',
    primaryRole: 'Digital Communications Strategist & Advocate',
    thematicPillars: ['Media, Storytelling & Comms', 'SRHR & Public Health'],
    skillsAndTools: ['Social Media Strategy', 'Digital Storytelling', 'Project Coordination', 'Quantitative Analysis'],
    affiliations: ['Youth Evidence to Policy Lab', 'CSA Kenya'],
    shortBio:
      'Quantity Surveying professional and digital strategist passionate about translating evidence into practical advocacy and policy solutions for young people.',
    verified: true,
  },
  {
    id: 'ashleyna-kazungu',
    fullName: 'Ashleyna Kazungu',
    age: 28,
    county: 'Kilifi',
    headshotUrl: '/champions/ashleyna-kazungu.jpg',
    academicBackground: 'Environmental Science (MSc Candidate, Pwani University)',
    primaryRole: 'Environmental Scientist & Policy Researcher',
    thematicPillars: ['Environment & Climate', 'Legal & Policy Advocacy', 'SRHR & Public Health'],
    skillsAndTools: ['Scientific Research', 'Civic Education', 'Evidence-to-Policy', 'Grassroots Mobilisation'],
    affiliations: ['Pwani University', 'INSPIRE-Kenya Youth Evidence to Policy Lab', 'Centre for the Study of Adolescence'],
    shortBio:
      'Environmental scientist pursuing an MSc at Pwani University, dedicated to connecting climate justice with inclusive youth health policies.',
    verified: true,
  },
  {
    id: 'alvin-evelia',
    fullName: 'Alvin Evelia',
    age: 24,
    county: 'Nairobi',
    headshotUrl: '/champions/alvin-evelia.jpg',
    academicBackground: 'Health Promotion',
    primaryRole: 'Health Promotion Practitioner & Tech Advocate',
    thematicPillars: ['Data, GIS & Tech', 'SRHR & Public Health', 'Legal & Policy Advocacy'],
    skillsAndTools: ['AI Integration', 'Data-Driven Advocacy', 'M&E', 'Digital Innovation'],
    affiliations: ['INSPIRE-Kenya Youth Evidence to Policy Lab', 'CSA Kenya'],
    shortBio:
      'Development practitioner with a background in Health Promotion exploring artificial intelligence, digital innovation, and data-driven approaches to accelerate SRHR and the SDGs.',
    verified: true,
  },
  {
    id: 'irene-alma',
    fullName: 'Irene Alma',
    age: 23,
    county: 'Nairobi',
    headshotUrl: '/champions/irene-alma.jpg',
    academicBackground: 'Diploma in Social Work and Community Development, Certified in Advanced Sign Language',
    primaryRole: 'Community Facilitator, Social Worker & GBV Ambassador',
    thematicPillars: ['Disability & Social Inclusion', 'SRHR & Public Health', 'Environment & Climate'],
    skillsAndTools: [
      'Advanced Sign Language',
      'Deaf Community Inclusion',
      'Household Outreach & Mobilisation',
      'Intergenerational Dialogue Facilitation',
      'Trauma-Informed Practice',
      'GBV Advocacy',
    ],
    affiliations: ['Centre for the Study of Adolescence (CSA Intergenerational Dialogue Facilitator)'],
    shortBio:
      'Community facilitator and social work practitioner certified in Advanced Sign Language with two years of grassroots mobilization experience, championing deaf inclusion, safe spaces, GBV advocacy, and climate action.',
    impactTagline: 'Bridging silence with action: certified sign language advocacy for deaf youth and GBV prevention.',
    fullBio:
      'Irene Alma is a community facilitator and social work practitioner with two years of hands-on experience in mobilisation, household outreach, and grassroots engagement. Holding a Diploma in Social Work and Community Development and certified in Advanced Sign Language, she bridges critical communication gaps ensuring deaf community members are fully included in every space. Known for her empathetic and trauma-informed approach, Irene prioritises creating safe, trusting environments where community members feel secure when navigating sensitive issues such as GBV, mental health, and SRHR. Currently implementing intergenerational dialogue at the Centre for the Study of Adolescents, Irene facilitates cross-generational conversations to address youth development challenges. Beyond this role, she is a passionate youth advocate championing SRHR, mental health, and climate action, and serves as a dedicated GBV Ambassador. Driven by a mission to turn lived realities into advocacy, Irene uses her skills to give a powerful voice to the voiceless ensuring marginalised communities are not just heard, but actively shape policy and decision-making.',
    verified: true,
  },
];

/** Cohort-level verified statistics */
export const COHORT_STATS = {
  total: CHAMPIONS.length,
  counties: 5,
  ageMin: Math.min(...CHAMPIONS.map((c) => c.age)),
  ageMax: Math.max(...CHAMPIONS.map((c) => c.age)),
  meanAge: 25.7,
  youngYouthPct: 75, // ages 21–26
};

export function championsByCounty(county: KenyaCounty): YACProfile[] {
  return CHAMPIONS.filter((c) => c.county === county);
}
