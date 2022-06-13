import * as countries from "./countries.json";

describe("Consent component tests.", () => {
  test("Test algorithm for countries", async () => {
    var result;
    countries.default.map(
      (option) =>
        (result =
          (result ? result + option.alpha3 : option.alpha3) +
          "," +
          option.name +
          "\n")
    );
    expect(result).toBe(`afg,Afghanistan
ala,Åland Islands
alb,Albania
dza,Algeria
asm,American Samoa
and,Andorra
ago,Angola
aia,Anguilla
ata,Antarctica
atg,Antigua and Barbuda
arg,Argentina
arm,Armenia
abw,Aruba
aus,Australia
aut,Austria
aze,Azerbaijan
bhs,Bahamas
bhr,Bahrain
bgd,Bangladesh
brb,Barbados
blr,Belarus
bel,Belgium
blz,Belize
ben,Benin
bmu,Bermuda
btn,Bhutan
bol,Bolivia (Plurinational State of)
bes,Bonaire, Sint Eustatius and Saba
bih,Bosnia and Herzegovina
bwa,Botswana
bvt,Bouvet Island
bra,Brazil
iot,British Indian Ocean Territory
brn,Brunei Darussalam
bgr,Bulgaria
bfa,Burkina Faso
bdi,Burundi
cpv,Cabo Verde
khm,Cambodia
cmr,Cameroon
can,Canada
cym,Cayman Islands
caf,Central African Republic
tcd,Chad
chl,Chile
chn,China
cxr,Christmas Island
cck,Cocos (Keeling) Islands
col,Colombia
com,Comoros
cog,Congo
cod,Congo, Democratic Republic of the
cok,Cook Islands
cri,Costa Rica
civ,Côte d'Ivoire
hrv,Croatia
cub,Cuba
cuw,Curaçao
cyp,Cyprus
cze,Czechia
dnk,Denmark
dji,Djibouti
dma,Dominica
dom,Dominican Republic
ecu,Ecuador
egy,Egypt
slv,El Salvador
gnq,Equatorial Guinea
eri,Eritrea
est,Estonia
swz,Eswatini
eth,Ethiopia
flk,Falkland Islands (Malvinas)
fro,Faroe Islands
fji,Fiji
fin,Finland
fra,France
guf,French Guiana
pyf,French Polynesia
atf,French Southern Territories
gab,Gabon
gmb,Gambia
geo,Georgia
deu,Germany
gha,Ghana
gib,Gibraltar
grc,Greece
grl,Greenland
grd,Grenada
glp,Guadeloupe
gum,Guam
gtm,Guatemala
ggy,Guernsey
gin,Guinea
gnb,Guinea-Bissau
guy,Guyana
hti,Haiti
hmd,Heard Island and McDonald Islands
vat,Holy See
hnd,Honduras
hkg,Hong Kong
hun,Hungary
isl,Iceland
ind,India
idn,Indonesia
irn,Iran (Islamic Republic of)
irq,Iraq
irl,Ireland
imn,Isle of Man
isr,Israel
ita,Italy
jam,Jamaica
jpn,Japan
jey,Jersey
jor,Jordan
kaz,Kazakhstan
ken,Kenya
kir,Kiribati
prk,Korea (Democratic People's Republic of)
kor,Korea, Republic of
kwt,Kuwait
kgz,Kyrgyzstan
lao,Lao People's Democratic Republic
lva,Latvia
lbn,Lebanon
lso,Lesotho
lbr,Liberia
lby,Libya
lie,Liechtenstein
ltu,Lithuania
lux,Luxembourg
mac,Macao
mdg,Madagascar
mwi,Malawi
mys,Malaysia
mdv,Maldives
mli,Mali
mlt,Malta
mhl,Marshall Islands
mtq,Martinique
mrt,Mauritania
mus,Mauritius
myt,Mayotte
mex,Mexico
fsm,Micronesia (Federated States of)
mda,Moldova, Republic of
mco,Monaco
mng,Mongolia
mne,Montenegro
msr,Montserrat
mar,Morocco
moz,Mozambique
mmr,Myanmar
nam,Namibia
nru,Nauru
npl,Nepal
nld,Netherlands
ncl,New Caledonia
nzl,New Zealand
nic,Nicaragua
ner,Niger
nga,Nigeria
niu,Niue
nfk,Norfolk Island
mkd,North Macedonia
mnp,Northern Mariana Islands
nor,Norway
omn,Oman
pak,Pakistan
plw,Palau
pse,Palestine, State of
pan,Panama
png,Papua New Guinea
pry,Paraguay
per,Peru
phl,Philippines
pcn,Pitcairn
pol,Poland
prt,Portugal
pri,Puerto Rico
qat,Qatar
reu,Réunion
rou,Romania
rus,Russian Federation
rwa,Rwanda
blm,Saint Barthélemy
shn,Saint Helena, Ascension and Tristan da Cunha
kna,Saint Kitts and Nevis
lca,Saint Lucia
maf,Saint Martin (French part)
spm,Saint Pierre and Miquelon
vct,Saint Vincent and the Grenadines
wsm,Samoa
smr,San Marino
stp,Sao Tome and Principe
sau,Saudi Arabia
sen,Senegal
srb,Serbia
syc,Seychelles
sle,Sierra Leone
sgp,Singapore
sxm,Sint Maarten (Dutch part)
svk,Slovakia
svn,Slovenia
slb,Solomon Islands
som,Somalia
zaf,South Africa
sgs,South Georgia and the South Sandwich Islands
ssd,South Sudan
esp,Spain
lka,Sri Lanka
sdn,Sudan
sur,Suriname
sjm,Svalbard and Jan Mayen
swe,Sweden
che,Switzerland
syr,Syrian Arab Republic
twn,Taiwan, Province of China
tjk,Tajikistan
tza,Tanzania, United Republic of
tha,Thailand
tls,Timor-Leste
tgo,Togo
tkl,Tokelau
ton,Tonga
tto,Trinidad and Tobago
tun,Tunisia
tur,Turkey
tkm,Turkmenistan
tca,Turks and Caicos Islands
tuv,Tuvalu
uga,Uganda
ukr,Ukraine
are,United Arab Emirates
gbr,United Kingdom of Great Britain and Northern Ireland
usa,United States of America
umi,United States Minor Outlying Islands
ury,Uruguay
uzb,Uzbekistan
vut,Vanuatu
ven,Venezuela (Bolivarian Republic of)
vnm,Viet Nam
vgb,Virgin Islands (British)
vir,Virgin Islands (U.S.)
wlf,Wallis and Futuna
esh,Western Sahara
yem,Yemen
zmb,Zambia
zwe,Zimbabwe
`);
  });
});
