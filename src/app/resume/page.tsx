import styles from "../../styles/resume.module.css";

const RESUME_PDF = "/Bradley_Charles_General_Resume.pdf";

export default function ResumePage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Bradley Charles</p>
          <h1 className={styles.title}>Resume</h1>
        </div>
        <a
          href={RESUME_PDF}
          download
          className={styles.downloadLink}
        >
          Download PDF ↓
        </a>
      </div>

      <div className={styles.viewerFrame}>
        <object
          data={RESUME_PDF}
          type="application/pdf"
          className={styles.viewer}
          aria-label="Bradley Charles resume PDF"
        >
          <div className={styles.fallback}>
            <p>Your browser can&apos;t preview PDFs inline.</p>
            <a href={RESUME_PDF} download className={styles.downloadLink}>
              Download PDF ↓
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
