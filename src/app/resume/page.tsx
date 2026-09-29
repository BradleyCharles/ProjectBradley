import Contact from "@/Components/Contact";
import styles from "../../styles/resume.module.css";

const RESUME_PDF = "/Bradley_Charles_General_Resume.pdf";
const RESUME_PDF_VIEW = `${RESUME_PDF}#navpanes=0`;

export default function ResumePage() {
  return (
    <div className={styles.page}>
      <div className={styles.viewerFrame}>
        <object
          data={RESUME_PDF_VIEW}
          type="application/pdf"
          className={styles.viewer}
          aria-label="Bradley Charles resume PDF"
        >
          <div className={styles.fallback}>
            <p>Your browser can&apos;t preview PDFs inline.</p>
            <a href={RESUME_PDF} download className={styles.fallbackLink}>
              Download PDF ↓
            </a>
          </div>
        </object>
      </div>

      <Contact />
    </div>
  );
}
