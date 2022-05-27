import * as allLanguages from "./languages.json";
import * as countries from "./countries.json";

describe("Consent component tests.", () => {
  test("Test algorithm to filter and sort languages.", async () => {
    const languages = allLanguages.default.filter(function (value) {
      return value["en"];
    });
    const sorted = languages.sort((a, b) => (a["en"] > b["en"] ? 1 : -1));
    expect(sorted.length).toBe(490);
    var result;
    sorted.map(
      (option) =>
        (result =
          (result ? result + option.alpha3 : option.alpha3) +
          "," +
          option.en +
          "\n")
    );
    expect(result).toBe(`abk,Abkhazian
ace,Achinese
ach,Acoli
ada,Adangme
ady,Adyghe; Adygei
aar,Afar
afh,Afrihili
afr,Afrikaans
afa,Afro-Asiatic languages
ain,Ainu
aka,Akan
akk,Akkadian
alb,Albanian
ale,Aleut
alg,Algonquian languages
tut,Altaic languages
amh,Amharic
anp,Angika
apa,Apache languages
ara,Arabic
arg,Aragonese
arc,Aramaic
arp,Arapaho
arw,Arawak
hye,Armenian
arm,Armenian
rup,Aromanian; Arumanian; Macedo-Romanian
art,Artificial languages
asm,Assamese
ast,Asturian; Bable; Leonese; Asturleonese
ath,Athapascan languages
aus,Australian languages
map,Austronesian languages
ava,Avaric
ave,Avestan
awa,Awadhi
aym,Aymara
aze,Azerbaijani
ban,Balinese
bat,Baltic languages
bal,Baluchi
bam,Bambara
bai,Bamileke languages
bad,Banda languages
bnt,Bantu languages
bas,Basa
bak,Bashkir
eus,Basque
baq,Basque
btk,Batak languages
bej,Beja; Bedawiyet
bel,Belarusian
bem,Bemba
ben,Bengali
ber,Berber languages
bho,Bhojpuri
bih,Bihari languages
bik,Bikol
bin,Bini; Edo
bis,Bislama
byn,Blin; Bilin
zbl,Blissymbolics; Bliss
nob,Bokmål, Norwegian; Norwegian Bokmål
bos,Bosnian
bra,Braj
bre,Breton
bug,Buginese
bul,Bulgarian
bua,Buriat
bur,Burmese
cad,Caddo
cat,Catalan; Valencian
cau,Caucasian languages
ceb,Cebuano
cel,Celtic languages
cai,Central American Indian languages
khm,Central Khmer
chg,Chagatai
cmc,Chamic languages
cha,Chamorro
che,Chechen
chr,Cherokee
chy,Cheyenne
chb,Chibcha
nya,Chichewa; Chewa; Nyanja
zho,Chinese
chi,Chinese
chn,Chinook jargon
chp,Chipewyan; Dene Suline
cho,Choctaw
chu,Church Slavic; Old Church Slavonic
chk,Chuukese
chv,Chuvash
nwc,Classical Newari; Old Newari; Classical Nepal Bhasa
syc,Classical Syriac
cop,Coptic
cor,Cornish
cos,Corsican
cre,Cree
mus,Creek
crp,Creoles and pidgins
cpe,Creoles and pidgins, English based
cpf,Creoles and pidgins, French-based
cpp,Creoles and pidgins, Portuguese-based
crh,Crimean Tatar; Crimean Turkish
hrv,Croatian
cus,Cushitic languages
cze,Czech
dak,Dakota
dan,Danish
dar,Dargwa
del,Delaware
din,Dinka
div,Divehi; Dhivehi; Maldivian
doi,Dogri
dgr,Dogrib
dra,Dravidian languages
dua,Duala
dum,Dutch, Middle (ca.1050-1350)
nld,Dutch; Flemish
dyu,Dyula
dzo,Dzongkha
frs,Eastern Frisian
efi,Efik
egy,Egyptian (Ancient)
eka,Ekajuk
elx,Elamite
eng,English
enm,English, Middle (1100-1500)
ang,English, Old (ca.450-1100)
myv,Erzya
epo,Esperanto
est,Estonian
ewe,Ewe
ewo,Ewondo
fan,Fang
fat,Fanti
fao,Faroese
fij,Fijian
fil,Filipino; Pilipino
fin,Finnish
fiu,Finno-Ugrian languages
fon,Fon
fra,French
fur,Friulian
ful,Fulah
gaa,Ga
gla,Gaelic; Scottish Gaelic
car,Galibi Carib
glg,Galician
lug,Ganda
gay,Gayo
gba,Gbaya
gez,Geez
geo,Georgian
kat,Georgian
deu,German
gmh,German, Middle High (ca.1050-1500)
goh,German, Old High (ca.750-1050)
gem,Germanic languages
gil,Gilbertese
gon,Gondi
gor,Gorontalo
got,Gothic
grb,Grebo
grc,Greek, Ancient (to 1453)
ell,Greek, Modern (1453-)
gre,Greek, Modern (1453-)
grn,Guarani
guj,Gujarati
gwi,Gwich'in
hai,Haida
hat,Haitian; Haitian Creole
hau,Hausa
haw,Hawaiian
heb,Hebrew
her,Herero
hil,Hiligaynon
him,Himachali languages; Western Pahari languages
hin,Hindi
hmo,Hiri Motu
hit,Hittite
hmn,Hmong; Mong
hun,Hungarian
hup,Hupa
iba,Iban
ice,Icelandic
isl,Icelandic
ido,Ido
ibo,Igbo
ijo,Ijo languages
ilo,Iloko
smn,Inari Sami
inc,Indic languages
ine,Indo-European languages
ind,Indonesian
inh,Ingush
ina,Interlingua
ile,Interlingue; Occidental
iku,Inuktitut
ipk,Inupiaq
ira,Iranian languages
gle,Irish
mga,Irish, Middle (900-1200)
sga,Irish, Old (to 900)
iro,Iroquoian languages
ita,Italian
jpn,Japanese
jav,Javanese
jrb,Judeo-Arabic
jpr,Judeo-Persian
kbd,Kabardian
kab,Kabyle
kac,Kachin; Jingpho
kal,Kalaallisut; Greenlandic
xal,Kalmyk; Oirat
kam,Kamba
kan,Kannada
kau,Kanuri
kaa,Kara-Kalpak
krc,Karachay-Balkar
krl,Karelian
kar,Karen languages
kas,Kashmiri
csb,Kashubian
kaw,Kawi
kaz,Kazakh
kha,Khasi
khi,Khoisan languages
kho,Khotanese; Sakan
kik,Kikuyu; Gikuyu
kmb,Kimbundu
kin,Kinyarwanda
kir,Kirghiz; Kyrgyz
tlh,Klingon; tlhIngan-Hol
kom,Komi
kon,Kongo
kok,Konkani
kor,Korean
kos,Kosraean
kpe,Kpelle
kro,Kru languages
kua,Kuanyama; Kwanyama
kum,Kumyk
kur,Kurdish
kru,Kurukh
kut,Kutenai
lad,Ladino
lah,Lahnda
lam,Lamba
day,Land Dayak languages
lao,Lao
lat,Latin
lav,Latvian
lez,Lezghian
lim,Limburgan; Limburger; Limburgish
lin,Lingala
lit,Lithuanian
jbo,Lojban
nds,Low German; Low Saxon; German, Low; Saxon, Low
dsb,Lower Sorbian
loz,Lozi
lub,Luba-Katanga
lua,Luba-Lulua
lui,Luiseno
smj,Lule Sami
lun,Lunda
luo,Luo (Kenya and Tanzania)
lus,Lushai
ltz,Luxembourgish; Letzeburgesch
mkd,Macedonian
mad,Madurese
mag,Magahi
mai,Maithili
mak,Makasar
mlg,Malagasy
msa,Malay
mal,Malayalam
mlt,Maltese
mnc,Manchu
mdr,Mandar
man,Mandingo
mni,Manipuri
mno,Manobo languages
glv,Manx
mri,Maori
arn,Mapudungun; Mapuche
mar,Marathi
chm,Mari
mah,Marshallese
mwr,Marwari
mas,Masai
myn,Mayan languages
men,Mende
mic,Mi'kmaq; Micmac
min,Minangkabau
mwl,Mirandese
moh,Mohawk
mdf,Moksha
mda,Moldavian
mkh,Mon-Khmer languages
lol,Mongo
mon,Mongolian
cnr,Montenegrin
mos,Mossi
mul,Multiple languages
mun,Munda languages
nqo,N'Ko
nah,Nahuatl languages
nau,Nauru
nav,Navajo; Navaho
nde,Ndebele, North; North Ndebele
nbl,Ndebele, South; South Ndebele
ndo,Ndonga
nap,Neapolitan
new,Nepal Bhasa; Newari
nep,Nepali
nia,Nias
nic,Niger-Kordofanian languages
ssa,Nilo-Saharan languages
niu,Niuean
nog,Nogai
non,Norse, Old
nai,North American Indian languages
frr,Northern Frisian
sme,Northern Sami
nor,Norwegian
nno,Norwegian Nynorsk; Nynorsk, Norwegian
nub,Nubian languages
nym,Nyamwezi
nyn,Nyankole
nyo,Nyoro
nzi,Nzima
oci,Occitan (post 1500)
oji,Ojibwa
ori,Oriya
orm,Oromo
osa,Osage
oss,Ossetian; Ossetic
oto,Otomian languages
pal,Pahlavi
pau,Palauan
pli,Pali
pam,Pampanga; Kapampangan
pag,Pangasinan
pan,Panjabi; Punjabi
pap,Papiamento
paa,Papuan languages
nso,Pedi; Sepedi; Northern Sotho
fas,Persian
peo,Persian, Old (ca.600-400 B.C.)
phi,Philippine languages
phn,Phoenician
pon,Pohnpeian
pol,Polish
por,Portuguese
pra,Prakrit languages
pro,Provençal, Old (to 1500);Occitan, Old (to 1500)
pus,Pushto; Pashto
que,Quechua
raj,Rajasthani
rap,Rapanui
rar,Rarotongan; Cook Islands Maori
roa,Romance languages
ron,Romanian
roh,Romansh
rom,Romany
run,Rundi
rus,Russian
sal,Salishan languages
sam,Samaritan Aramaic
smi,Sami languages
smo,Samoan
sad,Sandawe
sag,Sango
san,Sanskrit
sat,Santali
srd,Sardinian
sas,Sasak
sco,Scots
sel,Selkup
sem,Semitic languages
srp,Serbian
srr,Serer
shn,Shan
sna,Shona
iii,Sichuan Yi; Nuosu
scn,Sicilian
sid,Sidamo
sgn,Sign Languages
bla,Siksika
snd,Sindhi
sin,Sinhala; Sinhalese
sit,Sino-Tibetan languages
sio,Siouan languages
sms,Skolt Sami
den,Slave (Athapascan)
sla,Slavic languages
slk,Slovak
slv,Slovenian
sog,Sogdian
som,Somali
son,Songhai languages
snk,Soninke
wen,Sorbian languages
sot,Sotho, Southern
sai,South American Indian languages
alt,Southern Altai
sma,Southern Sami
spa,Spanish; Castilian
srn,Sranan Tongo
zgh,Standard Moroccan Tamazight
suk,Sukuma
sux,Sumerian
sun,Sundanese
sus,Susu
swa,Swahili
ssw,Swati
swe,Swedish
gsw,Swiss German; Alemannic; Alsatian
syr,Syriac
tgl,Tagalog
tah,Tahitian
tai,Tai languages
tgk,Tajik
tmh,Tamashek
tam,Tamil
tat,Tatar
tel,Telugu
ter,Tereno
tet,Tetum
tha,Thai
tib,Tibetan
tig,Tigre
tir,Tigrinya
tem,Timne
tiv,Tiv
tli,Tlingit
tpi,Tok Pisin
tkl,Tokelau
tog,Tonga (Nyasa)
ton,Tonga (Tonga Islands)
tsi,Tsimshian
tso,Tsonga
tsn,Tswana
tum,Tumbuka
tup,Tupi languages
tur,Turkish
ota,Turkish, Ottoman (1500-1928)
tuk,Turkmen
tvl,Tuvalu
tyv,Tuvinian
twi,Twi
udm,Udmurt
uga,Ugaritic
uig,Uighur; Uyghur
ukr,Ukrainian
umb,Umbundu
mis,Uncoded languages
und,Undetermined
hsb,Upper Sorbian
urd,Urdu
uzb,Uzbek
vai,Vai
ven,Venda
vie,Vietnamese
vol,Volapük
vot,Votic
wak,Wakashan languages
wln,Walloon
war,Waray
was,Washo
wel,Welsh
fry,Western Frisian
wal,Wolaitta; Wolaytta
wol,Wolof
xho,Xhosa
sah,Yakut
yao,Yao
yap,Yapese
yid,Yiddish
yor,Yoruba
ypk,Yupik languages
znd,Zande languages
zap,Zapotec
zza,Zaza; Dimili; Kirdki; Kirmanjki; Zazaki
zen,Zenaga
zha,Zhuang; Chuang
zul,Zulu
zun,Zuni
`);
  });

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
