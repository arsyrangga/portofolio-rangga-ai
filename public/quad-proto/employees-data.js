var QUADRA_EMPLOYEES = [
  { name:'Rina Kusuma',     email:'rina.kusuma@company.com', badge:'001228',    project:'Human Resources', pos:'Recruiter',    contract:'PKWTT',      join:'15 May 2026', status:'Active',   initials:'RK', color:'#E04A2A', salary:5500000,
    fillingStatus:'K/1', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'15 May 2026', endContract:null, duration:null, fillingStatus:'K/1', baseSalary:5500000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'15 May 2026' } ],  contractDuration:null,       overtimeType:'Based on Level',   otRate:null,      shift:'Bendi',      supervisorBadge:'000000005', attendanceLeaderBadge:'000000001', leaveApproverBadge:null, department:'HR',
    phone:'+62 856 1234 0001', nik:'3275125209950002', npwp:'23.456.789.1-023.000', dob:'12 September 1995', birthPlace:'Bekasi', gender:'Female', religion:'Islam', bloodType:'B', maritalStatus:'Single', children:0, emergencyName:'Siti Kusuma', emergencyRelation:'Parent', emergencyPhone:'+62 815 2233 4455',
    ktpAddress:'Jl. Ahmad Yani No. 12, Bekasi Timur, Jawa Barat 17113', currentAddress:'Jl. Ahmad Yani No. 12, Bekasi Timur, Jawa Barat 17113',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:75000,delivery:'1'},{id:'internet',amount:150000,delivery:'1'}],
    deductions: [{id:'bpjs-kes',paidBy:'personal'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}] },

  { name:'Budi Santoso',    email:'budi.s@steradian.id',    badge:'000000001', project:'QuadraNG',        pos:'Senior Staff', contract:'PKWTT',      join:'15 Jan 2021', status:'Active',   initials:'BS', color:'#E04A2A', salary:9000000,
    fillingStatus:'K/1', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'15 Jan 2021', endContract:null, duration:null, fillingStatus:'K/1', baseSalary:9000000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'15 Jan 2021' } ],  contractDuration:null,       overtimeType:'Specific Amount',  otRate:75000,     shift:'Bendi',      supervisorBadge:'000000003', attendanceLeaderBadge:null, leaveApproverBadge:'000000006', department:'Engineering',
    phone:'+62 812 3456 7890', nik:'3174012345678901', npwp:'12.345.678.9-012.000', dob:'15 March 1990', birthPlace:'Jakarta', gender:'Male', religion:'Islam', bloodType:'O', maritalStatus:'Married', children:1, emergencyName:'Dewi Santoso', emergencyRelation:'Spouse', emergencyPhone:'+62 813 9876 5432',
    ktpAddress:'Jl. Sudirman No. 45, RT 003/RW 007, Tanah Abang, Jakarta Pusat, DKI Jakarta 10250', currentAddress:'Jl. Sudirman No. 45, RT 003/RW 007, Tanah Abang, Jakarta Pusat, DKI Jakarta 10250',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:100000,delivery:'1'},{id:'internet',amount:200000,delivery:'1'},{id:'skills',amount:350000,delivery:'15'}],
    deductions: [{id:'bpjs-kes',paidBy:'personal'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}],
    scheduledSalary: { amount:9750000, effectiveDate:'1 Jul 2026', recordedDate:'20 May 2026', recordedBy:'Ahmad Fauzi' } },

  { name:'Dewi Rahayu',     email:'dewi.r@steradian.id',    badge:'000000002', project:'QuadraNG',        pos:'Staff',        contract:'PKWTT',      join:'03 Mar 2022', status:'Active',   initials:'DR', color:'#3B82F6', salary:6000000,
    fillingStatus:'TK/0', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'03 Mar 2022', endContract:null, duration:null, fillingStatus:'TK/0', baseSalary:6000000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'03 Mar 2022' } ],  contractDuration:null,       overtimeType:'Based on Level',   otRate:null,      shift:'Bendi',      supervisorBadge:'000000001', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Engineering',
    phone:'+62 813 2345 0002', nik:'3273226207930003', npwp:'34.567.891.2-034.000', dob:'22 July 1993', birthPlace:'Bandung', gender:'Female', religion:'Kristen Protestan', bloodType:'A', maritalStatus:'Single', children:0, emergencyName:'Agus Rahayu', emergencyRelation:'Parent', emergencyPhone:'+62 812 1122 3344',
    ktpAddress:'Jl. Braga No. 8, Bandung Wetan, Jawa Barat 40111', currentAddress:'Jl. Braga No. 8, Bandung Wetan, Jawa Barat 40111',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:75000,delivery:'1'},{id:'internet',amount:150000,delivery:'1'}],
    deductions: [{id:'bpjs-kes',paidBy:'personal'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}] },

  { name:'Ahmad Fauzi',     email:'ahmad.f@steradian.id',   badge:'000000003', project:'Planex',          pos:'Manager',      contract:'PKWTT',      join:'10 Jul 2020', status:'Active',   initials:'AF', color:'#8B5CF6', salary:15000000,
    fillingStatus:'K/2', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'10 Jul 2020', endContract:null, duration:null, fillingStatus:'K/2', baseSalary:15000000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'10 Jul 2020' } ],  contractDuration:null,       overtimeType:'Specific Amount',  otRate:120000,    shift:'Bendi',      supervisorBadge:'000000005', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Operations',
    phone:'+62 814 3456 0003', nik:'3578030311850004', npwp:'45.678.912.3-045.000', dob:'3 November 1985', birthPlace:'Surabaya', gender:'Male', religion:'Islam', bloodType:'AB', maritalStatus:'Married', children:2, emergencyName:'Nur Fauzi', emergencyRelation:'Spouse', emergencyPhone:'+62 811 5566 7788',
    ktpAddress:'Jl. Diponegoro No. 21, Surabaya, Jawa Timur 60241', currentAddress:'Jl. Diponegoro No. 21, Surabaya, Jawa Timur 60241',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:150000,delivery:'1'},{id:'internet',amount:300000,delivery:'1'},{id:'leader',amount:1000000,delivery:'1'},{id:'skills',amount:500000,delivery:'15'}],
    deductions: [{id:'bpjs-kes',paidBy:'company'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}],
    scheduledSalary: { amount:16500000, effectiveDate:'1 Aug 2026', recordedDate:'10 Jun 2026', recordedBy:'Rudi Hartono' } },

  { name:'Siti Nurhaliza',  email:'siti.n@steradian.id',    badge:'000000004', project:'NDS',             pos:'Junior Staff', contract:'PKWT',       join:'01 Feb 2024', status:'Active',   initials:'SN', color:'#22C55E', salary:4000000,
    fillingStatus:'TK/0', contractHistory:[ { type:'contract', workType:'PKWT', startContract:'01 Feb 2024', endContract:'02 Sep 2026', duration:'12 months', fillingStatus:'TK/0', baseSalary:4000000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'01 Feb 2024' } ],  contractDuration:'12 months', overtimeType:'Based on Level',   otRate:null,      shift:'NDS',        supervisorBadge:'000000005', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Engineering',
    phone:'+62 815 4567 0004', nik:'3471045802990005', npwp:'56.789.123.4-056.000', dob:'18 February 1999', birthPlace:'Yogyakarta', gender:'Female', religion:'Islam', bloodType:'O', maritalStatus:'Single', children:0, emergencyName:'Ani Nurhaliza', emergencyRelation:'Parent', emergencyPhone:'+62 817 3344 5566',
    ktpAddress:'Jl. Malioboro No. 5, Yogyakarta 55213', currentAddress:'Jl. Malioboro No. 5, Yogyakarta 55213',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:50000,delivery:'1'}],
    deductions: [{id:'bpjs-kes',paidBy:'personal'},{id:'bpjs-tk',paidBy:'personal'}] },

  { name:'Rudi Hartono',    email:'rudi.h@steradian.id',    badge:'000000005', project:'CRM',             pos:'Director',     contract:'PKWTT',      join:'12 Jun 2019', status:'Active',   initials:'RH', color:'#F59E0B', salary:22000000,
    fillingStatus:'K/3', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'12 Jun 2019', endContract:null, duration:null, fillingStatus:'K/3', baseSalary:22000000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'12 Jun 2019' } ],  contractDuration:null,       overtimeType:'Specific Amount',  otRate:180000,    shift:'Bendi',      supervisorBadge:null, attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Marketing',
    phone:'+62 816 5678 0005', nik:'3374080806780006', npwp:'67.891.234.5-067.000', dob:'8 June 1978', birthPlace:'Semarang', gender:'Male', religion:'Kristen Katolik', bloodType:'B', maritalStatus:'Married', children:3, emergencyName:'Lina Hartono', emergencyRelation:'Spouse', emergencyPhone:'+62 818 6677 8899',
    ktpAddress:'Jl. Pandanaran No. 30, Semarang, Jawa Tengah 50134', currentAddress:'Jl. Pandanaran No. 30, Semarang, Jawa Tengah 50134',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:150000,delivery:'1'},{id:'internet',amount:350000,delivery:'1'},{id:'leader',amount:2000000,delivery:'1'},{id:'skills',amount:500000,delivery:'15'}],
    deductions: [{id:'bpjs-kes',paidBy:'company'},{id:'bpjs-tk',paidBy:'company'},{id:'pph21',paidBy:'personal'}] },

  { name:'Putri Anggraini', email:'putri.a@steradian.id',   badge:'000000006', project:'QuadraNG',        pos:'Staff',        contract:'PKWTT',      join:'20 Aug 2022', status:'Active',   initials:'PA', color:'#EC4899', salary:6500000,
    fillingStatus:'TK/0', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'20 Aug 2022', endContract:null, duration:null, fillingStatus:'TK/0', baseSalary:6500000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'20 Aug 2022' } ],  contractDuration:null,       overtimeType:'Based on Level',   otRate:null,      shift:'Ops Console', supervisorBadge:'000000001', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Engineering',
    phone:'+62 817 6789 0006', nik:'3174050504940007', npwp:'78.912.345.6-078.000', dob:'5 April 1994', birthPlace:'Jakarta', gender:'Female', religion:'Islam', bloodType:'A', maritalStatus:'Married', children:1, emergencyName:'Rian Anggraini', emergencyRelation:'Spouse', emergencyPhone:'+62 819 7788 9900',
    ktpAddress:'Jl. Kemang Raya No. 17, Jakarta Selatan, DKI Jakarta 12730', currentAddress:'Jl. Kemang Raya No. 17, Jakarta Selatan, DKI Jakarta 12730',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:75000,delivery:'1'},{id:'internet',amount:150000,delivery:'1'}],
    deductions: [{id:'bpjs-kes',paidBy:'personal'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}] },

  { name:'Dimas Pratama',   email:'dimas.p@steradian.id',   badge:'000000007', project:'NDS',             pos:'Junior Staff', contract:'Freelance',  join:'15 Nov 2024', status:'Active',   initials:'DP', color:'#06B6D4', salary:3500000,
    fillingStatus:'TK/0', contractHistory:[ { type:'contract', workType:'Freelance', startContract:'15 Nov 2024', endContract:null, duration:null, fillingStatus:'TK/0', baseSalary:3500000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'15 Nov 2024' } ],  contractDuration:null,       overtimeType:'No Overtime',      otRate:null,      shift:'NDS',        supervisorBadge:'000000005', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Engineering',
    phone:'+62 818 7890 0007', nik:'3276303010990008', npwp:'89.123.456.7-089.000', dob:'30 October 1999', birthPlace:'Depok', gender:'Male', religion:'Islam', bloodType:'O', maritalStatus:'Single', children:0, emergencyName:'Sri Pratama', emergencyRelation:'Parent', emergencyPhone:'+62 821 8899 0011',
    ktpAddress:'Jl. Margonda Raya No. 100, Depok, Jawa Barat 16424', currentAddress:'Jl. Margonda Raya No. 100, Depok, Jawa Barat 16424',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'}],
    deductions: [] },

  { name:'Rina Kusuma',     email:'rina.k@steradian.id',    badge:'000000008', project:'CRM',             pos:'Senior Staff', contract:'PKWTT',      join:'08 Apr 2021', status:'Active',   initials:'RK', color:'#10B981', salary:9500000,
    fillingStatus:'K/1', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'08 Apr 2021', endContract:null, duration:null, fillingStatus:'K/1', baseSalary:9500000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'08 Apr 2021' } ],  contractDuration:null,       overtimeType:'Based on Level',   otRate:null,      shift:'Ops Console', supervisorBadge:'000000005', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Marketing',
    phone:'+62 819 8901 0008', nik:'3173141401910009', npwp:'90.234.567.8-090.000', dob:'14 January 1991', birthPlace:'Jakarta', gender:'Female', religion:'Buddha', bloodType:'B', maritalStatus:'Married', children:2, emergencyName:'Hendra Kusuma', emergencyRelation:'Spouse', emergencyPhone:'+62 822 9900 1122',
    ktpAddress:'Jl. Gajah Mada No. 88, Jakarta Barat, DKI Jakarta 11130', currentAddress:'Jl. Gajah Mada No. 88, Jakarta Barat, DKI Jakarta 11130',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:100000,delivery:'1'},{id:'internet',amount:200000,delivery:'1'},{id:'skills',amount:350000,delivery:'15'}],
    deductions: [{id:'bpjs-kes',paidBy:'personal'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}],
    scheduledSalary: { amount:10500000, effectiveDate:'1 Sep 2026', recordedDate:'5 Jun 2026', recordedBy:'Rudi Hartono' } },

  { name:'Hendra Wijaya',   email:'hendra.w@steradian.id',  badge:'000000009', project:'Ops Console',     pos:'Staff',        contract:'PKWT',       join:'05 Sep 2020', status:'Inactive', initials:'HW', color:'#F97316', salary:7000000,
    fillingStatus:'K/1', contractHistory:[ { type:'contract', workType:'PKWT', startContract:'05 Sep 2020', endContract:'04 Sep 2022', duration:'24 months', fillingStatus:'K/1', baseSalary:7000000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'05 Sep 2020' } ],  contractDuration:'24 months', overtimeType:'Based on Level',   otRate:null,      shift:'Ops Console', supervisorBadge:'000000005', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Operations',
    phone:'+62 820 9012 0009', nik:'3173252512880010', npwp:'01.345.678.9-001.000', dob:'25 December 1988', birthPlace:'Jakarta', gender:'Male', religion:'Islam', bloodType:'A', maritalStatus:'Married', children:2, emergencyName:'Wati Wijaya', emergencyRelation:'Spouse', emergencyPhone:'+62 823 0011 2233',
    ktpAddress:'Jl. Kebon Jeruk No. 40, Jakarta Barat, DKI Jakarta 11530', currentAddress:'Jl. Kebon Jeruk No. 40, Jakarta Barat, DKI Jakarta 11530',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'on-site',amount:75000,delivery:'1'},{id:'internet',amount:150000,delivery:'1'}],
    deductions: [{id:'bpjs-kes',paidBy:'spouse'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}] },

  { name:'Maya Sari',       email:'maya.s@steradian.id',    badge:'000000010', project:'QuadraNG',        pos:'Intern',       contract:'Internship', join:'01 Mar 2025', status:'Active',   initials:'MS', color:'#6366F1', salary:2500000,
    fillingStatus:'TK/0', contractHistory:[],  contractDuration:'6 months',  overtimeType:'No Overtime',      otRate:null,      shift:'Bendi',      supervisorBadge:'000000001', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Engineering',
    phone:'+62 821 0123 0010', nik:'3174090908030011', npwp:'12.456.789.0-012.000', dob:'9 August 2003', birthPlace:'Jakarta', gender:'Female', religion:'Hindu', bloodType:'O', maritalStatus:'Single', children:0, emergencyName:'Wayan Sari', emergencyRelation:'Parent', emergencyPhone:'+62 824 1122 3344',
    ktpAddress:'Jl. Panglima Polim No. 25, Jakarta Selatan, DKI Jakarta 12160', currentAddress:'Jl. Panglima Polim No. 25, Jakarta Selatan, DKI Jakarta 12160',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'}],
    deductions: [] },

  { name:'Nadia Puspita',   email:'nadia.p@steradian.id',   badge:'000000011', project:'Finance',         pos:'Finance Officer', contract:'PKWTT',    join:'01 Jun 2023', status:'Active',   initials:'NP', color:'#14B8A6', salary:7000000,
    fillingStatus:'TK/0', contractHistory:[ { type:'contract', workType:'PKWTT', startContract:'01 Jun 2023', endContract:null, duration:null, fillingStatus:'TK/0', baseSalary:7000000, contractDocFileName:null, skFileName:null, note:'Initial contract (seed data)', recordedBy:'HR Admin', recordedDate:'01 Jun 2023' } ],  contractDuration:null,       overtimeType:'Based on Level',   otRate:null,      shift:'Bendi',      supervisorBadge:'000000005', attendanceLeaderBadge:null, leaveApproverBadge:null, department:'Finance',
    phone:'+62 878 5566 0011', nik:'3174056001950012', npwp:'34.567.890.1-034.000', dob:'6 January 1995', birthPlace:'Bandung', gender:'Female', religion:'Islam', bloodType:'A', maritalStatus:'Single', children:0, emergencyName:'Puspita Wardani', emergencyRelation:'Parent', emergencyPhone:'+62 878 1122 9900',
    ktpAddress:'Jl. Dago No. 88, Coblong, Bandung, Jawa Barat 40135', currentAddress:'Jl. Dago No. 88, Coblong, Bandung, Jawa Barat 40135',
    allowances: [{id:'laptop',amount:1500000,delivery:'1'},{id:'internet',amount:150000,delivery:'1'}],
    deductions: [{id:'bpjs-kes',paidBy:'personal'},{id:'bpjs-tk',paidBy:'personal'},{id:'pph21',paidBy:'personal'}] },
];

/* Apply any per-employee status overrides (quadra_status_override_<badge>)
   right here, once, centrally — instead of every consuming page (employee
   list/detail, payroll creation, leave, etc.) needing its own copy of this
   same lookup. offboarding-checklist.html writes this key once an
   employee's offboarding checklist is fully completed; every page that
   loads employees-data.js and reads emp.status — including status-based
   filters like payroll-create-single.html's "Active employees only" —
   picks up the change automatically. */
(function() {
  QUADRA_EMPLOYEES.forEach(function(e) {
    try {
      var ov = JSON.parse(localStorage.getItem('quadra_status_override_' + e.badge));
      if (ov && ov.status) e.status = ov.status;
    } catch (err) {}
  });
})();
