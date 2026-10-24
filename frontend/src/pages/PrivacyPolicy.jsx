const sections = [
  {
    title: "Information we collect",
    paragraphs: [
      "When you create or use an account, we collect the name and email address you provide, together with your password. We also process one-time verification codes sent to your email to confirm sign-up and sign-in.",
      "Notes and related details that you create, including titles, descriptions, dates, and completion status, are stored so you can use and manage them in the service.",
      "The web version stores an authentication token and some account details in your browser's local storage to keep you signed in and display your profile. Your browser or device may also provide basic technical information to the service's hosting provider.",
    ],
  },
  {
    title: "How we use information",
    paragraphs: [
      "We use account information to create and secure your account, verify your email address, authenticate sign-ins, provide your notes, and respond to requests you send us. We use verification codes only for account verification and sign-in.",
      "We do not use your notes or account details for advertising. We do not sell your personal information.",
    ],
  },
  {
    title: "Where information is processed",
    paragraphs: [
      "Information is processed by the service and its infrastructure providers, such as the database, hosting, and email providers needed to operate the service. These providers process information on the service's behalf to provide their services.",
      "Information may be processed in countries other than the one where you live. Where required, appropriate safeguards should be used for international transfers.",
    ],
  },
  {
    title: "Retention and security",
    paragraphs: [
      "We keep account and note information while your account is active or as needed to provide the service. You may request account or data deletion using the contact details published with the service. Some information may remain for a limited time in backups or where retention is required by law.",
      "Passwords for newly registered accounts are hashed before being stored. We use reasonable measures to protect information, but no online service or storage method can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "Your choices and rights",
    paragraphs: [
      "You can review the name and email address associated with your profile and choose what notes you create. You can sign out to remove the active session from the web app. Clearing browser local storage also removes locally stored sign-in details, but does not delete account or note data held by the service.",
      "Depending on where you live, you may have rights to access, correct, export, restrict, or delete your personal information. To make a request, contact the service operator using the contact details published with the app or website.",
    ],
  },
  {
    title: "Children's privacy",
    paragraphs: [
      "The service is not intended for children who are not permitted to use it under the laws that apply to them. If you believe a child has provided personal information, contact the service operator using the published contact details.",
    ],
  },
  {
    title: "Web and mobile applications",
    paragraphs: [
      "This policy applies to Notes Web and any companion Notes mobile application operated by the same service. The mobile app may store or process information differently depending on its platform; any additional collection or permissions will be explained in the app when relevant.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "We may update this policy as the service changes. The revised version will be posted here with a new effective date. For privacy questions or requests, contact the service operator using the contact information published with the website or app.",
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <main className="w-full max-w-4xl px-1 pb-12 pt-4 text-[#1C1B1F] sm:px-4">
      <article className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur-sm sm:p-10">
        <header className="mb-8 border-b border-[#1C1B1F]/10 pb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9A6420]">
            Notes Web and App
          </p>
          <h1 className="prata-regular text-3xl sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray-600">
            Effective date: October 24, 2026
          </p>
          <p className="mt-4 leading-7 text-gray-700">
            This policy explains how Notes Web and any companion mobile
            application collect, use, and protect information when you use the
            service.
          </p>
        </header>

        <div className="space-y-7">
          {sections.map(({ title, paragraphs }) => (
            <section key={title} aria-labelledby={title}>
              <h2
                id={title}
                className="mb-2 text-lg font-semibold text-[#1C1B1F]"
              >
                {title}
              </h2>
              <div className="space-y-3 text-sm leading-7 text-gray-700 sm:text-base">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
};

export default PrivacyPolicy;
