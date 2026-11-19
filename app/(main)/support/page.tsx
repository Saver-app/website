import { ContactForm } from "@/components/contact_form/contact_form";
import { Section } from "@/components/section/section";
import styles from "./support.module.css";

export default function SupportPage() {
  return (
    <main className={styles.main}>
      <Section paddingTop={64} paddingBottom={140}>
        <div className={styles.intro}>
          <h1>Contact Saver Support</h1>
          <p className={styles.subtitle}>
            For help with the app, your account, or a subscription, tell us which
            device you use and what happened. Saver Support will reply by email.
          </p>
          <p className={styles.subtitle}>
            For setup instructions, visit the <a href="https://docs.saver-app.com/getting-started">getting started guide</a>.
            For a billing issue, include the store where you subscribed.
          </p>
        </div>

        <ContactForm />
      </Section>
    </main>
  );
}
