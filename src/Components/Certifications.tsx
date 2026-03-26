import Image from "next/image";
import Link from "next/link";
import styles from "../styles/page.module.css";

type Cert = {
  id: string;
  name: string;
  issuer: string;
  href: string;
  image: string;
};

const certifications: Cert[] = [
  {
    id: "eeda",
    name: "Enterprise Defense Administrator",
    issuer: "INE",
    href: "https://certs.ine.com/9e7d3e29-bcbf-45f3-8830-091ee2efb008#acc.oxJpmOgr",
    image: "/eeda2.webp",
  },
  {
    id: "aws-cloud-foundations",
    name: "AWS Academy Graduate  Cloud Foundations",
    issuer: "AWS Academy",
    href: "https://www.credly.com/badges/7a149ccf-12b4-4c87-b675-5eceaa176df4/linked_in_profile",
    image: "/aws_cf.webp",
  },
  {
    id: "aws-cloud-developing",
    name: "AWS Academy Graduate  Cloud Developing",
    issuer: "AWS Academy",
    href: "https://www.credly.com/badges/e569e822-8049-45c7-b463-7d893fa32424/linked_in_profile",
    image: "/aws_cd.webp",
  },
  {
    id: "aws-genai",
    name: "AWS Academy Graduate  Generative AI Foundations",
    issuer: "AWS Academy",
    href: "https://www.credly.com/badges/255409bc-fe97-473d-93c4-e0f6b25f6225/linked_in_profile",
    image: "/aws_genaif.webp",
  },
  {
    id: "aws-ml",
    name: "AWS Academy Graduate  Machine Learning Foundations",
    issuer: "AWS Academy",
    href: "https://www.credly.com/badges/af9eaf91-aa8c-47c1-8e13-7f89cc1b118e/linked_in_profile",
    image: "/aws_mlf.webp",
  },
];

export default function Certifications() {
  return (
    <section
      className={`${styles.section} ${styles.certsShowcase}`}
      id="certifications"
    >
      <div className={styles.sectionHeader}>
        <p className={styles.kicker}>Certifications</p>
        <h2>Credentials &amp; Continuing Education</h2>
        <p className={styles.sectionLead}>
          Verified credentials spanning cybersecurity, cloud infrastructure, and
          applied AI.
        </p>
      </div>
      <div className={styles.certGrid}>
        {certifications.map((cert) => (
          <Link
            key={cert.id}
            href={cert.href}
            target="_blank"
            rel="noreferrer"
            className={styles.certCard}
          >
            <div className={styles.certBadgeWrap}>
              <Image
                src={cert.image}
                alt={cert.name}
                width={120}
                height={120}
                className={styles.certBadge}
              />
            </div>
            <div className={styles.certInfo}>
              <p className={styles.certName}>{cert.name}</p>
              <p className={styles.certIssuer}>{cert.issuer}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
