// Predefined response library for the mock AI provider.
//
// Each template ships a `primary` answer and a semantically-equivalent `retry`
// rephrasing. The retry button in the chat performs a *client-side text swap*
// between these two variants — no reasoning is re-run and no request is
// re-issued, which is what makes the swap feel instant (sub-100ms) while
// staying indistinguishable from a live "regenerate" call.
//
// Scenarios cover both ENTERPRISE-AGENT interactions (data retrieval, status
// updates, error handling, confirmation, analysis, recommendation,
// clarification), FRONTEND-CODING help (DOM, events, state) and everyday
// CONVERSATION (greetings, small talk, love & relationships, entertainment,
// daily-life helpers, food, travel, wellbeing and work/career) — so the mockup
// answers "ciao come stai" and "che film guardo stasera" as naturally as a
// query about a deploy. 188 templates in total (= 376 phrasings).

export type ResponseScenario =
  | "data-retrieval"
  | "status-update"
  | "error-handling"
  | "confirmation"
  | "analysis"
  | "recommendation"
  | "clarification"
  // Frontend-coding macro-topics: concrete, browser-only "how do I…" answers
  // (real code snippets), so the assistant covers development questions — DOM
  // work, event wiring, client-side state — not just enterprise-agent chatter.
  | "dom-manipulation"
  | "event-handling"
  | "state-management"
  // Casual / everyday macro-topics: the assistant must also hold a normal
  // conversation — greetings and small talk, relationship and life advice,
  // entertainment picks, daily-life helpers, food, travel, wellbeing and work
  // /career. These answers are warm, empathetic prose (no code) so the mockup
  // covers "ciao come stai" through "consigli sull'amore" and "cosa guardo
  // stasera", not just enterprise-agent chatter.
  | "greeting"
  | "smalltalk"
  | "relationships"
  | "entertainment"
  | "daily-life"
  | "food-cooking"
  | "travel"
  | "wellbeing"
  | "career";

export interface ResponseTemplate {
  id: string;
  scenario: ResponseScenario;
  /** Answer shown on first render. */
  primary: string;
  /** Alternative shown after a retry swap — same intent, different phrasing. */
  retry: string;
}

export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  // ── Data retrieval ──────────────────────────────────────────────────────
  {
    id: "tpl-01",
    scenario: "data-retrieval",
    primary:
      "Ho recuperato i dati richiesti dal sistema. Il dataset contiene 12.480 record aggiornati all'ultima sincronizzazione delle 14:32. Vuoi che li esporti in formato CSV o che ne generi una sintesi aggregata?",
    retry:
      "L'estrazione è completata: sono disponibili 12.480 record, sincronizzati alle 14:32. Posso fornirteli come file CSV oppure prepararti un riepilogo aggregato — dimmi tu quale preferisci.",
  },
  {
    id: "tpl-02",
    scenario: "data-retrieval",
    primary:
      "La query è stata eseguita con successo su tre tabelle correlate. Ho individuato 47 corrispondenze che soddisfano i filtri applicati. Procedo con la visualizzazione dettagliata o preferisci solo i valori chiave?",
    retry:
      "Interrogazione completata su tre tabelle collegate: 47 risultati rispettano i criteri impostati. Ti mostro il dettaglio completo oppure mi limito agli indicatori principali?",
  },
  {
    id: "tpl-03",
    scenario: "data-retrieval",
    primary:
      "Ho consultato l'archivio documentale e trovato 8 documenti pertinenti alla tua ricerca. Il più recente risale a ieri alle 18:10. Vuoi che apra il primo risultato o che ti presenti l'elenco completo?",
    retry:
      "La ricerca nell'archivio ha prodotto 8 documenti rilevanti, l'ultimo caricato ieri alle 18:10. Preferisci che apra subito il primo o che ti elenchi tutti i risultati?",
  },
  {
    id: "tpl-04",
    scenario: "data-retrieval",
    primary:
      "I dati finanziari del trimestre sono stati caricati correttamente. Il fatturato risulta pari a €2,4M, in crescita del 6,3% rispetto al periodo precedente. Posso approfondire le voci che hanno inciso di più.",
    retry:
      "Caricamento dei dati finanziari trimestrali riuscito: ricavi a €2,4M, con un incremento del 6,3% sul trimestre passato. Se vuoi, analizzo le componenti che hanno pesato maggiormente.",
  },
  {
    id: "tpl-05",
    scenario: "data-retrieval",
    primary:
      "Ho interrogato l'API dei clienti e ottenuto il profilo completo dell'account richiesto. Risulta attivo dal marzo 2023 con piano Enterprise. Vuoi consultare lo storico delle interazioni o i dati di fatturazione?",
    retry:
      "Il profilo dell'account è stato recuperato dall'API clienti: attivo da marzo 2023, piano Enterprise. Ti mostro lo storico delle interazioni oppure preferisci i dettagli di fatturazione?",
  },
  {
    id: "tpl-06",
    scenario: "data-retrieval",
    primary:
      "La sincronizzazione con il CRM è andata a buon fine. Ho importato 320 nuovi contatti e aggiornato 145 record esistenti. Nessun conflitto rilevato durante l'operazione.",
    retry:
      "Sincronizzazione CRM completata senza errori: 320 contatti aggiunti e 145 già presenti aggiornati. Non sono emersi conflitti nel corso del processo.",
  },
  {
    id: "tpl-07",
    scenario: "data-retrieval",
    primary:
      "Ho estratto le metriche di utilizzo degli ultimi 30 giorni. Gli utenti attivi giornalieri sono in media 4.210, con un picco di 5.870 registrato lo scorso martedì. Vuoi il grafico dell'andamento?",
    retry:
      "Ecco le metriche di utilizzo del mese: in media 4.210 utenti attivi al giorno, con un massimo di 5.870 martedì scorso. Posso generarti il grafico dell'andamento se ti è utile.",
  },
  {
    id: "tpl-08",
    scenario: "data-retrieval",
    primary:
      "La ricerca semantica ha restituito i cinque risultati più rilevanti per la tua domanda, ordinati per affidabilità. La corrispondenza principale ha un punteggio di pertinenza del 94%. Procedo con l'approfondimento?",
    retry:
      "Ho completato la ricerca semantica: i cinque riscontri più pertinenti sono ordinati per affidabilità, con il primo che raggiunge il 94% di pertinenza. Vuoi che entri nel dettaglio?",
  },

  // ── Status updates ──────────────────────────────────────────────────────
  {
    id: "tpl-09",
    scenario: "status-update",
    primary:
      "L'attività è in corso di elaborazione: al momento risulta completata al 68%. Il completamento stimato è tra circa 4 minuti. Ti avviserò non appena il processo termina.",
    retry:
      "Elaborazione ancora attiva, avanzamento al 68%. Prevedo la conclusione entro 4 minuti circa e ti notificherò appena tutto sarà pronto.",
  },
  {
    id: "tpl-10",
    scenario: "status-update",
    primary:
      "Il deploy in ambiente di staging è stato avviato correttamente. Le pipeline di build e test sono state superate senza errori. Il rilascio in produzione è in attesa della tua approvazione finale.",
    retry:
      "Distribuzione su staging avviata con successo: build e test sono passati senza anomalie. Manca solo il tuo via libera per procedere in produzione.",
  },
  {
    id: "tpl-11",
    scenario: "status-update",
    primary:
      "Tutti i sistemi risultano operativi. Latenza media delle API a 82ms, disponibilità al 99,98% nelle ultime 24 ore. Nessun incidente attivo al momento.",
    retry:
      "Stato dei servizi nominale: API con latenza media di 82ms e uptime al 99,98% nell'ultimo giorno. Non ci sono incidenti in corso.",
  },
  {
    id: "tpl-12",
    scenario: "status-update",
    primary:
      "La procedura di backup notturna è stata completata regolarmente alle 03:14. Sono stati salvati 1,2 TB di dati su tre repliche geografiche. L'integrità dei file è stata verificata.",
    retry:
      "Backup notturno concluso alle 03:14 senza problemi: 1,2 TB replicati su tre località distinte e integrità dei dati confermata.",
  },
  {
    id: "tpl-13",
    scenario: "status-update",
    primary:
      "La richiesta è stata inoltrata al team competente ed è ora in coda con priorità media. Il tempo di presa in carico stimato è di circa 2 ore lavorative. Riceverai un aggiornamento automatico.",
    retry:
      "Ho trasmesso la richiesta al reparto di riferimento: è in coda con priorità media e verrà presa in carico entro circa 2 ore lavorative. Ti terrò aggiornato.",
  },
  {
    id: "tpl-14",
    scenario: "status-update",
    primary:
      "L'importazione dei dati è a metà dell'opera: 6 file su 12 sono già stati processati senza scarti. Continuo con i restanti e ti confermo appena chiudo l'intero lotto.",
    retry:
      "Processo di importazione al 50%: elaborati 6 file su 12, nessuno scartato finora. Proseguo con quelli rimanenti e ti avviso a completamento.",
  },
  {
    id: "tpl-15",
    scenario: "status-update",
    primary:
      "L'aggiornamento della configurazione è stato applicato a tutti i nodi del cluster. La propagazione è avvenuta in 11 secondi e nessun servizio ha subito interruzioni.",
    retry:
      "Nuova configurazione distribuita su ogni nodo del cluster in 11 secondi, senza alcun downtime dei servizi.",
  },
  {
    id: "tpl-16",
    scenario: "status-update",
    primary:
      "Il flusso di lavoro automatizzato è stato eseguito secondo pianificazione. Tutti i 9 passaggi si sono conclusi con esito positivo e i risultati sono già disponibili nella dashboard.",
    retry:
      "Workflow automatico completato come previsto: i 9 step hanno tutti avuto esito positivo e trovi i risultati nella dashboard.",
  },

  // ── Error handling ──────────────────────────────────────────────────────
  {
    id: "tpl-17",
    scenario: "error-handling",
    primary:
      "Ho riscontrato un problema durante l'accesso alla risorsa richiesta: il servizio ha risposto con un timeout. Ho già avviato un nuovo tentativo automatico. Se l'errore persiste, posso segnalarlo al supporto.",
    retry:
      "L'operazione non è andata a buon fine per un timeout del servizio remoto. Sto ritentando in automatico; qualora il problema continui, provvedo a inoltrare una segnalazione al supporto.",
  },
  {
    id: "tpl-18",
    scenario: "error-handling",
    primary:
      "Non sono riuscito a completare la richiesta perché mancano alcuni parametri obbligatori. In particolare non è stato fornito l'identificativo del progetto. Puoi indicarmelo per procedere?",
    retry:
      "La richiesta risulta incompleta: manca l'identificativo del progetto, che è un campo obbligatorio. Se me lo comunichi, posso portare a termine l'operazione.",
  },
  {
    id: "tpl-19",
    scenario: "error-handling",
    primary:
      "L'operazione è stata bloccata per un problema di autorizzazioni: l'account attuale non dispone dei permessi necessari su questa risorsa. Contatta un amministratore per abilitare l'accesso.",
    retry:
      "Impossibile procedere: i permessi associati al tuo profilo non consentono l'accesso a questa risorsa. Sarà necessario l'intervento di un amministratore per sbloccarlo.",
  },
  {
    id: "tpl-20",
    scenario: "error-handling",
    primary:
      "Ho rilevato un'incongruenza nei dati in ingresso: due record presentano lo stesso identificativo univoco. Ho interrotto l'elaborazione per evitare duplicazioni. Vuoi che ti mostri i record in conflitto?",
    retry:
      "Elaborazione sospesa: ho trovato due record che condividono lo stesso ID univoco, e ho preferito fermarmi per non generare duplicati. Ti elenco le voci in conflitto?",
  },
  {
    id: "tpl-21",
    scenario: "error-handling",
    primary:
      "La connessione al database non è disponibile in questo momento. Il servizio potrebbe essere in manutenzione. Ho messo in coda la tua richiesta e la eseguirò automaticamente al ripristino.",
    retry:
      "Al momento non riesco a raggiungere il database, probabilmente per un intervento di manutenzione. La tua richiesta è stata accodata e verrà processata non appena il servizio torna attivo.",
  },
  {
    id: "tpl-22",
    scenario: "error-handling",
    primary:
      "Il file caricato non è stato accettato perché supera il limite massimo consentito di 25 MB. Ti suggerisco di comprimerlo o di suddividerlo in parti più piccole prima di riprovare.",
    retry:
      "Caricamento rifiutato: il file eccede il tetto di 25 MB. Prova a comprimerlo oppure a dividerlo in porzioni più leggere e ripeti l'operazione.",
  },
  {
    id: "tpl-23",
    scenario: "error-handling",
    primary:
      "La validazione del formato è fallita: il campo email non rispetta la struttura attesa. Verifica che l'indirizzo contenga il simbolo '@' e un dominio valido, poi invia nuovamente.",
    retry:
      "Il controllo di validità ha segnalato un errore nel campo email: il formato non è corretto. Assicurati che ci siano '@' e un dominio valido, quindi riprova.",
  },
  {
    id: "tpl-24",
    scenario: "error-handling",
    primary:
      "L'azione non può essere completata perché la sessione è scaduta per inattività. Per motivi di sicurezza è necessario effettuare nuovamente l'accesso e ripetere l'operazione.",
    retry:
      "La tua sessione è scaduta a causa dell'inattività prolungata, quindi non posso concludere l'azione. Effettua di nuovo il login e riprova, per garantire la sicurezza dell'account.",
  },

  // ── Confirmation ────────────────────────────────────────────────────────
  {
    id: "tpl-25",
    scenario: "confirmation",
    primary:
      "Perfetto, ho registrato le modifiche richieste. Le impostazioni aggiornate sono già attive e verranno applicate a tutte le sessioni successive. C'è altro su cui posso intervenire?",
    retry:
      "Fatto: le modifiche sono state salvate e sono operative da subito su ogni nuova sessione. Fammi sapere se serve altro.",
  },
  {
    id: "tpl-26",
    scenario: "confirmation",
    primary:
      "La tua richiesta è stata inviata correttamente. Ho generato il numero di riferimento #A-90427 che puoi utilizzare per tracciarne lo stato in qualsiasi momento.",
    retry:
      "Invio confermato: alla tua richiesta è stato assegnato il codice #A-90427, con cui potrai seguirne l'avanzamento quando vuoi.",
  },
  {
    id: "tpl-27",
    scenario: "confirmation",
    primary:
      "Ho pianificato l'attività per venerdì alle 09:00 come indicato. Ho aggiunto un promemoria e invierò una notifica 15 minuti prima dell'inizio. Vuoi coinvolgere altri partecipanti?",
    retry:
      "Attività programmata per venerdì alle 09:00, con promemoria attivo e avviso 15 minuti prima. Se desideri, posso aggiungere altri partecipanti.",
  },
  {
    id: "tpl-28",
    scenario: "confirmation",
    primary:
      "Confermo l'annullamento dell'operazione richiesta. Nessuna modifica è stata applicata e lo stato precedente è stato ripristinato integralmente. Puoi procedere in tutta tranquillità.",
    retry:
      "Operazione annullata come da tua indicazione: non è stata apportata alcuna modifica e tutto è tornato allo stato iniziale.",
  },
  {
    id: "tpl-29",
    scenario: "confirmation",
    primary:
      "Il documento è stato firmato digitalmente e archiviato nel repository condiviso. Tutti i destinatari autorizzati hanno ricevuto una copia via email. L'operazione è tracciata nel registro di audit.",
    retry:
      "Firma digitale apposta e documento salvato nel repository condiviso: i destinatari abilitati hanno ricevuto la propria copia e l'evento è registrato nell'audit log.",
  },
  {
    id: "tpl-30",
    scenario: "confirmation",
    primary:
      "Ho applicato il pagamento all'ordine #77120. La transazione di €480,00 è stata autorizzata e la ricevuta è disponibile nell'area documenti. Grazie per aver completato la procedura.",
    retry:
      "Pagamento registrato sull'ordine #77120: l'importo di €480,00 è stato autorizzato e trovi la ricevuta nell'area documenti. Procedura conclusa correttamente.",
  },
  {
    id: "tpl-31",
    scenario: "confirmation",
    primary:
      "L'utente è stato invitato con successo allo spazio di lavoro con ruolo Editor. Riceverà un'email con il link di accesso valido per 72 ore. Vuoi assegnargli anche un team specifico?",
    retry:
      "Invito inviato: il nuovo utente entrerà nello spazio di lavoro come Editor e troverà nell'email un link valido 72 ore. Se vuoi, lo associo anche a un team preciso.",
  },
  {
    id: "tpl-32",
    scenario: "confirmation",
    primary:
      "Le tue preferenze di notifica sono state aggiornate. D'ora in poi riceverai solo gli avvisi prioritari via email e i restanti nel centro notifiche. Puoi rivedere questa scelta quando vuoi.",
    retry:
      "Preferenze di notifica salvate: le email ti arriveranno solo per gli avvisi prioritari, mentre gli altri resteranno nel centro notifiche. Potrai modificare l'impostazione in qualunque momento.",
  },

  // ── Analysis / insights ─────────────────────────────────────────────────
  {
    id: "tpl-33",
    scenario: "analysis",
    primary:
      "Dall'analisi dei dati emerge un trend di crescita costante: le conversioni sono aumentate del 14% negli ultimi tre mesi, trainate principalmente dal canale organico. Il segmento mobile mostra il margine di miglioramento più ampio.",
    retry:
      "I dati raccontano una crescita solida: +14% di conversioni nell'ultimo trimestre, spinte soprattutto dal traffico organico. È il canale mobile a offrire il maggiore potenziale ancora inespresso.",
  },
  {
    id: "tpl-34",
    scenario: "analysis",
    primary:
      "Ho confrontato le due opzioni sotto il profilo costi-benefici. La soluzione A comporta un investimento iniziale più alto ma un ritorno più rapido, mentre la B è più conservativa. Sul lungo periodo A risulta più vantaggiosa.",
    retry:
      "Mettendo a confronto le alternative, la A richiede più capitale all'inizio ma rientra prima, mentre la B è più prudente. Guardando all'orizzonte lungo, la A si dimostra la scelta più conveniente.",
  },
  {
    id: "tpl-35",
    scenario: "analysis",
    primary:
      "Ho individuato un'anomalia nell'andamento delle vendite: un calo del 22% concentrato nella prima settimana del mese, correlato a un'interruzione del servizio. Escludendo quel periodo, il trend resta positivo.",
    retry:
      "Emerge un'irregolarità nelle vendite: -22% nella prima settimana, coincidente con un disservizio tecnico. Al netto di quell'intervallo, la tendenza complessiva rimane in crescita.",
  },
  {
    id: "tpl-36",
    scenario: "analysis",
    primary:
      "La segmentazione della clientela evidenzia tre cluster principali. Il gruppo ad alto valore rappresenta il 12% degli utenti ma genera il 41% dei ricavi, suggerendo un forte potenziale per iniziative di fidelizzazione mirate.",
    retry:
      "Dividendo la base clienti emergono tre cluster: quello di fascia alta pesa solo il 12% degli utenti ma produce il 41% del fatturato, un dato che invita a investire in programmi di fidelizzazione dedicati.",
  },
  {
    id: "tpl-37",
    scenario: "analysis",
    primary:
      "Il modello ha identificato le tre variabili più predittive per il churn: frequenza di utilizzo, tempo dall'ultimo accesso e numero di ticket aperti. Agire sulla prima potrebbe ridurre l'abbandono in modo significativo.",
    retry:
      "Secondo il modello, i tre fattori che meglio anticipano l'abbandono sono la frequenza d'uso, la distanza dall'ultimo accesso e i ticket aperti. Intervenire sulla frequenza d'uso avrebbe l'impatto maggiore nel trattenere gli utenti.",
  },
  {
    id: "tpl-38",
    scenario: "analysis",
    primary:
      "Riassumo i punti salienti del report: budget rispettato entro il 3% di scostamento, obiettivi trimestrali raggiunti al 92% e due rischi operativi da monitorare. Il quadro complessivo è positivo ma richiede attenzione sui tempi di consegna.",
    retry:
      "In sintesi, il report mostra un budget in linea (scarto del 3%), obiettivi trimestrali centrati al 92% e due rischi operativi da tenere d'occhio. La situazione è buona, con un punto di attenzione sulle tempistiche di consegna.",
  },
  {
    id: "tpl-39",
    scenario: "analysis",
    primary:
      "Ho analizzato il sentiment dei feedback ricevuti: il 71% è positivo, il 18% neutro e l'11% negativo. Le critiche si concentrano sui tempi di risposta del supporto, mentre gli apprezzamenti riguardano la facilità d'uso.",
    retry:
      "L'analisi del sentiment sui feedback restituisce un 71% di giudizi positivi, 18% neutri e 11% negativi. Il malcontento riguarda soprattutto la lentezza del supporto, mentre la semplicità d'uso raccoglie i consensi maggiori.",
  },
  {
    id: "tpl-40",
    scenario: "analysis",
    primary:
      "Confrontando le prestazioni con il benchmark di settore, ti collochi sopra la media in efficienza operativa ma leggermente sotto nella retention. C'è margine per recuperare puntando sull'esperienza post-vendita.",
    retry:
      "Rispetto al benchmark di settore, superi la media in efficienza operativa ma resti un po' indietro sulla retention. Rafforzare il post-vendita sarebbe la leva più efficace per colmare il divario.",
  },

  // ── Recommendation ──────────────────────────────────────────────────────
  {
    id: "tpl-41",
    scenario: "recommendation",
    primary:
      "In base al tuo obiettivo, ti consiglio di partire dall'automazione dei processi ripetitivi: è l'intervento con il miglior rapporto sforzo-risultato e libera risorse per le attività a maggior valore. Posso aiutarti a definire il primo flusso.",
    retry:
      "Considerato ciò che vuoi ottenere, il primo passo più sensato è automatizzare le operazioni ripetitive: richiede poco sforzo e restituisce molto tempo per il lavoro strategico. Se vuoi, impostiamo insieme il flusso iniziale.",
  },
  {
    id: "tpl-42",
    scenario: "recommendation",
    primary:
      "Per la tua esigenza, il piano Business è l'opzione più equilibrata: include le integrazioni che ti servono e un limite di utenti adeguato alla crescita prevista. Il piano Enterprise diventa utile solo oltre i 50 utenti.",
    retry:
      "Guardando alle tue necessità, il piano Business rappresenta il compromesso migliore: copre le integrazioni richieste e un numero di utenti compatibile con la tua espansione. L'Enterprise ha senso solo superati i 50 utenti.",
  },
  {
    id: "tpl-43",
    scenario: "recommendation",
    primary:
      "Ti suggerisco di impostare un alert automatico sulla soglia critica dello stock: così potrai riordinare prima dell'esaurimento ed evitare interruzioni. Posso configurarlo con notifica sia via email sia in dashboard.",
    retry:
      "Un accorgimento utile è attivare un avviso automatico quando lo stock raggiunge il livello minimo, per riordinare in tempo ed evitare rotture. Se vuoi, lo configuro con notifiche via email e in dashboard.",
  },
  {
    id: "tpl-44",
    scenario: "recommendation",
    primary:
      "Prima di scalare l'infrastruttura, ti consiglio di ottimizzare le query più lente: da un'analisi preliminare, tre di esse assorbono gran parte del carico. Intervenire qui potrebbe rendere superfluo un upgrade costoso.",
    retry:
      "Piuttosto che ampliare subito l'infrastruttura, conviene ottimizzare le query più pesanti: tre di queste generano la maggior parte del carico. Sistemandole potresti evitare un aggiornamento oneroso.",
  },
  {
    id: "tpl-45",
    scenario: "recommendation",
    primary:
      "La strategia più efficace nel tuo caso è un rollout graduale: attiva la nuova funzionalità sul 10% degli utenti, raccogli i dati e poi estendila. Riduci il rischio e ottieni feedback reali prima del lancio completo.",
    retry:
      "Ti consiglierei un rilascio progressivo: parti dal 10% degli utenti, misura i risultati e amplia man mano. In questo modo contieni il rischio e raccogli riscontri concreti prima della diffusione totale.",
  },
  {
    id: "tpl-46",
    scenario: "recommendation",
    primary:
      "Per migliorare la sicurezza senza appesantire l'esperienza, ti suggerisco l'autenticazione a due fattori solo sulle azioni sensibili. Bilancia protezione e usabilità meglio di un'imposizione generalizzata.",
    retry:
      "Un buon compromesso tra sicurezza e comodità è richiedere la verifica in due passaggi soltanto per le operazioni critiche: protegge dove conta senza appesantire l'uso quotidiano.",
  },

  // ── Clarification ───────────────────────────────────────────────────────
  {
    id: "tpl-47",
    scenario: "clarification",
    primary:
      "Per darti la risposta più precisa, ho bisogno di un chiarimento: ti riferisci ai dati dell'anno solare o dell'anno fiscale? Le due prospettive portano a risultati diversi.",
    retry:
      "Vorrei essere accurato: stai considerando l'anno solare oppure quello fiscale? A seconda della scelta i numeri cambiano sensibilmente.",
  },
  {
    id: "tpl-48",
    scenario: "clarification",
    primary:
      "Ho capito la direzione generale della tua richiesta, ma posso interpretarla in due modi. Preferisci un riepilogo sintetico dei punti chiave o un'analisi dettagliata con i dati a supporto?",
    retry:
      "La tua richiesta è chiara nel complesso, però esistono due possibili letture. Vuoi una panoramica essenziale dei punti principali oppure un approfondimento con tutti i dati?",
  },
  {
    id: "tpl-49",
    scenario: "clarification",
    primary:
      "Posso procedere in autonomia, ma preferisco confermare prima di apportare modifiche irreversibili: intendi eliminare definitivamente i record selezionati o solo archiviarli? Fammi sapere come procedere.",
    retry:
      "Prima di compiere un'azione non reversibile chiedo conferma: vuoi cancellare in modo permanente i record scelti oppure archiviarli soltanto? Attendo la tua indicazione.",
  },
  {
    id: "tpl-50",
    scenario: "clarification",
    primary:
      "Ho trovato più elementi che corrispondono al nome indicato. Per procedere correttamente, potresti specificare a quale ti riferisci indicandone l'identificativo o l'area di appartenenza?",
    retry:
      "Esistono diversi risultati associati a quel nome. Per non sbagliare, mi indichi l'identificativo esatto o il contesto di riferimento di quello che ti interessa?",
  },

  // ── DOM manipulation ────────────────────────────────────────────────────
  {
    id: "tpl-51",
    scenario: "dom-manipulation",
    primary:
      "Per selezionare elementi nel DOM usa `querySelector` (primo match) o `querySelectorAll` (tutti):\n\n```js\nconst title = document.querySelector('#title');\nconst items = document.querySelectorAll('.item');\nitems.forEach((el) => console.log(el.textContent));\n```\n\n`querySelector` accetta qualsiasi selettore CSS ed è più flessibile di `getElementById`.",
    retry:
      "Il modo moderno di ottenere un riferimento a un nodo è `querySelector` per il singolo elemento e `querySelectorAll` per una lista:\n\n```js\nconst box = document.querySelector('.box');\nconst rows = [...document.querySelectorAll('tr')];\nrows.map((r) => r.dataset.id);\n```\n\nLo spread `[...]` trasforma la NodeList in un vero array, così puoi usare `map`/`filter`.",
  },
  {
    id: "tpl-52",
    scenario: "dom-manipulation",
    primary:
      "Per creare un elemento e inserirlo nel DOM:\n\n```js\nconst li = document.createElement('li');\nli.textContent = 'Nuovo elemento';\nli.classList.add('item');\ndocument.querySelector('#list').append(li);\n```\n\n`append` accetta più nodi o stringhe ed è più flessibile del vecchio `appendChild`.",
    retry:
      "Costruisci il nodo, popolane il contenuto e agganciarlo al genitore:\n\n```js\nconst card = document.createElement('div');\ncard.className = 'card';\ncard.textContent = 'Titolo';\ndocument.body.append(card);\n```\n\nUsa `textContent` invece di `innerHTML` quando il testo arriva dall'utente, per evitare injection.",
  },
  {
    id: "tpl-53",
    scenario: "dom-manipulation",
    primary:
      "Per aggiungere, togliere o alternare una classe usa l'API `classList`:\n\n```js\nconst el = document.querySelector('.menu');\nel.classList.add('open');\nel.classList.remove('hidden');\nel.classList.toggle('active');\nconst isOpen = el.classList.contains('open');\n```\n\n`toggle` accetta un secondo argomento booleano per forzare lo stato.",
    retry:
      "`classList` è il modo pulito di manipolare le classi senza toccare `className` a mano:\n\n```js\nbutton.classList.toggle('is-loading', isLoading);\n```\n\nPassando il booleano come secondo parametro, la classe viene aggiunta se `true` e rimossa se `false` — perfetto per riflettere uno stato.",
  },
  {
    id: "tpl-54",
    scenario: "dom-manipulation",
    primary:
      "Per aggiornare il contenuto di un elemento, preferisci `textContent` (testo puro, sicuro) a `innerHTML` (interpreta HTML):\n\n```js\nconst label = document.querySelector('#status');\nlabel.textContent = `Online: ${count}`;\n```\n\nUsa `innerHTML` solo con markup di cui ti fidi; con input utente rischi XSS.",
    retry:
      "La differenza chiave: `textContent` scrive testo letterale, `innerHTML` interpreta i tag.\n\n```js\nnode.textContent = userInput; // sicuro\nnode.innerHTML = '<b>Ciao</b>'; // solo con markup fidato\n```\n\nPer contenuto basato su dati dell'utente, resta su `textContent`.",
  },
  {
    id: "tpl-55",
    scenario: "dom-manipulation",
    primary:
      "Per leggere e scrivere attributi usa `getAttribute`/`setAttribute`, e `dataset` per i `data-*`:\n\n```js\nconst el = document.querySelector('.widget');\nel.setAttribute('aria-expanded', 'true');\nel.dataset.userId = '42';\nconsole.log(el.dataset.userId); // '42'\n```\n\n`dataset` mappa automaticamente `data-user-id` in camelCase.",
    retry:
      "Gli attributi standard si gestiscono con `setAttribute`/`getAttribute`; per dati custom conviene `dataset`:\n\n```js\nbtn.setAttribute('disabled', '');\nbtn.dataset.action = 'save';\n```\n\nOgni `data-*` diventa una proprietà camelCase di `element.dataset`.",
  },
  {
    id: "tpl-56",
    scenario: "dom-manipulation",
    primary:
      "Per rimuovere un nodo o sostituirlo usa i metodi moderni:\n\n```js\nconst el = document.querySelector('.toast');\nel.remove(); // rimuove sé stesso\nel.replaceWith(newNode); // lo sostituisce\n```\n\nNon serve più `parent.removeChild(el)`: `el.remove()` è supportato ovunque.",
    retry:
      "L'API moderna evita di risalire al genitore:\n\n```js\noldRow.replaceWith(newRow);\ndocument.querySelector('#temp')?.remove();\n```\n\nL'optional chaining `?.` evita l'errore se l'elemento non esiste.",
  },
  {
    id: "tpl-57",
    scenario: "dom-manipulation",
    primary:
      "Per renderizzare una lista da un array, costruisci l'HTML e assegnalo una volta sola:\n\n```js\nconst data = ['Uno', 'Due', 'Tre'];\ndocument.querySelector('#list').innerHTML = data\n  .map((t) => `<li>${t}</li>`)\n  .join('');\n```\n\nPer molti nodi usa un `DocumentFragment`, così tocchi il DOM una volta sola.",
    retry:
      "Mappa i dati in markup, oppure usa un fragment per le performance:\n\n```js\nconst frag = document.createDocumentFragment();\nfor (const t of data) {\n  const li = document.createElement('li');\n  li.textContent = t;\n  frag.append(li);\n}\nlist.append(frag);\n```\n\nIl fragment accumula i nodi in memoria e li inserisce con un solo reflow.",
  },
  {
    id: "tpl-58",
    scenario: "dom-manipulation",
    primary:
      "Per mostrare o nascondere un elemento, alterna una classe CSS invece di toccare `style` inline:\n\n```js\nconst panel = document.querySelector('#panel');\npanel.classList.toggle('hidden');\n```\n```css\n.hidden { display: none; }\n```\n\nTenere lo stile nel CSS mantiene la logica separata dalla presentazione.",
    retry:
      "Meglio una classe utility, o l'attributo nativo, che manipolare `style.display` a mano:\n\n```js\npanel.hidden = !panel.hidden; // attributo booleano nativo\n```\n\nL'attributo `hidden` è supportato dai browser e non richiede CSS aggiuntivo.",
  },

  // ── Event handling ──────────────────────────────────────────────────────
  {
    id: "tpl-59",
    scenario: "event-handling",
    primary:
      "Per reagire a un click, registra un listener con `addEventListener`:\n\n```js\nconst btn = document.querySelector('#save');\nbtn.addEventListener('click', (event) => {\n  event.preventDefault();\n  console.log('Salvato!');\n});\n```\n\n`addEventListener` permette più handler sullo stesso evento, a differenza di `onclick`.",
    retry:
      "Il pattern base per gli eventi è `elemento.addEventListener(tipo, handler)`:\n\n```js\nbtn.addEventListener('click', handleSave);\nfunction handleSave(e) {\n  e.preventDefault();\n  // ...\n}\n```\n\nDefinire l'handler come funzione nominata ti permette poi di rimuoverlo con `removeEventListener`.",
  },
  {
    id: "tpl-60",
    scenario: "event-handling",
    primary:
      "Con molti elementi dinamici, usa la delega: un solo listener sul genitore che filtra il target.\n\n```js\ndocument.querySelector('#list').addEventListener('click', (e) => {\n  const item = e.target.closest('.item');\n  if (!item) return;\n  console.log('Click su', item.dataset.id);\n});\n```\n\nFunziona anche per elementi aggiunti dopo, e riduce il numero di listener.",
    retry:
      "La delega degli eventi sfrutta il bubbling: ascolti sul contenitore e usi `closest` per capire cosa è stato cliccato.\n\n```js\nlist.addEventListener('click', (e) => {\n  const btn = e.target.closest('button[data-action]');\n  if (btn) run(btn.dataset.action);\n});\n```\n\nUn solo handler copre righe presenti e future, senza riagganciare nulla.",
  },
  {
    id: "tpl-61",
    scenario: "event-handling",
    primary:
      "Per gestire un form senza ricaricare la pagina, intercetta il `submit` e leggi i campi con `FormData`:\n\n```js\nconst form = document.querySelector('#login');\nform.addEventListener('submit', (e) => {\n  e.preventDefault();\n  const data = Object.fromEntries(new FormData(form));\n  console.log(data.email, data.password);\n});\n```\n\n`preventDefault` blocca il refresh nativo del browser.",
    retry:
      "Intercetta l'invio del form e trasforma i campi in un oggetto con `FormData`:\n\n```js\nform.addEventListener('submit', (e) => {\n  e.preventDefault();\n  const values = Object.fromEntries(new FormData(e.target));\n  // values.nome, values.email ...\n});\n```\n\n`Object.fromEntries` converte le coppie chiave/valore in un oggetto pronto all'uso.",
  },
  {
    id: "tpl-62",
    scenario: "event-handling",
    primary:
      "Per non eseguire una funzione a ogni tasto, applica un debounce sull'input:\n\n```js\nfunction debounce(fn, ms = 300) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}\ninput.addEventListener('input', debounce((e) => search(e.target.value)));\n```\n\nLa funzione parte solo dopo che l'utente ha smesso di digitare.",
    retry:
      "Il debounce ritarda l'esecuzione finché gli eventi non si fermano — ideale per una ricerca live:\n\n```js\nconst onType = debounce(() => fetchResults(), 250);\ninput.addEventListener('input', onType);\n```\n\nOgni nuovo evento azzera il timer, quindi `fetchResults` scatta una sola volta a fine digitazione.",
  },
  {
    id: "tpl-63",
    scenario: "event-handling",
    primary:
      "Per eventi ad alta frequenza come `scroll` o `resize`, usa un throttle che limita le chiamate a una ogni intervallo:\n\n```js\nfunction throttle(fn, ms = 100) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= ms) { last = now; fn(...args); }\n  };\n}\nwindow.addEventListener('scroll', throttle(onScroll));\n```\n\nA differenza del debounce, il throttle garantisce esecuzioni regolari durante l'azione.",
    retry:
      "Il throttle è la scelta giusta per lo scroll: esegue al massimo una volta ogni N ms mentre l'evento continua.\n\n```js\nwindow.addEventListener('resize', throttle(() => layout(), 200));\n```\n\nMentre il debounce aspetta la fine, il throttle mantiene un ritmo costante durante l'evento.",
  },
  {
    id: "tpl-64",
    scenario: "event-handling",
    primary:
      "Per gli eventi da tastiera ascolta `keydown` e controlla `event.key`:\n\n```js\ndocument.addEventListener('keydown', (e) => {\n  if (e.key === 'Escape') closeModal();\n  if (e.key === 'Enter' && e.metaKey) submit();\n});\n```\n\n`event.key` restituisce il valore leggibile ('Escape', 'Enter', 'a'), preferibile al deprecato `keyCode`.",
    retry:
      "Gestisci le scorciatoie leggendo `e.key` (ed eventuali modificatori) su `keydown`:\n\n```js\ninput.addEventListener('keydown', (e) => {\n  if (e.key === 'Enter') { e.preventDefault(); confirm(); }\n});\n```\n\nControlla `e.ctrlKey`, `e.metaKey` o `e.shiftKey` per le combinazioni.",
  },
  {
    id: "tpl-65",
    scenario: "event-handling",
    primary:
      "Per far comunicare componenti disaccoppiati, usa eventi custom con `CustomEvent`:\n\n```js\n// emette\nel.dispatchEvent(new CustomEvent('cart:add', { detail: { id: 42 }, bubbles: true }));\n// ascolta\ndocument.addEventListener('cart:add', (e) => console.log(e.detail.id));\n```\n\nIl campo `detail` trasporta il payload; `bubbles: true` lo fa salire nel DOM.",
    retry:
      "Gli eventi custom sono un mini event-bus nativo del browser:\n\n```js\nconst evt = new CustomEvent('theme:change', { detail: 'dark' });\nwindow.dispatchEvent(evt);\nwindow.addEventListener('theme:change', (e) => applyTheme(e.detail));\n```\n\nNessuna libreria: emetti con `dispatchEvent` e ascolti con `addEventListener`.",
  },
  {
    id: "tpl-66",
    scenario: "event-handling",
    primary:
      "Per evitare memory leak, rimuovi i listener quando non servono. `AbortController` li stacca tutti insieme:\n\n```js\nconst ctrl = new AbortController();\nbtn.addEventListener('click', onClick, { signal: ctrl.signal });\nwindow.addEventListener('resize', onResize, { signal: ctrl.signal });\n// cleanup\nctrl.abort();\n```\n\nUn solo `abort()` rimuove ogni listener associato al signal.",
    retry:
      "Puoi rimuovere un handler con `removeEventListener` (stessa referenza) o, più comodo, con un `AbortController`:\n\n```js\nel.removeEventListener('click', onClick);\n// oppure, per rimuoverne molti in blocco:\ncontroller.abort();\n```\n\nÈ il pattern ideale per il cleanup nell'`useEffect` di React.",
  },

  // ── State management (client-side) ──────────────────────────────────────
  {
    id: "tpl-67",
    scenario: "state-management",
    primary:
      "In React lo stato locale di un componente si gestisce con `useState`:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;\n}\n```\n\nUsa la forma funzionale `setCount((c) => c + 1)` quando il nuovo valore dipende dal precedente.",
    retry:
      "`useState` restituisce il valore corrente e una funzione per aggiornarlo, che scatena il re-render:\n\n```jsx\nconst [name, setName] = useState('');\n<input value={name} onChange={(e) => setName(e.target.value)} />\n```\n\nQuesto è il pattern del controlled input: lo stato React è l'unica fonte di verità.",
  },
  {
    id: "tpl-68",
    scenario: "state-management",
    primary:
      "Per stato più strutturato con più azioni, `useReducer` tiene la logica in un unico posto:\n\n```jsx\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'inc': return { count: state.count + 1 };\n    case 'reset': return { count: 0 };\n    default: return state;\n  }\n}\nconst [state, dispatch] = useReducer(reducer, { count: 0 });\n// dispatch({ type: 'inc' })\n```\n\nÈ ideale quando i prossimi valori dipendono dai precedenti in modo complesso.",
    retry:
      "`useReducer` centralizza le transizioni di stato in una funzione pura, come un mini Redux locale:\n\n```jsx\nconst [state, dispatch] = useReducer(reducer, initialState);\ndispatch({ type: 'add', payload: item });\n```\n\nIl reducer deve restituire sempre un nuovo oggetto stato, senza mutare quello esistente.",
  },
  {
    id: "tpl-69",
    scenario: "state-management",
    primary:
      "Senza framework, uno store reattivo si costruisce con il pattern pub/sub:\n\n```js\nfunction createStore(initial) {\n  let state = initial;\n  const subs = new Set();\n  return {\n    get: () => state,\n    set: (next) => { state = next; subs.forEach((f) => f(state)); },\n    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },\n  };\n}\n```\n\nOgni `set` notifica i sottoscrittori, che ridisegnano la UI.",
    retry:
      "Uno store globale in vanilla JS: uno stato privato più un set di listener notificati a ogni cambiamento.\n\n```js\nconst store = createStore({ count: 0 });\nconst unsub = store.subscribe((s) => render(s));\nstore.set({ count: store.get().count + 1 });\n```\n\n`subscribe` ritorna una funzione di unsubscribe per il cleanup.",
  },
  {
    id: "tpl-70",
    scenario: "state-management",
    primary:
      "Per far sopravvivere lo stato ai reload, persistilo in `localStorage` (solo client, niente backend):\n\n```js\n// salva\nlocalStorage.setItem('prefs', JSON.stringify({ theme: 'dark' }));\n// leggi\nconst prefs = JSON.parse(localStorage.getItem('prefs') ?? '{}');\n```\n\n`localStorage` conserva solo stringhe: serializza con `JSON.stringify` e riparsa in lettura.",
    retry:
      "`localStorage` è una cache chiave/valore lato browser che resiste alla chiusura della scheda:\n\n```js\nconst KEY = 'todos';\nconst save = (todos) => localStorage.setItem(KEY, JSON.stringify(todos));\nconst load = () => JSON.parse(localStorage.getItem(KEY) ?? '[]');\n```\n\nUsa `sessionStorage` se invece vuoi che i dati spariscano a fine sessione.",
  },
  {
    id: "tpl-71",
    scenario: "state-management",
    primary:
      "Aggiorna array e oggetti in modo immutabile, creando una nuova copia invece di mutare:\n\n```js\n// aggiungere\nconst next = [...items, newItem];\n// aggiornare per id\nconst updated = items.map((i) => (i.id === id ? { ...i, done: true } : i));\n// rimuovere\nconst pruned = items.filter((i) => i.id !== id);\n```\n\nÈ obbligatorio in React: mutare lo stato esistente non fa scattare il re-render.",
    retry:
      "Il segreto degli update di stato è non mutare l'originale ma produrne uno nuovo con lo spread:\n\n```js\nsetUser((u) => ({ ...u, name: 'Ada' }));\nsetList((l) => l.filter((x) => x !== target));\n```\n\nSpread (`...`), `map` e `filter` restituiscono nuove strutture, così React rileva il cambiamento per referenza.",
  },
  {
    id: "tpl-72",
    scenario: "state-management",
    primary:
      "Per condividere stato tra componenti lontani senza passare props a catena, usa il Context di React:\n\n```jsx\nconst ThemeContext = createContext('light');\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <Toolbar />\n    </ThemeContext.Provider>\n  );\n}\nfunction Toolbar() {\n  const theme = useContext(ThemeContext);\n}\n```\n\nEvita il prop-drilling per dati globali come tema, utente o lingua.",
    retry:
      "Il Context risolve il prop-drilling: un `Provider` in alto, `useContext` dove serve.\n\n```jsx\nconst value = useContext(AuthContext);\n```\n\nPer stato che cambia spesso, combina il Context con `useReducer`, così il provider espone `state` e `dispatch`.",
  },
  {
    id: "tpl-73",
    scenario: "state-management",
    primary:
      "Non salvare in stato ciò che puoi derivare: calcolalo durante il render da stato esistente.\n\n```jsx\nconst [items, setItems] = useState([]);\nconst completed = items.filter((i) => i.done).length; // derivato\n```\n\nTenere un secondo `useState` per `completed` porta a stati disallineati — deriva sempre quando puoi.",
    retry:
      "Lo stato derivato va calcolato, non memorizzato: riduci le fonti di verità.\n\n```jsx\nconst total = cart.reduce((sum, p) => sum + p.price, 0);\n```\n\nSe il calcolo è costoso e l'input non cambia, avvolgilo in `useMemo`; altrimenti calcolalo direttamente.",
  },
  {
    id: "tpl-74",
    scenario: "state-management",
    primary:
      "In vanilla JS tieni una singola funzione `render` che riflette lo stato nel DOM, chiamata a ogni cambiamento:\n\n```js\nlet state = { count: 0 };\nfunction render() {\n  document.querySelector('#count').textContent = state.count;\n}\nfunction setState(patch) {\n  state = { ...state, ...patch };\n  render();\n}\nsetState({ count: 1 });\n```\n\nUn'unica `render` evita aggiornamenti sparsi e mantiene UI e stato allineati.",
    retry:
      "Il pattern 'stato → render' replica in piccolo ciò che fa React: aggiorni lo stato, poi ridisegni.\n\n```js\nfunction setState(patch) {\n  state = { ...state, ...patch };\n  render();\n}\n```\n\nCentralizzare il rendering in un punto solo rende il flusso dati prevedibile e facile da debuggare.",
  },

  // ── Greetings & identity ────────────────────────────────────────────────
  {
    id: "grt-01",
    scenario: "greeting",
    primary:
      "Ciao! Va tutto bene, grazie — sono qui e pronto ad aiutarti. Come stai tu? Se ti va, dimmi pure cosa ti frulla in testa oggi.",
    retry:
      "Ehi, ciao! Io alla grande, grazie di avermelo chiesto. E tu come te la passi? Raccontami, da dove partiamo?",
  },
  {
    id: "grt-02",
    scenario: "greeting",
    primary:
      "Buongiorno! Spero tu abbia iniziato la giornata col piede giusto. Se vuoi organizzarti le cose da fare o solo scambiare due parole, io ci sono.",
    retry:
      "Buongiorno a te! Che si parta bene questa giornata. Dimmi pure: ti serve una mano con qualcosa o hai solo voglia di fare due chiacchiere?",
  },
  {
    id: "grt-03",
    scenario: "greeting",
    primary:
      "Buonasera! Come è andata la giornata? Se hai voglia di rilassarti ti posso consigliare un film, oppure sistemiamo insieme le ultime cose rimaste in sospeso.",
    retry:
      "Ehilà, buonasera! Giornata intensa? Possiamo staccare con due chiacchiere leggere o chiudere qualche pendenza — decidi tu.",
  },
  {
    id: "grt-04",
    scenario: "greeting",
    primary:
      "Sono il tuo assistente: posso aiutarti con le attività di tutti i giorni, farti compagnia con due chiacchiere, darti consigli su film, relazioni o lavoro e persino darti una mano col codice. Da cosa vuoi partire?",
    retry:
      "Diciamo che sono una spalla tuttofare: organizzo le tue giornate, chiacchiero volentieri, ti consiglio su amore, film e lavoro e mastico anche un po' di programmazione. Su cosa ti do una mano?",
  },
  {
    id: "grt-05",
    scenario: "greeting",
    primary:
      "Faccio un po' di tutto: promemoria e liste per la giornata, consigli su film, libri e viaggi, supporto su lavoro e carriera, chiacchiere leggere e persino aiuto sul codice. Prova a chiedermi qualcosa e vediamo!",
    retry:
      "Le mie specialità? Aiutarti a organizzare le giornate, consigliarti bene su film e tempo libero, ragionare su lavoro e relazioni e darti una mano tecnica. Buttami lì una richiesta e partiamo.",
  },
  {
    id: "grt-06",
    scenario: "greeting",
    primary:
      "Puoi chiamarmi semplicemente il tuo assistente. Il nome conta poco: quello che conta è che sono qui per darti una mano. Tu come ti chiami, così ci diamo del tu come si deve?",
    retry:
      "Non ho un nome altisonante, sono il tuo assistente e mi basta. Piuttosto, dimmi il tuo così rendiamo la conversazione più nostra.",
  },
  {
    id: "grt-07",
    scenario: "greeting",
    primary:
      "Hey! Che piacere sentirti. Sono bello carico oggi — tu come butta? Se hai una cosa al volo o solo voglia di parlare, spara pure.",
    retry:
      "Ehi ciao! Tutto a posto qui, pronto a darti manforte. Tu come stai messo? Dimmi tutto con calma.",
  },
  {
    id: "grt-08",
    scenario: "greeting",
    primary:
      "Grazie per avermelo chiesto — sto bene e sono contento di esserti utile. Ma parliamo di te: com'è il tuo umore oggi? A volte basta buttare fuori una cosa per sentirsi già meglio.",
    retry:
      "Io alla grande, davvero. Più importante: tu come ti senti oggi? Se c'è qualcosa che ti gira in testa, sono tutto orecchi.",
  },
  {
    id: "grt-09",
    scenario: "greeting",
    primary:
      "Buonanotte! Riposa bene, te lo meriti. Se domani vuoi ripartire organizzato, prepariamo insieme la lista delle cose da fare quando vuoi. Sogni d'oro!",
    retry:
      "Notte! Stacca la spina e riposati come si deve. Domani, se ti va, sistemiamo con calma tutto ciò che serve. A presto!",
  },
  {
    id: "grt-10",
    scenario: "greeting",
    primary:
      "Ma figurati, è un piacere! Sono qui apposta. Se ti serve altro, anche solo due chiacchiere, sai dove trovarmi.",
    retry:
      "Di niente davvero, mi fa piacere esserti utile. Alla prossima cosa che ti passa per la testa, io ci sono.",
  },
  {
    id: "grt-11",
    scenario: "greeting",
    primary:
      "Il piacere è tutto mio! Sono felice di fare la tua conoscenza. Raccontami un po' cosa ti serve o di cosa hai voglia di parlare, così partiamo col piede giusto.",
    retry:
      "Che piacere conoscerti! Mettiti comodo e dimmi pure da dove vuoi cominciare: lavoro, tempo libero o solo due chiacchiere?",
  },
  {
    id: "grt-12",
    scenario: "greeting",
    primary:
      "Bentornato! Mi fa piacere risentirti. Riprendiamo da dove eravamo o partiamo con qualcosa di nuovo? Sono a tua disposizione.",
    retry:
      "Eccoti di nuovo qui, bene! Da cosa vuoi ripartire oggi? Continuiamo il discorso di prima o apriamo un capitolo nuovo?",
  },

  // ── Small talk ──────────────────────────────────────────────────────────
  {
    id: "smt-01",
    scenario: "smalltalk",
    primary:
      "Va tutto liscio dalle mie parti, grazie! Diciamo che la mia giornata migliora ogni volta che riesco a esserti utile. La tua invece com'è andata finora?",
    retry:
      "Tutto bene qui, non mi lamento! E soprattutto sono contento di chiacchierare un po' con te. Tu come procedi con la giornata?",
  },
  {
    id: "smt-02",
    scenario: "smalltalk",
    primary:
      "In questo momento faccio la cosa che mi riesce meglio: tenerti compagnia e darti una mano. Niente pause caffè per me! Tu piuttosto, cosa stai combinando?",
    retry:
      "Diciamo che sono sempre 'sul pezzo', pronto ad aiutarti. La domanda vera è: tu cosa stai facendo di bello?",
  },
  {
    id: "smt-03",
    scenario: "smalltalk",
    primary:
      "Eccoti una battuta: perché il libro di matematica era triste? Perché aveva troppi problemi. Lo so, lo so — ma dai che una mezza risata te l'ho strappata!",
    retry:
      "Te ne dico una al volo: cosa fa un pediatra all'asilo? Il cardiologo, ovviamente… no aspetta, il pediatra! Va bene, la comicità non è il mio forte, ma ci provo con gusto.",
  },
  {
    id: "smt-04",
    scenario: "smalltalk",
    primary:
      "Ecco una curiosità carina: i polpi hanno tre cuori e il loro sangue è blu. Piccole cose che rendono il mondo un po' più affascinante. Ne vuoi un'altra?",
    retry:
      "Lo sapevi che il miele non scade praticamente mai? Ne hanno trovato nelle tombe egizie ancora commestibile. Il mondo è pieno di dettagli sorprendenti — se ti diverte te ne racconto altri.",
  },
  {
    id: "smt-05",
    scenario: "smalltalk",
    primary:
      "La noia a volte è solo la testa che chiede qualcosa di nuovo. Potresti provare un film che non avresti mai scelto, una ricetta diversa o una passeggiata senza meta. Vuoi che ti butti lì qualche idea?",
    retry:
      "Quando ci si annoia, il trucco è cambiare binario: un libro, una playlist nuova, due esercizi, una telefonata a chi non senti da tempo. Dimmi cosa ti attira di più e lo sviluppiamo.",
  },
  {
    id: "smt-06",
    scenario: "smalltalk",
    primary:
      "Il weekend è sacro! Che tu voglia riposarti sul divano o inventarti qualcosa fuori, l'importante è staccare davvero. Hai già in mente qualcosa o cerchiamo un'idea insieme?",
    retry:
      "Ah, il weekend: il momento di ricaricare le pile. Relax totale o piccola avventura? Dimmi il mood e ti aiuto a costruirci qualcosa.",
  },
  {
    id: "smt-07",
    scenario: "smalltalk",
    primary:
      "Volentieri, due chiacchiere fanno sempre bene. Possiamo parlare di film, di come è andata la settimana, di un posto che ti piacerebbe visitare… scegli tu il filo e lo tiriamo insieme.",
    retry:
      "Ci sto, chiacchierare mi piace. Buttami lì un argomento — tempo libero, progetti, curiosità — e vediamo dove ci porta la conversazione.",
  },
  {
    id: "smt-08",
    scenario: "smalltalk",
    primary:
      "Sì, tutto bene, grazie! E spero di cuore lo stesso per te. Se invece qualcosa non va del tutto, sono qui anche per quello: a volte parlarne alleggerisce.",
    retry:
      "Tutto a posto da questa parte! Tu però come stai davvero? Se c'è qualcosa che ti pesa, possiamo affrontarlo con calma insieme.",
  },
  {
    id: "smt-09",
    scenario: "smalltalk",
    primary:
      "Te ne racconto una: gli scienziati hanno scoperto che le api sanno contare fino a piccoli numeri e riconoscono i volti. La natura è una continua sorpresa. Vuoi che continui con altre chicche?",
    retry:
      "Ecco qua: la Torre Eiffel d'estate 'cresce' di circa 15 cm perché il metallo si dilata col caldo. Piccole storie così ne ho a bizzeffe, se ti va di ascoltarle.",
  },
  {
    id: "smt-10",
    scenario: "smalltalk",
    primary:
      "Le giornate storte capitano a tutti, e non le rendono meno faticose. Concediti una pausa piccola ma vera: un respiro, qualcosa di buono, cinque minuti solo per te. Domani si riparte. Vuoi sfogarti un po'?",
    retry:
      "Mi dispiace per la giornata no. Non serve fare i supereroi: rallenta, sii gentile con te stesso e lascia che passi. Se ti va di raccontarmi cosa è successo, ti ascolto.",
  },
  {
    id: "smt-11",
    scenario: "smalltalk",
    primary:
      "Grazie di cuore, mi fa davvero piacere! Cerco solo di esserti utile nel modo più semplice possibile. Complimenti così mi mettono di buon umore — ricambio: sei una bella compagnia anche tu.",
    retry:
      "Che gentile, grazie mille! Sapere di esserti utile è la mia soddisfazione più grande. Continuiamo così, siamo una bella squadra.",
  },
  {
    id: "smt-12",
    scenario: "smalltalk",
    primary:
      "Ci provo! Che differenza c'è tra un uomo e un chiodo? Che il chiodo, prima o poi, lo pianti. Dai, ammetti che un sorriso te l'ha fatto fare!",
    retry:
      "Sfida accettata: com'è che si chiama un boomerang che non torna? Un bastone. Umorismo semplice, ma se ti ha strappato un ghigno ho vinto io.",
  },

  // ── Relationships & love ────────────────────────────────────────────────
  {
    id: "rel-01",
    scenario: "relationships",
    primary:
      "In amore non esistono formule magiche, ma un punto fermo aiuta: la sincerità con te stesso prima ancora che con l'altro. Chiediti cosa vuoi davvero e comunicalo con calma. Vuoi raccontarmi la situazione così ragioniamo sul concreto?",
    retry:
      "L'amore è fatto di ascolto e di verità dette con dolcezza. Prima di ogni consiglio, capiamo insieme cosa senti: raccontami com'è la situazione e vediamo il passo giusto da fare.",
  },
  {
    id: "rel-02",
    scenario: "relationships",
    primary:
      "Per un primo appuntamento punta sulla leggerezza: scegli un posto dove si può parlare, fai domande vere e ascolta le risposte. L'obiettivo non è impressionare, ma capire se state bene insieme. E respira, un po' di emozione è normale!",
    retry:
      "Primo appuntamento? Sii semplicemente te stesso: curiosità sincera, un sorriso e un luogo tranquillo valgono più di mille strategie. Meno performance, più connessione — andrà benissimo.",
  },
  {
    id: "rel-03",
    scenario: "relationships",
    primary:
      "Dopo un litigio, la cosa che ripara di più è tornare a parlarsi senza voler 'vincere'. Prova a dire come ti sei sentito usando 'io' invece di accusare, e lascia spazio anche al suo punto di vista. Vuoi che ti aiuti a trovare le parole?",
    retry:
      "I litigi capitano nelle coppie che tengono l'una all'altra. Il punto non è avere ragione ma ricucire: ammetti la tua parte, ascolta la sua e cercate il 'noi'. Se vuoi, prepariamo insieme cosa dirgli.",
  },
  {
    id: "rel-04",
    scenario: "relationships",
    primary:
      "Dimenticare un ex non è cancellare, è dare tempo al tempo. Riempi gli spazi con cose e persone che ti fanno bene, evita di controllarne i profili e concediti di stare male senza sensi di colpa. Piano piano il peso si alleggerisce. Come stai vivendo questo momento?",
    retry:
      "Voltare pagina dopo una storia richiede pazienza e gentilezza verso te stesso. Niente scorciatoie: distanza, nuove abitudini e amici veri sono la cura migliore. Vuoi parlarmene un po'?",
  },
  {
    id: "rel-05",
    scenario: "relationships",
    primary:
      "La gelosia nasce quasi sempre da una paura: quella di non bastare o di perdere. Il rimedio non è controllare l'altro ma lavorare sulla fiducia, in sé e nella coppia, e parlarne apertamente. Da cosa pensi nasca la tua?",
    retry:
      "Un pizzico di gelosia è umano, ma quando stringe troppo conviene guardarla in faccia: di solito sotto c'è un'insicurezza da rassicurare, non un nemico da sorvegliare. Ne parliamo insieme?",
  },
  {
    id: "rel-06",
    scenario: "relationships",
    primary:
      "Dichiararsi fa paura perché ci si espone, ed è proprio questo che rende il gesto autentico. Scegli un momento tranquillo, sii diretto e sincero senza aspettarti garanzie: qualunque risposta arrivi, avrai avuto il coraggio di esserti giocato la carta. Vuoi che pensiamo insieme a come dirlo?",
    retry:
      "Il modo migliore per confessare ciò che provi è la semplicità: poche parole vere, dette guardando negli occhi. Il rischio c'è, ma tacere lascia sempre il 'e se…'. Ti do una mano a trovare le parole giuste?",
  },
  {
    id: "rel-07",
    scenario: "relationships",
    primary:
      "Le relazioni a distanza reggono su due pilastri: comunicazione costante e un progetto comune verso cui tendere. Sentitevi con qualità più che con quantità, tenete viva la fantasia e datevi una data in cui rivedervi. Vuoi qualche idea per accorciare le distanze?",
    retry:
      "Amarsi da lontano è dura ma possibile: servono fiducia, piccole attenzioni quotidiane e un orizzonte condiviso. La distanza spaventa meno quando sapete dove state andando insieme. Ne parliamo?",
  },
  {
    id: "rel-08",
    scenario: "relationships",
    primary:
      "I dubbi in una relazione non sono per forza un brutto segno: spesso chiedono solo di essere ascoltati. Prova a distinguere le paure passeggere dai bisogni profondi rimasti inascoltati. Vuoi provare a metterli in fila insieme, così ci vedi più chiaro?",
    retry:
      "Avere dei dubbi è normale, l'importante è capire cosa ti stanno dicendo. Mettiamoli nero su bianco: cosa ti manca, cosa ti fa stare bene, cosa non torna. A mente lucida le scelte pesano meno.",
  },
  {
    id: "rel-09",
    scenario: "relationships",
    primary:
      "Per conoscere gente nuova, la strada più naturale è frequentare posti legati a ciò che ti piace: un corso, uno sport, un gruppo, un volontariato. Le connessioni migliori nascono quando sei te stesso e fai qualcosa che ami. Che passioni hai? Partiamo da lì.",
    retry:
      "Il modo più autentico per incontrare persone è seguire i tuoi interessi: chi condivide una passione parte già con qualcosa in comune con te. Dimmi cosa ti appassiona e vediamo dove potresti buttarti.",
  },
  {
    id: "rel-10",
    scenario: "relationships",
    primary:
      "Quando un'amicizia scricchiola, spesso basta un gesto sincero: dire 'mi manchi' o 'mi è dispiaciuto' senza cercare colpevoli. Le amicizie vere sopravvivono ai silenzi se qualcuno ha il coraggio di fare il primo passo. Vuoi che ti aiuti a scrivergli?",
    retry:
      "Le amicizie, come le piante, ogni tanto vanno annaffiate. Un messaggio onesto e senza rancore può bastare a riavvicinarvi. Se vuoi, pensiamo insieme a come rompere il ghiaccio.",
  },
  {
    id: "rel-11",
    scenario: "relationships",
    primary:
      "Un cuore spezzato fa male davvero, e meriti di prenderti il tempo per soffrire senza fretta di 'superarlo'. Circondati di chi ti vuole bene, tratta te stesso con la dolcezza che daresti a un amico e sappi che questa fase, per quanto dura, passerà. Vuoi sfogarti un po' con me?",
    retry:
      "Mi dispiace, le rotture sono tra i dolori più sottovalutati. Non c'è un tempo giusto per guarire: concediti di stare male, appoggiati agli affetti e vai piano. Sono qui se hai voglia di parlarne.",
  },
  {
    id: "rel-12",
    scenario: "relationships",
    primary:
      "Capire se piaci a qualcuno è spesso questione di attenzioni: ti cerca, si ricorda dei dettagli, trova scuse per starti vicino. Ma i segnali non sono mai una certezza matematica: il modo più onesto per saperlo resta creare occasioni e osservare come reagisce. Raccontami, cosa ti fa dubitare?",
    retry:
      "I piccoli indizi contano — sguardi, messaggi, tempo che ti dedica — ma la verità la scopri solo avvicinandoti e vedendo cosa succede. Dimmi come si comporta e ragioniamo insieme sui segnali.",
  },
  {
    id: "rel-13",
    scenario: "relationships",
    primary:
      "Tenere viva una coppia negli anni è un lavoro fatto di piccole cose: curiosità reciproca, gesti gratuiti, tempo di qualità e capacità di sorprendersi ancora. La routine non è nemica se dentro ci mettete attenzione. Vuoi qualche idea concreta per riaccendere la scintilla?",
    retry:
      "L'amore che dura si nutre di attenzioni quotidiane più che di grandi gesti: ascoltarsi, ridere insieme, ritagliarsi momenti solo vostri. Se ti va, pensiamo a qualche modo per ravvivare la relazione.",
  },
  {
    id: "rel-14",
    scenario: "relationships",
    primary:
      "I rapporti in famiglia sono i più intensi proprio perché ci teniamo tanto. Quando c'è tensione, prova a separare il 'cosa' dal 'come': spesso il problema non è il tema ma il tono. Un confronto calmo, senza vecchie ruggini, apre più porte di mille discussioni. Vuoi raccontarmi cosa succede?",
    retry:
      "Con i familiari le emozioni corrono forti e i ruoli pesano. Prova ad affrontare le cose una alla volta, con pazienza e senza rivangare il passato. Se mi racconti la situazione, cerchiamo insieme un approccio più sereno.",
  },

  // ── Entertainment (film, series, music, books) ──────────────────────────
  {
    id: "ent-01",
    scenario: "entertainment",
    primary:
      "Per un bel film che metta d'accordo tutti, un grande classico è 'Forrest Gump': emoziona, fa riflettere e strappa più di un sorriso. Se invece cerchi qualcosa di specifico dimmi il genere o l'atmosfera che hai in mente e ti do una rosa su misura.",
    retry:
      "Un titolo sempre valido è 'La vita è bella': commovente e luminoso allo stesso tempo. Ma posso centrare meglio il bersaglio: che voglia hai stasera — ridere, emozionarti, tenere il fiato sospeso?",
  },
  {
    id: "ent-02",
    scenario: "entertainment",
    primary:
      "Per stasera, se vuoi qualcosa che scorra bene senza impegnarti troppo, ti consiglio una commedia brillante o un thriller ben ritmato. Dimmi con chi guardi e che umore hai, e ti azzecco il titolo giusto in un attimo.",
    retry:
      "Serata film! Per non sbagliare punta su qualcosa di coinvolgente ma leggero. Dammi due indizi — solo o in compagnia, voglia di ridere o di tensione — e ti propongo la scelta perfetta.",
  },
  {
    id: "ent-03",
    scenario: "entertainment",
    primary:
      "Se cerchi una serie che crei dipendenza, 'Breaking Bad' è una garanzia per la scrittura e la tensione, mentre 'The Office' è perfetta per staccare e ridere. Preferisci qualcosa di intenso o di leggero da bingewatch?",
    retry:
      "Per le serie dipende dalla voglia: 'Dark' se ami rompicapi e mistero, 'Ted Lasso' se vuoi qualcosa che scaldi il cuore. Dimmi il mood e ti indirizzo sulla pista giusta.",
  },
  {
    id: "ent-04",
    scenario: "entertainment",
    primary:
      "Voglia di ridere? 'Non ci resta che piangere' con Troisi e Benigni è un cult italiano intramontabile; se preferisci l'estero, 'Una notte da leoni' è una risata assicurata. Ti va più l'umorismo nostrano o quello demenziale?",
    retry:
      "Per una commedia che funziona sempre: 'Perfetti sconosciuti' se ti piace l'ironia intelligente, o qualcosa di più scanzonato se vuoi solo spegnere il cervello e ridere. Che tipo di comicità ti fa stare bene?",
  },
  {
    id: "ent-05",
    scenario: "entertainment",
    primary:
      "Se ti piace la tensione, 'Seven' e 'Il silenzio degli innocenti' sono thriller che tengono incollati; per l'horror puro 'Hereditary' è disturbante al punto giusto. Quanto vuoi farti spaventare, da brivido leggero a notte insonne?",
    retry:
      "Per una serata da batticuore: 'Shutter Island' se ami i colpi di scena, 'The Conjuring' se vuoi l'horror classico. Dimmi quanto reggi la paura e ti calibro il consiglio.",
  },
  {
    id: "ent-06",
    scenario: "entertainment",
    primary:
      "Per la musica dipende dal momento: se vuoi concentrarti va benissimo qualcosa di strumentale o lo-fi, se vuoi caricarti punta su ritmi decisi. Dimmi cosa stai facendo e che energia cerchi, e ti costruisco la playlist ideale nella testa.",
    retry:
      "Musica su misura: relax, studio o carica? Ognuno ha il suo sottofondo perfetto. Raccontami il contesto e il genere che ami e ti suggerisco la direzione giusta.",
  },
  {
    id: "ent-07",
    scenario: "entertainment",
    primary:
      "Per un libro che ti prende, 'Il Nome della Rosa' se ami mistero e storia, 'Le otto montagne' se cerchi qualcosa di intimo e poetico. Preferisci romanzi che ti facciano pensare o che ti facciano viaggiare con la fantasia?",
    retry:
      "Un buon consiglio di lettura dipende dal tuo gusto: thriller che non fanno posare il libro, o storie lente e profonde da assaporare. Dimmi cosa ti piace e ti indico il titolo giusto.",
  },
  {
    id: "ent-08",
    scenario: "entertainment",
    primary:
      "Nel mondo dell'animazione, i film dello Studio Ghibli come 'La città incantata' sono poesia per tutte le età; se cerchi una serie, 'Attack on Titan' unisce azione e trama profonda. Ti attira di più la magia poetica o l'epica avventurosa?",
    retry:
      "Per anime e animazione c'è l'imbarazzo della scelta: 'Il tuo nome' per una storia che commuove, 'Fullmetal Alchemist' per un'avventura ricca. Dimmi il tono che cerchi e ti oriento.",
  },
  {
    id: "ent-09",
    scenario: "entertainment",
    primary:
      "Per i videogiochi dipende da quanto tempo hai: 'Zelda: Breath of the Wild' se vuoi perderti in un mondo aperto, un rogue-like veloce se cerchi partite brevi. Preferisci avventure lunghe o sessioni mordi e fuggi?",
    retry:
      "Voglia di giocare? 'The Witcher 3' per una storia immensa, 'It Takes Two' se vuoi divertirti in due sul divano. Dimmi da solo o in compagnia e quanto tempo hai, e ti consiglio bene.",
  },
  {
    id: "ent-10",
    scenario: "entertainment",
    primary:
      "Se ti piacciono i documentari, 'Il nostro pianeta' è meraviglioso per la natura, mentre per il true crime 'Making a Murderer' tiene incollati. Ti interessa più esplorare il mondo o farti catturare da una storia vera?",
    retry:
      "Per un documentario ben fatto: 'Free Solo' se ami l'adrenalina e le imprese umane, qualcosa di scientifico se vuoi imparare stupendoti. Dimmi il tema che ti incuriosisce di più.",
  },
  {
    id: "ent-11",
    scenario: "entertainment",
    primary:
      "Per una serata romantica, 'Notting Hill' è un classico che non delude, mentre 'Le pagine della nostra vita' punta dritto al cuore (tieni i fazzoletti a portata!). Preferisci una storia dolce e brillante o intensa e struggente?",
    retry:
      "In tema amore, 'C'è posta per te' scalda senza appesantire, 'Chiamami col tuo nome' resta addosso a lungo. Dimmi se vuoi sorridere o commuoverti e ti guido alla scelta.",
  },
  {
    id: "ent-12",
    scenario: "entertainment",
    primary:
      "Per la fantascienza, 'Interstellar' unisce spettacolo e commozione, 'Arrival' è più cerebrale e sorprendente. Ti attira di più il viaggio epico tra le stelle o l'enigma che ti fa ragionare fino all'ultimo?",
    retry:
      "Sci-fi da non perdere: 'Blade Runner 2049' per l'atmosfera, 'Matrix' per il cult senza tempo. Dimmi se cerchi azione o riflessione e ti indico la rotta.",
  },
  {
    id: "ent-13",
    scenario: "entertainment",
    primary:
      "Per una visione in famiglia che accontenti grandi e piccoli, i film Pixar come 'Coco' o 'Up' funzionano sempre: divertono i bambini ed emozionano gli adulti. Vuoi qualcosa di avventuroso o di più tenero e commovente?",
    retry:
      "In famiglia vanno alla grande i grandi classici d'animazione o avventure come 'Jumanji': ridono tutti e nessuno si annoia. Dimmi le età e il mood e ti trovo il titolo giusto per tutti.",
  },
  {
    id: "ent-14",
    scenario: "entertainment",
    primary:
      "Per i podcast dipende da cosa cerchi: c'è chi ti tiene compagnia con storie e interviste, chi ti insegna qualcosa in venti minuti. Ti interessano crime, cultura, crescita personale o due chiacchiere leggere? Ti indirizzo di conseguenza.",
    retry:
      "Un buon podcast è come un amico in cuffia: racconto, divulgazione o comicità? Dimmi il tema e il momento in cui lo ascolti (in auto, in palestra, la sera) e ti do la direzione.",
  },
  {
    id: "ent-15",
    scenario: "entertainment",
    primary:
      "Per una scarica di adrenalina, 'Mad Max: Fury Road' è azione allo stato puro, mentre 'John Wick' è una coreografia perfetta di ritmo e stile. Preferisci l'inseguimento spettacolare o il combattimento elegante?",
    retry:
      "Voglia di azione? 'Die Hard' resta un caposaldo, 'Mission: Impossible' non delude mai. Dimmi se vuoi qualcosa di adrenalinico o più spettacolare e ti consiglio il titolo giusto.",
  },
  {
    id: "ent-16",
    scenario: "entertainment",
    primary:
      "Se vuoi recuperare un grande classico, 'Il Padrino' è cinema nel senso più pieno, mentre 'Ritorno al futuro' è puro divertimento intramontabile. Ti va un capolavoro impegnato o un cult che regala leggerezza?",
    retry:
      "Tra i classici da non perdere: 'Pulp Fiction' se ami lo stile, 'Rocky' se cerchi una storia che carica. Dimmi il tono che preferisci e ti guido nel recupero giusto.",
  },

  // ── Daily-life helpers ──────────────────────────────────────────────────
  {
    id: "day-01",
    scenario: "daily-life",
    primary:
      "Certo, tengo a mente il tuo promemoria! Dimmi cosa non devi dimenticare e a che ora, e faccio in modo di ricordartelo al momento giusto. Vuoi aggiungerne altri mentre ci siamo?",
    retry:
      "Segnato! Indicami l'attività e l'orario e penso io a farti da sveglia mentale. Se ne hai più d'uno, buttali giù tutti che li organizzo.",
  },
  {
    id: "day-02",
    scenario: "daily-life",
    primary:
      "Sveglia impostata nella mia testa! Dimmi a che ora vuoi alzarti e, se ti va, ti preparo anche un piccolo rituale del mattino per partire con energia. A che ora suoniamo la carica domani?",
    retry:
      "Perfetto, mi occupo io della sveglia. A che ora vuoi essere in piedi? Volendo aggiungo un promemoria dolce per non farti premere 'ancora cinque minuti' dieci volte.",
  },
  {
    id: "day-03",
    scenario: "daily-life",
    primary:
      "Mettiamo su la lista della spesa! Dettami pure gli articoli e li organizzo per reparto, così al supermercato voli. Vuoi che ti suggerisca anche qualche base che non deve mai mancare in dispensa?",
    retry:
      "Lista della spesa in arrivo: dimmi cosa ti serve e la tengo in ordine per te. Se vuoi, la raggruppo per corsie del negozio così non torni indietro tre volte.",
  },
  {
    id: "day-04",
    scenario: "daily-life",
    primary:
      "Per il meteo di preciso servirebbe una fonte in tempo reale, che qui è simulata — ma il consiglio pratico resta valido: controlla l'app ufficiale prima di uscire e, nel dubbio, porta sempre una giacca leggera. Vuoi che ti aiuti a organizzare la giornata di conseguenza?",
    retry:
      "Il meteo esatto qui è solo mockup, quindi affidati a un'app affidabile per i numeri veri. Regola d'oro: un ombrello in borsa non pesa mai troppo. Ti do una mano a pianificare la giornata in base al tempo?",
  },
  {
    id: "day-05",
    scenario: "daily-life",
    primary:
      "Organizziamo la giornata! Dimmi gli impegni fissi e le cose che vorresti incastrare: io ti aiuto a metterli in ordine di priorità e a lasciare respiro tra un'attività e l'altra. Da dove partiamo?",
    retry:
      "Mettiamo in fila la tua giornata: prima le cose importanti e con scadenza, poi il resto negli spazi liberi, con qualche pausa vera. Elencami tutto e ci penso io a dare una struttura.",
  },
  {
    id: "day-06",
    scenario: "daily-life",
    primary:
      "Creiamo la tua to-do list! Buttami giù tutto quello che hai in testa, senza filtro: poi lo mettiamo in ordine di importanza e spezziamo i compiti grossi in passi piccoli e fattibili. Spara pure il primo.",
    retry:
      "Lista delle cose da fare in arrivo: scaricami tutti i pensieri, poi li ordiniamo per priorità e trasformiamo i più grandi in micro-obiettivi. Vedrai che scritti fanno subito meno paura.",
  },
  {
    id: "day-07",
    scenario: "daily-life",
    primary:
      "Sistemiamo l'agenda! Dimmi gli appuntamenti con orari e durata e ti aiuto a incastrarli senza sovrapposizioni, lasciando margini per gli spostamenti. Vuoi che ti segnali anche dove rischi di correre troppo?",
    retry:
      "Mettiamo ordine tra gli appuntamenti: elencameli con ora e luogo e controllo che filino senza incastri impossibili. Ti avviso io se la giornata si fa troppo fitta.",
  },
  {
    id: "day-08",
    scenario: "daily-life",
    primary:
      "Per gestire meglio il tempo, prova a raggruppare le attività simili e a proteggere una o due fasce 'senza interruzioni' per le cose che contano davvero. Anche solo decidere le tre priorità del giorno cambia tutto. Vuoi che le individuiamo insieme?",
    retry:
      "Il segreto del tempo è la selezione: poche priorità chiare, attività simili accorpate e blocchi protetti dalle distrazioni. Dimmi cos'hai in programma e ti aiuto a dargli un ritmo sostenibile.",
  },
  {
    id: "day-09",
    scenario: "daily-life",
    primary:
      "Per le pulizie di casa, il trucco è non affrontare tutto in un colpo: assegna una zona o un compito a ogni giorno, e tieni a portata i pochi prodotti che servono davvero. Vuoi che ti costruisca un piccolo piano settimanale leggero?",
    retry:
      "Casa in ordine senza stress: dividi il lavoro in mini-sessioni da quindici minuti invece di una maratona del sabato. Se vuoi, ti preparo una rotazione semplice per non ritrovarti mai sommerso.",
  },
  {
    id: "day-10",
    scenario: "daily-life",
    primary:
      "Per non dimenticare bollette e scadenze, la strada più serena è segnarle tutte con qualche giorno di anticipo e, dove possibile, impostare pagamenti automatici. Dimmi le scadenze che hai in mente e ti aiuto a metterle in ordine di urgenza.",
    retry:
      "Scadenze sotto controllo: annotale con un promemoria qualche giorno prima e automatizza ciò che puoi, così eviti sorprese e more. Elencami cosa hai in arrivo e le sistemiamo insieme.",
  },
  {
    id: "day-11",
    scenario: "daily-life",
    primary:
      "Timer pronto nella mia testa! Dimmi quanti minuti ti servono e per cosa — studio, cucina, una pausa — e ti tengo il conto. Vuoi usarlo con la tecnica del pomodoro, 25 minuti di lavoro e 5 di pausa?",
    retry:
      "Ci penso io al timer: indicami la durata e l'attività. Se stai lavorando, ti consiglio cicli da 25 minuti con pause brevi: rendono tantissimo senza svuotarti.",
  },
  {
    id: "day-12",
    scenario: "daily-life",
    primary:
      "Volentieri, i conti al volo sono il mio pane! Scrivimi l'operazione o la situazione — una divisione tra amici, una percentuale, uno sconto — e ti do il risultato con il ragionamento, così resta chiaro. Cosa dobbiamo calcolare?",
    retry:
      "Nessun problema, facciamo due calcoli. Dettami numeri e operazione e ti restituisco il risultato spiegato passo passo. Dimmi pure cosa ti serve conteggiare.",
  },
  {
    id: "day-13",
    scenario: "daily-life",
    primary:
      "Ti do una mano con la traduzione! Scrivimi la frase e la lingua di destinazione e te la rendo in modo naturale, non solo parola per parola. Se è per un contesto particolare — formale, amichevole — dimmelo e adatto il tono.",
    retry:
      "Traduzione al volo: incollami il testo e indicami la lingua, e cerco di mantenerne senso e tono, non solo le parole. Fammi sapere se ti serve più formale o più colloquiale.",
  },
  {
    id: "day-14",
    scenario: "daily-life",
    primary:
      "Le conversioni sono facili: dimmi il valore e le unità di partenza e di arrivo — chili in libbre, gradi, valute indicative — e ti do il risultato spiegato. Cosa devi convertire?",
    retry:
      "Ci penso io alla conversione: indicami quanto e da quale unità a quale, e ti restituisco il numero con il metodo usato. Spara pure i dati.",
  },

  // ── Food & cooking ──────────────────────────────────────────────────────
  {
    id: "food-01",
    scenario: "food-cooking",
    primary:
      "Per stasera, se vuoi qualcosa di veloce e confortante, una pasta aglio, olio e peperoncino non delude mai; se hai più tempo, un risotto ti coccola. Dimmi cosa hai in frigo e quanto tempo hai, e ti propongo l'idea giusta.",
    retry:
      "Cosa cucinare stasera dipende da fretta e voglia: 15 minuti e pochi ingredienti? Pasta saltata. Voglia di coccola? Qualcosa al forno. Raccontami cosa hai a disposizione e decidiamo insieme.",
  },
  {
    id: "food-02",
    scenario: "food-cooking",
    primary:
      "Ricetta lampo: scalda l'olio con uno spicchio d'aglio, butta la pasta in acqua salata, e mentre cuoce prepara un sugo veloce con pomodorini o tonno. In quindici minuti sei a tavola. Vuoi che la personalizzi con quello che hai in dispensa?",
    retry:
      "Per una cena veloce punta su piatti a pochi passaggi: pasta con un condimento improvvisato, uova strapazzate con verdure, o una bruschetta ricca. Dimmi cosa hai e ti do il procedimento esatto.",
  },
  {
    id: "food-03",
    scenario: "food-cooking",
    primary:
      "Un'idea per cena che fa sempre bella figura senza stress: pollo al limone in padella con un contorno di verdure arrostite. Semplice, profumato e leggero. Preferisci carne, pesce o qualcosa di vegetariano? Ti oriento di conseguenza.",
    retry:
      "Per la cena ti butto lì una traccia: una proteina cotta in modo semplice più un contorno colorato ti risolve la serata. Dimmi le tue preferenze e ti propongo un menù su misura.",
  },
  {
    id: "food-04",
    scenario: "food-cooking",
    primary:
      "Per scegliere il ristorante giusto conta l'occasione: una trattoria genuina per una cena rilassata, qualcosa di più curato per una serata speciale. Dimmi il tipo di cucina che ti gira e con chi esci, e ti aiuto a decidere il mood adatto.",
    retry:
      "Il ristorante perfetto dipende dalla serata: romantica, tra amici o in famiglia? E che cucina ti tenta — italiana, etnica, pizza? Dammi qualche dettaglio e ti indirizzo sulla scelta giusta.",
  },
  {
    id: "food-05",
    scenario: "food-cooking",
    primary:
      "Ti manca un ingrediente? Spesso c'è un sostituto in casa: lo yogurt al posto della panna, il miele al posto dello zucchero, un mix di latte e burro per il latticello. Dimmi cosa ti manca e cosa stai preparando, e ti trovo l'alternativa migliore.",
    retry:
      "Niente panico se manca qualcosa: quasi tutto ha un rimpiazzo furbo. Dimmi l'ingrediente assente e la ricetta, e ti suggerisco con cosa cavartela senza correre al negozio.",
  },
  {
    id: "food-06",
    scenario: "food-cooking",
    primary:
      "Cucinare con quello che c'è è la sfida più divertente! Elencami cosa hai in frigo e in dispensa e ti propongo un piatto sensato che li metta insieme, senza sprechi. Vediamo cosa tiriamo fuori.",
    retry:
      "Svuota-frigo mode attiva: dimmi gli ingredienti che hai e ti costruisco una ricetta che li valorizzi. Spesso i piatti migliori nascono proprio così, per necessità.",
  },
  {
    id: "food-07",
    scenario: "food-cooking",
    primary:
      "Per un dolce facile e goloso, la torta allo yogurt è a prova di errore: pochi ingredienti, una ciotola e via in forno. Se cerchi qualcosa di più veloce, una mousse al cioccolato con due ingredienti fa la sua figura. Vuoi la versione al cucchiaio o da forno?",
    retry:
      "Voglia di dolce? Se hai tempo, un ciambellone soffice; se vuoi qualcosa di rapido, uno yogurt con frutta e granola o dei biscotti veloci. Dimmi quanto tempo hai e ti do la ricetta giusta.",
  },
  {
    id: "food-08",
    scenario: "food-cooking",
    primary:
      "Per un pranzo sano e saziante, punta sul piatto unico bilanciato: una base di cereali integrali, una proteina, tante verdure e un filo di olio buono. Colorato, leggero e ti tiene su fino a sera. Vuoi qualche abbinamento pronto?",
    retry:
      "Mangiare sano a pranzo è più semplice di quanto sembri: metà piatto verdure, un quarto proteine, un quarto carboidrati integrali. Dimmi cosa ti piace e ti compongo un pasto equilibrato.",
  },
  {
    id: "food-09",
    scenario: "food-cooking",
    primary:
      "Per un drink fatto in casa, uno Spritz è la scelta social per eccellenza; se preferisci analcolico, un mix di succo d'agrumi, acqua tonica e menta è fresco e piacevole. Preferisci qualcosa di alcolico o dissetante e leggero?",
    retry:
      "In tema drink: classico Spritz o Gin Tonic se vuoi l'aperitivo, oppure una limonata allo zenzero se lo vuoi analcolico. Dimmi il gusto che cerchi e ti do la ricetta con le dosi.",
  },
  {
    id: "food-10",
    scenario: "food-cooking",
    primary:
      "Per una colazione che ti dà la carica, unisci qualcosa di proteico e qualcosa di integrale: yogurt con avena e frutta, o pane integrale con uova. Sazia e ti evita il crollo di metà mattina. La preferisci dolce o salata?",
    retry:
      "Colazione top: bilancia zuccheri e proteine per partire con energia stabile — porridge, yogurt con frutta secca o toast con avocado e uova. Dimmi se la ami dolce o salata e ti do qualche idea.",
  },

  // ── Travel ──────────────────────────────────────────────────────────────
  {
    id: "trip-01",
    scenario: "travel",
    primary:
      "Per la prossima vacanza, la scelta cambia molto in base a cosa cerchi: mare e relax, città d'arte da esplorare o natura e avventura. Dimmi il periodo, il budget indicativo e il tuo mood, e ti propongo qualche meta che ti calzi a pennello.",
    retry:
      "Scegliere dove andare è metà del divertimento! Preferisci spiaggia, cultura o montagna? E quanto vuoi spendere e per quanti giorni? Con queste tre info ti do idee mirate, non generiche.",
  },
  {
    id: "trip-02",
    scenario: "travel",
    primary:
      "Per un weekend fuori senza troppi pensieri, una città d'arte raggiungibile in poche ore è perfetta: cammini, mangi bene e stacchi davvero. Dimmi da dove parti e se preferisci borgo tranquillo o città vivace, e ti suggerisco la destinazione ideale.",
    retry:
      "Due giorni di fuga rigenerano: un borgo di charme per rallentare o una città per riempirsi gli occhi. Dammi il punto di partenza e il tipo di atmosfera che cerchi e ti indirizzo.",
  },
  {
    id: "trip-03",
    scenario: "travel",
    primary:
      "Per la valigia, la regola d'oro è: pochi capi versatili che si abbinano tra loro, uno strato caldo anche d'estate e i documenti sempre in tasca, non in stiva. Dimmi meta, durata e clima e ti preparo una lista essenziale su misura.",
    retry:
      "In valigia meno è meglio: punta su abiti combinabili, scarpe comode e il beauty ridotto all'osso. Dammi destinazione e giorni e ti compilo una checklist così non dimentichi nulla e non porti pesi inutili.",
  },
  {
    id: "trip-04",
    scenario: "travel",
    primary:
      "Per viaggiare spendendo poco, gioca sui tempi: bassa stagione, prenotazioni con anticipo e flessibilità sulle date abbattono i costi. Anche le mete meno gettonate regalano sorprese a prezzi umani. Dimmi il budget e ti propongo dove ci sta dentro.",
    retry:
      "Vacanza economica? Evita l'alta stagione, sii flessibile sulle date e considera destinazioni fuori dai soliti giri: spesso più autentiche e molto più leggere sul portafoglio. Dammi una cifra e ti do idee concrete.",
  },
  {
    id: "trip-05",
    scenario: "travel",
    primary:
      "Per un viaggio romantico, punta su un posto che inviti a rallentare: un borgo affacciato sul mare, una città elegante da girare a piedi, un rifugio immerso nella natura. L'importante è il tempo di qualità insieme. Preferite atmosfera cittadina o angolo appartato?",
    retry:
      "In coppia funziona ciò che vi fa stare vicini senza fretta: una cena con vista, passeggiate lente, un posticino intimo. Dimmi cosa vi piace di più e vi suggerisco la destinazione perfetta per due.",
  },
  {
    id: "trip-06",
    scenario: "travel",
    primary:
      "Per una città d'arte, l'Italia è imbarazzante per ricchezza: Firenze per il Rinascimento, Roma per la Storia stratificata, Venezia per la magia unica. Preferisci un capoluogo pieno di musei o una città da vivere passeggiando senza meta?",
    retry:
      "Se ami l'arte, non sbagli con Firenze, Roma o Napoli, ma anche gioielli meno affollati come Ferrara o Mantova valgono il viaggio. Dimmi se cerchi grandi musei o atmosfera da vivere a piedi.",
  },
  {
    id: "trip-07",
    scenario: "travel",
    primary:
      "Mare o montagna è la domanda eterna! Il mare è relax, ritmo lento e giornate lunghe; la montagna è aria fresca, camminate e silenzio che rigenera. Dimmi in che stagione parti e che tipo di riposo cerchi, e ti aiuto a sciogliere il dubbio.",
    retry:
      "Dipende da come vuoi ricaricarti: se sogni spiaggia e dolce far niente, mare; se cerchi natura, freschezza e movimento, montagna. Raccontami il tuo ideale di vacanza e ti do la mia dritta.",
  },
  {
    id: "trip-08",
    scenario: "travel",
    primary:
      "Per costruire un itinerario, la chiave è non strafare: due o tre cose belle al giorno, con tempo per godersele, valgono più di una lista infinita corsa di fretta. Dimmi la meta e quanti giorni hai, e ti aiuto a distribuire le tappe con equilibrio.",
    retry:
      "Un buon itinerario alterna momenti clou e pause: meglio vivere davvero pochi luoghi che spuntarne venti col fiatone. Dammi destinazione e durata e ti costruisco un giro sostenibile e piacevole.",
  },
  {
    id: "trip-09",
    scenario: "travel",
    primary:
      "Per un viaggio last minute, resta flessibile: guarda le mete con offerte del momento e parti leggero, senza pretendere l'itinerario perfetto. Spesso le partenze improvvisate diventano i ricordi più belli. Dimmi da dove parti e quanti giorni hai, e ragioniamo sulle opzioni.",
    retry:
      "All'ultimo minuto vince chi si adatta: lasciati guidare dalle occasioni e dalle destinazioni più comode da raggiungere. Dammi i tuoi vincoli — giorni, budget, punto di partenza — e vediamo cosa si può fare.",
  },
  {
    id: "trip-10",
    scenario: "travel",
    primary:
      "Prima di partire, controlla le tre cose che salvano il viaggio: documenti validi (e loro copie), un'assicurazione se vai lontano, e la conferma delle prenotazioni. Il resto si aggiusta strada facendo. Vuoi che ti prepari una checklist di partenza completa?",
    retry:
      "Per organizzare bene un viaggio parti dalle basi: documenti in regola, prenotazioni confermate, un minimo di soldi in contanti e le app utili scaricate. Se vuoi, ti stilo una lista da spuntare prima di uscire di casa.",
  },

  // ── Wellbeing & motivation ──────────────────────────────────────────────
  {
    id: "well-01",
    scenario: "wellbeing",
    primary:
      "Quando lo stress sale, il primo aiuto è rallentare il respiro: inspira per quattro secondi, trattieni, espira lentamente. Poi prova a scaricare su carta ciò che ti pesa e a scegliere una sola cosa da affrontare per prima. Vuoi che le mettiamo in ordine insieme?",
    retry:
      "Lo stress si combatte spezzettandolo: un respiro profondo per calmare il corpo, e poi un pensiero alla volta invece di tutto insieme. Raccontami cosa ti sta caricando e proviamo a renderlo più leggero.",
  },
  {
    id: "well-02",
    scenario: "wellbeing",
    primary:
      "Per dormire meglio, aiuta molto la costanza: stessi orari, luci basse nell'ultima ora e schermi lontani prima di coricarti. Anche una piccola routine serale segnala al corpo che è ora di spegnersi. Vuoi che ne costruiamo una semplice insieme?",
    retry:
      "Il sonno buono si prepara di sera: niente schermi troppo a lungo, una camera fresca e buia e un rituale che ti rilassi. Dimmi come sono le tue serate e vediamo cosa migliorare per riposare davvero.",
  },
  {
    id: "well-03",
    scenario: "wellbeing",
    primary:
      "La motivazione va e viene, quindi non aspettarla: parti con un passo minuscolo, anche solo cinque minuti. Spesso è l'azione a creare la voglia, non il contrario. Qual è la prima piccola mossa che potresti fare adesso?",
    retry:
      "Il segreto non è sentirsi motivati ma iniziare comunque, in piccolo. Il movimento genera slancio. Dimmi l'obiettivo e troviamo insieme il primo passettino facile da cui partire oggi stesso.",
  },
  {
    id: "well-04",
    scenario: "wellbeing",
    primary:
      "L'ansia spesso corre nel futuro: riportati al presente con i sensi — cosa vedi, senti, tocchi in questo momento. Ricorda che i pensieri non sono fatti, e che questa ondata, come tutte, passerà. Vuoi provare un piccolo esercizio insieme?",
    retry:
      "Quando l'ansia stringe, ancorati al qui e ora: un respiro lento e l'attenzione a ciò che ti circonda spezzano il vortice. Non sei i tuoi pensieri. Se ti va, ne parliamo e cerchiamo un po' di sollievo.",
  },
  {
    id: "well-05",
    scenario: "wellbeing",
    primary:
      "Per iniziare a fare sport, il trucco è partire ridicolmente facile: dieci minuti, tre volte a settimana, di qualcosa che non odi. La costanza batte l'intensità, sempre. Meglio poco e regolare che tanto e mollato dopo una settimana. Che tipo di movimento ti attira?",
    retry:
      "Rimettersi in moto funziona se non parti in quarta: obiettivi minuscoli e sostenibili, un'attività che ti diverta, e la regolarità farà il resto. Dimmi cosa ti piacerebbe fare e costruiamo un inizio leggero.",
  },
  {
    id: "well-06",
    scenario: "wellbeing",
    primary:
      "Staccare davvero è una necessità, non un lusso. Concediti qualcosa che ti riporti nel corpo e fuori dai pensieri: una camminata, la musica, le mani in qualcosa di manuale. Anche mezz'ora vera vale più di una serata distratta. Cosa ti fa sentire leggero di solito?",
    retry:
      "Il relax vero è quello in cui la mente smette di correre: natura, movimento lento, un hobby che ti assorba. Dimmi cosa ti rilassa e ti aiuto a ritagliarti quel momento senza sensi di colpa.",
  },
  {
    id: "well-07",
    scenario: "wellbeing",
    primary:
      "Se ti senti sempre stanco, guarda le basi prima di tutto: sonno, idratazione, pause vere e movimento. Spesso l'energia non manca per pigrizia, ma perché il serbatoio non viene mai ricaricato davvero. Vuoi che vediamo insieme dove potresti recuperare un po' di batteria?",
    retry:
      "La stanchezza cronica di solito parla: dormi abbastanza? Ti fermi mai davvero? Ti muovi un minimo? Partiamo da qui. Raccontami le tue giornate e cerchiamo insieme dove ricaricare le pile.",
  },
  {
    id: "well-08",
    scenario: "wellbeing",
    primary:
      "Per concentrarti meglio, togli le distrazioni prima di cercare la forza di volontà: telefono lontano, una sola cosa alla volta e blocchi di lavoro brevi con pause programmate. La mente si concentra meglio quando sa che il riposo arriverà. Vuoi impostare un ritmo insieme?",
    retry:
      "La concentrazione è più questione di ambiente che di disciplina: elimina gli inneschi di distrazione, lavora a intervalli e proteggi i momenti chiave. Dimmi su cosa devi concentrarti e ti aiuto a organizzarti.",
  },
  {
    id: "well-09",
    scenario: "wellbeing",
    primary:
      "Le abitudini sane si costruiscono in piccolo e si legano a qualcosa che già fai: un bicchiere d'acqua appena sveglio, due minuti di stretching dopo il caffè. Aggancia il nuovo al vecchio e sarà molto più facile. Quale abitudine vorresti introdurre per prima?",
    retry:
      "Il modo migliore per creare una buona abitudine è renderla minuscola e collegarla a un gesto già automatico. Piccola, ripetuta, senza strafare. Dimmi cosa vorresti cambiare e troviamo l'aggancio giusto.",
  },
  {
    id: "well-10",
    scenario: "wellbeing",
    primary:
      "Le giornate no fanno parte del gioco e non definiscono chi sei. Abbassa le pretese per oggi, fai solo l'essenziale e trattati con la gentilezza che riserveresti a un amico in difficoltà. Domani è un'altra pagina. Vuoi raccontarmi cosa ti ha appesantito?",
    retry:
      "Quando il morale è sotto i tacchi, non è il momento delle grandi imprese: fai il minimo, cerca una piccola cosa buona e concediti di non essere al top. Passerà. Se ti va di sfogarti, sono qui.",
  },
  {
    id: "well-11",
    scenario: "wellbeing",
    primary:
      "Un esercizio di respiro semplice che calma quasi subito: inspira dal naso contando fino a quattro, trattieni per quattro, espira dalla bocca per sei. Ripetilo qualche volta e senti il corpo che si ammorbidisce. Vuoi provarci ora, insieme?",
    retry:
      "La respirazione lenta è un interruttore per il sistema nervoso: espirazioni più lunghe delle inspirazioni segnalano al corpo che può rilassarsi. Fai qualche ciclo con calma e nota la differenza. Ti guido passo passo se vuoi.",
  },
  {
    id: "well-12",
    scenario: "wellbeing",
    primary:
      "L'equilibrio tra vita e lavoro non è dividere il tempo a metà, ma proteggere ciò che conta: confini chiari, un vero stacco quando stacchi e spazi non negoziabili per te e per gli affetti. Vuoi che individuiamo dove il lavoro ti sta invadendo di più?",
    retry:
      "Trovare l'equilibrio significa mettere qualche paletto: orari che finiscono davvero, notifiche silenziate fuori orario e tempo sacro per la vita privata. Raccontami come sono le tue giornate e vediamo dove rimettere confini.",
  },

  // ── Work & career ───────────────────────────────────────────────────────
  {
    id: "job-01",
    scenario: "career",
    primary:
      "Per un colloquio, prepara tre cose: una versione chiara di chi sei e cosa sai fare, due o tre esempi concreti dei tuoi successi e qualche domanda intelligente da fare tu. E ricorda: è anche un tuo modo per capire se l'azienda fa per te. Vuoi che simuliamo qualche domanda?",
    retry:
      "Il colloquio si vince con la preparazione: conosci l'azienda, porta esempi concreti dei tuoi risultati e mostrati curioso facendo domande vere. Non è un interrogatorio, è un dialogo alla pari. Se vuoi, ci alleniamo insieme.",
  },
  {
    id: "job-02",
    scenario: "career",
    primary:
      "Un buon CV è chiaro e concreto: poche righe, risultati misurabili invece di elenchi di mansioni, e su misura per la posizione a cui punti. Chi legge deve capire in trenta secondi perché sei la persona giusta. Vuoi che lo rivediamo insieme sezione per sezione?",
    retry:
      "Il curriculum efficace è essenziale e centrato sui risultati: numeri, verbi d'azione e taglio pensato per l'offerta specifica, non un elenco generico. Dimmi la posizione a cui miri e ti aiuto a valorizzarlo.",
  },
  {
    id: "job-03",
    scenario: "career",
    primary:
      "Per chiedere un aumento, arriva preparato: elenca i risultati concreti che hai portato, informati sui valori di mercato del tuo ruolo e scegli il momento giusto. Parla di valore aggiunto, non solo di bisogno. Vuoi che costruiamo insieme la tua argomentazione?",
    retry:
      "Chiedere un aumento è legittimo se lo motivi bene: prepara le prove del tuo contributo, un riferimento di mercato e un tono sereno e sicuro. Se vuoi, prepariamo insieme cosa dire e come dirlo.",
  },
  {
    id: "job-04",
    scenario: "career",
    primary:
      "I rapporti difficili col capo logorano parecchio. Prova a distinguere il problema concreto dallo stile personale, e affronta i fatti con esempi specifici invece di lamentele generiche. Un confronto calmo e mirato spesso sblocca più di quanto pensi. Vuoi raccontarmi la situazione?",
    retry:
      "Con un capo complicato, la strategia è sui fatti, non sulle emozioni: porta esempi precisi, proposte di soluzione e mantieni la calma. Raccontami cosa succede e ragioniamo su come gestirlo al meglio.",
  },
  {
    id: "job-05",
    scenario: "career",
    primary:
      "Pensare di cambiare lavoro è un segnale da ascoltare, non da ignorare. Chiediti se ciò che manca è recuperabile dove sei o no, e cosa cerchi davvero nel prossimo passo. Muoviti con un piano, non solo di pancia. Vuoi che facciamo chiarezza insieme su cosa ti spinge?",
    retry:
      "Cambiare lavoro è una scelta importante: prima di tutto capisci cosa ti manca e cosa cerchi, poi valuta se puoi ottenerlo restando o ripartendo altrove. Mettiamo in fila pro e contro con calma, se ti va.",
  },
  {
    id: "job-06",
    scenario: "career",
    primary:
      "Per essere più produttivo, punta sulla qualità dell'attenzione più che sulle ore: scegli poche priorità vere ogni giorno, lavora a blocchi senza interruzioni e proteggi le fasi in cui rendi di più. Fare tutto non è l'obiettivo, fare ciò che conta sì. Vuoi impostare un metodo insieme?",
    retry:
      "La produttività non è riempire ogni minuto, ma dedicare le energie migliori alle cose che contano: priorità chiare, meno multitasking e pause vere. Dimmi come lavori adesso e vediamo dove guadagnare efficacia.",
  },
  {
    id: "job-07",
    scenario: "career",
    primary:
      "Il burnout è un segnale serio, non una debolezza: il corpo e la mente stanno chiedendo tregua. Il primo passo è ridurre il carico dove puoi e rimettere dei confini, anche impopolari. Non è pigrizia, è manutenzione. Vuoi che vediamo insieme cosa alleggerire per primo?",
    retry:
      "Quando arriva il burnout, spingere di più è la strada sbagliata: servono confini, riposo vero e a volte aiuto esterno. Prenderti cura di te viene prima di tutto. Raccontami come stai e vediamo da dove ripartire.",
  },
  {
    id: "job-08",
    scenario: "career",
    primary:
      "Per riunioni efficaci, la regola è: obiettivo chiaro, solo le persone necessarie e un orario di fine rispettato. Se non c'è una decisione da prendere o qualcosa da allineare, spesso basta un messaggio. Vuoi che prepariamo insieme un'agenda snella per la prossima?",
    retry:
      "Le riunioni funzionano quando hanno uno scopo preciso e un tempo definito: niente incontri-fiume senza decisioni. Dimmi di cosa devi discutere e ti aiuto a strutturarla così da farla breve e utile.",
  },
  {
    id: "job-09",
    scenario: "career",
    primary:
      "Per una lettera di dimissioni, tieni un tono professionale e sereno: comunica la decisione, ringrazia per l'esperienza e indica l'ultimo giorno secondo il preavviso. Niente polemiche: il mondo del lavoro è piccolo e la reputazione resta. Vuoi che la scriviamo insieme?",
    retry:
      "Le dimissioni si danno con eleganza: breve, cortese, senza rancori, con date e preavviso chiari. Lasciare bene conta quanto arrivare bene. Se vuoi, ti preparo una bozza pronta da adattare.",
  },
  {
    id: "job-10",
    scenario: "career",
    primary:
      "Guidare un team è soprattutto ascolto e chiarezza: obiettivi comprensibili, fiducia nelle persone e feedback frequente, sia sui risultati che sulle difficoltà. Un buon leader toglie ostacoli più che imporre controllo. Vuoi che approfondiamo un aspetto in particolare?",
    retry:
      "Gestire un gruppo funziona quando le persone sanno dove andare e si sentono supportate: direzione chiara, autonomia e riconoscimento. Dimmi cosa ti sta mettendo in difficoltà con il team e ne parliamo.",
  },
  {
    id: "job-11",
    scenario: "career",
    primary:
      "Per un'email professionale efficace: oggetto chiaro, prima riga che va dritta al punto, richiesta esplicita e tono cortese ma sintetico. Chi legge deve capire cosa vuoi e cosa deve fare senza rileggere. Vuoi che ti aiuti a scriverne una in particolare?",
    retry:
      "L'email di lavoro ideale è breve e chiara: oggetto informativo, messaggio essenziale e una richiesta precisa. Dimmi a chi scrivi e cosa ti serve, e ti preparo un testo pulito e professionale.",
  },
  {
    id: "job-12",
    scenario: "career",
    primary:
      "Per parlare in pubblico senza panico, prepara una struttura semplice — apertura, tre punti chiave, chiusura — e prova ad alta voce più volte. L'emozione non sparisce, ma la preparazione la trasforma in energia. E ricorda: il pubblico tifa per te. Vuoi che costruiamo insieme la scaletta?",
    retry:
      "Presentare bene è questione di struttura e prove: pochi messaggi chiari, ripetuti finché scorrono naturali. Un po' di tensione è normale e persino utile. Dimmi il tema e ti aiuto a organizzare l'intervento.",
  },
  {
    id: "job-13",
    scenario: "career",
    primary:
      "Per crescere professionalmente, non aspettare solo che accada: rendi visibili i tuoi risultati, chiedi feedback, coltiva competenze richieste e fai sapere dove vuoi arrivare. La carriera si costruisce anche parlando delle proprie ambizioni. Vuoi che tracciamo un piccolo piano insieme?",
    retry:
      "La crescita di carriera vuole intenzione: obiettivi chiari, nuove competenze, relazioni e la capacità di far conoscere il tuo valore. Dimmi dove vorresti arrivare e definiamo insieme i prossimi passi concreti.",
  },
  {
    id: "job-14",
    scenario: "career",
    primary:
      "Un conflitto con un collega si scioglie meglio a quattr'occhi e sui fatti: spiega come ti sei sentito senza accusare, ascolta la sua versione e cercate un punto d'incontro pratico. Spesso dietro l'attrito c'è solo un malinteso. Vuoi che ti aiuti a impostare il discorso?",
    retry:
      "Con un collega in attrito, punta al dialogo diretto e civile: parla in prima persona, ascolta davvero e concentrati sulla soluzione, non sulla colpa. Se vuoi, prepariamo insieme come affrontare la conversazione.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Macro-topic taxonomy (the "logic configuration" for the selection engine).
//
// Each `ResponseScenario` is a MACRO-ARGUMENT already present in the codebase.
// A macro-topic bundles the intent keywords a user might type — in Italian
// (answers are Italian) and English (the demo UI + quick-actions are English) —
// so the router can map free-text input to a scenario, then draw a template
// from that scenario's pool. Add a template with a new scenario + its keywords
// here and the pool expands automatically (see `buildResponseModel`).
// ─────────────────────────────────────────────────────────────────────────

export interface MacroTopic {
  id: ResponseScenario;
  /** Human label shown in tooling / debug. */
  label: string;
  /** One-line description of the question class this topic answers. */
  description: string;
  /** Lowercase intent keywords (IT + EN). Multi-word entries match as phrases. */
  keywords: string[];
}

export const MACRO_TOPICS: MacroTopic[] = [
  {
    id: "data-retrieval",
    label: "Data retrieval",
    description: "Fetching, querying or looking up records, metrics and documents.",
    keywords: [
      "dati", "dato", "data", "dataset", "record", "recupera", "recuperare",
      "estrai", "estrazione", "query", "interroga", "interrogazione", "cerca",
      "ricerca", "trova", "search", "find", "fetch", "retrieve", "lookup",
      "export", "esporta", "metriche", "metrics", "statistiche", "report",
      "crm", "database", "archivio", "documenti", "profilo", "account",
    ],
  },
  // Frontend-coding topics are declared HIGH (right after data-retrieval, before
  // status-update) so that on a keyword tie the concrete coding intent wins —
  // declaration order is the tie-breaker in matchTopic. In particular this lets
  // "gestire lo stato" (state-management) beat the Italian "stato" = "status"
  // keyword owned by status-update. Pure status queries still route correctly
  // because state-management deliberately does NOT claim the bare "stato" token.
  {
    id: "dom-manipulation",
    label: "DOM manipulation",
    description: "Selecting, creating, updating, removing and rendering DOM nodes.",
    keywords: [
      "dom", "elemento", "elementi", "element", "nodo", "node", "queryselector",
      "queryselectorall", "getelementbyid", "createelement", "append",
      "appendchild", "classlist", "classe", "class", "innerhtml", "textcontent",
      "attributo", "attribute", "dataset", "selettore", "selector",
      "documentfragment", "fragment", "mostra", "nascondi", "hidden", "seleziona",
      "crea elemento", "manipola", "manipolare",
    ],
  },
  {
    id: "event-handling",
    label: "Event handling",
    description: "Listeners, delegation, debounce/throttle, keyboard and custom events.",
    keywords: [
      "evento", "eventi", "event", "listener", "addeventlistener",
      "removeeventlistener", "click", "clicca", "clic", "onclick", "keydown",
      "keyup", "keypress", "tastiera", "keyboard", "delegation", "delega",
      "debounce", "throttle", "preventdefault", "dispatchevent", "customevent",
      "custom event", "hover", "mouseover", "mouseenter", "scroll", "form",
      "formdata", "ascolta", "ascoltatore", "abortcontroller", "gestione eventi",
    ],
  },
  {
    id: "state-management",
    label: "State management (client-side)",
    description: "React state/reducer/context, vanilla stores and localStorage persistence.",
    // Note: bare "stato" intentionally stays with status-update (Italian
    // "stato" = "status"); state uses specific phrases + English "state" + the
    // React/store API terms to disambiguate.
    keywords: [
      "state", "usestate", "use state", "usereducer", "reducer", "dispatch",
      "store", "context", "createcontext", "usecontext", "setstate", "reattivo",
      "reattività", "reactive", "reactivity", "localstorage", "sessionstorage",
      "persistenza", "persist", "gestione stato", "gestione dello stato",
      "gestire lo stato", "gestisco lo stato", "gestisci lo stato", "stato locale",
      "stato globale", "stato del componente", "global state", "state management",
      "observable", "immutabile", "immutable", "derivato", "computed",
      "prop drilling",
    ],
  },
  {
    id: "status-update",
    label: "Status update",
    description: "Progress, health, deploys, backups and running jobs.",
    keywords: [
      "stato", "status", "avanzamento", "progress", "in corso", "deploy",
      "rilascio", "release", "backup", "pipeline", "elaborazione", "processing",
      "sistemi", "uptime", "salute", "health", "coda", "queue", "workflow",
      "importazione", "sincronizzazione", "sync", "aggiornamento", "cluster",
      "monitor", "monitoraggio",
    ],
  },
  {
    id: "error-handling",
    label: "Error handling",
    description: "Failures, exceptions, permissions and validation problems.",
    keywords: [
      "errore", "error", "problema", "fallito", "fallita", "fail", "failed",
      "timeout", "bug", "crash", "non funziona", "eccezione", "exception",
      "permessi", "autorizzazione", "denied", "invalid", "invalido",
      "validazione", "non riesco", "blocked", "bloccato", "500", "scaduta",
      "sessione", "duplicato", "conflitto",
    ],
  },
  {
    id: "confirmation",
    label: "Confirmation",
    description: "Acknowledging saved, sent, scheduled or cancelled actions.",
    keywords: [
      "conferma", "confirm", "salva", "salvato", "save", "saved", "ok", "fatto",
      "done", "registra", "invia", "inviato", "submit", "pagamento", "payment",
      "paga", "pianifica", "schedule", "programma", "invito", "invita", "invite",
      "annulla", "cancel", "firma", "sign", "imposta", "preferenze", "applica",
    ],
  },
  {
    id: "analysis",
    label: "Analysis / insights",
    description: "Trends, comparisons, segmentation, sentiment and summaries.",
    keywords: [
      "analizza", "analisi", "analyze", "analysis", "trend", "insight",
      "confronta", "confronto", "compare", "segmentazione", "sentiment",
      "riepilogo", "summarize", "summary", "sintesi", "benchmark", "previsione",
      "churn", "andamento", "valuta", "valutazione", "correlazione",
      "performance", "prestazioni",
    ],
  },
  // ── Casual / everyday topics ────────────────────────────────────────────
  // Declared BEFORE `recommendation` so that when a user asks for advice on a
  // specific life theme ("consigli sull'amore", "che film mi consigli", "come
  // gestire il lavoro") the concrete casual topic wins the keyword tie over the
  // generic `recommendation` "consiglio" hit — declaration order is the
  // tie-breaker. None of these claim the bare tokens "consiglio"/"consigli"/
  // "cosa", so pure recommendation/clarification queries still route correctly.
  {
    id: "greeting",
    label: "Greeting & identity",
    description: "Hellos, small greetings, thanks and 'who are you / what can you do'.",
    keywords: [
      "ciao", "salve", "buongiorno", "buonasera", "buonanotte", "hey", "ehi",
      "ehilà", "hola", "come stai", "come ti chiami", "chi sei", "cosa sai fare",
      "cosa puoi fare", "piacere", "buondì", "grazie mille", "bentornato",
      "ci sei", "presentati",
    ],
  },
  {
    id: "smalltalk",
    label: "Small talk",
    description: "Casual chit-chat: how's it going, jokes, fun facts, boredom.",
    keywords: [
      "come va", "tutto bene", "che si dice", "cosa fai", "che fai",
      "chiacchier", "chiacchiere", "due parole", "parliamo", "raccontami",
      "barzelletta", "battuta", "scherzo", "fammi ridere", "umorismo",
      "curiosità", "fun fact", "mi annoio", "annoiato", "noia", "che noia",
      "come butta", "come te la passi",
    ],
  },
  {
    id: "relationships",
    label: "Relationships & love",
    description: "Love, dating, breakups, jealousy, friendships and family advice.",
    keywords: [
      "amore", "amo", "innamorat", "relazione", "fidanzat", "ragazza", "ragazzo",
      "partner", "coppia", "cuore", "cuore spezzato", "ex", "gelosia", "geloso",
      "gelosa", "appuntamento", "primo appuntamento", "dichiararmi", "piaccio",
      "gli piaccio", "le piaccio", "amicizia", "amico", "amica", "litigio",
      "litigato", "rottura", "lasciato", "conoscere gente", "sentimenti",
      "distanza", "storia d'amore",
    ],
  },
  {
    id: "entertainment",
    label: "Entertainment",
    description: "Movies, TV series, music, books, games, podcasts to enjoy.",
    keywords: [
      "film", "un film", "che film", "serie", "serie tv", "telefilm", "musica",
      "canzone", "playlist", "libro", "un libro", "lettura", "leggere",
      "videogioco", "videogiochi", "gioco", "anime", "cartoni", "documentario",
      "documentari", "podcast", "cosa guardo", "cosa guardare", "da guardare",
      "da vedere", "cosa vedo", "stasera guardo", "regista", "attore", "commedia",
      "horror", "thriller", "fantascienza",
    ],
  },
  {
    id: "daily-life",
    label: "Daily-life helpers",
    description: "Reminders, alarms, shopping lists, weather, to-dos, quick math.",
    keywords: [
      "promemoria", "ricordami", "sveglia", "allarme", "lista della spesa",
      "spesa", "to-do", "cose da fare", "lista", "agenda", "appuntamenti",
      "organizza la giornata", "organizzare la giornata", "giornata",
      "meteo", "weather", "tempo fa", "che tempo", "timer", "pomodoro",
      "calcola", "calcolo", "conto", "percentuale", "traduci", "traduzione",
      "converti", "conversione", "pulizie", "bollette", "scadenze",
    ],
  },
  {
    id: "food-cooking",
    label: "Food & cooking",
    description: "What to cook, quick recipes, restaurants, ingredients, drinks.",
    keywords: [
      "cucino", "cucinare", "cucina", "ricetta", "ricette", "cena", "pranzo",
      "colazione", "mangiare", "cosa mangio", "cosa cucino", "piatto", "primo",
      "secondo", "dolce", "dessert", "ristorante", "trattoria", "pizza",
      "ingrediente", "ingredienti", "sostituire", "svuota frigo", "drink",
      "cocktail", "aperitivo", "menù", "fame",
    ],
  },
  {
    id: "travel",
    label: "Travel",
    description: "Where to go, weekend trips, packing, itineraries, destinations.",
    keywords: [
      "viaggio", "viaggiare", "vacanza", "vacanze", "meta", "destinazione",
      "weekend fuori", "gita", "volo", "hotel", "valigia", "itinerario",
      "dove andare", "dove vado", "mare o montagna", "mare", "montagna",
      "città d'arte", "last minute", "partire", "ferie", "spiaggia", "borgo",
      "turismo",
    ],
  },
  {
    id: "wellbeing",
    label: "Wellbeing & motivation",
    description: "Stress, sleep, anxiety, motivation, habits, exercise, balance.",
    keywords: [
      "stress", "stressato", "stressata", "ansia", "ansioso", "dormire",
      "sonno", "insonnia", "motivazione", "motivarmi", "demotivato", "stanco",
      "stanchezza", "energia", "relax", "rilassarmi", "staccare", "meditazione",
      "respirazione", "respiro", "concentrarmi", "concentrazione", "palestra",
      "allenarmi", "abitudini", "benessere", "morale", "giù di morale",
      "stare meglio", "burnout", "equilibrio",
    ],
  },
  {
    id: "career",
    label: "Work & career",
    description: "Job, interviews, CV, boss, raises, productivity, team, career growth.",
    keywords: [
      "lavoro", "colloquio", "cv", "curriculum", "aumento", "capo", "collega",
      "colleghi", "ufficio", "carriera", "promozione", "cambiare lavoro",
      "dimissioni", "riunione", "riunioni", "produttività", "produttivo",
      "scadenza lavoro", "team", "gestire il team", "presentazione",
      "parlare in pubblico", "email di lavoro", "email professionale",
      "smart working", "freelance", "stipendio", "mansione",
    ],
  },
  {
    id: "recommendation",
    label: "Recommendation",
    description: "Advice, strategy, best options and next-step suggestions.",
    keywords: [
      "consiglia", "consiglio", "suggerisci", "suggerimento", "recommend",
      "raccomanda", "migliore", "best", "strategia", "strategy", "dovrei",
      "should", "ottimizza", "optimize", "piano", "plan", "come posso",
      "how to", "how do", "brainstorm", "idee", "ideas", "meglio", "conviene",
    ],
  },
  {
    id: "clarification",
    label: "Clarification",
    description: "Resolving ambiguity before acting on an unclear request.",
    keywords: [
      "chiarimento", "chiarisci", "clarify", "cosa intendi", "non chiaro",
      "ambiguo", "quale", "which", "specifica", "precisa", "dubbio", "spiega",
      "explain", "learn", "cosa significa", "intendi", "conferma prima",
    ],
  },
];

// Per-template QUESTION-CONTEXT tag: a finer-grained label than the macro-topic,
// naming the specific question each template answers. Kept as a lookup map so
// the 50 template literals above stay untouched; the tokens double as secondary
// signals the router uses to pick the most on-topic template within a scenario.
export const TEMPLATE_CONTEXT: Record<string, string> = {
  "tpl-01": "dataset export",
  "tpl-02": "multi table query",
  "tpl-03": "document archive search",
  "tpl-04": "quarterly financials",
  "tpl-05": "customer account profile",
  "tpl-06": "crm sync",
  "tpl-07": "usage metrics",
  "tpl-08": "semantic search",
  "tpl-09": "task progress",
  "tpl-10": "staging deploy",
  "tpl-11": "systems health uptime",
  "tpl-12": "nightly backup",
  "tpl-13": "request queued",
  "tpl-14": "data import progress",
  "tpl-15": "cluster config rollout",
  "tpl-16": "workflow run",
  "tpl-17": "service timeout",
  "tpl-18": "missing parameters",
  "tpl-19": "authorization denied permessi",
  "tpl-20": "duplicate record conflict",
  "tpl-21": "database unavailable",
  "tpl-22": "file too large upload",
  "tpl-23": "email validation format",
  "tpl-24": "session expired login",
  "tpl-25": "settings saved",
  "tpl-26": "request submitted reference",
  "tpl-27": "task scheduled reminder",
  "tpl-28": "operation cancelled",
  "tpl-29": "document signed archived",
  "tpl-30": "payment applied order",
  "tpl-31": "user invited workspace",
  "tpl-32": "notification preferences",
  "tpl-33": "growth trend conversions",
  "tpl-34": "cost benefit comparison",
  "tpl-35": "sales anomaly",
  "tpl-36": "customer segmentation",
  "tpl-37": "churn drivers",
  "tpl-38": "report summary",
  "tpl-39": "feedback sentiment",
  "tpl-40": "benchmark comparison",
  "tpl-41": "process automation",
  "tpl-42": "plan selection pricing",
  "tpl-43": "stock alert reorder",
  "tpl-44": "query optimization scaling",
  "tpl-45": "gradual rollout",
  "tpl-46": "security two factor",
  "tpl-47": "calendar vs fiscal year",
  "tpl-48": "summary vs detail",
  "tpl-49": "delete vs archive",
  "tpl-50": "ambiguous name",
  "tpl-51": "queryselector select element",
  "tpl-52": "create append element",
  "tpl-53": "classlist toggle class",
  "tpl-54": "textcontent innerhtml safe",
  "tpl-55": "attributes dataset",
  "tpl-56": "remove replace node",
  "tpl-57": "render list array",
  "tpl-58": "show hide toggle visibility",
  "tpl-59": "addeventlistener click",
  "tpl-60": "event delegation",
  "tpl-61": "form submit formdata",
  "tpl-62": "debounce input",
  "tpl-63": "throttle scroll resize",
  "tpl-64": "keyboard keydown shortcut",
  "tpl-65": "custom event dispatch",
  "tpl-66": "remove listener cleanup abortcontroller",
  "tpl-67": "usestate counter input",
  "tpl-68": "usereducer actions",
  "tpl-69": "vanilla store pubsub subscribe",
  "tpl-70": "localstorage persistence",
  "tpl-71": "immutable update array object",
  "tpl-72": "context provider prop drilling",
  "tpl-73": "derived computed state",
  "tpl-74": "sync state dom render",
  // Greetings & identity
  "grt-01": "ciao come stai",
  "grt-02": "buongiorno",
  "grt-03": "buonasera",
  "grt-04": "chi sei presentati",
  "grt-05": "cosa sai fare",
  "grt-06": "come ti chiami",
  "grt-07": "hey saluto casual",
  "grt-08": "come stai umore",
  "grt-09": "buonanotte",
  "grt-10": "grazie prego",
  "grt-11": "piacere di conoscerti",
  "grt-12": "bentornato",
  // Small talk
  "smt-01": "come va tutto bene",
  "smt-02": "cosa fai",
  "smt-03": "barzelletta battuta",
  "smt-04": "curiosità fun fact",
  "smt-05": "mi annoio noia",
  "smt-06": "weekend",
  "smt-07": "due chiacchiere parliamo",
  "smt-08": "tutto bene",
  "smt-09": "raccontami curiosità",
  "smt-10": "giornata storta morale",
  "smt-11": "complimento grazie",
  "smt-12": "fammi ridere umorismo",
  // Relationships & love
  "rel-01": "consigli amore generico",
  "rel-02": "primo appuntamento",
  "rel-03": "litigio partner",
  "rel-04": "dimenticare ex",
  "rel-05": "gelosia",
  "rel-06": "dichiararmi sentimenti",
  "rel-07": "relazione a distanza",
  "rel-08": "dubbi relazione",
  "rel-09": "conoscere gente nuova",
  "rel-10": "amicizia in crisi",
  "rel-11": "rottura cuore spezzato",
  "rel-12": "se gli piaccio",
  "rel-13": "tenere viva la coppia",
  "rel-14": "rapporti famiglia",
  // Entertainment
  "ent-01": "consiglio film generico",
  "ent-02": "cosa guardo stasera film",
  "ent-03": "serie tv",
  "ent-04": "film commedia ridere",
  "ent-05": "horror thriller paura",
  "ent-06": "musica playlist",
  "ent-07": "libro da leggere",
  "ent-08": "anime cartoni",
  "ent-09": "videogiochi gioco",
  "ent-10": "documentari",
  "ent-11": "film romantico",
  "ent-12": "fantascienza sci-fi",
  "ent-13": "film famiglia bambini",
  "ent-14": "podcast",
  "ent-15": "film azione",
  "ent-16": "classico da recuperare",
  // Daily-life helpers
  "day-01": "promemoria ricordami",
  "day-02": "sveglia allarme",
  "day-03": "lista della spesa",
  "day-04": "meteo weather tempo",
  "day-05": "organizza la giornata",
  "day-06": "to-do cose da fare",
  "day-07": "agenda appuntamenti",
  "day-08": "gestione del tempo",
  "day-09": "pulizie casa",
  "day-10": "bollette scadenze",
  "day-11": "timer pomodoro",
  "day-12": "calcolo veloce percentuale",
  "day-13": "traduci traduzione",
  "day-14": "converti conversione unità",
  // Food & cooking
  "food-01": "cosa cucino stasera",
  "food-02": "ricetta veloce",
  "food-03": "idea per la cena",
  "food-04": "ristorante consiglio",
  "food-05": "sostituire ingrediente",
  "food-06": "svuota frigo ingredienti",
  "food-07": "dolce dessert",
  "food-08": "pranzo sano",
  "food-09": "drink cocktail",
  "food-10": "colazione",
  // Travel
  "trip-01": "dove andare vacanza",
  "trip-02": "weekend fuori",
  "trip-03": "valigia cosa mettere",
  "trip-04": "meta economica",
  "trip-05": "viaggio romantico",
  "trip-06": "città d'arte",
  "trip-07": "mare o montagna",
  "trip-08": "itinerario giorni",
  "trip-09": "last minute",
  "trip-10": "organizzare viaggio documenti",
  // Wellbeing & motivation
  "well-01": "stress",
  "well-02": "dormire sonno",
  "well-03": "motivazione",
  "well-04": "ansia",
  "well-05": "iniziare sport palestra",
  "well-06": "relax staccare",
  "well-07": "stanchezza energia",
  "well-08": "concentrazione concentrarmi",
  "well-09": "abitudini sane",
  "well-10": "giù di morale giornata no",
  "well-11": "respirazione meditazione",
  "well-12": "equilibrio vita lavoro",
  // Work & career
  "job-01": "colloquio",
  "job-02": "cv curriculum",
  "job-03": "chiedere aumento",
  "job-04": "problemi col capo",
  "job-05": "cambiare lavoro",
  "job-06": "produttività",
  "job-07": "burnout",
  "job-08": "riunioni efficaci",
  "job-09": "lettera dimissioni",
  "job-10": "gestire il team",
  "job-11": "email professionale",
  "job-12": "parlare in pubblico presentazione",
  "job-13": "crescita carriera",
  "job-14": "conflitto collega",
};

// Static fallback returned when no macro-topic clears the similarity threshold.
// Still a full ResponseTemplate so the retry-swap UI keeps working unchanged.
export const FALLBACK_TEMPLATE: ResponseTemplate = {
  id: "tpl-fallback",
  scenario: "clarification",
  primary:
    "Non sono sicuro di aver colto la tua richiesta. Posso aiutarti con tante cose: due chiacchiere, consigli su amore, film, viaggi o benessere, l'organizzazione delle giornate, il lavoro e persino il codice. Prova a riformulare o dammi un dettaglio in più e ci arriviamo.",
  retry:
    "Non ho inquadrato bene di cosa avessi bisogno. Dimmi pure se ti serve fare due chiacchiere, un consiglio (film, relazioni, lavoro, viaggi), una mano con le attività di tutti i giorni o un supporto tecnico: riformula e ti seguo volentieri.",
};

// Tunables for the selection engine, kept as data so behaviour is configurable
// without touching the algorithm.
export const ROUTING_CONFIG = {
  /** Minimum topic similarity (0..1) required to skip the fallback. */
  threshold: 0.6,
  /** Only tokens/keywords at least this long are fuzzy-matched (avoids noise). */
  minFuzzyLen: 4,
  /** How many recently-served template ids to avoid repeating. */
  historySize: 8,
} as const;

/** A template enriched with its resolved macro-topic + question-context tag. */
export interface TaggedTemplate extends ResponseTemplate {
  topicId: ResponseScenario;
  context: string;
}

/** Hierarchical, JSON-serialisable view: macro-topic → keywords + tagged pool.
 *  Built at runtime from `RESPONSE_TEMPLATES`, so adding templates or a whole
 *  new scenario expands the model with no other change. */
export function buildResponseModel(): Array<
  MacroTopic & { templates: TaggedTemplate[] }
> {
  return MACRO_TOPICS.map((topic) => ({
    ...topic,
    templates: RESPONSE_TEMPLATES.filter((t) => t.scenario === topic.id).map(
      (t) => ({
        ...t,
        topicId: t.scenario,
        context: TEMPLATE_CONTEXT[t.id] ?? topic.id,
      }),
    ),
  }));
}
