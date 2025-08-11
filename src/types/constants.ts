export const studentColors: Record<string, string> = {
    PhDs: '#D8E4C4',
    'New PhD in 2025': '#DB9E91',
    Mphil: '#F0E68C',
    'Visiting Student': '#A78EC1',
    Visitors: '#D3D3D3',
    'Casual Staff': '#F5F5DC',
    'Research Assistant': '#FFA07A',
    HDR: '#7CB7C2',
    Other: '#ADD8E6',
  };
  
  export const mapToStudentKey: Record<string, string> = {
    accounting_finance: 'AccFin',
    economics: 'Economics',
    marketing: 'Marketing',
    'mgmt_&_orgs': 'Mgmt & Orgs',
    gf_da: 'GF-DA',
  };
  
  export const mapToContactKey: Record<string, string> = {
    accounting_finance: 'Accounting & Finance',
    economics: 'Economics',
    marketing: 'Marketing',
    'mgmt_&_orgs': 'Mgmt & Orgs',
    deanery_lvl_2: 'Deans Office',
  };
  
  export const mapToRoomLocation: Record<string, string> = {
    accounting_finance: 'AccFin',
    economics: 'Economics',
    marketing: 'Marketing',
    'mgmt_&_orgs': 'Mgmt & Orgs',
    gf_da: 'GF-DA',
    gf_csi: 'GF-CSI',
    deanery_lvl_2: 'Deans Office',
  };
  
  export const excludeRooms = new Set<string>([
    'CAFÉ',
    'Kitchen',
    'Fire Hydrant',
    'Woodside Courtyard',
    'Meeting Room',
    'Printer',
    'WC',
  ]);
  
  export const roomFormatRegexps = [
    /^[A-Z]+\d+[A-Z]*$/, // e.g. G123, G37D
    /^\d+[A-Z]$/, // e.g. 1204A
    /^\d+$/, // e.g. 177
  ];
  
  
  