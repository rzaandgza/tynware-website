> Superseded by [POLAR_ONLY_RELEASE.md](POLAR_ONLY_RELEASE.md): the owner subsequently requested exclusive Polar use and authorized publication. This file preserves the initial audit and its historical candidate hashes.

# TYNWARE — migrare Polar, candidat privat 1.0.1

16 noiembrie 2026, Europe/Bucharest. Nu este aprobare de publicare.

## Contract API verificat

Integrarea folosește exclusiv API-ul public pentru clienți desktop, JSON peste HTTPS, fără Authorization/token administrativ. Endpoint-urile server-side `/v1/license-keys/*` au autentificare și nu sunt folosite în aplicații.

| Operație | POST, relativ la hostul mediului | Date trimise | Succes |
|---|---|---|---|
| Activare | `/v1/customer-portal/license-keys/activate` | `key`, `organization_id`, `label` | 200; identificatorul activării la rădăcină, licența în `license_key` |
| Validare | `/v1/customer-portal/license-keys/validate` | `key`, `organization_id`, `activation_id`, `benefit_id` | 200; licența la rădăcină și obiectul `activation` |
| Dezactivare | `/v1/customer-portal/license-keys/deactivate` | `key`, `organization_id`, `activation_id` | 204, fără corp |

Activarea documentează 403/404/422; validarea 400/404/422; dezactivarea 404/422. Obiectele de eroare pot avea `error`/`detail`, iar 422 poate include datele de intrare. Nu afișăm/logăm corpul erorilor, pentru a evita expunerea cheii. Timeout/rețea, 429 și 5xx păstrează drepturile offline existente; erorile de validare și răspunsurile incompatibile retrag drepturile locale. Redirectările HTTP sunt refuzate.

Host Production: `https://api.polar.sh`; Sandbox: `https://sandbox-api.polar.sh`. Headerul `Polar-Version: 2026-10` fixează contractul documentat. Versiunile Polar au ciclu trimestrial: trebuie planificată actualizarea API înainte de retragerea versiunii fixate, inclusiv pentru clienții cu licență perpetuă.

Cu limită de activări, validarea cere o activare existentă. Nu se copiază preflight-ul Lemon Squeezy. Aplicația activează, verifică organizația și beneficiul autoritativ, statutul `granted`, lipsa expirării, limita exactă 2, cheia și identitatea licenței/activării. Dacă verificarea eșuează după activare, încearcă eliberarea slotului. Eșecul compensării este raportat explicit. Un timeout înainte de primirea ID-ului poate lăsa un slot în Polar; acesta se recuperează din Customer Portal înaintea repetării activării.

`usage` este consumul de utilizare, nu numărul dispozitivelor; interfața nu îl prezintă drept număr de activări. Prefixurile `TYNR` și `OFFE`, fără cratimă configurată, sunt doar vizuale. Providerul trimite cheia completă fără transformări și nu autorizează pe baza prefixului.

Beneficiile se pot inspecta prin `GET /v1/benefits/{id}`, cu token de organizație și scope `benefits:read` sau `benefits:write`, exclusiv în administrare. Tokenul nu este necesar pentru cele trei operații desktop. Customer Portal permite autentificarea cumpărătorului prin email și cod; URL-ul stabil necesită slugul real al organizației. Nu inventăm slugul și nu generăm sesiuni administrative din desktop.

Surse oficiale consultate:

- [Activare desktop](https://polar.sh/docs/api-reference/customer-portal/license-keys/activate), [validare desktop](https://polar.sh/docs/api-reference/customer-portal/license-keys/validate), [dezactivare desktop](https://polar.sh/docs/api-reference/customer-portal/license-keys/deactivate).
- [License Keys benefits](https://polar.sh/docs/features/benefits/license-keys), [Get Benefit](https://polar.sh/docs/api-reference/benefits/get), [Customer Portal](https://polar.sh/docs/features/customer-portal/navigate-customers).
- [Sandbox](https://polar.sh/docs/integrate/sandbox), [versionarea API](https://polar.sh/docs/api-reference/versioning).
- [Merchant of Record](https://polar.sh/docs/merchant-of-record/introduction), [Buyer Terms](https://polar.sh/legal/checkout-buyer-terms), [Privacy Policy](https://polar.sh/legal/privacy-policy), [account reviews](https://polar.sh/docs/merchant-of-record/account-reviews).

## Identificatori și configurație

| Element | Valoare | Proveniență |
|---|---|---|
| Organizație Production | `4d2ea2c8-ede1-4243-8e8c-ad253b98b279` | Cerință și reconfirmare Product Owner în chat |
| TynRent benefit | `554c915b-1c9e-46f5-b25b-17aa381a4d7b` | Furnizat explicit de Product Owner în chat |
| Offer Desk benefit | `adde7183-2f9f-429e-bd03-34cba19cea1d` | Furnizat explicit de Product Owner în chat |
| TynRent | €60, plată unică, prefix configurat `TYNR` | Cerința Product Owner |
| Offer Desk | €120, plată unică, prefix configurat `OFFE` | Cerința Product Owner |

Checkout TynRent: https://buy.polar.sh/polar_cl_MIJPlmv9sfax2QJJjd0qPHVnpRIGJtGQT9Zg436Ociy

Checkout Offer Desk: https://buy.polar.sh/polar_cl_OaR29DQ4tfML1oaZoRxnavHwYQfgGi1pbuUco3IzS2V

Identificatorii Production sunt configurați pe baza informațiilor autorizate ale proprietarului; nu au fost verificați printr-un apel autentificat în dashboard/API. Lipsesc organizația și cele două beneficii Sandbox, o licență de test emisă acolo, slugul Customer Portal și confirmarea aprobării contului pentru vânzări reale. Nu au fost efectuate tranzacții sau activări Production. Limita 2, expirarea absentă, prefixurile și taxarea produselor trebuie reconfirmate în configurația Polar înainte de lansare.

## Implementare și compatibilitate

Ambele repository-uri pornesc din `main` verificat și folosesc branch-ul separat `migration/polar-20261116`. Providerul nou este în `polar_licensing.py`, iar startup-ul îl folosește prin `MigratingLicenseProvider`. Contractele `LicenseProvider`/`LicenseSnapshot` existente sunt păstrate. Nu există SDK web sau dependență Polar nouă.

Starea Polar este separată în `licensing/license-polar-production-v1.dat`, respectiv `license-polar-sandbox-v1.dat`, cu DPAPI și scriere atomică. Cache-ul include schema, providerul, organizația, beneficiul și mediul. Sandbox nu acceptă implicit identificatorii Production. Fișierele Lemon `license-live.dat` și `license.dat` nu sunt convertite, suprascrise sau șterse de providerul Polar.

O instalare cu licență Lemon existentă continuă validarea/dezactivarea prin providerul Lemon. Migrarea unui client plătitor se coordonează prin suport; nu se emite automat o cheie Polar și nu se dezactivează automat cheia Lemon. O stare Polar prezentă, inclusiv una invalidă, are prioritate și nu produce fallback ascuns la Lemon. Activarea Polar nu cere reinstalare și nu modifică baza de date.

Trial-ul rămâne 14 zile, cu istoricul și ancorele existente. Datele, vizualizarea, backup-ul și exportul după expirare sunt păstrate; modificările, importul și restaurarea folosesc aceleași gate-uri de entitlement. Revalidarea Polar se încearcă în fundal când snapshot-ul constată depășirea celor 30 zile; reîncercările automate sunt limitate la una/oră. Operațiile de rețea nu blochează citirea entitlement-ului. Grace-ul offline existent rămâne neblocant. **Consecință:** o revocare nu poate fi detectată cât timp dispozitivul rămâne offline; nu pretindem revocare imediată offline.

Website-ul pregătește prețurile €60/€120, checkout-urile exacte, metadatele și datele structurate, termenii, confidențialitatea și rambursările. Păstrează explicit tratamentul tranzacțiilor istorice Lemon. GA4 rămâne condiționat de consimțământ, cu `checkout_click`; nu se emit `purchase` sau `begin_checkout` inventate și nu se configurează linker cross-domain către Polar fără o integrare verificată.

**Website-ul nu este gata de publicare:** linkurile de download sunt intenționat încă cele aprobate pentru 1.0.0. Aceste executabile nu acceptă chei Polar. După aprobarea noilor artefacte, un commit separat trebuie să actualizeze versiunile, download URL-urile și guard-urile exacte la 1.0.1, înaintea publicării checkout-urilor Polar.

## Verificări și candidați

Testele automate folosesc răspunsuri Polar simulate, plus un test DPAPI Windows real în directoare generate. Acoperă activare, două dispozitive, refuzul celui de-al treilea, eliberarea/reutilizarea slotului, validare, offline/grace, revocare, chei invalide, produs greșit cu prefix artificial, mediile, răspunsurile incompatibile, rețeaua/timeout, formatul cheii, migrarea Lemon, trial expirat urmat de activare și revalidarea în fundal.

- TynRent: **270 PASS** în pipeline-ul build-ului semnat.
- Offer Desk: **312 PASS** în pipeline-ul build-ului semnat; verificarea finală după ajustarea rapoartelor build-ului este documentată în evidența JSON.
- Website: **62 verificări comerciale**, verificări release, **7 teste GA4/consimțământ**, **20 pagini HTML / 19 intrări sitemap, 0 erori**.
- Polar Sandbox real: **NETESTAT**, lipsesc configurația și cheia Sandbox. Mock-urile nu certifică serviciul real.
- Windows Sandbox, rețea dezactivată: **PASS pentru ambele produse** — instalare originală 1.0.0, upgrade la 1.0.1 cu păstrarea tuturor fișierelor înaintea primei porniri, pornirea candidatului, păstrarea începutului trial-ului, egalitatea uninstallerului instalat cu bytes semnați înaintea includerii în NSIS, uninstall cu păstrarea datelor și reinstalare/restart. Toate rândurile tuturor tabelelor din bazele de date generate sunt identice după upgrade. Acesta este un test de upgrade și reinstalare, nu certificarea separată a primei instalări 1.0.1 într-un profil fără istoric.

Pipeline-urile existente au verificat dependențele native și materialele Qt, apoi au semnat aplicația, uninstallerul NSIS și installerul final. Toate cele șase semnături sunt `Valid`, publisher `TYNWARE SOFT S.R.L.`, cu timestamp Microsoft. Conținutul PYZ a fost inspectat read-only și confirmă providerul, beneficiile și checkout-urile compilate.

| Candidat privat | Dimensiune | SHA-256 final |
|---|---:|---|
| `TynRent_Setup_1.0.1.exe` | 32.637.344 bytes | `4dbb2d7ba2cb56f73c5b6b211645f6b91e872db9d9b39f2c05e98d2654fe5d7d` |
| `OfferDesk-1.0.1-Setup.exe` | 38.070.936 bytes | `de4c3d24484433159d6cd8022cf11d8fc551d7632093b53a155fd3b2888cf537` |

Niciun installer nu a fost încărcat public sau înlocuit. Aprobările istorice pentru hash-urile 1.0.0 nu se transferă asupra noilor candidați. Verificarea surselor Qt pentru Offer Desk scrie raportul nou în folderul build-ului, fără să rescrie manifestul release-ului anterior.

## Publicare coordonată — numai după aprobarea explicită

1. Configurați organizația și beneficiile Sandbox independent; emiteți o cheie de test pentru fiecare produs. Executați pe trei profile/dispozitive matricea reală activare×2/refuz×3/dezactivare/reutilizare, cross-product, revocare, invalidare, restart/offline și activare după trial expirat. Verificați comportamentul dacă răspunsul activării se pierde în rețea.
2. Confirmați în Polar prețul/currency/one-time, prefixul fără separator, beneficiul corect, limita 2, expirarea absentă, tax exclusive/inclusive și fluxul Customer Portal. Confirmați aprobarea contului; nu deduceți aprobarea din existența checkout-ului.
3. Revizuiți juridic și fiscal termenii buyer/MoR, politica de rambursare și drepturile legale ale consumatorilor, politica de confidențialitate și transferurile de date, facturile/taxele și tratamentul comenzilor istorice. Actualizați data efectivă numai la intrarea în vigoare.
4. Revizuiți PR-urile și rezultatele exacte ale candidaților. Aprobați separat hash-urile, documentația comercială/LGPL și testele manuale Windows relevante; semnătura nu înseamnă aprobare de release.
5. După acord, încărcați în căi R2 noi `tynrent/1.0.1/` și `offerdesk/1.0.1/`, fără a schimba obiectele 1.0.0. Verificați din nou SHA-256 și semnăturile după download.
6. Actualizați într-un commit separat website-ul la exactele artefacte aprobate 1.0.1 și guard-urile aferente. Verificați checkout→cheie→activare și downloadurile; apoi aprobați merge/deploy coordonat. O tranzacție Production sau activare Production necesită aprobare separată.

## Rollback și limite

Păstrați produsele, beneficiile, cheile și API-ul Lemon funcționale. Păstrați 1.0.0, hash-urile originale și tagurile; nu revocați clienții vechi. Website-ul poate reveni prin revert la prețurile/checkout-urile Lemon și downloadurile 1.0.0, după acord. Nu ștergeți date, trial sau fișierele Polar în rollback.

**Un client care a primit deja o cheie Polar nu poate activa 1.0.0.** În acest caz păstrați și distribuiți versiunea 1.0.1 compatibilă și portalul Polar, chiar dacă opriți vânzările noi. Revenirea comercială nu justifică downgrade forțat sau pierderea drepturilor cumpărătorului. Pentru viitoare versiuni majore folosiți beneficii distincte dacă drepturile nu includ upgrade-ul major.

Rămân obligatorii testele reale Polar Sandbox, verificarea aprobării contului, testul comercial Production autorizat separat, verificarea manuală a fluxului de cumpărare/activare și matricea vizuală Windows/DPI/limbi. Nu s-a pretins PASS pentru acestea.
