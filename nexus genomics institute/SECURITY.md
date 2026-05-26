# 🛡️ Security Policy: SECURITY.md

## 1. Supported Versions
We actively support and apply security patches to the following versions of the **Nexus Genomics Institute** platform:

| Version | Supported |
| :--- | :--- |
| **v1.x** | Yes (Active) |
| **v0.x (Alpha/Beta)** | No (Deprecated) |

---

## 2. Reporting a Vulnerability
If you discover a security vulnerability (such as bypassed auth gates, data leakage, or injection issues), please **do not open a public GitHub issue**. Instead, report it privately to ensure candidate information is protected:

* **Contact**: Send a detailed email to the project lead, **Bushra Khan**.
* **Timeline**: We will acknowledge receipt of your report within 48 hours and provide an estimated resolution window.

---

## 3. Core Security Rules & Practices
- **Row Level Security (RLS)**: Public read/write endpoints are strictly isolated. Ensure Supabase database policies remain active on all schemas.
- **Environment Secrets**: Never commit sensitive Supabase service role keys, admin logins, or passwords to git. Use local `.env.local` files.
- **Secure File Validation**: The application portal rejects files that do not match permitted PDF mime types, protecting the serverless storage bucket from malicious code execution.
