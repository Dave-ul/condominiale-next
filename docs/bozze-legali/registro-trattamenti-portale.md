# BOZZA — da validare con un legale/DPO

# Registro delle attività di trattamento (art. 30 GDPR) — voce "Portale condominiale"

*Due voci: una nel registro del **titolare** (ciascun Condominio, art. 30.1), una nel registro del **responsabile** (l'amministratore, art. 30.2). Campi tra [parentesi] da completare.*

## A. Registro del titolare (Condominio [denominazione])

| Campo | Contenuto |
|---|---|
| Titolare | Condominio [denominazione], [indirizzo], C.F. [ ], rappresentato dall'amministratore pro tempore |
| DPO | [se designato / "non designato"] |
| Denominazione del trattamento | Sito internet condominiale ex art. 71-ter disp. att. c.c. |
| Finalità | Consultazione ed estrazione in formato digitale dei documenti deliberati dall'assemblea; gestione delle quote e delle ricevute; segnalazioni di manutenzione |
| Base giuridica | Art. 6.1.c (artt. 71-ter disp. att., 1129, 1130, 1130-bis c.c.); art. 6.1.b/f per le segnalazioni |
| Delibera istitutiva | Assemblea del [data], maggioranza ex art. 1136 c. 2 c.c.; documenti pubblicabili: [elenco] |
| Categorie di interessati | Condòmini, titolari di diritti reali o di godimento, conduttori [se ammessi dalla delibera] |
| Categorie di dati | Identificativi, contatti, unità immobiliare, dati contabili, contenuto delle segnalazioni, credenziali e log di accesso |
| Dati particolari | Non previsti; possibili in modo occasionale nel testo libero delle segnalazioni |
| Destinatari | Amministratore (responsabile); sub-responsabili Supabase Inc., Vercel Inc., Aruba S.p.A. (SMTP); creditori del condominio ex art. 63 disp. att. c.c. (fuori dal portale) |
| Trasferimenti extra UE | Sub-responsabili USA di Supabase e Vercel; garanzie: SCC nei rispettivi DPA [+ DPF se applicabile] |
| Termini di cancellazione | Vedi informativa § 6 (contabilità 10 anni; segnalazioni [24] mesi; account alla cessazione) |
| Misure di sicurezza (art. 32) | Accesso individuale con credenziali; accesso solo su invito; isolamento dei dati per condominio e per residente (Row Level Security); password con hash bcrypt, lunghezza minima 12; MFA per l'amministratore [da attivare]; cifratura in transito (HTTPS/HSTS) e a riposo (Supabase); file privati con URL firmati a 60 secondi; CSP; database in UE; backup [indicare]; procedura data breach [riferimento] |

## B. Registro del responsabile (amministratore [nome/ditta])

| Campo | Contenuto |
|---|---|
| Responsabile | [nome/ditta, sede, contatti] |
| Titolari per conto dei quali agisce | Condominio [A], Condominio [B], … (uno per ciascun condominio che ha deliberato il sito) |
| Categorie di trattamenti | Gestione tecnica del portale condominiale: pubblicazione documenti, gestione account, gestione quote e segnalazioni |
| Sub-responsabili | Supabase Inc. (database, auth, storage — UE eu-central-1); Vercel Inc. (hosting — fra1); Aruba S.p.A. (invio email — Italia) |
| Trasferimenti extra UE | Come sopra |
| Misure di sicurezza | Come sopra |
