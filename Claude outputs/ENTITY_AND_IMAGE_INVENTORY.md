# TRINETRA — Complete Entity & Image Asset Inventory

This document was generated directly from the live codebase at `/home/claude/trinetra2` — every ID, name, and filename below was extracted by importing the actual data modules (`src/data/**`) and the actual `src/config/imageAssets.ts` helpers the app calls, then cross-referenced against every real call site of those helpers in `src/pages/**` and `src/components/**` (confirmed by grepping the whole `src/` tree for `personImage(`, `locationImage(`, `vehicleImage(`, `documentImage(`, `evidenceImage(`, `cctvFrameImage(`, and `caseCoverImage(` — 21 call sites total, listed in full in the Final Verification section). Nothing here was inferred from screenshots, prior conversation, or assumption. No file in this repo was modified to produce this report.

---

## 1. Total Entity Counts

| Category | Count | Source file(s) |
|---|---|---|
| Cases | 5 | `src/data/cases/mockCases.ts` |
| People | 54 | `src/data/entities/mockPersons.ts + caseBundles.ts` |
| Organizations | 11 | `src/data/entities/mockOrganizations.ts + caseBundles.ts` |
| Locations | 39 | `src/data/entities/mockLocations.ts + caseBundles.ts` |
| Vehicles | 20 | `src/data/entities/mockVehicles.ts + caseBundles.ts` |
| Phones | 55 | `src/data/entities/mockPhones.ts + caseBundles.ts` |
| Devices | 9 | `src/data/entities/mockOrganizations.ts (mockDevices) + caseBundles.ts` |
| Financial Accounts | 27 | `src/data/entities/mockOrganizations.ts (mockAccounts) + caseBundles.ts` |
| Documents | 17 | `src/data/entities/mockOrganizations.ts (mockDocuments) + caseBundles.ts` |
| CCTV Cameras (defined) | 32 | `src/data/cctv/mockCameras.ts + caseBundles.ts` |
| CCTV Cameras (actually rendered — have ≥1 event) | 29 | `computed: cctvService.listCameras()` |
| CCTV Events | 55 | `src/data/cctv/mockCctvEvents.ts + caseBundles.ts` |
| Face Recognition Detections | 22 | `src/data/face/mockFace.ts + caseBundles.ts` |
| Social Media Profiles | 21 | `src/data/social/mockSocial.ts + caseBundles.ts` |
| Criminal Records / FIRs | 16 | `src/data/financial/mockFinancial.ts + caseBundles.ts` |
| Evidence Items (all types incl. forensic) | 32 | `src/data/evidence/mockEvidence.ts + caseBundles.ts` |

---

## 2. Complete People List (54)

| # | Person Name | Entity ID | Cases | Image Required? | Exact Image Filename |
|---|---|---|---|---|---|
| 1 | Arjun Malhotra — PRIMARY SUBJECT | `P-0042` | OP-001 | Yes | `arjun-malhotra-p-0042.jpg` |
| 2 | Rajat Verma — ASSOCIATE | `P-0043` | OP-001 | Yes | `rajat-verma-p-0043.jpg` |
| 3 | Priyanka Nair — ASSOCIATE | `P-0044` | OP-001 | Yes | `priyanka-nair-p-0044.jpg` |
| 4 | Unidentified Male (UNKNOWN_07) — UNRESOLVED | `P-0045` | OP-001 | Yes | `unidentified-male-unknown-07-p-0045.jpg` |
| 5 | Vikram Singh Rathore — ORGANIZATION CONTACT | `P-0046` | OP-001 | Yes | `vikram-singh-rathore-p-0046.jpg` |
| 6 | Sana Ali — FINANCIAL MULE | `P-0047` | OP-001 | Yes | `sana-ali-p-0047.jpg` |
| 7 | Deepak Chauhan — DRIVER | `P-0048` | OP-001 | Yes | `deepak-chauhan-p-0048.jpg` |
| 8 | Swati Thakur — PRIMARY SUBJECT | `P-002-001` | OP-002 | Yes | `swati-thakur-p-002-001.jpg` |
| 9 | Manish Bhatt — ASSOCIATE | `P-002-002` | OP-002 | Yes | `manish-bhatt-p-002-002.jpg` |
| 10 | Meera Bose — ASSOCIATE | `P-002-003` | OP-002 | Yes | `meera-bose-p-002-003.jpg` |
| 11 | Sanjay Desai — ASSOCIATE | `P-002-004` | OP-002 | Yes | `sanjay-desai-p-002-004.jpg` |
| 12 | Naveen Khan — ASSOCIATE | `P-002-005` | OP-002 | Yes | `naveen-khan-p-002-005.jpg` |
| 13 | Rohit Iyer — ASSOCIATE | `P-002-006` | OP-002 | Yes | `rohit-iyer-p-002-006.jpg` |
| 14 | Anjali Singh Rathore — ASSOCIATE | `P-002-007` | OP-002 | Yes | `anjali-singh-rathore-p-002-007.jpg` |
| 15 | Harpreet Khan — ASSOCIATE | `P-002-008` | OP-002 | Yes | `harpreet-khan-p-002-008.jpg` |
| 16 | Swati Verma — PRIMARY SUBJECT | `P-003-001` | OP-003 | Yes | `swati-verma-p-003-001.jpg` |
| 17 | Sanjay Kapoor — ASSOCIATE | `P-003-002` | OP-003 | Yes | `sanjay-kapoor-p-003-002.jpg` |
| 18 | Gaurav Desai — ASSOCIATE | `P-003-003` | OP-003 | Yes | `gaurav-desai-p-003-003.jpg` |
| 19 | Tarun Chauhan — ASSOCIATE | `P-003-004` | OP-003 | Yes | `tarun-chauhan-p-003-004.jpg` |
| 20 | Pooja Naidu — ASSOCIATE | `P-003-005` | OP-003 | Yes | `pooja-naidu-p-003-005.jpg` |
| 21 | Aslam Thakur — ASSOCIATE | `P-003-006` | OP-003 | Yes | `aslam-thakur-p-003-006.jpg` |
| 22 | Deepak Desai — ASSOCIATE | `P-003-007` | OP-003 | Yes | `deepak-desai-p-003-007.jpg` |
| 23 | Manish Sharma — ASSOCIATE | `P-003-008` | OP-003 | Yes | `manish-sharma-p-003-008.jpg` |
| 24 | Ravi Thakur — ASSOCIATE | `P-003-009` | OP-003 | Yes | `ravi-thakur-p-003-009.jpg` |
| 25 | Ajay Chowdhury — ASSOCIATE | `P-003-010` | OP-003 | Yes | `ajay-chowdhury-p-003-010.jpg` |
| 26 | Sanjay Desai — ASSOCIATE | `P-003-011` | OP-003 | Yes | `sanjay-desai-p-003-011.jpg` |
| 27 | Aslam Chauhan — ASSOCIATE | `P-003-012` | OP-003 | Yes | `aslam-chauhan-p-003-012.jpg` |
| 28 | Gaurav Singh Rathore — ASSOCIATE | `P-003-013` | OP-003 | Yes | `gaurav-singh-rathore-p-003-013.jpg` |
| 29 | Priyanka Sharma — ASSOCIATE | `P-003-014` | OP-003 | Yes | `priyanka-sharma-p-003-014.jpg` |
| 30 | Naveen Joshi — ASSOCIATE | `P-003-015` | OP-003 | Yes | `naveen-joshi-p-003-015.jpg` |
| 31 | Gaurav Khan — ASSOCIATE | `P-003-016` | OP-003 | Yes | `gaurav-khan-p-003-016.jpg` |
| 32 | Ravi Ali — ASSOCIATE | `P-003-017` | OP-003 | Yes | `ravi-ali-p-003-017.jpg` |
| 33 | Irfan Mehta — ASSOCIATE | `P-003-018` | OP-003 | Yes | `irfan-mehta-p-003-018.jpg` |
| 34 | Neha Rana — ASSOCIATE | `P-003-019` | OP-003 | Yes | `neha-rana-p-003-019.jpg` |
| 35 | Ayesha Mehta — ASSOCIATE | `P-003-020` | OP-003 | Yes | `ayesha-mehta-p-003-020.jpg` |
| 36 | Divya Joshi — ASSOCIATE | `P-003-021` | OP-003 | Yes | `divya-joshi-p-003-021.jpg` |
| 37 | Zaid Reddy — ASSOCIATE | `P-003-022` | OP-003 | Yes | `zaid-reddy-p-003-022.jpg` |
| 38 | Kavita Mehta — ASSOCIATE | `P-003-023` | OP-003 | Yes | `kavita-mehta-p-003-023.jpg` |
| 39 | Sunita Sheikh — PRIMARY SUBJECT | `P-004-001` | OP-004 | Yes | `sunita-sheikh-p-004-001.jpg` |
| 40 | Rajat Mehta — ASSOCIATE | `P-004-002` | OP-004 | Yes | `rajat-mehta-p-004-002.jpg` |
| 41 | Amit Kapoor — ASSOCIATE | `P-004-003` | OP-004 | Yes | `amit-kapoor-p-004-003.jpg` |
| 42 | Kiran Menon — ASSOCIATE | `P-004-004` | OP-004 | Yes | `kiran-menon-p-004-004.jpg` |
| 43 | Deepak Verma — ASSOCIATE | `P-004-005` | OP-004 | Yes | `deepak-verma-p-004-005.jpg` |
| 44 | Rakesh Ali — ASSOCIATE | `P-004-006` | OP-004 | Yes | `rakesh-ali-p-004-006.jpg` |
| 45 | Rohit Menon — PRIMARY SUBJECT | `P-005-001` | OP-005 | Yes | `rohit-menon-p-005-001.jpg` |
| 46 | Anil Chauhan — ASSOCIATE | `P-005-002` | OP-005 | Yes | `anil-chauhan-p-005-002.jpg` |
| 47 | Arjun Chowdhury — ASSOCIATE | `P-005-003` | OP-005 | Yes | `arjun-chowdhury-p-005-003.jpg` |
| 48 | Sanjay Chauhan — ASSOCIATE | `P-005-004` | OP-005 | Yes | `sanjay-chauhan-p-005-004.jpg` |
| 49 | Salman Pillai — ASSOCIATE | `P-005-005` | OP-005 | Yes | `salman-pillai-p-005-005.jpg` |
| 50 | Harpreet Pillai — ASSOCIATE | `P-005-006` | OP-005 | Yes | `harpreet-pillai-p-005-006.jpg` |
| 51 | Nargis Iyer — ASSOCIATE | `P-005-007` | OP-005 | Yes | `nargis-iyer-p-005-007.jpg` |
| 52 | Zara Verma — ASSOCIATE | `P-005-008` | OP-005 | Yes | `zara-verma-p-005-008.jpg` |
| 53 | Suresh Iyer — ASSOCIATE | `P-005-009` | OP-005 | Yes | `suresh-iyer-p-005-009.jpg` |
| 54 | Priyanka Bhatt — ASSOCIATE | `P-005-010` | OP-005 | Yes | `priyanka-bhatt-p-005-010.jpg` |

---

## 3. Complete Organizations List (11)

No image helper exists for organizations in `imageAssets.ts`, and no component renders an organization image anywhere — Network Graph shows a generic `Building2` icon (`EntityDetails.tsx`), Financial/Evidence/Alerts show plain text. **No image required for any organization.**

| # | Organization | Entity ID | Cases | Image Required? |
|---|---|---|---|---|
| 1 | Meridian Freight Logistics | `ORG-01` | OP-001 | No — icon/text only |
| 2 | Konnect Traders Pvt Ltd | `ORG-02` | OP-001 | No — icon/text only |
| 3 | Konkan Blue Marine Pvt Ltd | `ORG-002-01` | OP-002 | No — icon/text only |
| 4 | Sahyadri Coastal Traders | `ORG-002-02` | OP-002 | No — icon/text only |
| 5 | Northstar Realty Ventures | `ORG-003-01` | OP-003 | No — icon/text only |
| 6 | Chandra Buildwell Pvt Ltd | `ORG-003-02` | OP-003 | No — icon/text only |
| 7 | Apex Benami Holdings | `ORG-003-03` | OP-003 | No — icon/text only |
| 8 | Zenlite BPO Services | `ORG-004-01` | OP-004 | No — icon/text only |
| 9 | Quickpay Fintech Solutions | `ORG-004-02` | OP-004 | No — icon/text only |
| 10 | Thar Logistics & Carriers | `ORG-005-01` | OP-005 | No — icon/text only |
| 11 | Rann Exim Trading Co. | `ORG-005-02` | OP-005 | No — icon/text only |

---

## 4. Complete Locations List (39)

Every location below can be rendered as an image in two places: the Locations page detail panel (`LocationDetailPanel.tsx`) and the Network Graph entity detail panel (`EntityDetails.tsx`) — both call `locationImage(id, name)`.

| # | Location Name | Entity ID | City/Region | Cases | Image Required? | Exact Image Filename |
|---|---|---|---|---|---|---|
| 1 | Bandra West | `loc-001` | Mumbai | OP-001 | Yes | `bandra-west-loc-001.jpg` |
| 2 | Andheri East | `loc-002` | Mumbai | OP-001 | Yes | `andheri-east-loc-002.jpg` |
| 3 | Lower Parel | `loc-003` | Mumbai | OP-001 | Yes | `lower-parel-loc-003.jpg` |
| 4 | Colaba | `loc-004` | Mumbai | OP-001 | Yes | `colaba-loc-004.jpg` |
| 5 | Malad West | `loc-005` | Mumbai | OP-001 | Yes | `malad-west-loc-005.jpg` |
| 6 | Chembur | `loc-006` | Mumbai | OP-001 | Yes | `chembur-loc-006.jpg` |
| 7 | Powai | `loc-007` | Mumbai | OP-001, OP-002 | Yes | `powai-loc-007.jpg` |
| 8 | Dockyard Road | `loc-008` | Mumbai | OP-001, OP-002 | Yes | `dockyard-road-loc-008.jpg` |
| 9 | Kurla | `loc-009` | Mumbai | OP-001, OP-002 | Yes | `kurla-loc-009.jpg` |
| 10 | Vashi | `loc-010` | Mumbai | OP-001, OP-002 | Yes | `vashi-loc-010.jpg` |
| 11 | Pune | `loc-city-01` | Pune | OP-002, OP-003 | Yes | `pune-loc-city-01.jpg` |
| 12 | Nashik | `loc-city-02` | Nashik | OP-002, OP-003 | Yes | `nashik-loc-city-02.jpg` |
| 13 | Thane | `loc-city-03` | Thane | OP-002, OP-003 | Yes | `thane-loc-city-03.jpg` |
| 14 | Surat | `loc-city-04` | Surat | OP-002, OP-003 | Yes | `surat-loc-city-04.jpg` |
| 15 | Ahmedabad | `loc-city-05` | Ahmedabad | OP-002, OP-003 | Yes | `ahmedabad-loc-city-05.jpg` |
| 16 | Delhi | `loc-city-06` | Delhi | OP-002, OP-003 | Yes | `delhi-loc-city-06.jpg` |
| 17 | Nagpur | `loc-city-07` | Nagpur | OP-002, OP-003 | Yes | `nagpur-loc-city-07.jpg` |
| 18 | Ratnagiri Fishing Harbour | `LOC-002-01` | Ratnagiri | OP-002 | Yes | `ratnagiri-fishing-harbour-loc-002-01.jpg` |
| 19 | Malvan Jetty | `LOC-002-02` | Malvan | OP-002 | Yes | `malvan-jetty-loc-002-02.jpg` |
| 20 | Vengurla Creek | `LOC-002-03` | Vengurla | OP-002 | Yes | `vengurla-creek-loc-002-03.jpg` |
| 21 | Devgad Market Road | `LOC-002-04` | Devgad | OP-002 | Yes | `devgad-market-road-loc-002-04.jpg` |
| 22 | Guhagar Residency | `LOC-002-05` | Guhagar | OP-002 | Yes | `guhagar-residency-loc-002-05.jpg` |
| 23 | Sawantwadi Transit Yard | `LOC-002-06` | Sawantwadi | OP-002 | Yes | `sawantwadi-transit-yard-loc-002-06.jpg` |
| 24 | Connaught Place | `LOC-003-01` | Connaught | OP-003 | Yes | `connaught-place-loc-003-01.jpg` |
| 25 | Gurugram Cyber Hub | `LOC-003-02` | Gurugram | OP-003 | Yes | `gurugram-cyber-hub-loc-003-02.jpg` |
| 26 | Noida Sector 62 | `LOC-003-03` | Noida | OP-003 | Yes | `noida-sector-62-loc-003-03.jpg` |
| 27 | Chandigarh Sector 17 | `LOC-003-04` | Chandigarh | OP-003 | Yes | `chandigarh-sector-17-loc-003-04.jpg` |
| 28 | Jaipur Vaishali Nagar | `LOC-003-05` | Jaipur | OP-003 | Yes | `jaipur-vaishali-nagar-loc-003-05.jpg` |
| 29 | Faridabad Industrial Estate | `LOC-003-06` | Faridabad | OP-003 | Yes | `faridabad-industrial-estate-loc-003-06.jpg` |
| 30 | Sonipat Warehouse Cluster | `LOC-003-07` | Sonipat | OP-003 | Yes | `sonipat-warehouse-cluster-loc-003-07.jpg` |
| 31 | Hinjewadi IT Park | `LOC-004-01` | Hinjewadi | OP-004 | Yes | `hinjewadi-it-park-loc-004-01.jpg` |
| 32 | Nagpur Civil Lines | `LOC-004-02` | Nagpur | OP-004 | Yes | `nagpur-civil-lines-loc-004-02.jpg` |
| 33 | Pune Camp | `LOC-004-03` | Pune | OP-004 | Yes | `pune-camp-loc-004-03.jpg` |
| 34 | Jodhpur Transport Nagar | `LOC-005-01` | Jodhpur | OP-005 | Yes | `jodhpur-transport-nagar-loc-005-01.jpg` |
| 35 | Barmer Border Checkpost | `LOC-005-02` | Barmer | OP-005 | Yes | `barmer-border-checkpost-loc-005-02.jpg` |
| 36 | Kandla Port | `LOC-005-03` | Kandla | OP-005 | Yes | `kandla-port-loc-005-03.jpg` |
| 37 | Bhuj Industrial Area | `LOC-005-04` | Bhuj | OP-005 | Yes | `bhuj-industrial-area-loc-005-04.jpg` |
| 38 | Ahmedabad Naroda GIDC | `LOC-005-05` | Ahmedabad | OP-005 | Yes | `ahmedabad-naroda-gidc-loc-005-05.jpg` |
| 39 | Jaisalmer Transit Camp | `LOC-005-06` | Jaisalmer | OP-005 | Yes | `jaisalmer-transit-camp-loc-005-06.jpg` |

---

## 5. Complete Vehicles List (20)

`vehicleImage()` is defined in `imageAssets.ts` but **has zero call sites anywhere in `src/`** — confirmed by grep. There is no vehicle detail view in the app. **No image is currently requested for any vehicle**, regardless of what files exist in `public/images/vehicles/`.

| # | Vehicle / Registration | Entity ID | Cases | Image Required? | Exact Image Filename (if ever wired) |
|---|---|---|---|---|---|
| 1 | MH-02-CQ-4521 | `VEH-01` | OP-001 | No — not rendered anywhere | `mh-02-cq-4521-veh-01.jpg` |
| 2 | MH-04-BT-7712 | `VEH-02` | OP-001 | No — not rendered anywhere | `mh-04-bt-7712-veh-02.jpg` |
| 3 | MH-01-AX-9081 | `VEH-03` | OP-001 | No — not rendered anywhere | `mh-01-ax-9081-veh-03.jpg` |
| 4 | MH-43-K-3320 (Freight Truck) | `VEH-04` | OP-001 | No — not rendered anywhere | `mh-43-k-3320-veh-04.jpg` |
| 5 | MH-25-XA-3531 | `VEH-002-01` | OP-002 | No — not rendered anywhere | `mh-25-xa-3531-veh-002-01.jpg` |
| 6 | MH-25-DC-9391 | `VEH-002-02` | OP-002 | No — not rendered anywhere | `mh-25-dc-9391-veh-002-02.jpg` |
| 7 | MH-04-XB-9215 | `VEH-002-03` | OP-002 | No — not rendered anywhere | `mh-04-xb-9215-veh-002-03.jpg` |
| 8 | DL-14-BA-8027 | `VEH-003-01` | OP-003 | No — not rendered anywhere | `dl-14-ba-8027-veh-003-01.jpg` |
| 9 | DL-19-KD-7325 | `VEH-003-02` | OP-003 | No — not rendered anywhere | `dl-19-kd-7325-veh-003-02.jpg` |
| 10 | DL-32-XA-1058 | `VEH-003-03` | OP-003 | No — not rendered anywhere | `dl-32-xa-1058-veh-003-03.jpg` |
| 11 | DL-31-BD-7346 | `VEH-003-04` | OP-003 | No — not rendered anywhere | `dl-31-bd-7346-veh-003-04.jpg` |
| 12 | DL-22-KD-8221 | `VEH-003-05` | OP-003 | No — not rendered anywhere | `dl-22-kd-8221-veh-003-05.jpg` |
| 13 | DL-18-DB-1506 | `VEH-003-06` | OP-003 | No — not rendered anywhere | `dl-18-db-1506-veh-003-06.jpg` |
| 14 | DL-27-KC-4106 | `VEH-003-07` | OP-003 | No — not rendered anywhere | `dl-27-kc-4106-veh-003-07.jpg` |
| 15 | DL-38-CB-9171 | `VEH-003-08` | OP-003 | No — not rendered anywhere | `dl-38-cb-9171-veh-003-08.jpg` |
| 16 | MH-36-CB-3961 | `VEH-004-01` | OP-004 | No — not rendered anywhere | `mh-36-cb-3961-veh-004-01.jpg` |
| 17 | MH-28-CB-2849 | `VEH-004-02` | OP-004 | No — not rendered anywhere | `mh-28-cb-2849-veh-004-02.jpg` |
| 18 | RJ-06-BD-1963 | `VEH-005-01` | OP-005 | No — not rendered anywhere | `rj-06-bd-1963-veh-005-01.jpg` |
| 19 | RJ-04-BC-6912 | `VEH-005-02` | OP-005 | No — not rendered anywhere | `rj-04-bc-6912-veh-005-02.jpg` |
| 20 | RJ-27-AB-6018 | `VEH-005-03` | OP-005 | No — not rendered anywhere | `rj-27-ab-6018-veh-005-03.jpg` |

---

## 6. Complete Documents List (17)

Rendered as a small thumbnail in the Documents library list (`DocumentsPage.tsx` → `DocumentThumb` → `documentImage(id, fileName)`).

| # | Document Name | Document ID | Case | Image Required? | Exact Image Filename |
|---|---|---|---|---|---|
| 1 | Aadhaar_ArjunMalhotra.pdf | `DOC-01` | OP-001 | Yes | `aadhaar-arjunmalhotra-doc-01.jpg` |
| 2 | HDFC_StatementQ2_ArjunMalhotra.pdf | `DOC-02` | OP-001 | Yes | `hdfc-statementq2-arjunmalhotra-doc-02.jpg` |
| 3 | FreightContract_MeridianKonnect.pdf | `DOC-03` | OP-001 | Yes | `freightcontract-meridiankonnect-doc-03.jpg` |
| 4 | LeaseAgreement_ChemburWarehouse.pdf | `DOC-04` | OP-001 | Yes | `leaseagreement-chemburwarehouse-doc-04.jpg` |
| 5 | BoatRegistration_SagarKanya2.pdf | `DOC-002-01` | OP-002 | Yes | `boatregistration-sagarkanya2-doc-002-01.jpg` |
| 6 | ExportLicence_KonkanBlueMarine.pdf | `DOC-002-02` | OP-002 | Yes | `exportlicence-konkanbluemarine-doc-002-02.jpg` |
| 7 | FuelLedger_Q3.pdf | `DOC-002-03` | OP-002 | Yes | `fuelledger-q3-doc-002-03.jpg` |
| 8 | SaleDeed_SonipatPlot14.pdf | `DOC-003-01` | OP-003 | Yes | `saledeed-sonipatplot14-doc-003-01.jpg` |
| 9 | BenamiDeclaration_ApexHoldings.pdf | `DOC-003-02` | OP-003 | Yes | `benamideclaration-apexholdings-doc-003-02.jpg` |
| 10 | LoanAgreement_NorthstarRealty.pdf | `DOC-003-03` | OP-003 | Yes | `loanagreement-northstarrealty-doc-003-03.jpg` |
| 11 | ShellCompanyFilings_MCA.pdf | `DOC-003-04` | OP-003 | Yes | `shellcompanyfilings-mca-doc-003-04.jpg` |
| 12 | ForgedKYC_MuleAccount07.pdf | `DOC-004-01` | OP-004 | Yes | `forgedkyc-muleaccount07-doc-004-01.jpg` |
| 13 | MuleAccountOpeningForm.pdf | `DOC-004-02` | OP-004 | Yes | `muleaccountopeningform-doc-004-02.jpg` |
| 14 | ChargeSheet_SilentLedger.pdf | `DOC-004-03` | OP-004 | Yes | `chargesheet-silentledger-doc-004-03.jpg` |
| 15 | TransportPermit_TharLogistics.pdf | `DOC-005-01` | OP-005 | Yes | `transportpermit-tharlogistics-doc-005-01.jpg` |
| 16 | HawalaLedger_Seized.pdf | `DOC-005-02` | OP-005 | Yes | `hawalaledger-seized-doc-005-02.jpg` |
| 17 | CustomsManifest_KandlaPort.pdf | `DOC-005-03` | OP-005 | Yes | `customsmanifest-kandlaport-doc-005-03.jpg` |

---

## 7. CCTV Cameras (32 defined, 29 actually rendered)

A camera only ever appears in the UI if `cctvService.listCameras(caseId)` returns it, which only happens if **at least one CCTV event in that camera's case references it** (`mockCctvEvents`). Three cameras are defined but never referenced by any event in their case, so the app never requests their frame image: `CAM-MW05` (case-op001), `CAM-002-05` (case-op002), `CAM-005-05` (case-op005).

Rendered here: (1) `LocationDetailPanel.tsx` CCTV tab, one thumbnail per camera at that location — always `cctvFrameImage(camera.id)`; (2) `CCTVViewer.tsx`, as the fallback frame `cctvFrameImage(activeEvent?.id ?? camera.id)` — in practice this camera-id fallback is very rarely hit since a listed camera always has at least one event auto-selected in the timeline (see section 8 for the event-id frames that are actually shown almost all the time).

| # | Camera ID | Location | Case | Image/Frame Required? | Exact Filename |
|---|---|---|---|---|---|
| 1 | `CAM-BW02` | Bandra West | OP-001 | Yes | `cam-bw02.jpg` |
| 2 | `CAM-BW12` | Bandra West | OP-001 | Yes | `cam-bw12.jpg` |
| 3 | `CAM-AW09` | Andheri East | OP-001 | Yes | `cam-aw09.jpg` |
| 4 | `CAM-LW07` | Lower Parel | OP-001 | Yes | `cam-lw07.jpg` |
| 5 | `CAM-OE11` | Colaba | OP-001 | Yes | `cam-oe11.jpg` |
| 6 | `CAM-MW05` | Malad West | OP-001 (never referenced by a CCTV event — dead camera) | No — never appears in any CCTV event for its case | `cam-mw05.jpg` |
| 7 | `CAM-CH03` | Chembur | OP-001 | Yes | `cam-ch03.jpg` |
| 8 | `CAM-PW08` | Powai | OP-001 | Yes | `cam-pw08.jpg` |
| 9 | `CAM-DR02` | Dockyard Road | OP-001 | Yes | `cam-dr02.jpg` |
| 10 | `CAM-KR06` | Kurla | OP-001 | Yes | `cam-kr06.jpg` |
| 11 | `CAM-002-01` | Ratnagiri Fishing Harbour | OP-002 | Yes | `cam-002-01.jpg` |
| 12 | `CAM-002-02` | Malvan Jetty | OP-002 | Yes | `cam-002-02.jpg` |
| 13 | `CAM-002-03` | Vengurla Creek | OP-002 | Yes | `cam-002-03.jpg` |
| 14 | `CAM-002-04` | Devgad Market Road | OP-002 | Yes | `cam-002-04.jpg` |
| 15 | `CAM-002-05` | Guhagar Residency | OP-002 (never referenced by a CCTV event — dead camera) | No — never appears in any CCTV event for its case | `cam-002-05.jpg` |
| 16 | `CAM-002-06` | Sawantwadi Transit Yard | OP-002 | Yes | `cam-002-06.jpg` |
| 17 | `CAM-003-01` | Connaught Place | OP-003 | Yes | `cam-003-01.jpg` |
| 18 | `CAM-003-02` | Gurugram Cyber Hub | OP-003 | Yes | `cam-003-02.jpg` |
| 19 | `CAM-003-03` | Noida Sector 62 | OP-003 | Yes | `cam-003-03.jpg` |
| 20 | `CAM-003-04` | Chandigarh Sector 17 | OP-003 | Yes | `cam-003-04.jpg` |
| 21 | `CAM-003-05` | Jaipur Vaishali Nagar | OP-003 | Yes | `cam-003-05.jpg` |
| 22 | `CAM-003-06` | Faridabad Industrial Estate | OP-003 | Yes | `cam-003-06.jpg` |
| 23 | `CAM-003-07` | Sonipat Warehouse Cluster | OP-003 | Yes | `cam-003-07.jpg` |
| 24 | `CAM-004-01` | Hinjewadi IT Park | OP-004 | Yes | `cam-004-01.jpg` |
| 25 | `CAM-004-02` | Nagpur Civil Lines | OP-004 | Yes | `cam-004-02.jpg` |
| 26 | `CAM-004-03` | Pune Camp | OP-004 | Yes | `cam-004-03.jpg` |
| 27 | `CAM-005-01` | Jodhpur Transport Nagar | OP-005 | Yes | `cam-005-01.jpg` |
| 28 | `CAM-005-02` | Barmer Border Checkpost | OP-005 | Yes | `cam-005-02.jpg` |
| 29 | `CAM-005-03` | Kandla Port | OP-005 | Yes | `cam-005-03.jpg` |
| 30 | `CAM-005-04` | Bhuj Industrial Area | OP-005 | Yes | `cam-005-04.jpg` |
| 31 | `CAM-005-05` | Ahmedabad Naroda GIDC | OP-005 (never referenced by a CCTV event — dead camera) | No — never appears in any CCTV event for its case | `cam-005-05.jpg` |
| 32 | `CAM-005-06` | Jaisalmer Transit Camp | OP-005 | Yes | `cam-005-06.jpg` |

---

## 8. CCTV Detections / Frames

### 8a. CCTV Events (55) — rendered by `CCTVViewer.tsx` (`cctvFrameImage(activeEvent.id)`) whenever that event is the selected row in the Video Timeline

| # | Event ID | Camera | Subject/Vehicle | Case | Exact Filename |
|---|---|---|---|---|---|
| 1 | `CE-001` | `CAM-BW12` | Arjun Malhotra (face_match) | OP-001 | `ce-001.jpg` |
| 2 | `CE-002` | `CAM-BW12` | Arjun Malhotra (face_match) | OP-001 | `ce-002.jpg` |
| 3 | `CE-003` | `CAM-AW09` | Rajat Verma (face_match) | OP-001 | `ce-003.jpg` |
| 4 | `CE-004` | `CAM-BW02` | VEH-01 (vehicle_detected) | OP-001 | `ce-004.jpg` |
| 5 | `CE-005` | `CAM-CH03` | VEH-04, Deepak Chauhan (vehicle_detected) | OP-001 | `ce-005.jpg` |
| 6 | `CE-006` | `CAM-OE11` | Unidentified Male (UNKNOWN_07) (person_detected) | OP-001 | `ce-006.jpg` |
| 7 | `CE-007` | `CAM-OE11` | Arjun Malhotra, Unidentified Male (UNKNOWN_07) (movement) | OP-001 | `ce-007.jpg` |
| 8 | `CE-008` | `CAM-PW08` | Vikram Singh Rathore (face_match) | OP-001 | `ce-008.jpg` |
| 9 | `CE-009` | `CAM-DR02` | VEH-04, Deepak Chauhan (vehicle_detected) | OP-001 | `ce-009.jpg` |
| 10 | `CE-010` | `CAM-LW07` | Priyanka Nair (face_match) | OP-001 | `ce-010.jpg` |
| 11 | `CE-011` | `CAM-KR06` | Deepak Chauhan (person_detected) | OP-001 | `ce-011.jpg` |
| 12 | `CE-012` | `CAM-BW02` | Arjun Malhotra, Rajat Verma (movement) | OP-001 | `ce-012.jpg` |
| 13 | `CE-002-04` | `CAM-002-03` | Swati Thakur (movement) | OP-002 | `ce-002-04.jpg` |
| 14 | `CE-002-01` | `CAM-002-06` | Harpreet Khan (person_detected) | OP-002 | `ce-002-01.jpg` |
| 15 | `CE-002-07` | `CAM-002-04` | VEH-002-01, Swati Thakur (vehicle_detected) | OP-002 | `ce-002-07.jpg` |
| 16 | `CE-002-02` | `CAM-002-01` | Harpreet Khan (movement) | OP-002 | `ce-002-02.jpg` |
| 17 | `CE-002-06` | `CAM-002-03` | VEH-002-03, Harpreet Khan (vehicle_detected) | OP-002 | `ce-002-06.jpg` |
| 18 | `CE-002-03` | `CAM-002-01` | Harpreet Khan (movement) | OP-002 | `ce-002-03.jpg` |
| 19 | `CE-002-05` | `CAM-002-02` | Swati Thakur (face_match) | OP-002 | `ce-002-05.jpg` |
| 20 | `CE-003-06` | `CAM-003-03` | Ajay Chowdhury (person_detected) | OP-003 | `ce-003-06.jpg` |
| 21 | `CE-003-21` | `CAM-003-02` | Ravi Thakur (movement) | OP-003 | `ce-003-21.jpg` |
| 22 | `CE-003-15` | `CAM-003-03` | VEH-003-08, Ajay Chowdhury (vehicle_detected) | OP-003 | `ce-003-15.jpg` |
| 23 | `CE-003-16` | `CAM-003-05` | Irfan Mehta (movement) | OP-003 | `ce-003-16.jpg` |
| 24 | `CE-003-18` | `CAM-003-06` | VEH-003-01, Naveen Joshi (vehicle_detected) | OP-003 | `ce-003-18.jpg` |
| 25 | `CE-003-13` | `CAM-003-02` | Kavita Mehta (person_detected) | OP-003 | `ce-003-13.jpg` |
| 26 | `CE-003-01` | `CAM-003-02` | Zaid Reddy (face_match) | OP-003 | `ce-003-01.jpg` |
| 27 | `CE-003-20` | `CAM-003-02` | Deepak Desai (movement) | OP-003 | `ce-003-20.jpg` |
| 28 | `CE-003-19` | `CAM-003-04` | Swati Verma (face_match) | OP-003 | `ce-003-19.jpg` |
| 29 | `CE-003-14` | `CAM-003-07` | Manish Sharma (face_match) | OP-003 | `ce-003-14.jpg` |
| 30 | `CE-003-04` | `CAM-003-07` | VEH-003-08, Manish Sharma (vehicle_detected) | OP-003 | `ce-003-04.jpg` |
| 31 | `CE-003-08` | `CAM-003-07` | Irfan Mehta (movement) | OP-003 | `ce-003-08.jpg` |
| 32 | `CE-003-03` | `CAM-003-01` | Ravi Thakur (movement) | OP-003 | `ce-003-03.jpg` |
| 33 | `CE-003-10` | `CAM-003-05` | VEH-003-03, Tarun Chauhan (vehicle_detected) | OP-003 | `ce-003-10.jpg` |
| 34 | `CE-003-09` | `CAM-003-04` | Ayesha Mehta (movement) | OP-003 | `ce-003-09.jpg` |
| 35 | `CE-003-12` | `CAM-003-05` | Neha Rana (movement) | OP-003 | `ce-003-12.jpg` |
| 36 | `CE-003-11` | `CAM-003-06` | Priyanka Sharma (face_match) | OP-003 | `ce-003-11.jpg` |
| 37 | `CE-003-05` | `CAM-003-01` | Ravi Ali (person_detected) | OP-003 | `ce-003-05.jpg` |
| 38 | `CE-003-17` | `CAM-003-06` | Ajay Chowdhury (face_match) | OP-003 | `ce-003-17.jpg` |
| 39 | `CE-003-07` | `CAM-003-02` | Aslam Thakur (person_detected) | OP-003 | `ce-003-07.jpg` |
| 40 | `CE-003-02` | `CAM-003-07` | Tarun Chauhan (face_match) | OP-003 | `ce-003-02.jpg` |
| 41 | `CE-004-04` | `CAM-004-03` | Sunita Sheikh (movement) | OP-004 | `ce-004-04.jpg` |
| 42 | `CE-004-06` | `CAM-004-02` | Rajat Mehta (movement) | OP-004 | `ce-004-06.jpg` |
| 43 | `CE-004-02` | `CAM-004-01` | Kiran Menon (person_detected) | OP-004 | `ce-004-02.jpg` |
| 44 | `CE-004-03` | `CAM-004-03` | Rakesh Ali (person_detected) | OP-004 | `ce-004-03.jpg` |
| 45 | `CE-004-05` | `CAM-004-03` | Amit Kapoor (movement) | OP-004 | `ce-004-05.jpg` |
| 46 | `CE-004-01` | `CAM-004-03` | Sunita Sheikh (movement) | OP-004 | `ce-004-01.jpg` |
| 47 | `CE-005-06` | `CAM-005-04` | Rohit Menon (face_match) | OP-005 | `ce-005-06.jpg` |
| 48 | `CE-005-02` | `CAM-005-01` | Zara Verma (movement) | OP-005 | `ce-005-02.jpg` |
| 49 | `CE-005-09` | `CAM-005-01` | VEH-005-02, Harpreet Pillai (vehicle_detected) | OP-005 | `ce-005-09.jpg` |
| 50 | `CE-005-04` | `CAM-005-01` | Rohit Menon (face_match) | OP-005 | `ce-005-04.jpg` |
| 51 | `CE-005-01` | `CAM-005-02` | VEH-005-03, Arjun Chowdhury (vehicle_detected) | OP-005 | `ce-005-01.jpg` |
| 52 | `CE-005-03` | `CAM-005-03` | VEH-005-02, Priyanka Bhatt (vehicle_detected) | OP-005 | `ce-005-03.jpg` |
| 53 | `CE-005-07` | `CAM-005-03` | Suresh Iyer (movement) | OP-005 | `ce-005-07.jpg` |
| 54 | `CE-005-05` | `CAM-005-02` | Salman Pillai (movement) | OP-005 | `ce-005-05.jpg` |
| 55 | `CE-005-08` | `CAM-005-06` | Arjun Chowdhury (face_match) | OP-005 | `ce-005-08.jpg` |

### 8b. Face Recognition Detection Frames (22) — rendered by `FaceViewer.tsx` (`cctvFrameImage(detection.frameId)`)

| # | Detection ID | Camera | Subject | Case | Exact Filename |
|---|---|---|---|---|---|
| 1 | `FD-001` | `CAM-BW12` | Arjun Malhotra — matched | OP-001 | `f-88231.jpg` |
| 2 | `FD-002` | `CAM-BW12` | Arjun Malhotra — matched | OP-001 | `f-88245.jpg` |
| 3 | `FD-003` | `CAM-AW09` | Rajat Verma — matched | OP-001 | `f-40021.jpg` |
| 4 | `FD-004` | `CAM-OE11` | (unresolved identity) — possible-match | OP-001 | `f-11209.jpg` |
| 5 | `FD-005` | `CAM-PW08` | Vikram Singh Rathore — matched | OP-001 | `f-77021.jpg` |
| 6 | `FD-006` | `CAM-LW07` | Priyanka Nair — matched | OP-001 | `f-65510.jpg` |
| 7 | `FD-007` | `CAM-BW02` | (unresolved identity) — unknown | OP-001 | `f-30014.jpg` |
| 8 | `FD-002-01` | `CAM-002-06` | (unresolved identity) — possible-match | OP-002 | `f-58476.jpg` |
| 9 | `FD-002-02` | `CAM-002-02` | Swati Thakur — matched | OP-002 | `f-64784.jpg` |
| 10 | `FD-003-01` | `CAM-003-03` | (unresolved identity) — possible-match | OP-003 | `f-47616.jpg` |
| 11 | `FD-003-02` | `CAM-003-02` | (unresolved identity) — possible-match | OP-003 | `f-36326.jpg` |
| 12 | `FD-003-03` | `CAM-003-02` | Zaid Reddy — matched | OP-003 | `f-15450.jpg` |
| 13 | `FD-003-04` | `CAM-003-04` | Swati Verma — matched | OP-003 | `f-40987.jpg` |
| 14 | `FD-003-05` | `CAM-003-07` | Manish Sharma — matched | OP-003 | `f-97850.jpg` |
| 15 | `FD-003-06` | `CAM-003-06` | Priyanka Sharma — matched | OP-003 | `f-21336.jpg` |
| 16 | `FD-003-07` | `CAM-003-01` | (unresolved identity) — possible-match | OP-003 | `f-52350.jpg` |
| 17 | `FD-003-08` | `CAM-003-06` | Ajay Chowdhury — matched | OP-003 | `f-62401.jpg` |
| 18 | `FD-004-01` | `CAM-004-01` | (unresolved identity) — possible-match | OP-004 | `f-83995.jpg` |
| 19 | `FD-004-02` | `CAM-004-03` | (unresolved identity) — possible-match | OP-004 | `f-16456.jpg` |
| 20 | `FD-005-01` | `CAM-005-04` | Rohit Menon — matched | OP-005 | `f-79211.jpg` |
| 21 | `FD-005-02` | `CAM-005-01` | Rohit Menon — matched | OP-005 | `f-84903.jpg` |
| 22 | `FD-005-03` | `CAM-005-06` | Arjun Chowdhury — matched | OP-005 | `f-39725.jpg` |

---

## 9. Complete Social Media Profiles List (21)

`SocialMediaPage.tsx` resolves each profile's `entityId` to a Person and renders `PersonAvatar` with `personImage(owner.id, owner.name)` — **no separate social-profile image file exists or is needed**; it always reuses that person's own portrait file from section 2.

| # | Person/Entity | Platform | Username | Case | Profile Image Required? | Exact Filename (reused) |
|---|---|---|---|---|---|---|
| 1 | Arjun Malhotra (`P-0042`) | X | @arjun_m88 | OP-001 | Yes — reuses person photo | `arjun-malhotra-p-0042.jpg` |
| 2 | Arjun Malhotra (`P-0042`) | Telegram | @ajmalhotra | OP-001 | Yes — reuses person photo | `arjun-malhotra-p-0042.jpg` |
| 3 | Rajat Verma (`P-0043`) | Instagram | @raju.verma91 | OP-001 | Yes — reuses person photo | `rajat-verma-p-0043.jpg` |
| 4 | Priyanka Nair (`P-0044`) | LinkedIn | priyanka-nair-ca | OP-001 | Yes — reuses person photo | `priyanka-nair-p-0044.jpg` |
| 5 | — (`—`) | Telegram | @unknown_transit07 | OP-001 | Yes — reuses person photo | `—` |
| 6 | Swati Thakur (`P-002-001`) | Instagram | @swatithaku95 | OP-002 | Yes — reuses person photo | `swati-thakur-p-002-001.jpg` |
| 7 | Rohit Iyer (`P-002-006`) | Telegram | @rohitiyer1 | OP-002 | Yes — reuses person photo | `rohit-iyer-p-002-006.jpg` |
| 8 | Manish Bhatt (`P-002-002`) | LinkedIn | @manishbhat48 | OP-002 | Yes — reuses person photo | `manish-bhatt-p-002-002.jpg` |
| 9 | Meera Bose (`P-002-003`) | Instagram | @meerabose9 | OP-002 | Yes — reuses person photo | `meera-bose-p-002-003.jpg` |
| 10 | Swati Verma (`P-003-001`) | Instagram | @swativerma20 | OP-003 | Yes — reuses person photo | `swati-verma-p-003-001.jpg` |
| 11 | Gaurav Singh Rathore (`P-003-013`) | LinkedIn | @gauravsing2 | OP-003 | Yes — reuses person photo | `gaurav-singh-rathore-p-003-013.jpg` |
| 12 | Gaurav Khan (`P-003-016`) | Facebook | @gauravkhan73 | OP-003 | Yes — reuses person photo | `gaurav-khan-p-003-016.jpg` |
| 13 | Ravi Ali (`P-003-017`) | Instagram | @raviali96 | OP-003 | Yes — reuses person photo | `ravi-ali-p-003-017.jpg` |
| 14 | Sunita Sheikh (`P-004-001`) | Telegram | @sunitashei29 | OP-004 | Yes — reuses person photo | `sunita-sheikh-p-004-001.jpg` |
| 15 | Rakesh Ali (`P-004-006`) | LinkedIn | @rakeshali48 | OP-004 | Yes — reuses person photo | `rakesh-ali-p-004-006.jpg` |
| 16 | Kiran Menon (`P-004-004`) | X | @kiranmenon42 | OP-004 | Yes — reuses person photo | `kiran-menon-p-004-004.jpg` |
| 17 | Amit Kapoor (`P-004-003`) | Telegram | @amitkapoor23 | OP-004 | Yes — reuses person photo | `amit-kapoor-p-004-003.jpg` |
| 18 | Rohit Menon (`P-005-001`) | Telegram | @rohitmenon25 | OP-005 | Yes — reuses person photo | `rohit-menon-p-005-001.jpg` |
| 19 | Anil Chauhan (`P-005-002`) | LinkedIn | @anilchauha94 | OP-005 | Yes — reuses person photo | `anil-chauhan-p-005-002.jpg` |
| 20 | Arjun Chowdhury (`P-005-003`) | Telegram | @arjunchowd56 | OP-005 | Yes — reuses person photo | `arjun-chowdhury-p-005-003.jpg` |
| 21 | Priyanka Bhatt (`P-005-010`) | Facebook | @priyankabh67 | OP-005 | Yes — reuses person photo | `priyanka-bhatt-p-005-010.jpg` |

---

## 10. Complete Devices List (9)

`DeviceEntity` has no image helper in `imageAssets.ts` and no component ever renders a device photo — devices appear only as plain text (e.g. Forensics evidence titles like "Device extraction — Samsung Galaxy S24"). **No image required for any device.**

| # | Device | Device ID | Owner | Case | Image Required? |
|---|---|---|---|---|---|
| 1 | Samsung Galaxy S23 (Arjun Malhotra) | `DEV-01` | Arjun Malhotra | OP-001 | No — text only |
| 2 | Vivo V29 (Swati Thakur) | `DEV-002-01` | Swati Thakur | OP-002 | No — text only |
| 3 | Samsung Galaxy S24 (Sanjay Desai) | `DEV-002-02` | Sanjay Desai | OP-002 | No — text only |
| 4 | Xiaomi Redmi Note 13 (Swati Verma) | `DEV-003-01` | Swati Verma | OP-003 | No — text only |
| 5 | Xiaomi Redmi Note 13 (Irfan Mehta) | `DEV-003-02` | Irfan Mehta | OP-003 | No — text only |
| 6 | Samsung Galaxy S24 (Sunita Sheikh) | `DEV-004-01` | Sunita Sheikh | OP-004 | No — text only |
| 7 | OnePlus 12R (Kiran Menon) | `DEV-004-02` | Kiran Menon | OP-004 | No — text only |
| 8 | Vivo V29 (Rohit Menon) | `DEV-005-01` | Rohit Menon | OP-005 | No — text only |
| 9 | OnePlus 12R (Sanjay Chauhan) | `DEV-005-02` | Sanjay Chauhan | OP-005 | No — text only |

---

## 11. Complete Financial Accounts List (27)

`FinancialPage.tsx` resolves each account's `ownerId` to an entity and renders `PersonAvatar` with `personImage(owner.id, owner.name)` **without checking the owner's entity type** — see Image Mapping Issues. For the 22 accounts owned by a person, this correctly reuses that person's photo (no new file). For the 5 accounts owned by an organization, the app still requests a `/images/people/...` file named after the *company*, which is a mapping bug, not a real image need — no photo should be generated for these.

| # | Account | Account ID | Owner | Case | Image Required? |
|---|---|---|---|---|---|
| 1 | HDFC •••• 4821 (Arjun Malhotra) | `ACC-01` | Arjun Malhotra (person) | OP-001 | Yes — reuses `arjun-malhotra-p-0042.jpg` (owner's own person photo) |
| 2 | UPI arjun.m@okhdfc | `ACC-02` | Arjun Malhotra (person) | OP-001 | Yes — reuses `arjun-malhotra-p-0042.jpg` (owner's own person photo) |
| 3 | ICICI •••• 1190 (Rajat Verma) | `ACC-03` | Rajat Verma (person) | OP-001 | Yes — reuses `rajat-verma-p-0043.jpg` (owner's own person photo) |
| 4 | Axis •••• 7734 (Priyanka Nair) | `ACC-04` | Priyanka Nair (person) | OP-001 | Yes — reuses `priyanka-nair-p-0044.jpg` (owner's own person photo) |
| 5 | Konnect Traders — Current A/C | `ACC-05` | Konnect Traders Pvt Ltd (organization) | OP-001 | ⚠️ App requests a person-style file for org owner "Konnect Traders Pvt Ltd" — see Image Mapping Issues. No real photo needed. |
| 6 | SBI •••• 2290 (Vikram Singh Rathore) | `ACC-06` | Vikram Singh Rathore (person) | OP-001 | Yes — reuses `vikram-singh-rathore-p-0046.jpg` (owner's own person photo) |
| 7 | PNB •••• 5563 (Sana Ali) | `ACC-07` | Sana Ali (person) | OP-001 | Yes — reuses `sana-ali-p-0047.jpg` (owner's own person photo) |
| 8 | Yes •••• 8258 (Swati Thakur) | `ACC-002-01` | Swati Thakur (person) | OP-002 | Yes — reuses `swati-thakur-p-002-001.jpg` (owner's own person photo) |
| 9 | Punjab •••• 7582 (Anjali Singh Rathore) | `ACC-002-02` | Anjali Singh Rathore (person) | OP-002 | Yes — reuses `anjali-singh-rathore-p-002-007.jpg` (owner's own person photo) |
| 10 | HDFC •••• 1298 (Manish Bhatt) | `ACC-002-03` | Manish Bhatt (person) | OP-002 | Yes — reuses `manish-bhatt-p-002-002.jpg` (owner's own person photo) |
| 11 | HDFC •••• 8755 (Rohit Iyer) | `ACC-002-04` | Rohit Iyer (person) | OP-002 | Yes — reuses `rohit-iyer-p-002-006.jpg` (owner's own person photo) |
| 12 | ICICI •••• 3852 (Konkan Blue Marine Pvt Ltd) | `ACC-002-05` | Konkan Blue Marine Pvt Ltd (organization) | OP-002 | ⚠️ App requests a person-style file for org owner "Konkan Blue Marine Pvt Ltd" — see Image Mapping Issues. No real photo needed. |
| 13 | Yes •••• 1822 (Swati Verma) | `ACC-003-01` | Swati Verma (person) | OP-003 | Yes — reuses `swati-verma-p-003-001.jpg` (owner's own person photo) |
| 14 | Bank •••• 5775 (Pooja Naidu) | `ACC-003-02` | Pooja Naidu (person) | OP-003 | Yes — reuses `pooja-naidu-p-003-005.jpg` (owner's own person photo) |
| 15 | HDFC •••• 3467 (Priyanka Sharma) | `ACC-003-03` | Priyanka Sharma (person) | OP-003 | Yes — reuses `priyanka-sharma-p-003-014.jpg` (owner's own person photo) |
| 16 | State •••• 4667 (Ravi Ali) | `ACC-003-04` | Ravi Ali (person) | OP-003 | Yes — reuses `ravi-ali-p-003-017.jpg` (owner's own person photo) |
| 17 | Bank •••• 5155 (Northstar Realty Ventures) | `ACC-003-05` | Northstar Realty Ventures (organization) | OP-003 | ⚠️ App requests a person-style file for org owner "Northstar Realty Ventures" — see Image Mapping Issues. No real photo needed. |
| 18 | HDFC •••• 2353 (Sunita Sheikh) | `ACC-004-01` | Sunita Sheikh (person) | OP-004 | Yes — reuses `sunita-sheikh-p-004-001.jpg` (owner's own person photo) |
| 19 | ICICI •••• 3540 (Amit Kapoor) | `ACC-004-02` | Amit Kapoor (person) | OP-004 | Yes — reuses `amit-kapoor-p-004-003.jpg` (owner's own person photo) |
| 20 | Bank •••• 5722 (Deepak Verma) | `ACC-004-03` | Deepak Verma (person) | OP-004 | Yes — reuses `deepak-verma-p-004-005.jpg` (owner's own person photo) |
| 21 | Punjab •••• 7486 (Kiran Menon) | `ACC-004-04` | Kiran Menon (person) | OP-004 | Yes — reuses `kiran-menon-p-004-004.jpg` (owner's own person photo) |
| 22 | Punjab •••• 4879 (Zenlite BPO Services) | `ACC-004-05` | Zenlite BPO Services (organization) | OP-004 | ⚠️ App requests a person-style file for org owner "Zenlite BPO Services" — see Image Mapping Issues. No real photo needed. |
| 23 | Axis •••• 3675 (Rohit Menon) | `ACC-005-01` | Rohit Menon (person) | OP-005 | Yes — reuses `rohit-menon-p-005-001.jpg` (owner's own person photo) |
| 24 | Punjab •••• 1087 (Suresh Iyer) | `ACC-005-02` | Suresh Iyer (person) | OP-005 | Yes — reuses `suresh-iyer-p-005-009.jpg` (owner's own person photo) |
| 25 | HDFC •••• 3725 (Zara Verma) | `ACC-005-03` | Zara Verma (person) | OP-005 | Yes — reuses `zara-verma-p-005-008.jpg` (owner's own person photo) |
| 26 | Axis •••• 2585 (Nargis Iyer) | `ACC-005-04` | Nargis Iyer (person) | OP-005 | Yes — reuses `nargis-iyer-p-005-007.jpg` (owner's own person photo) |
| 27 | Bank •••• 7370 (Thar Logistics & Carriers) | `ACC-005-05` | Thar Logistics & Carriers (organization) | OP-005 | ⚠️ App requests a person-style file for org owner "Thar Logistics & Carriers" — see Image Mapping Issues. No real photo needed. |

---

## 12. Complete Evidence List (32)

Rendered in `EvidencePage.tsx` (table thumbnail + detail header, `evidenceImage(id)`) and reused in `LocationBottomStrip.tsx`'s "Related Media" strip for evidence linked to that location.

| # | Evidence | Evidence ID | Type | Case | Image Required? | Exact Filename |
|---|---|---|---|---|---|---|
| 1 | Facial match — Arjun Malhotra at Sea Breeze Apartments | `EV-001` | face | OP-001 | Yes | `ev-001.jpg` |
| 2 | ANPR capture — MH-02-CQ-4521 at Bandra West Junction | `EV-002` | cctv | OP-001 | Yes | `ev-002.jpg` |
| 3 | Unidentified contact at Colaba dockside | `EV-003` | cctv | OP-001 | Yes | `ev-003.jpg` |
| 4 | Flagged transfer chain — ACC-06 → ACC-05 → ACC-07 | `EV-004` | financial | OP-001 | Yes | `ev-004.jpg` |
| 5 | Freight contract — Meridian Freight & Konnect Traders | `EV-005` | document | OP-001 | Yes | `ev-005.jpg` |
| 6 | High-frequency call pattern — P-0042 ↔ P-0043 | `EV-006` | call | OP-001 | Yes | `ev-006.jpg` |
| 7 | Device extraction — Samsung Galaxy S23 (DEV-01) | `EV-007` | forensic | OP-001 | Yes | `ev-007.jpg` |
| 8 | Digital signature match — freight contract PDF metadata | `EV-008` | forensic | OP-001 | Yes | `ev-008.jpg` |
| 9 | Facial match — Swati Thakur at Ratnagiri Fishing Harbour | `EVD-002-01` | face | OP-002 | Yes | `evd-002-01.jpg` |
| 10 | ANPR capture — MH-25-XA-3531 near Malvan Jetty | `EVD-002-02` | cctv | OP-002 | Yes | `evd-002-02.jpg` |
| 11 | Flagged transfer chain — 2 suspicious transfers | `EVD-002-03` | financial | OP-002 | Yes | `evd-002-03.jpg` |
| 12 | BoatRegistration_SagarKanya2.pdf — seized record | `EVD-002-04` | document | OP-002 | Yes | `evd-002-04.jpg` |
| 13 | High-frequency call pattern — 8 linked numbers | `EVD-002-05` | call | OP-002 | Yes | `evd-002-05.jpg` |
| 14 | Device extraction — Vivo V29 (Swati Thakur) | `EVD-002-06` | forensic | OP-002 | Yes | `evd-002-06.jpg` |
| 15 | Facial match — Swati Verma at Connaught Place | `EVD-003-01` | face | OP-003 | Yes | `evd-003-01.jpg` |
| 16 | ANPR capture — DL-14-BA-8027 near Gurugram Cyber Hub | `EVD-003-02` | cctv | OP-003 | Yes | `evd-003-02.jpg` |
| 17 | Flagged transfer chain — 4 suspicious transfers | `EVD-003-03` | financial | OP-003 | Yes | `evd-003-03.jpg` |
| 18 | SaleDeed_SonipatPlot14.pdf — seized record | `EVD-003-04` | document | OP-003 | Yes | `evd-003-04.jpg` |
| 19 | High-frequency call pattern — 23 linked numbers | `EVD-003-05` | call | OP-003 | Yes | `evd-003-05.jpg` |
| 20 | Device extraction — Xiaomi Redmi Note 13 (Swati Verma) | `EVD-003-06` | forensic | OP-003 | Yes | `evd-003-06.jpg` |
| 21 | Facial match — Sunita Sheikh at Hinjewadi IT Park | `EVD-004-01` | face | OP-004 | Yes | `evd-004-01.jpg` |
| 22 | ANPR capture — MH-36-CB-3961 near Nagpur Civil Lines | `EVD-004-02` | cctv | OP-004 | Yes | `evd-004-02.jpg` |
| 23 | Flagged transfer chain — 3 suspicious transfers | `EVD-004-03` | financial | OP-004 | Yes | `evd-004-03.jpg` |
| 24 | ForgedKYC_MuleAccount07.pdf — seized record | `EVD-004-04` | document | OP-004 | Yes | `evd-004-04.jpg` |
| 25 | High-frequency call pattern — 6 linked numbers | `EVD-004-05` | call | OP-004 | Yes | `evd-004-05.jpg` |
| 26 | Device extraction — Samsung Galaxy S24 (Sunita Sheikh) | `EVD-004-06` | forensic | OP-004 | Yes | `evd-004-06.jpg` |
| 27 | Facial match — Rohit Menon at Jodhpur Transport Nagar | `EVD-005-01` | face | OP-005 | Yes | `evd-005-01.jpg` |
| 28 | ANPR capture — RJ-06-BD-1963 near Barmer Border Checkpost | `EVD-005-02` | cctv | OP-005 | Yes | `evd-005-02.jpg` |
| 29 | Flagged transfer chain — 3 suspicious transfers | `EVD-005-03` | financial | OP-005 | Yes | `evd-005-03.jpg` |
| 30 | TransportPermit_TharLogistics.pdf — seized record | `EVD-005-04` | document | OP-005 | Yes | `evd-005-04.jpg` |
| 31 | High-frequency call pattern — 10 linked numbers | `EVD-005-05` | call | OP-005 | Yes | `evd-005-05.jpg` |
| 32 | Device extraction — Vivo V29 (Rohit Menon) | `EVD-005-06` | forensic | OP-005 | Yes | `evd-005-06.jpg` |

---

## 13. Complete Forensic Items List

There is no separate "forensic item" data type — `ForensicsPage.tsx` simply filters the same Evidence array to `type === 'forensic'` (6 items). **`ForensicsPage.tsx` itself never renders an image** (confirmed — no `EvidenceThumb`/`evidenceImage` import in that file); the image only appears if that same evidence ID is viewed on the Evidence page instead, using the identical file from section 12.

| # | Examination / Finding | ID | Case | Image Required? | Exact Filename |
|---|---|---|---|---|---|
| 1 | Device extraction — Samsung Galaxy S23 (DEV-01) | `EV-007` | OP-001 | Yes, but only via Evidence page (not Forensics page) | `ev-007.jpg` |
| 2 | Digital signature match — freight contract PDF metadata | `EV-008` | OP-001 | Yes, but only via Evidence page (not Forensics page) | `ev-008.jpg` |
| 3 | Device extraction — Vivo V29 (Swati Thakur) | `EVD-002-06` | OP-002 | Yes, but only via Evidence page (not Forensics page) | `evd-002-06.jpg` |
| 4 | Device extraction — Xiaomi Redmi Note 13 (Swati Verma) | `EVD-003-06` | OP-003 | Yes, but only via Evidence page (not Forensics page) | `evd-003-06.jpg` |
| 5 | Device extraction — Samsung Galaxy S24 (Sunita Sheikh) | `EVD-004-06` | OP-004 | Yes, but only via Evidence page (not Forensics page) | `evd-004-06.jpg` |
| 6 | Device extraction — Vivo V29 (Rohit Menon) | `EVD-005-06` | OP-005 | Yes, but only via Evidence page (not Forensics page) | `evd-005-06.jpg` |

---

## 14. Complete Criminal Records / FIRs List (16)

`CriminalRecordsPage.tsx` resolves `entityId` (always a person in the current data) and renders `PersonAvatar` with `personImage(subject.id, subject.name)` — reuses the subject's existing portrait, no new file needed.

| # | FIR / Record | Subject | ID | Case | Image Required? |
|---|---|---|---|---|---|
| 1 | FIR/2021/0442 — Cheating & Criminal Conspiracy (closed) | Arjun Malhotra | `CR-001` | OP-001 | Yes — reuses subject's person photo |
| 2 | FIR/2019/1187 — Evasion of Customs Duty (convicted) | Vikram Singh Rathore | `CR-002` | OP-001 | Yes — reuses subject's person photo |
| 3 | FIR/2023/0891 — Theft (Vehicle) (under_investigation) | Rajat Verma | `CR-003` | OP-001 | Yes — reuses subject's person photo |
| 4 | FIR/2025/0233 — Impersonation for Cheating / Money Mule (charge_sheeted) | Sana Ali | `CR-004` | OP-001 | Yes — reuses subject's person photo |
| 5 | FIR/2022/1572 — Impersonation for Cheating (charge_sheeted) | Naveen Khan | `CR-002-01` | OP-002 | Yes — reuses subject's person photo |
| 6 | FIR/2021/6774 — Theft (charge_sheeted) | Meera Bose | `CR-002-02` | OP-002 | Yes — reuses subject's person photo |
| 7 | FIR/2020/5883 — Money Laundering (closed) | Manish Bhatt | `CR-002-03` | OP-002 | Yes — reuses subject's person photo |
| 8 | FIR/2025/7498 — Money Laundering (under_investigation) | Priyanka Sharma | `CR-003-01` | OP-003 | Yes — reuses subject's person photo |
| 9 | FIR/2020/3648 — Theft (charge_sheeted) | Manish Sharma | `CR-003-02` | OP-003 | Yes — reuses subject's person photo |
| 10 | FIR/2025/2752 — Evasion of Customs Duty (charge_sheeted) | Ajay Chowdhury | `CR-003-03` | OP-003 | Yes — reuses subject's person photo |
| 11 | FIR/2019/2770 — Smuggling (charge_sheeted) | Sunita Sheikh | `CR-004-01` | OP-004 | Yes — reuses subject's person photo |
| 12 | FIR/2021/2978 — Impersonation for Cheating (charge_sheeted) | Rajat Mehta | `CR-004-02` | OP-004 | Yes — reuses subject's person photo |
| 13 | FIR/2025/3654 — Money Laundering (under_investigation) | Deepak Verma | `CR-004-03` | OP-004 | Yes — reuses subject's person photo |
| 14 | FIR/2025/7492 — Theft (under_investigation) | Rohit Menon | `CR-005-01` | OP-005 | Yes — reuses subject's person photo |
| 15 | FIR/2023/7517 — Impersonation for Cheating (convicted) | Sanjay Chauhan | `CR-005-02` | OP-005 | Yes — reuses subject's person photo |
| 16 | FIR/2020/2776 — Impersonation for Cheating (convicted) | Nargis Iyer | `CR-005-03` | OP-005 | Yes — reuses subject's person photo |

---

## 15. Case-by-Case Entity Breakdown

### OP-001 — OPERATION TRINETRA-01

**People (7):** Arjun Malhotra (`P-0042`); Rajat Verma (`P-0043`); Priyanka Nair (`P-0044`); Unidentified Male (UNKNOWN_07) (`P-0045`); Vikram Singh Rathore (`P-0046`); Sana Ali (`P-0047`); Deepak Chauhan (`P-0048`)

**Organizations (2):** Meridian Freight Logistics (`ORG-01`); Konnect Traders Pvt Ltd (`ORG-02`)

**Locations (10):** Bandra West (`loc-001`); Andheri East (`loc-002`); Lower Parel (`loc-003`); Colaba (`loc-004`); Malad West (`loc-005`); Chembur (`loc-006`); Powai (`loc-007`); Dockyard Road (`loc-008`); Kurla (`loc-009`); Vashi (`loc-010`)

**Vehicles (4):** MH-02-CQ-4521 (`VEH-01`); MH-04-BT-7712 (`VEH-02`); MH-01-AX-9081 (`VEH-03`); MH-43-K-3320 (Freight Truck) (`VEH-04`)

**Documents (4):** Aadhaar_ArjunMalhotra.pdf (`DOC-01`); HDFC_StatementQ2_ArjunMalhotra.pdf (`DOC-02`); FreightContract_MeridianKonnect.pdf (`DOC-03`); LeaseAgreement_ChemburWarehouse.pdf (`DOC-04`)

**Evidence (8):** Facial match — Arjun Malhotra at Sea Breeze Apartments (`EV-001`); ANPR capture — MH-02-CQ-4521 at Bandra West Junction (`EV-002`); Unidentified contact at Colaba dockside (`EV-003`); Flagged transfer chain — ACC-06 → ACC-05 → ACC-07 (`EV-004`); Freight contract — Meridian Freight & Konnect Traders (`EV-005`); High-frequency call pattern — P-0042 ↔ P-0043 (`EV-006`); Device extraction — Samsung Galaxy S23 (DEV-01) (`EV-007`); Digital signature match — freight contract PDF metadata (`EV-008`)

**CCTV — rendered cameras (9):** CAM-BW02; CAM-BW12; CAM-AW09; CAM-LW07; CAM-OE11; CAM-CH03; CAM-PW08; CAM-DR02; CAM-KR06

**Social Media (5):** Arjun Malhotra on X (`SOC-01`); Arjun Malhotra on Telegram (`SOC-02`); Rajat Verma on Instagram (`SOC-03`); Priyanka Nair on LinkedIn (`SOC-04`); ? on Telegram (`SOC-05`)

**Devices (1):** Samsung Galaxy S23 (Arjun Malhotra) (`DEV-01`)

**Financial Accounts (7):** HDFC •••• 4821 (Arjun Malhotra) (`ACC-01`); UPI arjun.m@okhdfc (`ACC-02`); ICICI •••• 1190 (Rajat Verma) (`ACC-03`); Axis •••• 7734 (Priyanka Nair) (`ACC-04`); Konnect Traders — Current A/C (`ACC-05`); SBI •••• 2290 (Vikram Singh Rathore) (`ACC-06`); PNB •••• 5563 (Sana Ali) (`ACC-07`)

**Criminal Records (4):** FIR/2021/0442 — Arjun Malhotra (`CR-001`); FIR/2019/1187 — Vikram Singh Rathore (`CR-002`); FIR/2023/0891 — Rajat Verma (`CR-003`); FIR/2025/0233 — Sana Ali (`CR-004`)

### OP-002 — OPERATION COASTAL WATCH

**People (8):** Swati Thakur (`P-002-001`); Manish Bhatt (`P-002-002`); Meera Bose (`P-002-003`); Sanjay Desai (`P-002-004`); Naveen Khan (`P-002-005`); Rohit Iyer (`P-002-006`); Anjali Singh Rathore (`P-002-007`); Harpreet Khan (`P-002-008`)

**Organizations (2):** Konkan Blue Marine Pvt Ltd (`ORG-002-01`); Sahyadri Coastal Traders (`ORG-002-02`)

**Locations (17):** Powai (`loc-007`); Dockyard Road (`loc-008`); Kurla (`loc-009`); Vashi (`loc-010`); Pune (`loc-city-01`); Nashik (`loc-city-02`); Thane (`loc-city-03`); Surat (`loc-city-04`); Ahmedabad (`loc-city-05`); Delhi (`loc-city-06`); Nagpur (`loc-city-07`); Ratnagiri Fishing Harbour (`LOC-002-01`); Malvan Jetty (`LOC-002-02`); Vengurla Creek (`LOC-002-03`); Devgad Market Road (`LOC-002-04`); Guhagar Residency (`LOC-002-05`); Sawantwadi Transit Yard (`LOC-002-06`)

**Vehicles (3):** MH-25-XA-3531 (`VEH-002-01`); MH-25-DC-9391 (`VEH-002-02`); MH-04-XB-9215 (`VEH-002-03`)

**Documents (3):** BoatRegistration_SagarKanya2.pdf (`DOC-002-01`); ExportLicence_KonkanBlueMarine.pdf (`DOC-002-02`); FuelLedger_Q3.pdf (`DOC-002-03`)

**Evidence (6):** Facial match — Swati Thakur at Ratnagiri Fishing Harbour (`EVD-002-01`); ANPR capture — MH-25-XA-3531 near Malvan Jetty (`EVD-002-02`); Flagged transfer chain — 2 suspicious transfers (`EVD-002-03`); BoatRegistration_SagarKanya2.pdf — seized record (`EVD-002-04`); High-frequency call pattern — 8 linked numbers (`EVD-002-05`); Device extraction — Vivo V29 (Swati Thakur) (`EVD-002-06`)

**CCTV — rendered cameras (5):** CAM-002-01; CAM-002-02; CAM-002-03; CAM-002-04; CAM-002-06

**Social Media (4):** Swati Thakur on Instagram (`SOC-002-01`); Rohit Iyer on Telegram (`SOC-002-02`); Manish Bhatt on LinkedIn (`SOC-002-03`); Meera Bose on Instagram (`SOC-002-04`)

**Devices (2):** Vivo V29 (Swati Thakur) (`DEV-002-01`); Samsung Galaxy S24 (Sanjay Desai) (`DEV-002-02`)

**Financial Accounts (5):** Yes •••• 8258 (Swati Thakur) (`ACC-002-01`); Punjab •••• 7582 (Anjali Singh Rathore) (`ACC-002-02`); HDFC •••• 1298 (Manish Bhatt) (`ACC-002-03`); HDFC •••• 8755 (Rohit Iyer) (`ACC-002-04`); ICICI •••• 3852 (Konkan Blue Marine Pvt Ltd) (`ACC-002-05`)

**Criminal Records (3):** FIR/2022/1572 — Naveen Khan (`CR-002-01`); FIR/2021/6774 — Meera Bose (`CR-002-02`); FIR/2020/5883 — Manish Bhatt (`CR-002-03`)

### OP-003 — OPERATION NORTHERN CIRCUIT

**People (23):** Swati Verma (`P-003-001`); Sanjay Kapoor (`P-003-002`); Gaurav Desai (`P-003-003`); Tarun Chauhan (`P-003-004`); Pooja Naidu (`P-003-005`); Aslam Thakur (`P-003-006`); Deepak Desai (`P-003-007`); Manish Sharma (`P-003-008`); Ravi Thakur (`P-003-009`); Ajay Chowdhury (`P-003-010`); Sanjay Desai (`P-003-011`); Aslam Chauhan (`P-003-012`); Gaurav Singh Rathore (`P-003-013`); Priyanka Sharma (`P-003-014`); Naveen Joshi (`P-003-015`); Gaurav Khan (`P-003-016`); Ravi Ali (`P-003-017`); Irfan Mehta (`P-003-018`); Neha Rana (`P-003-019`); Ayesha Mehta (`P-003-020`); Divya Joshi (`P-003-021`); Zaid Reddy (`P-003-022`); Kavita Mehta (`P-003-023`)

**Organizations (3):** Northstar Realty Ventures (`ORG-003-01`); Chandra Buildwell Pvt Ltd (`ORG-003-02`); Apex Benami Holdings (`ORG-003-03`)

**Locations (14):** Pune (`loc-city-01`); Nashik (`loc-city-02`); Thane (`loc-city-03`); Surat (`loc-city-04`); Ahmedabad (`loc-city-05`); Delhi (`loc-city-06`); Nagpur (`loc-city-07`); Connaught Place (`LOC-003-01`); Gurugram Cyber Hub (`LOC-003-02`); Noida Sector 62 (`LOC-003-03`); Chandigarh Sector 17 (`LOC-003-04`); Jaipur Vaishali Nagar (`LOC-003-05`); Faridabad Industrial Estate (`LOC-003-06`); Sonipat Warehouse Cluster (`LOC-003-07`)

**Vehicles (8):** DL-14-BA-8027 (`VEH-003-01`); DL-19-KD-7325 (`VEH-003-02`); DL-32-XA-1058 (`VEH-003-03`); DL-31-BD-7346 (`VEH-003-04`); DL-22-KD-8221 (`VEH-003-05`); DL-18-DB-1506 (`VEH-003-06`); DL-27-KC-4106 (`VEH-003-07`); DL-38-CB-9171 (`VEH-003-08`)

**Documents (4):** SaleDeed_SonipatPlot14.pdf (`DOC-003-01`); BenamiDeclaration_ApexHoldings.pdf (`DOC-003-02`); LoanAgreement_NorthstarRealty.pdf (`DOC-003-03`); ShellCompanyFilings_MCA.pdf (`DOC-003-04`)

**Evidence (6):** Facial match — Swati Verma at Connaught Place (`EVD-003-01`); ANPR capture — DL-14-BA-8027 near Gurugram Cyber Hub (`EVD-003-02`); Flagged transfer chain — 4 suspicious transfers (`EVD-003-03`); SaleDeed_SonipatPlot14.pdf — seized record (`EVD-003-04`); High-frequency call pattern — 23 linked numbers (`EVD-003-05`); Device extraction — Xiaomi Redmi Note 13 (Swati Verma) (`EVD-003-06`)

**CCTV — rendered cameras (7):** CAM-003-01; CAM-003-02; CAM-003-03; CAM-003-04; CAM-003-05; CAM-003-06; CAM-003-07

**Social Media (4):** Swati Verma on Instagram (`SOC-003-01`); Gaurav Singh Rathore on LinkedIn (`SOC-003-02`); Gaurav Khan on Facebook (`SOC-003-03`); Ravi Ali on Instagram (`SOC-003-04`)

**Devices (2):** Xiaomi Redmi Note 13 (Swati Verma) (`DEV-003-01`); Xiaomi Redmi Note 13 (Irfan Mehta) (`DEV-003-02`)

**Financial Accounts (5):** Yes •••• 1822 (Swati Verma) (`ACC-003-01`); Bank •••• 5775 (Pooja Naidu) (`ACC-003-02`); HDFC •••• 3467 (Priyanka Sharma) (`ACC-003-03`); State •••• 4667 (Ravi Ali) (`ACC-003-04`); Bank •••• 5155 (Northstar Realty Ventures) (`ACC-003-05`)

**Criminal Records (3):** FIR/2025/7498 — Priyanka Sharma (`CR-003-01`); FIR/2020/3648 — Manish Sharma (`CR-003-02`); FIR/2025/2752 — Ajay Chowdhury (`CR-003-03`)

### OP-004 — OPERATION SILENT LEDGER

**People (6):** Sunita Sheikh (`P-004-001`); Rajat Mehta (`P-004-002`); Amit Kapoor (`P-004-003`); Kiran Menon (`P-004-004`); Deepak Verma (`P-004-005`); Rakesh Ali (`P-004-006`)

**Organizations (2):** Zenlite BPO Services (`ORG-004-01`); Quickpay Fintech Solutions (`ORG-004-02`)

**Locations (3):** Hinjewadi IT Park (`LOC-004-01`); Nagpur Civil Lines (`LOC-004-02`); Pune Camp (`LOC-004-03`)

**Vehicles (2):** MH-36-CB-3961 (`VEH-004-01`); MH-28-CB-2849 (`VEH-004-02`)

**Documents (3):** ForgedKYC_MuleAccount07.pdf (`DOC-004-01`); MuleAccountOpeningForm.pdf (`DOC-004-02`); ChargeSheet_SilentLedger.pdf (`DOC-004-03`)

**Evidence (6):** Facial match — Sunita Sheikh at Hinjewadi IT Park (`EVD-004-01`); ANPR capture — MH-36-CB-3961 near Nagpur Civil Lines (`EVD-004-02`); Flagged transfer chain — 3 suspicious transfers (`EVD-004-03`); ForgedKYC_MuleAccount07.pdf — seized record (`EVD-004-04`); High-frequency call pattern — 6 linked numbers (`EVD-004-05`); Device extraction — Samsung Galaxy S24 (Sunita Sheikh) (`EVD-004-06`)

**CCTV — rendered cameras (3):** CAM-004-01; CAM-004-02; CAM-004-03

**Social Media (4):** Sunita Sheikh on Telegram (`SOC-004-01`); Rakesh Ali on LinkedIn (`SOC-004-02`); Kiran Menon on X (`SOC-004-03`); Amit Kapoor on Telegram (`SOC-004-04`)

**Devices (2):** Samsung Galaxy S24 (Sunita Sheikh) (`DEV-004-01`); OnePlus 12R (Kiran Menon) (`DEV-004-02`)

**Financial Accounts (5):** HDFC •••• 2353 (Sunita Sheikh) (`ACC-004-01`); ICICI •••• 3540 (Amit Kapoor) (`ACC-004-02`); Bank •••• 5722 (Deepak Verma) (`ACC-004-03`); Punjab •••• 7486 (Kiran Menon) (`ACC-004-04`); Punjab •••• 4879 (Zenlite BPO Services) (`ACC-004-05`)

**Criminal Records (3):** FIR/2019/2770 — Sunita Sheikh (`CR-004-01`); FIR/2021/2978 — Rajat Mehta (`CR-004-02`); FIR/2025/3654 — Deepak Verma (`CR-004-03`)

### OP-005 — OPERATION DESERT ROUTE

**People (10):** Rohit Menon (`P-005-001`); Anil Chauhan (`P-005-002`); Arjun Chowdhury (`P-005-003`); Sanjay Chauhan (`P-005-004`); Salman Pillai (`P-005-005`); Harpreet Pillai (`P-005-006`); Nargis Iyer (`P-005-007`); Zara Verma (`P-005-008`); Suresh Iyer (`P-005-009`); Priyanka Bhatt (`P-005-010`)

**Organizations (2):** Thar Logistics & Carriers (`ORG-005-01`); Rann Exim Trading Co. (`ORG-005-02`)

**Locations (6):** Jodhpur Transport Nagar (`LOC-005-01`); Barmer Border Checkpost (`LOC-005-02`); Kandla Port (`LOC-005-03`); Bhuj Industrial Area (`LOC-005-04`); Ahmedabad Naroda GIDC (`LOC-005-05`); Jaisalmer Transit Camp (`LOC-005-06`)

**Vehicles (3):** RJ-06-BD-1963 (`VEH-005-01`); RJ-04-BC-6912 (`VEH-005-02`); RJ-27-AB-6018 (`VEH-005-03`)

**Documents (3):** TransportPermit_TharLogistics.pdf (`DOC-005-01`); HawalaLedger_Seized.pdf (`DOC-005-02`); CustomsManifest_KandlaPort.pdf (`DOC-005-03`)

**Evidence (6):** Facial match — Rohit Menon at Jodhpur Transport Nagar (`EVD-005-01`); ANPR capture — RJ-06-BD-1963 near Barmer Border Checkpost (`EVD-005-02`); Flagged transfer chain — 3 suspicious transfers (`EVD-005-03`); TransportPermit_TharLogistics.pdf — seized record (`EVD-005-04`); High-frequency call pattern — 10 linked numbers (`EVD-005-05`); Device extraction — Vivo V29 (Rohit Menon) (`EVD-005-06`)

**CCTV — rendered cameras (5):** CAM-005-01; CAM-005-02; CAM-005-03; CAM-005-04; CAM-005-06

**Social Media (4):** Rohit Menon on Telegram (`SOC-005-01`); Anil Chauhan on LinkedIn (`SOC-005-02`); Arjun Chowdhury on Telegram (`SOC-005-03`); Priyanka Bhatt on Facebook (`SOC-005-04`)

**Devices (2):** Vivo V29 (Rohit Menon) (`DEV-005-01`); OnePlus 12R (Sanjay Chauhan) (`DEV-005-02`)

**Financial Accounts (5):** Axis •••• 3675 (Rohit Menon) (`ACC-005-01`); Punjab •••• 1087 (Suresh Iyer) (`ACC-005-02`); HDFC •••• 3725 (Zara Verma) (`ACC-005-03`); Axis •••• 2585 (Nargis Iyer) (`ACC-005-04`); Bank •••• 7370 (Thar Logistics & Carriers) (`ACC-005-05`)

**Criminal Records (3):** FIR/2025/7492 — Rohit Menon (`CR-005-01`); FIR/2023/7517 — Sanjay Chauhan (`CR-005-02`); FIR/2020/2776 — Nargis Iyer (`CR-005-03`)

---

## 16. MUST UPLOAD — images the current UI actually requests

**248 unique files.** These are the only images that any component in the current codebase will ever attempt to load. Everything else in the app renders text, an icon, or an initials/category placeholder.

| Folder | Unique files required | What they are |
|---|---|---|
| `public/images/people/` | 54 | One portrait per person entity (section 2) |
| `public/images/locations/` | 39 | One photo per location entity (section 4) |
| `public/images/documents/` | 17 | One scan/preview per document (section 6) |
| `public/images/evidence/` | 32 | One photo per evidence item, forensic items included (sections 12–13) |
| `public/images/cctv/` | 29 (cameras) + 55 (events) + 22 (face frames) = 106 | Section 7 &amp; 8 — see the dedup note below |

**Dedup note on CCTV (important — see instruction #8):** the code requests 106 *distinct filenames* under `public/images/cctv/` because each camera, each CCTV event, and each face-detection frame is looked up by its own ID. But there are only 29 physically distinct camera scenes. You do **not** need to create 106 unique photographs — generate one realistic CCTV-style still per **camera** (29 images, using the prompts in section 18), then save **copies of that same file** under every event-id and frame-id filename that belongs to that camera (the mapping of which event/frame IDs belong to which camera is in sections 7 and 8's tables). That gets you full coverage with 29 actual pieces of art, saved 106 times under different names.

So the **true unique-art count** for CCTV is 29, not 106 — reflected in the final unique-image total in section 19.

## 17. OPTIONAL — could improve the UI, but nothing renders them today

Both items below have a working `imageAssets.ts` helper function already, but **zero call sites** — uploading these files today would have **no visible effect whatsoever**, because no component ever calls the helper that would load them. They'd only start mattering if a future code change added a render call site, which is outside this task's "don't modify the application" instruction. Listed here only because the user's brief asked for an OPTIONAL bucket distinct from MUST UPLOAD and NO IMAGE NEEDED.

- **`public/images/vehicles/`** — 20 files, pattern `{slug}-{vehicle-id}.jpg`, via `vehicleImage()`. No vehicle detail view exists to display them.
- **`public/images/cases/`** — 5 files, pattern `operation-{case-slug}.jpg`, via `caseCoverImage()`. `CaseCard` on the Cases dashboard uses icon tiles, not cover photos.

## NO IMAGE NEEDED — entities represented entirely through text/icons

- **Organizations (11)** — no helper exists; shown via a generic `Building2` icon in the Network Graph, plain text everywhere else.
- **Phones (55)** — no helper exists; shown as masked numbers in Call Records / dossier metadata only.
- **Devices (9)** — no helper exists; shown as plain text in Forensics/Evidence titles only.
- **Social Media Profiles, Financial Accounts, Criminal Records** — *do* show an image, but always by reusing an existing person photo (sections 9, 11, 14) — they never need a unique file of their own.

---

## 18. Exact `public/images/` Folder Structure

These are the exact filenames the code will look for — one line per file, using the same naming convention `imageAssets.ts` already defines (`{slug}-{entity-id}.jpg` for people/locations/vehicles/documents; `{id}.jpg` for evidence/cctv). Do not invent a second convention.

```
public/
└── images/
    ├── people/                          (54 files — MUST UPLOAD)
    │   ├── arjun-malhotra-p-0042.jpg
    │   ├── rajat-verma-p-0043.jpg
    │   ├── priyanka-nair-p-0044.jpg
    │   ├── unidentified-male-unknown-07-p-0045.jpg
    │   ├── vikram-singh-rathore-p-0046.jpg
    │   ├── sana-ali-p-0047.jpg
    │   ├── deepak-chauhan-p-0048.jpg
    │   ├── swati-thakur-p-002-001.jpg
    │   ├── manish-bhatt-p-002-002.jpg
    │   ├── meera-bose-p-002-003.jpg
    │   ├── sanjay-desai-p-002-004.jpg
    │   ├── naveen-khan-p-002-005.jpg
    │   ├── rohit-iyer-p-002-006.jpg
    │   ├── anjali-singh-rathore-p-002-007.jpg
    │   ├── harpreet-khan-p-002-008.jpg
    │   ├── swati-verma-p-003-001.jpg
    │   ├── sanjay-kapoor-p-003-002.jpg
    │   ├── gaurav-desai-p-003-003.jpg
    │   ├── tarun-chauhan-p-003-004.jpg
    │   ├── pooja-naidu-p-003-005.jpg
    │   ├── aslam-thakur-p-003-006.jpg
    │   ├── deepak-desai-p-003-007.jpg
    │   ├── manish-sharma-p-003-008.jpg
    │   ├── ravi-thakur-p-003-009.jpg
    │   ├── ajay-chowdhury-p-003-010.jpg
    │   ├── sanjay-desai-p-003-011.jpg
    │   ├── aslam-chauhan-p-003-012.jpg
    │   ├── gaurav-singh-rathore-p-003-013.jpg
    │   ├── priyanka-sharma-p-003-014.jpg
    │   ├── naveen-joshi-p-003-015.jpg
    │   ├── gaurav-khan-p-003-016.jpg
    │   ├── ravi-ali-p-003-017.jpg
    │   ├── irfan-mehta-p-003-018.jpg
    │   ├── neha-rana-p-003-019.jpg
    │   ├── ayesha-mehta-p-003-020.jpg
    │   ├── divya-joshi-p-003-021.jpg
    │   ├── zaid-reddy-p-003-022.jpg
    │   ├── kavita-mehta-p-003-023.jpg
    │   ├── sunita-sheikh-p-004-001.jpg
    │   ├── rajat-mehta-p-004-002.jpg
    │   ├── amit-kapoor-p-004-003.jpg
    │   ├── kiran-menon-p-004-004.jpg
    │   ├── deepak-verma-p-004-005.jpg
    │   ├── rakesh-ali-p-004-006.jpg
    │   ├── rohit-menon-p-005-001.jpg
    │   ├── anil-chauhan-p-005-002.jpg
    │   ├── arjun-chowdhury-p-005-003.jpg
    │   ├── sanjay-chauhan-p-005-004.jpg
    │   ├── salman-pillai-p-005-005.jpg
    │   ├── harpreet-pillai-p-005-006.jpg
    │   ├── nargis-iyer-p-005-007.jpg
    │   ├── zara-verma-p-005-008.jpg
    │   ├── suresh-iyer-p-005-009.jpg
    │   ├── priyanka-bhatt-p-005-010.jpg
    │
    ├── locations/                       (39 files — MUST UPLOAD)
    │   ├── bandra-west-loc-001.jpg
    │   ├── andheri-east-loc-002.jpg
    │   ├── lower-parel-loc-003.jpg
    │   ├── colaba-loc-004.jpg
    │   ├── malad-west-loc-005.jpg
    │   ├── chembur-loc-006.jpg
    │   ├── powai-loc-007.jpg
    │   ├── dockyard-road-loc-008.jpg
    │   ├── kurla-loc-009.jpg
    │   ├── vashi-loc-010.jpg
    │   ├── pune-loc-city-01.jpg
    │   ├── nashik-loc-city-02.jpg
    │   ├── thane-loc-city-03.jpg
    │   ├── surat-loc-city-04.jpg
    │   ├── ahmedabad-loc-city-05.jpg
    │   ├── delhi-loc-city-06.jpg
    │   ├── nagpur-loc-city-07.jpg
    │   ├── ratnagiri-fishing-harbour-loc-002-01.jpg
    │   ├── malvan-jetty-loc-002-02.jpg
    │   ├── vengurla-creek-loc-002-03.jpg
    │   ├── devgad-market-road-loc-002-04.jpg
    │   ├── guhagar-residency-loc-002-05.jpg
    │   ├── sawantwadi-transit-yard-loc-002-06.jpg
    │   ├── connaught-place-loc-003-01.jpg
    │   ├── gurugram-cyber-hub-loc-003-02.jpg
    │   ├── noida-sector-62-loc-003-03.jpg
    │   ├── chandigarh-sector-17-loc-003-04.jpg
    │   ├── jaipur-vaishali-nagar-loc-003-05.jpg
    │   ├── faridabad-industrial-estate-loc-003-06.jpg
    │   ├── sonipat-warehouse-cluster-loc-003-07.jpg
    │   ├── hinjewadi-it-park-loc-004-01.jpg
    │   ├── nagpur-civil-lines-loc-004-02.jpg
    │   ├── pune-camp-loc-004-03.jpg
    │   ├── jodhpur-transport-nagar-loc-005-01.jpg
    │   ├── barmer-border-checkpost-loc-005-02.jpg
    │   ├── kandla-port-loc-005-03.jpg
    │   ├── bhuj-industrial-area-loc-005-04.jpg
    │   ├── ahmedabad-naroda-gidc-loc-005-05.jpg
    │   ├── jaisalmer-transit-camp-loc-005-06.jpg
    │
    ├── documents/                       (17 files — MUST UPLOAD)
    │   ├── aadhaar-arjunmalhotra-doc-01.jpg
    │   ├── hdfc-statementq2-arjunmalhotra-doc-02.jpg
    │   ├── freightcontract-meridiankonnect-doc-03.jpg
    │   ├── leaseagreement-chemburwarehouse-doc-04.jpg
    │   ├── boatregistration-sagarkanya2-doc-002-01.jpg
    │   ├── exportlicence-konkanbluemarine-doc-002-02.jpg
    │   ├── fuelledger-q3-doc-002-03.jpg
    │   ├── saledeed-sonipatplot14-doc-003-01.jpg
    │   ├── benamideclaration-apexholdings-doc-003-02.jpg
    │   ├── loanagreement-northstarrealty-doc-003-03.jpg
    │   ├── shellcompanyfilings-mca-doc-003-04.jpg
    │   ├── forgedkyc-muleaccount07-doc-004-01.jpg
    │   ├── muleaccountopeningform-doc-004-02.jpg
    │   ├── chargesheet-silentledger-doc-004-03.jpg
    │   ├── transportpermit-tharlogistics-doc-005-01.jpg
    │   ├── hawalaledger-seized-doc-005-02.jpg
    │   ├── customsmanifest-kandlaport-doc-005-03.jpg
    │
    ├── evidence/                        (32 files — MUST UPLOAD)
    │   ├── ev-001.jpg
    │   ├── ev-002.jpg
    │   ├── ev-003.jpg
    │   ├── ev-004.jpg
    │   ├── ev-005.jpg
    │   ├── ev-006.jpg
    │   ├── ev-007.jpg
    │   ├── ev-008.jpg
    │   ├── evd-002-01.jpg
    │   ├── evd-002-02.jpg
    │   ├── evd-002-03.jpg
    │   ├── evd-002-04.jpg
    │   ├── evd-002-05.jpg
    │   ├── evd-002-06.jpg
    │   ├── evd-003-01.jpg
    │   ├── evd-003-02.jpg
    │   ├── evd-003-03.jpg
    │   ├── evd-003-04.jpg
    │   ├── evd-003-05.jpg
    │   ├── evd-003-06.jpg
    │   ├── evd-004-01.jpg
    │   ├── evd-004-02.jpg
    │   ├── evd-004-03.jpg
    │   ├── evd-004-04.jpg
    │   ├── evd-004-05.jpg
    │   ├── evd-004-06.jpg
    │   ├── evd-005-01.jpg
    │   ├── evd-005-02.jpg
    │   ├── evd-005-03.jpg
    │   ├── evd-005-04.jpg
    │   ├── evd-005-05.jpg
    │   ├── evd-005-06.jpg
    │
    ├── cctv/                            (106 filenames — MUST UPLOAD, but only 29 unique pieces of art; see §16)
    │   ├── (29 camera base images — create these; then copy/rename per event & frame id below)
    │   │   ├── cam-bw02.jpg
    │   │   ├── cam-bw12.jpg
    │   │   ├── cam-aw09.jpg
    │   │   ├── cam-lw07.jpg
    │   │   ├── cam-oe11.jpg
    │   │   ├── cam-ch03.jpg
    │   │   ├── cam-pw08.jpg
    │   │   ├── cam-dr02.jpg
    │   │   ├── cam-kr06.jpg
    │   │   ├── cam-002-01.jpg
    │   │   ├── cam-002-02.jpg
    │   │   ├── cam-002-03.jpg
    │   │   ├── cam-002-04.jpg
    │   │   ├── cam-002-06.jpg
    │   │   ├── cam-003-01.jpg
    │   │   ├── cam-003-02.jpg
    │   │   ├── cam-003-03.jpg
    │   │   ├── cam-003-04.jpg
    │   │   ├── cam-003-05.jpg
    │   │   ├── cam-003-06.jpg
    │   │   ├── cam-003-07.jpg
    │   │   ├── cam-004-01.jpg
    │   │   ├── cam-004-02.jpg
    │   │   ├── cam-004-03.jpg
    │   │   ├── cam-005-01.jpg
    │   │   ├── cam-005-02.jpg
    │   │   ├── cam-005-03.jpg
    │   │   ├── cam-005-04.jpg
    │   │   ├── cam-005-06.jpg
    │   ├── (55 CCTV-event filenames — copy the owning camera's image under each of these names)
    │   │   ├── ce-001.jpg
    │   │   ├── ce-002.jpg
    │   │   ├── ce-003.jpg
    │   │   ├── ce-004.jpg
    │   │   ├── ce-005.jpg
    │   │   ├── ce-006.jpg
    │   │   ├── ce-007.jpg
    │   │   ├── ce-008.jpg
    │   │   ├── ce-009.jpg
    │   │   ├── ce-010.jpg
    │   │   ├── ce-011.jpg
    │   │   ├── ce-012.jpg
    │   │   ├── ce-002-04.jpg
    │   │   ├── ce-002-01.jpg
    │   │   ├── ce-002-07.jpg
    │   │   ├── ce-002-02.jpg
    │   │   ├── ce-002-06.jpg
    │   │   ├── ce-002-03.jpg
    │   │   ├── ce-002-05.jpg
    │   │   ├── ce-003-06.jpg
    │   │   ├── ce-003-21.jpg
    │   │   ├── ce-003-15.jpg
    │   │   ├── ce-003-16.jpg
    │   │   ├── ce-003-18.jpg
    │   │   ├── ce-003-13.jpg
    │   │   ├── ce-003-01.jpg
    │   │   ├── ce-003-20.jpg
    │   │   ├── ce-003-19.jpg
    │   │   ├── ce-003-14.jpg
    │   │   ├── ce-003-04.jpg
    │   │   ├── ce-003-08.jpg
    │   │   ├── ce-003-03.jpg
    │   │   ├── ce-003-10.jpg
    │   │   ├── ce-003-09.jpg
    │   │   ├── ce-003-12.jpg
    │   │   ├── ce-003-11.jpg
    │   │   ├── ce-003-05.jpg
    │   │   ├── ce-003-17.jpg
    │   │   ├── ce-003-07.jpg
    │   │   ├── ce-003-02.jpg
    │   │   ├── ce-004-04.jpg
    │   │   ├── ce-004-06.jpg
    │   │   ├── ce-004-02.jpg
    │   │   ├── ce-004-03.jpg
    │   │   ├── ce-004-05.jpg
    │   │   ├── ce-004-01.jpg
    │   │   ├── ce-005-06.jpg
    │   │   ├── ce-005-02.jpg
    │   │   ├── ce-005-09.jpg
    │   │   ├── ce-005-04.jpg
    │   │   ├── ce-005-01.jpg
    │   │   ├── ce-005-03.jpg
    │   │   ├── ce-005-07.jpg
    │   │   ├── ce-005-05.jpg
    │   │   ├── ce-005-08.jpg
    │   └── (22 face-detection-frame filenames — copy the owning camera's image under each of these names)
    │       ├── f-88231.jpg
    │       ├── f-88245.jpg
    │       ├── f-40021.jpg
    │       ├── f-11209.jpg
    │       ├── f-77021.jpg
    │       ├── f-65510.jpg
    │       ├── f-30014.jpg
    │       ├── f-58476.jpg
    │       ├── f-64784.jpg
    │       ├── f-47616.jpg
    │       ├── f-36326.jpg
    │       ├── f-15450.jpg
    │       ├── f-40987.jpg
    │       ├── f-97850.jpg
    │       ├── f-21336.jpg
    │       ├── f-52350.jpg
    │       ├── f-62401.jpg
    │       ├── f-83995.jpg
    │       ├── f-16456.jpg
    │       ├── f-79211.jpg
    │       ├── f-84903.jpg
    │       ├── f-39725.jpg
    │
    ├── vehicles/                        (OPTIONAL — 0 required, no render call site today)
    │
    └── cases/                           (OPTIONAL — 0 required, no render call site today)
```

---

## 19. Ready-to-Use Image-Generation Prompts

One prompt per **unique piece of art** (171 total: 54 people + 39 locations + 17 documents + 32 evidence + 29 CCTV camera scenes). All prompts share a consistent "realistic, documentary/dossier photography, fictional content only" style so the finished app feels like one coherent database. None of these describe a real person, a real document, or a real place's actual surveillance footage — every prompt is written to produce an entirely fictional, generic likeness.

### PEOPLE (54)

#### 001 — arjun-malhotra-p-0042.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Criminal Records — subject row + record detail; Face Recognition — match card

**Subject:** Arjun Malhotra (aliases: AJ, Malhotra Bhai)

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-30s, wearing a dark blazer over an open-collar shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 002 — rajat-verma-p-0043.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Criminal Records — subject row + record detail; Face Recognition — match card

**Subject:** Rajat Verma (aliases: Raju)

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-30s, wearing a plain collared shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 003 — priyanka-nair-p-0044.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Face Recognition — match card

**Subject:** Priyanka Nair

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-30s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 004 — unidentified-male-unknown-07-p-0045.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Unidentified Male (UNKNOWN_07) (aliases: UNKNOWN_07)

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-30s, wearing a plain collared shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 005 — vikram-singh-rathore-p-0046.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Criminal Records — subject row + record detail; Face Recognition — match card

**Subject:** Vikram Singh Rathore (aliases: Thakur)

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-40s, wearing a dark blazer over an open-collar shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 006 — sana-ali-p-0047.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Criminal Records — subject row + record detail

**Subject:** Sana Ali

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-30s, wearing a simple kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 007 — deepak-chauhan-p-0048.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Deepak Chauhan (aliases: Deepu)

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-40s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 008 — swati-thakur-p-002-001.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Face Recognition — match card

**Subject:** Swati Thakur

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their mid-50s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 009 — manish-bhatt-p-002-002.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Criminal Records — subject row + record detail

**Subject:** Manish Bhatt

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-30s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 010 — meera-bose-p-002-003.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Social Media — profile list + profile overview; Criminal Records — subject row + record detail

**Subject:** Meera Bose

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their late-40s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 011 — sanjay-desai-p-002-004.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Sanjay Desai

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-50s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 012 — naveen-khan-p-002-005.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Criminal Records — subject row + record detail

**Subject:** Naveen Khan

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-20s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 013 — rohit-iyer-p-002-006.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview

**Subject:** Rohit Iyer

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-40s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 014 — anjali-singh-rathore-p-002-007.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Financial — account owner avatar

**Subject:** Anjali Singh Rathore

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their late-30s, wearing a simple office shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 015 — harpreet-khan-p-002-008.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Harpreet Khan

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-50s, wearing a simple office shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 016 — swati-verma-p-003-001.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Face Recognition — match card

**Subject:** Swati Verma

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their mid-30s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 017 — sanjay-kapoor-p-003-002.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Sanjay Kapoor

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-30s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 018 — gaurav-desai-p-003-003.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Gaurav Desai

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-20s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 019 — tarun-chauhan-p-003-004.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Tarun Chauhan

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-50s, wearing a dark blazer over an open-collar shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 020 — pooja-naidu-p-003-005.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar

**Subject:** Pooja Naidu

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their mid-30s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 021 — aslam-thakur-p-003-006.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Aslam Thakur

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-30s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 022 — deepak-desai-p-003-007.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Deepak Desai

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-40s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 023 — manish-sharma-p-003-008.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Criminal Records — subject row + record detail; Face Recognition — match card

**Subject:** Manish Sharma

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-40s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 024 — ravi-thakur-p-003-009.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Ravi Thakur

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-50s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 025 — ajay-chowdhury-p-003-010.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Criminal Records — subject row + record detail; Face Recognition — match card

**Subject:** Ajay Chowdhury

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-40s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 026 — sanjay-desai-p-003-011.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Sanjay Desai

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-40s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 027 — aslam-chauhan-p-003-012.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Aslam Chauhan

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-30s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 028 — gaurav-singh-rathore-p-003-013.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Social Media — profile list + profile overview

**Subject:** Gaurav Singh Rathore

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-40s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 029 — priyanka-sharma-p-003-014.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Financial — account owner avatar; Criminal Records — subject row + record detail; Face Recognition — match card

**Subject:** Priyanka Sharma

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-50s, wearing a dark blazer over a formal blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 030 — naveen-joshi-p-003-015.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Naveen Joshi

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-50s, wearing a dark blazer over an open-collar shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 031 — gaurav-khan-p-003-016.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Social Media — profile list + profile overview

**Subject:** Gaurav Khan

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-30s, wearing a simple office shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 032 — ravi-ali-p-003-017.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Financial — account owner avatar; Social Media — profile list + profile overview

**Subject:** Ravi Ali

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-40s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 033 — irfan-mehta-p-003-018.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Irfan Mehta

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-50s, wearing a dark blazer over an open-collar shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 034 — neha-rana-p-003-019.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Neha Rana

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their late-20s, wearing a simple office shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 035 — ayesha-mehta-p-003-020.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Ayesha Mehta

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-50s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 036 — divya-joshi-p-003-021.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Divya Joshi

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-30s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 037 — zaid-reddy-p-003-022.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Face Recognition — match card

**Subject:** Zaid Reddy

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-40s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 038 — kavita-mehta-p-003-023.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected)

**Subject:** Kavita Mehta

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-40s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 039 — sunita-sheikh-p-004-001.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Criminal Records — subject row + record detail

**Subject:** Sunita Sheikh

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their mid-30s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 040 — rajat-mehta-p-004-002.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Criminal Records — subject row + record detail

**Subject:** Rajat Mehta

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-30s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 041 — amit-kapoor-p-004-003.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview

**Subject:** Amit Kapoor

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-40s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 042 — kiran-menon-p-004-004.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview

**Subject:** Kiran Menon

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-30s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 043 — deepak-verma-p-004-005.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Criminal Records — subject row + record detail

**Subject:** Deepak Verma

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-20s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 044 — rakesh-ali-p-004-006.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Social Media — profile list + profile overview

**Subject:** Rakesh Ali

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their early-40s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 045 — rohit-menon-p-005-001.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Financial — account owner avatar; Social Media — profile list + profile overview; Criminal Records — subject row + record detail; Face Recognition — match card

**Subject:** Rohit Menon

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-50s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 046 — anil-chauhan-p-005-002.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Social Media — profile list + profile overview

**Subject:** Anil Chauhan

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-40s, wearing a dark blazer over an open-collar shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 047 — arjun-chowdhury-p-005-003.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Social Media — profile list + profile overview; Face Recognition — match card

**Subject:** Arjun Chowdhury

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-30s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 048 — sanjay-chauhan-p-005-004.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People; Criminal Records — subject row + record detail

**Subject:** Sanjay Chauhan

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-40s, wearing a dark blazer over an open-collar shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 049 — salman-pillai-p-005-005.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Salman Pillai

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-50s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 050 — harpreet-pillai-p-005-006.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Case Overview — Key People

**Subject:** Harpreet Pillai

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their late-20s, wearing a checked or plain button-down shirt, sleeves rolled, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 051 — nargis-iyer-p-005-007.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Financial — account owner avatar; Criminal Records — subject row + record detail

**Subject:** Nargis Iyer

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their mid-30s, wearing a formal kurta or blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 052 — zara-verma-p-005-008.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Financial — account owner avatar

**Subject:** Zara Verma

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their mid-30s, wearing a dark blazer over a formal blouse, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 053 — suresh-iyer-p-005-009.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Financial — account owner avatar

**Subject:** Suresh Iyer

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian man in their mid-30s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

#### 054 — priyanka-bhatt-p-005-010.jpg

**Used for:** Person Dossier header; Network Graph (entity detail panel, when selected); Social Media — profile list + profile overview

**Subject:** Priyanka Bhatt

**Prompt:**
> Photorealistic intelligence-database headshot of a fictional Indian woman in their early-30s, wearing a plain collared work shirt, front-facing ID-card/dossier-style portrait, neutral light-grey studio background, soft even lighting, calm neutral expression, direct eye contact with the camera, head-and-shoulders framing, high detail realistic photography, 50mm lens look. This is a wholly fictional character generated for a crime-investigation demo application — not a real person, no text, no watermark, no logo.

---

### LOCATIONS (39)

#### 055 — bandra-west-loc-001.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Bandra West (Mumbai) — category: residential

**Prompt:**
> Realistic street-level photograph of a residential apartment building entrance in Mumbai, India — urban Indian residential architecture, parked two-wheelers, daytime, documentary/investigative photography style, muted realistic color grading, no identifiable faces.

#### 056 — andheri-east-loc-002.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Andheri East (Mumbai) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Mumbai, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 057 — lower-parel-loc-003.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Lower Parel (Mumbai) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Mumbai, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 058 — colaba-loc-004.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Colaba (Mumbai) — category: port_area

**Prompt:**
> Realistic photograph of a working Indian fishing harbour / small port near Mumbai — wooden fishing trawlers, nets, a jetty, overcast coastal light, documentary photography style, muted color grading.

#### 059 — malad-west-loc-005.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Malad West (Mumbai) — category: residential

**Prompt:**
> Realistic street-level photograph of a residential apartment building entrance in Mumbai, India — urban Indian residential architecture, parked two-wheelers, daytime, documentary/investigative photography style, muted realistic color grading, no identifiable faces.

#### 060 — chembur-loc-006.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Chembur (Mumbai) — category: industrial

**Prompt:**
> Realistic ground-level photograph of an industrial estate / warehouse gate in Mumbai, India — corrugated metal sheds, a parked cargo truck, chain-link fencing, overcast daylight, documentary photography style.

#### 061 — powai-loc-007.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Powai (Mumbai) — category: residential

**Prompt:**
> Realistic street-level photograph of a residential apartment building entrance in Mumbai, India — urban Indian residential architecture, parked two-wheelers, daytime, documentary/investigative photography style, muted realistic color grading, no identifiable faces.

#### 062 — dockyard-road-loc-008.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Dockyard Road (Mumbai) — category: port_area

**Prompt:**
> Realistic photograph of a working Indian fishing harbour / small port near Mumbai — wooden fishing trawlers, nets, a jetty, overcast coastal light, documentary photography style, muted color grading.

#### 063 — kurla-loc-009.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Kurla (Mumbai) — category: transit_hub

**Prompt:**
> Realistic photograph of a transport nagar / truck and cargo transit yard in Mumbai, India — parked freight trucks, a dusty yard, warehouses in the background, late-afternoon light, documentary photography style.

#### 064 — vashi-loc-010.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Vashi (Mumbai) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Mumbai, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 065 — pune-loc-city-01.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Pune (Pune) — category: city

**Prompt:**
> Realistic wide establishing photograph of Pune, India — a representative street or skyline view capturing the city's character, daylight, documentary photography style, muted realistic color grading.

#### 066 — nashik-loc-city-02.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Nashik (Nashik) — category: city

**Prompt:**
> Realistic wide establishing photograph of Nashik, India — a representative street or skyline view capturing the city's character, daylight, documentary photography style, muted realistic color grading.

#### 067 — thane-loc-city-03.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Thane (Thane) — category: city

**Prompt:**
> Realistic wide establishing photograph of Thane, India — a representative street or skyline view capturing the city's character, daylight, documentary photography style, muted realistic color grading.

#### 068 — surat-loc-city-04.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Surat (Surat) — category: city

**Prompt:**
> Realistic wide establishing photograph of Surat, India — a representative street or skyline view capturing the city's character, daylight, documentary photography style, muted realistic color grading.

#### 069 — ahmedabad-loc-city-05.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Ahmedabad (Ahmedabad) — category: city

**Prompt:**
> Realistic wide establishing photograph of Ahmedabad, India — a representative street or skyline view capturing the city's character, daylight, documentary photography style, muted realistic color grading.

#### 070 — delhi-loc-city-06.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Delhi (Delhi) — category: city

**Prompt:**
> Realistic wide establishing photograph of Delhi, India — a representative street or skyline view capturing the city's character, daylight, documentary photography style, muted realistic color grading.

#### 071 — nagpur-loc-city-07.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Nagpur (Nagpur) — category: city

**Prompt:**
> Realistic wide establishing photograph of Nagpur, India — a representative street or skyline view capturing the city's character, daylight, documentary photography style, muted realistic color grading.

#### 072 — ratnagiri-fishing-harbour-loc-002-01.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Ratnagiri Fishing Harbour (Ratnagiri) — category: port_area

**Prompt:**
> Realistic photograph of a working Indian fishing harbour / small port near Ratnagiri — wooden fishing trawlers, nets, a jetty, overcast coastal light, documentary photography style, muted color grading.

#### 073 — malvan-jetty-loc-002-02.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Malvan Jetty (Malvan) — category: port_area

**Prompt:**
> Realistic photograph of a working Indian fishing harbour / small port near Malvan — wooden fishing trawlers, nets, a jetty, overcast coastal light, documentary photography style, muted color grading.

#### 074 — vengurla-creek-loc-002-03.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Vengurla Creek (Vengurla) — category: port_area

**Prompt:**
> Realistic photograph of a working Indian fishing harbour / small port near Vengurla — wooden fishing trawlers, nets, a jetty, overcast coastal light, documentary photography style, muted color grading.

#### 075 — devgad-market-road-loc-002-04.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Devgad Market Road (Devgad) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Devgad, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 076 — guhagar-residency-loc-002-05.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Guhagar Residency (Guhagar) — category: residential

**Prompt:**
> Realistic street-level photograph of a residential apartment building entrance in Guhagar, India — urban Indian residential architecture, parked two-wheelers, daytime, documentary/investigative photography style, muted realistic color grading, no identifiable faces.

#### 077 — sawantwadi-transit-yard-loc-002-06.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Sawantwadi Transit Yard (Sawantwadi) — category: transit_hub

**Prompt:**
> Realistic photograph of a transport nagar / truck and cargo transit yard in Sawantwadi, India — parked freight trucks, a dusty yard, warehouses in the background, late-afternoon light, documentary photography style.

#### 078 — connaught-place-loc-003-01.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Connaught Place (Connaught) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Connaught, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 079 — gurugram-cyber-hub-loc-003-02.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Gurugram Cyber Hub (Gurugram) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Gurugram, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 080 — noida-sector-62-loc-003-03.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Noida Sector 62 (Noida) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Noida, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 081 — chandigarh-sector-17-loc-003-04.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Chandigarh Sector 17 (Chandigarh) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Chandigarh, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 082 — jaipur-vaishali-nagar-loc-003-05.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Jaipur Vaishali Nagar (Jaipur) — category: residential

**Prompt:**
> Realistic street-level photograph of a residential apartment building entrance in Jaipur, India — urban Indian residential architecture, parked two-wheelers, daytime, documentary/investigative photography style, muted realistic color grading, no identifiable faces.

#### 083 — faridabad-industrial-estate-loc-003-06.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Faridabad Industrial Estate (Faridabad) — category: industrial

**Prompt:**
> Realistic ground-level photograph of an industrial estate / warehouse gate in Faridabad, India — corrugated metal sheds, a parked cargo truck, chain-link fencing, overcast daylight, documentary photography style.

#### 084 — sonipat-warehouse-cluster-loc-003-07.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Sonipat Warehouse Cluster (Sonipat) — category: industrial

**Prompt:**
> Realistic ground-level photograph of an industrial estate / warehouse gate in Sonipat, India — corrugated metal sheds, a parked cargo truck, chain-link fencing, overcast daylight, documentary photography style.

#### 085 — hinjewadi-it-park-loc-004-01.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Hinjewadi IT Park (Hinjewadi) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Hinjewadi, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 086 — nagpur-civil-lines-loc-004-02.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Nagpur Civil Lines (Nagpur) — category: residential

**Prompt:**
> Realistic street-level photograph of a residential apartment building entrance in Nagpur, India — urban Indian residential architecture, parked two-wheelers, daytime, documentary/investigative photography style, muted realistic color grading, no identifiable faces.

#### 087 — pune-camp-loc-004-03.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Pune Camp (Pune) — category: commercial

**Prompt:**
> Realistic street-level photograph of a busy commercial district in Pune, India — shopfronts, office signage, pedestrians and traffic, daytime, documentary photography style, muted realistic color grading, no identifiable faces.

#### 088 — jodhpur-transport-nagar-loc-005-01.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Jodhpur Transport Nagar (Jodhpur) — category: transit_hub

**Prompt:**
> Realistic photograph of a transport nagar / truck and cargo transit yard in Jodhpur, India — parked freight trucks, a dusty yard, warehouses in the background, late-afternoon light, documentary photography style.

#### 089 — barmer-border-checkpost-loc-005-02.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Barmer Border Checkpost (Barmer) — category: border_checkpoint

**Prompt:**
> Realistic photograph of a highway border checkpost in Barmer, India — a barrier/boom gate, a sentry booth, a small Indian flag, arid landscape in the background, daylight, documentary photography style.

#### 090 — kandla-port-loc-005-03.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Kandla Port (Kandla) — category: port_area

**Prompt:**
> Realistic photograph of a working Indian fishing harbour / small port near Kandla — wooden fishing trawlers, nets, a jetty, overcast coastal light, documentary photography style, muted color grading.

#### 091 — bhuj-industrial-area-loc-005-04.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Bhuj Industrial Area (Bhuj) — category: industrial

**Prompt:**
> Realistic ground-level photograph of an industrial estate / warehouse gate in Bhuj, India — corrugated metal sheds, a parked cargo truck, chain-link fencing, overcast daylight, documentary photography style.

#### 092 — ahmedabad-naroda-gidc-loc-005-05.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Ahmedabad Naroda GIDC (Ahmedabad) — category: industrial

**Prompt:**
> Realistic ground-level photograph of an industrial estate / warehouse gate in Ahmedabad, India — corrugated metal sheds, a parked cargo truck, chain-link fencing, overcast daylight, documentary photography style.

#### 093 — jaisalmer-transit-camp-loc-005-06.jpg

**Used for:** Locations page detail panel (large callout image); Network Graph location entity detail panel

**Subject:** Jaisalmer Transit Camp (Jaisalmer) — category: transit_hub

**Prompt:**
> Realistic photograph of a transport nagar / truck and cargo transit yard in Jaisalmer, India — parked freight trucks, a dusty yard, warehouses in the background, late-afternoon light, documentary photography style.

---

### DOCUMENTS (17)

#### 094 — aadhaar-arjunmalhotra-doc-01.jpg

**Used for:** Documents library list thumbnail

**Subject:** Aadhaar_ArjunMalhotra.pdf (type: identity)

**Prompt:**
> Realistic photograph of a fictional Indian government-style identity document (Aadhaar-card-like layout) lying on a neutral desk surface, evidence-photography lighting with a slight glare, sensitive numbers subtly blurred/redacted, entirely fictional placeholder content, no real government emblem or seal, no real person's photo on the card.

#### 095 — hdfc-statementq2-arjunmalhotra-doc-02.jpg

**Used for:** Documents library list thumbnail

**Subject:** HDFC_StatementQ2_ArjunMalhotra.pdf (type: financial)

**Prompt:**
> Realistic photograph of a printed bank statement page on a desk, rows of transaction entries, a bank logo area left generic/blurred, evidence-photography overhead lighting, slight paper texture and shadow, fictional placeholder numbers only.

#### 096 — freightcontract-meridiankonnect-doc-03.jpg

**Used for:** Documents library list thumbnail

**Subject:** FreightContract_MeridianKonnect.pdf (type: contract)

**Prompt:**
> Realistic photograph of a printed multi-page legal/commercial contract document on a desk, visible paragraph text (illegible at a glance), a signature block with a pen resting beside it, evidence-photography lighting, fictional placeholder content only.

#### 097 — leaseagreement-chemburwarehouse-doc-04.jpg

**Used for:** Documents library list thumbnail

**Subject:** LeaseAgreement_ChemburWarehouse.pdf (type: property)

**Prompt:**
> Realistic photograph of a stamped property/sale-deed style legal document on a desk, official-looking stamp-paper texture, a red wax-seal or notary stamp impression, evidence-photography lighting, fictional placeholder content only.

#### 098 — boatregistration-sagarkanya2-doc-002-01.jpg

**Used for:** Documents library list thumbnail

**Subject:** BoatRegistration_SagarKanya2.pdf (type: identity)

**Prompt:**
> Realistic photograph of a fictional Indian government-style identity document (Aadhaar-card-like layout) lying on a neutral desk surface, evidence-photography lighting with a slight glare, sensitive numbers subtly blurred/redacted, entirely fictional placeholder content, no real government emblem or seal, no real person's photo on the card.

#### 099 — exportlicence-konkanbluemarine-doc-002-02.jpg

**Used for:** Documents library list thumbnail

**Subject:** ExportLicence_KonkanBlueMarine.pdf (type: contract)

**Prompt:**
> Realistic photograph of a printed multi-page legal/commercial contract document on a desk, visible paragraph text (illegible at a glance), a signature block with a pen resting beside it, evidence-photography lighting, fictional placeholder content only.

#### 100 — fuelledger-q3-doc-002-03.jpg

**Used for:** Documents library list thumbnail

**Subject:** FuelLedger_Q3.pdf (type: financial)

**Prompt:**
> Realistic photograph of a printed bank statement page on a desk, rows of transaction entries, a bank logo area left generic/blurred, evidence-photography overhead lighting, slight paper texture and shadow, fictional placeholder numbers only.

#### 101 — saledeed-sonipatplot14-doc-003-01.jpg

**Used for:** Documents library list thumbnail

**Subject:** SaleDeed_SonipatPlot14.pdf (type: property)

**Prompt:**
> Realistic photograph of a stamped property/sale-deed style legal document on a desk, official-looking stamp-paper texture, a red wax-seal or notary stamp impression, evidence-photography lighting, fictional placeholder content only.

#### 102 — benamideclaration-apexholdings-doc-003-02.jpg

**Used for:** Documents library list thumbnail

**Subject:** BenamiDeclaration_ApexHoldings.pdf (type: financial)

**Prompt:**
> Realistic photograph of a printed bank statement page on a desk, rows of transaction entries, a bank logo area left generic/blurred, evidence-photography overhead lighting, slight paper texture and shadow, fictional placeholder numbers only.

#### 103 — loanagreement-northstarrealty-doc-003-03.jpg

**Used for:** Documents library list thumbnail

**Subject:** LoanAgreement_NorthstarRealty.pdf (type: contract)

**Prompt:**
> Realistic photograph of a printed multi-page legal/commercial contract document on a desk, visible paragraph text (illegible at a glance), a signature block with a pen resting beside it, evidence-photography lighting, fictional placeholder content only.

#### 104 — shellcompanyfilings-mca-doc-003-04.jpg

**Used for:** Documents library list thumbnail

**Subject:** ShellCompanyFilings_MCA.pdf (type: financial)

**Prompt:**
> Realistic photograph of a printed bank statement page on a desk, rows of transaction entries, a bank logo area left generic/blurred, evidence-photography overhead lighting, slight paper texture and shadow, fictional placeholder numbers only.

#### 105 — forgedkyc-muleaccount07-doc-004-01.jpg

**Used for:** Documents library list thumbnail

**Subject:** ForgedKYC_MuleAccount07.pdf (type: identity)

**Prompt:**
> Realistic photograph of a fictional Indian government-style identity document (Aadhaar-card-like layout) lying on a neutral desk surface, evidence-photography lighting with a slight glare, sensitive numbers subtly blurred/redacted, entirely fictional placeholder content, no real government emblem or seal, no real person's photo on the card.

#### 106 — muleaccountopeningform-doc-004-02.jpg

**Used for:** Documents library list thumbnail

**Subject:** MuleAccountOpeningForm.pdf (type: financial)

**Prompt:**
> Realistic photograph of a printed bank statement page on a desk, rows of transaction entries, a bank logo area left generic/blurred, evidence-photography overhead lighting, slight paper texture and shadow, fictional placeholder numbers only.

#### 107 — chargesheet-silentledger-doc-004-03.jpg

**Used for:** Documents library list thumbnail

**Subject:** ChargeSheet_SilentLedger.pdf (type: contract)

**Prompt:**
> Realistic photograph of a printed multi-page legal/commercial contract document on a desk, visible paragraph text (illegible at a glance), a signature block with a pen resting beside it, evidence-photography lighting, fictional placeholder content only.

#### 108 — transportpermit-tharlogistics-doc-005-01.jpg

**Used for:** Documents library list thumbnail

**Subject:** TransportPermit_TharLogistics.pdf (type: contract)

**Prompt:**
> Realistic photograph of a printed multi-page legal/commercial contract document on a desk, visible paragraph text (illegible at a glance), a signature block with a pen resting beside it, evidence-photography lighting, fictional placeholder content only.

#### 109 — hawalaledger-seized-doc-005-02.jpg

**Used for:** Documents library list thumbnail

**Subject:** HawalaLedger_Seized.pdf (type: financial)

**Prompt:**
> Realistic photograph of a printed bank statement page on a desk, rows of transaction entries, a bank logo area left generic/blurred, evidence-photography overhead lighting, slight paper texture and shadow, fictional placeholder numbers only.

#### 110 — customsmanifest-kandlaport-doc-005-03.jpg

**Used for:** Documents library list thumbnail

**Subject:** CustomsManifest_KandlaPort.pdf (type: property)

**Prompt:**
> Realistic photograph of a stamped property/sale-deed style legal document on a desk, official-looking stamp-paper texture, a red wax-seal or notary stamp impression, evidence-photography lighting, fictional placeholder content only.

---

### EVIDENCE (32)

#### 111 — ev-001.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Facial match — Arjun Malhotra at Sea Breeze Apartments (type: face)

**Prompt:**
> Realistic close-cropped surveillance-camera still of a person's face mid-frame, slightly grainy CCTV image quality, desaturated colour, night or dusk lighting, generic urban background, entirely fictional.

#### 112 — ev-002.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** ANPR capture — MH-02-CQ-4521 at Bandra West Junction (type: cctv)

**Prompt:**
> Realistic grainy CCTV-still photograph of a street scene with a vehicle or pedestrian in frame, wide fixed-camera angle, timestamp-style corner vignette, desaturated surveillance colour grading, Indian urban street setting.

#### 113 — ev-003.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Unidentified contact at Colaba dockside (type: cctv)

**Prompt:**
> Realistic grainy CCTV-still photograph of a street scene with a vehicle or pedestrian in frame, wide fixed-camera angle, timestamp-style corner vignette, desaturated surveillance colour grading, Indian urban street setting.

#### 114 — ev-004.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Flagged transfer chain — ACC-06 → ACC-05 → ACC-07 (type: financial)

**Prompt:**
> Realistic photograph of a printed financial transaction / bank transfer report spread across a desk, highlighter marks on flagged rows, a calculator and pen beside it, evidence-photography lighting, fictional placeholder numbers only.

#### 115 — ev-005.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Freight contract — Meridian Freight & Konnect Traders (type: document)

**Prompt:**
> Realistic photograph of a seized paper document sealed in a transparent evidence bag with a chain-of-custody tag attached, resting on a neutral examination table, evidence-photography lighting, fictional placeholder content only.

#### 116 — ev-006.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** High-frequency call pattern — P-0042 ↔ P-0043 (type: call)

**Prompt:**
> Realistic photograph of a printed call-detail-record log sheet on a desk beside a mobile phone, rows of phone numbers and timestamps (illegible at a glance), evidence-photography lighting, fictional placeholder content only.

#### 117 — ev-007.jpg

**Used for:** Evidence repository (table thumbnail + detail header); underlying record for the Forensics tab (that page itself shows no image, but this is the same evidence ID); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Device extraction — Samsung Galaxy S23 (DEV-01) (type: forensic)

**Prompt:**
> Realistic photograph of a seized smartphone connected to a forensic data-extraction rig (cables, a laptop running analysis software in the background, blurred/generic UI), an evidence-bag tag beside it, clinical lab lighting, fictional placeholder content only.

#### 118 — ev-008.jpg

**Used for:** Evidence repository (table thumbnail + detail header); underlying record for the Forensics tab (that page itself shows no image, but this is the same evidence ID); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Digital signature match — freight contract PDF metadata (type: forensic)

**Prompt:**
> Realistic photograph of a seized smartphone connected to a forensic data-extraction rig (cables, a laptop running analysis software in the background, blurred/generic UI), an evidence-bag tag beside it, clinical lab lighting, fictional placeholder content only.

#### 119 — evd-002-01.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Facial match — Swati Thakur at Ratnagiri Fishing Harbour (type: face)

**Prompt:**
> Realistic close-cropped surveillance-camera still of a person's face mid-frame, slightly grainy CCTV image quality, desaturated colour, night or dusk lighting, generic urban background, entirely fictional.

#### 120 — evd-002-02.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** ANPR capture — MH-25-XA-3531 near Malvan Jetty (type: cctv)

**Prompt:**
> Realistic grainy CCTV-still photograph of a street scene with a vehicle or pedestrian in frame, wide fixed-camera angle, timestamp-style corner vignette, desaturated surveillance colour grading, Indian urban street setting.

#### 121 — evd-002-03.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Flagged transfer chain — 2 suspicious transfers (type: financial)

**Prompt:**
> Realistic photograph of a printed financial transaction / bank transfer report spread across a desk, highlighter marks on flagged rows, a calculator and pen beside it, evidence-photography lighting, fictional placeholder numbers only.

#### 122 — evd-002-04.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** BoatRegistration_SagarKanya2.pdf — seized record (type: document)

**Prompt:**
> Realistic photograph of a seized paper document sealed in a transparent evidence bag with a chain-of-custody tag attached, resting on a neutral examination table, evidence-photography lighting, fictional placeholder content only.

#### 123 — evd-002-05.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** High-frequency call pattern — 8 linked numbers (type: call)

**Prompt:**
> Realistic photograph of a printed call-detail-record log sheet on a desk beside a mobile phone, rows of phone numbers and timestamps (illegible at a glance), evidence-photography lighting, fictional placeholder content only.

#### 124 — evd-002-06.jpg

**Used for:** Evidence repository (table thumbnail + detail header); underlying record for the Forensics tab (that page itself shows no image, but this is the same evidence ID); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Device extraction — Vivo V29 (Swati Thakur) (type: forensic)

**Prompt:**
> Realistic photograph of a seized smartphone connected to a forensic data-extraction rig (cables, a laptop running analysis software in the background, blurred/generic UI), an evidence-bag tag beside it, clinical lab lighting, fictional placeholder content only.

#### 125 — evd-003-01.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Facial match — Swati Verma at Connaught Place (type: face)

**Prompt:**
> Realistic close-cropped surveillance-camera still of a person's face mid-frame, slightly grainy CCTV image quality, desaturated colour, night or dusk lighting, generic urban background, entirely fictional.

#### 126 — evd-003-02.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** ANPR capture — DL-14-BA-8027 near Gurugram Cyber Hub (type: cctv)

**Prompt:**
> Realistic grainy CCTV-still photograph of a street scene with a vehicle or pedestrian in frame, wide fixed-camera angle, timestamp-style corner vignette, desaturated surveillance colour grading, Indian urban street setting.

#### 127 — evd-003-03.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Flagged transfer chain — 4 suspicious transfers (type: financial)

**Prompt:**
> Realistic photograph of a printed financial transaction / bank transfer report spread across a desk, highlighter marks on flagged rows, a calculator and pen beside it, evidence-photography lighting, fictional placeholder numbers only.

#### 128 — evd-003-04.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** SaleDeed_SonipatPlot14.pdf — seized record (type: document)

**Prompt:**
> Realistic photograph of a seized paper document sealed in a transparent evidence bag with a chain-of-custody tag attached, resting on a neutral examination table, evidence-photography lighting, fictional placeholder content only.

#### 129 — evd-003-05.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** High-frequency call pattern — 23 linked numbers (type: call)

**Prompt:**
> Realistic photograph of a printed call-detail-record log sheet on a desk beside a mobile phone, rows of phone numbers and timestamps (illegible at a glance), evidence-photography lighting, fictional placeholder content only.

#### 130 — evd-003-06.jpg

**Used for:** Evidence repository (table thumbnail + detail header); underlying record for the Forensics tab (that page itself shows no image, but this is the same evidence ID); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Device extraction — Xiaomi Redmi Note 13 (Swati Verma) (type: forensic)

**Prompt:**
> Realistic photograph of a seized smartphone connected to a forensic data-extraction rig (cables, a laptop running analysis software in the background, blurred/generic UI), an evidence-bag tag beside it, clinical lab lighting, fictional placeholder content only.

#### 131 — evd-004-01.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Facial match — Sunita Sheikh at Hinjewadi IT Park (type: face)

**Prompt:**
> Realistic close-cropped surveillance-camera still of a person's face mid-frame, slightly grainy CCTV image quality, desaturated colour, night or dusk lighting, generic urban background, entirely fictional.

#### 132 — evd-004-02.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** ANPR capture — MH-36-CB-3961 near Nagpur Civil Lines (type: cctv)

**Prompt:**
> Realistic grainy CCTV-still photograph of a street scene with a vehicle or pedestrian in frame, wide fixed-camera angle, timestamp-style corner vignette, desaturated surveillance colour grading, Indian urban street setting.

#### 133 — evd-004-03.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Flagged transfer chain — 3 suspicious transfers (type: financial)

**Prompt:**
> Realistic photograph of a printed financial transaction / bank transfer report spread across a desk, highlighter marks on flagged rows, a calculator and pen beside it, evidence-photography lighting, fictional placeholder numbers only.

#### 134 — evd-004-04.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** ForgedKYC_MuleAccount07.pdf — seized record (type: document)

**Prompt:**
> Realistic photograph of a seized paper document sealed in a transparent evidence bag with a chain-of-custody tag attached, resting on a neutral examination table, evidence-photography lighting, fictional placeholder content only.

#### 135 — evd-004-05.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** High-frequency call pattern — 6 linked numbers (type: call)

**Prompt:**
> Realistic photograph of a printed call-detail-record log sheet on a desk beside a mobile phone, rows of phone numbers and timestamps (illegible at a glance), evidence-photography lighting, fictional placeholder content only.

#### 136 — evd-004-06.jpg

**Used for:** Evidence repository (table thumbnail + detail header); underlying record for the Forensics tab (that page itself shows no image, but this is the same evidence ID); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Device extraction — Samsung Galaxy S24 (Sunita Sheikh) (type: forensic)

**Prompt:**
> Realistic photograph of a seized smartphone connected to a forensic data-extraction rig (cables, a laptop running analysis software in the background, blurred/generic UI), an evidence-bag tag beside it, clinical lab lighting, fictional placeholder content only.

#### 137 — evd-005-01.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Facial match — Rohit Menon at Jodhpur Transport Nagar (type: face)

**Prompt:**
> Realistic close-cropped surveillance-camera still of a person's face mid-frame, slightly grainy CCTV image quality, desaturated colour, night or dusk lighting, generic urban background, entirely fictional.

#### 138 — evd-005-02.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** ANPR capture — RJ-06-BD-1963 near Barmer Border Checkpost (type: cctv)

**Prompt:**
> Realistic grainy CCTV-still photograph of a street scene with a vehicle or pedestrian in frame, wide fixed-camera angle, timestamp-style corner vignette, desaturated surveillance colour grading, Indian urban street setting.

#### 139 — evd-005-03.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Flagged transfer chain — 3 suspicious transfers (type: financial)

**Prompt:**
> Realistic photograph of a printed financial transaction / bank transfer report spread across a desk, highlighter marks on flagged rows, a calculator and pen beside it, evidence-photography lighting, fictional placeholder numbers only.

#### 140 — evd-005-04.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** TransportPermit_TharLogistics.pdf — seized record (type: document)

**Prompt:**
> Realistic photograph of a seized paper document sealed in a transparent evidence bag with a chain-of-custody tag attached, resting on a neutral examination table, evidence-photography lighting, fictional placeholder content only.

#### 141 — evd-005-05.jpg

**Used for:** Evidence repository (table thumbnail + detail header); Location "Related Media" strip, when this item is linked to the active location

**Subject:** High-frequency call pattern — 10 linked numbers (type: call)

**Prompt:**
> Realistic photograph of a printed call-detail-record log sheet on a desk beside a mobile phone, rows of phone numbers and timestamps (illegible at a glance), evidence-photography lighting, fictional placeholder content only.

#### 142 — evd-005-06.jpg

**Used for:** Evidence repository (table thumbnail + detail header); underlying record for the Forensics tab (that page itself shows no image, but this is the same evidence ID); Location "Related Media" strip, when this item is linked to the active location

**Subject:** Device extraction — Vivo V29 (Rohit Menon) (type: forensic)

**Prompt:**
> Realistic photograph of a seized smartphone connected to a forensic data-extraction rig (cables, a laptop running analysis software in the background, blurred/generic UI), an evidence-bag tag beside it, clinical lab lighting, fictional placeholder content only.

---

### CCTV CAMERA SCENES (29 unique — see §16 dedup note for how these cover all 106 required filenames)

#### 143 — cam-bw02.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-BW02` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera BW-02 — "Bandra West — Junction 2" (Hill Road Junction)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Hill Road Junction" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Bandra West — Junction 2", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 144 — cam-bw12.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-BW12` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera BW-12 — "Bandra West — Sea Breeze Apts" (Residential Gate)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Residential Gate" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Bandra West — Sea Breeze Apts", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 145 — cam-aw09.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-AW09` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera AW-09 — "Andheri East — Metro Exit" (Metro Station Exit 3)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Metro Station Exit 3" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Andheri East — Metro Exit", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 146 — cam-lw07.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-LW07` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera LW-07 — "Lower Parel — Tower Lobby" (Commercial Lobby)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Commercial Lobby" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Lower Parel — Tower Lobby", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 147 — cam-oe11.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-OE11` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera OE-11 — "Colaba — Dockside East" (Dock Perimeter)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Dock Perimeter" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Colaba — Dockside East", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 148 — cam-ch03.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-CH03` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera CH-03 — "Chembur — Industrial Gate 3" (Warehouse Gate)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Warehouse Gate" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Chembur — Industrial Gate 3", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 149 — cam-pw08.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-PW08` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera PW-08 — "Powai — Residency Entrance" (Residency Entrance)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Residency Entrance" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Powai — Residency Entrance", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 150 — cam-dr02.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-DR02` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera DR-02 — "Dockyard Road — Cargo Bay 2" (Cargo Bay)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Cargo Bay" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Dockyard Road — Cargo Bay 2", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 151 — cam-kr06.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-KR06` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera KR-06 — "Kurla — Transit Hub North" (Transit Hub)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Transit Hub" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Kurla — Transit Hub North", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 152 — cam-002-01.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-002-01` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 002-01 — "Ratnagiri Fishing Harbour — Entrance" (Yard Overview)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Yard Overview" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Ratnagiri Fishing Harbour — Entrance", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 153 — cam-002-02.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-002-02` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 002-02 — "Malvan Jetty — Junction" (Gate Camera)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Gate Camera" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Malvan Jetty — Junction", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 154 — cam-002-03.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-002-03` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 002-03 — "Vengurla Creek — Gate" (Gate Camera)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Gate Camera" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Vengurla Creek — Gate", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 155 — cam-002-04.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-002-04` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 002-04 — "Devgad Market Road — Yard" (Access Control)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Access Control" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Devgad Market Road — Yard", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 156 — cam-002-06.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-002-06` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 002-06 — "Sawantwadi Transit Yard — Junction" (Perimeter Watch)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Perimeter Watch" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Sawantwadi Transit Yard — Junction", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 157 — cam-003-01.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-003-01` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 003-01 — "Connaught Place — Perimeter" (Perimeter Watch)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Perimeter Watch" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Connaught Place — Perimeter", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 158 — cam-003-02.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-003-02` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 003-02 — "Gurugram Cyber Hub — Perimeter" (Perimeter Watch)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Perimeter Watch" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Gurugram Cyber Hub — Perimeter", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 159 — cam-003-03.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-003-03` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 003-03 — "Noida Sector 62 — Entrance" (Perimeter Watch)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Perimeter Watch" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Noida Sector 62 — Entrance", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 160 — cam-003-04.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-003-04` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 003-04 — "Chandigarh Sector 17 — Entrance" (Access Control)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Access Control" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Chandigarh Sector 17 — Entrance", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 161 — cam-003-05.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-003-05` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 003-05 — "Jaipur Vaishali Nagar — Perimeter" (Access Control)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Access Control" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Jaipur Vaishali Nagar — Perimeter", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 162 — cam-003-06.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-003-06` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 003-06 — "Faridabad Industrial Estate — Entrance" (Gate Camera)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Gate Camera" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Faridabad Industrial Estate — Entrance", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 163 — cam-003-07.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-003-07` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 003-07 — "Sonipat Warehouse Cluster — Junction" (Access Control)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Access Control" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Sonipat Warehouse Cluster — Junction", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 164 — cam-004-01.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-004-01` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 004-01 — "Hinjewadi IT Park — Perimeter" (Main Approach)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Main Approach" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Hinjewadi IT Park — Perimeter", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 165 — cam-004-02.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-004-02` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 004-02 — "Nagpur Civil Lines — Gate" (Yard Overview)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Yard Overview" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Nagpur Civil Lines — Gate", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 166 — cam-004-03.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-004-03` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 004-03 — "Pune Camp — Entrance" (Access Control)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Access Control" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Pune Camp — Entrance", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 167 — cam-005-01.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-005-01` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 005-01 — "Jodhpur Transport Nagar — Gate" (Yard Overview)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Yard Overview" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Jodhpur Transport Nagar — Gate", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 168 — cam-005-02.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-005-02` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 005-02 — "Barmer Border Checkpost — Entrance" (Gate Camera)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Gate Camera" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Barmer Border Checkpost — Entrance", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 169 — cam-005-03.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-005-03` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 005-03 — "Kandla Port — Yard" (Perimeter Watch)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Perimeter Watch" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Kandla Port — Yard", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 170 — cam-005-04.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-005-04` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 005-04 — "Bhuj Industrial Area — Perimeter" (Yard Overview)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Yard Overview" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Bhuj Industrial Area — Perimeter", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

#### 171 — cam-005-06.jpg (base camera image)

**Used for:** CCTV Camera Viewer (default/fallback frame); Locations page CCTV tab thumbnail. Also copy this same file under every CCTV-event and face-detection filename that references camera `CAM-005-06` (see §7/§8 tables) — that covers the CCTV Viewer's per-event frame and the Face Recognition viewer.

**Subject:** Camera 005-06 — "Jaisalmer Transit Camp — Perimeter" (Perimeter Watch)

**Prompt:**
> Realistic fixed CCTV surveillance camera still frame showing "Perimeter Watch" — a wide-angle, slightly grainy, desaturated surveillance-camera image of an Indian street/gate/yard scene consistent with a location called "Jaisalmer Transit Camp — Perimeter", a vehicle or pedestrian faintly visible in frame, subtle lens distortion and low-contrast surveillance colour grading, no on-screen timestamp text, no identifiable faces, entirely fictional scene.

---

## 20. Image Counts

| Category | Unique files/pieces of art required |
|---|---|
| People images required | 54 |
| Location images required | 39 |
| Document images required | 17 |
| Evidence images required | 32 |
| CCTV images required (unique art — see §16 for the 106 filenames these get copied into) | 29 |
| Social profile images required (new files) | 0 — always reuses a person image |
| Financial account images required (new files) | 0 — reuses a person image (or is a mapping bug, see §21) |
| Criminal record images required (new files) | 0 — reuses a person image |
| Case images required | 0 — helper unused, no render call site |
| Vehicle images required | 0 — helper unused, no render call site |
| Device images required | 0 — no helper, no render call site |
| Organization images required | 0 — no helper, no render call site |
| **TOTAL UNIQUE PIECES OF ART TO CREATE** | **171** |

(If you'd rather generate a distinct photo for every one of the 106 CCTV filenames instead of copying 29 images, the total becomes 248 — but nothing in the app can tell the difference, since every CCTV lookup is just a static file path.)

---

## 21. Image Mapping Issues

Found by tracing every call site against the actual entity being resolved. Reported only, not fixed — per instruction, no code was changed.

### Issue 1 — `FinancialPage.tsx` requests a person-style image for organization-owned accounts

`FinancialPage.tsx` (line ~55) does `const owner = a.metadata.ownerId ? getEntityById(a.metadata.ownerId) : undefined;` and then unconditionally renders `<PersonAvatar ... src={personImage(owner.id, owner.name)} />` whenever `owner` is truthy — it never checks `owner.type`. Five accounts across the dataset are owned by an `OrganizationEntity`, not a person:

| Account | Case | Owner (organization) | File the app requests |
|---|---|---|---|
| `ACC-05` — Konnect Traders — Current A/C | OP-001 | Konnect Traders Pvt Ltd (`ORG-02`) | A file named after the *company* under `public/images/people/` — e.g. `konnect-traders-pvt-ltd-org-02.jpg` |
| `ACC-002-05` — ICICI •••• 3852 (Konkan Blue Marine Pvt Ltd) | OP-002 | Konkan Blue Marine Pvt Ltd (`ORG-002-01`) | A file named after the *company* under `public/images/people/` — e.g. `konkan-blue-marine-pvt-ltd-org-002-01.jpg` |
| `ACC-003-05` — Bank •••• 5155 (Northstar Realty Ventures) | OP-003 | Northstar Realty Ventures (`ORG-003-01`) | A file named after the *company* under `public/images/people/` — e.g. `northstar-realty-ventures-org-003-01.jpg` |
| `ACC-004-05` — Punjab •••• 4879 (Zenlite BPO Services) | OP-004 | Zenlite BPO Services (`ORG-004-01`) | A file named after the *company* under `public/images/people/` — e.g. `zenlite-bpo-services-org-004-01.jpg` |
| `ACC-005-05` — Bank •••• 7370 (Thar Logistics & Carriers) | OP-005 | Thar Logistics & Carriers (`ORG-005-01`) | A file named after the *company* under `public/images/people/` — e.g. `thar-logistics-&-carriers-org-005-01.jpg` |

Practically: the app will show an initials-avatar fallback (e.g. "KL" for Konnect Traders) or a company photo misfiled under `people/` if you generate one for that filename. This is a pre-existing type-check gap in the component, not something this inventory should paper over by inventing a company portrait — recommend leaving it on the fallback avatar (no image needed) rather than generating a fictional "photo" of a company, and flagging the missing `owner.type === 'person'` guard to whoever next touches `FinancialPage.tsx`.

### Issue 2 — three defined cameras are never reachable in the UI

`CAM-MW05` (case-op001), `CAM-002-05` (case-op002), and `CAM-005-05` (case-op005) exist in `mockCameras` but have zero entries in `mockCctvEvents` for their case. Since both `CCTVPage` and `LocationPage` populate their camera lists via `cctvService.listCameras(caseId)`, which filters to cameras referenced by at least one event, these three cameras can never be selected or displayed — they are dead data, not an image gap. No image is needed for them.

### Issue 3 — `vehicleImage()` and `caseCoverImage()` are fully implemented but never called

Both helpers exist in `imageAssets.ts` with correct slugification logic, but a repo-wide grep for their call sites returns zero results outside `imageAssets.ts` itself. This isn't a bug exactly (the app works fine without them) but it means any images generated for `public/images/vehicles/` or `public/images/cases/` will sit unused until a future change wires up a Vehicle detail view or a Cases-dashboard cover-photo treatment.

---

## 22. Final Verification — Entity → imageAssets → Component → Rendered Chain

Every one of the 7 `imageAssets.ts` helper functions was traced to every one of its real call sites by grepping the whole `src/` tree (`grep -rn "personImage(\|locationImage(\|vehicleImage(\|documentImage(\|evidenceImage(\|cctvFrameImage(\|caseCoverImage(" src/`). Exactly 21 call sites exist. Nothing was assumed.

```
PERSON
  Person entity (e.g. Arjun Malhotra, P-0042)
    -> personImage(P-0042, "Arjun Malhotra")
    -> "/images/people/arjun-malhotra-p-0042.jpg"
    -> <PersonAvatar src=... /> -> <EntityImage> (graceful fallback to initials if 404)
    -> rendered at 9 call sites:
         PersonHeader.tsx            (Person Dossier header)
         EntityDetails.tsx           (Network Graph entity detail panel, type==='person')
         MatchCard.tsx               (Face Recognition match card, if identityId resolves)
         CaseDashboardPage.tsx       (Overview 'Key People', first 6 persons per case only)
         FinancialPage.tsx           (account owner avatar, if owner resolves — see Issue 1)
         SocialMediaPage.tsx x2      (profile list row + profile overview header)
         CriminalRecordsPage.tsx x2  (subject column + record detail header)

LOCATION
  Location entity (e.g. Bandra West, loc-001)
    -> locationImage(loc-001, "Bandra West")
    -> "/images/locations/bandra-west-loc-001.jpg"
    -> <LocationThumb> / <EntityImage> (fallback: category glyph + "NO IMAGE ON FILE")
    -> rendered at 2 call sites: LocationDetailPanel.tsx, EntityDetails.tsx (type==='location')

DOCUMENT
  Document entity -> documentImage(id, fileName) -> <EntityImage> in DocumentThumb
    -> rendered at 1 call site: DocumentsPage.tsx

EVIDENCE
  Evidence entity (any type, incl. forensic) -> evidenceImage(id) -> <EvidenceThumb>
    -> rendered at 3 call sites: EvidencePage.tsx x2, LocationBottomStrip.tsx
    -> NOT rendered by ForensicsPage.tsx (verified: no EvidenceThumb/evidenceImage import there)

CCTV / FACE FRAME
  Camera -> cctvFrameImage(camera.id) -> LocationDetailPanel.tsx (CCTV tab) + CCTVViewer.tsx (fallback)
  CCTVEvent -> cctvFrameImage(event.id) -> CCTVViewer.tsx (primary, whenever that event is selected)
  FaceDetection -> cctvFrameImage(detection.frameId) -> FaceViewer.tsx
    -> all three funnel through the same <FramePlaceholder> (fallback: scanline + 'NO FRAME CAPTURED')

VEHICLE / CASE COVER
  vehicleImage() and caseCoverImage() are defined but have ZERO call sites in src/ — confirmed by grep.
    -> never rendered anywhere -> NOT required
```

**All 21 call sites, verbatim from the repo (`grep -rn` output):**

```
src/pages/CaseDashboardPage.tsx:92:  <PersonAvatar ... src={personImage(p.id, p.name)} />
src/pages/EvidencePage.tsx:46:       <EvidenceThumb ... src={evidenceImage(e.id)} />
src/pages/EvidencePage.tsx:70:       <EvidenceThumb ... src={evidenceImage(selected.id)} />
src/pages/FinancialPage.tsx:55:      <PersonAvatar ... src={personImage(owner.id, owner.name)} />
src/pages/DocumentsPage.tsx:14:      src={documentImage(doc.id, doc.metadata.fileName)}
src/pages/SocialMediaPage.tsx:61:    <PersonAvatar ... src={personImage(owner.id, owner.name)} />
src/pages/SocialMediaPage.tsx:85:    <PersonAvatar ... src={personImage(owner.id, owner.name)} />
src/pages/CriminalRecordsPage.tsx:44: <PersonAvatar ... src={personImage(subject.id, subject.name)} />
src/pages/CriminalRecordsPage.tsx:73: <PersonAvatar ... src={personImage(subject.id, subject.name)} />
src/components/dossier/PersonHeader.tsx:9:        <PersonAvatar ... src={personImage(person.id, person.name)} />
src/components/locations/LocationDetailPanel.tsx:49:  src={locationImage(location.id, location.name)}
src/components/locations/LocationDetailPanel.tsx:126: <FramePlaceholder src={cctvFrameImage(c.id)} .../>
src/components/locations/LocationBottomStrip.tsx:95:  <EvidenceThumb ... src={evidenceImage(e.id)} />
src/components/cctv/CCTVViewer.tsx:23:      <FramePlaceholder src={cctvFrameImage(activeEvent?.id ?? camera.id)} .../>
src/components/graph/EntityDetails.tsx:66:   src={locationImage(entity.id, entity.name)}
src/components/graph/EntityDetails.tsx:70:   <PersonAvatar ... src={personImage(entity.id, entity.name)} />
src/components/face/MatchCard.tsx:18:        <PersonAvatar ... src={personImage(entity.id, entity.name)} />
src/components/face/FaceViewer.tsx:14:       <FramePlaceholder src={cctvFrameImage(detection.frameId)} .../>
```

**Data verified:** `allEntities.length` = 232 (people 54 + vehicles 20 + phones 55 + locations 39 + organizations 11 + devices 9 + accounts 27 + documents 17 = 232 ✓). All 5 cases' `mockCases[].stats` were cross-checked against the live filtered counts and matched. All counts and filenames in this document came from running the actual TypeScript against the actual data files — no manual transcription of names or IDs was performed for the tables above.

This report supersedes and significantly expands `docs/IMAGE_ASSETS_NEEDED.md` from the prior image-asset audit — that file grouped filenames by pattern, this one lists every individual entity, ID, case membership, and a ready-to-use generation prompt for every one of them.
