import type { LanguageCode } from "@/types/app";

import { SITE_AUTHOR, SITE_NAME } from "@/lib/site";

export interface LocaleCopy {
  meta: {
    title: string;
    description: string;
    keywords: string;
    headline: string;
  };
  common: {
    appName: string;
    tagline: string;
    dashboard: string;
    compose: string;
    sent: string;
    inbox: string;
    settings: string;
    refresh: string;
    save: string;
    remove: string;
    clear: string;
    notifications: string;
    theme: string;
    language: string;
    madeBy: string;
    apiConnected: string;
    noData: string;
    preparing: string;
    pageNotFound: string;
    backHome: string;
  };
  languages: Record<LanguageCode, string>;
  nav: {
    dashboard: string;
    compose: string;
    sent: string;
    inbox: string;
    settings: string;
    readyToSend: string;
    needsApiKey: string;
    localWorkflowTitle: string;
    localWorkflowDescription: string;
  };
  onboarding: {
    badge: string;
    heroTitle: string;
    heroDescription: string;
    featureLocalTitle: string;
    featureLocalDescription: string;
    featureFlowTitle: string;
    featureFlowDescription: string;
    featureGrowthTitle: string;
    featureGrowthDescription: string;
    section: string;
    title: string;
    description: string;
    apiKeyLabel: string;
    apiKeyHint: string;
    rememberTitle: string;
    rememberDescription: string;
    securityNote: string;
    submit: string;
    emptyError: string;
    adTitle: string;
    adDescription: string;
  };
  topbar: {
    overview: string;
    compose: string;
    sent: string;
    inbox: string;
    settings: string;
    workspace: string;
  };
  dashboard: {
    apiStatus: string;
    recentSends: string;
    recentInbound: string;
    storedKey: string;
    defaultSender: string;
    live: string;
    checkKey: string;
    offline: string;
    missing: string;
    connectedTitle: string;
    unauthorizedTitle: string;
    offlineTitle: string;
    missingTitle: string;
    healthy: string;
    attention: string;
    retryNeeded: string;
    setup: string;
    emailsInLatestSync: string;
    inboxInLatestSync: string;
    keyPersistence: string;
    saved: string;
    session: string;
    noActiveKey: string;
    ready: string;
    unset: string;
    configureSender: string;
    senderPrefill: string;
    primaryFlow: string;
    writeAndSend: string;
    composeDescription: string;
    atGlance: string;
    mvpCoverage: string;
    portfolioReady: string;
    nativeBridgeTitle: string;
    nativeBridgeDescription: string;
    localPersistenceTitle: string;
    localPersistenceDescription: string;
    growthTitle: string;
    growthDescription: string;
    activityTitle: string;
    activityDescription: string;
    noRecentActivity: string;
  };
  quickActions: {
    title: string;
    description: string;
    newEmail: string;
    refresh: string;
    settings: string;
    openInbox: string;
    futureTitle: string;
    futureDescription: string;
  };
  composePage: {
    section: string;
    title: string;
    description: string;
    from: string;
    to: string;
    subject: string;
    content: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    subjectPlaceholder: string;
    contentPlaceholder: string;
    attachments: string;
    attachmentsHint: string;
    attachmentsEmpty: string;
    removeAttachment: string;
    attachmentsTooLarge: string;
    send: string;
    sending: string;
    validationFill: string;
    validationFrom: string;
    validationTo: string;
    noteSection: string;
    noteTitle: string;
    noteSecurityTitle: string;
    noteSecurityDescription: string;
    notePlainTextTitle: string;
    notePlainTextDescription: string;
  };
  sentPage: {
    section: string;
    title: string;
    searchPlaceholder: string;
    refreshing: string;
    emptyTitle: string;
    emptyDescription: string;
    noMatchTitle: string;
    noMatchDescription: string;
    detailTitle: string;
    detailDescription: string;
    detailLoading: string;
    detailEmptyTitle: string;
    detailEmptyDescription: string;
    bodyTitle: string;
    attachmentsTitle: string;
    noBody: string;
    sentAtLabel: string;
    ccLabel: string;
    bccLabel: string;
    replyToLabel: string;
    scheduledAtLabel: string;
    downloadAttachment: string;
  };
  inboxPage: {
    section: string;
    title: string;
    searchPlaceholder: string;
    refreshing: string;
    emptyTitle: string;
    emptyDescription: string;
    noMatchTitle: string;
    noMatchDescription: string;
    inboundHint: string;
    detailTitle: string;
    detailDescription: string;
    detailLoading: string;
    detailEmptyTitle: string;
    detailEmptyDescription: string;
    bodyTitle: string;
    attachmentsTitle: string;
    headersTitle: string;
    openRaw: string;
    noBody: string;
    messageIdLabel: string;
    receivedAtLabel: string;
    ccLabel: string;
    bccLabel: string;
    replyToLabel: string;
  };
  settingsPage: {
    apiKeySection: string;
    apiKeyTitle: string;
    apiKeyDescription: string;
    currentKeyState: string;
    noKeySaved: string;
    replaceKey: string;
    rememberTitle: string;
    rememberDescription: string;
    saveKey: string;
    savingKey: string;
    removeKey: string;
    defaultsSection: string;
    defaultsTitle: string;
    defaultsDescription: string;
    defaultSender: string;
    darkMode: string;
    darkModeDescription: string;
    saveDefaults: string;
    savingDefaults: string;
    notificationsDescription: string;
    languageDescription: string;
    localSection: string;
    localTitle: string;
    localDescription: string;
    localDataBody: string;
    clearLocalData: string;
    aboutSection: string;
    aboutTitle: string;
    aboutDescription: string;
    aboutBodyTitle: string;
    aboutBodyDescription: string;
    github: string;
    author: string;
    adsenseTitle: string;
    adsenseDescription: string;
  };
  list: {
    writeNew: string;
    fromLabel: string;
    toLabel: string;
    attachments: string;
    openEmail: string;
  };
  notificationsCopy: {
    savedKey: string;
    prefsUpdated: string;
    keyRemoved: string;
    localDataCleared: string;
    emailSent: string;
    sendFailed: string;
    loadFailed: string;
    browserApiFailure: string;
    newIncomingTitle: string;
    newIncomingBody: string;
    sentTitle: string;
    sentBody: string;
    permissionDenied: string;
  };
}

export const copyByLanguage: Record<LanguageCode, LocaleCopy> = {
  en: {
    meta: {
      title: `${SITE_NAME} | Professional Email Operations for Business`,
      description:
        "ResendBox is a multilingual Tauri and PWA client for Resend that helps businesses send, track and review professional email activity with a clean dashboard.",
      keywords:
        "ResendBox, Resend client, professional email app, business email dashboard, email operations, PWA email tool, Tauri email software",
      headline: "Professional email operations for modern businesses",
    },
    common: {
      appName: SITE_NAME,
      tagline: "Professional email operations made simple",
      dashboard: "Dashboard",
      compose: "Compose",
      sent: "Sent",
      inbox: "Inbox",
      settings: "Settings",
      refresh: "Refresh",
      save: "Save",
      remove: "Remove",
      clear: "Clear",
      notifications: "Notifications",
      theme: "Theme",
      language: "Language",
      madeBy: `Made by ${SITE_AUTHOR}`,
      apiConnected: "API connected",
      noData: "No data",
      preparing: "Preparing ResendBox…",
      pageNotFound: "Page not found",
      backHome: "Back to home",
    },
    languages: { en: "English", pt: "Portuguese", es: "Spanish" },
    nav: {
      dashboard: "Dashboard",
      compose: "Compose",
      sent: "Sent",
      inbox: "Inbox",
      settings: "Settings",
      readyToSend: "Ready to send",
      needsApiKey: "Needs API key",
      localWorkflowTitle: "Business-first workflow",
      localWorkflowDescription:
        "ResendBox keeps professional email operations fast, local and clean for teams that rely on Resend.",
    },
    onboarding: {
      badge: "Business email client",
      heroTitle: "Operate professional business email from one polished local workspace.",
      heroDescription:
        "ResendBox helps businesses manage professional outbound email with Resend through a lightweight multilingual interface for desktop, mobile and the web.",
      featureLocalTitle: "Local-first setup",
      featureLocalDescription: "API access stays on the device with a local-first setup built for daily use.",
      featureFlowTitle: "Fast daily workflow",
      featureFlowDescription:
        "Save your key, review activity, open the inbox view and send a message in a few clicks.",
      featureGrowthTitle: "Built for growth",
      featureGrowthDescription:
        "The architecture is ready for threads, inbox workflows, attachments, filters and multiple accounts.",
      section: "Onboarding",
      title: "Connect your Resend account",
      description: "Paste a Resend API key to unlock the dashboard and start using ResendBox.",
      apiKeyLabel: "Resend API key",
      apiKeyHint: "Stored locally. No hardcoded secrets.",
      rememberTitle: "Remember on this device",
      rememberDescription: "Disable this if you prefer a session-only key.",
      securityNote: "Your API key is stored locally on this device and used only by ResendBox.",
      submit: "Save and open dashboard",
      emptyError: "Paste your Resend API key to continue.",
      adTitle: "Sponsored placement",
      adDescription: "This landing area stays reserved for a future ad slot or sponsor banner without adding noise inside the app workspace.",
    },
    topbar: {
      overview: "Overview",
      compose: "Compose",
      sent: "Sent Emails",
      inbox: "Inbox",
      settings: "Settings",
      workspace: "Workspace",
    },
    dashboard: {
      apiStatus: "API status",
      recentSends: "Recent sends",
      recentInbound: "Recent inbound",
      storedKey: "Stored key",
      defaultSender: "Default sender",
      live: "Live",
      checkKey: "Check key",
      offline: "Offline",
      missing: "Missing",
      connectedTitle: "Connected to Resend",
      unauthorizedTitle: "Authorization issue",
      offlineTitle: "Could not reach Resend",
      missingTitle: "API key required",
      healthy: "Healthy",
      attention: "Attention",
      retryNeeded: "Retry needed",
      setup: "Setup",
      emailsInLatestSync: "Emails in the latest sync",
      inboxInLatestSync: "Inbound emails in the latest sync",
      keyPersistence: "Key persistence",
      saved: "Saved",
      session: "Session",
      noActiveKey: "No active key yet.",
      ready: "Ready",
      unset: "Unset",
      configureSender: "Configure a sender",
      senderPrefill: "This address pre-fills the compose form for a faster send flow.",
      primaryFlow: "Primary flow",
      writeAndSend: "Write and send",
      composeDescription: "Jump into a focused compose surface and send a plain-text business email in seconds.",
      atGlance: "At a glance",
      mvpCoverage: "What this product already covers",
      portfolioReady: "Ready for production polish",
      nativeBridgeTitle: "Real Resend integration",
      nativeBridgeDescription:
        "Native mode uses Tauri commands. Web mode attempts a live Resend connection and never fabricates inbox or sent activity.",
      localPersistenceTitle: "Local persistence",
      localPersistenceDescription:
        "Settings, sender defaults, language and notification preferences stay local with room for stronger vault integrations later.",
      growthTitle: "Growth path built in",
      growthDescription:
        "The routing and services are already shaped for inbox, threads, attachments, filters, notifications and multiple accounts.",
      activityTitle: "Latest delivery timeline",
      activityDescription: "Review the most recent outbound activity returned by Resend.",
      noRecentActivity: "No recent activity yet. Send your first email to populate the dashboard.",
    },
    quickActions: {
      title: "Quick actions",
      description: "Keep the main business workflow one click away.",
      newEmail: "New email",
      refresh: "Refresh",
      settings: "Settings",
      openInbox: "Open inbox",
      futureTitle: "Future-ready architecture",
      futureDescription: "Inbox, threads, attachments and multi-account support already have a clean place to land.",
    },
    composePage: {
      section: "Compose",
      title: "Send a plain-text professional email",
      description: "Keep the MVP lean now. Plain-text sending with attachments ships today, while HTML and automations can extend this later.",
      from: "From",
      to: "To",
      subject: "Subject",
      content: "Content",
      fromPlaceholder: "Sales Team <hello@yourdomain.com>",
      toPlaceholder: "customer@example.com",
      subjectPlaceholder: "Your subject line",
      contentPlaceholder: "Write the plain-text body here...",
      attachments: "Attachments",
      attachmentsHint: "Add files to send with this email. Resend allows up to 40MB total after Base64 encoding.",
      attachmentsEmpty: "No attachments selected yet.",
      removeAttachment: "Remove attachment",
      attachmentsTooLarge: "The total attachments size is too large for a single email.",
      send: "Send email",
      sending: "Sending…",
      validationFill: "Fill in all fields before sending.",
      validationFrom: "The From address is invalid.",
      validationTo: "The To field must contain valid email addresses.",
      noteSection: "Send notes",
      noteTitle: "A focused MVP surface",
      noteSecurityTitle: "No secret logging",
      noteSecurityDescription: "The API key is never printed to the console and access stays centralized.",
      notePlainTextTitle: "Plain text first",
      notePlainTextDescription: "This version prioritizes simplicity. HTML templates can extend it later while attachments already work in the MVP.",
    },
    sentPage: {
      section: "Sent",
      title: "Recent outbound emails",
      searchPlaceholder: "Search by subject or recipient",
      refreshing: "Refreshing sent emails…",
      emptyTitle: "No emails sent yet",
      emptyDescription: "When you send emails from ResendBox, they appear here with subject, recipient, timestamp and status.",
      noMatchTitle: "No matching emails",
      noMatchDescription: "Try a different search term or send a new message to generate activity.",
      detailTitle: "Read the selected sent email",
      detailDescription: "Choose a sent email to inspect recipients, body content and attachment downloads.",
      detailLoading: "Loading sent email content…",
      detailEmptyTitle: "Select a sent email",
      detailEmptyDescription: "Click any sent email on the left to open its details.",
      bodyTitle: "Body",
      attachmentsTitle: "Attachments",
      noBody: "Resend did not return a text or HTML body for this email.",
      sentAtLabel: "Sent at",
      ccLabel: "Cc",
      bccLabel: "Bcc",
      replyToLabel: "Reply-To",
      scheduledAtLabel: "Scheduled at",
      downloadAttachment: "Download attachment",
    },
    inboxPage: {
      section: "Inbox",
      title: "Received emails for your inbound setup",
      searchPlaceholder: "Search by subject or sender",
      refreshing: "Refreshing inbound emails…",
      emptyTitle: "No inbound emails yet",
      emptyDescription:
        "Inbound messages appear here after you configure email receiving in Resend for one of your business domains.",
      noMatchTitle: "No matching inbound emails",
      noMatchDescription: "Try a different search term or wait for a new inbound message to arrive.",
      inboundHint: "Inbox data depends on Resend inbound/receiving being configured for your domain.",
      detailTitle: "Read the selected email",
      detailDescription: "Choose a received email to inspect the message body, routing headers and attachment metadata.",
      detailLoading: "Loading email content…",
      detailEmptyTitle: "Select an inbound email",
      detailEmptyDescription: "Click any received email on the left to open its content.",
      bodyTitle: "Body",
      attachmentsTitle: "Attachments",
      headersTitle: "Headers",
      openRaw: "Open raw email",
      noBody: "Resend did not return a text or HTML body for this email.",
      messageIdLabel: "Message ID",
      receivedAtLabel: "Received at",
      ccLabel: "Cc",
      bccLabel: "Bcc",
      replyToLabel: "Reply-To",
    },
    settingsPage: {
      apiKeySection: "API key",
      apiKeyTitle: "Manage access to Resend",
      apiKeyDescription: "Update or remove the current key without leaving the app.",
      currentKeyState: "Current key state",
      noKeySaved: "No key saved.",
      replaceKey: "Replace API key",
      rememberTitle: "Remember on this device",
      rememberDescription: "Disable it for session-only storage.",
      saveKey: "Save API key",
      savingKey: "Saving…",
      removeKey: "Remove key",
      defaultsSection: "Preferences",
      defaultsTitle: "Sender, language and appearance",
      defaultsDescription: "Keep the workflow fast and the interface consistent across desktop, mobile and web.",
      defaultSender: "Default sender",
      darkMode: "Dark mode",
      darkModeDescription: "Switch between the polished light and dark themes.",
      saveDefaults: "Save preferences",
      savingDefaults: "Saving…",
      notificationsDescription: "Enable local notifications for newly received emails and successful outbound sends.",
      languageDescription: "Switch the interface between English, Portuguese and Spanish.",
      localSection: "Local data",
      localTitle: "Reset this installation",
      localDescription: "Clear local state if you want to start over on this device.",
      localDataBody: "This removes the saved key, sender defaults, language, notification preferences and cached email data.",
      clearLocalData: "Clear local data",
      aboutSection: "About",
      aboutTitle: SITE_NAME,
      aboutDescription: "A multilingual Tauri and PWA client for professional business email workflows built on Resend.",
      aboutBodyTitle: "What ships in this MVP",
      aboutBodyDescription: "Onboarding, dashboard, inbox, sent list, compose, settings, PWA base and a real Resend bridge.",
      github: "Follow the project on GitHub",
      author: `Made by ${SITE_AUTHOR}`,
      adsenseTitle: "Monetization",
      adsenseDescription: "AdSense support is optional and only rendered when a client ID is configured at build time.",
    },
    list: {
      writeNew: "Write a new email",
      fromLabel: "From",
      toLabel: "To",
      attachments: "attachments",
      openEmail: "Open email",
    },
    notificationsCopy: {
      savedKey: "API key saved locally.",
      prefsUpdated: "Preferences updated.",
      keyRemoved: "API key removed.",
      localDataCleared: "Local data cleared.",
      emailSent: "Email sent successfully.",
      sendFailed: "Could not send the email.",
      loadFailed: "Unable to load the app.",
      browserApiFailure: "Unable to reach Resend right now. Check your connection and try again.",
      newIncomingTitle: "New inbound email",
      newIncomingBody: "A new email was received in your Resend inbound inbox.",
      sentTitle: "Email sent",
      sentBody: "Your email was accepted by Resend.",
      permissionDenied: "Notification permission was not granted.",
    },
  },
  pt: {
    meta: {
      title: `${SITE_NAME} | Operações de Email Profissional para Negócios`,
      description:
        "ResendBox é um cliente multilíngue em Tauri e PWA para Resend que ajuda negócios a enviar, acompanhar e revisar atividade de email profissional em um dashboard limpo.",
      keywords:
        "ResendBox, cliente Resend, app de email profissional, dashboard de email para negocios, operacoes de email, ferramenta PWA de email",
      headline: "Operações de email profissional para negócios modernos",
    },
    common: {
      appName: SITE_NAME,
      tagline: "Email profissional para negócios, sem complicação",
      dashboard: "Dashboard",
      compose: "Escrever",
      sent: "Enviados",
      inbox: "Recebidos",
      settings: "Configurações",
      refresh: "Atualizar",
      save: "Salvar",
      remove: "Remover",
      clear: "Limpar",
      notifications: "Notificações",
      theme: "Tema",
      language: "Idioma",
      madeBy: `Feito por ${SITE_AUTHOR}`,
      apiConnected: "API conectada",
      noData: "Sem dados",
      preparing: "Preparando o ResendBox…",
      pageNotFound: "Página não encontrada",
      backHome: "Voltar para o início",
    },
    languages: { en: "Inglês", pt: "Português", es: "Espanhol" },
    nav: {
      dashboard: "Dashboard",
      compose: "Escrever",
      sent: "Enviados",
      inbox: "Recebidos",
      settings: "Configurações",
      readyToSend: "Pronto para enviar",
      needsApiKey: "Precisa de API key",
      localWorkflowTitle: "Fluxo pensado para negócios",
      localWorkflowDescription:
        "O ResendBox mantém a operação de email profissional rápida, local e organizada para equipes que usam Resend.",
    },
    onboarding: {
      badge: "Cliente de email para negócios",
      heroTitle: "Gerencie email profissional de negócios em um workspace local bem acabado.",
      heroDescription:
        "O ResendBox ajuda negócios a operar emails profissionais com Resend em uma interface leve, multilíngue e pronta para desktop, mobile e web.",
      featureLocalTitle: "Configuração local",
      featureLocalDescription: "O acesso à API fica no dispositivo com uma base local pensada para uso diário.",
      featureFlowTitle: "Fluxo diário rápido",
      featureFlowDescription:
        "Salve a chave, acompanhe a atividade, abra os recebidos e envie uma mensagem em poucos cliques.",
      featureGrowthTitle: "Base pronta para crescer",
      featureGrowthDescription:
        "A arquitetura já está preparada para threads, inbox completo, anexos, filtros e múltiplas contas.",
      section: "Onboarding",
      title: "Conecte sua conta Resend",
      description: "Cole sua API key da Resend para liberar o dashboard e começar a usar o ResendBox.",
      apiKeyLabel: "API key da Resend",
      apiKeyHint: "Armazenada localmente. Sem secrets hardcoded.",
      rememberTitle: "Lembrar neste dispositivo",
      rememberDescription: "Desative se preferir uma chave apenas para a sessão.",
      securityNote: "Sua API key fica armazenada localmente neste dispositivo e é usada apenas pelo ResendBox.",
      submit: "Salvar e abrir dashboard",
      emptyError: "Cole sua API key da Resend para continuar.",
      adTitle: "Espaço patrocinado",
      adDescription: "Esta área da landing fica reservada para um futuro anúncio ou banner de patrocinador sem poluir o workspace interno do app.",
    },
    topbar: {
      overview: "Visão geral",
      compose: "Escrever",
      sent: "Emails enviados",
      inbox: "Recebidos",
      settings: "Configurações",
      workspace: "Workspace",
    },
    dashboard: {
      apiStatus: "Status da API",
      recentSends: "Envios recentes",
      recentInbound: "Recebidos recentes",
      storedKey: "Chave salva",
      defaultSender: "Remetente padrão",
      live: "Online",
      checkKey: "Verificar chave",
      offline: "Offline",
      missing: "Ausente",
      connectedTitle: "Conectado ao Resend",
      unauthorizedTitle: "Problema de autorização",
      offlineTitle: "Não foi possível acessar o Resend",
      missingTitle: "API key necessária",
      healthy: "Saudável",
      attention: "Atenção",
      retryNeeded: "Precisa tentar de novo",
      setup: "Configurar",
      emailsInLatestSync: "Emails no último sync",
      inboxInLatestSync: "Recebidos no último sync",
      keyPersistence: "Persistência da chave",
      saved: "Salva",
      session: "Sessão",
      noActiveKey: "Nenhuma chave ativa ainda.",
      ready: "Pronto",
      unset: "Não definido",
      configureSender: "Configure um remetente",
      senderPrefill: "Esse endereço preenche automaticamente o formulário de envio.",
      primaryFlow: "Fluxo principal",
      writeAndSend: "Escrever e enviar",
      composeDescription: "Abra a tela de escrita e envie um email profissional em texto puro em segundos.",
      atGlance: "Resumo",
      mvpCoverage: "O que este produto já cobre",
      portfolioReady: "Pronto para portfólio",
      nativeBridgeTitle: "Integração real com Resend",
      nativeBridgeDescription:
        "O modo nativo usa comandos Tauri. O modo web tenta conexão real com o Resend e nunca inventa atividade de enviados ou recebidos.",
      localPersistenceTitle: "Persistência local",
      localPersistenceDescription:
        "Configurações, remetente padrão, idioma e preferências de notificação ficam locais com espaço para cofres mais fortes no futuro.",
      growthTitle: "Base pronta para crescer",
      growthDescription:
        "Rotas e serviços já foram organizados para inbox, threads, anexos, filtros, notificações e múltiplas contas.",
      activityTitle: "Linha do tempo de entrega",
      activityDescription: "Veja a atividade de saída mais recente retornada pelo Resend.",
      noRecentActivity: "Ainda não há atividade recente. Envie o primeiro email para alimentar o dashboard.",
    },
    quickActions: {
      title: "Ações rápidas",
      description: "Mantenha o fluxo principal do negócio a um clique de distância.",
      newEmail: "Novo email",
      refresh: "Atualizar",
      settings: "Configurações",
      openInbox: "Abrir recebidos",
      futureTitle: "Arquitetura pronta para o futuro",
      futureDescription: "Inbox, threads, anexos e múltiplas contas já têm um lugar limpo para entrar.",
    },
    composePage: {
      section: "Escrever",
      title: "Envie um email profissional em texto puro",
      description: "Deixe o MVP enxuto agora. Texto puro com anexos já funciona e HTML com automações pode entrar depois.",
      from: "De",
      to: "Para",
      subject: "Assunto",
      content: "Conteúdo",
      fromPlaceholder: "Equipe Comercial <hello@seudominio.com>",
      toPlaceholder: "cliente@empresa.com",
      subjectPlaceholder: "Sua linha de assunto",
      contentPlaceholder: "Escreva aqui o corpo em texto puro...",
      attachments: "Anexos",
      attachmentsHint: "Adicione arquivos para enviar com este email. O Resend permite até 40MB no total após Base64.",
      attachmentsEmpty: "Nenhum anexo selecionado ainda.",
      removeAttachment: "Remover anexo",
      attachmentsTooLarge: "O tamanho total dos anexos é grande demais para um único email.",
      send: "Enviar email",
      sending: "Enviando…",
      validationFill: "Preencha todos os campos antes de enviar.",
      validationFrom: "O endereço do remetente é inválido.",
      validationTo: "O campo Para deve conter emails válidos.",
      noteSection: "Notas de envio",
      noteTitle: "Uma superfície de MVP focada",
      noteSecurityTitle: "Sem log de secrets",
      noteSecurityDescription: "A API key nunca é impressa no console e o acesso continua centralizado.",
      notePlainTextTitle: "Texto puro primeiro",
      notePlainTextDescription: "Esta versão prioriza simplicidade. Templates HTML podem entrar depois enquanto os anexos já funcionam no MVP.",
    },
    sentPage: {
      section: "Enviados",
      title: "Emails enviados recentemente",
      searchPlaceholder: "Buscar por assunto ou destinatário",
      refreshing: "Atualizando emails enviados…",
      emptyTitle: "Nenhum email enviado ainda",
      emptyDescription: "Quando você enviar emails pelo ResendBox, eles aparecerão aqui com assunto, destinatário, horário e status.",
      noMatchTitle: "Nenhum email encontrado",
      noMatchDescription: "Tente outro termo de busca ou envie uma nova mensagem para gerar atividade.",
      detailTitle: "Leia o email enviado selecionado",
      detailDescription: "Escolha um email enviado para ver destinatários, conteúdo e downloads dos anexos.",
      detailLoading: "Carregando conteúdo do email enviado…",
      detailEmptyTitle: "Selecione um email enviado",
      detailEmptyDescription: "Clique em qualquer email enviado na lista para abrir os detalhes.",
      bodyTitle: "Corpo",
      attachmentsTitle: "Anexos",
      noBody: "O Resend não retornou corpo em texto nem HTML para este email.",
      sentAtLabel: "Enviado em",
      ccLabel: "Cc",
      bccLabel: "Bcc",
      replyToLabel: "Responder para",
      scheduledAtLabel: "Agendado para",
      downloadAttachment: "Baixar anexo",
    },
    inboxPage: {
      section: "Recebidos",
      title: "Emails recebidos da sua configuração inbound",
      searchPlaceholder: "Buscar por assunto ou remetente",
      refreshing: "Atualizando emails recebidos…",
      emptyTitle: "Nenhum email recebido ainda",
      emptyDescription:
        "As mensagens recebidas aparecem aqui depois que você configurar o recebimento de email no Resend para um dos seus domínios.",
      noMatchTitle: "Nenhum email recebido encontrado",
      noMatchDescription: "Tente outro termo de busca ou aguarde uma nova mensagem recebida.",
      inboundHint: "Os recebidos dependem do inbound/receiving do Resend estar configurado no seu domínio.",
      detailTitle: "Leia o email selecionado",
      detailDescription: "Escolha um email recebido para ver o corpo da mensagem, headers de roteamento e metadados dos anexos.",
      detailLoading: "Carregando conteúdo do email…",
      detailEmptyTitle: "Selecione um email recebido",
      detailEmptyDescription: "Clique em qualquer email da lista para abrir o conteúdo.",
      bodyTitle: "Corpo",
      attachmentsTitle: "Anexos",
      headersTitle: "Headers",
      openRaw: "Abrir email bruto",
      noBody: "O Resend não retornou corpo em texto nem HTML para este email.",
      messageIdLabel: "Message ID",
      receivedAtLabel: "Recebido em",
      ccLabel: "Cc",
      bccLabel: "Bcc",
      replyToLabel: "Responder para",
    },
    settingsPage: {
      apiKeySection: "API key",
      apiKeyTitle: "Gerencie o acesso ao Resend",
      apiKeyDescription: "Atualize ou remova a chave atual sem sair do app.",
      currentKeyState: "Estado atual da chave",
      noKeySaved: "Nenhuma chave salva.",
      replaceKey: "Substituir API key",
      rememberTitle: "Lembrar neste dispositivo",
      rememberDescription: "Desative para armazenamento apenas na sessão.",
      saveKey: "Salvar API key",
      savingKey: "Salvando…",
      removeKey: "Remover chave",
      defaultsSection: "Preferências",
      defaultsTitle: "Remetente, idioma e aparência",
      defaultsDescription: "Mantenha o fluxo rápido e a interface consistente no desktop, mobile e web.",
      defaultSender: "Remetente padrão",
      darkMode: "Modo escuro",
      darkModeDescription: "Alterne entre os temas claro e escuro com acabamento premium.",
      saveDefaults: "Salvar preferências",
      savingDefaults: "Salvando…",
      notificationsDescription: "Ative notificações locais para novos emails recebidos e envios bem-sucedidos.",
      languageDescription: "Troque a interface entre inglês, português e espanhol.",
      localSection: "Dados locais",
      localTitle: "Resetar esta instalação",
      localDescription: "Limpe o estado local se quiser começar de novo neste dispositivo.",
      localDataBody: "Isso remove a chave salva, remetente padrão, idioma, notificações e o cache local de emails.",
      clearLocalData: "Limpar dados locais",
      aboutSection: "Sobre",
      aboutTitle: SITE_NAME,
      aboutDescription: "Um cliente multilíngue em Tauri e PWA para fluxos de email profissional com Resend.",
      aboutBodyTitle: "O que já existe neste MVP",
      aboutBodyDescription: "Onboarding, dashboard, recebidos, enviados, compose, configurações, base PWA e bridge real com Resend.",
      github: "Seguir o projeto no GitHub",
      author: `Feito por ${SITE_AUTHOR}`,
      adsenseTitle: "Monetização",
      adsenseDescription: "O suporte a AdSense é opcional e só aparece quando um client ID é configurado no build.",
    },
    list: {
      writeNew: "Escrever novo email",
      fromLabel: "De",
      toLabel: "Para",
      attachments: "anexos",
      openEmail: "Abrir email",
    },
    notificationsCopy: {
      savedKey: "API key salva localmente.",
      prefsUpdated: "Preferências atualizadas.",
      keyRemoved: "API key removida.",
      localDataCleared: "Dados locais limpos.",
      emailSent: "Email enviado com sucesso.",
      sendFailed: "Não foi possível enviar o email.",
      loadFailed: "Não foi possível carregar o app.",
      browserApiFailure: "Não foi possível acessar o Resend agora. Verifique sua conexão e tente novamente.",
      newIncomingTitle: "Novo email recebido",
      newIncomingBody: "Um novo email chegou na caixa inbound do Resend.",
      sentTitle: "Email enviado",
      sentBody: "Seu email foi aceito pelo Resend.",
      permissionDenied: "A permissão de notificação não foi concedida.",
    },
  },
  es: {
    meta: {
      title: `${SITE_NAME} | Operaciones de Email Profesional para Negocios`,
      description:
        "ResendBox es un cliente multilingüe en Tauri y PWA para Resend que ayuda a negocios a enviar, revisar y acompañar actividad de correo profesional desde un panel limpio.",
      keywords:
        "ResendBox, cliente Resend, app de correo profesional, panel de email para negocios, operaciones de correo, herramienta PWA de email",
      headline: "Operaciones de correo profesional para negocios modernos",
    },
    common: {
      appName: SITE_NAME,
      tagline: "Correo profesional para negocios, sin fricción",
      dashboard: "Panel",
      compose: "Redactar",
      sent: "Enviados",
      inbox: "Recibidos",
      settings: "Configuración",
      refresh: "Actualizar",
      save: "Guardar",
      remove: "Eliminar",
      clear: "Limpiar",
      notifications: "Notificaciones",
      theme: "Tema",
      language: "Idioma",
      madeBy: `Hecho por ${SITE_AUTHOR}`,
      apiConnected: "API conectada",
      noData: "Sin datos",
      preparing: "Preparando ResendBox…",
      pageNotFound: "Página no encontrada",
      backHome: "Volver al inicio",
    },
    languages: { en: "Inglés", pt: "Portugués", es: "Español" },
    nav: {
      dashboard: "Panel",
      compose: "Redactar",
      sent: "Enviados",
      inbox: "Recibidos",
      settings: "Configuración",
      readyToSend: "Listo para enviar",
      needsApiKey: "Necesita API key",
      localWorkflowTitle: "Flujo pensado para negocios",
      localWorkflowDescription:
        "ResendBox mantiene la operación de correo profesional rápida, local y limpia para equipos que usan Resend.",
    },
    onboarding: {
      badge: "Cliente de correo para negocios",
      heroTitle: "Opera correo profesional de negocio desde un solo workspace local bien acabado.",
      heroDescription:
        "ResendBox ayuda a negocios a operar correo profesional con Resend desde una interfaz ligera, multilingüe y lista para desktop, móvil y web.",
      featureLocalTitle: "Configuración local",
      featureLocalDescription: "El acceso a la API permanece en el dispositivo con una base local pensada para uso diario.",
      featureFlowTitle: "Flujo diario rápido",
      featureFlowDescription:
        "Guarda la clave, revisa actividad, abre recibidos y envía un mensaje en pocos clics.",
      featureGrowthTitle: "Base lista para crecer",
      featureGrowthDescription:
        "La arquitectura ya está preparada para hilos, inbox completo, adjuntos, filtros y múltiples cuentas.",
      section: "Onboarding",
      title: "Conecta tu cuenta de Resend",
      description: "Pega tu API key de Resend para desbloquear el panel y empezar a usar ResendBox.",
      apiKeyLabel: "API key de Resend",
      apiKeyHint: "Guardada localmente. Sin secretos hardcodeados.",
      rememberTitle: "Recordar en este dispositivo",
      rememberDescription: "Desactívalo si prefieres una clave solo de sesión.",
      securityNote: "Tu API key queda almacenada localmente en este dispositivo y solo la usa ResendBox.",
      submit: "Guardar y abrir panel",
      emptyError: "Pega tu API key de Resend para continuar.",
      adTitle: "Espacio patrocinado",
      adDescription: "Esta área de la landing queda reservada para un futuro anuncio o banner patrocinado sin ensuciar el workspace interno de la app.",
    },
    topbar: {
      overview: "Resumen",
      compose: "Redactar",
      sent: "Emails enviados",
      inbox: "Recibidos",
      settings: "Configuración",
      workspace: "Workspace",
    },
    dashboard: {
      apiStatus: "Estado de la API",
      recentSends: "Envíos recientes",
      recentInbound: "Recibidos recientes",
      storedKey: "Clave guardada",
      defaultSender: "Remitente predeterminado",
      live: "Activo",
      checkKey: "Revisar clave",
      offline: "Sin conexión",
      missing: "Falta",
      connectedTitle: "Conectado a Resend",
      unauthorizedTitle: "Problema de autorización",
      offlineTitle: "No se pudo alcanzar Resend",
      missingTitle: "API key necesaria",
      healthy: "Saludable",
      attention: "Atención",
      retryNeeded: "Reintentar",
      setup: "Configurar",
      emailsInLatestSync: "Emails en la última sincronización",
      inboxInLatestSync: "Recibidos en la última sincronización",
      keyPersistence: "Persistencia de la clave",
      saved: "Guardada",
      session: "Sesión",
      noActiveKey: "Aún no hay clave activa.",
      ready: "Listo",
      unset: "Sin definir",
      configureSender: "Configura un remitente",
      senderPrefill: "Esta dirección completa el formulario de redacción para acelerar el flujo.",
      primaryFlow: "Flujo principal",
      writeAndSend: "Redactar y enviar",
      composeDescription: "Abre una superficie enfocada y envía un correo profesional de texto plano en segundos.",
      atGlance: "Vista rápida",
      mvpCoverage: "Lo que este producto ya cubre",
      portfolioReady: "Listo para portafolio",
      nativeBridgeTitle: "Integración real con Resend",
      nativeBridgeDescription:
        "El modo nativo usa comandos de Tauri. El modo web intenta una conexión real con Resend y nunca inventa actividad de enviados o recibidos.",
      localPersistenceTitle: "Persistencia local",
      localPersistenceDescription:
        "Configuración, remitente predeterminado, idioma y preferencias de notificación permanecen locales con espacio para bóvedas más fuertes después.",
      growthTitle: "Base lista para crecer",
      growthDescription:
        "Las rutas y servicios ya están organizados para inbox, hilos, adjuntos, filtros, notificaciones y múltiples cuentas.",
      activityTitle: "Línea de tiempo de entrega",
      activityDescription: "Revisa la actividad de salida más reciente devuelta por Resend.",
      noRecentActivity: "Todavía no hay actividad reciente. Envía el primer correo para poblar el panel.",
    },
    quickActions: {
      title: "Acciones rápidas",
      description: "Mantén el flujo principal del negocio a un clic.",
      newEmail: "Nuevo email",
      refresh: "Actualizar",
      settings: "Configuración",
      openInbox: "Abrir recibidos",
      futureTitle: "Arquitectura lista para el futuro",
      futureDescription: "Inbox, hilos, adjuntos y múltiples cuentas ya tienen un lugar limpio para entrar.",
    },
    composePage: {
      section: "Redactar",
      title: "Envía un email profesional en texto plano",
      description: "Mantén el MVP liviano ahora. Texto plano con adjuntos ya funciona y HTML con automatizaciones puede llegar después.",
      from: "De",
      to: "Para",
      subject: "Asunto",
      content: "Contenido",
      fromPlaceholder: "Equipo Comercial <hello@tudominio.com>",
      toPlaceholder: "cliente@empresa.com",
      subjectPlaceholder: "Tu línea de asunto",
      contentPlaceholder: "Escribe aquí el cuerpo en texto plano...",
      attachments: "Adjuntos",
      attachmentsHint: "Añade archivos para enviar con este email. Resend permite hasta 40MB en total después de Base64.",
      attachmentsEmpty: "Todavía no hay adjuntos seleccionados.",
      removeAttachment: "Eliminar adjunto",
      attachmentsTooLarge: "El tamaño total de los adjuntos es demasiado grande para un solo email.",
      send: "Enviar email",
      sending: "Enviando…",
      validationFill: "Completa todos los campos antes de enviar.",
      validationFrom: "La dirección del remitente no es válida.",
      validationTo: "El campo Para debe contener correos válidos.",
      noteSection: "Notas de envío",
      noteTitle: "Una superficie de MVP enfocada",
      noteSecurityTitle: "Sin registro de secretos",
      noteSecurityDescription: "La API key nunca se imprime en la consola y el acceso permanece centralizado.",
      notePlainTextTitle: "Texto plano primero",
      notePlainTextDescription: "Esta versión prioriza simplicidad. Las plantillas HTML pueden llegar después mientras los adjuntos ya funcionan en el MVP.",
    },
    sentPage: {
      section: "Enviados",
      title: "Emails enviados recientemente",
      searchPlaceholder: "Buscar por asunto o destinatario",
      refreshing: "Actualizando emails enviados…",
      emptyTitle: "Todavía no hay emails enviados",
      emptyDescription: "Cuando envíes emails desde ResendBox, aparecerán aquí con asunto, destinatario, fecha y estado.",
      noMatchTitle: "No hay emails coincidentes",
      noMatchDescription: "Prueba otro término de búsqueda o envía un nuevo mensaje para generar actividad.",
      detailTitle: "Lee el email enviado seleccionado",
      detailDescription: "Elige un email enviado para ver destinatarios, contenido y descargas de adjuntos.",
      detailLoading: "Cargando contenido del email enviado…",
      detailEmptyTitle: "Selecciona un email enviado",
      detailEmptyDescription: "Haz clic en cualquier email enviado de la lista para abrir sus detalles.",
      bodyTitle: "Cuerpo",
      attachmentsTitle: "Adjuntos",
      noBody: "Resend no devolvió cuerpo en texto ni HTML para este email.",
      sentAtLabel: "Enviado el",
      ccLabel: "Cc",
      bccLabel: "Bcc",
      replyToLabel: "Responder a",
      scheduledAtLabel: "Programado para",
      downloadAttachment: "Descargar adjunto",
    },
    inboxPage: {
      section: "Recibidos",
      title: "Emails recibidos de tu configuración inbound",
      searchPlaceholder: "Buscar por asunto o remitente",
      refreshing: "Actualizando emails recibidos…",
      emptyTitle: "Todavía no hay emails recibidos",
      emptyDescription:
        "Los mensajes recibidos aparecerán aquí después de configurar recepción de correo en Resend para uno de tus dominios.",
      noMatchTitle: "No hay emails recibidos coincidentes",
      noMatchDescription: "Prueba otro término de búsqueda o espera un nuevo mensaje recibido.",
      inboundHint: "Los recibidos dependen de que inbound/receiving de Resend esté configurado en tu dominio.",
      detailTitle: "Lee el email seleccionado",
      detailDescription: "Elige un email recibido para ver el cuerpo, los headers de enrutamiento y los metadatos de adjuntos.",
      detailLoading: "Cargando contenido del email…",
      detailEmptyTitle: "Selecciona un email recibido",
      detailEmptyDescription: "Haz clic en cualquier email de la lista para abrir su contenido.",
      bodyTitle: "Cuerpo",
      attachmentsTitle: "Adjuntos",
      headersTitle: "Headers",
      openRaw: "Abrir email raw",
      noBody: "Resend no devolvió cuerpo en texto ni HTML para este email.",
      messageIdLabel: "Message ID",
      receivedAtLabel: "Recibido el",
      ccLabel: "Cc",
      bccLabel: "Bcc",
      replyToLabel: "Responder a",
    },
    settingsPage: {
      apiKeySection: "API key",
      apiKeyTitle: "Gestiona el acceso a Resend",
      apiKeyDescription: "Actualiza o elimina la clave actual sin salir de la app.",
      currentKeyState: "Estado actual de la clave",
      noKeySaved: "No hay clave guardada.",
      replaceKey: "Reemplazar API key",
      rememberTitle: "Recordar en este dispositivo",
      rememberDescription: "Desactívalo para almacenamiento solo de sesión.",
      saveKey: "Guardar API key",
      savingKey: "Guardando…",
      removeKey: "Eliminar clave",
      defaultsSection: "Preferencias",
      defaultsTitle: "Remitente, idioma y apariencia",
      defaultsDescription: "Mantén el flujo rápido y la interfaz consistente en desktop, móvil y web.",
      defaultSender: "Remitente predeterminado",
      darkMode: "Modo oscuro",
      darkModeDescription: "Alterna entre los temas claro y oscuro con un acabado premium.",
      saveDefaults: "Guardar preferencias",
      savingDefaults: "Guardando…",
      notificationsDescription: "Activa notificaciones locales para nuevos emails recibidos y envíos exitosos.",
      languageDescription: "Cambia la interfaz entre inglés, portugués y español.",
      localSection: "Datos locales",
      localTitle: "Reiniciar esta instalación",
      localDescription: "Limpia el estado local si quieres empezar desde cero en este dispositivo.",
      localDataBody: "Esto elimina la clave guardada, remitente predeterminado, idioma, notificaciones y el caché local de emails.",
      clearLocalData: "Limpiar datos locales",
      aboutSection: "Acerca de",
      aboutTitle: SITE_NAME,
      aboutDescription: "Un cliente multilingüe en Tauri y PWA para flujos de correo profesional con Resend.",
      aboutBodyTitle: "Lo que ya incluye este MVP",
      aboutBodyDescription: "Onboarding, panel, recibidos, enviados, compose, configuración, base PWA y bridge real con Resend.",
      github: "Seguir el proyecto en GitHub",
      author: `Hecho por ${SITE_AUTHOR}`,
      adsenseTitle: "Monetización",
      adsenseDescription: "El soporte para AdSense es opcional y solo aparece cuando un client ID está configurado en el build.",
    },
    list: {
      writeNew: "Redactar nuevo email",
      fromLabel: "De",
      toLabel: "Para",
      attachments: "adjuntos",
      openEmail: "Abrir email",
    },
    notificationsCopy: {
      savedKey: "API key guardada localmente.",
      prefsUpdated: "Preferencias actualizadas.",
      keyRemoved: "API key eliminada.",
      localDataCleared: "Datos locales limpiados.",
      emailSent: "Email enviado con éxito.",
      sendFailed: "No se pudo enviar el email.",
      loadFailed: "No se pudo cargar la app.",
      browserApiFailure: "No se pudo acceder a Resend ahora. Revisa tu conexión y vuelve a intentarlo.",
      newIncomingTitle: "Nuevo email recibido",
      newIncomingBody: "Llegó un nuevo email a tu inbox inbound de Resend.",
      sentTitle: "Email enviado",
      sentBody: "Tu email fue aceptado por Resend.",
      permissionDenied: "No se concedió el permiso de notificaciones.",
    },
  },
};

export function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "en" as const;
  }

  const language = navigator.language.toLowerCase();

  if (language.startsWith("pt")) {
    return "pt" as const;
  }

  if (language.startsWith("es")) {
    return "es" as const;
  }

  return "en" as const;
}
